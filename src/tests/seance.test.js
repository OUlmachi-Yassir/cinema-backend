const { createSeance, getSeances, getSeanceById, updateSeance, deleteSeance } = require('../controllers/seanceController');
const Room = require('../models/roomModel');
const Seance = require('../models/seanceModel');

jest.mock('../models/roomModel');
jest.mock('../models/seanceModel');

describe('Seance Controller Unit Tests', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe('createSeance', () => {
    it('should successfully create a seance', async () => {
      req.body = { horaire: '18:00', tarif: 12, film: 'Film ID', room: 'Room ID' };

      const mockRoom = { 
        seats: [
          { isAvailable: true }, 
          { isAvailable: false }, 
          { isAvailable: true }
        ] 
      };

      Room.findById.mockResolvedValue(mockRoom);

      Seance.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue({
          horaire: '18:00',
          tarif: 12,
          film: 'Film ID',
          room: 'Room ID',
          placesDisponibles: 2,
        }),
      }));

      await createSeance(req, res);

      expect(Room.findById).toHaveBeenCalledWith('Room ID');
      expect(Seance).toHaveBeenCalledWith({
        horaire: '18:00',
        tarif: 12,
        film: 'Film ID',
        room: 'Room ID',
        placesDisponibles: 2,
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        horaire: '18:00',
        tarif: 12,
        film: 'Film ID',
        room: 'Room ID',
        placesDisponibles: 2,
      });
    });

    it('should return 404 if room is not found', async () => {
      req.body = { horaire: '18:00', tarif: 12, film: 'Film ID', room: 'Room ID' };

      Room.findById.mockResolvedValue(null);

      await createSeance(req, res);

      expect(Room.findById).toHaveBeenCalledWith('Room ID');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Room not found' });
    });

    it('should return 400 if no available seats', async () => {
      req.body = { horaire: '18:00', tarif: 12, film: 'Film ID', room: 'Room ID' };

      const mockRoom = { 
        seats: [
          { isAvailable: false }, 
          { isAvailable: false }
        ] 
      };

      Room.findById.mockResolvedValue(mockRoom);

      await createSeance(req, res);

      expect(Room.findById).toHaveBeenCalledWith('Room ID');
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'No available seats in the room' });
    });

    it('should return 400 on save failure', async () => {
      req.body = { horaire: '18:00', tarif: 12, film: 'Film ID', room: 'Room ID' };

      const mockRoom = { 
        seats: [
          { isAvailable: true }, 
          { isAvailable: false }
        ] 
      };

      Room.findById.mockResolvedValue(mockRoom);

      Seance.mockImplementation(() => ({
        save: jest.fn().mockRejectedValue(new Error('Save failed')),
      }));

      await createSeance(req, res);

      expect(Room.findById).toHaveBeenCalledWith('Room ID');
      expect(Seance).toHaveBeenCalledWith({
        horaire: '18:00',
        tarif: 12,
        film: 'Film ID',
        room: 'Room ID',
        placesDisponibles: 1,
      });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Save failed' });
    });
  });

  describe('getSeances', () => {
    it('should retrieve all seances', async () => {
      const mockSeances = [
        { horaire: '18:00', tarif: 12, film: 'Film A', room: 'Room A' },
        { horaire: '20:00', tarif: 15, film: 'Film B', room: 'Room B' },
      ];

      Seance.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(mockSeances),
        }),
      });

      await getSeances(req, res);

      expect(Seance.find).toHaveBeenCalled();
      expect(Seance.find().populate).toHaveBeenCalledWith('film');
      expect(Seance.find().populate().populate).toHaveBeenCalledWith('room');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockSeances);
    });

    it('should return 500 status code if retrieval fails', async () => {
      Seance.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockRejectedValue(new Error('Database error')),
        }),
      });

      await getSeances(req, res);

      expect(Seance.find).toHaveBeenCalled();
      expect(Seance.find().populate).toHaveBeenCalledWith('film');
      expect(Seance.find().populate().populate).toHaveBeenCalledWith('room');
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });

  describe('getSeanceById', () => {
    it('should retrieve a specific seance', async () => {
      req.params.id = 'Seance ID';
      const mockSeance = { 
        horaire: '18:00', 
        tarif: 12, 
        film: 'Film ID', 
        room: 'Room ID' 
      };

      Seance.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(mockSeance),
        }),
      });

      await getSeanceById(req, res);

      expect(Seance.findById).toHaveBeenCalledWith('Seance ID');
      expect(Seance.findById().populate).toHaveBeenCalledWith('film');
      expect(Seance.findById().populate().populate).toHaveBeenCalledWith('room');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockSeance);
    });

    it('should return 404 if seance not found', async () => {
      req.params.id = 'Seance ID';

      Seance.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(null),
        }),
      });

      await getSeanceById(req, res);

      expect(Seance.findById).toHaveBeenCalledWith('Seance ID');
      expect(Seance.findById().populate).toHaveBeenCalledWith('film');
      expect(Seance.findById().populate().populate).toHaveBeenCalledWith('room');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Séance not found' });
    });

    it('should return 500 on error', async () => {
      req.params.id = 'Seance ID';

      Seance.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockRejectedValue(new Error('Database error')),
        }),
      });

      await getSeanceById(req, res);

      expect(Seance.findById).toHaveBeenCalledWith('Seance ID');
      expect(Seance.findById().populate).toHaveBeenCalledWith('film');
      expect(Seance.findById().populate().populate).toHaveBeenCalledWith('room');
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });

 

  
  describe('deleteSeance', () => {
    it('should delete a seance successfully', async () => {
      req.params.id = 'Seance ID';

      const mockSeance = { remove: jest.fn().mockResolvedValue() };

      Seance.findById.mockResolvedValue(mockSeance);

      await deleteSeance(req, res);

      expect(Seance.findById).toHaveBeenCalledWith('Seance ID');
      expect(mockSeance.remove).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Séance deleted' });
    });

    it('should return 404 if seance not found', async () => {
      req.params.id = 'Seance ID';

      Seance.findById.mockResolvedValue(null);

      await deleteSeance(req, res);

      expect(Seance.findById).toHaveBeenCalledWith('Seance ID');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Séance not found' });
    });

    it('should return 500 on error', async () => {
      req.params.id = 'Seance ID';

      Seance.findById.mockRejectedValue(new Error('Database error'));

      await deleteSeance(req, res);

      expect(Seance.findById).toHaveBeenCalledWith('Seance ID');
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });
});
