const $ = (id) => document.getElementById(id);
const fmt = (n, d=1) => Number(n).toLocaleString('es-MX',{maximumFractionDigits:d,minimumFractionDigits:d});
const esc = (s) => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

// Navegación móvil y pestañas
const menuToggle=$('menuToggle'), nav=$('nav');
menuToggle?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuToggle.setAttribute('aria-expanded',String(open));menuToggle.textContent=open?'×':'☰';});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menuToggle.setAttribute('aria-expanded','false');menuToggle.textContent='☰';}));
document.querySelectorAll('[data-tab]').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('[data-tab]').forEach(x=>x.classList.toggle('active',x===btn));
  document.querySelectorAll('#m0 .tab-panel').forEach(x=>x.classList.toggle('active',x.id==='tab-'+btn.dataset.tab));
}));
document.querySelectorAll('[data-fact]').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('[data-fact]').forEach(x=>x.classList.toggle('active',x===btn));
  renderFacts(btn.dataset.fact);
}));

// Módulo 0: clasificador accesible por selección
const classification=[
['Gas natural','Fósil','Combustible fósil extraído de yacimientos; se usa, entre otras tecnologías, en ciclos combinados y turbogás.'],
['Carbón mineral','Fósil','Combustible fósil sólido que se quema para producir calor y vapor.'],
['Combustóleo','Fósil','Derivado pesado del petróleo utilizado en determinadas unidades térmicas.'],
['Diésel','Fósil','Combustible derivado del petróleo que puede utilizarse en motores de combustión interna o turbinas compatibles.'],
['Uranio','Nuclear','Material fisionable utilizado como combustible en reactores nucleares.'],
['Radiación solar','Renovable','Recurso solar que puede convertirse directamente en electricidad mediante módulos fotovoltaicos.'],
['Viento','Renovable','Recurso cinético que mueve el rotor de un aerogenerador.'],
['Agua en embalse','Renovable','Energía potencial gravitatoria del agua aprovechada por turbinas hidráulicas.'],
['Calor geotérmico','Renovable','Energía térmica del subsuelo aprovechada en centrales geotermoeléctricas.'],
['Biomasa renovable','Renovable','Materia orgánica renovable que puede aprovecharse como combustible.'],
['Biogás renovable','Renovable','Mezcla gaseosa producida por digestión anaerobia de materia orgánica.'],
['Ciclo combinado (con gas natural)','Fósil','La categoría se asigna al combustible indicado. El ciclo combinado es una tecnología, no un recurso primario.'],
['Carboeléctrica (con carbón)','Fósil','La categoría se asigna al carbón utilizado como combustible.'],
['Central nucleoeléctrica (uranio)','Nuclear','La fisión del combustible nuclear produce calor para el ciclo de vapor.'],
['Solar fotovoltaica','Renovable','La radiación solar es el recurso primario; el efecto fotovoltaico produce electricidad en corriente continua.']
];
const classRoot=$('classification');
classification.forEach((item,i)=>{
 const card=document.createElement('article');card.className='class-card';card.dataset.index=i;
 card.innerHTML=`<strong>${i+1}. ${esc(item[0])}</strong><small>${esc(item[2])}</small><select aria-label="Clasificar ${esc(item[0])}" data-answer="${esc(item[1])}"><option value="">Selecciona categoría…</option><option>Fósil</option><option>Nuclear</option><option>Renovable</option></select>`;
 classRoot.appendChild(card);
});
function updateScore(){const n=[...classRoot.querySelectorAll('select')].filter(s=>s.value).length;$('score').textContent=`${n} / 15 clasificadas`;}
classRoot.addEventListener('change',updateScore);
$('checkClass').addEventListener('click',()=>{
 let ok=0,answered=0;
 classRoot.querySelectorAll('.class-card').forEach(card=>{const s=card.querySelector('select');card.classList.remove('correct','incorrect');if(!s.value)return;answered++;const good=s.value===s.dataset.answer;card.classList.add(good?'correct':'incorrect');if(good)ok++;});
 $('classFeedback').textContent=answered===15?`Resultado: ${ok} de 15 correctas. Las tarjetas con borde verde están bien clasificadas; revisa las demás y lee sus explicaciones.`:`Has respondido ${answered} de 15. Completa todas las tarjetas para revisar el resultado. Por ahora: ${ok} correctas.`;
});
$('resetClass').addEventListener('click',()=>{classRoot.querySelectorAll('select').forEach(s=>s.value='');classRoot.querySelectorAll('.class-card').forEach(c=>c.classList.remove('correct','incorrect'));$('classFeedback').textContent='';updateScore();});

