const express = require('express');
const {
  getFilms,
  addFilm,
  updateFilm,
  deleteFilm,
} = require('../controllers/filmController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/multerMiddleware');

const router = express.Router();


router.post(
  '/addfilm',
  protect,
  adminOnly,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 },
  ]),
  addFilm
);


router.put(
  '/updateFilm/:id',
  protect,
  adminOnly,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 },
  ]),
  updateFilm
);

router.get('/', getFilms);
router.delete('/deleteFilm/:id', protect, adminOnly, deleteFilm);

module.exports = router;
