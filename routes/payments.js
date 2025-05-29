import express from 'express';
import Payment from '../models/Payment.js';
import authenticate from '../middleware/auth.js';
import { Cart, OrderItem } from '../models/index.js';

const router = express.Router();

// POST /api/payments - record a new payment (pending)
router.post('/', authenticate, async (req, res) => {
  console.log("Testing post 11");
  const { orderId, utrNumber, amount, status } = req.body;
  if (!orderId || !utrNumber || !amount) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  try {
    const existing = await Payment.findOne({ where: { utrNumber } });
    if (existing) {
      return res.status(409).json({ message: 'UTR number already used' });
    }
    const payment = await Payment.create({
      userId: req.user.id,
      orderId,
      utrNumber,
      amount,
      status: status || 'pending',
    });
    console.log("Testing post 12");
    res.status(201).json({ message: 'Payment recorded', payment });
    console.log("Testing working ");





    console.log("Testing post 21");
    // Mark payment success
    // await Payment.update(
    //   { status: 'success' },
    //   { where: { orderId } }
    // );
    // Fetch cart items
    const cartItems = await Cart.findAll({ where: { userId:req.user.id } });
    // Prepare order items
    console.log("Testing post 22");
    const items = cartItems.map(item => ({
      order_id:orderId,
      user_id:req.user.id,
      product_id: item.product_id,
      product_name: item.product_name,
      product_image: item.product_image,
      product_price: item.product_price,
      quantity: item.quantity,
    }));
    // Bulk insert
    console.log(items);
    await OrderItem.bulkCreate(items);
    // Clear cart
    await Cart.destroy({ where: { userId:req.user.id } });




  } catch (err) {
    console.error('Error recording payment:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/payments - fetch all payments for the logged-in user
router.get('/', authenticate, async (req, res) => {
  try {
    console.log("Testing get method");
    const payments = await Payment.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
    });
    res.json(payments);
  } catch (err) {
    console.error('Error fetching payments:', err);
    res.status(500).json({ message: 'Server error fetching orders' });
  }
});

// POST /api/payments/confirm - finalize payment, save order items, clear cart
router.post('/confirm', authenticate, async (req, res) => {
  const { orderId, userId } = req.body;
  if (!orderId || !userId) {
    return res.status(400).json({ message: 'Missing orderId or userId' });
  }
  try {
    console.log("Testing post 21");
    // Mark payment success
    await Payment.update(
      { status: 'success' },
      { where: { orderId } }
    );
    // Fetch cart items
    const cartItems = await Cart.findAll({ where: { userId } });
    // Prepare order items
    console.log("Testing post 22");
    const items = cartItems.map(item => ({
      orderId,
      productId: item.product_id,
      productName: item.product_name,
      productImage: item.product_image,
      productPrice: item.product_price,
      quantity: item.quantity,
    }));
    // Bulk insert
    console.log(items);
    await OrderItem.bulkCreate(items);
    // Clear cart
    await Cart.destroy({ where: { userId } });
    res.json({ message: 'Payment confirmed, order saved, cart cleared' });
  } catch (err) {
    console.error('Error confirming payment:', err);
    res.status(500).json({ message: 'Server error in confirmation' });
  }
});

export default router;
