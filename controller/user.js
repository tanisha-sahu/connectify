const blog = require("../models/blog");
const user = require("../models/user.js");

module.exports.editGet = async function (req, res) {
  const userId = req.params.id;
  const User = await user.findOne({ _id: userId });
  res.render("editProfile", { User });
};

module.exports.editPost = async function (req, res) {
  const userId = req.params.id;
  let img = req.body.userImg;
  if (req.file) img = req.file.path;
  const { name, mail, about } = req.body;
  const User = await user.findOneAndUpdate(
    { _id: userId },
    {
      $set: {
        name,
        mail,
        about,
        userImg: img,
      },
    }
  );
  res.redirect(`/profile/view/${userId}`);
};

module.exports.profile = async function (req, res) {
  const currentUserId = res.locals.currUser.id;
  const currentUser = await user.findOne({ _id: currentUserId });
  const userId = req.params.id;
  const User = await user.findOne({ _id: userId });
  const Blog = await blog.find({ creatorId:  User._id});
  res.render("user", { User, Blog, currentUser });
};

module.exports.allProfile = async function (req, res) {
  const currentUserId = res.locals.currUser.id;
  const currentUser = await user.findOne({ _id: currentUserId });
  if (req.query.search) {
    const User = await user.find({
        $and: [
            {
              $or: [
                { name: { $regex: req.query.search, $options: 'i' } },
                { about: { $regex: req.query.search, $options: 'i' } }
              ]
            },
            { _id: { $ne: currentUserId } }
          ]
    });
    res.render("allUser", { User, currentUser });
  } else {
    const User = await user.find({
      _id: { $ne: currentUserId },
    });
    res.render("allUser", { User, currentUser });
  }
};

module.exports.follow = async function (req, res) {
  const friendId = req.params.id;
  const friend = await user.findOne({ _id: friendId });
  friend.follower.push(res.locals.currUser.id);
  friend.save();
  const User = await user.findOne({ _id: res.locals.currUser.id });
  User.following.push(friendId);
  User.save();
  res.redirect(req.headers.referer);
};

module.exports.unfollow = async function (req, res) {
  const friendId = req.params.id;
  const friend = await user.findOneAndUpdate(
    { _id: friendId },
    { $pull: { follower: res.locals.currUser.id } }
  );
  const User = await user.findOneAndUpdate(
    { _id: res.locals.currUser.id },
    { $pull: { following: friendId } }
  );
  res.redirect(req.headers.referer);
};

module.exports.removeFollower = async function (req, res) {
  const friendId = req.params.id;
  const friend = await user.findOneAndUpdate(
    { _id: friendId },
    { $pull: { following: res.locals.currUser.id } }
  );
  const User = await user.findOneAndUpdate(
    { _id: res.locals.currUser.id },
    { $pull: { follower: friendId } }
  );
  res.redirect(req.headers.referer);
};

module.exports.follower = async function (req, res) {
  const userId = req.params.id;
  const User = await user.findOne({ _id: userId }).populate("follower");
  res.render("follower", { User });
};

module.exports.following = async function (req, res) {
  const userId = req.params.id;
  const User = await user.findOne({ _id: userId }).populate("following");
  res.render("following", { User });
};

module.exports.copy = async function (req, res) {
  const id = req.params.id;
  const link = req.headers.referer;
  let shareUrl = link.replace("blogs", `view/${id}`);
  shareUrl.select();
  shareUrl.setSelectionRange(0, 99999); // For mobile devices
  navigator.clipboard.writeText(shareUrl.value); // Copies to clipboard
  document.getElementById("copySuccess").style.display = "block";

};

module.exports.message = async function (req, res) {
  res.render("message");
};

module.exports.premium = async function (req, res) {
  res.render("premium");
};