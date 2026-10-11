process.chdir('/tmp/claude-0/lab');
const B=require('/tmp/claude-0/lab/load.js');const {Game:GM,Match:M}=B;M.CFG.logFaltas=true;
const g=GM.novo({seed:11,humanos:[{id:'h0',nome:'H',clubId:Object.values(B.CLUBS).filter(c=>c.selecionavel).map(c=>c.id)[0]}]});
const cl=g.clubes;const pp={},pd={},pz={},pen={pos:{},disc:{}},fzPos={};
for(let i=0;i<+process.argv[2];i++){const a=cl[i%80],b=cl[(i*7+3)%80];if(a===b||a.div!==b.div)continue;
 const m=M.criar(GM.escalacaoDe(g,a,b),GM.escalacaoDe(g,b,a),g.rng);while(!(m.min>=m.fim&&m.min>=90)){M.passo(m);if(m.min>140)break;}M.finalizar(m);
 const by={};for(const s of m.S)for(const j of s.todos.values()){by[j.p.nome]=j;(pp[j.slot]=pp[j.slot]||{min:0,f:0}).min+=j.minutos;pp[j.slot].f+=j.faltas;}
 for(const e of m.eventos)if(e.tipo==='falta'){const j=by[e.jogador];if(!j)continue;if(e.zona===4){pen.pos[e.pos]=(pen.pos[e.pos]||0)+1;pen.disc[j.p.disciplina]=(pen.disc[j.p.disciplina]||0)+1;}
  const k=e.pos+(e.zona===3?'@perto':e.zona===1?'@ataque':e.zona===2?'@meio':'@area');fzPos[k]=(fzPos[k]||0)+1;}}
console.log('faltas/90 por posição',Object.entries(pp).map(([k,v])=>k+' '+(v.f/v.min*90).toFixed(2)).join(', '));
console.log('pênaltis por posição do infrator',JSON.stringify(pen.pos),'por disciplina',JSON.stringify(pen.disc));
const t=(pos)=>{const a=fzPos[pos+'@ataque']||0,mm=fzPos[pos+'@meio']||0,p=fzPos[pos+'@perto']||0,s=a+mm+p;return pos+' ataque '+(100*a/s).toFixed(0)+'% meio '+(100*mm/s).toFixed(0)+'% perto da própria área '+(100*p/s).toFixed(0)+'%';};
['ZAG','VOL','LD','MC','MEI','CA'].forEach(x=>console.log(t(x)));
