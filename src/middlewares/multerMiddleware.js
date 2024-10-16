const multer = require('multer');
const path = require('path');
const fs = require('fs');


const ensureDirectories = () => {
  const directories = ['uploads', 'uploads/videos'];
  directories.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });
};

ensureDirectories();


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'image') {
      cb(null, 'uploads'); 
    } else if (file.fieldname === 'video') {
      cb(null, 'uploads/videos'); 
    } else {
      cb(new Error('Invalid field name'), false);
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});


const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'image') {
    const imageTypes = /jpeg|jpg|png|webp/;
    const extname = imageTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = imageTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      return cb(new Error('Images only!'));
    }
  } else if (file.fieldname === 'video') {
    const videoTypes = /mp4|mov|avi|mkv/;
    const extname = videoTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = videoTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      return cb(new Error('Videos only!'));
    }
  } else {
    return cb(new Error('Unexpected field'), false);
  }
};


const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, 
});

module.exports = upload;
