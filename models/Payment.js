// models/payment.js

import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../routes/db.js';  // Ensure your database config is correct

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',  // Referring to the User table
      key: 'id'
    }
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  utrNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true  // Ensure unique UTR number
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pending'  // Default status is 'pending'
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
    allowNull: true
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
    allowNull: true
  }
}, {
  // Sequelize options
  timestamps: true,  // Automatically manage createdAt and updatedAt fields
  createdAt: 'createdAt',  // Explicitly define column names
  updatedAt: 'updatedAt'
});

export default Payment;  // Export Payment model
