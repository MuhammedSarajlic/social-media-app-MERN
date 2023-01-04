import User from "../modules/UserModule.js";

export async function getUser(req, res) {
  try {
    const { prop } = req.query;
    const user = await User.findOne({
      $or: [{ username: prop }, { email: prop }],
    });
    res.send(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
