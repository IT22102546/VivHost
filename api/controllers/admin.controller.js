import db from "../utils/dbconfig.js";
import NodeCache from "node-cache";

// Create a cache with 5 minute TTL
const cache = new NodeCache({ stdTTL: 300 });

// Helper function for pagination
const getPagination = (page = 1, size = 10) => {
  const limit = size;
  const offset = (page - 1) * size;
  return { limit, offset };
};

// Helper to clear relevant caches
const clearRelevantCaches = () => {
  const keys = cache.keys();
  keys.forEach(key => {
    if (key.startsWith('profiles_') || 
        key.startsWith('bookings_') || 
        key.startsWith('interests_') ||
        key.startsWith('profile_interests_')) {
      cache.del(key);
    }
  });
  cache.del(['bookings_count', 'interests_count', 'total_earnings']);
};

// Admin Permission Check
export const getAdminPermissions = async (req, res) => {
  try {
    const { userId } = req.params;
    const cacheKey = `admin_permissions_${userId}`;
    
    const cachedData = cache.get(cacheKey);
    if (cachedData) return res.status(200).json(cachedData);

    const [user] = await db.execute(
      "SELECT user_type_id FROM users WHERE id = ? LIMIT 1",
      [userId]
    );

    if (user.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const result = { isAdmin: user[0].user_type_id === 1 };
    cache.set(cacheKey, result);
    res.status(200).json(result);
  } catch (error) {
    console.error("Admin permission error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Profile Controllers
export const getProfiles = async (req, res) => {
  try {
    const { page = 1, size = 10 } = req.query;
    const { limit, offset } = getPagination(page, size);
    const cacheKey = `profiles_${page}_${size}`;

    const cachedData = cache.get(cacheKey);
    if (cachedData) return res.status(200).json(cachedData);

    const [rows] = await db.execute(`
      SELECT 
        id, member_id, first_name, last_name, email, 
        contact_no, status, created_at 
      FROM customers
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `, [limit, offset]);

    const [countRows] = await db.execute("SELECT COUNT(*) as total FROM customers");
    const total = countRows[0].total;

    const result = {
      data: rows,
      pagination: {
        total,
        page: parseInt(page),
        size: parseInt(size),
        totalPages: Math.ceil(total / size)
      }
    };

    cache.set(cacheKey, result);
    res.status(200).json(result);
  } catch (error) {
    console.error("Get profiles error:", error);
    res.status(500).json({ error: "Failed to fetch profiles" });
  }
};

export const searchProfiles = async (req, res) => {
  try {
    const { search, page = 1, size = 10 } = req.query;
    const { limit, offset } = getPagination(page, size);
    const cacheKey = `profile_search_${search}_${page}_${size}`;

    const cachedData = cache.get(cacheKey);
    if (cachedData) return res.status(200).json(cachedData);

    if (!search || search.trim() === "") {
      return res.status(400).json({ error: "Search query is required" });
    }

    const searchTerm = `%${search}%`;
    const [rows] = await db.execute(
      `SELECT 
        id, member_id, first_name, last_name, email, 
        contact_no, status, created_at 
       FROM customers 
       WHERE first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR contact_no LIKE ?
       LIMIT ? OFFSET ?`,
      [searchTerm, searchTerm, searchTerm, searchTerm, limit, offset]
    );

    const [countRows] = await db.execute(
      `SELECT COUNT(*) as total FROM customers 
       WHERE first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR contact_no LIKE ?`,
      [searchTerm, searchTerm, searchTerm, searchTerm]
    );

    const result = {
      data: rows,
      pagination: {
        total: countRows[0].total,
        page: parseInt(page),
        size: parseInt(size),
        totalPages: Math.ceil(countRows[0].total / size)
      }
    };

    cache.set(cacheKey, result);
    res.status(200).json(result);
  } catch (error) {
    console.error("Search profiles error:", error);
    res.status(500).json({ error: "Failed to search profiles" });
  }
};

export const getProfileDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const cacheKey = `profile_details_${id}`;

    const cachedData = cache.get(cacheKey);
    if (cachedData) return res.status(200).json(cachedData);

    const [rows] = await db.execute(
      `SELECT 
        id, member_id, first_name, last_name, email, contact_no, whatsapp_no,
        d_o_b, age, birth_place, address, birth_time, maritial_status, height,
        weight, complexion, physical_status, cast, religion, star_sign,
        family_value, family_type, family_status, fathers_name, fathers_occupation,
        mothers_name, mothers_occupation, brothers, sisters,
        country_of_birth, city_of_birth, country_of_resident, city_of_resident,
        country_of_citizenship, eating_habit, smoking_habit, drinking_habit,
        primary_school, secondary_school, education, occupation, annual_income,
        profile_img, img_1, img_2, chart_img,
        partner_country_of_resident, partner_resident_status, partner_education,
        partner_occupation, partner_annual_income, partner_marital_status,
        partner_minimum_age, partner_maximum_age, partner_minimum_height,
        partner_maximum_height, partner_physical_status, partner_mother_tongue,
        partner_religion, partner_star_sign, partner_cast, partner_eating_habit,
        partner_smoking_habit, partner_drinking_habit,
        status, created_at
       FROM customers WHERE id = ? LIMIT 1`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Profile not found" });
    }

    cache.set(cacheKey, rows[0]);
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Get profile details error:", error);
    res.status(500).json({ error: "Failed to fetch profile details" });
  }
};

export const deleteProfile = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    
    const { id } = req.params;

    const [check] = await connection.execute(
      "SELECT id FROM customers WHERE id = ? LIMIT 1",
      [id]
    );

    if (check.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: "Profile not found" });
    }

    await connection.execute(
      "DELETE FROM booked_packages WHERE customer_id = ?",
      [id]
    );

    await connection.execute(
      "DELETE FROM profile_intresteds WHERE customer_id = ?",
      [id]
    );

    const [result] = await connection.execute(
      "DELETE FROM customers WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(500).json({ error: "Failed to delete profile" });
    }

    await connection.commit();
    clearRelevantCaches();
    res.status(200).json({ success: true });
  } catch (error) {
    await connection.rollback();
    console.error("Delete profile error:", error);
    res.status(500).json({ error: "Failed to delete profile" });
  } finally {
    connection.release();
  }
};

