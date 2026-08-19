const request = require('supertest');

// Mock Database connection before loading server.js
jest.mock('../config/db', () => {
  return jest.fn().mockImplementation(() => {
    console.log('Mocked DB connection call in test');
  });
});

const Product = require('../models/Product');
const server = require('../server');

describe('Product Endpoints', () => {
  afterAll(async () => {
    await server.close();
  });

  describe('GET /api/products', () => {
    it('should return a list of all products', async () => {
      const mockProducts = [
        { name: 'Samsung Galaxy S24', brand: 'Samsung', category: 'Smartphones', price: 999 },
        { name: 'OnePlus 12', brand: 'OnePlus', category: 'Smartphones', price: 799 },
      ];

      jest.spyOn(Product, 'find').mockResolvedValue(mockProducts);

      const res = await request(server).get('/api/products');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(2);
      expect(res.body.data[0].name).toBe('Samsung Galaxy S24');

      Product.find.mockRestore();
    });

    it('should filter products by category', async () => {
      const mockProducts = [
        { name: 'OnePlus 12', brand: 'OnePlus', category: 'Smartphones', price: 799 },
      ];

      jest.spyOn(Product, 'find').mockResolvedValue(mockProducts);

      const res = await request(server).get('/api/products?category=Smartphones');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data[0].category).toBe('Smartphones');
      expect(Product.find).toHaveBeenCalledWith({ category: 'Smartphones' });

      Product.find.mockRestore();
    });
  });
});
