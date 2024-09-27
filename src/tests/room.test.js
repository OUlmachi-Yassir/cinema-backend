const { createRoom, getRooms, updateRoom, deleteRoom } = require('../controllers/roomController');
const Room = require('../models/roomModel');

jest.mock('../models/roomModel');

describe('Room Controller Unit Tests', () => {
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
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createRoom', () => {
    it('should successfully create a room', async () => {
      req.body = { name: 'Room 1', seatCount: 10, type: 'Eco' };

      Room.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue({
          name: 'Room 1',
          seats: Array(10).fill({ seatNumber: 'Seat-1', isAvailable: true }),
          type: 'Eco',
        }),
      }));

      await createRoom(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        name: 'Room 1',
        seats: expect.any(Array),
        type: 'Eco',
      });
    });

    it('should return a 400 status code if creation fails', async () => {
      req.body = { name: 'Room 1', seatCount: 10, type: 'Eco' };

      Room.mockImplementation(() => ({
        save: jest.fn().mockRejectedValue(new Error('Failed to create room')),
      }));

      await createRoom(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Failed to create room' });
    });
  });

  describe('getRooms', () => {
    it('should retrieve a list of rooms', async () => {
      const mockRooms = [
        { name: 'Room 1', type: 'Eco', film: 'Film A' },
        { name: 'Room 2', type: 'VIP', film: 'Film B' },
      ];

      Room.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockRooms),
      });

      await getRooms(req, res);

      expect(Room.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockRooms);
    });

    it('should return a 500 status code if retrieval fails', async () => {
      
      Room.find.mockReturnValue({
        populate: jest.fn().mockRejectedValue(new Error('Database error')),
      });

      await getRooms(req, res);

      expect(Room.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });

  describe('updateRoom', () => {
    it('should update the room successfully', async () => {
      req.params.id = '12345';
      req.body = { name: 'Updated Room', seatCount: 20, type: 'VIP' };

      const mockRoom = {
        name: 'Room 1',
        type: 'Eco',
        seats: Array(10).fill({ seatNumber: 'Seat-1', isAvailable: true }),
        save: jest.fn().mockResolvedValue({
          name: 'Updated Room',
          type: 'VIP',
          seats: Array(20).fill({ seatNumber: 'Seat-1', isAvailable: true }),
        }),
      };

      Room.findById.mockResolvedValue(mockRoom);

      await updateRoom(req, res);

      expect(Room.findById).toHaveBeenCalledWith('12345');
      expect(mockRoom.name).toBe('Updated Room');
      expect(mockRoom.type).toBe('VIP');
      expect(mockRoom.seats.length).toBe(20);
      expect(mockRoom.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Room updated successfully',
        room: {
          name: 'Updated Room',
          type: 'VIP',
          seats: expect.any(Array),
        },
      });
    });

    it('should return a 404 status code if room is not found', async () => {
      req.params.id = '12345';

      Room.findById.mockResolvedValue(null);

      await updateRoom(req, res);

      expect(Room.findById).toHaveBeenCalledWith('12345');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Room not found' });
    });

    it('should return a 500 status code if an error occurs', async () => {
      req.params.id = '12345';

      Room.findById.mockRejectedValue(new Error('Database error'));

      await updateRoom(req, res);

      expect(Room.findById).toHaveBeenCalledWith('12345');
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });

  describe('deleteRoom', () => {
    it('should delete a room successfully', async () => {
      req.params.id = '12345';

      const mockRoom = { remove: jest.fn().mockResolvedValue() };

      Room.findById.mockResolvedValue(mockRoom);

      await deleteRoom(req, res);

      expect(Room.findById).toHaveBeenCalledWith('12345');
      expect(mockRoom.remove).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Room deleted successfully' });
    });

    it('should return a 404 status code if room is not found', async () => {
      req.params.id = '12345';

      Room.findById.mockResolvedValue(null);

      await deleteRoom(req, res);

      expect(Room.findById).toHaveBeenCalledWith('12345');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Room not found' });
    });

    it('should return a 500 status code if an error occurs', async () => {
      req.params.id = '12345';

      Room.findById.mockRejectedValue(new Error('Database error'));

      await deleteRoom(req, res);

      expect(Room.findById).toHaveBeenCalledWith('12345');
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });
});
