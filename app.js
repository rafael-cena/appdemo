const express = require('express');
const os = require('os');
const moment = require('moment');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Configurar EJS como a engine de visualização
app.set('view engine', 'ejs');

// Servir arquivos estáticos da pasta public/
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  // Obter o endereço IP do servidor
  const ip = getIpAddress() + "GITACTIONS";

  // Obter a hora atual do servidor
  const horaAtual = moment().format('YYYY-MM-DD HH:mm:ss');

  // Renderizar a página ejs com as informações
  res.render('index', { ip, horaAtual });
});

// GET /api/time - Retorna a hora atual do servidor
// Contrato: contracts/api-time.json
app.get('/api/time', (req, res) => {
  try {
    const time = moment().format('YYYY-MM-DD HH:mm:ss');
    res.set({
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    res.status(200).json({ time, source: 'server' });
  } catch (error) {
    console.error('Erro ao obter hora do servidor:', error);
    res.status(500).json({ error: 'Falha ao obter hora do servidor' });
  }
});

// Função para obter o endereço IP do servidor
function getIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const iface in interfaces) {
    const ifaceInfo = interfaces[iface];
    for (const alias of ifaceInfo) {
      if (alias.family === 'IPv4' && !alias.internal) {
        return alias.address;
      }
    }
  }
  return 'Endereço IP não encontrado';
}

// Export app for testing
module.exports = app;

// Start server only if not in test mode
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
  });
}