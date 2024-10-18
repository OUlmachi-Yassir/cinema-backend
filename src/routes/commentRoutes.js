const express = require('express');
const { addComment, getCommentsForFilm, deleteComment } = require('../controllers/commentController');
const { protect } = require('../middlewares/authMiddleware'); 

const router = express.Router();

router.route('/').post(protect, addComment); 
router.route('/:filmId').get(getCommentsForFilm); 
router.route('/:commentId').delete(protect, deleteComment); 
module.exports = router;