// Diagramas por etapas
const conversions=[
{title:'Gas natural → electricidad (ciclo combinado)',steps:[['Gas natural','Energía química','El gas natural es el combustible. Su energía química se libera mediante combustión.'],['Combustión','Energía térmica','El combustible se mezcla con aire y se quema en la cámara de combustión de la turbina de gas.'],['Turbina de gas','Energía mecánica','Los gases calientes se expanden y hacen girar la turbina conectada a un generador.'],['Recuperación de calor','Vapor','Los gases de escape calientan agua en un generador de recuperación para producir vapor.'],['Turbina de vapor','Energía mecánica','El vapor mueve una segunda turbina acoplada a otro generador o al mismo tren según el diseño.'],['Electricidad','Energía eléctrica','Los generadores convierten energía mecánica en electricidad.']]},
{title:'Carbón → electricidad (vapor convencional)',steps:[['Carbón','Energía química','El carbón mineral se alimenta al sistema de combustión de la caldera.'],['Combustión','Calor','La combustión transfiere calor al agua a través de superficies de intercambio térmico.'],['Vapor','Energía térmica','El agua se convierte en vapor a presión y temperatura elevadas.'],['Turbina','Energía mecánica','El vapor se expande a través de álabes y hace girar el eje de la turbina.'],['Generador','Electricidad','El eje acciona el generador eléctrico. El vapor se condensa y vuelve al ciclo.']]},
{title:'Uranio → electricidad (nucleoeléctrica)',steps:[['Uranio','Combustible nuclear','El combustible contiene núcleos capaces de experimentar fisión.'],['Fisión','Calor','La fisión libera energía en forma de calor dentro del reactor.'],['Circuito térmico','Vapor','El calor se utiliza para producir vapor, directamente o mediante un intercambiador, según el tipo de reactor.'],['Turbina','Energía mecánica','El vapor se expande en la turbina y produce rotación.'],['Generador','Electricidad','El generador convierte el movimiento del eje en electricidad.']]},
{title:'Radiación solar → electricidad (fotovoltaica)',steps:[['Radiación solar','Energía radiante','La luz incide sobre las celdas semiconductoras del módulo fotovoltaico.'],['Efecto fotovoltaico','Cargas eléctricas','Los fotones generan pares electrón-hueco y una unión semiconductora separa las cargas.'],['Corriente continua','Electricidad DC','Las celdas conectadas producen corriente continua.'],['Inversor','Conversión DC/AC','La electrónica de potencia convierte la corriente continua en corriente alterna compatible con la red.'],['Electricidad','Energía eléctrica','La energía se utiliza localmente, almacena o inyecta a la red según la instalación.']]},
{title:'Viento → electricidad (eólica)',steps:[['Viento','Energía cinética','El flujo de aire contiene energía cinética.'],['Rotor','Energía mecánica','Las palas transforman parte de la energía del viento en movimiento de rotación.'],['Tren de potencia','Rotación','El eje y, cuando existe, la caja multiplicadora transmiten la rotación al generador.'],['Generador','Electricidad','El generador convierte energía mecánica en energía eléctrica.'],['Acondicionamiento','Electricidad de red','Convertidores y transformadores adaptan la energía a los requisitos de conexión.']]},
{title:'Agua → electricidad (hidroeléctrica)',steps:[['Agua','Energía potencial/cinética','El agua almacenada a cierta altura o en movimiento contiene energía hidráulica.'],['Conducto y turbina','Energía mecánica','El flujo mueve la turbina hidráulica.'],['Eje','Rotación','La turbina transmite movimiento al generador.'],['Generador','Electricidad','La energía mecánica se convierte en electricidad.'],['Transformador','Tensión elevada','Un transformador eleva la tensión para transportar la energía con menor corriente.']]}
];
const choices=$('conversionChoices');
conversions.forEach((c,i)=>{const b=document.createElement('button');b.className='choice'+(i===0?' active':'');b.textContent=c.title;b.addEventListener('click',()=>selectConversion(i));choices.appendChild(b);});
function selectConversion(i){
 choices.querySelectorAll('button').forEach((b,j)=>b.classList.toggle('active',j===i));
 const c=conversions[i];$('conversionTitle').textContent=c.title;
 const steps=$('conversionSteps');steps.innerHTML='';
 c.steps.forEach((s,j)=>{const b=document.createElement('button');b.className='conversion-step'+(j===0?' active':'');b.innerHTML=`<b>${j+1}. ${esc(s[0])}</b><small>${esc(s[1])}</small>`;b.addEventListener('click',()=>{steps.querySelectorAll('button').forEach(x=>x.classList.remove('active'));b.classList.add('active');$('conversionExplain').innerHTML=`<b>${esc(s[0])}:</b> ${esc(s[2])}`;});steps.appendChild(b);});
 $('conversionExplain').innerHTML=`<b>${esc(c.steps[0][0])}:</b> ${esc(c.steps[0][2])}`;
}
selectConversion(0);

