const Customer = require("../models/customer");
const bcrypt = require("bcrypt");
const { comparePassword } = require("../utilities/passwordCompare");
const { encryptPasword } = require("../utilities/encryptPassword");
const Client = require("../models/client");
const Admin = require("../models/admin");

const resetPassword = async (body) => {
  let user;

  try {
    if (body.user_role === "customer") {
      //check if customer exists or not
      user = await Customer.findOne({
        where: {
          email: body.email,
        },
      });
    } else if (body.user_role === "client") {
      user = await Client.findOne({
        where: {
          email: body.email,
        },
      });
    } else if (body.user_role === "admin") {
      user = await Admin.findOne({
        where: {
          email: body.email,
        },
      });
    } else {
      return {
        status: 403,
        message: "invalid user role",
      };
    }

    if (user) {
      //check password of the user and compare it
      if (await comparePassword(body.current_password, user.password)) {
        //enable user to reset the password
        await user.update({
          password: await encryptPasword(body.new_password),
        });

        return {
          status: 200,
          message: "password upated successfully",
        };
      } else {
        return {
          status: 403,
          message: "your current password does not match with the database",
        };
      }
    } else {
      return {
        status: 404,
        message: "user not found",
      };
    }

    //check password
  } catch (error) {
    console.log("root project -> services -> resetPasswordService.js");
    return {
      status: 500,
      message: error,
    };
  }
};

module.exports = {
  resetPassword,
};
