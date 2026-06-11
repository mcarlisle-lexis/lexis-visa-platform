/* LEXIS VISA PLATFORM - app.js */
// Student data - no external brand references
const STUDENTS = [
  {id:1, name:'Maria Santos', email:'m.santos@example.com', phase:'Review', origin:'Colombia', progress:59, score:'85%', messages:226, lastActivity:'11/06/2026', risk:'med'},
  {id:2, name:'James Wilson', email:'j.wilson@example.com', phase:'Onboarding', origin:'Australia', progress:37, score:'N/A', messages:1, lastActivity:'09/06/2026', risk:'na'},
  {id:3, name:'Priya Patel', email:'p.patel@example.com', phase:'Immigration', origin:'India', progress:78, score:'91%', messages:5, lastActivity:'08/06/2026', risk:'low'},
  {id:4, name:'Carlos Mendez', email:'c.mendez@example.com', phase:'Review', origin:'Colombia', progress:84, score:'78%', messages:3, lastActivity:'07/06/2026', risk:'low'},
  {id:5, name:'Aisha Hassan', email:'a.hassan@example.com', phase:'Immigration', origin:'Egypt', progress:45, score:'N/A', messages:0, lastActivity:'06/06/2026', risk:'na'},
  {id:6, name:'Jorge Navarro', email:'j.navarro@example.com', phase:'Onboarding', origin:'Argentina', progress:22, score:'N/A', messages:2, lastActivity:'10/06/2026', risk:'na'},
  {id:7, name:'Lin Wei', email:'l.wei@example.com', phase:'Onboarding', origin:'China', progress:15, score:'N/A', messages:0, lastActivity:'05/06/2026', risk:'na'},
  {id:8, name:'Fatima Al-Rashid', email:'f.alrashid@example.com', phase:'Onboarding', origin:'UAE', progress:8, score:'N/A', messages:0, lastActivity:'04/06/2026', risk:'na'},
  {id:9, name:'Beto Rodrigues', email:'b.rodrigues@example.com', phase:'Invited', origin:'Brazil', progress:0, score:'N/A', messages:0, lastActivity:'03/06/2026', risk:'na'},
  {id:10, name:'Anna Kowalski', email:'a.kowalski@example.com', phase:'Invited', origin:'Poland', progress:0, score:'N/A', messages:0, lastActivity:'02/06/2026', risk:'na'},
  {id:11, name:'Erika Cortes', email:'e.cortes@example.com', phase:'Review', origin:'Colombia', progress:59, score:'88%', messages:270, lastActivity:'11/06/2026', risk:'high'},
  {id:12, name:'Sarah Chen', email:'s.chen@example.com', phase:'Completed', origin:'China', progress:100, score:'95%', messages:45, lastActivity:'01/06/2026', risk:'low'},
  {id:13, name:'Michael Brown', email:'m.brown@example.com', phase:'Completed', origin:'UK', progress:100, score:'89%', messages:23, lastActivity:'28/05/2026', risk:'low'},
  {id:14, name:'Ana Lima', email:'a.lima@example.com', phase:'Immigration', origin:'Brazil', progress:65, score:'N/A', messages:8, lastActivity:'09/06/2026', risk:'med'},
  {id:15, name:'Tom Baker', email:'t.baker@example.com', phase:'Invited', origin:'NZ', progress:0, score:'N/A', messages:0, lastActivity:'07/06/2026', risk:'na'},
  {id:16, name:'Yasmine Bouali', email:'y.bouali@example.com', phase:'Onboarding', origin:'Algeria', progress:30, score:'N/A', messages:3, lastActivity:'06/06/2026', risk:'na'},
];
const PHASE_COLORS = {Invited:'#7c3aed',Onboarding:'#2563eb',Review:'#ca8a04',Immigration:'#ea580c',Completed:'#16a34a'};
const PHASE_BADGE = {Invited:'badge-invited',Onboarding:'badge-onboarding',Review:'badge-review',Immigration:'badge-immigration',Completed:'badge-completed'};
const PHASES = ['Invited','Onboarding','Review','Immigration','Completed'];
let currentView='table', currentFilter='all', currentSection='genuine';
const answers={};