// Gráficas construidas con HTML/CSS
function renderBars(id,data,max){
 const root=$(id);root.innerHTML='';
 data.forEach(([label,value,suffix='%',display])=>{
  const row=document.createElement('div');row.className='bar-row';
  row.innerHTML=`<span class="bar-label">${esc(label)}</span><div class="bar-track"><div class="bar-fill" style="width:${Math.max(0,Math.min(100,value/max*100))}%"></div></div><span class="bar-value">${esc(display??(fmt(value,1)+suffix))}</span>`;
  root.appendChild(row);
 });
}
const mix=[['Ciclo combinado',55.1],['Hidroeléctrica',10.4],['Eólica',6.0],['Solar fotovoltaica',6.0],['Vapor convencional',5.9],['Carbón',4.2],['Nuclear',3.1],['Geotérmica',1.3],['Cogeneración eficiente',1.2],['Bioenergía',0.6],['Turbogás',3.0],['Combustión interna',0.7],['Otros fósiles',0.1],['Otras limpias',2.5]];
renderBars('nationalMix',mix,60);
renderBars('cfeGeneration',[['2022',137133,' GWh','137,133.0'],['2023',145172.1,' GWh','145,172.1'],['2024',148775.4,' GWh','148,775.4']],150000);
renderBars('generationTrend',[['2022',137133,' GWh','137,133.0'],['2023',145172.1,' GWh','145,172.1'],['2024',148775.4,' GWh','148,775.4']],150000);
renderBars('cfeCleanSplit',[['Energías limpias',25.3,' %','25.3%'],['Otras fuentes',74.7,' %','74.7%']],100);
renderBars('techComparison',[['Ciclo combinado 2023',21254,' GWh','21,254'],['Ciclo combinado 2024',22371,' GWh','22,371'],['Vapor convencional 2023',4973,' GWh','4,973'],['Vapor convencional 2024',5125,' GWh','5,125']],23000);
renderBars('distributionBars',[['Media tensión',551465,' km','551,465 km'],['Baja tensión',342741,' km','342,741 km']],600000);

// Comparador cualitativo
const resources={
gas:{name:'Gas natural',co2:490,range:'410–650',renew:'No renovable',dispatch:'Controlable, sujeto a suministro de combustible',fuel:'Gas natural',process:'Combustión → turbina(s) → generador',emissions:'Emisiones directas de CO₂ y contaminantes por combustión; el ciclo de vida incluye extracción y transporte.',mex:'Tecnología de alta participación: ciclo combinado representó 55.1% de generación nacional en 2022.'},
carbon:{name:'Carbón mineral',co2:820,range:'740–910',renew:'No renovable',dispatch:'Controlable, sujeto a combustible y operación',fuel:'Carbón mineral',process:'Combustión → caldera → vapor → turbina',emissions:'Emisiones directas de CO₂ y contaminantes atmosféricos; ciclo de vida incorpora minería y transporte.',mex:'Participación nacional de carbón: 4.2% en 2022.'},
uranio:{name:'Uranio',co2:12,range:'3.7–110',renew:'No renovable',dispatch:'Generación firme/controlable con operación planificada',fuel:'Combustible nuclear',process:'Fisión → calor → vapor → turbina',emissions:'Sin combustión de carbono en el reactor; el ciclo de vida incluye minería, combustible, construcción y residuos.',mex:'Laguna Verde: 1,608 MW instalados según manual CFE.'},
solar:{name:'Radiación solar',co2:48,range:'18–180',renew:'Renovable',dispatch:'Variable; depende de irradiación y hora del día',fuel:'No utiliza combustible de combustión',process:'Efecto fotovoltaico → corriente continua → inversor',emissions:'Sin emisiones directas de combustión durante operación; ciclo de vida incluye materiales, fabricación, transporte y fin de vida.',mex:'Solar fotovoltaica: 6.0% de generación nacional en 2022.'},
viento:{name:'Viento',co2:11,range:'7–56',renew:'Renovable',dispatch:'Variable; depende del recurso eólico',fuel:'No utiliza combustible de combustión',process:'Energía cinética → rotor → generador',emissions:'Sin emisiones directas de combustión durante operación; ciclo de vida incluye materiales, fabricación e instalación.',mex:'Eólica: 6.0% de generación nacional en 2022.'},
agua:{name:'Agua',co2:24,range:'1–2,200',renew:'Renovable',dispatch:'Puede ser gestionable si existe embalse y disponibilidad hídrica',fuel:'Agua / recurso hidráulico',process:'Energía potencial o cinética → turbina → generador',emissions:'Sin combustión directa; ciclo de vida puede incluir embalse, obras, uso de suelo y emisiones asociadas.',mex:'Hidroeléctrica: 10.4% de generación nacional en 2022.'},
geotermia:{name:'Calor geotérmico',co2:38,range:'6–79',renew:'Renovable (recurso gestionado de forma sostenible)',dispatch:'Relativamente controlable según el reservorio',fuel:'Fluidos y calor del subsuelo',process:'Calor geotérmico → vapor/fluido → turbina → generador',emissions:'Dependen del campo y tecnología; se deben medir por central y distinguir emisiones directas y ciclo de vida.',mex:'CFE reporta cuatro centrales geotérmicas: Cerro Prieto, Los Azufres, Los Humeros y Tres Vírgenes.'},
biomasa:{name:'Biomasa / biogás',co2:230,range:'130–420',renew:'Renovable si el recurso se repone sosteniblemente',dispatch:'Puede ser controlable si hay combustible almacenado',fuel:'Materia orgánica o biogás',process:'Combustión o aprovechamiento del biogás → motor/caldera → generador',emissions:'No asumir neutralidad automática: depende del origen, cambio de uso de suelo, fugas de metano y ciclo de vida.',mex:'PRODESEN reportó bioenergía con 0.6% de generación nacional en 2022.'}
};
function compare(){
 const a=resources[$('compareA').value],b=resources[$('compareB').value];
 const fields=[['Renovabilidad','renew'],['Disponibilidad','dispatch'],['Combustible','fuel'],['Conversión','process'],['Emisiones directas','emissions'],['Importancia en México','mex']];
 $('compareResult').innerHTML=[a,b].map(r=>`<article class="compare-card"><h4>${esc(r.name)}</h4><dl>${fields.map(([label,key])=>`<dt>${label}</dt><dd>${esc(r[key])}</dd>`).join('')}<dt>Huella de ciclo de vida</dt><dd><strong class="co2-value">${fmt(r.co2,0)} g CO₂e/kWh</strong><small class="co2-range">Rango publicado: ${esc(r.range)} g CO₂e/kWh</small></dd></dl></article>`).join('')+`<p class="co2-source">Medianas internacionales aproximadas del IPCC (2014). Incluyen construcción, combustible y operación a lo largo del ciclo de vida; no son mediciones de centrales mexicanas.</p>`;
}
$('compareBtn').addEventListener('click',compare);compare();

