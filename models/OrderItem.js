// module.exports = (sequelize, DataTypes) => {
//     const OrderItem = sequelize.define('OrderItem', {
//       id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true
//       },
//       order_id: {
//         type: DataTypes.STRING,
//         allowNull: true
//       },
//       user_id: {
//         type: DataTypes.INTEGER,
//         allowNull: true
//       },
//       product_id: {
//         type: DataTypes.STRING,
//         allowNull: true
//       },
//       product_name: {
//         type: DataTypes.STRING,
//         allowNull: true
//       },
//       product_price: {
//         type: DataTypes.DECIMAL(10, 2),
//         allowNull: true
//       },
//       product_image: {
//         type: DataTypes.TEXT,
//         allowNull: true
//       },
//       quantity: {
//         type: DataTypes.INTEGER,
//         allowNull: true
//       },
//       created_at: {
//         type: DataTypes.DATE,
//         allowNull: true,
//         defaultValue: DataTypes.NOW
//       }
//     }, {
//       tableName: 'order_items',
//       timestamps: false
//     });
  
//     return OrderItem;
//   };
  



// models/OrderItem.js

export default (sequelize, DataTypes) => {
  const OrderItem = sequelize.define('OrderItem', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    order_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    product_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    product_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    product_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    product_image: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'order_items',
    timestamps: false
  });

  return OrderItem;
};
