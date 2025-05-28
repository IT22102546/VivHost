import db from "../utils/dbconfig.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import fs from "fs";
import path from "path";


// Update user
export const updateUser = async (req, res, next) => {
  const userId = req.params.id;
  const updateFields = req.body;
  const files = req.files || {};

  console.log("Received update request for user:", userId);
  console.log("Update fields received:", updateFields);
  console.log("Files received:", files);

  try {
    // Password handling (if included)
    if (updateFields.password && updateFields.password !== '') {
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{5,}$/;
      if (!passwordRegex.test(updateFields.password)) {
        return next(
          errorHandler(
            400,
            "Password must be at least 5 characters, include one uppercase letter, one digit, and one symbol."
          )
        );
      }
      updateFields.password = await bcrypt.hash(updateFields.password, 10);
    }

    // Date formatting
    if (updateFields.d_o_b) {
      let parsedDate;
      if (/^\d{4}-\d{2}-\d{2}$/.test(updateFields.d_o_b)) {
        parsedDate = new Date(updateFields.d_o_b);
      } else {
        parsedDate = new Date(updateFields.d_o_b);
      }
      if (isNaN(parsedDate.getTime())) {
        return next(errorHandler(400, "Invalid date format for date of birth."));
      }
      const year = parsedDate.getFullYear();
      const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
      const day = String(parsedDate.getDate()).padStart(2, "0");
      updateFields.d_o_b = `${year}-${month}-${day}`;
    }

    // Process file uploads
    const fileFields = ['profile_img', 'img_1', 'img_2', 'chart_img'];
    const fileUpdates = {};
    
    for (const fieldName of fileFields) {
      if (files[fieldName] && files[fieldName][0]) {
        const file = files[fieldName][0];
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const fileName = `${fieldName}-${uniqueSuffix}${path.extname(file.originalname)}`;
        const uploadPath = path.join('userimg', fileName);
        const absolutePath = path.join(process.cwd(), 'uploads', uploadPath);
        
        // Ensure directory exists
        await fs.promises.mkdir(path.dirname(absolutePath), { recursive: true });
        
        // Move the file
        await fs.promises.rename(file.path, absolutePath);
        
        fileUpdates[fieldName] = uploadPath;
      }
    }

    // Combine all updates
    const allUpdates = {
      ...updateFields,
      ...fileUpdates
    };

    // Define ALL fields that should be updated
    const allFields = [
      'first_name', 'last_name', 'email', 'd_o_b', 'age', 'gender',
      'contact_no', 'address', 'whatsapp_no', 'birth_place', 'birth_time',
      'height', 'weight', 'complexion', 'maritial_status', 'physical_status',
      'religion', 'cast', 'star_sign', 'rasi', 'country_of_birth',
      'city_of_birth', 'country_of_resident', 'city_of_resident',
      'country_of_citizenship', 'eating_habit', 'smoking_habit',
      'drinking_habit', 'primary_school', 'secondary_school', 'education',
      'education_details', 'occupation', 'occupation_details', 'employed_in',
      'annual_income', 'family_value', 'family_type', 'family_status',
      'fathers_name', 'fathers_occupation', 'fathers_native_place',
      'mothers_name', 'mothers_occupation', 'mothers_native_place',
      'brothers', 'married_brothers', 'sisters', 'married_sisters',
      'more_family', 'partner_country_of_resident', 'partner_resident_status',
      'partner_education', 'partner_occupation', 'partner_annual_income',
      'partner_marital_status', 'partner_minimum_age', 'partner_maximum_age',
      'partner_minimum_height', 'partner_maximum_height', 'partner_physical_status',
      'partner_mother_tongue', 'partner_religion', 'partner_star_sign',
      'partner_cast', 'partner_eating_habit', 'partner_smoking_habit',
      'partner_drinking_habit', 'profile_img', 'img_1', 'img_2', 'chart_img'
    ];

    // Build the SET clause for ALL fields
    const setClauses = [];
    const values = [];

    allFields.forEach(field => {
      if (allUpdates[field] !== undefined) {
        setClauses.push(`${field} = ?`);
        values.push(
          allUpdates[field] === '' ? null : allUpdates[field]
        );
      }
    });

    if (setClauses.length === 0) {
      return next(errorHandler(400, "No fields to update"));
    }

    // Add the user ID for the WHERE clause
    values.push(userId);

    const updateQuery = `UPDATE customers SET ${setClauses.join(', ')} WHERE id = ?`;
    
    console.log("Executing FULL update query:", updateQuery);
    console.log("With ALL values:", values);

    const [result] = await db.execute(updateQuery, values);

    if (result.affectedRows === 0) {
      return next(errorHandler(404, "User not found or no changes made."));
    }

    const [user] = await db.execute("SELECT * FROM customers WHERE id = ?", [
      userId,
    ]);
    const { password, ...userDetails } = user[0];

    res.status(200).json({ 
      success: true,
      message: "User updated successfully!",
      user: {
        user: userDetails 
      }
    });

  } catch (error) {
    console.error("Complete update error:", error);
    next(error);
  }
};
// Get user by ID
export const getUser = async (req, res, next) => {
  const userId = req.params.id;

  try {
    const [user] = await db.execute("SELECT * FROM customers WHERE id = ?", [
      userId,
    ]);

    if (user.length === 0) {
      return next(errorHandler(404, "User not found."));
    }

    const { password, ...userDetails } = user[0];
    res.status(200).json(userDetails);
  } catch (error) {
    next(error);
  }
};

