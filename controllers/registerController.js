const User = require("../model/Users");
const bcrypt = require("bcrypt");
const { json } = require("express/lib/response");

const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res.status(400).json({ message: "user and password are required" });
  //check for duplicate username in the db
  const duplicate = await User.findOne({ username: user }).exec();
  if (duplicate) return res.status(409); //conflict

  try {
    //encrypt pwd
    const hashedPwd = await bcrypt.hash(pwd, 10);
    //Create and store the new user
    const result = await User.create({
      username: user,
      password: hashedPwd,
    });

    console.log(result);

    res.status(201).json({ success: `New user ${user} created` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
