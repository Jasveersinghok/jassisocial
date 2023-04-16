const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//update user
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    //find useris valid or not
    if (req.body.password) {
      try {
        //hashing
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (error) {
        return res.json(error);
      }
    }
    try {
      //updating body object
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("account updated successfully");
    } catch (error) {
      return res.status(200).json(error);
    }
  } else {
    res.status(403).json("you can update only yours account details");
  }
});
//delete a user
router.delete("/delete/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(200).json("account updated successfully");
    } catch (error) {
      res.status(402).json(error);
    }
  } else {
    res.status(403).json("you can only your account");
  }
});
//get a user by query
router.get("/getuser", async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    const { password, updateAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (error) {
    res.status(500).json("user not found " + error);
  }
});
//follow a user
router.put("/follow/:id", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id); //this is mine user
      const currentUser = await User.findById(req.body.userId); //to be followed user
      if (!user.followings.includes(req.body.userId)) {
        await user.updateOne({ $push: { followings: req.body.userId } });
        await currentUser.updateOne({ $push: { followers: req.params.id } });
        res.status(200).json("user follwed successfully");
      } else {
        res.json("user already follwed");
      }
    } catch (error) {
      res.status(402).json(error);
    }
  } else {
    res.status(403).json("you can't follow yourself ");
  }
});
//unfollow user
router.put("/unfollow/:id", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id); //this is mine user
      const currentUser = await User.findById(req.body.userId); //to be followed user
      if (user.followings.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followings: req.body.userId } });
        await currentUser.updateOne({ $pull: { followers: req.params.id } });
        res.status(200).json("user unfollwed successfully");
      } else {
        res.json("user don't follow it ");
      }
    } catch (error) {
      res.status(403).json(error);
    }
  } else {
    res.status(403).json("you can't unfollow yourself ");
  }
});
//getting user friend
router.get("/friends/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friends = await Promise.all(
      user.followings.map((friendId) => {
        return User.findById(friendId);
      })
    );
    let friendList = [];
    friends.map((friend) => {
      const { _id, username, profilePicture } = friend;
      friendList.push({ _id, username, profilePicture });
    });
    res.status(200).json(friendList)
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
