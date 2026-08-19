const request = require('supertest');
const mongoose = require('mongoose');

// Mock Database connection before loading server.js
jest.mock('../config/db', () => {
  return jest.fn().mockImplementation(() => {
    console.log('Mocked DB connection call in test');
  });
});

const User = require('../models/User');
const server = require('../server');

describe('Authentication & Health Endpoints', () => {
  afterAll(async () => {
    await server.close();
  });

  describe('GET /api/health', () => {
    it('should return 200 and healthy status', async () => {
      const res = await request(server).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ status: 'healthy' });
    });
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      // Mock User.findOne to return null (user doesn't exist)
      jest.spyOn(User, 'findOne').mockResolvedValue(null);

      // Mock User.create to return a user object
      jest.spyOn(User, 'create').mockResolvedValue({
        _id: new mongoose.Types.ObjectId(),
        name: 'John Doe',
        email: 'john@example.com',
        role: 'customer',
      });

      const res = await request(server)
        .post('/api/auth/register')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.email).toBe('john@example.com');
      
      User.findOne.mockRestore();
      User.create.mockRestore();
    });

    it('should return 400 if user already exists', async () => {
      jest.spyOn(User, 'findOne').mockResolvedValue({
        email: 'john@example.com',
      });

      const res = await request(server)
        .post('/api/auth/register')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('User already exists');

      User.findOne.mockRestore();
    });
  });

  describe('POST /api/auth/login', () => {
    it('should authenticate user and return token', async () => {
      const mockUser = {
        _id: new mongoose.Types.ObjectId(),
        name: 'John Doe',
        email: 'john@example.com',
        role: 'customer',
        matchPassword: jest.fn().mockResolvedValue(true),
      };

      // Mock User.findOne to support chained select
      const mockQuery = {
        select: jest.fn().mockResolvedValue(mockUser),
      };
      jest.spyOn(User, 'findOne').mockReturnValue(mockQuery);

      const res = await request(server)
        .post('/api/auth/login')
        .send({
          email: 'john@example.com',
          password: 'password123',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.email).toBe('john@example.com');

      User.findOne.mockRestore();
    });

    it('should return 401 for incorrect password', async () => {
      const mockUser = {
        _id: new mongoose.Types.ObjectId(),
        name: 'John Doe',
        email: 'john@example.com',
        role: 'customer',
        matchPassword: jest.fn().mockResolvedValue(false),
      };

      const mockQuery = {
        select: jest.fn().mockResolvedValue(mockUser),
      };
      jest.spyOn(User, 'findOne').mockReturnValue(mockQuery);

      const res = await request(server)
        .post('/api/auth/login')
        .send({
          email: 'john@example.com',
          password: 'password123',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Invalid email or password');

      User.findOne.mockRestore();
    });
  });
});
