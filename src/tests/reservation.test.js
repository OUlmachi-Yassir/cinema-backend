const mongoose = require('mongoose');
const Reservation = require('../models/reservationModel');
const Seance = require('../models/seanceModel');
const { createReservation } = require('../controllers/reservationController');


jest.mock('../models/reservationModel');
jest.mock('../models/seanceModel');

describe('Reservation Controller', () => {
  let user;
  let seance;

  beforeEach(() => {
    user = { _id: new mongoose.Types.ObjectId() }; 
    seance = {
      _id: new mongoose.Types.ObjectId(),
      placesDisponibles: 5,
      save: jest.fn(),
    };

    Seance.findById = jest.fn().mockReturnValue(seance);
    Reservation.countDocuments = jest.fn().mockResolvedValue(0);
  });

  afterEach(() => {
    jest.clearAllMocks(); 
  });

  test('createReservation should create a new reservation', async () => {
    const req = {
      body: {
        seance: seance._id,
        nombrePlace: 2,
      },
      user,
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    Reservation.prototype.save = jest.fn().mockResolvedValue({
      _id: new mongoose.Types.ObjectId(),
      client: user._id,
      seance: seance._id,
      nombrePlace: 2,
    });

    await createReservation(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled(); 
    expect(Reservation.prototype.save).toHaveBeenCalled();
    expect(seance.placesDisponibles).toBe(3); 
  });

  test('createReservation should return 404 if seance is not found', async () => {
    const req = {
      body: {
        seance: new mongoose.Types.ObjectId(), 
        nombrePlace: 2,
      },
      user,
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    Seance.findById.mockReturnValueOnce(null);

    await createReservation(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Seance not found' });
  });

  test('createReservation should return 400 if not enough available seats', async () => {
    const req = {
      body: {
        seance: seance._id,
        nombrePlace: 10, 
      },
      user,
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await createReservation(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Not enough available seats for this seance' });
  });

  
  
});
