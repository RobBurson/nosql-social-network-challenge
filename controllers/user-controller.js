const { User } = require("../models");

// /api/users
const userCont = {
    // GET - all
    getAllUsers(req,res) {
        User.find({})
        // .populate({
            // path: "thoughts",
        // })
        // .populate({
            // path: "friends",
        // })
        .sort({ _id: -1 })
        .then((dbUserData) => res.json(dbUserData))
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },
    // GET - single user by _id and populate thought/friend data
    getUserById({ params }, res) {
        User.findOne({ _id: params.userId })
        .select("-__v")
        .populate({
            path: "friends",
        })
        .populate({
            path: "thoughts",
        })
        .then((dbUserData) => {
            if (!dbUserData) {
                res.status(404).json({ message: "No User found with given id! Try Again!" });
                return;
            }
            res.json(dbUserData);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json(err);
        });
    },
    // POST - new user
    createUser({ body }, res) {
        User.create(body)
        .then((dbUserData) => res.json(dbUserData))
        .catch((err) => res.status(400).json(err));
    },
    // PUT - update user by _id
    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.userId }, body, {
            new: true,
            runValidators: true,
        })
        .then((dbUserData) => {
            if (!dbUserData) {
                res.status(404).json({ message: "No User found with given id! Try Again!" });
                return;
            }
            res.json(dbUserData);
        })
        .catch((err) => {
            res.status(400).json(err);
        });
    },
    // async
    // DELETE - Remove user by _id
    deleteUser({ params }, res) { 
    User.findByIdAndDelete({ _id: params.userId})
    .then((dbUserData) => {
        if (!dbUserData) {
            res.status(404).json({ message: "No User found with given id! Try Again!" });
            return;
        }
        res.json({ message: 'That User has successfully been deleted' });
    });    
},
// Post - add new friend to user's friend
addFriend({ params, body }, res) {
    User.findOneAndUpdate(
        { _id: params.userId },
        { $push: { friends: params.friendId } },
        { new: true, runValidators: true }
    )
    .then((dbUserData) => {
        if (!dbUserData) {
            res.status(404).json({ message: "No User found with given id! Try Again!" });
            return;
        }
        res.json(dbUserData);
    })
    .catch((err) => res.json(err));
},
// DELETE - remove friend from friend list
removeFriend({ params }, res) {
    console.log("Remove Friend", params.friendId);
    User.findOneAndUpdate(
        { _id: params.userId },
        { $pull: { friends: params.friendId } },
        { new: true }
    )
    .then((dbUserData) => res.json(dbUserData))
    .catch((err) => res.json(err));
},
};

module.exports = userCont;