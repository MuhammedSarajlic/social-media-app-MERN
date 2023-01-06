import User from "../modules/UserModule.js";

export async function removeFriend(req, res) {
  try {
    const { senderId, receiverId } = req.body;
    await User.updateMany(
      { _id: { $in: [senderId, receiverId] } },
      { $pull: { friends: { $in: [senderId, receiverId] } } }
    );
    res.send("Removed friend");
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function getFriends(req, res) {
  try {
    const { id } = req.params;
    const friends = User.findById(id).populate("friends");
    res.send(friends);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
