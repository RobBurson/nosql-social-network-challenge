const { Thought, User } = require("../models");

const thoughtController = {
  // GET - all
  getAllThoughts(req, res) {
    Thought.find({})
      .select('-__v')
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => {
        res.status(400).json(err);
      });
  },
  // GET - single; by _id
  getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.thoughtId })
      .select('-__v')
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res
            .status(404)
            .json({ message: "No Thought found with given id! Try Again!" });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  },
  // POST - create thought
  newThought({ params, body }, res) {
    if (!body.userId) {
      return res.status(400).json({ message: "No userId given in this request! Try Again!" });
    }
    Thought.create(body)
      .then(({ _id }) => {
        console.log(_id);
        return User.findOneAndUpdate(
          { _id: params.userId },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then((dbThoughtData) => {
        console.log(dbThoughtData);
        if (!dbThoughtData) {
          res
            .status(404)
            .json({ message: "No User found with given id! Try Again!" });
          return;
        }
        res.json(dbThoughtData);
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
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res
            .status(404)
            .json({ message: "No Thought found with given id! Try Again!" });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((err) => res.status(400).json(err));
  },
  // DELETE - delete thought by _id
  deleteThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.thoughtId })
      .then((deleteThought) => {
        if (!deleteThought) {
          return res
            .status(404)
            .json({ message: "No Thought found with given id! Try Again!" });
        }
        console.log(deleteThought);
        User.findOneAndUpdate(
          { username: deleteThought.username },
          { $pull: { thoughts: params.thoughtId } },
          { new: true }
        ).then((dbThoughtData) => {
          if (!dbThoughtData) {
            res
              .status(404)
              .json({ message: "No User found with given id! Try Again!" });
            return;
          }
          res.json(dbThoughtData);
        });
      })
      .catch((err) => res.json(err));
  },
  // POST - create reaction
  newReaction({ params, body }, res) {
      Thought.findOneAndUpdate(
          { _id: params.thoughtId },
          { $push: { reactions: body } },
          { new: true, runValidators: true }
      )
      .then((dbThoughtData) => {
          if (!dbThoughtData) {
              res.status(404).json({ message: "No User found with given id! Try Again!" });
              return;
          }
          res.json(dbThoughtData);
      })
      .catch((err) => res.json(err));
  },
  // DELETE - pull and delete reaction by reactionId
  deleteReaction({ params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      // delete specific reply from array
      // where replyId matches params.replyId pass from route
      { $pull: { reactions: { reactionId: params.reactionId } } },
      { new: true }
    )
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => res.json(err));
  },
};

module.exports = thoughtController;
