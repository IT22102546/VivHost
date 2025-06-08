import express from "express";
import {
  getAdminPermissions,
  getProfiles,
  searchProfiles,
  deleteProfile,
  updateProfileStatus,
  getProfileDetails,
  getBookingsCount,
  getInterestsCount,
  getTotalEarnings,
  getInterests,
  searchInterests,
  deleteInterest,
  getProfileInterests,
  searchProfileInterests,
  deleteProfileInterest,
  getBookings,
  searchBookings,
  deleteBooking,
  processPayment,
  updatePackageStatus,
  updateExpiryDate,
 
} from "../controllers/admin.controller.js";


const router = express.Router();

// Admin permission check route
router.get("/permissions/:userId", getAdminPermissions);

// Profile management routes
router.get("/profiles", getProfiles);
router.get("/profiles/search", searchProfiles);
router.delete("/profiles/:id", deleteProfile);
router.put("/profiles/:id/status", updateProfileStatus);
router.get("/profiles/:id", getProfileDetails);
//router.put("/profiles/:id", updateProfile);

// Stats routes
router.get("/bookings/count", getBookingsCount);
router.get("/interests/count", getInterestsCount);
router.get("/earnings", getTotalEarnings);

//intrest
router.get("/interests", getInterests);
router.get("/interests/search", searchInterests);
router.delete("/interests/:id", deleteInterest);

//profile interest
router.get("/profile-interests", getProfileInterests);
router.get("/profile-interests/search", searchProfileInterests);
router.delete("/profile-interests/:id", deleteProfileInterest);

// Bookings routes
router.get("/bookings", getBookings);
router.get("/bookings/search", searchBookings);
router.delete("/bookings/:id", deleteBooking);
router.put("/bookings/:id/pay", processPayment);
router.put("/bookings/:id/status", updatePackageStatus);
router.put("/bookings/:id/expiry", updateExpiryDate);

export default router;