import { DataTypes } from 'sequelize';
import sequelize from '../routes/db.js';

const Orders = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  orderId: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  utrNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  paymentStatus: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pincode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  addressLine: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  landmark: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('success', 'pending', 'failed'),
    allowNull: false,
    defaultValue: 'pending',
  },
  deliveryStatus: {
    type: DataTypes.ENUM('pending', 'shipped', 'in transit', 'delivered', 'failed'),
    allowNull: false,
    defaultValue: 'pending',
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'Orders',
  freezeTableName: true,
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
});


// Sync to apply changes in DB schema
Orders.sync({ alter: true })
  .then(() => {
    console.log("✅ Orders table updated successfully.");
  })
  .catch((error) => {
    console.error("❌ Error updating Orders table:", error);
  });

export default Orders;
