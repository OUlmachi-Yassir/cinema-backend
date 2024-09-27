const User = require('../models/userModel');
const { registerUser, loginUser, logoutUser, sendNotification } = require('../controllers/userController');
const { addTokenToBlacklist } = require('../middlewares/tokenBlacklist');
const bcrypt = require('bcryptjs');

jest.mock('../models/userModel');
jest.mock('../middlewares/tokenBlacklist');

describe('User Controller', () => {
  const req = {
    body: {},
    user: { name: 'John Doe', role: 'user' },
    headers: {},
    cookie: jest.fn(),
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    cookie: jest.fn().mockReturnThis(),
  };

  beforeAll(() => {
    process.env.JWT_SECRET = 'your_jwt_secret_key'; // Set your JWT secret
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should register a new user and return token', async () => {
      req.body = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password123',
      };

      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({
        _id: '1',
        name: 'John Doe',
        email: 'johndoe@example.com',
        role: 'user',
      });

      await registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        name: 'John Doe',
        email: 'johndoe@example.com',
        message: 'User registered successfully',
      }));
    });

    it('should return an error if user already exists', async () => {
      req.body = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password123',
      };

      User.findOne.mockResolvedValue({ email: 'johndoe@example.com' });

      await registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'User already exists' });
    });
  });

  describe('loginUser', () => {
    it('should login a user and return a token', async () => {
      req.body = {
        email: 'johndoe@example.com',
        password: 'password123',
      };

      const user = {
        _id: '1',
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: await bcrypt.hash('password123', 10),
        matchPassword: jest.fn().mockResolvedValue(true),
      };

      User.findOne.mockResolvedValue(user);

      await loginUser(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        name: 'John Doe',
        email: 'johndoe@example.com',
        message: 'Login successful',
      }));
    });

    it('should return an error if credentials are invalid', async () => {
      req.body = {
        email: 'johndoe@example.com',
        password: 'wrongpassword',
      };

      User.findOne.mockResolvedValue(null);

      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid email or password' });
    });
  });

  describe('logoutUser', () => {
    it('should log out a user and add the token to the blacklist', async () => {
      req.headers.authorization = 'Bearer token123';

      await logoutUser(req, res);

      expect(addTokenToBlacklist).toHaveBeenCalledWith('token123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'User has logged out successfully' });
    });

    it('should return an error if no token is provided', async () => {
      delete req.headers.authorization;

      await logoutUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'No token provided' });
    });
  });

  describe('sendNotification', () => {
    it('should send a notification if user is admin', async () => {
      req.user.role = 'admin';

      await sendNotification(req, res);

      expect(res.json).toHaveBeenCalledWith({ message: 'Notification sent!', user: req.user });
    });

    it('should return an error if user is not admin', async () => {
      req.user.role = 'user';

      await sendNotification(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Access denied' });
    });
  });
});
