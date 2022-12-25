import User from "../modules/UserModule.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export default async function loginStrategy(req, res) {
  const { email, password, rememberMe } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .send({ error: "There is no user with this email" });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).send({ error: "Invalid email or password" });
    }
    const token = jwt.sign({ user }, process.env.JWT_SECRET, {
      expiresIn: rememberMe ? "7d" : "24h",
    });
    res.send({ token });
  } catch (error) {
    res.status(500).send(error.message);
  }
}
