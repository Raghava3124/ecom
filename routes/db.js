import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// const sequelize = new Sequelize(
//   'railway',
//   'root',
//   'HVbWzknILwIQeJJHEDPqfGMAjeaycSKh',
//   {
//     host: 'gondola.proxy.rlwy.net',
//     port: 40948,
//     dialect: 'mysql',
//     logging: false,
//     pool: {
//       max: 5,
//       min: 0,
//       acquire: 30000,
//       idle: 10000
//     }
//   }
// );

// const sequelize = new Sequelize(
//   'raghava',
//   'root',
//   'Raghav@123',
//   {
//     host: '150.230.134.36',
//     dialect: 'mysql',
//     logging: false,
//     pool: {
//       max: 5,
//       min: 0,
//       acquire: 30000,
//       idle: 10000
//     }
//   }
// );

const sequelize = new Sequelize(
  'raghava',
  'raghav', // Updated username
  'Raghav@123', // Updated password
  {
    host: '150.230.134.36', // Updated host
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);



// Test connection
sequelize.authenticate()
    .then(() => console.log("✅ Database connected..."))
    .catch(err => console.log("❌ Error: " + err));

// Import models after initializing sequelize
import("../models/User.js").then(() => {
    sequelize.sync()
        .then(() => console.log("✅ Database & tables synced..."))
        .catch(err => console.log("❌ Sync error: " + err));
});

export default sequelize;
