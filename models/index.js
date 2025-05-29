// models/index.js

import User from './User.js';  // Import the User model
import Payment from './Payment.js';  // Import the Payment model (if you have it)
import sequelize from '../routes/db.js';  // Import sequelize instance
// import OrderItem from './OrderItem.js';
// import OrderItem from './OrderItem.js';
// import OrderItem from './OrderItem.js';
import { DataTypes } from 'sequelize';

import Cart from './Cart.js';
import OrderItemModel from './OrderItem.js';
const OrderItem = OrderItemModel(sequelize, DataTypes);

// Export models
export { User, Payment,OrderItem,Cart};

// Sync the models with the database
sequelize.sync().then(() => {
  console.log('Database synced');
}).catch((err) => {
  console.error('Error syncing database:', err);
});