// Cinco preguntas de reflexión con interpretación
const reflection=[
{q:'En la generación nacional 2022, el ciclo combinado aportó 55.1% y la hidroeléctrica 10.4%. ¿Qué conclusión está mejor sustentada?',o:['El ciclo combinado fue la tecnología con mayor participación de esas dos.','La hidroeléctrica produjo más electricidad.','México no utilizó energías limpias.'],a:0,why:'55.1% es mayor que 10.4%. Esto indica mayor participación del ciclo combinado en esa matriz anual, pero no permite concluir por sí solo sobre costos o confiabilidad.'},
{q:'La participación limpia nacional fue 31.2% en 2022. ¿Qué representa el 68.8% restante del indicador publicado?',o:['La participación de generación clasificada como fósil en esa distribución.','La participación nuclear.','Las pérdidas de transmisión.'],a:0,why:'El 68.8% corresponde a la categoría fósil del total nacional 2022; no representa pérdidas ni capacidad instalada.'},
{q:'La generación neta CFE pasó de 137,133 GWh (2022) a 145,172.1 GWh (2023). ¿Qué cambio se observa?',o:['Aumentó aproximadamente 5.9%.','Disminuyó aproximadamente 5.9%.','No cambió.'],a:0,why:'(145,172.1 − 137,133) / 137,133 × 100 ≈ 5.9%. Es generación neta de CFE, no generación nacional.'},
{q:'¿Por qué el aumento de tensión reduce pérdidas resistivas cuando la potencia transmitida se mantiene?',o:['Porque disminuye la corriente requerida y las pérdidas son proporcionales a I²R.','Porque la resistencia del conductor desaparece.','Porque la potencia deja de transmitirse.'],a:0,why:'Para P y factor de potencia constantes, I = P/(√3·V·cosφ). Al aumentar V, disminuye I; por eso disminuyen las pérdidas I²R.'},
{q:'¿Cuál comparación entre nuclear y renovables es correcta?',o:['La nuclear no es renovable, aunque puede clasificarse como limpia.','La nuclear es renovable porque no quema carbón.','Toda energía limpia es necesariamente renovable.'],a:0,why:'Renovable y limpia son categorías distintas. La energía nuclear utiliza uranio no renovable, pero la regulación puede clasificarla como limpia.'}
];
const quiz=$('reflectionQuiz');
reflection.forEach((q,i)=>{
 const art=document.createElement('article');art.className='question';
 art.innerHTML=`<h4>${i+1}. ${esc(q.q)}</h4>${q.o.map((o,j)=>`<label><input type="radio" name="rq${i}" value="${j}"> ${esc(o)}</label>`).join('')}<button class="btn ghost" type="button">Comprobar</button><div class="feedback" aria-live="polite"></div>`;
 art.querySelector('button').addEventListener('click',()=>{const v=art.querySelector('input:checked');const f=art.querySelector('.feedback');f.textContent=!v?'Selecciona una respuesta.':(Number(v.value)===q.a?'¡Correcto! ':'Revisa la interpretación. ')+q.why;});
 quiz.appendChild(art);
});

