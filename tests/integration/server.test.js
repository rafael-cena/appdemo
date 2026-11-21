const request = require('supertest');
const app = require('../../app');

describe('GET / - Integration Tests', () => {
  describe('Page Rendering', () => {
    test('returns 200 OK', async () => {
      await request(app)
        .get('/')
        .expect(200);
    });

    test('returns HTML content', async () => {
      const response = await request(app)
        .get('/')
        .expect('Content-Type', /text\/html/);
    });

    test('contains updated title: "App Demo - Informações do Servidor (alterado pelo Claude Code)"', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.text).toContain('<title>App Demo - Informações do Servidor (alterado pelo Claude Code)</title>');
    });

    test('contains updated h1: "Informações do Servidor (alterado pelo Claude Code)"', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.text).toContain('<h1>Informações do Servidor (alterado pelo Claude Code)</h1>');
    });

    test('contains server IP display', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.text).toContain('Endereço IP do Servidor:');
    });

    test('contains initial server time display with id="server-time"', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.text).toContain('id="server-time"');
      expect(response.text).toContain('Hora Atual do Servidor:');
    });

    test('includes clock.js script tag', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.text).toContain('<script src="/js/clock.js"></script>');
    });

    test('time format matches YYYY-MM-DD HH:mm:ss', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      const timeRegex = /Hora Atual do Servidor: \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/;
      expect(response.text).toMatch(timeRegex);
    });
  });

  describe('IP Address', () => {
    test('IP is not the fallback "Endereço IP não encontrado"', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      // Should not contain the fallback message
      expect(response.text).not.toContain('Endereço IP não encontrado');
    });

    test('IP contains valid IPv4 address (no GITACTIONS suffix)', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      // IP should be valid IPv4 format without GITACTIONS suffix
      expect(response.text).toMatch(/Endereço IP do Servidor: \d+\.\d+\.\d+\.\d+/);
      expect(response.text).not.toContain('GITACTIONS');
    });
  });
});