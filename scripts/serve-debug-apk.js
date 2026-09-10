const fs = require('fs');
const http = require('http');
const os = require('os');
const path = require('path');

const PORT = 8000;
const HOST = '0.0.0.0';
const apkPath = path.join(
  __dirname,
  '..',
  'android',
  'app',
  'build',
  'outputs',
  'apk',
  'debug',
  'app-debug.apk',
);

function lanIPs() {
  const ips = [];
  for (const addrs of Object.values(os.networkInterfaces())) {
    for (const addr of addrs || []) {
      const family = addr.family === 4 || addr.family === 'IPv4';
      if (family && !addr.internal) {
        ips.push(addr.address);
      }
    }
  }
  return ips;
}

function sendApk(req, res) {
  if (!fs.existsSync(apkPath)) {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end('app-debug.apk not found. Run: npm run apk:debug');
    return;
  }

  const stat = fs.statSync(apkPath);
  res.writeHead(200, {
    'Content-Type': 'application/vnd.android.package-archive',
    'Content-Disposition': 'attachment; filename="app-debug.apk"',
    'Content-Length': stat.size,
    'Cache-Control': 'no-store',
  });

  if (req.method === 'HEAD') {
    res.end();
    return;
  }

  fs.createReadStream(apkPath).pipe(res);
}

const server = http.createServer((req, res) => {
  const url = (req.url || '/').split('?')[0];
  if (
    (req.method === 'GET' || req.method === 'HEAD') &&
    (url === '/' || url === '/app-debug.apk')
  ) {
    sendApk(req, res);
    return;
  }

  res.writeHead(404, {'Content-Type': 'text/plain'});
  res.end('Not found. Use /app-debug.apk');
});

server.listen(PORT, HOST, () => {
  const ips = lanIPs();
  console.log(`APK server listening on ${HOST}:${PORT}`);
  if (!fs.existsSync(apkPath)) {
    console.log('Warning: app-debug.apk is missing. Run npm run apk:debug first.');
  }
  if (ips.length === 0) {
    console.log('No LAN IP found. Check Wi-Fi.');
    return;
  }
  for (const ip of ips) {
    console.log(`Download: http://${ip}:${PORT}/app-debug.apk`);
  }
});
