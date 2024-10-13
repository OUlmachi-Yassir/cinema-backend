const express = require('express');
const router = express.Router();
const {createSeance,getSeances,getSeanceById,updateSeance,deleteSeance} = require('../controllers/seanceController');
const {protect, adminOnly }= require('../middlewares/authMiddleware')


router.get('/', getSeances);
router.get('/:id',protect, adminOnly ,getSeanceById);

router.post('/add',protect, adminOnly, createSeance);
router.put('/update/:id',protect, adminOnly, updateSeance);
router.delete('/delete/:id',protect, adminOnly, deleteSeance);

module.exports = router;
