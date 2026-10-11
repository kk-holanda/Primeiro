process.chdir('/tmp/claude-0/lab');
const B=require('/tmp/claude-0/lab/load.js');const {Game:GM,Match:M}=B;
if(M.CFG)M.CFG.logFaltas=true;
const g=GM.novo({seed:7,humanos:[{id:'h0',nome:'H',clubId:Object.values(B.CLUBS).filter(c=>c.selecionavel).map(c=>c.id)[0]}]});
const N=+process.argv[2]||1500;
const divs=['A','B','C','D'];
const R={};
for(const dv of divs){const cl=g.clubes.filter(c=>c.div===dv);const o=R[dv]={n:0,gols:0,hw:0,aw:0,d:0,ch:0,ng:0,fa:0,pen:0,esc:0,am:0,vm:0,imp:0,lat:0,tm:0,pos:0,fz:[0,0,0,0,0],fk:0,saida:0,fx:[0,0,0,0,0],gPos:{},fzG:[0,0,0,0],gkv:0,terco:[0,0,0],fk:0};
 for(let i=0;i<N/4;i++){const a=cl[i%cl.length],b=cl[(i*7+3+i%5)%cl.length===i%cl.length?(i+1)%cl.length:(i*7+3+i%5)%cl.length];
 const m=M.criar(GM.escalacaoDe(g,a,b),GM.escalacaoDe(g,b,a),g.rng);
 while(!(m.min>=m.fim&&m.min>=90)){M.passo(m);if(m.min>140)break;}
 const r=M.finalizar(m);o.n++;const [x,y]=r.placar;o.gols+=x+y;if(x>y)o.hw++;else if(y>x)o.aw++;else o.d++;
 for(const s of m.stats){o.ch+=s.chutes;o.ng+=s.no_gol;o.fa+=s.faltas;o.esc+=s.escanteios;o.am+=s.amarelos;o.vm+=s.vermelhos;o.imp+=s.imp||0;o.lat+=s.laterais||0;o.tm+=s.tirosMeta||0;}
 o.pos+=m.stats[0].posse/m.min;(m.fzG||[]).forEach((v,i)=>o.fzG[i]+=v);for(const st of m.stats)(st.terco||[]).forEach((v,i)=>o.terco[i]+=v);
 for(const e of m.eventos){if(e.tipo==='penalti'||(e.tipo==='gol'&&e.pen))o.pen++;if(e.tipo==='saida')o.saida++;if(e.tipo==='gol'&&e.falta)o.gfd=(o.gfd||0)+1;if(e.tipo==='gol'&&e.origem==='falta')o.gfl=(o.gfl||0)+1;if(e.tipo==='vermelho'&&/último/.test(e.motivo||''))o.gkv++;if(e.tipo==='falta'){o.fz[e.zona]++;o.fx[e.faixa]++;}}
 for(const s of m.S)for(const j of s.todos.values()){o.gPos[j.slot]=(o.gPos[j.slot]||0)+j.g;}
 }}
for(const dv of divs){const o=R[dv];const f=(v)=>(v/o.n).toFixed(2);
 console.log(dv,'jogos',o.n,'gols',f(o.gols),'casa%',(100*o.hw/o.n).toFixed(1),'emp%',(100*o.d/o.n).toFixed(1),'fora%',(100*o.aw/o.n).toFixed(1),'chutes',f(o.ch),'nogol',f(o.ng),'faltas',f(o.fa),'pen',f(o.pen),'esc',f(o.esc),'am',f(o.am),'vm',f(o.vm),'imp',f(o.imp),'lat',f(o.lat),'tm',f(o.tm),'posseCasa',(100*o.pos/o.n).toFixed(1),'golFaltaDireta',f(o.gfd||0),'golFaltaCruz',f(o.gfl||0));
 if(o.fz.some(x=>x))console.log('  faltas por zona(rel. quem sofre)',o.fz.map(x=>(x/o.n).toFixed(2)).join(' '),'faixa',o.fx.map(x=>(x/o.n).toFixed(2)).join(' '),'saidas/jogo',f(o.saida));
 if(o.fzG.some(x=>x)){const t=o.fzG.reduce((a,b)=>a+b,0);console.log('  geral: zona1',(o.fzG[0]/t).toFixed(3),'meio',(o.fzG[1]/t).toFixed(3),'3 frente',(o.fzG[2]/t).toFixed(3),'3 lateral',(o.fzG[3]/t).toFixed(3),'gk último homem/jogo',(o.gkv/o.n).toFixed(3),'terço def/meio/atq',o.terco.map(x=>(x/o.terco.reduce((a,b)=>a+b,0)*100).toFixed(1)).join('/'));}
 if(dv==='A')console.log('  gols por posição',JSON.stringify(Object.fromEntries(Object.entries(o.gPos).map(([k,v])=>[k,+(v/o.n).toFixed(3)]))));}
