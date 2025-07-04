'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    static associate(models) {
      user.belongsTo(models.role, { foreignKey: 'user_role' });
      user.hasMany(models.Address, { foreignKey: 'userId' });
      user.hasMany(models.Wishlist, { foreignKey: 'user_id' });
      user.hasMany(models.Cart, { foreignKey: 'user_id' });
    }
  }

  user.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'First name is required' },
        notEmpty: { msg: 'First name cannot be empty' },
        is: {
          args: /^[A-Za-z\s]+$/,
          msg: 'First name must contain only letters and spaces'
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    emailId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: { msg: 'Email is required' },
        notEmpty: { msg: 'Email cannot be empty' },
        is: {
          args: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          msg: 'Enter a valid email address'
        }
      }
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        is: {
          args: /^[0-9]{10}$/,
          msg: 'Phone number must be 10 digits'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Password is required' },
        notEmpty: { msg: 'Password cannot be empty' },
        is: {
          args: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/,
          msg: 'Password must be at least 6 characters and include uppercase, lowercase, number, and special character'
        }
      }
    },
    user_role: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    profile_picture: {
      type: DataTypes.STRING,
      allowNull: true
    },
    products: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'user',
    hooks: {
      beforeCreate: async (user, options) => {
        try {
          const hashedPassword = await bcrypt.hash(user.password, 10);
          user.password = hashedPassword;
        } catch (error) {
          // Handle the error appropriately (e.g., logging, throwing)
          throw new Error("Error hashing password: " + error.message);
        }
      },
       beforeUpdate: async (user, options) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    }
  })
    
  

  return user;
};
