// LEXIS VISA PLATFORM - app.js
// Admin + 7-step student immigration wizard with AI

// ---- ADMIN NAV ----
var currentPage = 'dashboard';
function navigate(page) {
  document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
  document.querySelectorAll('.nav-link').forEach(function(n) { n.classList.remove('active'); });
  var target = document.getElementById('page-' + page);
  if (target) target.classList.add('active');
  var navEl = document.getElementById('nav-' + page);
  if (navEl) navEl.classList.add('active');
  if (page === 'dashboard') initChart();
  currentPage = page;
}
function resetFilters() {}
function refreshDashboard() { initChart(); }
function initChart() {
  var ctx = document.getElementById('trendChart');
  if (!ctx) return;
  if (ctx._chartInstance) ctx._chartInstance.destroy();
  ctx._chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Jan','Feb','Mar','Apr','May','Jun'],
      datasets: [{ label: 'Active Students', data: [4,6,8,7,11,12], borderColor: '#6366f1', backgroundColor: 'rgba(99,102,241,0.1)', tension: 0.4, fill: true, pointBackgroundColor: '#6366f1' }]
    },
    options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { color: '#f3f4f6' } }, x: { grid: { display: false } } } }
  });
}
function switchView(v) {
  document.getElementById('table-view').style.display = v === 'table' ? '' : 'none';
  document.getElementById('kanban-view').style.display = v === 'kanban' ? '' : 'none';
  document.getElementById('view-table-btn').classList.toggle('active', v === 'table');
  document.getElementById('view-kanban-btn').classList.toggle('active', v === 'kanban');
}
function filterStudents(q) {}
function filterByStage(s) {}
function viewStudent(id) { showStudentView(); }
function sendInvite() { alert('Invitation sent successfully!'); navigate('students'); }
function switchConfigTab(tab) {
  document.querySelectorAll('.config-panel').forEach(function(p) { p.classList.remove('active'); });
  document.querySelectorAll('.config-tab').forEach(function(t) { t.classList.remove('active'); });
  document.getElementById('config-' + tab).classList.add('active');
  event.target.classList.add('active');
}

// ---- STUDENT VIEW ----
function showStudentView() {
  document.getElementById('adminApp').style.display = 'none';
  document.getElementById('studentApp').style.display = '';
  initWizard();
}
function hideStudentView() {
  document.getElementById('studentApp').style.display = 'none';
  document.getElementById('adminApp').style.display = '';
  navigate('dashboard');
}

// ---- WIZARD STATE ----
var wizardStep = 1;
var TOTAL_STEPS = 7;
var wizardData = {};