export const updateProfileStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["single", "fixed"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const [result] = await db.execute(
      "UPDATE customers SET status = ? WHERE id = ?",
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Profile not found" });
    }

    clearRelevantCaches();
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Update profile status error:", error);
    res.status(500).json({ error: "Failed to update profile status" });
  }
};

// Bookings Controllers
export const getBookingsCount = async (req, res) => {
  try {
    const cacheKey = "bookings_count";
    const cachedData = cache.get(cacheKey);
    if (cachedData) return res.status(200).json(cachedData);

    const [rows] = await db.execute("SELECT COUNT(*) as count FROM booked_packages");
    const result = { count: rows[0].count };
    
    cache.set(cacheKey, result);
    res.status(200).json(result);
  } catch (error) {
    console.error("Get bookings count error:", error);
    res.status(500).json({ error: "Failed to fetch bookings count" });
  }
};

export const getBookings = async (req, res) => {
  try {
    const { page = 1, size = 10 } = req.query;
    const { limit, offset } = getPagination(page, size);
    const cacheKey = `bookings_${page}_${size}`;

    const cachedData = cache.get(cacheKey);
    if (cachedData) return res.status(200).json(cachedData);

    const [rows] = await db.execute(`
      SELECT bp.id, bp.package, bp.income, bp.balance, bp.package_plan, bp.exp_date,
             c.id as customer_id, c.first_name, c.last_name, c.contact_no, c.whatsapp_no 
      FROM booked_packages bp
      JOIN customers c ON bp.customer_id = c.id
      ORDER BY bp.created_at DESC
      LIMIT ? OFFSET ?
    `, [limit, offset]);

    const [countRows] = await db.execute("SELECT COUNT(*) as total FROM booked_packages");
    const total = countRows[0].total;

    const result = {
      data: rows,
      pagination: {
        total,
        page: parseInt(page),
        size: parseInt(size),
        totalPages: Math.ceil(total / size)
      }
    };

    cache.set(cacheKey, result);
    res.status(200).json(result);
  } catch (error) {
    console.error("Get bookings error:", error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};

export const searchBookings = async (req, res) => {
  try {
    const { search, page = 1, size = 10 } = req.query;
    const { limit, offset } = getPagination(page, size);
    const cacheKey = `booking_search_${search}_${page}_${size}`;

    const cachedData = cache.get(cacheKey);
    if (cachedData) return res.status(200).json(cachedData);

    if (!search || search.trim() === "") {
      return res.status(400).json({ error: "Search query is required" });
    }

    const searchTerm = `%${search}%`;
    const [rows] = await db.execute(
      `SELECT bp.id, bp.package, bp.income, bp.balance, bp.package_plan, bp.exp_date,
              c.id as customer_id, c.first_name, c.last_name, c.contact_no, c.whatsapp_no 
       FROM booked_packages bp
       JOIN customers c ON bp.customer_id = c.id
       WHERE c.first_name LIKE ? OR c.last_name LIKE ? OR c.contact_no LIKE ? 
         OR c.whatsapp_no LIKE ? OR bp.package LIKE ?
       LIMIT ? OFFSET ?`,
      [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, limit, offset]
    );

    const [countRows] = await db.execute(
      `SELECT COUNT(*) as total FROM booked_packages bp
       JOIN customers c ON bp.customer_id = c.id
       WHERE c.first_name LIKE ? OR c.last_name LIKE ? OR c.contact_no LIKE ? 
         OR c.whatsapp_no LIKE ? OR bp.package LIKE ?`,
      [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm]
    );

    const result = {
      data: rows,
      pagination: {
        total: countRows[0].total,
        page: parseInt(page),
        size: parseInt(size),
        totalPages: Math.ceil(countRows[0].total / size)
      }
    };

    cache.set(cacheKey, result);
    res.status(200).json(result);
  } catch (error) {
    console.error("Search bookings error:", error);
    res.status(500).json({ error: "Failed to search bookings" });
  }
};

export const deleteBooking = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    
    const { id } = req.params;

    const [check] = await connection.execute(
      "SELECT id FROM booked_packages WHERE id = ? LIMIT 1",
      [id]
    );

    if (check.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: "Booking not found" });
    }

    const [result] = await connection.execute(
      "DELETE FROM booked_packages WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(500).json({ error: "Failed to delete booking" });
    }

    await connection.commit();
    clearRelevantCaches();
    res.status(200).json({ success: true });
  } catch (error) {
    await connection.rollback();
    console.error("Delete booking error:", error);
    res.status(500).json({ error: "Failed to delete booking" });
  } finally {
    connection.release();
  }
};

