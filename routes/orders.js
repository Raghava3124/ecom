import express from 'express';
import Orders from '../models/Orders.js';  // Adjust the path as needed
// routes/orders.js
import authenticateToken from '../middleware/auth.js'; // ✅ correct import

const router = express.Router();



// Middleware to verify token (if you have auth middleware, replace or add it here)
// const authenticateToken = (req, res, next) => {
//   // Basic example, replace with your actual auth logic
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];
//   if (!token) return res.status(401).json({ error: 'Unauthorized' });

//   // Your JWT verification logic here
//   // jwt.verify(token, SECRET_KEY, (err, user) => { ... })
  
//   next();
// };

// router.get('/:orderId', authenticateToken, async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const userIdFromToken = req.user.id;
//     console.log(userId,"  --userid")
//     const order = await Orders.findOne({ where: { orderId } });

//     if (!order) {
//       return res.status(404).json({ error: 'Order not found' });
//     }
// console.log(order.userId,"  -- order. userid")
//     if (order.userId !== userIdFromToken) {
//       return res.status(403).json({ error: 'You are not authorized to view this order' });
//     }

//     return res.status(200).json({
//       orderId: order.orderId,
//       deliveryStatus: order.deliveryStatus,
//       status: order.status,
//       createdAt: order.createdAt
//     });
//   } catch (error) {
//     console.error('Error fetching order:', error);
//     return res.status(500).json({ error: 'Internal Server Error' });
//   }
// });





// GET /api/orders/:orderId
router.get('/:orderId', authenticateToken, async (req, res) => {
  try {
    const { orderId } = req.params;
    const userIdFromToken = req.user.id; // ✅ From decoded token + DB lookup

    const order = await Orders.findOne({ where: { orderId } });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.userId !== userIdFromToken) {
      return res.status(403).json({ error: 'You are not authorized to view this order' });
    }

    // return res.status(200).json({
    //   orderId: order.orderId,
    //   deliveryStatus: order.deliveryStatus,
    //   status: order.status,
    //   createdAt: order.createdAt
    // });


    return res.status(200).json({
  orderId: order.orderId,
  deliveryStatus: order.deliveryStatus,
  status: order.status,
  paymentStatus: order.paymentStatus,
  utrNumber: order.utrNumber,
  name: order.name,
  phone: order.phone,
  addressLine: order.addressLine,
  landmark: order.landmark,
  pincode: order.pincode,
  city: order.city,
  state: order.state,
  createdAt: order.createdAt
});



  } catch (error) {
    console.error('Error fetching order:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});




router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      userId,
      orderId,
      utrNumber,
      paymentStatus,
      deliveryStatus,
      name,
      phone,
      pincode,
      city,
      state,
      addressLine,
      landmark
    } = req.body;

    // Check for required fields
    if (
      !userId || !orderId || !utrNumber || !paymentStatus || !deliveryStatus ||
      !name || !phone || !pincode || !city || !state || !addressLine
    ) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create the order
    const newOrder = await Orders.create({
      userId,
      orderId,
      utrNumber,
      paymentStatus,
      deliveryStatus,
      name,
      phone,
      pincode,
      city,
      state,
      addressLine,
      landmark,
      status: 'pending' // default status
    });

    return res.status(201).json({
      message: '✅ Order created successfully',
      order: newOrder
    });

  } catch (error) {
    console.error('❌ Error creating order:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});



export default router;