function navigate(page){
  var admin=document.getElementById('adminApp'), student=document.getElementById('studentApp');
  if(page==='student-app'){admin.classList.add('hidden');student.classList.remove('hidden');renderQuestions();return;}
  if(page==='admin'){student.classList.add('hidden');admin.classList.remove('hidden');navigate('dashboard');return;}
  document.querySelectorAll('.page').forEach(p=>p.classList.add('hidden'));
  var el=document.getElementById('page-'+page); if(el)el.classList.remove('hidden');
  document.querySelectorAll('.nav-link').forEach(n=>n.classList.remove('active'));
  var nav=document.getElementById('nav-'+page); if(nav)nav.classList.add('active');
  if(page==='students')renderStudents();
  if(page==='dashboard')setTimeout(initChart,60);
}

function initChart(){
  var ctx=document.getElementById('trendChart');
  if(!ctx||!window.Chart)return;
  if(ctx._c)ctx._c.destroy();
  ctx._c=new Chart(ctx,{type:'line',data:{
    labels:['Apr 12','Apr 16','Apr 20','Apr 24','Apr 28','May 2','May 6','May 10','May 12'],
    datasets:[{data:[1,1,1,1,1,2,1,2,3],fill:true,borderColor:'#5b4fcf',backgroundColor:'rgba(91,79,207,.07)',borderWidth:2,tension:0.4,pointRadius:4,pointBackgroundColor:'#5b4fcf'}]
  },options:{responsive:true,maintainAspectRatio:true,plugins:{legend:{display:false}},
    scales:{x:{grid:{color:'#f3f4f6'},ticks:{font:{size:10},color:'#9ca3af'}},
            y:{grid:{color:'#f3f4f6'},ticks:{font:{size:10},color:'#9ca3af'},beginAtZero:true,max:5}}}});
}

function initRecentConvos(){
  var tbody=document.getElementById('recentConvos'); if(!tbody)return;
  tbody.innerHTML=STUDENTS.filter(s=>s.messages>0).slice(0,3).map(s=>
    '<tr><td><div class="student-name">'+s.name+'</div></td><td><span class="badge '+PHASE_BADGE[s.phase]+'">'+s.phase+'</span></td><td>'+s.messages+'</td><td style="font-size:12px;color:#9ca3af">'+s.lastActivity+'</td></tr>'
  ).join('');
}
function setTab(el,n){document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));el.classList.add('active');toast('Showing last '+n+' conversations');}