// ---- STEP DEFINITIONS ----
var steps = [
  { id: 1, title: 'Personal Information', subtitle: 'Basic details about you',
    aiIntro: "Let's start with your personal information. Make sure your name matches your passport exactly.",
    aiTips: ['Your name must match your passport exactly, including middle names.', 'Passport must be valid for at least 6 months beyond your intended stay.'],
    fields: [
      { id: 'fullName', label: 'Full Legal Name', type: 'text', ph: 'As shown on your passport', req: true, tip: 'Must match your passport exactly, including middle names.' },
      { id: 'dob', label: 'Date of Birth', type: 'date', req: true, tip: 'Must match your passport date of birth exactly.' },
      { id: 'nationality', label: 'Nationality', type: 'select', opts: ['Select...','Brazilian','Chinese','Colombian','Indian','Indonesian','Japanese','Mexican','Nigerian','Pakistani','South Korean','Vietnamese','Other'], req: true },
      { id: 'passportNum', label: 'Passport Number', type: 'text', ph: 'e.g. AB1234567', req: true, tip: 'Double-check every character. Errors cause visa rejection.' },
      { id: 'passportExpiry', label: 'Passport Expiry Date', type: 'date', req: true },
      { id: 'currentCountry', label: 'Country of Current Residence', type: 'select', opts: ['Select...','Australia','Brazil','China','Colombia','India','Indonesia','Japan','Mexico','Nigeria','Pakistan','South Korea','Vietnam','Other'], req: true },
      { id: 'destination', label: 'Destination Country', type: 'select', opts: ['Select...','Australia','Canada','United Kingdom','United States'], req: true, tip: 'Visa requirements differ significantly by destination.' }
    ]
  },
  { id: 2, title: 'Education Background', subtitle: 'Your academic history and intended study',
    aiIntro: 'Immigration officers carefully review your education background. Being thorough significantly increases approval chances.',
    aiTips: ['Your study motivation is one of the most important parts of your application.', 'Be specific about how your proposed course connects to your career. Vague answers reduce approval chances.'],
    fields: [
      { id: 'highestQual', label: 'Highest Qualification Completed', type: 'select', opts: ['Select...','High School / Secondary','Diploma / Certificate',"Bachelor's Degree",'Graduate Certificate',"Master's Degree",'PhD / Doctorate'], req: true },
      { id: 'institutionName', label: 'Last Institution Attended', type: 'text', ph: 'e.g. University of Sao Paulo', req: true, tip: 'Use the official English name if available.' },
      { id: 'graduationYear', label: 'Year of Graduation', type: 'select', opts: ['Select...','2024','2023','2022','2021','2020','2019','2018','2017','2016','Earlier'], req: true },
      { id: 'gpa', label: 'GPA / Grade Average', type: 'text', ph: 'e.g. 3.8/4.0 or 85%', tip: 'Include both your score and the scale, e.g. 3.8/4.0.' },
      { id: 'proposedCourse', label: 'Proposed Course of Study', type: 'text', ph: 'e.g. Master of Information Technology', req: true, tip: 'Use the full course name as it appears in your offer letter.' },
      { id: 'proposedInstitution', label: 'Proposed Institution', type: 'text', ph: 'e.g. University of Melbourne', req: true },
      { id: 'courseStartDate', label: 'Proposed Course Start Date', type: 'date', req: true },
      { id: 'coeNumber', label: 'COE / Offer Letter Number', type: 'text', ph: 'e.g. COE-2026-1234567', tip: 'If you have your Confirmation of Enrolment, enter it here.' },
      { id: 'studyMotivation', label: 'Why did you choose this course and institution?', type: 'textarea', ph: 'Describe how this course relates to your qualifications and career goals...', req: true, tip: 'Be specific about how this course connects to your career goals. This is critical for Genuine Student assessment.' }
    ]
  },
  { id: 3, title: 'Financial Capacity', subtitle: 'Proof of funds for your studies',
    aiIntro: 'Financial evidence is one of the top reasons visa applications are refused. I will help you make sure you have everything covered.',
    aiTips: ['Show consistent bank balances over at least 3-6 months.', 'If family is sponsoring you, their financial documents must be comprehensive: bank statements, payslips, tax returns.'],
    fields: [
      { id: 'fundingSource', label: 'Primary Source of Funding', type: 'select', opts: ['Select...','Personal savings','Family support (parents/relatives)','Scholarship','Employer sponsorship','Government scholarship','Combination of sources'], req: true, tip: 'If funded by family, you need their bank statements and a signed statutory declaration.' },
      { id: 'totalFunds', label: 'Total Available Funds (AUD/CAD/GBP/USD)', type: 'text', ph: 'e.g. 45000', req: true, tip: 'For an Australian student visa show AUD 21,000+ per year for living plus tuition.' },
      { id: 'bankName', label: 'Primary Bank Name', type: 'text', ph: 'e.g. HDFC Bank, Bank of China', req: true },
      { id: 'fundsAvailableMonths', label: 'How long have these funds been in your account?', type: 'select', opts: ['Select...','Less than 1 month','1-3 months','3-6 months','More than 6 months'], req: true, tip: 'Funds held less than 3 months raise red flags. Be prepared to explain the source.' },
      { id: 'scholarship', label: 'Do you have a scholarship?', type: 'select', opts: ['No','Yes - partial scholarship','Yes - full scholarship'], tip: 'A scholarship significantly strengthens your application.' },
      { id: 'scholarshipDetails', label: 'Scholarship Details (if applicable)', type: 'textarea', ph: 'Name of scholarship, awarding body, amount covered...' },
      { id: 'financialStatement', label: 'Describe your overall financial situation', type: 'textarea', ph: 'e.g. My parents are funding my studies. My father is a senior engineer with annual salary of USD 80,000...', req: true, tip: 'Vague statements like "my family will support me" are weak. Name the supporter, occupation, and income.' }
    ]
  },
  { id: 4, title: 'Health Requirements', subtitle: 'Health examination and insurance',
    aiIntro: 'Most student visas require a health examination and Overseas Student Health Cover (OSHC). Let me guide you through what is needed.',
    aiTips: ['Book your health exam as soon as possible - popular panel physicians have 3-4 week wait times.', 'Make sure your OSHC covers your entire visa period, not just your course duration.'],
    fields: [
      { id: 'healthExam', label: 'Have you completed a health examination?', type: 'select', opts: ['Not yet','Scheduled - upcoming appointment','Completed - awaiting results','Completed - results received'], req: true, tip: 'Health exams must be done at an approved panel physician. Book early - it can take 2-4 weeks.' },
      { id: 'healthExamDate', label: 'Date of Health Examination (if completed/scheduled)', type: 'date' },
      { id: 'panelPhysician', label: 'Name of Panel Physician / Clinic', type: 'text', ph: 'e.g. Panel Physician Associates, Mumbai', tip: 'Only exams at an officially approved panel physician are accepted.' },
      { id: 'healthConditions', label: 'Do you have any significant health conditions?', type: 'select', opts: ['No - no significant conditions','Yes - managed chronic condition','Yes - previous surgery or hospitalisation','Prefer not to disclose here'], tip: 'Certain conditions require additional review but do not automatically cause refusal. Honesty is essential.' },
      { id: 'healthInsurance', label: 'Overseas Student Health Cover (OSHC)', type: 'select', opts: ['Not yet purchased','Currently researching providers','Purchased - policy number available','Covered by scholarship'], req: true, tip: 'OSHC is mandatory for Australian student visas. Major providers: Bupa, Medibank, NIB, Allianz Care.' },
      { id: 'oshcProvider', label: 'OSHC Provider (if purchased)', type: 'text', ph: 'e.g. Bupa, Medibank, NIB, Allianz Care' },
      { id: 'oshcPolicyNumber', label: 'OSHC Policy Number (if available)', type: 'text', ph: 'e.g. BUPA-2026-XXXXXXX' },
      { id: 'oshcCoverage', label: 'OSHC Coverage Period', type: 'text', ph: 'e.g. 01 Jul 2026 - 30 Jun 2028', tip: 'Health cover must cover the full duration of your visa.' }
    ]
  },
  { id: 5, title: 'Character & Background', subtitle: 'Criminal history and travel background',
    aiIntro: 'Character requirements are strict but most applicants pass easily. I will guide you through the declarations accurately.',
    aiTips: ['Always declare previous visa refusals, even if minor. Non-disclosure is more damaging than the refusal itself.', 'A good travel history to developed countries can strengthen your case.'],
    fields: [
      { id: 'criminalRecord', label: 'Have you ever been convicted of a criminal offence?', type: 'select', opts: ['No','Yes - minor offence (e.g. traffic)','Yes - serious offence'], req: true, tip: 'Failure to disclose a criminal record is grounds for automatic visa cancellation, even if the offence would not have prevented the visa.' },
      { id: 'criminalDetails', label: 'If yes, describe the offence and outcome', type: 'textarea', ph: 'Include the nature of the offence, year, jurisdiction, and sentence/outcome...' },
      { id: 'policeClearance', label: 'Police Clearance Certificate', type: 'select', opts: ['Not yet obtained','Application submitted','Obtained - within last 12 months','Obtained - older than 12 months'], tip: 'Most countries require police clearance from every country you have lived in for more than 12 months in the last 10 years.' },
      { id: 'previousVisaRefusal', label: 'Have you ever had a visa refused or cancelled?', type: 'select', opts: ['No','Yes - student visa','Yes - other visa type','Yes - multiple refusals'], req: true, tip: 'Previous refusals do not automatically prevent a new application, but must be declared.' },
      { id: 'refusalDetails', label: 'If yes, provide details of the refusal/cancellation', type: 'textarea', ph: 'Country, visa type, year, and reason given...' },
      { id: 'previousVisit', label: 'Have you previously visited your destination country?', type: 'select', opts: ['No, first time','Yes - as a tourist','Yes - as a student','Yes - as a worker','Yes - multiple times'] },
      { id: 'deportationHistory', label: 'Have you ever been deported or removed from any country?', type: 'select', opts: ['No','Yes'], req: true, tip: 'Deportation history is a serious factor. If yes, legal advice is strongly recommended.' },
      { id: 'travelHistory', label: 'List countries visited in the last 5 years', type: 'textarea', ph: 'e.g. Thailand (2024, holiday), USA (2023, conference)...', tip: 'Extensive travel history to similar countries strengthens your genuine temporary entrant case.' }
    ]
  },
  { id: 6, title: 'Genuine Student Intent', subtitle: 'Demonstrate genuine study and temporary stay intention',
    aiIntro: 'This is the most important section. Immigration officers assess whether you genuinely intend to study and temporarily stay. Let me help you give the strongest possible answers.',
    aiTips: ['Specific, concrete answers score significantly higher than general statements.', 'Strong ties to home (family, property, job offer) are essential evidence that you intend to return.'],
    fields: [
      { id: 'careerGoal', label: 'What is your long-term career goal?', type: 'textarea', ph: 'Describe your career ambitions and how the proposed study fits into your plan...', req: true, tip: 'Be specific and realistic. Officers look for a clear, logical connection between your background, this course, and your career goals.' },
      { id: 'whyDestination', label: 'Why have you chosen to study in this specific country?', type: 'textarea', ph: 'Discuss quality of education, specific faculty, research opportunities, industry connections...', req: true, tip: 'Generic answers are weak. Mention specific things: faculty research, industry partnerships, global rankings, or unique course content.' },
      { id: 'tiesHomeCountry', label: 'What ties do you have to your home country?', type: 'textarea', ph: 'e.g. Family members, property ownership, job offer upon return, business interests...', req: true, tip: 'The more specific the better. Name family members, describe property, or outline the job offer waiting for you.' },
      { id: 'employmentHistory', label: 'Describe your employment history (last 5 years)', type: 'textarea', ph: 'Job title, employer, industry, dates of employment...', tip: 'Employment history that aligns with your proposed study strengthens your genuine student case.' },
      { id: 'englishProficiency', label: 'English Language Proficiency', type: 'select', opts: ['Select...','Native English speaker','IELTS - score available','TOEFL - score available','PTE - score available','Exempt (prior education in English)','Not yet tested'], req: true, tip: 'Most institutions require IELTS 6.0+ overall. Check your institution requirements.' },
      { id: 'englishScore', label: 'English Test Score (if available)', type: 'text', ph: 'e.g. IELTS Overall 7.0 (L:7.5 R:7.0 W:6.5 S:7.0)', tip: 'Include individual band scores. Weak writing or speaking bands can affect your application.' },
      { id: 'postStudyPlans', label: 'What are your plans after completing your studies?', type: 'textarea', ph: 'e.g. Return home, apply skills to current employer, contribute to family business...', req: true, tip: 'Clearly state your intention to return home. Mentioning a specific job offer or opportunity makes this much stronger.' },
      { id: 'additionalInfo', label: 'Is there anything else you would like immigration to know?', type: 'textarea', ph: 'Any additional context that supports your application...' }
    ]
  },
  { id: 7, title: 'Review & Submit', subtitle: 'Review your application before submitting', isReview: true,
    aiIntro: 'Almost there! Review everything carefully before submitting. Click any section to go back and edit.',
    aiTips: ['Once submitted, your Lexis advisor will review within 24 hours.', 'Check that all required fields are completed and answers are detailed.']
  }
];

