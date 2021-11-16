const router = require("express").Router();

const User = require("../models/User");
const Post = require("../models/Post");

//CREATE POST
router.post("/", async (req, res) => {
  const newPost = await new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (error) {
    res.status(500).json(error);
  }
});

//UPDATE POST actualizar

router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
      try {
        const updatePost = await Post.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).json(updatePost);
      } catch (error) {
        res.status(500).json(error);
      }
    } else {
      res.status(401).json("No puedes actualizar el post");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//DELETE POST

router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
      try {
        await post.delete();
        res.status(200).json("La publicacion fue eliminada");
      } catch (error) {
        res.status(500).json(error);
      }
    } else {
      res.status(401).json("No puedes eliminar el post");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//GET POST

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error);
  }
});

//GET ALL POST

router.get("/", async (req, res) => { //carga todas las publicaciones
  const username = req.query.user; // aqui seria ? y el valor = es el username
  const catName = req.query.cat;
  try {
    let posts;
    if (username) {
      posts = await Post.find({ username: username }); //que busque las publicaciones con este username
    } else if (catName) {
      posts = await Post.find({  //las publicaciones que incluyan la categoria de catName
        categories: {
          $in: [catName],
        },
      });
    } else {
      posts = await Post.find();
    }
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
