import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mysql from "mysql2/promise";
// import db from "./db.js"; // Ensure this is your database connection file

const router = express.Router();
const SECRET_KEY = "your_secret_key"; // Use environment variables instead


// const db = await mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "Password@123",
//     database: "ecom"
// });




  const db = await mysql.createConnection({
    host: 'gondola.proxy.rlwy.net',
    port: 40948,
    user: 'root',
    password: 'HVbWzknILwIQeJJHEDPqfGMAjeaycSKh',
    database: 'railway'
  });



// Signup route
// router.post("/signup", async (req, res) => {
//     const { name, email, password } = req.body;

//     try {
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const query = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
//         await db.query(query, [name, email, hashedPassword]);

//         res.status(201).json({ message: "User registered successfully" });
//     } catch (error) {
//         res.status(500).json({ error: "Signup failed" });
//     }
// });

// Login route
// router.post("/login", async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         const [user] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

//         if (!user.length) {
//             return res.status(401).json({ message: "Invalid email or password" });
//         }

//         const isPasswordValid = await bcrypt.compare(password, user[0].password);

//         if (!isPasswordValid) {
//             return res.status(401).json({ message: "Invalid email or password" });
//         }

//         const token = jwt.sign({ userId: user[0].id }, SECRET_KEY, { expiresIn: "1h" });

//         res.json({ message: "Login successful", token });
//     } catch (error) {
//         res.status(500).json({ error: "Login failed" });
//     }
// });


router.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if user already exists
        const [existingUser] = await db.query("SELECT * FROM Users WHERE email = ?", [email]);

        if (existingUser.length) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password and save user
        const hashedPassword = await bcrypt.hash(password, 10);

        const now = new Date();

        // await db.query("INSERT INTO Users (name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword]);
        await db.query("INSERT INTO Users (name, email, password, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)",[name, email, hashedPassword, now, now]);

        res.status(201).json({ message: "Signup successful!" });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});








router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists in the database
        const [users] = await db.query("SELECT * FROM Users WHERE email = ?", [email]);

        if (users.length === 0) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const user = users[0];

        // Compare hashed password with entered password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id, email: user.email }, "your_secret_key", { expiresIn: "1h" });

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});










export default router;