// AI chat responses
var aiChatKnowledge = {
  'oshc': 'OSHC (Overseas Student Health Cover) is mandatory for Australian student visas. It must be purchased before your visa is granted and cover your full stay. Major providers: Bupa, Medibank, NIB, Allianz Care.',
  'health': 'Health exams must be done at an approved panel physician. Results are sent directly to immigration. You do not need to submit them separately.',
  'coe': 'A COE (Confirmation of Enrolment) is an official document from your institution confirming enrolment. Required for an Australian student visa.',
  'ielts': 'Most Australian universities require IELTS 6.0-7.0 overall. Ensure no individual band falls below 5.5-6.0.',
  'funds': 'For an Australian student visa show: tuition fees + approx. AUD 21,041/year for living + travel costs. Funds should ideally be held for 3-6 months.',
  'genuine': 'The Genuine Student test evaluates: your study motivation, ties to home country, immigration history, and whether the course aligns with your career goals.',
  'refusal': 'A previous refusal does not automatically prevent a new application. You must declare it and explain what has changed in your circumstances.',
  'timeline': 'Australian student visa processing typically takes 4-6 weeks. Apply well in advance of your course start date.',
  'documents': 'Key documents: passport, COE, OSHC, financial evidence, English test results, academic transcripts, police clearance, health exam results.'
};
function getAIChatResponse(msg) {
  var m = msg.toLowerCase();
  var keys = Object.keys(aiChatKnowledge);
  for (var i = 0; i < keys.length; i++) {
    if (m.indexOf(keys[i]) >= 0) return aiChatKnowledge[keys[i]];
  }
  if (m.indexOf('help') >= 0 || m.indexOf('what') >= 0) return 'I can help with: OSHC, health exams, COE, IELTS, financial requirements, genuine student test, previous refusals, visa timelines, and required documents.';
  if (m.indexOf('thank') >= 0) return 'You are welcome! Feel free to ask anything else.';
  return 'Great question! Your Lexis advisor will provide personalised advice. I can help with OSHC, financial requirements, health exams, and the genuine student test.';
}

