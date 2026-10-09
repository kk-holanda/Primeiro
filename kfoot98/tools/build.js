// Gera dist/kfoot98.html (página única) a partir de index.html: inclui CSS e JS inline.
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const rd = (f) => fs.readFileSync(path.join(root, f), 'utf8');
const html = rd('index.html');
const scripts = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map((m) => m[1]);
const css = rd('ui/style.css');
const fonts = html.match(/<link href="(https:\/\/fonts\.googleapis[^"]+)"/)[1];
const js = scripts.map((s) => rd(s)).join('\n;\n').replace(/<\/script>/g, '<\\/script>');
// Formato "fragmento" (sem doctype/head/body) aceito pelo publicador de artifacts; o mesmo arquivo abre direto no navegador.
const frag = `<title>Kfoot 98</title>\n<link href="${fonts}" rel="stylesheet">\n<style>\n${css}\n</style>\n<div id="app"></div>\n<script>\n${js}\n</script>\n`;
fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
fs.writeFileSync(path.join(root, 'dist/kfoot98-fragment.html'), frag);
fs.writeFileSync(path.join(root, 'dist/kfoot98.html'), `<!DOCTYPE html>\n<html lang="pt-BR">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>Kfoot 98</title>\n<link href="${fonts}" rel="stylesheet">\n<style>\n${css}\n</style>\n</head>\n<body>\n<div id="app"></div>\n<script>\n${js}\n</script>\n</body>\n</html>\n`);
console.log('ok', frag.length, 'bytes');
