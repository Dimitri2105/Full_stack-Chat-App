const User = require("../modals/userModal");
const bcrypt = require("bcrypt");
const jst = require("jsonwebtoken")

let activeUsers = {}

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
function generateToken(id,username){
    return jst.sign(
        {id,username},
        process.env.TOKEN_SECRET)
}

exports.logIn = async (req, res, next) => {
  const email = req.body.emailAdd;
  const password = req.body.passwordAdd;
  try {
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      res.status(404).json({ message: "User not found" });
    } else {
      bcrypt.compare(password, user.password, (err, result) => {
        if (result === true) {
          activeUsers[user.id] = user.userName
          console.log("ACTIVE USER  are >>>>>>", activeUsers)
          res.status(200).json({ message: "User login successfull",token : generateToken({id:user.id , username :user.userName}) , username : user.userName});
        } else {
          res.status(401).json({ message: "User not authorized" });
        }
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
};

exports.getAllUsers = async(req,res,next) =>{
  console.log("inside logged users >>>>>")
  try {
    res.status(200).json({ activeUsers: Object.values(activeUsers)});
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Unable to fetch users" });
  }
 

}