// ---- WIZARD INIT ----
function initWizard() { wizardStep = 1; renderStep(1); updateProgress(); }

function renderField(f) {
  var val = wizardData[f.id] || '';
  var req = f.req ? '<span class="req-star">*</span>' : '';
  var tip = f.tip ? '<div class="field-ai-tip">&#129302; ' + f.tip + '</div>' : '';
  if (f.type === 'select') {
    var opts = f.opts.map(function(o) { return '<option value="' + o + '"' + (val === o ? ' selected' : '') + '>' + o + '</option>'; }).join('');
    return '<div class="form-group">' + tip + '<label>' + f.label + ' ' + req + '</label><select id="f_' + f.id + '">' + opts + '</select></div>';
  }
  if (f.type === 'textarea') {
    return '<div class="form-group">' + tip + '<label>' + f.label + ' ' + req + '</label><textarea id="f_' + f.id + '" placeholder="' + (f.ph||'') + '" rows="4">' + val + '</textarea></div>';
  }
  return '<div class="form-group">' + tip + '<label>' + f.label + ' ' + req + '</label><input type="' + f.type + '" id="f_' + f.id + '" placeholder="' + (f.ph||'') + '" value="' + val + '"></div>';
}

function renderStep(stepNum) {
  var step = steps[stepNum - 1];
  var area = document.getElementById('wizard-form-area');
  if (step.isReview) {
    area.innerHTML = renderReview();
  } else {
    var fieldsHTML = step.fields.map(renderField).join('');
    area.innerHTML = '<div class="step-content"><h2 class="step-title">' + step.title + '</h2><p class="step-subtitle">' + step.subtitle + '</p><div class="step-fields">' + fieldsHTML + '</div></div>';
    step.fields.forEach(function(f) {
      var el = document.getElementById('f_' + f.id);
      if (el && wizardData[f.id] !== undefined) el.value = wizardData[f.id];
      if (el) {
        el.addEventListener('input', function() { wizardData[f.id] = el.value; if (f.tip) showFieldTip(f); autoSave(); });
        el.addEventListener('change', function() { wizardData[f.id] = el.value; if (f.tip) showFieldTip(f); });
      }
    });
  }
  var msgs = document.getElementById('ai-messages');
  msgs.innerHTML = '<div class="ai-message ai-welcome"><strong>Step ' + stepNum + ':</strong> ' + step.aiIntro + '</div>';
  if (step.aiTips) step.aiTips.forEach(function(t) { msgs.innerHTML += '<div class="ai-message ai-tip">&#128161; ' + t + '</div>'; });
  document.getElementById('btn-back').style.display = stepNum > 1 ? '' : 'none';
  document.getElementById('btn-next').textContent = stepNum === TOTAL_STEPS ? 'Submit Application' : 'Next';
  updateStepCircles(stepNum);
}