function buildStageChips(){
  var wrap=document.getElementById('stageChips'); if(!wrap)return;
  var counts={all:STUDENTS.length};
  PHASES.forEach(p=>{counts[p.toLowerCase()]=STUDENTS.filter(s=>s.phase===p).length;});
  var chips=[['all','All'],...PHASES.map(p=>[p.toLowerCase(),p])];
  wrap.innerHTML=chips.map(c=>'<div class="chip '+(c[0]===currentFilter?'active':'')+'" onclick="setFilter(this,''+c[0]+'')">'+c[1]+' <span class="chip-count">'+(counts[c[0]]||0)+'</span></div>').join('');
}
function setFilter(el,f){currentFilter=f;document.querySelectorAll('.chip').forEach(c=>c.classList.remove('active'));el.classList.add('active');renderStudents();}
function filterStudents(s){renderStudents(typeof s==='string'?s:'');}
function getFiltered(s){
  var l=currentFilter==='all'?STUDENTS:STUDENTS.filter(x=>x.phase.toLowerCase()===currentFilter);
  return s?l.filter(x=>x.name.toLowerCase().includes(s.toLowerCase())||x.email.toLowerCase().includes(s.toLowerCase())):l;
}
function renderStudents(s){buildStageChips();if(currentView==='table')renderTable(s||'');else renderKanban();}
function renderTable(s){
  var tbody=document.getElementById('studentsBody'); if(!tbody)return;
  tbody.innerHTML=getFiltered(s).map(function(x){
    var fc=x.progress>=70?'fill-green':x.progress>=40?'':'fill-yellow';
    return '<tr onclick="toast('Opening '+x.name+'...')">' +
      '<td><div class="student-name">'+x.name+'</div><div class="student-email">'+x.email+'</div></td>' +
      '<td><span class="badge '+PHASE_BADGE[x.phase]+'">'+x.phase+'</span></td><td>'+x.origin+'</td>' +
      '<td><div class="progress-wrap"><div class="progress-bar"><div class="progress-fill '+fc+'" style="width:'+x.progress+'%"></div></div><span class="progress-pct">'+x.progress+'%</span></div></td>' +
      '<td>'+x.score+'</td><td style="color:#5b4fcf;cursor:pointer">'+(x.messages>0?x.messages+' msgs':'—')+'</td>' +
      '<td style="font-size:12px;color:#9ca3af">'+x.lastActivity+'</td>' +
      '<td><div class="actions-cell"><button class="link-btn" onclick="event.stopPropagation();toast('View '+x.name+'')">View</button><button class="link-btn" onclick="event.stopPropagation();toast('Edit '+x.name+'')">Edit</button></div></td></tr>';
  }).join('');
}
function renderKanban(){
  var board=document.getElementById('kanbanBoard'); if(!board)return;
  var list=getFiltered('');
  board.innerHTML=PHASES.map(function(phase){
    var items=list.filter(s=>s.phase===phase);
    return '<div class="kanban-col"><div class="kanban-col-header"><div class="kanban-col-title"><div class="kanban-dot" style="background:'+PHASE_COLORS[phase]+'"></div>'+phase+'</div><span class="kanban-count">'+items.length+'</span></div>'+
    items.map(function(s){return '<div class="kanban-card" onclick="toast('Opening '+s.name+'...')"><div class="kanban-name">'+s.name+'</div><div class="kanban-org">Lexis</div><div class="progress-wrap" style="margin-bottom:6px"><div class="progress-bar" style="flex:1"><div class="progress-fill" style="width:'+s.progress+'%"></div></div><span class="progress-pct">'+s.progress+'%</span></div><div class="risk"><div class="risk-dot risk-'+s.risk+'"></div>Risk: '+(s.risk==='na'?'N/A':s.risk.charAt(0).toUpperCase()+s.risk.slice(1))+'</div><div class="kanban-meta">&#128205; '+s.origin+'</div></div>';}).join('')+'</div>';
  }).join('');
}
function switchView(v){
  currentView=v;
  document.getElementById('tableView').classList.toggle('hidden',v!=='table');
  document.getElementById('kanbanView').classList.toggle('hidden',v!=='kanban');
  document.getElementById('btn-table').classList.toggle('active',v==='table');
  document.getElementById('btn-kanban').classList.toggle('active',v==='kanban');
  renderStudents();
}
function submitInvite(){
  var n=document.getElementById('inv-name').value.trim(), e=document.getElementById('inv-email').value.trim();
  if(!n||!e){toast('Please fill in all required fields');return;}
  toast('Invitation sent to '+e+'!'); setTimeout(()=>navigate('students'),1600);
}
function sendAdminInvite(){
  var e=document.getElementById('adminEmail').value.trim();
  if(!e){toast('Please enter an email address');return;}
  toast('Admin invitation sent to '+e); document.getElementById('adminEmail').value='';
}

