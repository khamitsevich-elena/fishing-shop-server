import request from 'supertest';
import app from '../app.js';

describe('App', () => {
  test('GET /api/health returns ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  test('unknown routes return 404', async () => {
    const res = await request(app).get('/api/unknown');
    expect(res.status).toBe(404);
    expect(res.body.message).toBeDefined();
  });

  test('security headers are set by helmet', async () => {
    const res = await request(app).get('/api/health');
    expect(res.headers['x-frame-options']).toBeDefined();
    expect(res.headers['x-content-type-options']).toBe('nosniff');
  });
});