export const processPayment = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    
    const { id } = req.params;
    const { fullPayment } = req.body;

    const [booking] = await connection.execute(
      "SELECT * FROM booked_packages WHERE id = ? LIMIT 1",
      [id]
    );

    if (booking.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: "Booking not found" });
    }

    if (fullPayment) {
      const newInstallAmount = parseFloat(booking[0].install_amount) + parseFloat(booking[0].balance);
      await connection.execute(
        "UPDATE booked_packages SET balance = '0', install_amount = ? WHERE id = ?",
        [newInstallAmount.toString(), id]
      );
    }

    await connection.commit();
    clearRelevantCaches();
    res.status(200).json({ success: true });
  } catch (error) {
    await connection.rollback();
    console.error("Process payment error:", error);
    res.status(500).json({ error: "Failed to process payment" });
  } finally {
    connection.release();
  }
};

export const updatePackageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["Basic Plan", "Standard Plan", "Premium Plan", "Ultimate Plan"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const [result] = await db.execute(
      "UPDATE booked_packages SET package_plan = ? WHERE id = ?",
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }

    clearRelevantCaches();
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Update package status error:", error);
    res.status(500).json({ error: "Failed to update package status" });
  }
};

export const updateExpiryDate = async (req, res) => {
  try {
    const { id } = req.params;
    const { exp_date } = req.body;

    const [result] = await db.execute(
      "UPDATE booked_packages SET exp_date = ? WHERE id = ?",
      [exp_date, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }

    clearRelevantCaches();
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Update expiry date error:", error);
    res.status(500).json({ error: "Failed to update expiry date" });
  }
};

// Interests Controllers
export const getInterestsCount = async (req, res) => {
  try {
    const cacheKey = "interests_count";
    const cachedData = cache.get(cacheKey);
    if (cachedData) return res.status(200).json(cachedData);

    const [rows] = await db.execute("SELECT COUNT(*) as count FROM intresteds");
    const result = { count: rows[0].count };
    
    cache.set(cacheKey, result);
    res.status(200).json(result);
  } catch (error) {
    console.error("Get interests count error:", error);
    res.status(500).json({ error: "Failed to fetch interests count" });
  }
};

export const getInterests = async (req, res) => {
  try {
    const { page = 1, size = 10 } = req.query;
    const { limit, offset } = getPagination(page, size);
    const cacheKey = `interests_${page}_${size}`;

    const cachedData = cache.get(cacheKey);
    if (cachedData) return res.status(200).json(cachedData);

    const [rows] = await db.execute(
      "SELECT * FROM intresteds ORDER BY created_at DESC LIMIT ? OFFSET ?",
      [limit, offset]
    );

    const [countRows] = await db.execute("SELECT COUNT(*) as total FROM intresteds");
    const total = countRows[0].total;

    const result = {
      data: rows,
      pagination: {
        total,
        page: parseInt(page),
        size: parseInt(size),
        totalPages: Math.ceil(total / size)
      }
    };

    cache.set(cacheKey, result);
    res.status(200).json(result);
  } catch (error) {
    console.error("Get interests error:", error);
    res.status(500).json({ error: "Failed to fetch interests" });
  }
};

export const searchInterests = async (req, res) => {
  try {
    const { search, page = 1, size = 10 } = req.query;
    const { limit, offset } = getPagination(page, size);
    const cacheKey = `interest_search_${search}_${page}_${size}`;

    const cachedData = cache.get(cacheKey);
    if (cachedData) return res.status(200).json(cachedData);

    if (!search || search.trim() === "") {
      return res.status(400).json({ error: "Search query is required" });
    }

    const searchTerm = `%${search}%`;
    const [rows] = await db.execute(
      "SELECT * FROM intresteds WHERE name LIKE ? OR email LIKE ? LIMIT ? OFFSET ?",
      [searchTerm, searchTerm, limit, offset]
    );

    const [countRows] = await db.execute(
      "SELECT COUNT(*) as total FROM intresteds WHERE name LIKE ? OR email LIKE ?",
      [searchTerm, searchTerm]
    );

    const result = {
      data: rows,
      pagination: {
        total: countRows[0].total,
        page: parseInt(page),
        size: parseInt(size),
        totalPages: Math.ceil(countRows[0].total / size)
      }
    };

    cache.set(cacheKey, result);
    res.status(200).json(result);
  } catch (error) {
    console.error("Search interests error:", error);
    res.status(500).json({ error: "Failed to search interests" });
  }
};

export const deleteInterest = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    
    const { id } = req.params;

    const [check] = await connection.execute(
      "SELECT id FROM intresteds WHERE id = ? LIMIT 1",
      [id]
    );

    if (check.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: "Interest not found" });
    }

    const [result] = await connection.execute(
      "DELETE FROM intresteds WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(500).json({ error: "Failed to delete interest" });
    }

    await connection.commit();
    clearRelevantCaches();
    res.status(200).json({ success: true });
  } catch (error) {
    await connection.rollback();
    console.error("Delete interest error:", error);
    res.status(500).json({ error: "Failed to delete interest" });
  } finally {
    connection.release();
  }
};