// ==========================================
// STUDENT WIZARD + AI SUGGESTION ENGINE
// ==========================================
var QB = {
  genuine:[
    {label:'Family Ties', desc:'Explain who your immediate family members are and where they live. Do you have a spouse or children who will remain home while you study? How often do you see your family and how are you connected to them?', placeholder:'Describe your family situation and ties to your home country...',
     weakTriggers:['no family','no ties','no connections','alone','nobody'], weakWarning:'Stating no family ties may weaken your application — it reduces demonstrated reasons to return home.', strengthenTip:'Mention parents, siblings, or other relatives. Even distant connections show home ties.', addTip:'how often you communicate with family and any financial obligations to them.'},
    {label:'Community Connections', desc:'Are you involved in your local community? Include volunteering, clubs, sports, religious groups, or property ownership. What personal obligations tie you to your community?', placeholder:'Describe your community involvement and local ties...',
     weakTriggers:['no connections','not involved','no community','dont have any','nothing'], weakWarning:'Limited community ties may weaken your case for returning home after study.', strengthenTip:'Mention any community, religious, cultural, or social groups — even informal ones count.', addTip:'upcoming community events or commitments you plan to return for.'},
    {label:'Career and Educational Background', desc:'Tell us about your current career or educational situation and how it connects to your home country. Include your role, field, and how this study will advance your career back home.', placeholder:'Describe your career or studies and future plans at home...',
     weakTriggers:['no job','unemployed','nothing planned','unsure','dont know'], weakWarning:'An unclear career connection may raise doubts about your intention to return after study.', strengthenTip:'Link your study course directly to a career opportunity or industry in your home country.', addTip:'specific employers, industries, or roles you plan to pursue after graduating.'},
    {label:'Economic Situation', desc:'Describe your financial situation and how you will fund your studies. Include savings, income, family support, scholarships, or sponsors — with specific amounts and sources.', placeholder:'Describe your financial position and how you will support yourself...',
     weakTriggers:['dont have','no money','not sure','unclear','will figure out'], weakWarning:'Vague financial statements raise concerns about your ability to support yourself.', strengthenTip:'Specify amounts, bank accounts, income sources, or provide a financial breakdown.', addTip:'how the funds cover tuition and living costs for the full course duration.'},
    {label:'Study Purpose and Goals', desc:'Why have you chosen this specific course and institution? How does it align with your career goals? Why is this destination the right place to study?', placeholder:'Explain your academic goals and why you chose this course...',
     weakTriggers:['cheap','easy','friend told me','just want','for the money'], weakWarning:'Your stated purpose may not appear academic enough. Officers look for genuine educational motivation.', strengthenTip:'Research specific modules, professors, or facilities that make this institution ideal for your goals.', addTip:'how this qualification is recognised in your home country job market.'}
  ],
  funding:[
    {label:'Source of Funds', desc:'Where will funds for your studies come from? Provide bank accounts, employment income, family support, or other sources.', placeholder:'Describe all funding sources...', weakTriggers:['not sure','unclear','family will handle'], weakWarning:'Vague funding sources may trigger additional scrutiny.', strengthenTip:'Provide specific account balances, income figures, or sponsor details.', addTip:'a breakdown of tuition vs living costs.'},
    {label:'Funds Availability', desc:'Are funds currently available? When were they deposited? Can you provide bank statements?', placeholder:'Confirm when and how funds are accessible...'},
    {label:'Employment and Income', desc:'Are you currently employed? Employer, role, salary, and tenure.', placeholder:'Describe your current employment and income...'},
    {label:'Financial Sponsor', desc:'If someone else is funding your study, who are they and what is their financial capacity?', placeholder:'Provide sponsor details if applicable...'}
  ],
  health:[
    {label:'Health Insurance Coverage', desc:'Do you have Overseas Student Health Cover (OSHC) or equivalent? Provider and policy period?', placeholder:'Provide your health insurance details...'},
    {label:'Pre-existing Conditions', desc:'Any pre-existing medical conditions requiring treatment during your stay?', placeholder:'Disclose any relevant medical conditions...'}
  ],
  education:[
    {label:'Previous Qualifications', desc:'Educational qualifications from secondary school onwards — institution, years, and grades.', placeholder:'List your educational history...'},
    {label:'English Language Proficiency', desc:'English test results: IELTS, TOEFL, or PTE scores and dates.', placeholder:'Provide your English test results...'},
    {label:'Previous Study Abroad', desc:'Previously studied abroad? Where, when, and did you comply with all visa conditions?', placeholder:'Describe any previous overseas study...'},
    {label:'Academic Gaps', desc:'Gaps in your education? Explain what you were doing during those periods.', placeholder:'Explain any gaps in your study history...'},
    {label:'Proposed Course', desc:'Describe the course, its duration, and how it relates to your previous education.', placeholder:'Describe your proposed course...'},
    {label:'Institution Selection', desc:'Why this institution? What research did you do?', placeholder:'Explain your reasons for choosing this institution...'},
    {label:'Future Academic Goals', desc:'Plan to continue studying? Long-term academic ambitions?', placeholder:'Describe your long-term academic plans...'}
  ],
  employment:[
    {label:'Current Employment', desc:'Are you currently employed? Job title, employer, industry, and tenure.', placeholder:'Describe your current job...'},
    {label:'Employment History', desc:'Previous positions over the last 5 years — employer, role, and dates.', placeholder:'List your employment history...'},
    {label:'Career Plans After Study', desc:'Career to pursue after study? Return to your current field?', placeholder:'Describe your post-study career plans...'},
    {label:'Professional Ties', desc:'Professional networks, business interests, or partnerships in your home country?', placeholder:'Describe professional ties to your home country...'}
  ],
  language:[
    {label:'Native Language', desc:'Native language and English proficiency level?', placeholder:'Describe your language background...'},
    {label:'English Test Results', desc:'Test name, date, and scores for each component.', placeholder:'List your English test scores...'},
    {label:'English Study History', desc:'How long studied English? Any English language programs?', placeholder:'Describe your English learning history...'},
    {label:'English in Work', desc:'Do you use English in your current job or studies?', placeholder:'Explain how you use English professionally...'},
    {label:'Other Languages', desc:'Other languages and proficiency levels?', placeholder:'List any other languages you speak...'},
    {label:'Language Support Needs', desc:'Will you require language support during studies?', placeholder:'Describe any language support you may need...'}
  ],
  travel:[
    {label:'Previous Visa History', desc:'Visas held for other countries — country, type, and validity.', placeholder:'List your previous visas...'},
    {label:'Previous Travel', desc:'Countries visited in the last 10 years — purpose and duration.', placeholder:'Describe your international travel history...'},
    {label:'Visa Refusals', desc:'Ever been refused a visa? Full details required.', placeholder:'Disclose any visa refusals or cancellations...', weakTriggers:['refused','rejected','cancelled','denied'], weakWarning:'Visa refusals must be disclosed accurately — failure to do so can result in rejection.', strengthenTip:'Explain the circumstances and what has changed since the refusal.'},
    {label:'Compliance History', desc:'Always departed before visa expiry? Ever breached visa conditions?', placeholder:'Confirm your visa compliance record...'}
  ],
  declarations:[
    {label:'Health Examination', desc:'I confirm that I have undergone or will undergo the required health examinations prior to visa grant.', placeholder:'Type "I confirm" to accept this declaration...'},
    {label:'Character Declaration', desc:'I declare that I am of good character and have no adverse findings against me in any country.', placeholder:'Type "I confirm" to accept this declaration...'},
    {label:'No Criminal Record', desc:'I declare that I have no criminal convictions or pending charges in any country.', placeholder:'Type "I confirm" to accept this declaration...'},
    {label:'Genuine Temporary Entrant', desc:'I declare that I am a genuine temporary entrant and my primary purpose is to study.', placeholder:'Type "I confirm" to accept this declaration...'},
    {label:'Accuracy of Information', desc:'I declare that all information in this application is true, accurate, and complete. False information may result in refusal or cancellation.', placeholder:'Type "I confirm" to accept this declaration...'}
  ]
};
var SECTION_TITLES={funding:'Funding for Stay',health:'Health Insurance',education:'Education',employment:'Employment',language:'Language',travel:'Travel History',genuine:'Genuine Student',declarations:'Declarations'};

