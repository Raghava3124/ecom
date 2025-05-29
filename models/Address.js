import { DataTypes } from 'sequelize';
import sequelize from '../routes/db.js'; // adjust the path to your sequelize instance

const Address = sequelize.define('Address', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  pincode: {
    type: DataTypes.STRING(6),
    allowNull: false
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  state: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  addressLine: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  landmark: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  tableName: 'addresses',
  timestamps: true
});

export default Address;
