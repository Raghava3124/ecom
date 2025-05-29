import sequelize from "../routes/db.js";
import { DataTypes } from "sequelize";
import User from "./User.js"; // make sure path is correct

const Cart = sequelize.define("Cart", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  product_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  product_price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  product_image: {
    type: DataTypes.STRING,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  }
});

// Setup association
Cart.belongsTo(User, { foreignKey: "userId" });

export default Cart;