function setSection(el){
  document.querySelectorAll('.wizard-nav-item').forEach(i=>i.classList.remove('active'));
  el.classList.add('active'); currentSection=el.dataset.section;
  var ctx=document.getElementById('aiContext'); if(ctx)ctx.textContent=SECTION_TITLES[currentSection]||currentSection;
  renderQuestions(); addAiGreeting(currentSection);
}
function renderQuestions(){
  var panel=document.getElementById('questionsPanel'); if(!panel)return;
  var qs=QB[currentSection]||[];
  panel.innerHTML=qs.map(function(q,i){
    var key=currentSection+'_'+i, val=answers[key]||'', fb=val?getInlineFeedback(q,val):'';
    return '<div class="question-card '+(i===0?'question-card--active':'')+'" id="qcard_'+key+'">' +
      '<div class="q-header"><div class="q-title">'+(i+1)+'. '+q.label+' <span class="req">*</span></div><span class="q-copy">&#128203;</span></div>' +
      '<p class="q-desc">'+q.desc+'</p>' +
      '<textarea class="q-textarea" rows="4" placeholder="'+(q.placeholder||'Enter your response here...')+'" oninput="onAnswer(this,''+key+'','+i+')">'+val+'</textarea>' +
      '<div id="feedback_'+key+'">'+fb+'</div></div>';
  }).join('')+
  '<div class="q-nav-row"><button class="btn btn-ghost" onclick="navSection(-1)">&#8592; Previous</button><button class="btn btn-primary" onclick="toast('Progress saved!')">Save Progress</button><button class="btn btn-primary" onclick="navSection(1)">Next &#8594;</button></div>';
}
function onAnswer(el,key,qi){
  answers[key]=el.value;
  var q=(QB[currentSection]||[])[qi]; if(!q)return;
  var fb=document.getElementById('feedback_'+key); if(fb)fb.innerHTML=getInlineFeedback(q,el.value);
  clearTimeout(el._t); el._t=setTimeout(function(){aiCommentOnAnswer(q,el.value);},900);
}
function getInlineFeedback(q,v){
  if(!v.trim())return '';
  var weak=(q.weakTriggers||[]).some(w=>v.toLowerCase().includes(w.toLowerCase()));
  if(weak)return '<div class="q-warning">&#9888; '+(q.weakWarning||'Your answer may weaken your application. Please elaborate.')+'</div>';
  if(v.trim().length>80)return '<div class="q-success">&#10003; Good detail level — this strengthens your application.</div>';
  return '';
}