// Get matching profiles

// export const getMatchingProfiles = async (req, res) => {
//   try {
//     const userId = req.params.userId;

//     // First get the requesting user's package plan
//     const [userRows] = await db.query(
//       "SELECT package_plan FROM customers WHERE id = ?",
//       [userId]
//     );
//     if (!userRows || userRows.length === 0) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const userPackage = userRows[0].package_plan || "Basic";

//     // Then get the user's preferences
//     const [users] = await db.query("SELECT * FROM customers WHERE id = ?", [
//       userId,
//     ]);
//     const user = users[0];

//     // Build query based on preferences
//     const conditions = [];
//     const queryParams = [];

//     // Helper function to add conditions
//     const addCondition = (field, value, isRange = false) => {
//       if (value !== undefined && value !== null && value !== "") {
//         if (isRange) {
//           conditions.push(`(${field} BETWEEN ? AND ?)`);
//           queryParams.push(value[0], value[1]);
//         } else {
//           conditions.push(`(${field} = ?)`);
//           queryParams.push(value);
//         }
//       }
//     };

//     // Mandatory matching criteria
//     addCondition("cast", user.partner_cast);
//     addCondition("religion", user.partner_religion);
//     addCondition(
//       "height",
//       [user.partner_minimum_height, user.partner_maximum_height],
//       true
//     );
//     addCondition(
//       "age",
//       [user.partner_minimum_age, user.partner_maximum_age],
//       true
//     );

//     // Optional criteria for better matching
//     addCondition("education", user.partner_education);
//     addCondition("occupation", user.partner_occupation);
//     addCondition("annual_income", user.partner_annual_income);
//     addCondition("maritial_status", user.partner_marital_status);
//     addCondition("physical_status", user.partner_physical_status);
//     addCondition("star_sign", user.partner_star_sign);
//     addCondition("eating_habit", user.partner_eating_habit);
//     addCondition("smoking_habit", user.partner_smoking_habit);
//     addCondition("drinking_habit", user.partner_drinking_habit);

//     // Base query - select only appropriate fields based on package
//     let selectFields =
//       "id, member_id, first_name, last_name, age, occupation, country_of_resident, religion";

//     if (userPackage === "Premium") {
//       selectFields +=
//         ", eating_habit, smoking_habit, drinking_habit, family_type, family_value";
//     } else if (userPackage === "Ultimate") {
//       selectFields +=
//         ", education, annual_income, fathers_occupation, mothers_occupation, profile_img, img_1";
//     }

//     let query = `SELECT ${selectFields} FROM customers WHERE id != ?`;
//     queryParams.unshift(userId); // Exclude self

//     if (conditions.length > 0) {
//       query += " AND " + conditions.join(" AND ");
//     }

//     const [matchingProfiles] = await db.query(query, queryParams);

