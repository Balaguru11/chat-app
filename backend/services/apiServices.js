const UserModel = require("../model/User.Model");

const checkDuplicateUser = async (email) => {
  const oldUser = new Promise(async (resolve, reject) => {
    const user = await UserModel.find({ email });
    console.log("user 99999999999999999999", user);

    if (!user) {
      resolve(user);
    } else {
      reject(new Error("User already exists"));
    }
  });

  return oldUser;
};

const createNewuser = async (data) => {
  const newUser = await UserModel.create({ ...data });
  if (newUser) {
    resolve(newUser);
  } else {
    reject(new Error("Failed to create a new User"));
  }

  return newUser;
};

module.exports = {
  checkDuplicateUser,
  createNewuser,
};