// AI Suggestion Engine
function aiCommentOnAnswer(q,v){
  if(!v.trim())return;
  var msgs=document.getElementById('aiMessages'); if(!msgs)return;
  var weak=(q.weakTriggers||[]).some(w=>v.toLowerCase().includes(w.toLowerCase()));
  var html;
  if(weak){
    html='<div class="ai-msg"><div class="ai-warning-bubble"><strong>&#9888; Issue detected</strong>'+(q.weakWarning||'This answer could weaken your application.')+'<br><br><strong>Suggestion:</strong> '+(q.strengthenTip||'Add specific examples, dates, or evidence.')+'</div></div>';
  } else if(v.trim().length>80){
    html='<div class="ai-msg"><div class="ai-tip"><strong>&#10003; Looking good!</strong>Your answer shows good detail. Consider also: '+(q.addTip||'how this connects to your home country plans.')+'</div></div>';
  } else {
    html='<div class="ai-msg ai-msg--bot"><div class="ai-bubble">Try to add more detail — longer, specific answers are more convincing to visa assessors. Aim for at least 3–4 sentences.</div></div>';
  }
  msgs.innerHTML+=html; msgs.scrollTop=msgs.scrollHeight;
}
function addAiGreeting(s){
  var msgs=document.getElementById('aiMessages'); if(!msgs)return;
  var g={funding:'I'll help you demonstrate sufficient funds. Clear financial evidence is critical.',health:'I'll flag any gaps in your health insurance responses.',education:'I'll help you show a clear, genuine study pathway.',employment:'I'll help you frame your work experience to demonstrate home ties.',language:'I'll help you present your language skills accurately.',travel:'Honest, clear travel history is essential. I'll help you structure it.',genuine:'I'm here to help you demonstrate genuine student intent and strong home ties.',declarations:'Declarations must be complete and accurate — I'll help you verify each one.'};
  msgs.innerHTML+='<div class="ai-msg ai-msg--bot"><div class="ai-bubble">'+(g[s]||'How can I help with this section?')+'</div></div>';
  msgs.scrollTop=msgs.scrollHeight;
}
function sendMessage(){
  var input=document.getElementById('aiInput'), val=input.value.trim(); if(!val)return;
  var msgs=document.getElementById('aiMessages');
  msgs.innerHTML+='<div class="ai-msg ai-msg--user"><div class="ai-bubble">'+val+'</div></div>';
  input.value='';
  setTimeout(function(){
    var m=val.toLowerCase(), r;
    if(m.includes('weak')||m.includes('problem'))r='Add specific examples — names, dates, amounts — to make your answer more convincing to assessors.';
    else if(m.includes('help')||m.includes('improve'))r='Structure your answer: (1) state the fact, (2) provide evidence, (3) connect it to your study or home country plans.';
    else if(m.includes('family')||m.includes('ties'))r='Family ties are powerful anchors. Mention names, locations, communication frequency, and any financial responsibilities.';
    else if(m.includes('money')||m.includes('fund'))r='For funding, include: specific balance amounts, account holder name, how long held, and the source of funds.';
    else r='For this section, the key is showing clear intent and genuine connection to your studies. Would you like me to suggest a structure for a specific answer?';
    msgs.innerHTML+='<div class="ai-msg ai-msg--bot"><div class="ai-bubble">'+r+'</div></div>';
    msgs.scrollTop=msgs.scrollHeight;
  },600);
  msgs.scrollTop=msgs.scrollHeight;
}
function navSection(dir){
  var keys=Object.keys(QB), idx=keys.indexOf(currentSection), next=keys[idx+dir];
  if(!next){toast(dir>0?'All sections complete!':'Already at the first section');return;}
  var el=document.querySelector('[data-section="'+next+'"]'); if(el)setSection(el);
  var body=document.querySelector('.questions-panel'); if(body)body.scrollTop=0;
}
function toast(msg){
  var c=document.getElementById('toast-container'), d=document.createElement('div');
  d.className='toast-item'; d.textContent=msg; c.appendChild(d);
  setTimeout(function(){d.remove();},2800);
}
document.addEventListener('DOMContentLoaded',function(){
  navigate('dashboard'); initRecentConvos(); buildStageChips(); renderStudents();
  if(!window.Chart){var s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js';s.onload=initChart;document.head.appendChild(s);}
  else setTimeout(initChart,100);
});