//     // Fallback to just caste if no matches found
//     if (matchingProfiles.length === 0 && user.partner_cast) {
//       const fallbackQuery = `SELECT ${selectFields} FROM customers WHERE cast = ? AND id != ?`;
//       const [fallbackResults] = await db.query(fallbackQuery, [
//         user.partner_cast,
//         userId,
//       ]);
//       return res.status(200).json(fallbackResults);
//     }

//     res.status(200).json(matchingProfiles);
//   } catch (error) {
//     console.error("Error in getMatchingProfiles:", error);
//     res.status(500).json({
//       message: "Error fetching matching profiles",
//       error: error.message,
//     });
//   }
// };

export const getMatchingProfiles = async (req, res) => {
  try {
    const userId = req.params.userId;
    //console.log(userId);

    // Get the requesting user's data
    const [users] = await db.query("SELECT * FROM customers WHERE id = ?", [
      userId,
    ]);
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const user = users[0];

    // Build query based on preferences
    const conditions = [];
    const queryParams = [userId]; // Start with userId to exclude self

    // Helper function to add conditions (modified to handle "Any" option)
    const addCondition = (field, value, isRange = false) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== "" &&
        value !== "Any"
      ) {
        if (isRange) {
          conditions.push(`(${field} BETWEEN ? AND ?)`);
          queryParams.push(value[0], value[1]);
        } else {
          conditions.push(`(${field} = ?)`);
          queryParams.push(value);
        }
      }
    };

    // Mandatory matching criteria (excluding if "Any" is selected)
    if (user.partner_cast !== "Any") {
      addCondition("cast", user.partner_cast);
    }
    if (user.partner_religion !== "Any") {
      addCondition("religion", user.partner_religion);
    }

    // Range conditions (height and age)
    addCondition(
      "height",
      [user.partner_minimum_height, user.partner_maximum_height],
      true
    );
    addCondition(
      "age",
      [user.partner_minimum_age, user.partner_maximum_age],
      true
    );

    // Optional criteria (excluding if "Any" is selected)
    if (user.partner_education !== "Any") {
      addCondition("education", user.partner_education);
    }
    if (user.partner_occupation !== "Any") {
      addCondition("occupation", user.partner_occupation);
    }

    if (user.partner_star_sign !== "Any") {
      addCondition("star_sign", user.partner_star_sign);
    }
    if (user.partner_eating_habit !== "Any") {
      addCondition("eating_habit", user.partner_eating_habit);
    }

    // Always include these conditions (unless you want to make them optional too)
    addCondition("annual_income", user.partner_annual_income);
    addCondition("maritial_status", user.partner_marital_status);
    addCondition("physical_status", user.partner_physical_status);
    addCondition("smoking_habit", user.partner_smoking_habit);
    addCondition("drinking_habit", user.partner_drinking_habit);

    // Build the final query
    let query = `SELECT * FROM customers WHERE id != ?`;
    if (conditions.length > 0) {
      query += " AND " + conditions.join(" AND ");
    }

    const [matchingProfiles] = await db.query(query, queryParams);

    // Fallback to just caste if no matches found (only if caste was specified and not "Any")
    if (
      matchingProfiles.length === 0 &&
      user.partner_cast &&
      user.partner_cast !== "Any"
    ) {
      const fallbackQuery = `SELECT * FROM customers WHERE cast = ? AND id != ?`;
      const [fallbackResults] = await db.query(fallbackQuery, [
        user.partner_cast,
        userId,
      ]);
      return res.status(200).json(fallbackResults);
    }

    res.status(200).json(matchingProfiles);
  } catch (error) {
    console.error("Error in getMatchingProfiles:", error);
    res.status(500).json({
      message: "Error fetching matching profiles",
      error: error.message,
    });
  }
};

// Get specific users by email (example)
export const getUsers = async (req, res, next) => {
  try {
    const [users] = await db.execute("SELECT * FROM customers");
    const sanitizedUsers = users.map(({ password, ...rest }) => rest);
    res.status(200).json(sanitizedUsers);
  } catch (error) {
    next(error);
  }
};