// Centrales reales: puntos referenciales; capacidad según fuente citada y año/tipo de dato
const plants=[
{name:'Laguna Verde',state:'Veracruz',tech:'Nucleoeléctrica',capacity:'1,608 MW instalados',detail:'Dos unidades (805 y 803 MWe); capacidad instalada descrita en manual de organización CFE.',source:'Manual de Organización de la Coordinación Corporativa Nuclear, CFE, p. 89.',url:'https://app.cfe.mx/Normateca/VerDocumento.ashx?id=36270',x:67.01,y:71.92},
{name:'Cerro Prieto',state:'Baja California',tech:'Geotérmica',capacity:'720 MW instalados (referencia CFE 2024)',detail:'CFE publicó 720 MW como capacidad instalada de Cerro Prieto en un suplemento de febrero de 2024. Otra publicación CFE de 2023 consigna 570 MW; se conserva aquí la cifra de la fuente posterior y se registra la diferencia documental.',source:'CFE, suplemento especial “Nuevas tecnologías contribuyen a la soberanía”, 26 feb. 2024.',url:'https://app.cfe.mx/cdn/2019/Imagenes/Boletines/Publicaciones/Suple_CFE-26feb24Final.pdf',x:14.32,y:13.09},
{name:'Los Azufres',state:'Michoacán',tech:'Geotérmica',capacity:'252 MW',detail:'Capacidad publicada por CFE en su libro divulgativo; dato de referencia del documento.',source:'CFE, Somos más que energía, 2023, sección Centrales geotérmicas.',url:'https://app.cfe.mx/cdn/2019/Imagenes/Boletines/Publicaciones/Libro%20CFE%2011%20P.pdf',x:55.15,y:71.44},
{name:'Los Humeros',state:'Puebla',tech:'Geotérmica',capacity:'96 MW',detail:'Capacidad publicada por CFE en su libro divulgativo; dato de referencia del documento.',source:'CFE, Somos más que energía, 2023, sección Centrales geotérmicas.',url:'https://app.cfe.mx/cdn/2019/Imagenes/Boletines/Publicaciones/Libro%20CFE%2011%20P.pdf',x:64.08,y:72.38},
{name:'Tres Vírgenes',state:'Baja California Sur',tech:'Geotérmica',capacity:'10 MW',detail:'Capacidad publicada por CFE en su libro divulgativo; dato de referencia del documento.',source:'CFE, Somos más que energía, 2023, sección Centrales geotérmicas.',url:'https://app.cfe.mx/cdn/2019/Imagenes/Boletines/Publicaciones/Libro%20CFE%2011%20P.pdf',x:22.12,y:35.79},
{name:'Malpaso',state:'Chiapas',tech:'Hidroeléctrica',capacity:'1,152 MW',detail:'Capacidad que CFE asocia a la central en su publicación sobre proyectos hidroeléctricos de modernización.',source:'CFE, Somos más que energía, 2023, apartado de modernización hidroeléctrica.',url:'https://app.cfe.mx/cdn/2019/Imagenes/Boletines/Publicaciones/Libro%20CFE%2011%20P.pdf',x:74.81,y:83.49},
{name:'Angostura',state:'Chiapas',tech:'Hidroeléctrica',capacity:'1,000 MW',detail:'Capacidad indicada por CFE en el listado de centrales vinculadas a proyectos hidroeléctricos.',source:'CFE, Somos más que energía, 2023, apartado de modernización hidroeléctrica.',url:'https://app.cfe.mx/cdn/2019/Imagenes/Boletines/Publicaciones/Libro%20CFE%2011%20P.pdf',x:77.05,y:87.20},
{name:'Peñitas',state:'Chiapas',tech:'Hidroeléctrica',capacity:'420 MW',detail:'Capacidad indicada por CFE en el listado de centrales vinculadas a proyectos hidroeléctricos.',source:'CFE, Somos más que energía, 2023, apartado de modernización hidroeléctrica.',url:'https://app.cfe.mx/cdn/2019/Imagenes/Boletines/Publicaciones/Libro%20CFE%2011%20P.pdf',x:75.09,y:82.11},
{name:'El Caracol',state:'Guerrero',tech:'Hidroeléctrica',capacity:'630 MW',detail:'Capacidad indicada por CFE en el listado de centrales vinculadas a proyectos hidroeléctricos.',source:'CFE, Somos más que energía, 2023, apartado de modernización hidroeléctrica.',url:'https://app.cfe.mx/cdn/2019/Imagenes/Boletines/Publicaciones/Libro%20CFE%2011%20P.pdf',x:57.25,y:79.33},
{name:'Zimapán',state:'Hidalgo',tech:'Hidroeléctrica',capacity:'304 MW',detail:'Capacidad indicada por CFE en su publicación de proyectos hidroeléctricos.',source:'CFE, Somos más que energía, 2023, apartado de modernización hidroeléctrica.',url:'https://app.cfe.mx/cdn/2019/Imagenes/Boletines/Publicaciones/Libro%20CFE%2011%20P.pdf',x:58.65,y:67.28},
{name:'Mazatepec',state:'Puebla',tech:'Hidroeléctrica',capacity:'244 MW',detail:'Capacidad indicada por CFE en su publicación de proyectos hidroeléctricos.',source:'CFE, Somos más que energía, 2023, apartado de modernización hidroeléctrica.',url:'https://app.cfe.mx/cdn/2019/Imagenes/Boletines/Publicaciones/Libro%20CFE%2011%20P.pdf',x:65.34,y:70.99},
{name:'Altamira',state:'Tamaulipas',tech:'Termoeléctrica',capacity:'500 MW efectivos (referencia PRODESEN histórico)',detail:'Capacidad efectiva total de la central en la tabla de termoeléctricas convencionales del PRODESEN 2015–2029.',source:'PRODESEN 2015–2029, Anexo, tabla 2.3.1.',url:'https://www.cenace.gob.mx/Docs/16_MARCOREGULATORIO/Prodecen/01%202015-2029%20Cap%C3%ADtulos%207%2C%208%20y%20Anexos.pdf',x:62.83,y:59.41},
{name:'Francisco Villa',state:'Chihuahua',tech:'Termoeléctrica',capacity:'300 MW efectivos (referencia PRODESEN histórico)',detail:'Capacidad efectiva total de la central en la tabla de termoeléctricas convencionales del PRODESEN 2015–2029.',source:'PRODESEN 2015–2029, Anexo, tabla 2.3.1.',url:'https://www.cenace.gob.mx/Docs/16_MARCOREGULATORIO/Prodecen/01%202015-2029%20Cap%C3%ADtulos%207%2C%208%20y%20Anexos.pdf',x:39.96,y:30.69},
{name:'Guaymas II (Carlos Rodríguez Rivero)',state:'Sonora',tech:'Termoeléctrica',capacity:'484 MW efectivos (referencia PRODESEN histórico)',detail:'Capacidad efectiva total de la central en la tabla de termoeléctricas convencionales del PRODESEN 2015–2029.',source:'PRODESEN 2015–2029, Anexo, tabla 2.3.1.',url:'https://www.cenace.gob.mx/Docs/16_MARCOREGULATORIO/Prodecen/01%202015-2029%20Cap%C3%ADtulos%207%2C%208%20y%20Anexos.pdf',x:26.58,y:33.94},
{name:'Manzanillo (Gral. Manuel Álvarez Moreno)',state:'Colima',tech:'Termoeléctrica',capacity:'1,300 MW efectivos (referencia PRODESEN histórico)',detail:'Capacidad efectiva total de la central en la tabla de termoeléctricas convencionales del PRODESEN 2015–2029.',source:'PRODESEN 2015–2029, Anexo, tabla 2.3.1.',url:'https://www.cenace.gob.mx/Docs/16_MARCOREGULATORIO/Prodecen/01%202015-2029%20Cap%C3%ADtulos%207%2C%208%20y%20Anexos.pdf',x:44.98,y:75.15}
];
const map=$('plantMap'),list=$('plantList'),filter=$('plantFilter');
map.insertAdjacentHTML('afterbegin',`<img class="mx-outline" src="assets/mexico-silhouette.svg" alt="Silueta de México">`);

