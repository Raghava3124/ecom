import sequelize from "../routes/db.js";
import { DataTypes } from "sequelize";
import User from "./User.js"; // make sure path is correct

const Wishlist = sequelize.define("Wishlist", {
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
  }
}, {
  tableName: 'Wishlist',
  freezeTableName: true,
});

// Setup association
Wishlist.belongsTo(User, { foreignKey: "userId" });


Wishlist.sync({ alter: true })
  .then(() => {
    console.log("✅ Wishlist table updated successfully.");
  })
  .catch((error) => {
    console.error("❌ Error updating wishlist table:", error);
  });



export default Wishlist;