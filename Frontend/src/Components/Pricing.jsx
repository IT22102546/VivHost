import { useState } from "react";
import { useSelector } from "react-redux";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// Set modal root for accessibility
Modal.setAppElement("#root");

// Add these styles (you can put them in your CSS file instead)
const customStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    position: "relative",
    inset: "auto",
    maxHeight: "90vh",
    margin: "0 auto",
    padding: "0",
    border: "none",
    borderRadius: "0.5rem",
    overflow: "hidden",
  },
};

const PricingTable = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [paymentType, setPaymentType] = useState("full");
  const [installmentAmount, setInstallmentAmount] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  const packages = [
    {
      name: "Basic Plan",
      price: "LKR 0",
      features: [
        "Member ID",
        "Name",
        "Age",
        "Occupation",
        "Country & Religion",
      ],
      isDefault: true,
    },
    {
      name: "Premium Plan",
      price: "LKR 30000",
      features: [
        "Basic Details",
        "View Chart",
        "Lifestyle",
        "Partially Family Details",
      ],
      duration: "1.5 Years",
    },
    {
      name: "Ultimate Plan",
      price: "LKR 120000",
      features: [
        "Basic Details",
        "View Chart",
        "Full Family Details",
        "View Photos",
        "Full Access",
      ],
      duration: "Unlimited",
    },
  ];

  const validateForm = () => {
    const errors = {};

    if (!selectedPackage) {
      errors.package = "Please select a package";
    }

    if (!imageFile) {
      errors.receipt = "Payment receipt is required";
    }

    if (!agreeToTerms) {
      errors.terms = "You must agree to the terms";
    }

    if (paymentType === "installment") {
      if (!installmentAmount) {
        errors.installment = "Installment amount is required";
      } else if (isNaN(installmentAmount) || parseInt(installmentAmount) <= 0) {
        errors.installment = "Please enter a valid amount";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isCurrentPlan = (packageName) => {
    return currentUser?.package_plan === packageName || currentUser?.user?.package_plan === packageName;
  };

  const packagesWithStatus = packages.map((pkg) => ({
    ...pkg,
    isCurrentPlan: isCurrentPlan(pkg.name),
    buttonText: isCurrentPlan(pkg.name)
      ? "Current Plan"
      : pkg.isDefault
      ? "Default Plan"
      : "Upgrade",
    canUpgrade: !pkg.isDefault && !isCurrentPlan(pkg.name),
  }));

  const termsAndConditions = [
    "All payments are non-refundable once processed.",
    "Package upgrades are subject to admin approval.",
    "Premium Plan duration is 18 months from the date of approval.",
    "Ultimate Plan provides unlimited access until further notice.",
    "You agree to provide valid payment receipts for verification.",
    "The admin reserves the right to reject incomplete or suspicious submissions.",
    "Package benefits will be activated within 24-48 hours after approval.",
  ];

  const openModal = (packageName) => {
    if (!currentUser) {
      toast.info("Please login to upgrade your plan");
      navigate("/sign-in");
      return;
    }

    if (isCurrentPlan(packageName)) {
      toast.info(`You're currently using the ${packageName}`);
      return;
    }
    
    setSelectedPackage(packageName);
    setImageFile(null);
    setAgreeToTerms(false);
    setPaymentType("full");
    setInstallmentAmount("");
    setValidationErrors({});
    setIsModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match("image.*")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setImageFile(file);
    setValidationErrors({ ...validationErrors, receipt: null });
  };

  const calculateExpirationDate = (months) => {
    const date = new Date();
    date.setMonth(date.getMonth() + months);
    return date.toISOString().split("T")[0];
  };

  const submitPackageRequest = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      let packageDetails = {};
      switch (selectedPackage) {
        case "Premium Plan":
          packageDetails = {
            amount: 30000,
            duration: "1.5 years",
            exp_date: calculateExpirationDate(18),
          };
          break;
        case "Ultimate Plan":
          packageDetails = {
            amount: 120000,
            duration: "unlimited",
            exp_date: null,
          };
          break;
        default:
          throw new Error("Invalid package selection");
      }

      const installAmount =
        paymentType === "installment" ? parseInt(installmentAmount) : 0;
      const balance =
        paymentType === "installment"
          ? packageDetails.amount - installAmount
          : 0;

      const formData = new FormData();
      formData.append("customer_id", currentUser?.id || currentUser?.user?.id);
      formData.append("package", selectedPackage);
      formData.append("pay_type", paymentType);
      formData.append("amount", packageDetails.amount.toString());
      formData.append("install_amount", installAmount.toString());
      formData.append("balance", balance.toString());
      formData.append("income", packageDetails.amount.toString());
      formData.append("exp_date", packageDetails.exp_date || "");
      formData.append("recipt_img", imageFile);

      const response = await fetch(`/api/user/booked-packages`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Submission failed");
      }

      toast.success("Package upgrade request submitted successfully!");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderImagePreview = () => {
    if (!imageFile) {
      return (
        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="mt-2 text-sm text-gray-600">
            Click to upload payment receipt
          </p>
          <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
        </div>
      );
    }

    return (
      <div className="relative group">
        <img
          src={URL.createObjectURL(imageFile)}
          alt="Payment receipt"
          className="w-full h-48 object-contain rounded-lg border"
        />
        <button
          type="button"
          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            setImageFile(null);
          }}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    );
  };

  return (
    <div className="bg-gray-900 py-12 px-4 sm:px-6 lg:px-10 relative">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-5xl font-semibold font-Sacremento text-white tracking-tight text-center">
          Our Pricing
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          {packagesWithStatus.map((pkg, index) => (
            <div
              key={index}
              className={`bg-transparent border rounded-lg shadow-lg p-6 flex flex-col ${
                pkg.isCurrentPlan ? "border-orange-500" : "border-white"
              }`}
            >
              {pkg.isCurrentPlan && (
                <div className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full self-start mb-2">
                  CURRENT PLAN
                </div>
              )}
              <h3 className="text-xl font-semibold text-white mb-4">
                {pkg.name}
              </h3>
              <p className="text-2xl font-bold text-white mb-6">{pkg.price}</p>
              {pkg.duration && (
                <p className="text-gray-300 mb-4">Duration: {pkg.duration}</p>
              )}
              <ul className="space-y-2 mb-8">
                {pkg.features.map((feature, i) => (
                  <li key={i} className="text-gray-300">
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                className={`mt-auto py-2 px-4 rounded-md font-semibold ${
                  pkg.isCurrentPlan
                    ? "bg-gray-500 cursor-not-allowed"
                    : pkg.isDefault
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600"
                } text-white`}
                onClick={() => openModal(pkg.name)}
                disabled={pkg.isCurrentPlan || pkg.isDefault}
              >
                {pkg.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => !isSubmitting && setIsModalOpen(false)}
        style={customStyles}
        contentLabel="Package Upgrade Modal"
        ariaHideApp={false}
      >
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-[#8D1C21]">
              Upgrade to {selectedPackage}
            </h2>
            <button
              onClick={() => !isSubmitting && setIsModalOpen(false)}
              disabled={isSubmitting}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-2">
              Payment Receipt *
            </label>
            <input
              type="file"
              id="receipt-upload"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <label htmlFor="receipt-upload" className="cursor-pointer">
              {renderImagePreview()}
            </label>
            {validationErrors.receipt && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors.receipt}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-2">Payment Type *</label>
            <div className="flex space-x-4 mb-2">
              <button
                type="button"
                className={`px-4 py-2 rounded-lg transition-colors ${
                  paymentType === "full"
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
                onClick={() => setPaymentType("full")}
              >
                Full Payment
              </button>
              <button
                type="button"
                className={`px-4 py-2 rounded-lg transition-colors ${
                  paymentType === "installment"
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
                onClick={() => setPaymentType("installment")}
              >
                Installment
              </button>
            </div>
            {paymentType === "installment" && (
              <div>
                <input
                  type="number"
                  className={`border p-2 w-full rounded ${
                    validationErrors.installment ? "border-red-500" : ""
                  }`}
                  placeholder="Enter installment amount"
                  value={installmentAmount}
                  onChange={(e) => {
                    setInstallmentAmount(e.target.value);
                    setValidationErrors({
                      ...validationErrors,
                      installment: null,
                    });
                  }}
                />
                {validationErrors.installment && (
                  <p className="text-red-500 text-sm mt-1">
                    {validationErrors.installment}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-2">
              Terms & Conditions
            </label>
            <ul className="text-sm list-disc pl-5 mb-3 max-h-40 overflow-y-auto">
              {termsAndConditions.map((term, i) => (
                <li key={i} className="mb-1">
                  {term}
                </li>
              ))}
            </ul>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="agree-terms"
                checked={agreeToTerms}
                onChange={() => {
                  setAgreeToTerms(!agreeToTerms);
                  setValidationErrors({ ...validationErrors, terms: null });
                }}
                className="mr-2"
              />
              <label htmlFor="agree-terms" className="text-sm">
                I agree to the terms and conditions *
              </label>
            </div>
            {validationErrors.terms && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors.terms}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="button"
              className={`px-4 py-2 rounded-lg text-white transition-colors ${
                isSubmitting ? "bg-gray-400" : "bg-[#8D1C21] hover:bg-[#6e1519]"
              }`}
              onClick={submitPackageRequest}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Submit Request"
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PricingTable;