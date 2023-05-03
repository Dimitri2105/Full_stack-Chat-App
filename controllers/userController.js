const User = require("../modals/userModal");
const bcrypt = require("bcrypt");

exports.signup = async (req, res, next) => {
  const name = req.body.userAdd;
  const email = req.body.emailAdd;
  const password = req.body.passwordAdd;
  const phoneNumber = req.body.phonenumberAdd;

  if (!name || !email || !password || !phoneNumber) {
    res.status(400).json({ message: "Enter all fields" });
  }

  try {
    const existingUser = await User.findOne({ where: { email: email } });
    if (existingUser) {
        return res.json({ message: "User already exists" });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      const data = await User.create({
        userName: name,
        email: email,
        password: hashedPassword,
        phoneNumber: phoneNumber,
      });

      res.status(200).json({ newUser: data });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Something Went wrong while creating user" });
  }
};