plants.forEach((p,i)=>{const pin=document.createElement('button');pin.className='plant-pin';pin.style.left=p.x+'%';pin.style.top=p.y+'%';pin.title=p.name;pin.setAttribute('aria-label',p.name);pin.dataset.index=i;pin.addEventListener('click',()=>selectPlant(i));map.appendChild(pin);});
function renderPlants(){
 list.innerHTML='';const f=filter.value;
 plants.forEach((p,i)=>{if(f!=='all'&&p.tech!==f)return;const b=document.createElement('button');b.className='plant-item';b.innerHTML=`<b>${esc(p.name)}</b><span>${esc(p.state)} · ${esc(p.tech)}</span>`;b.addEventListener('click',()=>selectPlant(i));list.appendChild(b);});
}
function selectPlant(i){
 const p=plants[i];map.querySelectorAll('.plant-pin').forEach(x=>x.classList.toggle('selected',Number(x.dataset.index)===i));
 $('plantDetail').innerHTML=`<strong>${esc(p.name)}</strong> · ${esc(p.state)}<br><b>Tecnología:</b> ${esc(p.tech)}<br><b>Capacidad reportada:</b> ${esc(p.capacity)}<br>${esc(p.detail)}<br><b>Fuente:</b> ${esc(p.source)} <a href="${p.url}" target="_blank" rel="noopener">Consultar ↗</a>`;
}
filter.addEventListener('change',renderPlants);renderPlants();selectPlant(0);

// Simulador trifásico
function updateTransmission(){
 const P=+$('power').value,V=+$('voltage').value,R=+$('resistance').value,pf=+$('powerFactor').value;
 $('pOut').textContent=P+' MW';$('vOut').textContent=V+' kV';$('rOut').textContent=fmt(R,1)+' Ω';$('pfOut').textContent=fmt(pf,2);
 const I=P*1e6/(Math.sqrt(3)*V*1e3*pf),loss=3*I*I*R/1e6,ratio=loss/P*100,S=P/pf;
 $('currentResult').textContent=fmt(I,1)+' A';$('lossResult').textContent=fmt(loss,3)+' MW';$('lossPct').textContent=fmt(ratio,2)+'%';$('apparentResult').textContent=fmt(S,1)+' MVA';
 const vs=[69,115,230,400].map(v=>{const a=P*1e6/(Math.sqrt(3)*v*1e3*pf);return [''+v+' kV',3*a*a*R/1e6,' MW',fmt(3*a*a*R/1e6,3)+' MW'];});
 renderBars('lossBars',vs,Math.max(...vs.map(x=>x[1])));
}
['power','voltage','resistance','powerFactor'].forEach(id=>$(id).addEventListener('input',updateTransmission));updateTransmission();

