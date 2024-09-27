const Film = require('../models/filmModel');
const {
  getFilms,
  addFilm,
  updateFilm,
  deleteFilm
} = require('../controllers/filmController');

jest.mock('../models/filmModel'); 

describe('Film Controller', () => {
  const req = {
    body: {},
    params: {},
    file: {},
  };
  const res = {
    json: jest.fn().mockReturnThis(),
    status: jest.fn().mockReturnThis(),
  };

  beforeEach(() => {
    jest.clearAllMocks(); 
  });

  describe('getFilms', () => {
    it('should return a list of films', async () => {
      const mockFilms = [
        { _id: '1', title: 'Film One', director: 'Director One', releaseYear: 2021, genre: 'Action' },
        { _id: '2', title: 'Film Two', director: 'Director Two', releaseYear: 2022, genre: 'Drama' },
      ];

      Film.find.mockResolvedValue(mockFilms);
      await getFilms(req, res);

      expect(res.json).toHaveBeenCalledWith(mockFilms);
    });

    it('should return an error if there is a server issue', async () => {
      Film.find.mockRejectedValue(new Error('Database error')); 

      await getFilms(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });

  describe('addFilm', () => {
    it('should add a new film successfully with an image', async () => {
      req.body = {
        title: 'New Film',
        director: 'New Director',
        releaseYear: 2023,
        genre: 'Comedy',
      };
  
      // Mock the file upload
      req.file = {
        path: '/uploads/new-film.jpg', // example path
      };
  
      const mockFilm = {
        title: 'New Film',
        director: 'New Director',
        releaseYear: 2023,
        genre: 'Comedy',
        image: req.file.path, // Include the image path here
        save: jest.fn().mockResolvedValue(),
      };
  
      Film.mockImplementation(() => mockFilm);
  
      await addFilm(req, res);
  
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Film added successfully',
        newFilm: mockFilm,
      }));
    });
  
    it('should return an error if no image file is provided', async () => {
      req.body = {
        title: 'New Film Without Image',
        director: 'New Director',
        releaseYear: 2023,
        genre: 'Comedy',
      };
  
      req.file = null; 
  
      await addFilm(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'No image file provided' });
    });
  
    it('should return an error if there is an issue adding the film', async () => {
      req.body = {
        title: 'Faulty Film',
        director: 'Faulty Director',
        releaseYear: 2023,
        genre: 'Drama',
      };
  
      req.file = {
        path: '/uploads/faulty-film.jpg',
      };
  
      Film.mockImplementation(() => { throw new Error('Save failed'); });
  
      await addFilm(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Save failed' });
    });
  });
  

  describe('updateFilm', () => {
    it('should update an existing film successfully', async () => {
      req.params.id = '1';
      req.body = {
        title: 'Updated Film',
        director: 'Updated Director',
        releaseYear: 2024,
        genre: 'Thriller',
      };

      const mockFilm = {
        _id: '1',
        title: 'Old Film',
        director: 'Old Director',
        releaseYear: 2021,
        genre: 'Action',
        save: jest.fn().mockResolvedValue(), 
      };

      Film.findById.mockResolvedValue(mockFilm); 

      await updateFilm(req, res);

      expect(mockFilm.title).toBe('Updated Film'); 
      expect(mockFilm.director).toBe('Updated Director'); 
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Film updated successfully',
        film: mockFilm,
      }));
    });

    it('should return an error if film not found', async () => {
      req.params.id = '2'; 

      Film.findById.mockResolvedValue(null); 

      await updateFilm(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Film not found' });
    });

    it('should return an error if there is an issue updating the film', async () => {
      req.params.id = '1';
      req.body = {
        title: 'Another Film',
      };

      const mockFilm = {
        _id: '1',
        title: 'Old Film',
        director: 'Old Director',
        releaseYear: 2021,
        genre: 'Action',
        save: jest.fn().mockRejectedValue(new Error('Update failed')),
      };

      Film.findById.mockResolvedValue(mockFilm);

      await updateFilm(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Update failed' });
    });
  });

  describe('deleteFilm', () => {
    it('should delete an existing film successfully', async () => {
      req.params.id = '1';

      const mockFilm = {
        _id: '1',
        title: 'Film One',
        director: 'Director One',
        releaseYear: 2021,
        genre: 'Action',
        remove: jest.fn().mockResolvedValue(), 
      };

      Film.findById.mockResolvedValue(mockFilm); 

      await deleteFilm(req, res);

      expect(mockFilm.remove).toHaveBeenCalled(); 
      expect(res.json).toHaveBeenCalledWith({ message: 'Film deleted successfully' });
    });

    it('should return an error if film not found', async () => {
      req.params.id = '2'; 

      Film.findById.mockResolvedValue(null); 

      await deleteFilm(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Film not found' });
    });

    it('should return an error if there is an issue deleting the film', async () => {
      req.params.id = '1';

      const mockFilm = {
        _id: '1',
        title: 'Film One',
        director: 'Director One',
        releaseYear: 2021,
        genre: 'Action',
        remove: jest.fn().mockRejectedValue(new Error('Delete failed')), 
      };

      Film.findById.mockResolvedValue(mockFilm); 

      await deleteFilm(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Delete failed' });
    });
  });
});
