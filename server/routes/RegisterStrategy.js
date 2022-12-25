import User from "../modules/UserModule.js";
import bcrypt from "bcrypt";

export default async function registerStrategy(req, res) {
  try {
    const { firstName, lastName, username, email, password, imageUrl } =
      req.body;
    //const user = await User.findOne({ email });
    if (await User.findOne({ email })) {
      return res
        .status(400)
        .send({ error: "User with this email already exist" });
    } else if (await User.findOne({ email })) {
      return res
        .status(400)
        .send({ error: "User with this username already exist" });
    }
    if (password.length < 8) {
      return res.status(400).send({ error: "Password is too short" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      imageUrl,
    });
    await newUser.save();
    res.send("User created");
  } catch (error) {
    res.status(500).send(error.message);
  }
}
