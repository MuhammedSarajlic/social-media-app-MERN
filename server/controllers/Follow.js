import User from "../modules/UserModule.js";

export async function follow(req, res) {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const user = await User.findById(id);
    const actionUser = await User.findById(userId);
    if (user.followers.includes(userId) || actionUser.following.includes(id)) {
      return res.send("Already following user");
    }
    user.followers.push(userId);
    actionUser.following.push(id);
    await user.save();
    await actionUser.save();
    res.send({ success: true });
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function unfollow(req, res) {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    await User.findByIdAndUpdate(id, { $pull: { followers: userId } });
    await User.findByIdAndUpdate(userId, { $pull: { following: id } });
    res.send("Unfollowed");
  } catch (error) {
    res.status(500).send(error);
  }
}
