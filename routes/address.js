import express from 'express';
import Address from '../models/Address.js';
import authenticate from '../middleware/auth.js'; // if you're using auth middleware

const router = express.Router();

// Add a new address
router.post('/', authenticate, async (req, res) => {
  try {
    const { name, phone, pincode, city, state, addressLine, landmark, userId } = req.body;

    if (!name || !phone || !pincode || !city || !state || !addressLine || !userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newAddress = await Address.create({
      userId,
      name,
      phone,
      pincode,
      city,
      state,
      addressLine,
      landmark
    });

    res.status(201).json({ message: 'Address added successfully', address: newAddress });
  } catch (error) {
    console.error('Error adding address:', error);
    res.status(500).json({ error: 'Server error' });
  }
});




// routes/address.js
router.get('/user/:userId', authenticate, async (req, res) => {
  const { userId } = req.params;
  try {
    const addresses = await Address.findAll({ where: { userId } });
    res.json({ addresses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch addresses' });
  }
});



// // routes/address.js or similar
// router.get('/:id', authenticate, async (req, res) => {
//   const { id } = req.params;

//   try {
//     const address = await Address.findByPk(id); // assuming Sequelize

//     if (!address) {
//       return res.status(404).json({ message: 'Address not found' });
//     }

//     res.json({ address });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });
// routes/address.js or wherever your address routes are



// GET /api/address/:id - fetch specific address only if user is owner
router.get('/:id', authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const address = await Address.findByPk(id);

    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    // ✅ Check ownership
    if (address.userId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: Not your address' });
    }

    res.json({ address });
  } catch (err) {
    console.error('Error fetching address:', err);
    res.status(500).json({ message: 'Server error' });
  }
});



// routes/address.js

router.put('/:id', authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const address = await Address.findByPk(id);

    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    // 🔐 Ownership check
    if (address.userId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: Not your address' });
    }

    // Update fields
    const {
      name,
      phone,
      pincode,
      city,
      state,
      addressLine,
      landmark,
    } = req.body;

    // Update address in DB
    await address.update({
      name,
      phone,
      pincode,
      city,
      state,
      addressLine,
      landmark,
    });

    res.status(200).json({ message: 'Address updated successfully', address });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});









// DELETE /api/address/:id - only by owner
router.delete('/:id', authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const address = await Address.findByPk(id);

    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    // 🔐 Check if the logged-in user is the owner
    if (address.userId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: Not your address' });
    }

    await address.destroy();

    res.status(200).json({ message: 'Address deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});






export default router;
