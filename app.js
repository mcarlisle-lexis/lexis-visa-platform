// ============================================================
// LEXIS VISA PLATFORM - app.js
// Admin dashboard + 7-step student immigration wizard with AI
// ============================================================

// ---- ADMIN NAVIGATION ----
let currentPage = 'dashboard';

function navigate(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
  const target = document.getElementById('page-' + page);
  if (target) target.classList.add('active');
  const navEl = document.getElementById('nav-' + page);
  if (navEl) navEl.classList.add('active');
  if (page === 'dashboard') initChart();
  currentPage = page;
}

function resetFilters() {}
function refreshDashboard() { initChart(); }

function initChart() {
  const ctx = document.getElementById('trendChart');
  if (!ctx) return;
  if (ctx._chartInstance) ctx._chartInstance.destroy();
  ctx._chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Jan','Feb','Mar','Apr','May','Jun'],
      datasets: [{
        label: 'Active Students',
        data: [4,6,8,7,11,12],
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99,102,241,0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#6366f1'
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, grid: { color: '#f3f4f6' } }, x: { grid: { display: false } } }
    }
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

function sendInvite() {
  alert('Invitation sent successfully!');
  navigate('students');
}

function switchConfigTab(tab) {
  document.querySelectorAll('.config-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.config-tab').forEach(t => t.classList.remove('active'));
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
let wizardStep = 1;
const TOTAL_STEPS = 7;
const wizardData = {};

// ---- WIZARD STEP DEFINITIONS ----
const steps = [
  {
    id: 1,
    title: 'Personal Information',
    subtitle: 'Basic details about you',
    aiIntro: "Let's start with your personal information. Make sure your name matches exactly as it appears on your passport.",
    fields: [
      { id: 'fullName', label: 'Full Legal Name', type: 'text', placeholder: 'As shown on your passport', required: true, aiTip: 'Your name must match your passport exactly — including middle names.' },
      { id: 'dob', label: 'Date of Birth', type: 'date', required: true, aiTip: 'Ensure this matches your passport date of birth exactly.' },
      { id: 'nationality', label: 'Nationality / Citizenship', type: 'select', options: ['Select...','Australian','Brazilian','Chinese','Colombian','Indian','Indonesian','Japanese','Mexican','Nigerian','Pakistani','South Korean','Vietnamese','Other'], required: true, aiTip: 'Select the country of your primary citizenship.' },
      { id: 'passportNum', label: 'Passport Number', type: 'text', placeholder: 'e.g. AB1234567', required: true, aiTip: 'Double-check every character — passport number errors cause visa rejection.' },
      { id: 'passportExpiry', label: 'Passport Expiry Date', type: 'date', required: true, aiTip: 'Your passport must be valid for at least 6 months beyond your intended stay.' },
      { id: 'currentCountry', label: 'Country of Current Residence', type: 'select', options: ['Select...','Australia','Brazil','China','Colombia','India','Indonesia','Japan','Mexico','Nigeria','Pakistan','South Korea','Vietnam','Other'], required: true },
      { id: 'destination', label: 'Destination Country', type: 'select', options: ['Select...','Australia','Canada','United Kingdom','United States'], required: true, aiTip: 'The visa requirements differ significantly by destination. Make sure you've chosen the right one.' }
    ]
  },
  {
    id: 2,
    title: 'Education Background',
    subtitle: 'Your academic history and intended study',
    aiIntro: "Immigration officers carefully review your education background. Being thorough here significantly increases your approval chances.",
    fields: [
      { id: 'highestQual', label: 'Highest Qualification Completed', type: 'select', options: ['Select...','High School / Secondary','Diploma / Certificate','Bachelor's Degree','Graduate Certificate','Master's Degree','PhD / Doctorate'], required: true },
      { id: 'institutionName', label: 'Name of Last Institution Attended', type: 'text', placeholder: 'e.g. University of São Paulo', required: true, aiTip: 'Use the official English name of your institution if available.' },
      { id: 'graduationYear', label: 'Year of Graduation', type: 'select', options: ['Select...','2024','2023','2022','2021','2020','2019','2018','2017','2016','2015','Earlier'], required: true },
      { id: 'gpa', label: 'GPA / Grade Average', type: 'text', placeholder: 'e.g. 3.8/4.0 or 85%', aiTip: 'A strong academic record improves your genuine student assessment. Include both your score and the scale.' },
      { id: 'proposedCourse', label: 'Proposed Course of Study', type: 'text', placeholder: 'e.g. Master of Information Technology', required: true, aiTip: 'Be specific — include the full course name as it appears in your offer letter.' },
      { id: 'proposedInstitution', label: 'Proposed Institution', type: 'text', placeholder: 'e.g. University of Melbourne', required: true },
      { id: 'courseStartDate', label: 'Proposed Course Start Date', type: 'date', required: true },
      { id: 'coeNumber', label: 'COE / Offer Letter Number (if available)', type: 'text', placeholder: 'e.g. COE-2026-1234567', aiTip: 'If you have received your Confirmation of Enrolment, enter it here. This speeds up processing.' },
      { id: 'studyMotivation', label: 'Why did you choose this course and institution?', type: 'textarea', placeholder: 'Describe how this course relates to your current qualifications and future career goals...', required: true, aiTip: 'This is critical for your Genuine Student assessment. Be specific about how this course connects to your career goals.' }
    ]
  },
  {
    id: 3,
    title: 'Financial Capacity',
    subtitle: 'Proof of funds for your studies',
    aiIntro: "Financial evidence is one of the top reasons visa applications are refused. I'll help you make sure you have everything covered.",
    fields: [
      { id: 'fundingSource', label: 'Primary Source of Funding', type: 'select', options: ['Select...','Personal savings','Family support (parents/relatives)','Scholarship','Employer sponsorship','Government scholarship','Combination of sources'], required: true, aiTip: 'If funded by family, you will need to provide their bank statements and a signed statutory declaration.' },
      { id: 'totalFunds', label: 'Total Available Funds (AUD / CAD / GBP / USD)', type: 'text', placeholder: 'e.g. 45000', required: true, aiTip: 'For a 2-year Australian student visa you typically need to show ~AUD 21,000+ per year plus tuition. Check destination requirements.' },
      { id: 'bankName', label: 'Primary Bank Name', type: 'text', placeholder: 'e.g. HDFC Bank, Bank of China', required: true },
      { id: 'fundsAvailableMonths', label: 'How long have these funds been in your account?', type: 'select', options: ['Select...','Less than 1 month','1–3 months','3–6 months','More than 6 months'], required: true, aiTip: 'Funds held for less than 3 months raise red flags. If recent, be prepared to explain the source.' },
      { id: 'scholarship', label: 'Do you have a scholarship?', type: 'select', options: ['No','Yes – partial scholarship','Yes – full scholarship'], aiTip: 'A scholarship significantly strengthens your application. Include your scholarship award letter in your documents.' },
      { id: 'scholarshipDetails', label: 'Scholarship Details (if applicable)', type: 'textarea', placeholder: 'Name of scholarship, awarding body, amount covered...', aiTip: 'Include the official name of the scholarship program and the amount awarded per year.' },
      { id: 'additionalIncome', label: 'Do you have any additional income sources?', type: 'select', options: ['No','Yes – employment income','Yes – rental income','Yes – investment income','Yes – other'] },
      { id: 'financialStatement', label: 'Describe your overall financial situation briefly', type: 'textarea', placeholder: 'e.g. My parents are funding my studies. My father is a senior engineer at XYZ Corp with an annual salary of USD 80,000...', required: true, aiTip: 'Be honest and detailed. Vague statements like "my family will support me" are weak. Name the supporter, their occupation, and income.' }
    ]
  },
  {
    id: 4,
    title: 'Health Requirements',
    subtitle: 'Health examination and insurance',
    aiIntro: "Most student visas require a health examination and Overseas Student Health Cover (OSHC). Let me guide you through what's needed.",
    fields: [
      { id: 'healthExam', label: 'Have you completed a health examination?', type: 'select', options: ['Not yet','Scheduled – upcoming appointment','Completed – awaiting results','Completed – results received'], required: true, aiTip: 'Health exams must be done at an approved panel physician. Book as early as possible as it can take 2–4 weeks.' },
      { id: 'healthExamDate', label: 'Date of Health Examination (if completed/scheduled)', type: 'date' },
      { id: 'panelPhysician', label: 'Name of Panel Physician / Clinic', type: 'text', placeholder: 'e.g. Panel Physician Associates, Mumbai', aiTip: 'Only exams done at an officially approved panel physician are accepted by immigration.' },
      { id: 'healthConditions', label: 'Do you have any significant health conditions?', type: 'select', options: ['No – no significant conditions','Yes – managed chronic condition','Yes – previous surgery or hospitalisation','Prefer not to disclose here'], aiTip: 'Certain health conditions may require additional review but do not automatically cause refusal. Honesty is essential.' },
      { id: 'healthInsurance', label: 'Overseas Student Health Cover (OSHC) / Insurance', type: 'select', options: ['Not yet purchased','Currently researching providers','Purchased – policy number available','Covered by scholarship'], required: true, aiTip: 'OSHC is mandatory for Australian student visas and must be purchased before visa grant. Major providers include Bupa, Medibank, NIB, and Allianz Care.' },
      { id: 'oshcProvider', label: 'OSHC Provider (if purchased)', type: 'text', placeholder: 'e.g. Bupa, Medibank, NIB, Allianz Care' },
      { id: 'oshcPolicyNumber', label: 'OSHC Policy Number (if available)', type: 'text', placeholder: 'e.g. BUPA-2026-XXXXXXX' },
      { id: 'oshcCoverage', label: 'OSHC Coverage Period', type: 'text', placeholder: 'e.g. 01 Jul 2026 – 30 Jun 2028', aiTip: 'Your health cover must cover the full duration of your visa, including any pre-departure period if required.' }
    ]
  },
  {
    id: 5,
    title: 'Character & Background',
    subtitle: 'Criminal history and travel background',
    aiIntro: "Character requirements are strict but most applicants pass easily. I'll guide you through the declarations accurately.",
    fields: [
      { id: 'criminalRecord', label: 'Have you ever been convicted of a criminal offence?', type: 'select', options: ['No','Yes – minor offence (e.g. traffic)','Yes – serious offence'], required: true, aiTip: 'Failure to disclose a criminal record when asked is grounds for automatic visa cancellation, even if the offence itself wouldn't have prevented the visa.' },
      { id: 'criminalDetails', label: 'If yes, please describe the offence and outcome', type: 'textarea', placeholder: 'Include the nature of the offence, year, jurisdiction, and sentence/outcome...' },
      { id: 'policeClearance', label: 'Police Clearance Certificate', type: 'select', options: ['Not yet obtained','Application submitted','Obtained – within last 12 months','Obtained – older than 12 months'], aiTip: 'Most countries require a police clearance from every country you've lived in for more than 12 months in the last 10 years.' },
      { id: 'previousVisaRefusal', label: 'Have you ever had a visa refused or cancelled?', type: 'select', options: ['No','Yes – student visa','Yes – other visa type','Yes – multiple refusals'], required: true, aiTip: 'Previous refusals don't automatically prevent a new application, but must be declared. Explain what has changed.' },
      { id: 'refusalDetails', label: 'If yes, provide details of the refusal/cancellation', type: 'textarea', placeholder: 'Which country, which visa type, the year, and the reason given...' },
      { id: 'previousVisitDestination', label: 'Have you previously visited your destination country?', type: 'select', options: ['No, first time','Yes – as a tourist','Yes – as a student','Yes – as a worker','Yes – multiple times'] },
      { id: 'deportationHistory', label: 'Have you ever been deported or removed from any country?', type: 'select', options: ['No','Yes'], required: true, aiTip: 'Deportation history is a serious factor. If yes, you must provide full details and legal advice is strongly recommended.' },
      { id: 'travelHistory', label: 'List countries visited in the last 5 years', type: 'textarea', placeholder: 'e.g. Thailand (2024, holiday), USA (2023, conference), Japan (2022, holiday)...', aiTip: 'Extensive travel history, especially to similar destination countries, strengthens your genuine temporary entrant case.' }
    ]
  },
  {
    id: 6,
    title: 'Genuine Student Intent',
    subtitle: 'Demonstrate genuine study and temporary stay intention',
    aiIntro: "This is the most important section for student visa success. Immigration officers assess whether you genuinely intend to study and temporarily stay. Let me help you give the strongest possible answers.",
    fields: [
      { id: 'careerGoal', label: 'What is your long-term career goal?', type: 'textarea', placeholder: 'Describe your career ambitions and how the proposed study fits into your plan...', required: true, aiTip: 'Be specific and realistic. Immigration officers are looking for a clear, logical connection between your background, this course, and your career goals.' },
      { id: 'whyDestination', label: 'Why have you chosen to study in this specific country?', type: 'textarea', placeholder: 'Discuss the quality of education, specific faculty, research opportunities, industry connections...', required: true, aiTip: 'Generic answers like "it's a great country" are weak. Mention specific things: faculty research, industry partnerships, global rankings, or course content not available at home.' },
      { id: 'tiesHomeCountry', label: 'What ties do you have to your home country?', type: 'textarea', placeholder: 'e.g. Family members, property ownership, job offer upon return, business interests, community roles...', required: true, aiTip: 'Strong ties to home (family, property, job offer) are essential evidence that you intend to return. The more specific, the better.' },
      { id: 'employmentHistory', label: 'Describe your employment history (last 5 years)', type: 'textarea', placeholder: 'Job title, employer, industry, dates of employment...', aiTip: 'Employment history that aligns with your proposed study strengthens your genuine student case. Gaps should be explained.' },
      { id: 'englishProficiency', label: 'English Language Proficiency', type: 'select', options: ['Select...','Native English speaker','IELTS – score available','TOEFL – score available','PTE – score available','Exempt (prior education in English)','Not yet tested'], required: true, aiTip: 'Most English-language institutions require IELTS 6.0+ overall (with no band below 5.5). Check your institution's specific requirements.' },
      { id: 'englishScore', label: 'English Test Score (if available)', type: 'text', placeholder: 'e.g. IELTS Overall 7.0 (L:7.5 R:7.0 W:6.5 S:7.0)', aiTip: 'Include your individual band scores, not just the overall score. Weak writing or speaking bands can affect your application.' },
      { id: 'postStudyPlans', label: 'What are your plans after completing your studies?', type: 'textarea', placeholder: 'e.g. Return to home country, apply for skills gained to current employer, contribute to family business...', required: true, aiTip: 'Clearly state your intention to return home. Mentioning a specific job offer, family business, or professional opportunity makes this much stronger.' },
      { id: 'additionalInfo', label: 'Is there anything else you would like immigration to know?', type: 'textarea', placeholder: 'Any additional context that supports your application...' }
    ]
  },
  {
    id: 7,
    title: 'Review & Submit',
    subtitle: 'Review your application before submitting',
    aiIntro: "Almost there! Let me show you a summary of your application. Review everything carefully before submitting.",
    isReview: true
  }
];

// AI tips per step
const aiStepMessages = {
  1: ["Make sure all names and dates match your passport exactly — even small differences cause delays.", "Passport validity is critical. Many countries require at least 6 months validity beyond your stay."],
  2: ["Your study motivation statement is one of the most important parts of your application.", "Be specific about how your proposed course connects to your career. Vague answers reduce approval chances."],
  3: ["Show consistent bank balances over at least 3–6 months.", "If family is sponsoring you, their financial documents must be comprehensive — bank statements, payslips, tax returns."],
  4: ["Book your health exam as soon as possible — popular panel physicians often have 3–4 week wait times.", "Make sure your OSHC covers your entire visa period, not just your course duration."],
  5: ["Always declare previous visa refusals, even if minor. Non-disclosure is more damaging than the refusal itself.", "A good travel history to developed countries can strengthen your case."],
  6: ["This section has the highest weighting in the genuine student assessment.", "Specific, concrete answers score significantly higher than general statements."],
  7: ["Review every section carefully. You can go back and edit anything before submitting.", "Once submitted, your assigned advisor will review your application within 24 hours."]
};

// AI chat responses
const aiChatKnowledge = {
  'oshc': 'OSHC (Overseas Student Health Cover) is mandatory for Australian student visas. It must be purchased before your visa is granted and must cover your full stay. Major providers: Bupa, Medibank, NIB, and Allianz Care.',
  'health': 'Health exams must be done at an approved panel physician. Results are sent directly to the immigration department. You do not need to submit them separately.',
  'coe': 'A COE (Confirmation of Enrolment) is an official document from your Australian institution confirming your enrolment. It is required for an Australian student visa application.',
  'ielts': 'Most Australian universities require IELTS 6.0–7.0 overall. Ensure no individual band falls below 5.5–6.0. Duolingo and TOEFL are also accepted by some institutions.',
  'funds': 'For an Australian student visa you need to show: tuition fees + approx. AUD 21,041/year for living costs + travel costs. Funds should ideally be held for 3–6 months.',
  'genuine': 'The Genuine Student test evaluates: your study motivation, ties to home country, immigration history, and whether the course aligns with your career goals.',
  'refusal': 'A previous refusal does not automatically prevent a new application. You must declare it and explain what has changed in your circumstances.',
  'timeline': 'Australian student visa processing typically takes 4–6 weeks but can vary. Apply well in advance of your course start date.',
  'documents': 'Key documents needed: passport, COE, OSHC, financial evidence, English test results, academic transcripts, police clearance, health exam results.',
};

function getAIChatResponse(msg) {
  const m = msg.toLowerCase();
  for (const [key, val] of Object.entries(aiChatKnowledge)) {
    if (m.includes(key)) return val;
  }
  if (m.includes('help') || m.includes('what')) return "I can help you with: OSHC, health exams, COE, IELTS scores, financial requirements, genuine student test, previous refusals, visa timelines, and required documents. What would you like to know?";
  if (m.includes('thank')) return "You're welcome! Feel free to ask anything else. I'm here to make your application as strong as possible.";
  return "Great question! For the most accurate guidance on your specific situation, your Lexis advisor will review your application and provide personalised advice. In the meantime, I can help with common questions about OSHC, financial requirements, health exams, and the genuine student test.";
}

// ---- WIZARD INIT ----
function initWizard() {
  wizardStep = 1;
  renderStep(1);
  updateProgress();
}

function renderStep(stepNum) {
  const step = steps[stepNum - 1];
  const area = document.getElementById('wizard-form-area');

  if (step.isReview) {
    area.innerHTML = renderReview();
  } else {
    let fieldsHTML = step.fields.map(f => renderField(f)).join('');
    area.innerHTML = `
      <div class="step-content">
        <h2 class="step-title">${step.title}</h2>
        <p class="step-subtitle">${step.subtitle}</p>
        <div class="step-fields">${fieldsHTML}</div>
      </div>
    `;
    // Restore saved values
    step.fields.forEach(f => {
      const el = document.getElementById('f_' + f.id);
      if (el && wizardData[f.id] !== undefined) el.value = wizardData[f.id];
      if (el) {
        el.addEventListener('input', () => {
          wizardData[f.id] = el.value;
          checkFieldAI(f, el.value);
          autoSave();
        });
        el.addEventListener('change', () => {
          wizardData[f.id] = el.value;
          checkFieldAI(f, el.value);
        });
      }
    });
  }

  // AI Panel update
  const msgs = document.getElementById('ai-messages');
  const step_obj = steps[stepNum - 1];
  msgs.innerHTML = `<div class="ai-message ai-welcome"><strong>Step ${stepNum}:</strong> ${step_obj.aiIntro}</div>`;
  const tips = aiStepMessages[stepNum] || [];
  tips.forEach(t => {
    msgs.innerHTML += `<div class="ai-message ai-tip">💡 ${t}</div>`;
  });

  // Navigation buttons
  document.getElementById('btn-back').style.display = stepNum > 1 ? '' : 'none';
  document.getElementById('btn-next').textContent = stepNum === TOTAL_STEPS ? '✓ Submit Application' : 'Next →';

  updateStepCircles(stepNum);
}

function renderField(f) {
  const val = wizardData[f.id] || '';
  const req = f.required ? '<span class="req-star">*</span>' : '';
  const tip = f.aiTip ? `<div class="field-ai-tip">🤖 ${f.aiTip}</div>` : '';

  if (f.type === 'select') {
    const opts = f.options.map(o => `<option value="${o}" ${val === o ? 'selected' : ''}>${o}</option>`).join('');
    return `<div class="form-group">${tip}<label>${f.label} ${req}</label><select id="f_${f.id}">${opts}</select></div>`;
  }
  if (f.type === 'textarea') {
    return `<div class="form-group">${tip}<label>${f.label} ${req}</label><textarea id="f_${f.id}" placeholder="${f.placeholder || ''}" rows="4">${val}</textarea></div>`;
  }
  return `<div class="form-group">${tip}<label>${f.label} ${req}</label><input type="${f.type}" id="f_${f.id}" placeholder="${f.placeholder || ''}" value="${val}"></div>`;
}

function renderReview() {
  const sections = steps.slice(0, 6);
  let html = '<div class="step-content"><h2 class="step-title">Review Your Application</h2><p class="step-subtitle">Check all details before submitting. Click any section to edit.</p>';

  sections.forEach(s => {
    html += `<div class="review-section"><div class="review-section-header" onclick="goToStep(${s.id})">${s.title} <span class="edit-link">Edit ✏️</span></div>`;
    s.fields.forEach(f => {
      const val = wizardData[f.id];
      if (val && val !== 'Select...' && val !== 'Select') {
        const strength = getAnswerStrength(f, val);
        html += `<div class="review-row">
          <div class="review-label">${f.label}</div>
          <div class="review-value ${strength.cls}">${val} ${strength.badge}</div>
        </div>`;
      }
    });
    html += '</div>';
  });

  html += `<div class="submit-declaration">
    <h3>Declaration</h3>
    <p>I declare that the information provided in this application is true, correct and complete. I understand that providing false or misleading information may result in visa refusal and/or being barred from future applications.</p>
    <label class="checkbox-label"><input type="checkbox" id="declarationCheck"> I confirm that all information provided is true and accurate to the best of my knowledge.</label>
  </div></div>`;
  return html;
}

function getAnswerStrength(field, value) {
  if (!value || value.length < 20 && field.type === 'textarea') {
    return { cls: 'strength-weak', badge: '<span class="strength-badge weak">⚠ Strengthen</span>' };
  }
  if (field.type === 'textarea' && value.length > 150) {
    return { cls: 'strength-strong', badge: '<span class="strength-badge strong">✓ Strong</span>' };
  }
  return { cls: 'strength-ok', badge: '<span class="strength-badge ok">✓ OK</span>' };
}

function checkFieldAI(field, value) {
  if (!field.aiTip) return;
  const msgs = document.getElementById('ai-messages');
  const existing = msgs.querySelector('.ai-field-tip');
  if (existing) existing.remove();
  if (value && value.length > 2) {
    const tip = document.createElement('div');
    tip.className = 'ai-message ai-field-tip';
    tip.innerHTML = `💬 <strong>${field.label}:</strong> ${field.aiTip}`;
    msgs.appendChild(tip);
    msgs.scrollTop = msgs.scrollHeight;
  }
}

function goToStep(n) {
  wizardStep = n;
  renderStep(n);
  updateProgress();
}

function wizardNext() {
  if (wizardStep === TOTAL_STEPS) {
    const check = document.getElementById('declarationCheck');
    if (!check || !check.checked) {
      alert('Please check the declaration box before submitting.');
      return;
    }
    submitApplication();
    return;
  }
  saveCurrentStep();
  wizardStep++;
  renderStep(wizardStep);
  updateProgress();
  document.querySelector('.wizard-body').scrollTop = 0;
}

function wizardBack() {
  if (wizardStep <= 1) return;
  saveCurrentStep();
  wizardStep--;
  renderStep(wizardStep);
  updateProgress();
}

function saveCurrentStep() {
  const step = steps[wizardStep - 1];
  if (!step.fields) return;
  step.fields.forEach(f => {
    const el = document.getElementById('f_' + f.id);
    if (el) wizardData[f.id] = el.value;
  });
}

function autoSave() {
  const s = document.getElementById('save-status');
  if (s) { s.textContent = '💾 Saving...'; setTimeout(() => { s.textContent = '✓ Auto-saved'; }, 800); }
}

function updateProgress() {
  const pct = ((wizardStep - 1) / (TOTAL_STEPS - 1)) * 100;
  document.getElementById('wizard-progress-fill').style.width = pct + '%';
}

function updateStepCircles(current) {
  for (let i = 1; i <= TOTAL_STEPS; i++) {
    const circ = document.getElementById('wcirc-' + i);
    const conn = document.getElementById('wconn-' + (i));
    if (!circ) continue;
    circ.className = 'step-circle';
    if (i < current) { circ.className = 'step-circle completed'; circ.textContent = '✓'; }
    else if (i === current) { circ.className = 'step-circle active'; circ.textContent = i; }
    else { circ.textContent = i; }
    if (conn && i < current) conn.classList.add('filled');
    else if (conn) conn.classList.remove('filled');
  }
}

function submitApplication() {
  const area = document.getElementById('wizard-form-area');
  area.innerHTML = `
    <div class="step-content success-screen">
      <div class="success-icon">✅</div>
      <h2>Application Submitted!</h2>
      <p>Your application has been submitted to your Lexis advisor. You will receive a confirmation email and your advisor will review your application within <strong>24 hours</strong>.</p>
      <div class="next-steps">
        <h3>What happens next?</h3>
        <div class="next-step-item">📧 Confirmation email sent to your registered address</div>
        <div class="next-step-item">👤 Advisor review within 24 business hours</div>
        <div class="next-step-item">📋 Document checklist will be provided</div>
        <div class="next-step-item">🏛️ Application lodged with immigration authority</div>
      </div>
      <button class="btn-primary" onclick="hideStudentView()">Return to Dashboard</button>
    </div>
  `;
  document.getElementById('btn-next').style.display = 'none';
  document.getElementById('btn-back').style.display = 'none';
  const msgs = document.getElementById('ai-messages');
  msgs.innerHTML = '<div class="ai-message ai-welcome"><strong>🎉 Congratulations!</strong> Your application has been submitted. Your Lexis advisor will be in touch within 24 hours to guide you through the next steps.</div>';
}

function sendAIChat() {
  const input = document.getElementById('ai-chat-input');
  const msg = input.value.trim();
  if (!msg) return;
  const msgs = document.getElementById('ai-messages');
  msgs.innerHTML += `<div class="ai-message ai-user">You: ${msg}</div>`;
  const resp = getAIChatResponse(msg);
  setTimeout(() => {
    msgs.innerHTML += `<div class="ai-message ai-bot">🤖 ${resp}</div>`;
    msgs.scrollTop = msgs.scrollHeight;
  }, 500);
  input.value = '';
  msgs.scrollTop = msgs.scrollHeight;
}

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  navigate('dashboard');
  // Date defaults
  const today = new Date();
  const from = new Date(today); from.setDate(from.getDate() - 5);
  const df = document.getElementById('dateFrom');
  const dt = document.getElementById('dateTo');
  if (df) df.valueAsDate = from;
  if (dt) dt.valueAsDate = today;
  initChart();
});
