import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: "mysql",
        logging: false
    }
);

sequelize.authenticate()
    .then(() => console.log("✅ Database connected..."))
    .catch(err => console.log("❌ Error: " + err));

// Import models **after** initializing sequelize
import("../models/User.js").then(() => {
    sequelize.sync()
        .then(() => console.log("✅ Database & tables synced..."))
        .catch(err => console.log("❌ Sync error: " + err));
});

export default sequelize;
