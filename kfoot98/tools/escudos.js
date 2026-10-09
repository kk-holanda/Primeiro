// Embute os arquivos de assets/escudos/<id>.(svg|png|jpg|webp) em data/escudos-reais.js (data URIs).
const fs = require('fs'), path = require('path');
const dir = path.join(__dirname, '..', 'assets', 'escudos'), out = {};
const mime = { svg: 'image/svg+xml', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp' };
for (const f of fs.readdirSync(dir)) {
  const ext = f.split('.').pop().toLowerCase(); if (!mime[ext]) continue;
  out[f.replace(/\.[^.]+$/, '')] = 'data:' + mime[ext] + ';base64,' + fs.readFileSync(path.join(dir, f)).toString('base64');
}
fs.writeFileSync(path.join(__dirname, '..', 'data', 'escudos-reais.js'), '// Gerado por tools/escudos.js a partir de assets/escudos/.\nwindow.ESCUDOS_REAIS = ' + JSON.stringify(out) + ';\n');
console.log('escudos reais embutidos:', Object.keys(out).length);