// Simulador transformador ideal
function updateTransformer(){
 const vp=+$('vp').value,ratio=+$('ratio').value,S=+$('sPower').value,vs=vp/ratio,ip=S*1000/vp,is=S*1000/vs;
 $('vpOut').textContent=fmt(vp,0)+' V';$('ratioOut').textContent=ratio+' : 1';$('sOut').textContent=S+' kVA';
 $('vsResult').textContent=fmt(vs,1)+' V';$('ipResult').textContent=fmt(ip,2)+' A';$('isResult').textContent=fmt(is,2)+' A';$('ratioResult').textContent=ratio+' : 1';
}
['vp','ratio','sPower'].forEach(id=>$(id).addEventListener('input',updateTransformer));updateTransformer();

// 20 hallazgos, organizados por los cuatro temas de la consigna
const facts=[
{cat:'recursos',title:'¿Qué parte de la generación nacional dependió de combustibles fósiles?',value:'68.8%',desc:'En 2022, la generación nacional se clasificó en 68.8% fósil y 31.2% limpia.',source:'PRODESEN 2023–2037, cap. 4, figura 4.9 (datos 2022).',url:'https://base.energia.gob.mx/PRODESEN2023/Capitulo4.pdf'},
{cat:'recursos',title:'¿Qué participación tuvieron las energías limpias?',value:'31.2%',desc:'Participación limpia nacional de 2022. “Limpia” es una categoría regulatoria y no equivale exactamente a “renovable”.',source:'PRODESEN 2023–2037, cap. 4, figura 4.9.',url:'https://base.energia.gob.mx/PRODESEN2023/Capitulo4.pdf'},
{cat:'recursos',title:'¿Por qué la nuclear es limpia pero no renovable?',value:'1,608 MW',desc:'Laguna Verde utiliza uranio; la fisión no depende de un recurso que se reponga en escalas humanas, aunque la regulación clasifica la energía nuclear como limpia.',source:'Manual CFE, Coordinación Corporativa Nuclear, p. 89; Ley del Sector Eléctrico 2025.',url:'https://app.cfe.mx/Normateca/VerDocumento.ashx?id=36270'},
{cat:'recursos',title:'¿Cuántas centrales geotérmicas enumera CFE?',value:'4 centrales',desc:'Cerro Prieto, Los Azufres, Los Humeros y Tres Vírgenes. Sus capacidades divulgadas por CFE son 570, 252, 96 y 10 MW, respectivamente.',source:'CFE, Somos más que energía, 2023, sección Centrales geotérmicas.',url:'https://app.cfe.mx/cdn/2019/Imagenes/Boletines/Publicaciones/Libro%20CFE%2011%20P.pdf'},
{cat:'recursos',title:'¿Qué emisiones directas reportó una EPS de generación fósil?',value:'0.8 tCO₂/MWh',desc:'Indicador reportado para CFE Generación IV en 2024. No es un factor nacional ni una comparación de ciclo de vida; no debe extrapolarse a todas las tecnologías.',source:'Informe Anual CFE 2024, p. 44, indicador de emisiones de CO₂ por MWh de CFE Generación IV.',url:'#fuentes'},
{cat:'generacion',title:'¿Qué tecnología tuvo la mayor participación nacional?',value:'55.1%',desc:'El ciclo combinado fue la tecnología con mayor participación en la generación nacional de 2022.',source:'PRODESEN 2023–2037, cap. 4, figura 4.9.',url:'https://base.energia.gob.mx/PRODESEN2023/Capitulo4.pdf'},
{cat:'generacion',title:'¿Cuánta generación neta reportó CFE en 2024?',value:'148,775.4 GWh',desc:'Generación neta anual de CFE. No debe confundirse con generación bruta ni con el total nacional.',source:'Informe Anual CFE 2024, p. 27, indicadores estratégicos de generación.',url:'#fuentes'},
{cat:'generacion',title:'¿Cuánta generación limpia bruta reportó CFE en la tabla 2024?',value:'38,982.9 GWh',desc:'Equivale a 25.3% de la generación bruta total de CFE en esa tabla. Incluye hidro, nuclear, geotermia, solar y eólica.',source:'Informe Anual CFE 2024, p. 26, tabla de generación bruta limpia.',url:'#fuentes'},
{cat:'generacion',title:'¿Cuánto aportó la generación hidroeléctrica limpia CFE en esa tabla?',value:'22,354.2 GWh',desc:'Dato de generación bruta hidroeléctrica CFE 2024, no total nacional.',source:'Informe Anual CFE 2024, p. 26, tabla de generación bruta limpia.',url:'#fuentes'},
{cat:'generacion',title:'¿Cuánto generó la tecnología nuclear de CFE en 2024?',value:'12,306.6 GWh',desc:'Generación bruta nucleoeléctrica reportada por CFE en su tabla de generación limpia 2024.',source:'Informe Anual CFE 2024, p. 26, tabla de generación bruta limpia.',url:'#fuentes'},
{cat:'transmision',title:'¿Cuántos kilómetros de líneas de transmisión reportó CFE?',value:'110,559 km',desc:'Longitud de líneas de transmisión reportada en el Informe Anual CFE 2023.',source:'Informe Anual CFE 2023, p. 120.',url:'#fuentes'},
{cat:'transmision',title:'¿Cuántas subestaciones de transmisión se reportaron?',value:'2,302',desc:'Número de subestaciones de transmisión de CFE reportado en el mismo corte.',source:'Informe Anual CFE 2023, p. 120.',url:'#fuentes'},
{cat:'transmision',title:'¿Cuál era la capacidad de transformación reportada?',value:'164,992 MVA',desc:'Capacidad de transformación de subestaciones de transmisión reportada por CFE.',source:'Informe Anual CFE 2023, p. 120.',url:'#fuentes'},
{cat:'transmision',title:'¿Todos los sistemas eléctricos mexicanos están unidos?',value:'No',desc:'El SIN, Baja California, Baja California Sur y Mulegé se distinguen como sistemas eléctricos; los sistemas peninsulares aislados no deben dibujarse como conectados al SIN.',source:'PRODESEN y documentos de planeación del SEN; esquema conceptual de este sitio.',url:'https://base.energia.gob.mx/PRODESEN2023/Capitulo4.pdf'},
{cat:'transmision',title:'¿Por qué se utiliza alta tensión?',value:'I ∝ 1/V',desc:'Para la misma potencia trifásica y factor de potencia, elevar tensión reduce corriente. Como las pérdidas resistivas son 3I²R, disminuyen al bajar la corriente.',source:'Relaciones eléctricas del modelo trifásico; cálculo didáctico interactivo del módulo 2.',url:'#m2'},
{cat:'distribucion',title:'¿Cuántos kilómetros de red de media tensión reportó CFE?',value:'551,465 km',desc:'Longitud de líneas de media tensión de distribución reportada por CFE en 2023.',source:'Informe Anual CFE 2023, p. 138.',url:'#fuentes'},
{cat:'distribucion',title:'¿Cuántos kilómetros de red de baja tensión reportó CFE?',value:'342,741 km',desc:'Longitud de líneas de baja tensión de distribución reportada por CFE en 2023.',source:'Informe Anual CFE 2023, p. 138.',url:'#fuentes'},
{cat:'distribucion',title:'¿Qué porcentaje de pérdidas registró CFE en media y baja tensión?',value:'12.88%',desc:'Indicador nacional de pérdidas MT+BT para 2023; disminuyó desde 13.22% en 2022. No se distribuye por división.',source:'Informe Anual CFE 2023, p. 137.',url:'#fuentes'},
{cat:'distribucion',title:'¿Cuánto tiempo promedio estuvo sin suministro un cliente CFE en 2023?',value:'17.788 min',desc:'SAIDI promedio anual por cliente; mejoró 7.59% respecto de 19.248 minutos en 2022. Es un indicador nacional, no regional.',source:'Informe Anual CFE 2023, pp. 10 y 137.',url:'#fuentes'},
{cat:'distribucion',title:'¿Qué reduce la tensión antes de llegar a los usuarios?',value:'Transformadores',desc:'Los transformadores de distribución reducen la tensión de media a baja tensión. El nivel concreto depende de la red y del tipo de servicio.',source:'Explicación técnica del sistema de distribución; modelo ideal en módulo 3.',url:'#m3'}
];
function renderFacts(cat){
 const grid=$('factsGrid');grid.innerHTML='';
 const data=cat==='todos'?facts:facts.filter(f=>f.cat===cat);
 data.forEach((f,i)=>{const card=document.createElement('article');card.className='fact-card';card.innerHTML=`<small>${f.cat.toUpperCase()} · HALLAZGO ${i+1}</small><h4>${esc(f.title)}</h4><strong>${esc(f.value)}</strong><p>${esc(f.desc)}</p><a href="${f.url}" target="${f.url.startsWith('http')?'_blank':'_self'}" rel="noopener">${esc(f.source)} ↗</a>`;grid.appendChild(card);});
}
renderFacts('todos');

// Reforma: filtro especial para el tab "reforma"
document.querySelector('[data-fact="reforma"]').addEventListener('click',()=>{
 $('factsGrid').innerHTML='<article class="fact-card"><small>APARTADO ESPECIAL</small><h4>Reforma energética 2013 y nuevo marco 2025</h4><strong>2013 → 2025</strong><p>La sección histórica está desplegada a continuación. Distingue objetivos declarados, cambios legales y resultados observados; no atribuye causalidad sin evidencia.</p><a href="#reforma">Ir a la línea de tiempo ↘</a></article>';
 $('reforma').scrollIntoView({behavior:'smooth',block:'start'});
});
