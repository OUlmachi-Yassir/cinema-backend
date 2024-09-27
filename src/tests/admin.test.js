const User = require('../models/userModel');
const {
  getAdmins,
  addAdmin,
  updateAdmin,
  deleteAdmin
} = require('../controllers/adminController');

jest.mock('../models/userModel'); 

describe('Admin Controller', () => {
  const req = {
    body: {},
    params: {},
  };
  const res = {
    json: jest.fn().mockReturnThis(),
    status: jest.fn().mockReturnThis(),
  };

  beforeEach(() => {
    jest.clearAllMocks(); 
  });

  describe('getAdmins', () => {
    it('should return a list of admins', async () => {
      const mockAdmins = [
        { _id: '1', name: 'Admin One', email: 'admin1@example.com' },
        { _id: '2', name: 'Admin Two', email: 'admin2@example.com' },
      ];

      User.find.mockResolvedValue(mockAdmins); 

      await getAdmins(req, res);

      expect(res.json).toHaveBeenCalledWith(mockAdmins);
    });
  });

  describe('addAdmin', () => {
    it('should add a new admin successfully', async () => {
      req.body = {
        name: 'New Admin',
        email: 'newadmin@example.com',
        password: 'password123',
      };

      User.findOne.mockResolvedValue(null); 
      User.prototype.save = jest.fn().mockResolvedValue();

      await addAdmin(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Admin added successfully',
      }));
    });

    it('should return an error if admin already exists', async () => {
      req.body = {
        name: 'Existing Admin',
        email: 'existingadmin@example.com',
        password: 'password123',
      };

      User.findOne.mockResolvedValue({}); 

      await addAdmin(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'User already exists' });
    });
  });

  describe('updateAdmin', () => {
    it('should update an existing admin successfully', async () => {
      req.params.id = '1';
      req.body = {
        name: 'Updated Admin',
        email: 'updatedadmin@example.com',
        password: 'newpassword123',
      };

      const mockAdmin = {
        _id: '1',
        name: 'Admin One',
        email: 'admin1@example.com',
        role: 'admin',
        save: jest.fn().mockResolvedValue(),
      };

      User.findById.mockResolvedValue(mockAdmin); 

      await updateAdmin(req, res);

      expect(mockAdmin.name).toBe('Updated Admin'); 
      expect(mockAdmin.email).toBe('updatedadmin@example.com'); 
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Admin updated successfully',
      }));
    });

    it('should return an error if admin not found', async () => {
      req.params.id = '2'; 

      User.findById.mockResolvedValue(null); 

      await updateAdmin(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Admin not found' });
    });
  });

  describe('deleteAdmin', () => {
    it('should delete an existing admin successfully', async () => {
      req.params.id = '1';

      const mockAdmin = {
        _id: '1',
        name: 'Admin One',
        role: 'admin',
        remove: jest.fn().mockResolvedValue(),
      };

      User.findById.mockResolvedValue(mockAdmin); 

      await deleteAdmin(req, res);

      expect(mockAdmin.remove).toHaveBeenCalled(); 
      expect(res.json).toHaveBeenCalledWith({ message: 'Admin deleted successfully' });
    });

    it('should return an error if admin not found', async () => {
      req.params.id = '2'; 

      User.findById.mockResolvedValue(null); 

      await deleteAdmin(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Admin not found' });
    });
  });
});
