const request = require('supertest');
const app = require('../../app');

describe('Page Title and Header - Unit Tests', () => {
  describe('Exact String Validation per data-model.md (RV-001, RV-002) and spec.md (FR-004, FR-005, SC-002, SC-003)', () => {
    test('GET / returns exact title: "App Demo - Informações do Servidor (alterado pelo Claude Code)"', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      const expectedTitle = 'App Demo - Informações do Servidor (alterado pelo Claude Code)';
      const titleMatch = response.text.match(/<title>(.*?)<\/title>/);
      expect(titleMatch).not.toBeNull();
      expect(titleMatch[1]).toBe(expectedTitle);
    });

    test('GET / returns exact h1: "Informações do Servidor (alterado pelo Claude Code)"', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      const expectedHeader = 'Informações do Servidor (alterado pelo Claude Code)';
      const h1Match = response.text.match(/<h1>(.*?)<\/h1>/);
      expect(h1Match).not.toBeNull();
      expect(h1Match[1]).toBe(expectedHeader);
    });

    test('Title contains "(alterado pelo Claude Code)" substring', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      const titleMatch = response.text.match(/<title>(.*?)<\/title>/);
      expect(titleMatch[1]).toContain('(alterado pelo Claude Code)');
    });

    test('Header contains "(alterado pelo Claude Code)" substring', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      const h1Match = response.text.match(/<h1>(.*?)<\/h1>/);
      expect(h1Match[1]).toContain('(alterado pelo Claude Code)');
    });

    test('Title does NOT contain old "(ALTERADO)" uppercase', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      const titleMatch = response.text.match(/<title>(.*?)<\/title>/);
      expect(titleMatch[1]).not.toContain('(ALTERADO)');
    });

    test('Header does NOT contain old "(ALTERADO)" uppercase', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      const h1Match = response.text.match(/<h1>(.*?)<\/h1>/);
      expect(h1Match[1]).not.toContain('(ALTERADO)');
    });
  });
});