function showFieldTip(f) {
  var msgs = document.getElementById('ai-messages');
  var ex = msgs.querySelector('.ai-field-tip');
  if (ex) ex.remove();
  var tip = document.createElement('div');
  tip.className = 'ai-message ai-field-tip';
  tip.innerHTML = '&#128172; <strong>' + f.label + ':</strong> ' + f.tip;
  msgs.appendChild(tip);
  msgs.scrollTop = msgs.scrollHeight;
}

function getAnswerStrength(f, val) {
  if (!val || (f.type === 'textarea' && val.length < 20)) return { cls: 'strength-weak', badge: '<span class="strength-badge weak">Strengthen</span>' };
  if (f.type === 'textarea' && val.length > 150) return { cls: 'strength-strong', badge: '<span class="strength-badge strong">Strong</span>' };
  return { cls: 'strength-ok', badge: '<span class="strength-badge ok">OK</span>' };
}

function renderReview() {
  var html = '<div class="step-content"><h2 class="step-title">Review Your Application</h2><p class="step-subtitle">Check all details before submitting. Click any section header to edit.</p>';
  steps.slice(0, 6).forEach(function(s) {
    html += '<div class="review-section"><div class="review-section-header" onclick="goToStep(' + s.id + ')">' + s.title + ' <span class="edit-link">Edit &#9999;</span></div>';
    s.fields.forEach(function(f) {
      var val = wizardData[f.id];
      if (val && val !== 'Select...') {
        var st = getAnswerStrength(f, val);
        html += '<div class="review-row"><div class="review-label">' + f.label + '</div><div class="review-value ' + st.cls + '">' + val + ' ' + st.badge + '</div></div>';
      }
    });
    html += '</div>';
  });
  html += '<div class="submit-declaration"><h3>Declaration</h3><p>I declare that the information provided is true, correct and complete. I understand that providing false or misleading information may result in visa refusal.</p><label class="checkbox-label"><input type="checkbox" id="declarationCheck"> I confirm all information is true and accurate to the best of my knowledge.</label></div></div>';
  return html;
}

