let { register, login } = require("../model/authModel.js");

const registerEmployee = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    await register(username, email, password);
    res.json({ message: "Registration successful" });
  } catch (error) {
    console.log(error);
  }
};

const loginEmployee = async (req, res) => {
  const { username, password } = req.body;
  try {
    const token = await login(username, password);
    res.json({ token });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { registerEmployee, loginEmployee };