// Profile Interests Controllers
export const getProfileInterests = async (req, res) => {
  try {
    const { page = 1, size = 10 } = req.query;
    const { limit, offset } = getPagination(page, size);
    const cacheKey = `profile_interests_${page}_${size}`;

    const cachedData = cache.get(cacheKey);
    if (cachedData) return res.status(200).json(cachedData);

    const [rows] = await db.execute(`
      SELECT * FROM profile_intresteds 
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `, [limit, offset]);

    const [countRows] = await db.execute("SELECT COUNT(*) as total FROM profile_intresteds");
    const total = countRows[0].total;

    const result = {
      data: rows,
      pagination: {
        total,
        page: parseInt(page),
        size: parseInt(size),
        totalPages: Math.ceil(total / size)
      }
    };

    cache.set(cacheKey, result);
    res.status(200).json(result);
  } catch (error) {
    console.error("Get profile interests error:", error);
    res.status(500).json({ error: "Failed to fetch profile interests" });
  }
};

export const searchProfileInterests = async (req, res) => {
  try {
    const { search, page = 1, size = 10 } = req.query;
    const { limit, offset } = getPagination(page, size);
    const cacheKey = `profile_interest_search_${search}_${page}_${size}`;

    const cachedData = cache.get(cacheKey);
    if (cachedData) return res.status(200).json(cachedData);

    if (!search || search.trim() === "") {
      return res.status(400).json({ error: "Search query is required" });
    }

    const searchTerm = `%${search}%`;
    const [rows] = await db.execute(
      `SELECT * FROM profile_intresteds 
       WHERE customer_name LIKE ? OR mem_id LIKE ? OR profile_name LIKE ? OR profile_mem_id LIKE ?
       LIMIT ? OFFSET ?`,
      [searchTerm, searchTerm, searchTerm, searchTerm, limit, offset]
    );

    const [countRows] = await db.execute(
      `SELECT COUNT(*) as total FROM profile_intresteds 
       WHERE customer_name LIKE ? OR mem_id LIKE ? OR profile_name LIKE ? OR profile_mem_id LIKE ?`,
      [searchTerm, searchTerm, searchTerm, searchTerm]
    );

    const result = {
      data: rows,
      pagination: {
        total: countRows[0].total,
        page: parseInt(page),
        size: parseInt(size),
        totalPages: Math.ceil(countRows[0].total / size)
      }
    };

    cache.set(cacheKey, result);
    res.status(200).json(result);
  } catch (error) {
    console.error("Search profile interests error:", error);
    res.status(500).json({ error: "Failed to search profile interests" });
  }
};

