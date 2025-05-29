import sequelize from "../routes/db.js";  // ✅ Import sequelize first
import { DataTypes } from "sequelize";
import bcrypt from "bcryptjs";

const User = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
});


User.beforeCreate(async (user) => {
    user.password = await bcrypt.hash(user.password, 10);
});

export default User;
