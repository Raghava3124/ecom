import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./routes/db.js";
import authRoutes from "./routes/auth.js"; // Import auth routes
import nodemailer from "nodemailer";
import mysql from 'mysql2/promise';
import Cart from "./models/Cart.js";
import paymentRoutes from './routes/payments.js'; // Make sure this file exists
import addressRoutes from './routes/address.js'
import ordersRouter from './routes/orders.js';
import wishlistRoutes from './routes/wishlist.js';
//import mysql from 'mysql2/promise';
// import Wishlist from "./models/Wishlist.js";

// const db = await mysql.createConnection({
//     host: '150.230.134.36',
//     user: 'root',
//     password: 'Raghav@123',
//     database: 'raghava'
//   });
// ✅ Place this right after your imports


// ✅ Use a pool for MySQL (auto-manages connections)
// const db = mysql.createPool({
//   host: '150.230.134.36',
//   port: 3306,
//   user: 'raghav',
//   password: 'Raghav@123',
//   database: 'raghava',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });

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
//   // host: 'gondola.proxy.rlwy.net',
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
  // host: 'gondola.proxy.rlwy.net',
  host: 'switchyard.proxy.rlwy.net',
  port: 29003,
  user: 'root',
  password: 'EeOPsqPycwUkiAJCYYhxcjhVkkmDogpa',
  database: 'railway',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});







// const db = await mysql.createConnection({
//   host: 'sql12.freesqldatabase.com',
//   user: 'sql12782337',
//   password: 'UxbXcKkvCq',
//   database: 'sql12782337'
// });



// const db = await mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   database: process.env.DB_NAME
// });



// const db = await mysql.createConnection({
//   host: 'gondola.proxy.rlwy.net',
//   port: 40948,
//   user: 'root',
//   password: 'HVbWzknILwIQeJJHEDPqfGMAjeaycSKh',
//   database: 'railway'
// });


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


dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Allow JSON data

// Routes
app.use("/api/auth", authRoutes); // Load authentication routes
app.use('/api/address', addressRoutes);




// const paymentRoutes = require('./routes/payments');
// app.use('/api/payments', paymentRoutes);

app.use(express.json());
app.use('/api/payments', paymentRoutes);
app.use('/api/orders', ordersRouter);
// app.use('/', paymentRoutes);

app.use('/wishlist', wishlistRoutes);



// Temporary storage for OTPs
const otpStore = {}; // { email: otp }

// Route to send OTP to email
app.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = generatedOTP; // Store OTP mapped to email

  // let transporter = nodemailer.createTransport({
  //     service: "gmail",
  //     auth: {
  //         user: process.env.EMAIL_USER,
  //         pass: process.env.EMAIL_PASS
  //     }
  // });




  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "storeclothing533001@gmail.com",
      pass: "nylrxjeucgqxabng"
    }
  });





  // let mailOptions = {
  //     from: process.env.EMAIL_USER,
  //     to: email,
  //     subject: "Your OTP Code",
  //     text: `Your OTP is: ${generatedOTP}`
  // };



  let mailOptions = {
    from: "storeclothing533001@gmail.com",
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP is: ${generatedOTP}`
  };



  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ error: "Failed to send email" });
    }
    res.json({ message: "OTP sent successfully!" });
  });
});





app.get('/user/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    // const [rows] = await db.query(
    //   'SELECT id, name, email FROM Users WHERE id = ?',
    //   [userId]
    // );

    const [rows] = await db.query(
      'SELECT id, name, email FROM Users WHERE id = ?',
      [userId]
    );


    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});







// Route to verify OTP
app.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body; // Ensure email is received

  if (!email || !otp) {
    return res.status(400).json({ error: "Email and OTP are required" });
  }

  console.log(`Stored OTP for ${email}: ${otpStore[email]}`); // Debugging
  console.log(`Received OTP: ${otp}`); // Debugging

  if (otpStore[email] && otpStore[email] === otp) {
    delete otpStore[email]; // Remove OTP after successful verification
    return res.json({ message: "OTP Verified Successfully!" });
  } else {
    return res.status(400).json({ error: "Invalid OTP or expired OTP" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  try {
    await sequelize.sync();
    console.log("✅ Database & tables synced...");
  } catch (error) {
    console.error("❌ Database sync error:", error);
  }
});




// Example Express route for fetching the cart for a user
app.get("/api/cart/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Fetch cart items for the user
    const cartItems = await Cart.findAll({
      where: { userId: userId }
    });

    res.json(cartItems);
  } catch (error) {
    console.error("GET /api/cart/:userId error:", error);
    res.status(500).json({ error: "Server error" });
  }
});


// Example Express route for updating the cart for a user

app.put("/api/cart/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // 1. Delete existing cart items for the user
    await Cart.destroy({
      where: { userId: userId }
    });

    // 2. Add new cart items
    const cartItems = req.body;

    const newItems = cartItems.map(item => ({
      userId: userId,
      product_id: item.product_id,
      product_name: item.product_name,
      product_price: item.product_price,
      product_image: item.product_image,
      quantity: item.quantity
    }));

    const createdItems = await Cart.bulkCreate(newItems);
    res.json(createdItems);

  } catch (error) {
    console.error("PUT /api/cart/:userId error:", error);
    res.status(500).json({ error: "Server error" });
  }
});



app.delete("/api/cart/:userId/:productId", async (req, res) => {
  try {
    const { userId, productId } = req.params;
    await Cart.destroy({
      where: {
        userId: userId,
        product_id: productId
      }
    });
    res.json({ message: "Item deleted from cart" });
  } catch (error) {
    console.error("DELETE /api/cart/:userId/:productId error:", error);
    res.status(500).json({ error: "Server error" });
  }
});



app.delete("/api/cart/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    await Cart.destroy({
      where: { userId: userId }
    });
    res.json({ message: "Cart cleared" });
  } catch (error) {
    console.error("DELETE /api/cart/:userId error:", error);
    res.status(500).json({ error: "Server error" });
  }
});


// Assuming you're using Sequelize for cart items
app.get('/api/cart/count/:userId', async (req, res) => {
  try {
    const cartCount = await Cart.count({
      where: { userId: req.params.userId }
    });
    res.json({ count: cartCount });
    console.log("Userid : " + req.params.userId)
  } catch (error) {
    console.error("Error fetching cart count:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
