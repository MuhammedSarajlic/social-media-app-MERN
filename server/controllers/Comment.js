import Comment from "../modules/CommentModule.js";
import Post from "../modules/PostModule.js";

export async function getComments(req, res) {
  try {
    const { id } = req.params;
    const post = await Post.findById(id).populate({
      path: "comments",
      options: {
        sort: { createdAt: -1 },
      },
      populate: {
        path: "userId",
      },
    });
    res.send(post.comments);
  } catch (error) {
    res.status(500).send({ error: "Error fetching comments" });
  }
}
export async function addComment(req, res) {
  try {
    const { id } = req.params;
    const { userId, comment } = req.body;
    const newComment = await Comment.create({ userId, comment });
    await Post.findByIdAndUpdate(
      id,
      { $push: { comments: newComment._id } },
      { new: true }
    );
    res.send(newComment);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
export async function removeComment(req, res) {
  try {
    const { id } = req.params;
    const post = await Post.findOneAndUpdate(
      { comments: id },
      { $pull: { comments: id } },
      { new: true }
    );
    if (!post) {
      return res.status(404).send({ error: "Comment not found" });
    }
    await Comment.findByIdAndDelete(id);
    res.send({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).send(error);
  }
}
