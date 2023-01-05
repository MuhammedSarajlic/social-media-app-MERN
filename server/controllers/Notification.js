import Notification from "../modules/NotificationModule.js";
import User from "../modules/UserModule.js";

export async function getNotifications(req, res) {
  try {
    const { id } = req.params;
    const notification = await Notification.find({ receiverId: id }).populate(
      "senderId"
    );
    res.send(notification);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
export async function removeNotification(req, res) {
  try {
    const { senderId, receiverId, type } = req.body;
    const notification = await Notification.findOneAndDelete({
      $or: [
        { senderId: receiverId, receiverId: senderId, type },
        { senderId, receiverId, type },
      ],
    });
    if (!notification) {
      return res.status(404).send({ error: "Notification not found" });
    }
    await User.updateMany(
      { _id: { $in: [senderId, receiverId] } },
      { $pull: { notifications: notification._id } }
    );
    res.send("Notification removed");
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function sendNotification(req, res) {
  try {
    const { senderId, receiverId, message, type, postId } = req.body;
    const notification = new Notification({
      senderId,
      receiverId,
      type,
      message,
      postId,
    });
    await notification.save();
    await User.findByIdAndUpdate(
      receiverId,
      { $push: { notifications: notification._id } },
      { new: true }
    );
    res.send(notification);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
