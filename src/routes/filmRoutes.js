const express = require('express');
const multer = require('multer');

const { getFilms, addFilm, updateFilm, deleteFilm } = require('../controllers/filmController');
const { protect, adminOnly } = require('../middlewares/authMiddleware'); 
const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); 
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); 
    }
  });

const upload = multer({ storage: storage });


router.get('/', protect, getFilms); 
router.post('/addfilm', protect, adminOnly,upload.single('image'), addFilm); 
router.put('/updateFilm/:id', protect, adminOnly, updateFilm); 
router.delete('/deleteFilm/:id', protect, adminOnly, deleteFilm); 

module.exports = router;
