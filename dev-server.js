/* PHASE 7 prototype — статический сервер без зависимостей.
   Дефолт: host 0.0.0.0, port 7100. Понимает аргументы:
   --host/-H <host>, --port/-p <port>, а также формат --port=7100.
   Любые нераспознанные аргументы игнорируются (совместимость с npm run dev -- ...). */
const http = require('http');
const fs = require('fs');
const path = require('path');

const root = __dirname;
let host = '0.0.0.0';
let port = 7100;
const argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if ((a === '--port' || a === '-p') && argv[i + 1]) { port = parseInt(argv[++i], 10) || port; }
  else if (a.startsWith('--port=')) { port = parseInt(a.split('=')[1], 10) || port; }
  else if ((a === '--host' || a === '-H') && argv[i + 1]) { host = argv[++i]; }
  else if (a.startsWith('--host=')) { host = a.split('=')[1]; }
}
if (process.env.PORT) port = parseInt(process.env.PORT, 10) || port;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
  '.svg': 'image/svg+xml', '.webp': 'image/webp', '.ico': 'image/x-icon',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf',
};

http.createServer((req, res) => {
  try {
    let urlPath = decodeURIComponent(req.url.split('?')[0]);
    if (urlPath === '/' || urlPath === '') urlPath = '/index.html';
    const filePath = path.join(root, path.normalize(urlPath));
    if (!filePath.startsWith(root)) { res.writeHead(403); res.end('Forbidden'); return; }
    fs.readFile(filePath, (err, data) => {
      if (err) { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); res.end('Not found'); return; }
      res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream' });
      res.end(data);
    });
  } catch (e) {
    res.writeHead(500); res.end('Error');
  }
}).listen(port, host, () => {
  console.log(`SNS proto7: http://${host}:${port}/`);
});
