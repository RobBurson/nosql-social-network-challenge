const { Thought, User } = require("../models");

const thoughtController = {
    // GET - all
    getAllThoughts(req, res) {
        Thought.find({})
        .populate({
            path:"thoughts",
        })
        .sort({ _id: -1 })
        .then((dbUserData) => res.json(dbUserData))
        .catch((err) => {
            res.status(400).json(err);
        });
    },
    // GET - single; by _id
    getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.thoughtId })
    .populate({
        path: "thoughts",
    })
    .then((dbUserData) => {
        if (!dbUserData) {
            res.status(404).json({ message: "No Thought found with given id! Try Again!" });
            return;
        }
        res.json(dbUserData);
    })
    .catch((err) => {
        res.status(400).json(err);
    });
},
// POST - create thought
addThought({ params, body }, res) {
    Thought.create(body)
    .then(({ _id }) => {
        console.log(_id);
        return User.findOneAndUpdate(
            { _id: body.userId },
            { $push: { thoughts: _id } },
            { new: true }
        );
    })
    .then((dbUserData) => {
        console.log(dbUserData);
        if (!dbUserData) {
            res.status(404).json({ message: "No User found with given id! Try Again!" });
            return;
        }
        res.json(dbUserData);
    })
    .catch((err) => res.json(err));
},
// PUT - update thought by _id
updateThought({ params, body }, res) {
    console.log(params.thoughtId);
    console.log(body);
    Thought.findOneAndUpdate({ _id: params.thoughtId }, body, {
        new: true,
        runValidators: true,
    })
    .then((dbUserData) => {
        if (!dbUserData) {
            res.status(404).json({ message: "No Thought found with given id! Try Again!" });
            return;
        }
        res.json(dbUserData);
    })
    .catch((err) => res.status(400).json(err));
},
// DELETE - remove thought by _id
removeThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.thoughtId })
    .then((deleteThought) => {
        if (!deleteThought) {
            return res.status(404).json({ message: "No Thought found with given id! Try Again!" });
        }
        console.log(deleteThought);
        User.findOneAndUpdate(
            { username: deleteThought.username },
            { $pull: { thoughts: params.thoughtId } },
            { new: true }
        ).then((dbUserData) => {
            if (!dbUserData) {
                res.status(404).json({ message: "No User found with given id! Try Again! "});
                return;
            }
            res.json(dbUserData);
        });
    })
    .catch((err) => res.json(err));
},
// DELETE - pull and remove reaction by reactionId
removeReaction({ params }, res) {
    Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        // remove specific reply from array
        // where replyId matches params.replyId pass from route
        { $pull: { reactions: { reactionId: params.reactionId } } },
        { new: true }
    )
    .then((dbUserData) => res.json(dbUserData))
    .catch((err) => res.json(err));
},
};

module.exports = thoughtController;