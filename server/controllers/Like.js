import Post from "../modules/PostModule.js";

export async function addLike(req, res) {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).send({ error: "Post not found" });
    }
    if (post.likes.includes(userId)) {
      return res.status(400).send({ error: "Post already liked" });
    }
    post.likes.push(userId);
    await post.save();
    res.send({ message: "Post liked" });
  } catch (error) {
    res.status(500).send({ error: "Error liking post" });
  }
}

// app.post("/api/posts/:id/add-like", async (req, res) => {
//     try {
//       const { id } = req.params;
//       const { userId } = req.body;
//       const post = await Post.findById(id);
//       if (!post) {
//         return res.status(404).send({ error: "Post not found" });
//       }
//       if (post.likes.includes(userId)) {
//         return res.status(400).send({ error: "Post already liked" });
//       }
//       post.likes.push(userId);
//       await post.save();
//       res.send({ message: "Post liked" });
//     } catch (error) {
//       res.status(500).send({ error: "Error liking post" });
//     }
//   });

export async function removeLike(req, res) {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).send({ error: "Post not found" });
    }
    const index = post.likes.indexOf(userId);
    if (index === -1) {
      return res.status(400).send({ error: "Post not liked" });
    }
    post.likes.splice(index, 1);
    await post.save();
    res.send({ message: "Post unliked" });
  } catch (error) {
    res.status(500).send({ error: "Error unliking post" });
  }
}

// app.delete("/api/posts/:id/remove-like", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { userId } = req.body;
//     const post = await Post.findById(id);
//     if (!post) {
//       return res.status(404).send({ error: "Post not found" });
//     }
//     const index = post.likes.indexOf(userId);
//     if (index === -1) {
//       return res.status(400).send({ error: "Post not liked" });
//     }
//     post.likes.splice(index, 1);
//     await post.save();
//     res.send({ message: "Post unliked" });
//   } catch (error) {
//     res.status(500).send({ error: "Error unliking post" });
//   }
// });

export async function checkLike(req, res) {
  try {
    const { id } = req.params;
    const { userId } = req.query;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).send("Post not found!");
    }
    res.send(post.likes.includes(userId));
  } catch (error) {
    res.status(500).send(error.message);
  }
}

// app.get("/api/posts/:id/check-like", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { userId } = req.query;
//     const post = await Post.findById(id);
//     if (!post) {
//       return res.status(404).send("Post not found!");
//     }
//     res.send(post.likes.includes(userId));
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// });
