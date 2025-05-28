import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaCalendarAlt,
  FaHeart,
  FaHome,
  FaMoneyBill,
  FaSearch,
  FaChartLine,
} from "react-icons/fa";
import AdminProfiles from "../Pages/admin/AdminProfiles";
import AdminPackageBookings from "../Pages/admin/AdminPackageBookings";
import AdminProfileInterested from "../Pages/admin/AdminProfileInterested";
import AdminInterested from "../Pages/admin/AdminInterested";
import { useFullscreen } from "../hook/useFullscreen";
import { AnimatePresence, motion } from "framer-motion";
import AdminHeader from "./AdminHeader";
import DashSideBar from "./DashSideBar";

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    profileCount: 0,
    bookingsCount: 0,
    intrestCount: 0,
    totalEarnings: 0,
    customers: [],
    allCustomers: [], // Store all customers separately
    loading: true,
    searchKey: "",
  });

  const [activeSection, setActiveSection] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (activeSection === "dashboard") {
      fetchDashboardData();
      fetchCustomers();
    }
  }, [activeSection]);

  useEffect(() => {
    // When searchKey becomes empty, show all customers
    if (
      dashboardData.searchKey === "" &&
      dashboardData.allCustomers.length > 0
    ) {
      setDashboardData((prev) => ({
        ...prev,
        customers: [...prev.allCustomers],
      }));
    }
  }, [dashboardData.searchKey, dashboardData.allCustomers]);

  //handle fulll scren changes
  useEffect(() => {
    const handleFullscreenChange = () => {};

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Animation variants
  const sidebarVariants = {
    open: {
      x: 0,
      width: "13rem", // 208px (approx w-52)
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    closed: {
      x: "-100%",
      width: "13rem",
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
  };

  const contentVariants = {
    open: { marginLeft: "13rem" },
    closed: { marginLeft: "0" },
  };

  const fetchDashboardData = async () => {
    try {
      const profileRes = await fetch("/api/admin/profiles");
      const profileData = await profileRes.json();

      const bookingsRes = await fetch("/api/admin/bookings/count");
      const bookingsData = await bookingsRes.json();

      const intrestRes = await fetch("/api/admin/interests/count");
      const intrestData = await intrestRes.json();

      const earningsRes = await fetch("/api/admin/earnings");
      const earningsData = await earningsRes.json();

      setDashboardData((prev) => ({
        ...prev,
        profileCount: profileData.length || 0,
        bookingsCount: bookingsData.count || 0,
        intrestCount: intrestData.count || 0,
        totalEarnings: earningsData.amount || 0,
        loading: false,
      }));
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      setDashboardData((prev) => ({ ...prev, loading: false }));
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await fetch("/api/admin/profiles");
      const data = await res.json();
      setDashboardData((prev) => ({
        ...prev,
        customers: data,
        allCustomers: data, // Store all customers
        profileCount: data.length,
      }));
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    }
  };

  const searchCustomers = async () => {
    try {
      if (dashboardData.searchKey.trim() === "") {
        // If search is empty, show all customers
        setDashboardData((prev) => ({
          ...prev,
          customers: [...prev.allCustomers],
        }));
        return;
      }

      const res = await fetch(
        `/api/admin/profiles/search?search=${dashboardData.searchKey}`
      );
      const data = await res.json();
      setDashboardData((prev) => ({ ...prev, customers: data }));
    } catch (error) {
      console.error("Failed to search customers:", error);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setDashboardData((prev) => ({ ...prev, searchKey: value }));

    // If search input is cleared, show all customers immediately
    if (value === "") {
      setDashboardData((prev) => ({
        ...prev,
        customers: [...prev.allCustomers],
      }));
    }
  };

  const handleSearchKeyUp = (e) => {
    if (e.key === "Enter") {
      searchCustomers();
    }
  };

  const handleNavItemClick = (section) => {
    setActiveSection(section);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    })
      .format(amount)
      .replace("$", "Rs.");
  };

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return <AdminProfiles />;
      case "bookings":
        return <AdminPackageBookings />;
      case "interested":
        return <AdminInterested />;
      case "profileinterested":
        return <AdminProfileInterested />;
      case "dashboard":
      default:
        return (
          <div className="p-4 mt-16">
            {/* Page Header - Reduced padding */}
            <div className="mb-4">
              <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
              <p className="text-gray-600">Welcome to Viwahaa</p>
            </div>

            {/* Stats Cards - Grid layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Profile Count Card */}
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {dashboardData.profileCount}
                    </h2>
                    <p className="text-gray-600">Profiles</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Total Customers
                    </p>
                  </div>
                  <FaUser className="text-3xl text-purple-500" />
                </div>
              </div>

              {/* Bookings Count Card */}
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {dashboardData.bookingsCount}
                    </h2>
                    <p className="text-gray-600">Bookings</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Total Plan Request
                    </p>
                  </div>
                  <FaCalendarAlt className="text-3xl text-green-500" />
                </div>
              </div>

              {/* Interest Count Card */}
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {dashboardData.intrestCount}
                    </h2>
                    <p className="text-gray-600">Interested</p>
                    <p className="text-sm text-gray-500 mt-1">
                      People Interested
                    </p>
                  </div>
                  <FaHeart className="text-3xl text-red-500" />
                </div>
              </div>

              {/* Earnings Card */}
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {formatCurrency(dashboardData.totalEarnings)}
                    </h2>
                    <p className="text-gray-600">Total Earnings</p>
                    <p className="text-sm text-gray-500 mt-1">Revenue</p>
                  </div>
                  <FaMoneyBill className="text-3xl text-blue-500" />
                </div>
              </div>
            </div>

            {/* Customers Section */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {/* Search */}
              <div className="p-4 border-b">
                <div className="relative w-full max-w-lg mx-auto">
                  <input
                    type="text"
                    className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Search customers..."
                    value={dashboardData.searchKey}
                    onChange={handleSearchChange}
                    onKeyUp={handleSearchKeyUp}
                  />
                  <button
                    onClick={searchCustomers}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 focus:outline-none"
                  >
                    <FaSearch className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">Customers</h2>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <div className="bg-white shadow rounded-lg">
                  <table className="min-w-full table-auto">
                    <thead className="bg-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium font-workSans text-gray-700">
                          No
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium font-workSans text-gray-700">
                          Member ID
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium font-workSans text-gray-700">
                          Name
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium font-workSans text-gray-700">
                          Email
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium font-workSans text-gray-700">
                          Number
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {dashboardData.customers.map((customer, index) => (
                        <tr key={customer.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">{index + 1}</td>
                          <td className="px-4 py-3 font-medium text-gray-900">
                            {customer.member_id}
                          </td>
                          <td className="px-4 py-3 text-gray-500">
                            {customer.first_name} {customer.last_name}
                          </td>
                          <td className="px-4 py-3 text-gray-500">
                            {customer.email}
                          </td>
                          <td className="px-4 py-3 text-gray-500">
                            {customer.contact_no}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Animated Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            className="fixed h-full z-40"
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
          >
            <DashSideBar
              onNavItemClick={handleNavItemClick}
              activeSection={activeSection}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <motion.div
        className="flex-1"
        animate={isSidebarOpen ? "open" : "closed"}
        variants={contentVariants}
      >
        <AdminHeader onToggleSidebar={toggleSidebar} />
        {renderContent()}
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
