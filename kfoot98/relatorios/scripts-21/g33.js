const fs=require('fs');const r=JSON.parse(fs.readFileSync('f33_1.json'));
const med=a=>{a=a.slice().sort((x,y)=>x-y);return a[a.length>>1]};const sum=a=>a.reduce((x,y)=>x+y,0);
const NOME={A:'Série A',B:'Série B',C:'Série C',D:'Série D'};
const mf=(v,d)=>{const s=v<0?'−':'';v=Math.abs(v);if(d==='A'||d==='B'||v>=1e6)return s+(v/1e6).toFixed(2).replace('.',',')+' mi';if(v===0)return '0';return s+Math.round(v/1000).toLocaleString('pt-BR')+' mil'};
const fm=(v)=>mf(v,'A');
let md=`# Relatório 21 — Diagnóstico financeiro por clube (1 temporada, v36)

Simulação de uma temporada completa (1998, semente 1) na v36, sem nenhuma intervenção do jogador, com os 80 clubes. Valores em R$ de 1998, da primeira rodada ao fim da temporada (liga + Copa do Brasil + prêmios de fim de temporada). O clube do jogador (Série D) fica parado e é tratado como computador. Os números fecham: para cada clube, o caixa final menos o inicial é igual ao resultado (receita menos despesa). A tabela completa, com todas as colunas, está em \`21-financas-por-clube.csv\`.

Como ler: **Estádio** = bilheteria das três áreas (arquibancada, cadeiras e VIP); **Sócios** = mensalidades dos sócios-torcedores; **Venda** = venda de jogadores mais multas rescisórias recebidas; **Compras** = dinheiro gasto na contratação de jogadores (preço, multa e luvas); **Marketing** = gasto com campanha ou jogo-evento (o computador não usa marketing).

`;
const res={};
for(const d of 'ABCD'){const l=r.filter(x=>x.div===d);res[d]=l;
 const rec=(x)=>x.bilheteria+x['socios$']+x.tv+x.patrocinio, opex=(x)=>x.salarios+x.fixas+x.custosJogo;
 md+=`## ${NOME[d]}\n\n`;
 md+=`### Resumo da série\n\n| Item | Mediana por clube | Menor | Maior | Soma da série |\n|---|---|---|---|---|\n`;
 const row=(nome,k)=>{const v=l.map(typeof k==='function'?k:(x)=>x[k]);return `| ${nome} | ${mf(med(v),d)} | ${mf(Math.min(...v),d)} | ${mf(Math.max(...v),d)} | ${mf(sum(v),d)} |\n`};
 md+=row('Estádio (bilheteria)','bilheteria')+row('  Arquibancada','bilArq')+row('  Cadeiras','bilCad')+row('  VIP','bilVip')+row('Sócios (mensalidades)','socios$')+row('Cota de TV','tv')+row('Patrocínio','patrocinio')+row('Venda de jogadores e multas',(x)=>x.vendas+x.multas)+row('Prêmios de fim de temporada','premios')+row('**Receita total**','receita')
   +row('Salários','salarios')+row('Despesas fixas e custos de jogo',(x)=>x.fixas+x.custosJogo)+row('Compra de jogadores','compras')+row('Obras no estádio','obras')+row('Marketing','marketing')+row('**Despesa total**','despesa')+row('**Resultado da temporada**','resultado')+row('Caixa no início','caixaIni')+row('Caixa no fim','caixaFim');
 md+=`\n- Resultado negativo na temporada: **${l.filter(x=>x.resultado<0).length} de ${l.length} clubes**${l.filter(x=>x.resultado<0).length?' ('+l.filter(x=>x.resultado<0).map(x=>x.nome+' '+mf(x.resultado,d)).join(', ')+')':''}. Caixa final negativo: **${l.filter(x=>x.caixaFim<0).length}**.\n`;
 md+=`- Receita recorrente (estádio + sócios + TV + patrocínio) mediana ${mf(med(l.map(rec)),d)}, contra custo recorrente (salários + fixas + custos de jogo) de ${mf(med(l.map(opex)),d)}: o clube mediano sobra ${mf(med(l.map(x=>rec(x)-opex(x))),d)} antes de qualquer compra de jogador.\n`;
 md+=`- Peso na receita recorrente: estádio ${Math.round(sum(l.map(x=>x.bilheteria))/sum(l.map(rec))*100)}%, sócios ${Math.round(sum(l.map(x=>x['socios$']))/sum(l.map(rec))*100)}%, TV ${Math.round(sum(l.map(x=>x.tv))/sum(l.map(rec))*100)}%, patrocínio ${Math.round(sum(l.map(x=>x.patrocinio))/sum(l.map(rec))*100)}%.\n`;
 md+=`- Lotação média dos jogos em casa: mediana ${Math.round(med(l.map(x=>x.lotacao))*100)}%, de ${Math.round(Math.min(...l.map(x=>x.lotacao))*100)}% a ${Math.round(Math.max(...l.map(x=>x.lotacao))*100)}%.\n- Vendas de jogadores na série: ${mf(sum(l.map(x=>x.vendas+x.multas)),d)}; compras: ${mf(sum(l.map(x=>x.compras)),d)}.\n\n`;
 const ord=l.slice().sort((a,b)=>b.receita-a.receita);
 md+=`### Receitas por clube\n\n| Clube | Estádio (total) | Arquibancada | Cadeiras | VIP | Sócios | Venda de jogadores e multas | Patrocínio | TV | Prêmios | **Receita total** |\n|---|---|---|---|---|---|---|---|---|---|---|\n`;
 ord.forEach(x=>{md+=`| ${x.nome}${x.humano?' (jogador)':''} | ${mf(x.bilheteria,d)} | ${mf(x.bilArq,d)} | ${mf(x.bilCad,d)} | ${mf(x.bilVip,d)} | ${mf(x['socios$'],d)} | ${mf(x.vendas+x.multas,d)} | ${mf(x.patrocinio,d)} | ${mf(x.tv,d)} | ${mf(x.premios,d)} | **${mf(x.receita,d)}** |\n`});
 md+=`\n### Despesas e resultado por clube\n\n| Clube | Salários | Fixas e custos de jogo | Compra de jogadores | Obras | Marketing | **Despesa total** | **Resultado** | Caixa início → fim |\n|---|---|---|---|---|---|---|---|---|\n`;
 ord.forEach(x=>{md+=`| ${x.nome}${x.humano?' (jogador)':''} | ${mf(x.salarios,d)} | ${mf(x.fixas+x.custosJogo,d)} | ${mf(x.compras,d)} | ${mf(x.obras,d)} | ${mf(x.marketing,d)} | **${mf(x.despesa,d)}** | **${mf(x.resultado,d)}** | ${mf(x.caixaIni,d)} → ${mf(x.caixaFim,d)} |\n`});
 md+='\n';
}
fs.writeFileSync('rel21_corpo.md',md);
// csv
const cols=['div','nome','humano','tecnico','caixaIni','caixaFim','cap','jogosCasa','publicoMed','lotacao','bilArq','bilCad','bilVip','bilheteria','socios$','sociosN0','sociosN1','tv','patrocinio','vendas','multas','premios','receita','salarios','fixas','custosJogo','compras','obras','marketing','outros','despesa','resultado'];
fs.writeFileSync('21-financas-por-clube.csv',[cols.join(';')].concat(r.map(x=>cols.map(c=>typeof x[c]==='number'?String(Math.round(x[c]*(c==='lotacao'?1000:1))/(c==='lotacao'?1000:1)).replace('.',','):x[c]).join(';'))).join('\n'));
// achados numéricos
for(const d of 'ABCD'){const l=res[d];const net=l.map(x=>({n:x.nome,v:x.vendas+x.multas-x.compras}));net.sort((a,b)=>a.v-b.v);console.log(d,'maiores compradores líquidos',net.slice(0,3).map(x=>x.n+' '+fm(x.v)).join(', '),'| maiores vendedores líquidos',net.slice(-3).map(x=>x.n+' '+fm(x.v)).join(', '),'| clubes sem compra',l.filter(x=>x.compras===0).length,'sem venda',l.filter(x=>x.vendas===0).length);
 console.log('   VIP/bil',Math.round(sum(l.map(x=>x.bilVip))/sum(l.map(x=>x.bilheteria))*100)+'%','cad',Math.round(sum(l.map(x=>x.bilCad))/sum(l.map(x=>x.bilheteria))*100)+'%','arq',Math.round(sum(l.map(x=>x.bilArq))/sum(l.map(x=>x.bilheteria))*100)+'%','| sal/receita rec',Math.round(sum(l.map(x=>x.salarios))/sum(l.map(x=>x.bilheteria+x['socios$']+x.tv+x.patrocinio))*100)+'%','| compras/receita',Math.round(sum(l.map(x=>x.compras))/sum(l.map(x=>x.receita))*100)+'%');}
console.log(r.filter(x=>x.humano).map(x=>x.nome+' '+x.div));