// Book package
export const createBookedPackage = async (req, res, next) => {
  try {
    const {
      customer_id,
      package: packageType,
      pay_type,
      amount,
      install_amount = 0,
      balance = 0,
      income,
      exp_date,
    } = req.body;

    const recipt_img = req.file ? req.file.filename : null;

    if (!customer_id || !packageType || !amount || !pay_type || !income) {
      return next(errorHandler(400, "Missing required fields"));
    }

    const validPaymentTypes = ["full", "installment"];
    if (!validPaymentTypes.includes(pay_type)) {
      return next(errorHandler(400, "Invalid payment type"));
    }

    const validPackages = ["Premium Plan", "Ultimate Plan"];
    if (!validPackages.includes(packageType)) {
      return next(errorHandler(400, "Invalid package type"));
    }

    const packageAmounts = {
      "Premium Plan": 30000,
      "Ultimate Plan": 120000,
    };

    if (parseInt(amount) !== packageAmounts[packageType]) {
      return next(errorHandler(400, "Invalid amount for selected package"));
    }

    if (pay_type === "installment") {
      const installAmount = parseInt(install_amount);
      const remainingBalance = parseInt(balance);

      if (isNaN(installAmount) || installAmount <= 0) {
        return next(errorHandler(400, "Invalid installment amount"));
      }

      if (isNaN(remainingBalance) || remainingBalance <= 0) {
        return next(errorHandler(400, "Invalid balance amount"));
      }

      if (installAmount + remainingBalance !== parseInt(amount)) {
        return next(
          errorHandler(
            400,
            "Installment amounts don't add up to total package amount"
          )
        );
      }
    }

    const [result] = await db.execute(
      `INSERT INTO booked_packages 
       (customer_id, package, pay_type, amount, install_amount, balance, income, recipt_img, exp_date, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        customer_id,
        packageType,
        pay_type,
        amount,
        install_amount,
        balance,
        income,
        recipt_img,
        exp_date || null,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Package booked successfully",
      data: {
        id: result.insertId,
        customer_id,
        package: packageType,
        pay_type,
        amount,
        install_amount,
        balance,
        income,
        exp_date,
        recipt_img,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get latest package for a user
export const getUserPackage = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return next(errorHandler(400, "Missing user ID"));
    }

    const [rows] = await db.execute(
      `SELECT package, amount, exp_date, created_at
       FROM booked_packages
       WHERE customer_id = ?
       ORDER BY created_at DESC
       LIMIT 1`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No package found for this user",
      });
    }

    res.status(200).json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    next(error);
  }
};

// Replace user image (and delete previous one)

export const uploadUserImage = async (req, res, next) => {
  const userId = req.params.id;
  const file = req.file;
  const fieldName = req.body.fieldName;

  // Whitelisted fields that are allowed to be updated
  const allowedFields = ["profile_img", "img_1", "img_2", "chart_img"];

  try {
    if (!file) {
      return next(errorHandler(400, "No file uploaded."));
    }

    if (!fieldName || !allowedFields.includes(fieldName)) {
      return next(errorHandler(400, "Invalid or missing field name."));
    }

    // Get current image path from DB
    const [user] = await db.execute(
      `SELECT \`${fieldName}\` FROM customers WHERE id = ?`,
      [userId]
    );
    
    const currentImagePath = user[0]?.[fieldName];

    // Delete old file if it exists
    if (currentImagePath) {
      const absolutePath = path.join(
        process.cwd(),
        "uploads",
        currentImagePath
      );
      if (fs.existsSync(absolutePath)) {
        fs.unlinkSync(absolutePath);
        console.log("Deleted old image:", absolutePath);
      }
    }

    // Prepare new file path (relative to /uploads)
    const newImagePath = `userimg/${file.filename}`;

    // Update database
    const updateQuery = `UPDATE customers SET \`${fieldName}\` = ? WHERE id = ?`;
    const [result] = await db.execute(updateQuery, [newImagePath, userId]);

    if (result.affectedRows === 0) {
      return next(errorHandler(404, "User not found."));
    }

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully.",
      imagePath: newImagePath,
      fieldName: fieldName
    });
  } catch (error) {
    console.error("Image upload error:", error);
    next(error);
  }
};