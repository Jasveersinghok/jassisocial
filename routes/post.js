const router = require("express").Router();
const PostSchema = require("../models/Post");
const User = require("../models/User");

router.post("/createpost", async (req, res) => {
  const newPost = new PostSchema(req.body);
  try {
    const saved = await newPost.save();
    res.status(200).json(saved);
  } catch (error) {
    res.status(500).json("crate post error");
  }
});
//update post
router.put("/updatepost/:id", async (req, res) => {
  try {
    const postId = await PostSchema.findById(req.params.id);
    if (postId.userId === req.body.id) {
      await PostSchema.updateOne({ $set: req.body });
      res.status(200).json("post updated successfully");
    } else {
      res.status(403).json("you can update only your post");
    }
  } catch (error) {
    res.status(500).json("error occurred " + error);
  }
});
//delete request
router.delete("/deletepost/:id", async (req, res) => {
  try {
    const postId = await PostSchema.findById(req.params.id);
    if (postId.userId === req.body.id) {
      await PostSchema.deleteOne({ _id: req.params.id });
      res.status(200).json("post deleted successfully");
    } else {
      res.status(403).json("you can update only your post");
    }
  } catch (error) {
    res.status(500).json("error occurred " + error);
  }
});
//like and unliked a post
router.put("/like/:id", async (req, res) => {
  try {
    const post = await PostSchema.findById(req.params.id);
    if ( !post.likes.includes(req.body.userId ) ) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("The post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The post has been disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
//getting a post
router.get("/getpost/:id", async (req, res) => {
  try {
    const postData = await PostSchema.findById(req.params.id);
    res.status(200).json(postData);
  } catch (error) {
    res.status(500).json("error occurred " + error);
  } 
}); 
//timeline
router.get("/timeline/:userId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId)
    const userPost = await PostSchema.find({userId:currentUser._id})
    const friendspost = await Promise.all(currentUser.followings.map(async(friendId)=>{
        return await PostSchema.find({userId:friendId}); 
    }))
    res.json(userPost.concat(...friendspost))
  } catch (error) {
    res.status(500).json("error occurred " + error);
  }
});
//getting for profile
router.get("/profile/:username", async (req, res) => {
  try {
    const user = await User.findOne({username:req.params.username})
    const posts = await PostSchema.find({userId:user._id})
    res.status(200).json(posts)
  } catch (error) {
    res.status(500).json("error occurred " + error);
  }
});
module.exports = router;
