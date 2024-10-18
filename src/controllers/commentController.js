const Commente = require('../models/commentModel');
const User = require('../models/userModel'); 
const Film = require('../models/filmModel');



const addComment = async (req, res) => {
  const { text, filmId } = req.body;

  if (!text || !filmId) {
    return res.status(400).json({ message: 'Text and Film ID are required' });
  }

  try {

    const film = await Film.findById(filmId);
    if (!film) {
      return res.status(404).json({ message: 'Film not found' });
    }

    const comment = await Commente.create({
      text,
      Client: req.user._id, 
      film: filmId,
    });

    return res.status(201).json(comment);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


const getCommentsForFilm = async (req, res) => {
  const { filmId } = req.params;

  try {
    const comments = await Commente.find({ film: filmId })
      .populate('Client', 'name email')
      .sort({ createdAt: -1 }); 

    return res.status(200).json(comments);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


const deleteComment = async (req, res) => {
  const { commentId } = req.params;

  try {
    const comment = await Commente.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.Client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to delete this comment' });
    }

    await comment.remove();
    return res.status(204).send(); 
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addComment,
  getCommentsForFilm,
  deleteComment,
};
