const Film = require('../models/filmModel');
const path = require('path');
const fs = require('fs');
const { minioClient, BUCKET_NAME } = require('../config/minioConfig');


const uploadToMinio = (filePath, fileName) => {
  return new Promise((resolve, reject) => {
    const fileStream = fs.createReadStream(filePath);
    minioClient.putObject(BUCKET_NAME, fileName, fileStream, (err, etag) => {
      if (err) {
        return reject(err);
      }

      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error('Error deleting local file:', unlinkErr);
        }
      });
      resolve(etag);
    });
  });
};


const getPresignedUrl = (objectName, expires = 24 * 60 * 60) => { // 24 hours
  return new Promise((resolve, reject) => {
    minioClient.presignedGetObject(BUCKET_NAME, objectName, expires, (err, url) => {
      if (err) return reject(err);
      resolve(url);
    });
  });
};


const deleteVideoFromMinio = (objectName) => {
  return new Promise((resolve, reject) => {
    minioClient.removeObject(BUCKET_NAME, objectName, (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
};

const addFilm = async (req, res) => {
  try {
    const { title, director, releaseYear, genre } = req.body;

    if (!title || !director || !genre || !releaseYear) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!req.files || !req.files.image || req.files.image.length === 0) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    const imageFile = req.files.image[0];
    if (!imageFile || !imageFile.filename) {
      return res.status(400).json({ message: 'Image file upload failed' });
    }

    const imagePath = path.join('uploads', imageFile.filename).replace(/\\/g, '/');

    let videoObjectName = null;
    let presignedVideoUrl = null;

    if (req.files.video && req.files.video.length > 0) {
      const videoFile = req.files.video[0];
      if (!videoFile.filename) {
        return res.status(400).json({ message: 'Video file upload failed' });
      }
      videoObjectName = `videos/${videoFile.filename}`;
      const videoPath = path.join('uploads/videos', videoFile.filename).replace(/\\/g, '/');
      try {
        await uploadToMinio(videoPath, videoObjectName);
        presignedVideoUrl = await getPresignedUrl(videoObjectName, 24 * 60 * 60); // 24 hours
      } catch (error) {
        console.error('Error uploading video to MinIO:', error);
        return res.status(500).json({ message: 'Error uploading video to storage', error: error.message });
      }
    }

    const newFilm = new Film({
      title,
      director,
      releaseYear,
      genre,
      image: imagePath,
      videoObjectName, 
      videoUrl: presignedVideoUrl, 
    });
    await newFilm.save();
    res.status(201).json({ message: 'Film added successfully', newFilm });
  } catch (error) {
    console.error('Error in addFilm:', error);
    res.status(500).json({ message: error.message });
  }
};

const getFilms = async (req, res) => {
  try {
    const films = await Film.find();

    const filmsWithVideoUrls = await Promise.all(
      films.map(async (film) => {
        let videoUrl = null;
        if (film.videoObjectName) {
          try {
            videoUrl = await getPresignedUrl(film.videoObjectName, 24 * 60 * 60); // 24 hours
          } catch (error) {
            console.error(`Error generating presigned URL for film ${film._id}:`, error);
          }
        }

        return {
          ...film.toObject(),
          videoUrl, 
        };
      })
    );

    res.json(filmsWithVideoUrls);
  } catch (error) {
    console.error('Error in getFilms:', error);
    res.status(500).json({ message: error.message });
  }
};

const updateFilm = async (req, res) => {
  try {
    console.log('Received req.files:', req.files);

    const { id } = req.params;
    const { title, director, releaseYear, genre } = req.body;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid film ID format' });
    }

    const film = await Film.findById(id);
    if (!film) {
      return res.status(404).json({ message: 'Film not found' });
    }

    film.title = title || film.title;
    film.director = director || film.director;
    film.releaseYear = releaseYear || film.releaseYear;
    film.genre = genre || film.genre;

    if (req.files.image && req.files.image.length > 0) {
      const imageFile = req.files.image[0];
      if (!imageFile.filename) {
        return res.status(400).json({ message: 'Image file upload failed' });
      }
      const imagePath = path.join('uploads', imageFile.filename).replace(/\\/g, '/');
      film.image = imagePath;
    }

    if (req.files.video && req.files.video.length > 0) {
      const videoFile = req.files.video[0];
      if (!videoFile.filename) {
        return res.status(400).json({ message: 'Video file upload failed' });
      }
      const videoObjectName = `videos/${videoFile.filename}`;
      const videoPath = path.join('uploads/videos', videoFile.filename).replace(/\\/g, '/');
      try {
        await uploadToMinio(videoPath, videoObjectName);
        const presignedVideoUrl = await getPresignedUrl(videoObjectName, 24 * 60 * 60); // 24 hours
        if (film.videoObjectName) {
          await deleteVideoFromMinio(film.videoObjectName);
        }
        film.videoObjectName = videoObjectName;
        film.videoUrl = presignedVideoUrl;
      } catch (error) {
        console.error('Error uploading video to MinIO:', error);
        return res.status(500).json({ message: 'Error uploading video to storage', error: error.message });
      }
    }

    await film.save();
    res.json({ message: 'Film updated successfully', film });
  } catch (error) {
    console.error('Error in updateFilm:', error);
    res.status(500).json({ message: error.message });
  }
};

const deleteFilm = async (req, res) => {
  try {
    const { id } = req.params;

    console.log(`Attempting to delete film with ID: ${id}`);
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      console.log('Invalid film ID format.');
      return res.status(400).json({ message: 'Invalid film ID format' });
    }

    const film = await Film.findById(id);
    console.log('Film found:', film);

    if (!film) {
      console.log('Film not found.');
      return res.status(404).json({ message: 'Film not found' });
    }


    if (film.videoObjectName) {
      console.log(`Deleting video from MinIO: ${film.videoObjectName}`);
      try {
        await deleteVideoFromMinio(film.videoObjectName);
        console.log(`Video ${film.videoObjectName} deleted from MinIO.`);
      } catch (err) {
        console.error('Error deleting video from MinIO:', err);
      }
    }

    await Film.findByIdAndDelete(id);
    console.log('Film deleted from database.');

    res.json({ message: 'Film deleted successfully' });
  } catch (error) {
    console.error('Error in deleteFilm:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getFilms, addFilm, updateFilm, deleteFilm };