function goToStep(n) { wizardStep = n; renderStep(n); updateProgress(); }

function wizardNext() {
  if (wizardStep === TOTAL_STEPS) {
    var check = document.getElementById('declarationCheck');
    if (!check || !check.checked) { alert('Please check the declaration box before submitting.'); return; }
    submitApplication(); return;
  }
  saveCurrentStep(); wizardStep++; renderStep(wizardStep); updateProgress();
  var body = document.querySelector('.wizard-body'); if (body) body.scrollTop = 0;
}
function wizardBack() {
  if (wizardStep <= 1) return;
  saveCurrentStep(); wizardStep--; renderStep(wizardStep); updateProgress();
}
function saveCurrentStep() {
  var step = steps[wizardStep - 1];
  if (!step.fields) return;
  step.fields.forEach(function(f) { var el = document.getElementById('f_' + f.id); if (el) wizardData[f.id] = el.value; });
}
function autoSave() {
  var s = document.getElementById('save-status');
  if (s) { s.textContent = 'Saving...'; setTimeout(function() { s.textContent = 'Auto-saved'; }, 800); }
}
function updateProgress() {
  var pct = ((wizardStep - 1) / (TOTAL_STEPS - 1)) * 100;
  document.getElementById('wizard-progress-fill').style.width = pct + '%';
}
function updateStepCircles(current) {
  for (var i = 1; i <= TOTAL_STEPS; i++) {
    var circ = document.getElementById('wcirc-' + i);
    var conn = document.getElementById('wconn-' + i);
    if (!circ) continue;
    if (i < current) { circ.className = 'step-circle completed'; circ.textContent = 'v'; }
    else if (i === current) { circ.className = 'step-circle active'; circ.textContent = i; }
    else { circ.className = 'step-circle'; circ.textContent = i; }
    if (conn) conn.classList.toggle('filled', i < current);
  }
}
function submitApplication() {
  var area = document.getElementById('wizard-form-area');
  area.innerHTML = '<div class="step-content success-screen"><div class="success-icon">&#10003;</div><h2>Application Submitted!</h2><p>Your application has been submitted to your Lexis advisor. You will receive a confirmation email and your advisor will review within <strong>24 hours</strong>.</p><div class="next-steps"><h3>What happens next?</h3><div class="next-step-item">&#128231; Confirmation email sent to your registered address</div><div class="next-step-item">&#128100; Advisor review within 24 business hours</div><div class="next-step-item">&#128203; Document checklist will be provided</div><div class="next-step-item">&#127963; Application lodged with immigration authority</div></div><button class="btn-primary" onclick="hideStudentView()">Return to Dashboard</button></div>';
  document.getElementById('btn-next').style.display = 'none';
  document.getElementById('btn-back').style.display = 'none';
  var msgs = document.getElementById('ai-messages');
  msgs.innerHTML = '<div class="ai-message ai-welcome"><strong>Congratulations!</strong> Your application has been submitted. Your Lexis advisor will be in touch within 24 hours to guide you through the next steps.</div>';
}
function sendAIChat() {
  var input = document.getElementById('ai-chat-input');
  var msg = input.value.trim();
  if (!msg) return;
  var msgs = document.getElementById('ai-messages');
  msgs.innerHTML += '<div class="ai-message ai-user">You: ' + msg + '</div>';
  var resp = getAIChatResponse(msg);
  setTimeout(function() { msgs.innerHTML += '<div class="ai-message ai-bot">&#129302; ' + resp + '</div>'; msgs.scrollTop = msgs.scrollHeight; }, 500);
  input.value = ''; msgs.scrollTop = msgs.scrollHeight;
}
document.addEventListener('DOMContentLoaded', function() {
  navigate('dashboard');
  var today = new Date(); var from = new Date(today); from.setDate(from.getDate() - 5);
  var df = document.getElementById('dateFrom'); var dt = document.getElementById('dateTo');
  if (df) df.valueAsDate = from; if (dt) dt.valueAsDate = today;
  initChart();
});
