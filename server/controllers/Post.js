import Post from "../modules/PostModule.js";

export async function createPost(req, res) {
  const { body } = req;
  const newPost = new Post(body);
  await newPost.save();
  res.send("Post created");
}

export async function getPosts(req, res) {
  try {
    const post = await Post.find()
      .sort({ createdAt: -1 })
      .populate("authorId comments.userId");
    res.send(post);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function getPostById(req, res) {
  try {
    const { id } = req.params;
    const post = await Post.findById(id).populate("authorId");
    res.send(post);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
