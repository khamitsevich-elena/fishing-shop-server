import request from 'supertest';
import app from '../app.js';

describe('Auth validation', () => {
  test('register rejects invalid email', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'not-an-email',
      password: '123',
    });
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeInstanceOf(Array);
  });

  test('login rejects missing password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: '',
    });
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeInstanceOf(Array);
  });
});
