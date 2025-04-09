import request from 'supertest';
import express from 'express';
import indexController from '../../controllers/index.controller.ts'; // Adjust path accordingly

// Create an Express app and set up the route
const app = express();
app.get('/', indexController.get);

describe('GET /', () => {
  it('should return the correct JSON response', async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      name: "StockSavvy Backend",
      author: "Hemit Patel",
      date_created: "December 24 2024",
      message: "The backend that powers the StockSavvy educational platform",
    });
  });
});
