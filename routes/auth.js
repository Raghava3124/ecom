import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Sequelize } from "sequelize";
import mysql from "mysql2/promise";
// import db from "./db.js"; // Ensure this is your database connection file

const router = express.Router();
const SECRET_KEY = "your_secret_key"; // Use environment variables instead


// const db = await mysql.createConnection({
//     host: '150.230.134.36',
//     user: 'root',
//     port:3306,
//     password: 'Raghav@123',
//     database: 'ecom'
//   });



//   const db = await mysql.createConnection({
//     host:"150.230.134.36",
//     port:3306,
//     user:"raghav",
//     password:"Raghav@123",
//     database:"raghava"
//   });

// const db = new Sequelize(
//     'raghava',
//     'raghav', // Updated username
//     'Raghav@123', // Updated password
//     {
//         host: '150.230.134.36', // Updated host
//         dialect: 'mysql',
//         logging: false,
//         pool: {
//             max: 5,
//             min: 0,
//             acquire: 30000,
//             idle: 10000
//         }
//     }
// );



// const db = mysql.createPool({
//   host: 'localhost',
//   port: 3306,
//   user: 'root',
//   password: 'Password@123',
//   database: 'ecom',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });

// const db = mysql.createPool({
//   host: 'mainline.proxy.rlwy.net',
//   port: 48545,
//   user: 'root',
//   password: 'sYoqlnefIoidfztNAwQwCrYlqFCOXwnV',
//   database: 'railway',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });

const db = mysql.createPool({
  host: 'switchyard.proxy.rlwy.net',
  port: 29003,
  user: 'root',
  password: 'EeOPsqPycwUkiAJCYYhxcjhVkkmDogpa',
  database: 'railway',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});



// const db = mysql.createPool({
//   host: 'gondola.proxy.rlwy.net',
//   port: 40948,
//   user: 'root',
//   password: 'HVbWzknILwIQeJJHEDPqfGMAjeaycSKh',
//   database: 'railway',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
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
        //await db.query("INSERT INTO Users (name, email, password, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)", [name, email, hashedPassword, now, now]);

        // await db.query(
        //     "INSERT INTO Users (name, email, password, createdAt, updatedAt) VALUES (:name, :email, :password, :createdAt, :updatedAt)",
        //     {
        //         replacements: {
        //             name,
        //             email,
        //             password: hashedPassword,
        //             createdAt: now,
        //             updatedAt: now
        //         },
        //         type: Sequelize.QueryTypes.INSERT
        //     }
        // );

        await db.query(
    "INSERT INTO Users (name, email, password, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)",
    [name, email, hashedPassword, now, now]
);



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
        //const [users] = await db.query("SELECT * FROM Users WHERE email = ?", [email]);
        // const users = await db.query(
        //     "SELECT * FROM Users WHERE email = :email",
        //     {
        //         replacements: { email },
        //         type: Sequelize.QueryTypes.SELECT
        //     }
        // );

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
        const token = jwt.sign({ id: user.id, email: user.email }, "your_secret_key", { expiresIn: "1hr" });

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