export const deleteProfileInterest = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    
    const { id } = req.params;

    const [check] = await connection.execute(
      "SELECT id FROM profile_intresteds WHERE id = ? LIMIT 1",
      [id]
    );

    if (check.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: "Profile interest not found" });
    }

    const [result] = await connection.execute(
      "DELETE FROM profile_intresteds WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(500).json({ error: "Failed to delete profile interest" });
    }

    await connection.commit();
    clearRelevantCaches();
    res.status(200).json({ success: true });
  } catch (error) {
    await connection.rollback();
    console.error("Delete profile interest error:", error);
    res.status(500).json({ error: "Failed to delete profile interest" });
  } finally {
    connection.release();
  }
};

// Earnings Controller
export const getTotalEarnings = async (req, res) => {
  try {
    const cacheKey = "total_earnings";
    const cachedData = cache.get(cacheKey);
    if (cachedData) return res.status(200).json(cachedData);

    const [result] = await db.execute(
      "SELECT SUM(CAST(income AS DECIMAL(10,2))) AS total FROM booked_packages"
    );

    const response = { amount: result[0].total || 0 };
    cache.set(cacheKey, response);
    res.status(200).json(response);
  } catch (error) {
    console.error("Get total earnings error:", error);
    res.status(500).json({ error: "Failed to fetch total earnings" });
  }
};