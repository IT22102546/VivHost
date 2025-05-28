import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  MapPin,
  Cake,
  Ruler,
  Palette,
  Home,
  Heart,
  Utensils,
  Wine,
  BookOpen,
  Ribbon,
  GraduationCap,
  Briefcase,
  Users,
  DollarSign,
  User,
  ArrowRight,
  Lock,
  MessageCircle,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const SingleProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showChartModal, setShowChartModal] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const storageUrl = "http://viwahaa.com/storage";

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/user/getuser/${id}`);
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const showUpgradeAlert = (feature) => {
    if (
      confirm(
        `Upgrade to Ultimate account to ${feature} and unlock all premium features including full photo access, birth charts, and more.`
      )
    ) {
      navigate("/pricing");
    }
  };

  const handleViewChart = () => {
    if (currentUser?.membership_type !== "ultimate") {
      showUpgradeAlert("view birth charts");
      return;
    }
    setShowChartModal(true);
  };

  const getProfileImages = () => {
    const images = [];
    if (!storageUrl) return images;

    if (user?.profile_img) images.push(`${storageUrl}/${user.profile_img}`);

    if (currentUser?.membership_type === "ultimate") {
      if (user?.img_1) images.push(`${storageUrl}/${user.img_1}`);
      if (user?.img_2) images.push(`${storageUrl}/${user.img_2}`);
    }

    return images;
  };

  const getChartImage = () => {
    if (!storageUrl) return null;
    if (user?.chart_img) return `${storageUrl}/${user.chart_img}`;
    return null;
  };

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const renderDetailItem = (IconComponent, label, value) => (
    <div className="flex items-center w-full sm:w-1/2 md:w-1/3 lg:w-1/4 mb-4">
      <IconComponent className="w-5 h-5 text-primary-500 mr-2" />
      <span className="text-gray-600 text-sm mr-1">{label}:</span>
      <span className="text-gray-800 text-sm font-medium">
        {value || "Not specified"}
      </span>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">User not found.</div>
      </div>
    );
  }

  const images = getProfileImages();
  const chartImage = getChartImage();
  const isUltimate = currentUser?.membership_type === "ultimate";
  const hasMultipleImages = (user.img_1 || user.img_2) && !isUltimate;
  const additionalPhotosCount = (user.img_1 ? 1 : 0) + (user.img_2 ? 1 : 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-primary-500 mb-6 hover:text-primary-700 transition-colors"
      >
        <ChevronLeft className="w-5 h-5 mr-1" />
        Back to matches
      </button>

      {/* Profile Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-serif font-medium text-gray-900">
          {user.first_name} {user.last_name}, {user.age}
        </h1>
        <div className="flex items-center justify-center text-gray-600 mt-2">
          <MapPin className="w-4 h-4 mr-1" />
          <span>
            {user.city_of_resident}, {user.country_of_resident}
          </span>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="relative mb-8 rounded-xl overflow-hidden bg-gray-100">
        {images.length > 0 ? (
          <>
            {/* Main Image */}
            {/* Main Image */}
            <div
              className="relative w-full"
              style={{ height: "clamp(400px, 60vh, 600px)" }}
            >
              <div className="relative w-full h-full flex items-center justify-center bg-gray-100">
                <img
                  src={images[activeImageIndex]}
                  alt={`${user.first_name}'s profile`}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    e.target.src = "/default-avatar.png";
                  }}
                />

                {/* Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors"
                    >
                      <ChevronLeft className="w-6 h-6 text-gray-800" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors"
                    >
                      <ChevronRight className="w-6 h-6 text-gray-800" />
                    </button>
                  </>
                )}

                {/* Upgrade Prompt for Non-Ultimate Users */}
                {hasMultipleImages && (
                  <button
                    onClick={() => showUpgradeAlert("view all photos")}
                    className="absolute bottom-6 right-6 bg-primary-500/90 px-4 py-2 rounded-full flex items-center text-orange-600 hover:bg-primary-600 transition-colors"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    <span className="font-medium">
                      {additionalPhotosCount}+ photos available
                    </span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                )}
              </div>
            </div>

            {/* Image Indicators */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      activeImageIndex === index
                        ? "bg-primary-500"
                        : "bg-white/50"
                    }`}
                    onClick={() => setActiveImageIndex(index)}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="w-full aspect-square flex justify-center items-center bg-gray-200">
            <User className="w-24 h-24 text-gray-400" />
          </div>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - About Me */}
        <div className="lg:col-span-2 space-y-6">
          {/* About Me Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
              <h2 className="text-xl font-serif text-primary-500">About Me</h2>
              <button
                onClick={handleViewChart}
                className="text-primary-500 hover:text-primary-700 underline flex items-center"
              >
                View chart <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>

            <p className="text-gray-700 mb-6 leading-relaxed">
              {user.education_details || "No bio available"}
            </p>

            <div className="flex flex-wrap">
              {renderDetailItem(Cake, "Age", user.age)}
              {renderDetailItem(Ruler, "Height", user.height)}
              {renderDetailItem(Palette, "Complexion", user.complexion)}
              {renderDetailItem(Home, "Family Type", user.family_type)}
              {renderDetailItem(Heart, "Status", user.maritial_status)}
              {renderDetailItem(Utensils, "Diet", user.eating_habit)}
              {renderDetailItem(Wine, "Drinking", user.drinking_habit)}
              {renderDetailItem(Wine, "Smoking", user.smoking_habit)}
              {renderDetailItem(BookOpen, "Religion", user.religion)}
              {renderDetailItem(Ribbon, "Cast", user.cast)}
            </div>
          </div>

          {/* Family & Education */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-serif text-primary-500 border-b border-gray-100 pb-4 mb-4">
              Family & Education
            </h2>
            <div className="flex flex-col">
              {renderDetailItem(GraduationCap, "Education", user.education)}
              {renderDetailItem(Briefcase, "Occupation", user.occupation)}
              {renderDetailItem(Users, "Family Values", user.family_value)}
              {renderDetailItem(
                DollarSign,
                "Family Status",
                user.family_status
              )}
            </div>
          </div>

          {/* Partner Preferences */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-serif text-primary-500 border-b border-gray-100 pb-4 mb-4">
              Partner Preferences
            </h2>
            <div className="flex flex-wrap">
              {renderDetailItem(
                User,
                "Age",
                `${user.partner_minimum_age} - ${user.partner_maximum_age}`
              )}
              {renderDetailItem(
                Ruler,
                "Height",
                `${user.partner_minimum_height} - ${user.partner_maximum_height}cm`
              )}
              {renderDetailItem(BookOpen, "Religion", user.partner_religion)}
              {renderDetailItem(Ribbon, "Cast", user.partner_cast)}
              {renderDetailItem(Utensils, "Diet", user.partner_eating_habit)}
              {renderDetailItem(Wine, "Drinking", user.partner_drinking_habit)}
              {renderDetailItem(Wine, "Smoking", user.partner_smoking_habit)}
            </div>
          </div>
        </div>

        {/* Right Column - Actions */}
        <div className="space-y-6">
          {/* Contact Button */}
          <button
            onClick={() => navigate(`/chat/${user.id}`)}
            className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 px-6 rounded-xl flex items-center justify-center transition-colors"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            <span className="font-medium">Chat Now</span>
          </button>

          {/* Shortlist Button */}
          <button className="w-full bg-white border border-primary-500 text-primary-500 hover:bg-primary-50 py-3 px-6 rounded-xl flex items-center justify-center transition-colors">
            <Star className="w-5 h-5 mr-2" />
            <span className="font-medium">Add to Shortlist</span>
          </button>

          {/* Upgrade Banner */}
          {!isUltimate && (
            <div
              onClick={() => showUpgradeAlert("unlock all features")}
              className="bg-primary-50 border border-primary-200 p-4 rounded-xl cursor-pointer hover:bg-primary-100 transition-colors"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-serif text-primary-700 text-lg">
                    Upgrade to Ultimate
                  </h3>
                  <p className="text-primary-600 text-sm mt-1">
                    View all photos, and get priority matching
                  </p>
                </div>
                <ArrowRight className="w-6 h-6 text-primary-500" />
              </div>
            </div>
          )}

          {/* Compatibility Score (Example) */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-serif text-primary-500 mb-3">Compatibility</h3>
            <div className="flex items-center">
              <div className="w-full bg-gray-200 rounded-full h-2.5 mr-4">
                <div
                  className="bg-primary-500 h-2.5 rounded-full"
                  style={{ width: "78%" }}
                ></div>
              </div>
              <span className="text-primary-500 font-medium">78%</span>
            </div>
            <p className="text-gray-600 text-sm mt-2">
              Based on your preferences and profile details
            </p>
          </div>
        </div>
      </div>

      {/* Chart Modal */}
      {showChartModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-serif text-primary-500">
                Birth Chart
              </h3>
              <button
                onClick={() => setShowChartModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {chartImage ? (
              <img
                src={chartImage}
                alt="Birth chart"
                className="w-full rounded-lg mb-4"
                onError={(e) => {
                  e.target.src = "/default-chart.png";
                }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                <BookOpen className="w-12 h-12 mb-4" />
                <p>No chart available</p>
              </div>
            )}

            <button
              onClick={() => setShowChartModal(false)}
              className="mt-4 w-full bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleProfile;
