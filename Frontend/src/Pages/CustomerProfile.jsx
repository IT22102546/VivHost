import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { signOut, updateUserFailure, updateUserStart, updateUserSuccess } from "../redux/user/userSlice";

import { Link, useNavigate } from "react-router-dom";

import { Edit, BarChart, Search, UserPlus, LogOut, Award } from "lucide-react";

const CustomerProfile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);

  // Modal states
  const [showChartModal, setShowChartModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showImg1Modal, setShowImg1Modal] = useState(false);
  const [showImg2Modal, setShowImg2Modal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  console.log(currentUser);

  const [formData, setFormData] = useState({
    first_name: currentUser?.user.first_name || "",
    last_name: currentUser?.user.last_name || "",
    email: currentUser?.user.email || "",
    d_o_b: currentUser?.user.d_o_b || "",
    age: currentUser?.user.age || "",
    gender: currentUser?.user.gender || "",
    contact_no: currentUser?.user.contact_no || "",
    address: currentUser?.user.address || "",
    whatsapp_no: currentUser?.user.whatsapp_no || "",
    birth_place: currentUser?.user.birth_place || "",
    birth_time: currentUser?.user.birth_time || "",
    height: currentUser?.user.height || "",
    weight: currentUser?.user.weight || "",
    complexion: currentUser?.user.complexion || "",
    maritial_status: currentUser?.user.maritial_status || "",
    physical_status: currentUser?.user.physical_status || "",
    religion: currentUser?.user.religion || "",
    cast: currentUser?.user.cast || "",
    star_sign: currentUser?.user.star_sign || "",
    rasi: currentUser?.user.rasi || "",
    country_of_birth: currentUser?.user.country_of_birth || "",
    city_of_birth: currentUser?.user.city_of_birth || "",
    country_of_resident: currentUser?.user.country_of_resident || "",
    city_of_resident: currentUser?.user.city_of_resident || "",
    country_of_citizenship: currentUser?.user.country_of_citizenship || "",
    eating_habit: currentUser?.user.eating_habit || "",
    smoking_habit: currentUser?.user.smoking_habit || "",
    drinking_habit: currentUser?.user.drinking_habit || "",
    primary_school: currentUser?.user.primary_school || "",
    secondary_school: currentUser?.user.secondary_school || "",
    education: currentUser?.user.education || "",
    education_details: currentUser?.user.education_details || "",
    occupation: currentUser?.user.occupation || "",
    occupation_details: currentUser?.user.occupation_details || "",
    employed_in: currentUser?.user.employed_in || "",
    annual_income: currentUser?.user.annual_income || "",
    family_value: currentUser?.user.family_value || "",
    family_type: currentUser?.user.family_type || "",
    family_status: currentUser?.user.family_status || "",
    fathers_name: currentUser?.user.fathers_name || "",
    fathers_occupation: currentUser?.user.fathers_occupation || "",
    fathers_native_place: currentUser?.user.fathers_native_place || "",
    mothers_name: currentUser?.user.mothers_name || "",
    mothers_occupation: currentUser?.user.mothers_occupation || "",
    mothers_native_place: currentUser?.user.mothers_native_place || "",
    brothers: currentUser?.user.brothers || "",
    married_brothers: currentUser?.user.married_brothers || "",
    sisters: currentUser?.user.sisters || "",
    married_sisters: currentUser?.user.married_sisters || "",
    more_family: currentUser?.user.more_family || "",
    partner_country_of_resident:currentUser?.user.partner_country_of_resident || "",
    partner_resident_status: currentUser?.user.partner_resident_status || "",
    partner_education: currentUser?.user.partner_education || "",
    partner_occupation: currentUser?.user.partner_occupation || "",
    partner_annual_income: currentUser?.user.partner_annual_income || "",
    partner_marital_status: currentUser?.user.partner_marital_status || "",
    partner_minimum_age: currentUser?.user.partner_minimum_age || "",
    partner_maximum_age: currentUser?.user.partner_maximum_age || "",
    partner_minimum_height: currentUser?.user.partner_minimum_height || "",
    partner_maximum_height: currentUser?.user.partner_maximum_height || "",
    partner_physical_status: currentUser?.user.partner_physical_status || "",
    partner_mother_tongue: currentUser?.user.partner_mother_tongue || "",
    partner_religion: currentUser?.user.partner_religion || "",
    partner_star_sign: currentUser?.user.partner_star_sign || "",
    partner_cast: currentUser?.user.partner_cast || "",
    partner_eating_habit: currentUser?.user.partner_eating_habit || "",
    partner_smoking_habit: currentUser?.user.partner_smoking_habit || "",
    partner_drinking_habit: currentUser?.user.partner_drinking_habit || "",
    profile_img: currentUser?.user.profile_img || "",
    img_1: currentUser?.user.img_1 || "",
    img_2: currentUser?.user.img_2 || "",
    chart_img: currentUser?.user.chart_img || "",
  });

  const handleLogout = () => {
    dispatch(signOut());
    navigate("/sign-in");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files[0],  
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      // Create FormData object
      const formDataObj = new FormData();
      
      // Append all non-file fields
      for (const key in formData) {
        if (formData[key] !== null && formData[key] !== undefined) {
          if (['profile_img', 'img_1', 'img_2', 'chart_img'].includes(key)) {
            // Files will be handled separately
            continue;
          }
          formDataObj.append(key, formData[key]);
        }
      }
  
      // Append files if they exist
      if (formData.profile_img instanceof File) {
        formDataObj.append('profile_img', formData.profile_img);
      }
      if (formData.img_1 instanceof File) {
        formDataObj.append('img_1', formData.img_1);
      }
      if (formData.img_2 instanceof File) {
        formDataObj.append('img_2', formData.img_2);
      }
      if (formData.chart_img instanceof File) {
        formDataObj.append('chart_img', formData.chart_img);
      }
  
      // Dispatch update start action
      dispatch(updateUserStart());
      
      // Send all data in one request
      const response = await fetch(`/api/user/update/${currentUser.user.id}`, {
        method: 'PUT',
        body: formDataObj,
        // Don't set Content-Type header - let the browser set it with boundary
      });
  
      if (!response.ok) {
        throw new Error('Failed to update user');
      }
  
      const data = await response.json();
      console.log('Update successful:', data);
  
      // Refresh user data
      dispatch(updateUserSuccess(data.user));
      setShowEditModal(false);
      
    } catch (error) {
      console.error('Error updating user:', error);
      dispatch(updateUserFailure(error.message));
    } finally {
      setIsUpdating(false);
    }
  };
  


  if (!currentUser) {
    return (
      <div className="container text-center py-5">
        <h1>Welcome Guest</h1>
        <p>Please log in to see your profile.</p>
      </div>
    );
  }
  console.log('Profile image path:', `/uploads/${currentUser.user.profile_img}`);
  return (
    <div className="">
      {/* Main Profile Content */}
      <div className="container mt-7 mx-auto md:px-20">
        <div className="flex flex-wrap">
          {/* Left Sidebar */}
          <div className="w-full md:w-1/4 mb-10">
            <div className="bg-red-800 rounded-tr-lg rounded-tl-lg p-6">
              <div className="text-center">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowProfileModal(true);
                  }}
                >
                 <img
                    src={`http://localhost:7000/uploads/${currentUser?.user.profile_img || "/default-profile.jpg"}`}
                    className="w-36 h-36 rounded-full mx-auto border-4 border-orange-200"
                    alt="Profile"
                    onError={(e) => {
                      e.target.onerror = null; // Prevent infinite loop
                      e.target.src = "/default-profile.jpg";
                    }}
                  />
                  
                </a>
                <h1 className="text-lg font-normal mt-2 text-white">
                  {currentUser.firstName} {currentUser.user.last_name}
                </h1>
                <p className="text-sm text-white">{currentUser.user.email}</p>
                <p className="text-lg text-white">{currentUser.user.d_o_b}</p>
                <p className="text-lg text-white">
                  Age: {currentUser.user.age}
                </p>
              </div>
            </div>

            <div className="bg-gray-100 p-3">
              <button
                className="w-full text-gray-600 text-sm font-workSans mb-4 rounded-md text-left ml-6"
                onClick={() => setShowEditModal(true)}
              >
                <Edit className="mr-2 inline-block" />
                Edit Profile
              </button>

              <button
                className="w-full text-gray-600 text-sm font-workSans mb-4 rounded-md text-left ml-6"
                onClick={() => setShowChartModal(true)}
              >
                <BarChart className="mr-2 inline-block" />
                View Chart
              </button>

              <a
                href="/customer/matching"
                target="_blank"
                className="block w-full"
              >
                <Link to="/matching">
                  <button className="w-full text-gray-600 text-sm font-workSans mb-4 rounded-md text-left ml-6">
                    <Search className="mr-2 inline-block" />
                    Find Matching
                  </button>
                </Link>
              </a>

              <a href="/pricing" className="block w-full">
                <button className="w-full text-gray-600 text-sm font-workSans mb-4 rounded-md text-left ml-6">
                  <UserPlus className="mr-2 inline-block" />
                  Upgrade Package
                </button>
              </a>

              <button
                className="w-full text-gray-500 text-sm font-workSans rounded-md text-left ml-6"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 inline-block" />
                Logout
              </button>
            </div>
          </div>

          {/* Right Content */}
          <div className="w-full md:w-3/4 mb-10 md:px-10 sm:px-2">
            <div className="bg-red-800 p-3 flex items-center justify-center">
              <Award className="mr-2 text-white" />
              <span className="text-white text-xl font-bold italic text-center">
                Basic Plan
              </span>
            </div>
            <div className="bg-white  rounded-lg p-6">
              <h2 className="text-2xl font-normal mb-4 text-gray-800">
                Basic Details
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-gray-700">
                  <span className="font-normal">Mobile Number:</span>{" "}
                  {currentUser.user.contact_no}
                </div>
                <div className="text-gray-700">
                  <span className="font-normal">Whatsapp No:</span>{" "}
                  {currentUser.user.whatsapp_no}
                </div>
                <div className="text-gray-700">
                  <span className="font-normal">Birth Place:</span>{" "}
                  {currentUser.user.birth_place}
                </div>
                <div className="text-gray-700">
                  <span className="font-normal">Address:</span>{" "}
                  {currentUser.user.address}
                </div>
                <div className="text-gray-700">
                  <span className="font-normal">Birth Time:</span>{" "}
                  {currentUser.user.birth_time}
                </div>
                <div className="text-gray-700">
                  <span className="font-normal">Marital Status:</span>{" "}
                  {currentUser.user.maritial_status}
                </div>
                <div className="text-gray-700">
                  <span className="font-normal">Height:</span>{" "}
                  {currentUser.user.height}
                </div>
                <div className="text-gray-700">
                  <span className="font-normal">Weight:</span>{" "}
                  {currentUser.user.weight}
                </div>
                <div className="text-gray-700">
                  <span className="font-normal">Complexion:</span>{" "}
                  {currentUser.user.complexion}
                </div>
                <div className="text-gray-700">
                  <span className="font-normal">Physical Status:</span>{" "}

                  {currentUser.user.physical_status }

                </div>
                <div className="text-gray-700">
                  <span className="font-normal">Caste:</span>{" "}
                  {currentUser.user.cast}
                </div>
                <div className="text-gray-700">
                  <span className="font-normal">Religion:</span>{" "}
                  {currentUser.user.religion}
                </div>
                <div className="text-gray-700">
                  <span className="font-normal">Star Sign:</span>{" "}
                  {currentUser.user.star_sign}
                </div>
                <div className="text-gray-700">
                  <span className="font-normal">Rasi:</span>{" "}
                  {currentUser.user.rasi}
                </div>
              </div>
            </div>
          </div>

          {/* Family Details */}
          <div className="w-full mb-10">
            <div className="bg-white  rounded-lg p-6">
              <h2 className="text-2xl font-normal mb-4">Family Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-gray-700">
                  <span className="font-normal">Family Value:</span>{" "}
                  {currentUser.user.family_value}
                </div>
                <div className="text-gray-700">
                  <span className="font-normal">Family Type:</span>{" "}
                  {currentUser.user.family_type}
                </div>
                <div className="text-gray-700">
                  <span className="font-normal">Family Status:</span>{" "}
                  {currentUser.user.family_status}
                </div>
                <div className="text-gray-700">
                  <span className="font-normal">Father Name:</span>{" "}
                  {currentUser.user.fathers_name}
                </div>
                <div className="text-gray-700">
                  <span className="font-normal">Father Occupation:</span>{" "}
                  {currentUser.user.fathers_occupation}
                </div>
                <div className="text-gray-700">
                  <span className="font-normal">Father Native Place:</span>{" "}
                  {currentUser.user.fathers_native_place}
                </div>
                <div className="text-gray-700">
                  <span className="font-normal">Mother Name:</span>{" "}
                  {currentUser.user.mothers_name}
                </div>
                <div className="text-gray-700">
                  <span className="font-normal">Mother Occupation:</span>{" "}
                  {currentUser.user.mothers_occupation}
                </div>
                <div className="text-gray-700">
                  <span className="font-normal">Mother Native Place:</span>{" "}
                  {currentUser.user.mothers_native_place}

                </div>
                <div className="text-gray-700">
                  <span className="font-normal">Brothers:</span>{" "}
                  {currentUser.user.brothers}
                </div>
                <div className="text-gray-700">
                  <span className="font-normal">Married Brothers:</span>{" "}

                  {currentUser.user.married_brothers}

                </div>
                <div className="text-gray-700">
                  <span className="font-normal">Sisters:</span>{" "}
                  {currentUser.user.sisters}
                </div>
                <div className="text-gray-700">
                  <span className="font-normal">Married Sisters:</span>{" "}

                  {currentUser.user.married_sisters}
                </div>
                <div className="text-gray-700">
                  <span className="font-normal">More Family:</span>{" "}
                  {currentUser.user.more_family}

                </div>
              </div>
            </div>
          </div>

          {/* Partner Preference */}
          <div className="w-full mb-10">
            <div className="bg-white  rounded-lg p-6">
              <h2 className="text-2xl font-normal mb-4">Partner Preference</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-gray-700">
                  <span className="font-normal">Country of Resident:</span>{" "}

                  {currentUser.user.partner_country_of_resident}
                </div>
                <div className="text-gray-700">
                  <span className="font-normal">Resident Status:</span>{" "}
                  {currentUser.user.partner_resident_status}
                </div>
                <div className="text-gray-700">
                  <span className="font-normal">Education:</span>{" "}
                  {currentUser.user.partner_education}
                </div>
                <div className="text-gray-700">
                  <span className="font-normal">Occupation:</span>{" "}
                  {currentUser.user.partner_occupation}
                </div>
                <div className="text-gray-700">
                  <span className="font-normal">Annual Income:</span>{" "}
                  {currentUser.user.partner_annual_income}
                </div>
                <div className="text-gray-700">
                  <span className="font-normal">Marital Status:</span>{" "}
                  {currentUser.user.partner_maritial_status}
                </div>
                <div className="text-gray-700">
                  <span className="font-normal">Minimum Age:</span>{" "}
                  {currentUser.user.partner_minimum_age}
                </div>
                <div className="text-gray-700">
                  <span className="font-normal">Maximum Age:</span>{" "}
                  {currentUser.user.partner_maximum_age}
                </div>
                <div className="text-gray-700">
                  <span className="font-normal">Minimum Height:</span>{" "}
                  {currentUser.user.partner_minimum_height}
                </div>
                <div className="text-gray-700">
                  <span className="font-normal">Maximum Height:</span>{" "}
                  {currentUser.user.partner_maximum_height}
                </div>
                <div className="text-gray-700">
                  <span className="font-normal">Physical Status:</span>{" "}
                  {currentUser.user.partner_physical_status}
                </div>
                <div className="text-gray-700">
                  <span className="font-normal">Mother Tongue:</span>{" "}
                  {currentUser.user.partner_mother_tongue}
                </div>
                <div className="text-gray-700">
                  <span className="font-normal">Religion:</span>{" "}
                  {currentUser.user.partner_religion}
                </div>
                <div className="text-gray-700">
                  <span className="font-normal">Star Sign:</span>{" "}
                  {currentUser.user.partner_star_sign}
                </div>
                <div className="text-gray-700">
                  <span className="font-normal">Caste:</span>{" "}
                  {currentUser.user.partner_cast}
                </div>
                <div className="text-gray-700">
                  <span className="font-normal">Eating Habits:</span>{" "}
                  {currentUser.user.partner_eating_habit}
                </div>
                <div className="text-gray-700">
                  <span className="font-normal">Smoking Habits:</span>{" "}
                  {currentUser.user.partner_smoking_habit}
                </div>
                <div className="text-gray-700">
                  <span className="font-normal">Drinking Habits:</span>{" "}
                  {currentUser.user.partner_drinking_habit}

                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="w-full md:w-1/3 mb-10">
            <div className="bg-white  rounded-lg p-6">
              <h2 className="text-2xl font-normal mb-4">Location</h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="text-gray-700">
                  <span className="font-normal">Country of Birth:</span>{" "}

                  {currentUser.user.country_of_birth}
                </div>
                <div className="text-gray-700">
                  <span className="font-normal">City of Birth:</span>{" "}
                  {currentUser.user.city_of_birth}
                </div>
                <div className="text-gray-700">
                  <span className="font-normal">Country of Resident:</span>{" "}
                  {currentUser.user.city_of_resident}
                </div>
                <div className="text-gray-700">
                  <span className="font-normal">City of Resident:</span>{" "}
                  {currentUser.user.city_of_resident}
                </div>
                <div className="text-gray-700">
                  <span className="font-normal">Country of Citizenship:</span>{" "}
                  {currentUser.user.country_of_citizenship}

                </div>
              </div>
            </div>
          </div>

          {/* Lifestyle */}
          <div className="w-full md:w-1/3 mb-10">
            <div className="bg-white  rounded-lg p-6">
              <h2 className="text-2xl font-normal mb-4">Lifestyle</h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="text-gray-700">
                  <span className="font-normal">Eating Habits:</span>{" "}

                  {currentUser.user.eating_habit}
                </div>
                <div className="text-gray-700">
                  <span className="font-normal">Smoking Habits:</span>{" "}
                  {currentUser.user.smoking_habit}
                </div>
                <div className="text-gray-700">
                  <span className="font-normal">Drinking Habits:</span>{" "}
                  {currentUser.user.drinking_habit}

                </div>
              </div>
            </div>
          </div>

          {/* Education & Professional */}
          <div className="w-full md:w-1/3 mb-10">
            <div className="bg-white  rounded-lg p-6">
              <h2 className="text-2xl font-normal mb-4">
                Education & Professional
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="text-gray-700">
                  <span className="font-normal">Primary School:</span>{" "}

                  {currentUser.user.primary_school}
                </div>
                <div className="text-gray-700">
                  <span className="font-normal">Secondary School:</span>{" "}
                  {currentUser.user.secondary_school}

                </div>
                <div className="text-gray-700">
                  <span className="font-normal">Education:</span>{" "}
                  {currentUser.user.education}
                </div>
                <div className="text-gray-700">
                  <span className="font-normal">Education Details:</span>{" "}

                  {currentUser.user.education_details}

                </div>
                <div className="text-gray-700">
                  <span className="font-normal">Occupation:</span>{" "}
                  {currentUser.user.occupation}
                </div>
                <div className="text-gray-700">
                  <span className="font-normal">Occupation Details:</span>{" "}

                  {currentUser.user.occupation_details}
                </div>
                <div className="text-gray-700">
                  <span className="font-normal">Employed In:</span>{" "}
                  {currentUser.user.employed_in}
                </div>
                <div className="text-gray-700">
                  <span className="font-normal">Annual Income:</span>{" "}
                  {currentUser.user.annual_income}

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Modal */}
      {showChartModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <div className="text-center">
              <img
                src={`http://localhost:7000/uploads/${currentUser?.user.chart_img || "/default-profile.jpg"}`}
                className="max-w-full max-h-[300px] object-contain mx-auto"
                alt="Chart"
              />
            </div>
            <div className="text-right mt-4">
              <button
                className="bg-gray-500 text-white px-6 py-2 rounded"
                onClick={() => setShowChartModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Image Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <div className="text-center">
              <img
                 src={`http://localhost:7000/uploads/${currentUser?.user.profile_img || "/default-profile.jpg"}`}
                className="max-w-full max-h-[300px] object-contain mx-auto"
                alt="Profile"
              />
            </div>
            <div className="text-right mt-4">
              <button
                className="bg-gray-500 text-white px-6 py-2 rounded"
                onClick={() => setShowProfileModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto">
          <div className="bg-white p-6 rounded-lg w-full max-w-6xl max-h-screen overflow-y-auto">
            <div className="modal-header flex justify-between items-center border-b pb-3">
              <h3 className="text-xl font-normal">
                Update Your Current Information
              </h3>
              <button
                type="button"
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowEditModal(false)}
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>

            <div className="modal-body py-4">
              <form onSubmit={handleSave}>
                {/* Basic Details Section */}
                <div className="mb-6">
                  <h6 className="text-center font-medium text-lg mb-3">
                    Edit Basic Details
                  </h6>
                  <hr className="mb-4" />

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block mb-1">
                        First Name<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="First Name"
                      />
                    </div>

                    <div>
                      <label className="block mb-1">
                        Last Name<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="Last Name"
                      />
                    </div>

                    <div>
                      <label className="block mb-1">
                        Email<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="Email"
                      />
                    </div>

                    <div>
                      <label className="block mb-1">
                        Date of Birth<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="d_o_b"
                        value={formData.d_o_b}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block mb-1">
                        Age<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="Age"
                      />
                    </div>

                    <div>
                      <label className="block mb-1">
                        Gender<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="Gender"
                      />
                    </div>

                    <div>
                      <label className="block mb-1">
                        Contact No<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="contact_no"
                        value={formData.contact_no}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="Contact No"
                      />
                    </div>

                    <div>
                      <label className="block mb-1">
                        Whatsapp No<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="whatsapp_no"
                        value={formData.whatsapp_no}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="Whatsapp No"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block mb-1">
                        Address<span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="Address"
                        rows="3"
                      ></textarea>
                    </div>

                    <div>
                      <label className="block mb-1">
                        Birth Place<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="birth_place"
                        value={formData.birth_place}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="Birth Place"
                      />
                    </div>

                    <div>
                      <label className="block mb-1">
                        Birth Time<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="time"
                        name="birth_time"
                        value={formData.birth_time}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="Birth Time"
                      />
                    </div>

                    <div>
                      <label className="block mb-1">
                        Height<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="height"
                        value={formData.height}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="Height"
                      />
                    </div>

                    <div>
                      <label className="block mb-1">
                        Weight<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="weight"
                        value={formData.weight}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="Weight"
                      />
                    </div>

                    <div>
                      <label className="block mb-1">Complexion</label>
                      <select
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        name="complexion"
                        value={formData.complexion}
                        onChange={handleInputChange}
                      >
                        <option value="">Complexion</option>
                        <option value="fair">Fair</option>
                        <option value="medium">Medium</option>
                        <option value="olive">Olive</option>
                        <option value="dark">Dark</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block mb-1">Marital Status</label>
                      <select
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        name="maritial_status"
                        value={formData.maritial_status}
                        onChange={handleInputChange}
                      >
                        <option value="">Marital Status</option>
                        <option value="single">Single</option>
                        <option value="married">Married</option>
                        <option value="divorced">Divorced</option>
                        <option value="widowed">Widowed</option>
                        <option value="separated">Separated</option>
                      </select>
                    </div>

                    <div>
                      <label className="block mb-1">Physical Status</label>
                      <select
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        name="physical_status"
                        value={formData.physical_status}
                        onChange={handleInputChange}
                      >
                        <option value="">Physical Status</option>
                        <option value="single">Single</option>
                        <option value="normal">Normal</option>
                        <option value="disabled">Disabled</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block mb-1">Religion</label>
                      <select
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        name="religion"
                        value={formData.religion}
                        onChange={handleInputChange}
                      >
                        <option value="">Religion</option>
                        <option value="hindu">Hindu</option>
                        <option value="christian">Christian</option>
                        <option value="muslim">Muslim</option>
                        <option value="buddhist">Buddhist</option>
                        <option value="sikh">Sikh</option>
                        <option value="jewish">Jewish</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block mb-1">Caste</label>
                      <select
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        name="cast"
                        value={formData.cast}
                        onChange={handleInputChange}
                      >
                        <option value="">Caste</option>
                        <option value="Mixed Jaffna Vellalar">
                          Mixed Jaffna Vellalar
                        </option>
                        <option value="Vellalar">Vellalar</option>
                        <option value="Other Vellatar">Other Vellatar</option>
                        <option value="Viswakulam">Viswakulam</option>
                        <option value="Mukkulanthor">Mukkulanthor</option>
                        <option value="Koviyor">Koviyor</option>
                        <option value="Kurukulam">Kurukulam</option>
                        <option value="Bhramin">Bhramin</option>
                        <option value="Kounder">Kounder</option>
                        <option value="Veera Saiva Vellalar">
                          Veera Saiva Vellalar
                        </option>
                        <option value="Kujavar">Kujavar</option>
                        <option value="Chettiar">Chettiar</option>
                        <option value="Devar">Devar</option>
                        <option value="Kaller">Kaller</option>
                        <option value="Malayalee">Malayalee</option>
                        <option value="Mukkuwar">Mukkuwar</option>
                        <option value="Muthaliyar">Muthaliyar</option>
                        <option value="Naiyudu">Naiyudu</option>
                        <option value="Nadar">Nadar</option>
                        <option value="Pallar">Pallar</option>
                        <option value="Parawar">Parawar</option>
                        <option value="Senkunthar">Senkunthar</option>
                        <option value="Siviyar">Siviyar</option>
                        <option value="Dadar">Dadar</option>
                        <option value="Sayakkarar">Sayakkarar</option>
                        <option value="Nalavar">Nalavar</option>
                        <option value="Agamiliyar">Agamiliyar</option>
                        <option value="Dobi">Dobi</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block mb-1">Star Sign</label>
                      <select
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        name="star_sign"
                        value={formData.star_sign}
                        onChange={handleInputChange}
                      >
                        <option value="">Star Sign</option>
                        <option value="அச்வினி (Aswini)">
                          அச்வினி (Aswini)
                        </option>
                        <option value="பரணி (Bharani)">பரணி (Bharani)</option>
                        <option value="கார்த்திகை (Karthigai)">
                          கார்த்திகை (Karthigai)
                        </option>
                        <option value="ரோகிணி (Rohini)">ரோகிணி (Rohini)</option>
                        <option value="மிருகசீரிடம் (Mrigasiridam)">
                          மிருகசீரிடம் (Mrigasiridam)
                        </option>
                        <option value="திருவாதிரை (Thiruvathirai)">
                          திருவாதிரை (Thiruvathirai)
                        </option>
                        <option value="புனர்பூசம் (Punarpoosam)">
                          புனர்பூசம் (Punarpoosam)
                        </option>
                        <option value="பூசம் (Poosam)">பூசம் (Poosam)</option>
                        <option value="ஆயில்யம் (Ayilyam)">
                          ஆயில்யம் (Ayilyam)
                        </option>
                        <option value="மகம் (Magam)">மகம் (Magam)</option>
                        <option value="பூரம் (Pooram)">பூரம் (Pooram)</option>
                        <option value="உத்திரம் (Uthiram)">
                          உத்திரம் (Uthiram)
                        </option>
                        <option value="ஹஸ்தம் (Hastham)">
                          ஹஸ்தம் (Hastham)
                        </option>
                        <option value="சித்திரை (Chithirai)">
                          சித்திரை (Chithirai)
                        </option>
                        <option value="சுவாதி (Swathi)">சுவாதி (Swathi)</option>
                        <option value="விசாகம் (Visakam)">
                          விசாகம் (Visakam)
                        </option>
                        <option value="அனுஷம் (Anusham)">
                          அனுஷம் (Anusham)
                        </option>
                        <option value="கேட்டை (Kettai)">கேட்டை (Kettai)</option>
                        <option value="மூலம் (Moolam)">மூலம் (Moolam)</option>
                        <option value="பூராடம் (Pooradam)">
                          பூராடம் (Pooradam)
                        </option>
                        <option value="உத்திராடம் (Uthiradam)">
                          உத்திராடம் (Uthiradam)
                        </option>
                        <option value="திரைகடகம் (Thiruvonam)">
                          திரைகடகம் (Thiruvonam)
                        </option>
                        <option value="அவிட்டம் (Avittam)">
                          அவிட்டம் (Avittam)
                        </option>
                        <option value="சதயம் (Sathayam)">
                          சதயம் (Sathayam)
                        </option>
                        <option value="பூரட்டாதி (Purattadhi)">
                          பூரட்டாதி (Purattadhi)
                        </option>
                        <option value="உத்திரட்டாதி (Uthiraadhi)">
                          உத்திரட்டாதி (Uthiraadhi)
                        </option>
                        <option value="ரேவதி (Revadhi)">ரேவதி (Revadhi)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block mb-1">
                        Rasi<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="rasi"
                        value={formData.rasi}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="Rasi"
                      />
                    </div>

                    <div>
                      <label className="block mb-1">
                        Profile Image<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="file"
                        name="profile_img"
                        onChange={handleFileChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block mb-1">
                        Image 1<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="file"
                        name="img_1"
                        onChange={handleFileChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block mb-1">
                        Image 2<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="file"
                        name="img_2"
                        onChange={handleFileChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block mb-1">
                        Chart Image<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="file"
                        name="chart_img"
                        onChange={handleFileChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* Location Section */}
                <div className="mb-6">
                  <h6 className="text-center font-medium text-lg mb-3">
                    Edit Location
                  </h6>
                  <hr className="mb-4" />

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block mb-1">
                        Country Of Birth<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="country_of_birth"
                        value={formData.country_of_birth}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="Country Of Birth"
                      />
                    </div>

                    <div>
                      <label className="block mb-1">
                        City Of Birth<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="city_of_birth"
                        value={formData.city_of_birth}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="City Of Birth"
                      />
                    </div>

                    <div>
                      <label className="block mb-1">
                        Country Of Resident
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="country_of_resident"
                        value={formData.country_of_resident}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="Country Of Resident"
                      />
                    </div>

                    <div>
                      <label className="block mb-1">
                        City Of Resident<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="city_of_resident"
                        value={formData.city_of_resident}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="City Of Resident"
                      />
                    </div>

                    <div>
                      <label className="block mb-1">
                        Country Of Citizenship
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="country_of_citizenship"
                        value={formData.country_of_citizenship}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="Country Of Citizenship"
                      />
                    </div>
                  </div>
                </div>

                {/* Lifestyle Section */}
                <div className="mb-6">
                  <h6 className="text-center font-medium text-lg mb-3">
                    Edit Life Style
                  </h6>
                  <hr className="mb-4" />

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block mb-1">Eating Habits</label>
                      <select
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        name="eating_habit"
                        value={formData.eating_habit}
                        onChange={handleInputChange}
                      >
                        <option value="">Eating Habits</option>
                        <option value="vegetarian">Vegetarian</option>
                        <option value="vegan">Vegan</option>
                        <option value="nonVegetarian">Non-Vegetarian</option>
                        <option value="pescatarian">Pescatarian</option>
                        <option value="flexitarian">Flexitarian</option>
                        <option value="rawFood">Raw Food</option>
                        <option value="glutenFree">Gluten-Free</option>
                        <option value="lactoseFree">Lactose-Free</option>
                        <option value="organic">Organic</option>
                        <option value="halal">Halal</option>
                        <option value="kosher">Kosher</option>
                      </select>
                    </div>

                    <div>
                      <label className="block mb-1">Smoking Habits</label>
                      <select
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        name="smoking_habit"
                        value={formData.smoking_habit}
                        onChange={handleInputChange}
                      >
                        <option value="">Smoking Habits</option>
                        <option value="nonSmoker">Non-Smoker</option>
                        <option value="occasionalSmoker">
                          Occasional Smoker
                        </option>
                        <option value="regularSmoker">Regular Smoker</option>
                        <option value="quitSmoking">
                          Former Smoker (Quit)
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="block mb-1">Drinking Habits</label>
                      <select
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        name="drinking_habit"
                        value={formData.drinking_habit}
                        onChange={handleInputChange}
                      >
                        <option value="">Drinking Habits</option>
                        <option value="nonDrinker">Non-Drinker</option>
                        <option value="occasionalDrinker">
                          Occasional Drinker
                        </option>
                        <option value="socialDrinker">Social Drinker</option>
                        <option value="regularDrinker">Regular Drinker</option>
                        <option value="quitDrinking">
                          Former Drinker (Quit)
                        </option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Education & Professional Section */}
                <div className="mb-6">
                  <h6 className="text-center font-medium text-lg mb-3">
                    Edit Education & Professional
                  </h6>
                  <hr className="mb-4" />

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block mb-1">
                        Primary School<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="primary_school"
                        value={formData.primary_school}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="Primary School"
                      />
                    </div>

                    <div>
                      <label className="block mb-1">
                        Secondary School<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="secondary_school"
                        value={formData.secondary_school}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="Secondary School"
                      />
                    </div>

                    <div>
                      <label className="block mb-1">Education</label>
                      <select
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        name="education"
                        value={formData.education}
                        onChange={handleInputChange}
                      >
                        <option value="">Education</option>
                        <option value="Primary">Primary Education</option>
                        <option value="Kinder garten">
                          Kindergarten/Preschool
                        </option>
                        <option value="Grade 1 to 5">Grade 1 to Grade 5</option>
                        <option value="Middle School">
                          Middle School/Junior High School
                        </option>
                        <option value="Grade 6 to 8">
                          Grade 6/7 to Grade 8/9
                        </option>
                        <option value="High School">
                          High School/Senior High School
                        </option>
                        <option value="Grade 9 to 12">
                          Grade 9/10 to Grade 12
                        </option>
                        <option value="Higher Secondary">
                          Higher Secondary Education
                        </option>
                        <option value="Vocational Training">
                          Vocational Training
                        </option>
                        <option value="Diploma Programs">
                          Diploma Programs
                        </option>
                        <option value="Associates Degree">
                          Associate's Degree
                        </option>
                        <option value="Undergraduate">
                          Undergraduate Education
                        </option>
                        <option value="Bachelors Degree">
                          Bachelor's Degree
                        </option>
                        <option value="Graduate">Graduate Education</option>
                        <option value="Masters Degree">Master's Degree</option>
                        <option value="Doctoral Degree">
                          Doctoral Degree (Ph.D. or equivalent)
                        </option>
                        <option value="Post Doc Research">
                          Post-Doctoral Research
                        </option>
                        <option value="Professional Education">
                          Professional Education
                        </option>
                        <option value="Certifications">
                          Professional Certifications
                        </option>
                        <option value="Specialized Training">
                          Specialized Training
                        </option>
                        <option value="Continuing Education">
                          Continuing Education
                        </option>
                        <option value="Online Distance Education">
                          Online and Distance Education
                        </option>
                        <option value="Lifelong Learning">
                          Lifelong Learning
                        </option>
                        <option value="any">Any</option>
                      </select>
                    </div>

                    <div>
                      <label className="block mb-1">
                        Education Details<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="education_details"
                        value={formData.education_details}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="Education Details"
                      />
                    </div>

                    <div>
                      <label className="block mb-1">Occupation</label>
                      <select
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        name="occupation"
                        value={formData.occupation}
                        onChange={handleInputChange}
                      >
                        <option value="">Occupation</option>
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                        <option value="engineer">Engineer</option>
                        <option value="doctor">Doctor</option>
                        <option value="nurse">Nurse</option>
                        <option value="programmer">Programmer</option>
                        <option value="artist">Artist</option>
                        <option value="scientist">Scientist</option>
                        <option value="lawyer">Lawyer</option>
                        <option value="chef">Chef</option>
                        <option value="entrepreneur">Entrepreneur</option>
                        <option value="accountant">Accountant</option>
                        <option value="writer">Writer</option>
                        <option value="police Officer">Police Officer</option>
                        <option value="firefighter">Firefighter</option>
                        <option value="pilot">Pilot</option>
                        <option value="architect">Architect</option>
                        <option value="pharmacist">Pharmacist</option>
                        <option value="salesperson">Salesperson</option>
                        <option value="athlete">Athlete</option>
                        <option value="musician">Musician</option>
                        <option value="journalist">Journalist</option>
                        <option value="psychologist">Psychologist</option>
                        <option value="chef">Chef</option>
                        <option value="mechanic">Mechanic</option>
                        <option value="designer">Designer</option>
                        <option value="veterinarian">Veterinarian</option>
                        <option value="electrician">Electrician</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block mb-1">
                        Occupation Details
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="occupation_details"
                        value={formData.occupation_details}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="Occupation Details"
                      />
                    </div>

                    <div>
                      <label className="block mb-1">Employed In</label>
                      <select
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        name="employed_in"
                        value={formData.employed_in}
                        onChange={handleInputChange}
                      >
                        <option value="">Employed In</option>
                        <option value="Government">Government</option>
                        <option value="Private Sector">Private Sector</option>
                        <option value="Non Profit">
                          Non-Profit Organization
                        </option>
                        <option value="Education">Education</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Technology">Technology/IT</option>
                        <option value="Finance">Finance/Banking</option>
                        <option value="Manufacturing">Manufacturing</option>
                        <option value="Retail">Retail</option>
                        <option value="Hospitality">Hospitality</option>
                        <option value="Construction">Construction</option>
                        <option value="Media">Media/Entertainment</option>
                        <option value="Transportation">
                          Transportation/Logistics
                        </option>
                        <option value="Real Estate">Real Estate</option>
                        <option value="Agriculture">Agriculture</option>
                        <option value="Arts">Arts/Culture</option>
                        <option value="Consulting">Consulting</option>
                        <option value="Telecommunications">
                          Telecommunications
                        </option>
                        <option value="Energy">Energy</option>
                        <option value="Environment">
                          Environmental Services
                        </option>
                        <option value="Legal">Legal Services</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block mb-1">
                        Annual Income<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="annual_income"
                        value={formData.annual_income}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="Annual Income"
                      />
                    </div>
                  </div>
                </div>

                {/* Partner Preferences Section */}
      <div className="mb-6">
        <h6 className="text-center font-medium text-lg mb-3">
          Edit Partner Preferences
        </h6>
        <hr className="mb-4" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block mb-1">
              Country of Resident<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="partner_country_of_resident"
              value={formData.partner_country_of_resident}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Country of Resident"
            />
          </div>

          <div>
            <label className="block mb-1">Resident Status</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              name="partner_resident_status"
              value={formData.partner_resident_status}
              onChange={handleInputChange}
            >
              <option value="">Resident Status</option>
              <option value="citizen">Citizen</option>
              <option value="permanent_resident">Permanent Resident</option>
              <option value="temporary_resident">Temporary Resident</option>
              <option value="visitor">Visitor</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">Education</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              name="partner_education"
              value={formData.partner_education}
              onChange={handleInputChange}
            >
              <option value="">Education</option>
              <option value="Primary">Primary Education</option>
              <option value="Kinder garten">Kindergarten/Preschool</option>
              <option value="Grade 1 to 5">Grade 1 to Grade 5</option>
              <option value="Middle School">Middle School/Junior High School</option>
              <option value="Grade 6 to 8">Grade 6/7 to Grade 8/9</option>
              <option value="High School">High School/Senior High School</option>
              <option value="Grade 9 to 12">Grade 9/10 to Grade 12</option>
              <option value="Higher Secondary">Higher Secondary Education</option>
              <option value="Vocational Training">Vocational Training</option>
              <option value="Diploma Programs">Diploma Programs</option>
              <option value="Associates Degree">Associate's Degree</option>
              <option value="Undergraduate">Undergraduate Education</option>
              <option value="Bachelors Degree">Bachelor's Degree</option>
              <option value="Graduate">Graduate Education</option>
              <option value="Masters Degree">Master's Degree</option>
              <option value="Doctoral Degree">Doctoral Degree (Ph.D. or equivalent)</option>
              <option value="Post Doc Research">Post-Doctoral Research</option>
              <option value="Professional Education">Professional Education</option>
              <option value="Certifications">Professional Certifications</option>
              <option value="Specialized Training">Specialized Training</option>
              <option value="Continuing Education">Continuing Education</option>
              <option value="Online Distance Education">Online and Distance Education</option>
              <option value="Lifelong Learning">Lifelong Learning</option>
              <option value="any">Any</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">Occupation</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              name="partner_occupation"
              value={formData.partner_occupation}
              onChange={handleInputChange}
            >
              <option value="">Occupation</option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="engineer">Engineer</option>
              <option value="doctor">Doctor</option>
              <option value="nurse">Nurse</option>
              <option value="programmer">Programmer</option>
              <option value="artist">Artist</option>
              <option value="scientist">Scientist</option>
              <option value="lawyer">Lawyer</option>
              <option value="chef">Chef</option>
              <option value="entrepreneur">Entrepreneur</option>
              <option value="accountant">Accountant</option>
              <option value="writer">Writer</option>
              <option value="police Officer">Police Officer</option>
              <option value="firefighter">Firefighter</option>
              <option value="pilot">Pilot</option>
              <option value="architect">Architect</option>
              <option value="pharmacist">Pharmacist</option>
              <option value="salesperson">Salesperson</option>
              <option value="athlete">Athlete</option>
              <option value="musician">Musician</option>
              <option value="journalist">Journalist</option>
              <option value="psychologist">Psychologist</option>
              <option value="mechanic">Mechanic</option>
              <option value="designer">Designer</option>
              <option value="veterinarian">Veterinarian</option>
              <option value="electrician">Electrician</option>
              <option value="Other">Other</option>
              <option value="Any">Any</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">
              Annual Income<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="partner_annual_income"
              value={formData.partner_annual_income}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Annual Income"
            />
          </div>

          <div>
            <label className="block mb-1">Marital Status</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              name="partner_marital_status"
              value={formData.partner_marital_status}
              onChange={handleInputChange}
            >
              <option value="">Marital Status</option>
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="divorced">Divorced</option>
              <option value="widowed">Widowed</option>
              <option value="separated">Separated</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">
              Minimum Age<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="partner_minimum_age"
              value={formData.partner_minimum_age}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Minimum Age"
            />
          </div>

          <div>
            <label className="block mb-1">
              Maximum Age<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="partner_maximum_age"
              value={formData.partner_maximum_age}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Maximum Age"
            />
          </div>

          <div>
            <label className="block mb-1">
              Minimum Height<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="partner_minimum_height"
              value={formData.partner_minimum_height}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Minimum Height"
            />
          </div>

          <div>
            <label className="block mb-1">
              Maximum Height<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="partner_maximum_height"
              value={formData.partner_maximum_height}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Maximum Height"
            />
          </div>

          <div>
            <label className="block mb-1">Physical Status</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              name="partner_physical_status"
              value={formData.partner_physical_status}
              onChange={handleInputChange}
            >
              <option value="">Physical Status</option>
              <option value="single">Single</option>
              <option value="normal">Normal</option>
              <option value="disabled">Disabled</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">Mother Tongue</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              name="partner_mother_tongue"
              value={formData.partner_mother_tongue}
              onChange={handleInputChange}
            >
              <option value="">Mother Tongue</option>
              <option value="tamil">Tamil</option>
              <option value="sinhala">Sinhala</option>
              <option value="english">English</option>
              <option value="other">Other</option>
              <option value="Any">Any</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">Religion</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              name="partner_religion"
              value={formData.partner_religion}
              onChange={handleInputChange}
            >
              <option value="">Religion</option>
              <option value="hindu">Hindu</option>
              <option value="christian">Christian</option>
              <option value="muslim">Muslim</option>
              <option value="buddhist">Buddhist</option>
              <option value="sikh">Sikh</option>
              <option value="jewish">Jewish</option>
              <option value="other">Other</option>
              <option value="Any">Any</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">Star Sign</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              name="partner_star_sign"
              value={formData.partner_star_sign}
              onChange={handleInputChange}
            >
              <option value="">Star Sign</option>
              <option value="அச்வினி (Aswini)">அச்வினி (Aswini)</option>
              <option value="பரணி (Bharani)">பரணி (Bharani)</option>
              <option value="கார்த்திகை (Karthigai)">கார்த்திகை (Karthigai)</option>
              <option value="ரோகிணி (Rohini)">ரோகிணி (Rohini)</option>
              <option value="மிருகசீரிடம் (Mrigasiridam)">மிருகசீரிடம் (Mrigasiridam)</option>
              <option value="திருவாதிரை (Thiruvathirai)">திருவாதிரை (Thiruvathirai)</option>
              <option value="புனர்பூசம் (Punarpoosam)">புனர்பூசம் (Punarpoosam)</option>
              <option value="பூசம் (Poosam)">பூசம் (Poosam)</option>
              <option value="ஆயில்யம் (Ayilyam)">ஆயில்யம் (Ayilyam)</option>
              <option value="மகம் (Magam)">மகம் (Magam)</option>
              <option value="பூரம் (Pooram)">பூரம் (Pooram)</option>
              <option value="உத்திரம் (Uthiram)">உத்திரம் (Uthiram)</option>
              <option value="ஹஸ்தம் (Hastham)">ஹஸ்தம் (Hastham)</option>
              <option value="சித்திரை (Chithirai)">சித்திரை (Chithirai)</option>
              <option value="சுவாதி (Swathi)">சுவாதி (Swathi)</option>
              <option value="விசாகம் (Visakam)">விசாகம் (Visakam)</option>
              <option value="அனுஷம் (Anusham)">அனுஷம் (Anusham)</option>
              <option value="கேட்டை (Kettai)">கேட்டை (Kettai)</option>
              <option value="மூலம் (Moolam)">மூலம் (Moolam)</option>
              <option value="பூராடம் (Pooradam)">பூராடம் (Pooradam)</option>
              <option value="உத்திராடம் (Uthiradam)">உத்திராடம் (Uthiradam)</option>
              <option value="திரைகடகம் (Thiruvonam)">திரைகடகம் (Thiruvonam)</option>
              <option value="அவிட்டம் (Avittam)">அவிட்டம் (Avittam)</option>
              <option value="சதயம் (Sathayam)">சதயம் (Sathayam)</option>
              <option value="பூரட்டாதி (Purattadhi)">பூரட்டாதி (Purattadhi)</option>
              <option value="உத்திரட்டாதி (Uthiraadhi)">உத்திரட்டாதி (Uthiraadhi)</option>
              <option value="ரேவதி (Revadhi)">ரேவதி (Revadhi)</option>
              <option value="Any">Any</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">Caste</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              name="partner_cast"
              value={formData.partner_cast}
              onChange={handleInputChange}
            >
              <option value="">Caste</option>
              <option value="Mixed Jaffna Vellalar">Mixed Jaffna Vellalar</option>
              <option value="Vellalar">Vellalar</option>
              <option value="Other Vellatar">Other Vellatar</option>
              <option value="Viswakulam">Viswakulam</option>
              <option value="Mukkulanthor">Mukkulanthor</option>
              <option value="Koviyor">Koviyor</option>
              <option value="Kurukulam">Kurukulam</option>
              <option value="Bhramin">Bhramin</option>
              <option value="Kounder">Kounder</option>
              <option value="Veera Saiva Vellalar">Veera Saiva Vellalar</option>
              <option value="Kujavar">Kujavar</option>
              <option value="Chettiar">Chettiar</option>
              <option value="Devar">Devar</option>
              <option value="Kaller">Kaller</option>
              <option value="Malayalee">Malayalee</option>
              <option value="Mukkuwar">Mukkuwar</option>
              <option value="Muthaliyar">Muthaliyar</option>
              <option value="Naiyudu">Naiyudu</option>
              <option value="Nadar">Nadar</option>
              <option value="Pallar">Pallar</option>
              <option value="Parawar">Parawar</option>
              <option value="Senkunthar">Senkunthar</option>
              <option value="Siviyar">Siviyar</option>
              <option value="Dadar">Dadar</option>
              <option value="Sayakkarar">Sayakkarar</option>
              <option value="Nalavar">Nalavar</option>
              <option value="Agamiliyar">Agamiliyar</option>
              <option value="Dobi">Dobi</option>
              <option value="Other">Other</option>
              <option value="Any">Any</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">Eating Habits</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              name="partner_eating_habit"
              value={formData.partner_eating_habit}
              onChange={handleInputChange}
            >
              <option value="">Eating Habits</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="nonVegetarian">Non-Vegetarian</option>
              <option value="pescatarian">Pescatarian</option>
              <option value="flexitarian">Flexitarian</option>
              <option value="rawFood">Raw Food</option>
              <option value="glutenFree">Gluten-Free</option>
              <option value="lactoseFree">Lactose-Free</option>
              <option value="organic">Organic</option>
              <option value="halal">Halal</option>
              <option value="kosher">Kosher</option>
              <option value="Any">Any</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">Smoking Habits</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              name="partner_smoking_habit"
              value={formData.partner_smoking_habit}
              onChange={handleInputChange}
            >
              <option value="">Smoking Habits</option>
              <option value="nonSmoker">Non-Smoker</option>
              <option value="occasionalSmoker">Occasional Smoker</option>
              <option value="regularSmoker">Regular Smoker</option>
              <option value="quitSmoking">Former Smoker (Quit)</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">Drinking Habits</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              name="partner_drinking_habit"
              value={formData.partner_drinking_habit}
              onChange={handleInputChange}
            >
              <option value="">Drinking Habits</option>
              <option value="nonDrinker">Non-Drinker</option>
              <option value="occasionalDrinker">Occasional Drinker</option>
              <option value="socialDrinker">Social Drinker</option>
              <option value="regularDrinker">Regular Drinker</option>
              <option value="quitDrinking">Former Drinker (Quit)</option>
            </select>
          </div>
        </div>
      </div>

                {/* Family Details Section */}
                <div className="mb-6">
                  <h6 className="text-center font-medium text-lg mb-3">
                    Edit Family Details
                  </h6>
                  <hr className="mb-4" />

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block mb-1">Family Value</label>
                      <select
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        name="family_value"
                        value={formData.family_value}
                        onChange={handleInputChange}
                      >
                        <option value="">Family Value</option>
                        <option value="conservative">Conservative</option>
                        <option value="moderate">Moderate</option>
                        <option value="modern">Modern</option>
                      </select>
                    </div>

                    <div>
                      <label className="block mb-1">Family Type</label>
                      <select
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        name="family_type"
                        value={formData.family_type}
                        onChange={handleInputChange}
                      >
                        <option value="">Family Type</option>
                        <option value="joint">Joint Family</option>
                        <option value="nuclear">Nuclear Family</option>
                        <option value="others">Others</option>
                      </select>
                    </div>

                    <div>
                      <label className="block mb-1">Family Status</label>
                      <select
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        name="family_status"
                        value={formData.family_status}
                        onChange={handleInputChange}
                      >
                        <option value="">Family Status</option>
                        <option value="low">Lower Class</option>
                        <option value="lowerMiddle">Lower Middle Class</option>
                        <option value="middle">Middle Class</option>
                        <option value="upperMiddle">Upper Middle Class</option>
                        <option value="upper">Upper Class</option>
                      </select>
                    </div>

                    <div>
                      <label className="block mb-1">
                        Fathers Name<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="fathers_name"
                        value={formData.fathers_name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="Fathers Name"
                      />
                    </div>

                    <div>
                      <label className="block mb-1">
                        Fathers Occupation
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="fathers_occupation"
                        value={formData.fathers_occupation}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="Fathers Occupation"
                      />
                    </div>

                    <div>
                      <label className="block mb-1">
                        Fathers Native Place
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="fathers_native_place"
                        value={formData.fathers_native_place}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="Fathers Native Place"
                      />
                    </div>

                    <div>
                      <label className="block mb-1">
                        Mothers Name<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="mothers_name"
                        value={formData.mothers_name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="Mothers Name"
                      />
                    </div>

                    <div>
                      <label className="block mb-1">
                        Mothers Occupation
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="mothers_occupation"
                        value={formData.mothers_occupation}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="Mothers Occupation"
                      />
                    </div>

                    <div>
                      <label className="block mb-1">
                        Mothers Native Place
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name=".mothers_native_place"
                        value={formData.mothers_native_place}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="Mothers Native Place"
                      />
                    </div>

                    <div>
                      <label className="block mb-1">
                        Brothers<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="brothers"
                        value={formData.brothers}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="Brothers"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-4 mt-6 border-t pt-4">
            <button
              type="button"
              onClick={() => setShowEditModal(false)}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
            >
              Close
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              disabled={isUpdating} // Add this state if you want to disable during update
            >
              {isUpdating ? 'Updating...' : 'Update Profile'}
            </button>
          </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerProfile;