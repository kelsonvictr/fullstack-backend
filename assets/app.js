// ═══════════════════════════════════════════
// SCROLL PROGRESS
// ═══════════════════════════════════════════
window.addEventListener('scroll',()=>{
  const h=document.documentElement;
  const pct=(h.scrollTop/(h.scrollHeight-h.clientHeight))*100;
  document.getElementById('progressBar').style.width=pct+'%';
});

// ═══════════════════════════════════════════
// INTERSECTION OBSERVER — REVEAL ON SCROLL
// ═══════════════════════════════════════════
const observer=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')});
},{threshold:0.12});
document.querySelectorAll('.step-section,.stagger').forEach(s=>observer.observe(s));

// ═══════════════════════════════════════════
// SIDEBAR NAV
// ═══════════════════════════════════════════
function toggleSidebar(){
  document.getElementById('sidebarNav').classList.toggle('open');
  document.getElementById('sidebarOverlay').classList.toggle('open');
}
function goTo(id){
  toggleSidebar();
  setTimeout(()=>{
    document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'});
  },300);
}

// ═══════════════════════════════════════════
// TOGGLER
// ═══════════════════════════════════════════
function toggleSection(header){
  header.classList.toggle('open');
  header.nextElementSibling.classList.toggle('open');
}

// ═══════════════════════════════════════════
// FLOW ANIMATION
// ═══════════════════════════════════════════
let flowRunning=false;
async function runFlowDemo(){
  if(flowRunning)return;
  flowRunning=true;
  const btn=document.getElementById('flowBtn');
  btn.style.opacity='0.5';btn.style.pointerEvents='none';

  for(let i=0;i<=5;i++){
    const el=document.getElementById('flow-'+i);
    if(el)el.style.opacity='0.3';
    const lbl=document.getElementById('flow-label-'+i);
    if(lbl)lbl.style.opacity='0';
  }
  const inj1=document.getElementById('flow-inject-1');
  const inj2=document.getElementById('flow-inject-2');
  if(inj1)inj1.style.opacity='0.3';
  if(inj2)inj2.style.opacity='0.3';

  for(let i=0;i<=5;i++){
    await new Promise(r=>setTimeout(r,600));
    const el=document.getElementById('flow-'+i);
    if(el){el.style.opacity='1';el.style.transition='opacity 0.5s';el.style.transform='scale(1.04)';
      setTimeout(()=>el.style.transform='scale(1)',300)}
    if(i===1&&inj1){inj1.style.opacity='1';inj1.style.transition='opacity 0.5s'}
    if(i===2&&inj2){inj2.style.opacity='1';inj2.style.transition='opacity 0.5s'}
    if(i<5){const lbl=document.getElementById('flow-label-'+i);if(lbl){lbl.style.opacity='1';lbl.style.transition='opacity 0.4s'}}
  }

  btn.style.opacity='1';btn.style.pointerEvents='auto';btn.textContent='🔄 Repetir';
  flowRunning=false;
}

// ═══════════════════════════════════════════
// INTERACTIVE DB — FORNECEDOR
// ═══════════════════════════════════════════
let fornDbData=[];
let fornDbId=0;
function addFornDb(nomeFantasia,cnpj,email,telefonePrincipal){
  fornDbId++;
  fornDbData.push({id:fornDbId,nomeFantasia,cnpj,email,telefonePrincipal});
  renderFornDb();
}
function resetFornDb(){fornDbData=[];fornDbId=0;renderFornDb()}
function renderFornDb(){
  const tb=document.getElementById('fornDbTable');
  if(fornDbData.length===0){
    tb.innerHTML='<tr style="color:var(--text-dim);font-style:italic"><td colspan="5" style="text-align:center;padding:20px">Tabela vazia — use os botões para simular!</td></tr>';
    return;
  }
  tb.innerHTML=fornDbData.map((f,i)=>`<tr class="db-row-new" style="animation-delay:${i*0.1}s"><td style="color:var(--accent5);font-weight:700">${f.id}</td><td>${f.nomeFantasia}</td><td style="color:var(--text-dim);font-size:0.72rem">${f.cnpj}</td><td style="color:var(--text-dim);font-size:0.72rem">${f.email}</td><td style="color:var(--text-dim);font-size:0.72rem">${f.telefonePrincipal}</td></tr>`).join('');
}

// ═══════════════════════════════════════════
// DEMO: FORNECEDOR CRUD
// ═══════════════════════════════════════════
async function demoFornCrud(type){
  const body=document.getElementById('fornDemoBody');
  body.innerHTML='';
  let lines=[];

  if(type==='post'){
    lines=[
      {delay:200,html:'<span class="method-post">POST</span> <span class="url">/fornecedores</span>'},
      {delay:300,html:'<span class="dim">Content-Type: application/json</span>'},
      {delay:200,html:''},
      {delay:100,html:'<span class="arrow">→ Body:</span>'},
      {delay:100,html:'{'},
      {delay:100,html:'  <span class="json-key">"nomeFantasia"</span>: <span class="json-val">"Distribuidora ABC"</span>,'},
      {delay:100,html:'  <span class="json-key">"cnpj"</span>: <span class="json-val">"12.345.678/0001-99"</span>,'},
      {delay:100,html:'  <span class="json-key">"email"</span>: <span class="json-val">"contato@abc.com"</span>,'},
      {delay:100,html:'  <span class="json-key">"telefonePrincipal"</span>: <span class="json-val">"(11) 99999-0001"</span>,'},
      {delay:80,html:'  <span class="json-key">"telefoneSecundario"</span>: <span class="json-val">"(11) 4002-8922"</span>'},
      {delay:100,html:'}'},
      {delay:600,html:''},
      {delay:200,html:'<span class="arrow">← Response:</span> <span class="status-created">201 Created</span> ✅'},
      {delay:100,html:'<span class="dim">Fornecedor salvo no banco de dados!</span>'},
    ];
  } else if(type==='getAll'){
    lines=[
      {delay:200,html:'<span class="method-get">GET</span> <span class="url">/fornecedores</span>'},
      {delay:500,html:''},
      {delay:200,html:'<span class="arrow">← Response:</span> <span class="status-ok">200 OK</span>'},
      {delay:100,html:'['},
      {delay:150,html:'  {<span class="json-key">"id"</span>:<span class="json-num">1</span>, <span class="json-key">"nomeFantasia"</span>:<span class="json-val">"Distribuidora ABC"</span>, <span class="json-key">"cnpj"</span>:<span class="json-val">"12.345..."</span>, ...},'},
      {delay:150,html:'  {<span class="json-key">"id"</span>:<span class="json-num">2</span>, <span class="json-key">"nomeFantasia"</span>:<span class="json-val">"Fornecedor XYZ"</span>, <span class="json-key">"cnpj"</span>:<span class="json-val">"98.765..."</span>, ...}'},
      {delay:100,html:']'},
    ];
  } else if(type==='getOne'){
    lines=[
      {delay:200,html:'<span class="method-get">GET</span> <span class="url">/fornecedores/1</span>'},
      {delay:500,html:''},
      {delay:200,html:'<span class="arrow">← Response:</span> <span class="status-ok">200 OK</span>'},
      {delay:100,html:'{'},
      {delay:100,html:'  <span class="json-key">"id"</span>: <span class="json-num">1</span>,'},
      {delay:100,html:'  <span class="json-key">"nomeFantasia"</span>: <span class="json-val">"Distribuidora ABC"</span>,'},
      {delay:100,html:'  <span class="json-key">"cnpj"</span>: <span class="json-val">"12.345.678/0001-99"</span>,'},
      {delay:100,html:'  <span class="json-key">"email"</span>: <span class="json-val">"contato@abc.com"</span>,'},
      {delay:80,html:'  <span class="json-key">"telefonePrincipal"</span>: <span class="json-val">"(11) 99999-0001"</span>,'},
      {delay:80,html:'  <span class="json-key">"telefoneSecundario"</span>: <span class="json-val">"(11) 4002-8922"</span>'},
      {delay:100,html:'}'},
    ];
  } else if(type==='put'){
    lines=[
      {delay:200,html:'<span class="method-put">PUT</span> <span class="url">/fornecedores/1</span>'},
      {delay:300,html:'<span class="dim">Content-Type: application/json</span>'},
      {delay:200,html:''},
      {delay:100,html:'<span class="arrow">→ Body:</span>'},
      {delay:100,html:'{'},
      {delay:100,html:'  <span class="json-key">"nomeFantasia"</span>: <span class="json-val">"Distribuidora ABC Atualizada"</span>,'},
      {delay:100,html:'  <span class="json-key">"cnpj"</span>: <span class="json-val">"12.345.678/0001-99"</span>,           <span class="cm">// updatable=false: ignorado</span>'},
      {delay:100,html:'  <span class="json-key">"email"</span>: <span class="json-val">"novo@abc.com"</span>,'},
      {delay:100,html:'  <span class="json-key">"telefonePrincipal"</span>: <span class="json-val">"(11) 99999-0001"</span>,'},
      {delay:100,html:'  <span class="json-key">"telefoneSecundario"</span>: <span class="json-val">"(11) 91234-5678"</span>'},
      {delay:100,html:'}'},
      {delay:600,html:''},
      {delay:200,html:'<span class="arrow">← Response:</span> <span class="status-ok">204 No Content</span> ✅'},
      {delay:100,html:'<span class="dim">Fornecedor atualizado com sucesso!</span>'},
    ];
  } else if(type==='delete'){
    lines=[
      {delay:200,html:'<span class="method-delete">DELETE</span> <span class="url">/fornecedores/1</span>'},
      {delay:600,html:''},
      {delay:200,html:'<span class="arrow">← Response:</span> <span class="status-ok">204 No Content</span> ✅'},
      {delay:100,html:'<span class="dim">Fornecedor removido do banco de dados!</span>'},
      {delay:400,html:''},
      {delay:200,html:'<span class="dim">💡 Se tentar GET /fornecedores/1 agora, receberá 404!</span>'},
    ];
  }

  for(const line of lines){
    await new Promise(r=>setTimeout(r,line.delay));
    const div=document.createElement('div');
    div.className='demo-line';
    div.innerHTML=line.html;
    body.appendChild(div);
    requestAnimationFrame(()=>requestAnimationFrame(()=>div.classList.add('show')));
    body.scrollTop=body.scrollHeight;
  }
}

// ═══════════════════════════════════════════
// CHECKLIST — POSTGRESQL TOUR
// ═══════════════════════════════════════════
function updateChecklist(){
  const checks=document.querySelectorAll('#pgChecklist input[type="checkbox"]');
  const total=checks.length;
  let checked=0;
  checks.forEach(c=>{
    const label=c.closest('label');
    if(c.checked){
      checked++;
      label.style.borderColor='rgba(6,214,160,0.3)';
      label.style.background='rgba(6,214,160,0.06)';
      label.querySelector('span').style.textDecoration='line-through';
      label.querySelector('span').style.opacity='0.7';
    } else {
      label.style.borderColor='rgba(255,255,255,0.05)';
      label.style.background='var(--surface2)';
      label.querySelector('span').style.textDecoration='none';
      label.querySelector('span').style.opacity='1';
    }
  });
  const pct=Math.round((checked/total)*100);
  document.getElementById('checklistBar').style.width=pct+'%';
  document.getElementById('checklistCount').textContent=checked+' de '+total+' completos';
  document.getElementById('checklistComplete').style.display=checked===total?'block':'none';
}

// ═══════════════════════════════════════════════════════
// WEB DEMO — animações didáticas (front ↔ DTO/Controller)
// ═══════════════════════════════════════════════════════
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Lança uma partícula voadora de el A pra el B (DOMRect-based)
function flyParticle(container, fromEl, toEl, opts={}){
  const cRect=container.getBoundingClientRect();
  const aRect=fromEl.getBoundingClientRect();
  const bRect=toEl.getBoundingClientRect();
  const x0=aRect.left+aRect.width/2-cRect.left;
  const y0=aRect.top+aRect.height/2-cRect.top;
  const x1=bRect.left+bRect.width/2-cRect.left;
  const y1=bRect.top+bRect.height/2-cRect.top;
  const p=document.createElement('span');
  p.className='particle '+(opts.kind||'');
  p.style.left=x0+'px';
  p.style.top=y0+'px';
  p.style.setProperty('--tx',(x1-x0)+'px');
  p.style.setProperty('--ty',(y1-y0)+'px');
  p.style.transform='translate(0,0)';
  container.appendChild(p);
  // Anima
  requestAnimationFrame(()=>{
    p.classList.add('flying');
    p.style.transition='transform 0.85s cubic-bezier(0.4,0.0,0.2,1)';
    p.style.transform=`translate(${x1-x0}px, ${y1-y0}px)`;
  });
  setTimeout(()=>p.remove(),1100);
}

// Typewriter num input
async function typeInto(input, text, speed=40){
  input.value='';
  input.classList.add('typing');
  for(let i=0;i<text.length;i++){
    input.value+=text[i];
    await sleep(speed);
  }
  input.classList.remove('typing');
  input.classList.add('filled');
}

// Roda demo Tipo 1+2 (DTOs: form → request → response → lista)
async function runDtoDemo(demo){
  if(reducedMotion){
    // Aplica estado final direto
    demo.querySelectorAll('.web-form-input').forEach(i=>{i.value=i.dataset.fill||'';i.classList.add('filled')});
    demo.querySelectorAll('.dto-field').forEach(f=>f.classList.add('lit'));
    demo.querySelectorAll('.dto-value').forEach(v=>v.classList.add('shown'));
    demo.querySelectorAll('.web-list-table tbody tr').forEach(r=>r.classList.add('appeared'));
    return;
  }
  // Reset estado
  demo.querySelectorAll('.web-form-input').forEach(i=>{i.value='';i.classList.remove('typing','filled')});
  demo.querySelectorAll('.dto-field').forEach(f=>f.classList.remove('lit'));
  demo.querySelectorAll('.dto-value').forEach(v=>v.classList.remove('shown'));
  demo.querySelectorAll('.web-list-table tbody tr').forEach(r=>r.classList.remove('appeared'));
  demo.querySelectorAll('.particle').forEach(p=>p.remove());

  await sleep(300);
  // Fase 1: typewriter inputs
  const inputs=[...demo.querySelectorAll('.web-form-input')];
  for(const inp of inputs){
    await typeInto(inp,inp.dataset.fill||'',38);
    await sleep(140);
  }
  // Fase 2: pulse no botão Submit
  const submitBtn=demo.querySelector('.web-form-submit');
  if(submitBtn){submitBtn.classList.add('pulse');await sleep(450);submitBtn.classList.remove('pulse')}
  // Fase 3: partículas voam dos inputs aos campos do DTO
  await sleep(150);
  for(const inp of inputs){
    const target=demo.querySelector(`.dto-field[data-field="${inp.dataset.target}"]`);
    if(target){
      flyParticle(demo,inp,target,{kind:'kind-data'});
      await sleep(160);
      target.classList.add('lit');
      // mostra valor inline
      const val=demo.querySelector(`.dto-value[data-field="${inp.dataset.target}"]`);
      if(val){val.textContent=' = "'+(inp.value||'')+'"';val.classList.add('shown')}
    }
  }
  // Fase 4: pausa "backend processa"
  await sleep(700);
  // Fase 5: ResponseDTO inline (ilumina campos)
  const respFields=demo.querySelectorAll('.dto-mock.response-dto .dto-field');
  for(const f of respFields){
    f.classList.add('lit');
    await sleep(80);
  }
  await sleep(150);
  // Fase 6: partículas voam do ResponseDTO pra lista
  const listRows=[...demo.querySelectorAll('.web-list-table tbody tr')];
  if(listRows.length){
    const respDto=demo.querySelector('.dto-mock.response-dto');
    for(const r of listRows){
      if(respDto)flyParticle(demo,respDto,r,{kind:'kind-resp'});
      await sleep(150);
      r.classList.add('appeared');
    }
  }
}

// Roda demo Tipo 3 (Controller → Página: pipeline cascata)
async function runPipelineDemo(demo){
  if(reducedMotion){
    demo.querySelectorAll('.pipeline-step').forEach(s=>s.classList.add('done'));
    demo.querySelectorAll('.pipeline-arrow').forEach(a=>a.classList.add('active'));
    return;
  }
  // Reset
  demo.querySelectorAll('.pipeline-step').forEach(s=>s.classList.remove('active','done'));
  demo.querySelectorAll('.pipeline-arrow').forEach(a=>a.classList.remove('active'));
  await sleep(300);
  const steps=[...demo.querySelectorAll('.pipeline-step')];
  const arrows=[...demo.querySelectorAll('.pipeline-arrow')];
  for(let i=0;i<steps.length;i++){
    if(i>0)steps[i-1].classList.replace('active','done');
    steps[i].classList.add('active');
    if(arrows[i-1])arrows[i-1].classList.add('active');
    await sleep(750);
  }
  // Marca último como done também
  steps[steps.length-1].classList.add('done');
}

// Roda demo Tipo 4 (Insomnia ↔ Página)
async function runCompareDemo(demo){
  if(reducedMotion){
    demo.querySelectorAll('.compare-tool-action,.http-pulse').forEach(e=>e.classList.add('firing'));
    return;
  }
  demo.querySelectorAll('.compare-tool-action,.http-pulse').forEach(e=>e.classList.remove('firing'));
  await sleep(300);
  const insomnia=demo.querySelector('.tool-insomnia .compare-tool-action');
  const react=demo.querySelector('.tool-react .compare-tool-action');
  const pulses=[...demo.querySelectorAll('.http-pulse')];
  // Insomnia dispara
  if(insomnia){insomnia.classList.add('firing');await sleep(500)}
  if(pulses[0]){pulses[0].classList.add('firing');await sleep(700)}
  // React dispara em seguida
  if(react){react.classList.add('firing');await sleep(500)}
  if(pulses[1]){pulses[1].classList.add('firing')}
}

// Dispatcher: chama o handler certo por data-demo
function runWebDemo(demo){
  const type=demo.dataset.demo;
  if(type==='dto')return runDtoDemo(demo);
  if(type==='pipeline')return runPipelineDemo(demo);
  if(type==='compare')return runCompareDemo(demo);
}

// Replay button (chama do botão dentro do demo)
function replayWebDemo(btn){
  const demo=btn.closest('.web-demo');
  if(demo)runWebDemo(demo);
}

// IntersectionObserver — autoplay quando entra no viewport
const webDemoObs=new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting && !e.target.dataset.played){
      e.target.dataset.played='1';
      // pequeno delay pra "respirar"
      setTimeout(()=>runWebDemo(e.target),250);
    }
  });
},{threshold:0.35});

document.querySelectorAll('.web-demo').forEach(el=>webDemoObs.observe(el));
