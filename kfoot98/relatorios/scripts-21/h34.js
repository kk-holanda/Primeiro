process.env.GAME=process.env.GAME||'gameT.html';
const B=require('./load.js');const {Game:GM,Fin:F}=B;
if(process.env.T)Object.assign(B.TUNE,JSON.parse(process.env.T));
const seed=+process.argv[2]||1,temps=+process.argv[3]||1;
const hum=Object.values(B.CLUBS).filter(c=>c.selecionavel).map(c=>c.id)[seed%10];
const g=GM.novo({seed,humanos:[{id:'h0',nome:'H',clubId:hum}]});
const q=(a,p)=>{a=a.slice().sort((x,y)=>x-y);return a[Math.min(a.length-1,Math.floor(p*a.length))]};
const mi=v=>(v/1e6).toFixed(2);
const out=[];
for(let t=0;t<temps;t++){
 let guard=0;while(!g.fim&&guard++<5000){const dia=GM.proximoDia(g),jg=GM.jogosDoDia(g,dia);if(!jg.length){g.idx++;if(g.idx>=g.dias.length)g.fim=true;continue;}GM.simularDia(g);}
 for(const d of 'ABCD'){const cs=g.clubes.filter(c=>c.div===d);
  const z=cs.map(c=>F.razao(g,c)),R=z.map(r=>F.soma(r.rec)),D=z.map(r=>F.soma(r.des)),S=R.map((r,i)=>r-D[i]);
  const f=(k,tp)=>q(z.map(r=>r[tp][k]||0),.5);
  const row=`${g.ano} ${d} rec ${mi(q(R,.5))} des ${mi(q(D,.5))} res med ${mi(q(S,.5))} p10 ${mi(q(S,.1))} p90 ${mi(q(S,.9))} neg${S.filter(x=>x<0).length} caixaMed ${mi(q(cs.map(c=>c.caixa),.5))} caixaNeg ${cs.filter(c=>c.caixa<0).length} | pat ${mi(f('patrocinio','rec'))} bil ${mi(f('bilheteria','rec'))} sal ${mi(f('salarios','des'))} fix ${mi(f('fixas','des'))} comp ${mi(f('compras','des'))} ct ${mi(f('Investimento em CT e base','des'))} jur ${mi(f('Juros da dívida','des'))} | ctNiv ${q(cs.map(c=>F.ctNivel(c)),.5).toFixed(1)}`;
  console.log(row);}
 if(t<temps-1)GM.virarTemporada(g);
}
