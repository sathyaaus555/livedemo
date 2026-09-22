import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createBank } from './bank.js';

const bank = createBank();
const root = dirname(fileURLToPath(import.meta.url));
const assets = { '/': ['index.html', 'text/html'], '/app.js': ['app.js', 'text/javascript'], '/style.css': ['style.css', 'text/css'] };
const port = Number(process.env.PORT || 3000);

const server = createServer(async (req, res) => {
  const send = (status, value) => { res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(value)); };
  if (req.url === '/api/accounts' && req.method === 'GET') return send(200, bank.accounts());
  if (req.url === '/api/transfer' && req.method === 'POST') {
    try {
      let body = '';
      for await (const chunk of req) { body += chunk; if (body.length > 10000) throw new Error('Request is too large.'); }
      return send(200, { message: 'Transfer Successful', accounts: bank.transfer(JSON.parse(body)) });
    } catch (error) { return send(400, { error: error instanceof SyntaxError ? 'Invalid request.' : error.message }); }
  }
  if (req.method === 'GET' && Object.hasOwn(assets, req.url)) {
    const [file, type] = assets[req.url];
    res.writeHead(200, { 'Content-Type': `${type}; charset=utf-8`, 'Cache-Control': 'no-store' });
    return res.end(await readFile(join(root, 'public', file)));
  }
  send(404, { error: 'Not found.' });
});

server.listen(port, () => console.log(`ABC Bank running at http://localhost:${port}`));
