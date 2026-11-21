const request = require('supertest');
const app = require('../../app');

describe('GET /api/time - Contract Tests', () => {
  describe('Response Structure', () => {
    test('returns 200 OK', async () => {
      const response = await request(app)
        .get('/api/time')
        .set('Accept', 'application/json')
        .expect(200);
    });

    test('returns Content-Type application/json', async () => {
      const response = await request(app)
        .get('/api/time')
        .set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/);
    });

    test('returns JSON with required fields: time, source', async () => {
      const response = await request(app)
        .get('/api/time')
        .set('Accept', 'application/json')
        .expect(200);

      expect(response.body).toHaveProperty('time');
      expect(response.body).toHaveProperty('source');
    });

    test('source field equals "server"', async () => {
      const response = await request(app)
        .get('/api/time')
        .set('Accept', 'application/json')
        .expect(200);

      expect(response.body.source).toBe('server');
    });

    test('time field matches format YYYY-MM-DD HH:mm:ss', async () => {
      const response = await request(app)
        .get('/api/time')
        .set('Accept', 'application/json')
        .expect(200);

      const timeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
      expect(response.body.time).toMatch(timeRegex);
    });

    test('time value is a valid date/time', async () => {
      const response = await request(app)
        .get('/api/time')
        .set('Accept', 'application/json')
        .expect(200);

      // Parse the time string to verify it's a valid date
      const parsed = new Date(response.body.time.replace(' ', 'T'));
      expect(parsed).toBeInstanceOf(Date);
      expect(parsed.getTime()).not.toBeNaN();
    });
  });

  describe('Cache-Control Headers', () => {
    test('includes Cache-Control: no-cache, no-store, must-revalidate', async () => {
      const response = await request(app)
        .get('/api/time')
        .set('Accept', 'application/json')
        .expect(200);

      const cacheControl = response.headers['cache-control'];
      expect(cacheControl).toContain('no-cache');
      expect(cacheControl).toContain('no-store');
      expect(cacheControl).toContain('must-revalidate');
    });

    test('includes Pragma: no-cache', async () => {
      const response = await request(app)
        .get('/api/time')
        .set('Accept', 'application/json')
        .expect(200);

      expect(response.headers.pragma).toBe('no-cache');
    });

    test('includes Expires: 0', async () => {
      const response = await request(app)
        .get('/api/time')
        .set('Accept', 'application/json')
        .expect(200);

      expect(response.headers.expires).toBe('0');
    });
  });

  describe('Error Handling', () => {
    // Note: Testing 500 error would require mocking moment() to throw
    // This is covered by the try/catch in the route handler
  });
});