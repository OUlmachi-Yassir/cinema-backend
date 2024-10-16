const express = require('express');
const { addAdmin, updateAdmin, deleteAdmin, getAdmins,getStatistics  } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middlewares/authMiddleware'); 
const router = express.Router();


router.get('/', protect, adminOnly, getAdmins); 
router.get('/statistics',protect ,adminOnly, getStatistics)
router.post('/addAdmin', protect, adminOnly, addAdmin); 
router.put('/updateAdmin/:id', protect, adminOnly, updateAdmin); 
router.delete('/deleteAdmin/:id', protect, adminOnly, deleteAdmin); 

module.exports = router;


// "email": "admin@example.com",
// "password": "password"