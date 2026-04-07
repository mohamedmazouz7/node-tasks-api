const request = require('supertest');
const app = require('../src/app');

describe('Tasks API', () => {

  test('GET / should return API info', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Node Tasks API is running!');
  });

  test('GET /tasks should return all tasks', async () => {
    const res = await request(app).get('/tasks');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('GET /tasks/:id should return a task', async () => {
    const res = await request(app).get('/tasks/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(1);
    expect(res.body.title).toBe('Learn Jenkins');
  });

  test('GET /tasks/:id should return 404 if not found', async () => {
    const res = await request(app).get('/tasks/999');
    expect(res.statusCode).toBe(404);
  });

  test('POST /tasks should create a new task', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({ title: 'Learn Kubernetes' });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Learn Kubernetes');
    expect(res.body.done).toBe(false);
  });

  test('POST /tasks should return 400 if title missing', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({});
    expect(res.statusCode).toBe(400);
  });
});
