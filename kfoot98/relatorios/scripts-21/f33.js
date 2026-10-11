// diagnóstico financeiro de 1 temporada por clube (v36)
const B=require('./load.js');const {Game:GM,Fin:F}=B;
const seed=+process.argv[2]||1;
const hum=Object.values(B.CLUBS).filter(c=>c.selecionavel).map(c=>c.id)[seed%10];
const g=GM.novo({seed,humanos:[{id:'h0',nome:'H',clubId:hum}]});
const ini=new Map(g.clubes.map(c=>[c.id,{caixa:c.caixa,div:c.div,cap:F.capTotal(c),areas:{...c.estadio.areas},socios:c.socios,pat:(c.patrocinadores||[]).map(x=>x.valor).reduce((a,b)=>a+b,0),folha:B.Economy.folhaMensal(c.elenco)*12}]));
const A={};g.clubes.forEach(c=>{A[c.id]={bruta:{arq:0,cad:0,vip:0},pub:{arq:0,cad:0,vip:0},cap:{arq:0,cad:0,vip:0},jogos:0,pubTot:0,capTot:0}});
let guard=0;while(!g.fim&&guard++<5000){const dia=GM.proximoDia(g),jg=GM.jogosDoDia(g,dia);if(!jg.length){g.idx++;if(g.idx>=g.dias.length)g.fim=true;continue;}
 const res=GM.simularDia(g);
 for(const r of res){const d=r.jogo.det;if(!d)continue;const a=A[r.jogo.casa];a.jogos++;a.pubTot+=d.publico;a.capTot+=F.capTotal(g.porId.get(r.jogo.casa));for(const k of ['arq','cad','vip']){a.bruta[k]+=d.areas[k].bruta;a.pub[k]+=d.areas[k].pub;a.cap[k]+=d.areas[k].cap}}}
const rows=[];
for(const c of g.clubes){const z=F.razao(g,c),i=ini.get(c.id),a=A[c.id];const rec=F.soma(z.rec),des=F.soma(z.des);
 const outros=Object.entries(z.des).filter(([k])=>!['salarios','fixas','custosJogo','compras','obras','marketing'].includes(k)).reduce((s,[,v])=>s+v,0);
 rows.push({id:c.id,nome:c.nome,div:i.div,humano:c.id===hum,tecnico:c.tecPerfil||'humano',caixaIni:i.caixa,caixaFim:c.caixa,cap:i.cap,capFim:F.capTotal(c),
  jogosCasa:a.jogos,publicoMed:a.jogos?Math.round(a.pubTot/a.jogos):0,lotacao:a.capTot?a.pubTot/a.capTot:0,
  bilArq:a.bruta.arq,bilCad:a.bruta.cad,bilVip:a.bruta.vip,bilheteria:z.rec.bilheteria||0,socios$:z.rec.socios||0,sociosN0:i.socios,sociosN1:c.socios,
  tv:z.rec.tv||0,patrocinio:z.rec.patrocinio||0,vendas:z.rec.vendas||0,multas:z.rec.multas||0,premios:z.rec.premios||0,receita:rec,
  salarios:z.des.salarios||0,fixas:z.des.fixas||0,custosJogo:z.des.custosJogo||0,compras:z.des.compras||0,obras:z.des.obras||0,marketing:z.des.marketing||0,outros,despesa:des,
  resultado:rec-des,folhaAnual:i.folha});}
require('fs').writeFileSync('f33_'+seed+'.json',JSON.stringify(rows));
console.log('ok',rows.length,g.ano);
