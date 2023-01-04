import FriendRequest from "../modules/FriendRequestModule.js";
import User from "../modules/UserModule.js";

export async function sendRequest(req, res) {
  try {
    const { senderId, receiverId } = req.body;
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { senderId, receiverId, status: "pending" },
        { senderId: receiverId, receiverId: senderId, status: "pending" },
      ],
    });
    if (existingRequest) {
      return res.status(400).send({ error: "Friend request already exists" });
    }
    const friendRequest = new FriendRequest({
      senderId,
      receiverId,
    });
    await friendRequest.save();
    res.send(friendRequest);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
export async function checkRequest(req, res) {
  try {
    const { id } = req.params;
    const { userId } = req.query;
    const friendRequest = await FriendRequest.findOne({
      $or: [
        { senderId: userId, receiverId: id, status: "pending" },
        { senderId: id, receiverId: userId, status: "pending" },
      ],
    });
    res.send(friendRequest || null);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
export async function removeRequest(req, res) {
  const { senderId, receiverId } = req.body;
  await FriendRequest.deleteOne({ senderId, receiverId, status: "pending" });
  res.send("request deleted");
}
export async function statusOfRequest(req, res) {
  try {
    const { senderId, receiverId, status } = req.body;
    const request = await FriendRequest.findOneAndUpdate(
      { senderId, receiverId, status: "pending" },
      { $set: { status } },
      { new: true }
    );
    if (!request) {
      return res.status(404).send({ error: "Friend request not found" });
    }
    if (status === "accepted") {
      await User.updateOne(
        { _id: senderId },
        { $push: { friends: receiverId } }
      );
      await User.updateOne(
        { _id: receiverId },
        { $push: { friends: senderId } }
      );
      res.send({ status: "accepted" });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
}
