const fs = require('fs');
const js = fs.readFileSync('tmp-figma-bundle.js', 'utf8');

function around(str, before, after) {
  const i = js.indexOf(str);
  return { i, text: i < 0 ? 'NOT FOUND' : js.slice(i - before, i + after) };
}

const targets = [
  'src/components/BottomNav.tsx',
  'stayModeActive',
  'Enable Stay Mode',
  'Start Stay Mode',
  'Stay Mode keeps',
  'When Stay Mode is active',
  'Create Passcode',
  'Confirm Passcode',
  'Forgot passcode',
  'Listening',
  'Processing',
  'Stay Mode is now',
  'lockedApps',
  'Modes',
  'biometricEnabled',
  'Dark',
  'Light',
];

let out = '';
for (const t of targets) {
  const r = around(t, 200, 1800);
  out += '\n\n===== ' + t + ' @' + r.i + ' =====\n';
  out += r.text + '\n';
}

fs.writeFileSync('tmp-figma-extract3.txt', out);
console.log('ok', out.length);
