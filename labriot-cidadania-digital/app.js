const STORAGE_KEYS = {
  STATION: 'labriot_station_v2',
  LOCKED_BLOCK: 'labriot_locked_block_v2',
  STATE: 'labriot_state_v2',
  SUBMISSIONS: 'labriot_submissions_v2'
};

function createDefaultLessonState() {
  return {
    pair1: '',
    pair2: '',
    turma: '',
    completedBlocks: {},
    lastSavedSubmissionId: null,
    // Aula 1
    selectedApp: null,
    grantedPerms: {},
    metaCaseIdx: 0,
    metadataSelected: {},
    metadataChecked: {},
    dilemmaAnswer: '',
    dilemmaSaved: false,
    // Aula 2
    tosAccepted: false,
    tosRefused: false,
    tosStartMs: null,
    tosElapsedSec: null,
    tosTimeLeft: 8,
    tosMarkedClauses: {},
    lgpdMissionIdx: 0,
    lgpdNotes: {},
    lgpdSent: {},
    posterTitle: '',
    posterTips: ['', '', ''],
    posterGenerated: false,
    // Aula 3
    dfCaseIdx: 0,
    dfFoundClues: {},
    dfXrayMode: false,
    // Aula 4
    siftCaseIdx: 0,
    siftTab: 'stop',
    siftData: {},
    campTarget: 'Família no WhatsApp',
    campFormat: 'Cartaz no mural da escola',
    campMessage: '',
    campDone: false,
    // Jogo rápido
    gameIndex: 0,
    gameScore: 0,
    gameStreak: 0,
    gameAnswers: []
  };
}

let runtime = {
  station: localStorage.getItem(STORAGE_KEYS.STATION) || '1',
  lockedBlock: localStorage.getItem(STORAGE_KEYS.LOCKED_BLOCK) || '',
  view: 'home',
  subStep: 0,
  tosTimerId: null,
  modalOpen: false,
  teacherTab: 'config',
  data: createDefaultLessonState()
};

function loadSavedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STATE);
    if (raw) {
      const parsed = JSON.parse(raw);
      runtime.data = { ...createDefaultLessonState(), ...parsed.data };
      runtime.view = parsed.view || 'home';
      runtime.subStep = Number.isInteger(parsed.subStep) ? parsed.subStep : 0;
    }
  } catch (e) {
    console.warn('Falha ao carregar estado salvo:', e);
  }
}

function saveState() {
  try {
    localStorage.setItem(
      STORAGE_KEYS.STATE,
      JSON.stringify({
        view: runtime.view,
        subStep: runtime.subStep,
        data: runtime.data
      })
    );
  } catch (e) {
    console.warn('Falha ao salvar estado:', e);
  }
}

function getSubmissions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveSubmissions(list) {
  localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(list));
}

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function applyUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const bancada = params.get('bancada');
  const bloco = params.get('bloco');
  const fixo = params.get('fixo');

  if (bancada && bancada.trim()) {
    runtime.station = bancada.trim();
    localStorage.setItem(STORAGE_KEYS.STATION, runtime.station);
  }

  const validBlocks = LESSONS_META.map(l => l.key);
  if (bloco && validBlocks.includes(bloco)) {
    runtime.view = bloco;
    runtime.subStep = 0;
    if (fixo === '1' || fixo === 'true') {
      runtime.lockedBlock = bloco;
      localStorage.setItem(STORAGE_KEYS.LOCKED_BLOCK, bloco);
    }
  }
}

function init() {
  loadSavedState();
  applyUrlParams();

  if (runtime.lockedBlock && LESSONS_META.some(l => l.key === runtime.lockedBlock)) {
    runtime.view = runtime.lockedBlock;
  }

  if (runtime.view === 'aula2' && runtime.subStep === 0 && !runtime.data.tosAccepted && !runtime.data.tosRefused) {
    startTosTimer();
  }

  updateTopbar();
  render();
}

function updateTopbar() {
  const stationBtn = document.getElementById('station-label');
  const homeBtn = document.getElementById('btn-home');
  const pairBadge = document.getElementById('pair-badge');

  const lockTag = runtime.lockedBlock
    ? ` • ${LESSONS_META.find(l => l.key === runtime.lockedBlock)?.tag.split('•')[0].trim() || 'Fixo'}`
    : '';
  stationBtn.textContent = `⚙️ Bancada #${runtime.station}${lockTag}`;

  homeBtn.style.display = runtime.view !== 'home' && !runtime.lockedBlock ? 'inline-block' : 'none';

  const p1 = runtime.data.pair1.trim();
  const p2 = runtime.data.pair2.trim();
  if (runtime.view !== 'jogo' && (runtime.view !== 'home' || p1 || p2)) {
    pairBadge.style.display = 'inline-block';
    if (p1 && p2) {
      pairBadge.textContent = `👥 ${p1} & ${p2}`;
    } else if (p1 || p2) {
      pairBadge.textContent = `👥 ${p1 || p2} (+ dupla)`;
    } else {
      pairBadge.textContent = '👥 Identificar dupla';
    }
  } else {
    pairBadge.style.display = 'none';
  }
}

function focusPairInput() {
  const input = document.getElementById('pair1-input');
  if (input) {
    input.focus();
    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } else if (runtime.view === 'home') {
    openLesson(runtime.lockedBlock || 'aula1');
  }
}

function goHome() {
  if (runtime.lockedBlock) return;
  clearInterval(runtime.tosTimerId);
  runtime.view = 'home';
  runtime.subStep = 0;
  saveState();
  updateTopbar();
  render();
}

function openLesson(lessonKey) {
  clearInterval(runtime.tosTimerId);
  runtime.view = lessonKey;
  runtime.subStep = 0;
  if (lessonKey === 'aula2' && !runtime.data.tosAccepted && !runtime.data.tosRefused) {
    startTosTimer();
  }
  saveState();
  updateTopbar();
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setSubStep(idx) {
  clearInterval(runtime.tosTimerId);
  runtime.subStep = idx;
  if (runtime.view === 'aula2' && idx === 0 && !runtime.data.tosAccepted && !runtime.data.tosRefused) {
    startTosTimer();
  }
  saveState();
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetForNextPair() {
  clearInterval(runtime.tosTimerId);
  const keepView = runtime.lockedBlock || runtime.view;
  runtime.data = createDefaultLessonState();
  runtime.subStep = 0;
  runtime.view = keepView === 'home' ? 'home' : keepView;
  if (runtime.view === 'aula2') {
    startTosTimer();
  }
  saveState();
  updateTopbar();
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function render() {
  const app = document.getElementById('app');
  if (runtime.view === 'home') {
    app.innerHTML = renderHome();
  } else if (runtime.view === 'aula1') {
    app.innerHTML = renderAula1();
  } else if (runtime.view === 'aula2') {
    app.innerHTML = renderAula2();
  } else if (runtime.view === 'aula3') {
    app.innerHTML = renderAula3();
  } else if (runtime.view === 'aula4') {
    app.innerHTML = renderAula4();
  } else if (runtime.view === 'jogo') {
    app.innerHTML = renderGame();
  }
  renderModal();
}

/* ==================== HOME ==================== */
function renderHome() {
  const submissionsCount = getSubmissions().length;
  return `
    <section class="hero">
      <div class="hero-top">
        <div>
          <h2>Missões de Cidadania Digital — LABRIOT UTFPR</h2>
          <p>Cada computador funciona como uma bancada interativa para <strong>duplas de alunos</strong>. Escolham um bloco abaixo ou usem <strong>⚙️ Bancada #${escapeHtml(runtime.station)}</strong> no topo para travar este PC em um bloco fixo da aula.</p>
        </div>
        <div class="station-summary-pill">
          <span>📋 Entregas salvas neste PC: <strong>${submissionsCount}</strong></span>
        </div>
      </div>
    </section>

    <section class="game-promo">
      <div class="game-promo-copy">
        <span class="game-eyebrow">🎮 DESAFIO RÁPIDO • 6 RODADAS</span>
        <h2>Detetives da Verdade</h2>
        <p>Fake news ou deepfake? Investigue pistas, escolha seu veredito e some pontos.</p>
      </div>
      <button class="game-start-btn" onclick="startGame()">Jogar agora <span aria-hidden="true">→</span></button>
    </section>

    <div class="grid-lessons">
      ${LESSONS_META.map(lesson => `
        <div class="lesson-card ${lesson.highlight ? 'highlight' : ''}">
          <div>
            <div class="lesson-tag">${lesson.tag}</div>
            <h3>${lesson.title}</h3>
            <p>${lesson.summary}</p>
            <div class="pair-hint-mini">👥 ${lesson.pairTip}</div>
          </div>
          <button class="btn-primary" onclick="openLesson('${lesson.key}')">Abrir Bloco ${lesson.number}</button>
        </div>
      `).join('')}
    </div>
  `;
}

function getGameRounds() {
  const deepfakeRounds = LESSONS_DATA.deepfakeCases.map(df => {
    const clue = df.clues.find(item => item.isFakeClue);
    const decoys = df.clues.filter(item => !item.isFakeClue);
    const options = [
      { label: clue.shortTag, correct: true },
      ...decoys.map(item => ({ label: item.shortTag, correct: false })),
      { label: 'O número de curtidas da publicação', correct: false }
    ].slice(0, 3);

    return {
      kind: 'DEEPFAKE',
      icon: df.type === 'video' ? '🎥' : df.type === 'photo' ? '🖼️' : '🎙️',
      title: df.title.replace(/^Caso \d+: /, ''),
      prompt: 'Qual detalhe é uma pista de possível manipulação?',
      context: df.description,
      options,
      correctLabel: clue.shortTag,
      explanation: clue.explanation.replace(/^(?:Acertou|Exato|Muito bem|Boa observação|Perfeito|Excelente|Isso mesmo)!\s*/i, '')
    };
  });
  const newsRounds = LESSONS_DATA.siftCases.map(sc => ({
    kind: 'FAKE NEWS',
    icon: '🗞️',
    title: 'Chegou no grupo. E agora?',
    prompt: 'Qual é o melhor veredito para esta notícia?',
    context: sc.headline,
    options: ['Falso', 'Fora de Contexto', 'Meio Verdadeiro', 'Verdadeiro']
      .map(label => ({ label, correct: label === sc.expectedVerdict })),
    correctLabel: sc.expectedVerdict,
    explanation: sc.explanation
  }));

  return deepfakeRounds.flatMap((round, index) => [round, newsRounds[index]]);
}

function startGame() {
  runtime.data.gameIndex = 0;
  runtime.data.gameScore = 0;
  runtime.data.gameStreak = 0;
  runtime.data.gameAnswers = [];
  runtime.view = 'jogo';
  runtime.subStep = 0;
  saveState();
  updateTopbar();
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Premiação: edite aqui o mínimo de acertos e o texto do prêmio de cada medalha.
const PRIZE_TIERS = [
  { min: 6, img: 'assets/medalha-ouro.svg', name: 'Medalha de Ouro', prize: 'Prêmio máximo! Retire com o professor.' },
  { min: 5, img: 'assets/medalha-prata.svg', name: 'Medalha de Prata', prize: 'Retire seu prêmio com o professor.' },
  { min: 3, img: 'assets/medalha-bronze.svg', name: 'Medalha de Bronze', prize: 'Retire seu prêmio com o professor.' }
];

function renderPrize(correct, total, score) {
  const tier = PRIZE_TIERS.find(t => correct >= t.min);
  if (!tier) {
    return `<div class="prize-card prize-none"><p>Quase lá! Acerte pelo menos ${PRIZE_TIERS[PRIZE_TIERS.length - 1].min} para ganhar uma medalha. Jogue de novo!</p></div>`;
  }
  const names = [runtime.data.pair1.trim(), runtime.data.pair2.trim()].filter(Boolean).map(escapeHtml).join(' & ') || 'Dupla';
  return `
    <div class="prize-card">
      <img src="${tier.img}" alt="${tier.name}" class="prize-img" onerror="this.style.display='none'">
      <span class="game-eyebrow">🎁 VALE-PRÊMIO</span>
      <h3>${tier.name}</h3>
      <p><strong>${names}</strong> — ${correct}/${total} acertos · ${score} pontos</p>
      <p class="prize-note">${tier.prize}<br>Mostre esta tela ao professor.</p>
    </div>`;
}

function renderGame() {
  const rounds = getGameRounds();
  const d = runtime.data;
  const total = rounds.length;

  if (d.gameIndex >= total) {
    const correctCount = d.gameAnswers.filter(answer => answer.correct).length;
    return `
      <section class="game-screen game-results">
        ${renderPrize(correctCount, total, d.gameScore)}
        <div class="game-result-icon">${correctCount === total ? '🏆' : '🎉'}</div>
        <span class="game-eyebrow">FIM DE JOGO</span>
        <h2>${correctCount === total ? 'Detetives imbatíveis!' : 'Boa investigação!'}</h2>
        <p>Você acertou <strong>${correctCount} de ${total}</strong> rodadas e marcou <strong>${d.gameScore} pontos</strong>.</p>
        <div class="game-result-actions">
          <button class="game-start-btn" onclick="startGame()">Jogar de novo ↻</button>
          <button class="btn-outline-dark" onclick="goHome()">Voltar aos blocos</button>
        </div>
      </section>
    `;
  }

  const round = rounds[d.gameIndex];
  const answer = d.gameAnswers[d.gameIndex];
  const progress = Math.round((d.gameIndex / total) * 100);

  return `
    <section class="game-screen">
      <div class="game-heading">
        <div>
          <span class="game-eyebrow">🎮 DETETIVES DA VERDADE</span>
          <h2>Desvende antes de compartilhar</h2>
        </div>
        <div class="game-scoreboard">
          <span>⭐ <strong>${d.gameScore}</strong> pontos</span>
          <span>🔥 <strong>${d.gameStreak}</strong> sequência</span>
        </div>
      </div>
      <div class="game-progress-label"><span>Rodada ${d.gameIndex + 1} de ${total}</span><span>${progress}%</span></div>
      <div class="game-progress-track"><div style="width:${progress}%"></div></div>

      <article class="game-case">
        <div class="game-case-top">
          <span class="game-type">${round.icon} ${round.kind}</span>
          <span class="game-case-number">CASO 0${d.gameIndex + 1}</span>
        </div>
        <h3>${escapeHtml(round.title)}</h3>
        <p class="game-context">${escapeHtml(round.context)}</p>
        <h4>${escapeHtml(round.prompt)}</h4>
        <div class="game-options">
          ${round.options.map((option, index) => {
            const isSelected = answer && answer.index === index;
            const stateClass = answer
              ? option.correct ? 'correct' : isSelected ? 'incorrect' : 'muted'
              : '';
            return `
              <button class="game-option ${stateClass}" ${answer ? 'disabled' : ''} onclick="answerGame(${index})">
                <span class="game-option-letter">${String.fromCharCode(65 + index)}</span>
                <span>${escapeHtml(option.label)}</span>
                ${answer && option.correct ? '<span aria-label="Resposta correta">✓</span>' : ''}
              </button>
            `;
          }).join('')}
        </div>
      </article>

      ${answer ? `
        <div class="game-feedback ${answer.correct ? 'is-correct' : 'is-incorrect'}" role="status">
          <strong>${answer.correct ? '✅ Mandou bem!' : '🔎 Pista revelada!'}</strong>
          <p>${answer.correct ? escapeHtml(round.explanation) : `A resposta correta era “${escapeHtml(round.correctLabel)}”. ${escapeHtml(round.explanation)}`}</p>
          <button class="game-start-btn" onclick="nextGameRound()">
            ${d.gameIndex === total - 1 ? 'Ver resultado' : 'Próximo caso'} <span aria-hidden="true">→</span>
          </button>
        </div>
      ` : ''}
      <button class="game-exit-btn" onclick="goHome()">← Sair do jogo</button>
    </section>
  `;
}

function answerGame(optionIndex) {
  const rounds = getGameRounds();
  const round = rounds[runtime.data.gameIndex];
  if (!round || runtime.data.gameAnswers[runtime.data.gameIndex]) return;

  const selected = round.options[optionIndex];
  if (!selected) return;

  const correct = selected.correct;
  runtime.data.gameAnswers[runtime.data.gameIndex] = { index: optionIndex, correct };
  if (correct) {
    runtime.data.gameScore += 100 + runtime.data.gameStreak * 25;
    runtime.data.gameStreak += 1;
  } else {
    runtime.data.gameStreak = 0;
  }
  saveState();
  render();
}

function nextGameRound() {
  runtime.data.gameIndex += 1;
  saveState();
  render();
}

/* ==================== BARRA DA DUPLA & PROGRESSO ==================== */
function getLessonChecklist(lessonKey) {
  const d = runtime.data;
  if (lessonKey === 'aula1') {
    const meta1Done = !!d.metadataChecked['meta1'];
    const meta2Done = !!d.metadataChecked['meta2'];
    return [
      { label: 'Testou permissões na Loja de Apps', done: !!d.selectedApp && Object.keys(d.grantedPerms).some(k => d.grantedPerms[k]) },
      { label: 'Conferiu caso(s) de Metadados', done: meta1Done || meta2Done },
      { label: 'Registrou resposta do Debate da Dupla', done: d.dilemmaAnswer.trim().length >= 10 }
    ];
  }
  if (lessonKey === 'aula2') {
    const sentCount = Object.values(d.lgpdSent).filter(Boolean).length;
    return [
      { label: 'Enfrentou os Termos de Uso', done: d.tosAccepted || d.tosRefused },
      { label: 'Protocolou ao menos 1 pedido LGPD', done: sentCount >= 1 },
      { label: 'Gerou o Cartaz Guia da Escola', done: d.posterGenerated }
    ];
  }
  if (lessonKey === 'aula3') {
    const casesSolved = LESSONS_DATA.deepfakeCases.filter(df => {
      const realClues = df.clues.filter(c => c.isFakeClue);
      return realClues.every(c => d.dfFoundClues[`${df.id}_${c.id}`]);
    }).length;
    return [
      { label: 'Leu as pistas de como Deepfakes funcionam', done: runtime.subStep >= 1 || casesSolved > 0 },
      { label: 'Encontrou todas as pistas em ao menos 1 caso', done: casesSolved >= 1 },
      { label: `Completou todos os ${LESSONS_DATA.deepfakeCases.length} casos do Raio-X`, done: casesSolved === LESSONS_DATA.deepfakeCases.length }
    ];
  }
  if (lessonKey === 'aula4') {
    const checkedCases = LESSONS_DATA.siftCases.filter(sc => d.siftData[sc.id]?.checked).length;
    return [
      { label: 'Investigou notícias no método SIFT', done: checkedCases >= 1 },
      { label: `Verificou pelo menos 2 notícias (${checkedCases}/${LESSONS_DATA.siftCases.length})`, done: checkedCases >= 2 },
      { label: 'Finalizou o plano de Campanha Escolar', done: d.campDone }
    ];
  }
  return [];
}

function renderPairBanner(lessonKey) {
  const meta = LESSONS_META.find(l => l.key === lessonKey);
  const checks = getLessonChecklist(lessonKey);
  const doneCount = checks.filter(c => c.done).length;
  const pct = checks.length ? Math.round((doneCount / checks.length) * 100) : 0;

  return `
    <div class="pair-banner">
      <div class="pair-banner-header">
        <div>
          <span class="badge-lab">${meta.tag} • BANCADA #${escapeHtml(runtime.station)}</span>
          <div class="pair-tip-line">🤝 <strong>Em dupla:</strong> ${meta.pairTip}</div>
        </div>
        <div class="pair-progress-box">
          <div class="progress-text">Progresso do bloco: <strong>${doneCount}/${checks.length}</strong></div>
          <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
        </div>
      </div>

      <div class="pair-inputs-grid">
        <div>
          <label class="mini-label" for="pair1-input">Integrante 1</label>
          <input id="pair1-input" type="text" placeholder="Nome do aluno(a) 1" value="${escapeHtml(runtime.data.pair1)}" oninput="onPairInput('pair1', this.value)" />
        </div>
        <div>
          <label class="mini-label" for="pair2-input">Integrante 2</label>
          <input id="pair2-input" type="text" placeholder="Nome do aluno(a) 2" value="${escapeHtml(runtime.data.pair2)}" oninput="onPairInput('pair2', this.value)" />
        </div>
        <div>
          <label class="mini-label" for="turma-input">Turma (opcional)</label>
          <input id="turma-input" type="text" placeholder="Ex: 7º B" value="${escapeHtml(runtime.data.turma)}" oninput="onPairInput('turma', this.value)" />
        </div>
        <div class="pair-reset-col">
          <button class="btn-ghost-dark" onclick="confirmNextPair()" title="Limpa os campos mantendo as entregas anteriores salvas">🔄 Nova Dupla</button>
        </div>
      </div>
    </div>
  `;
}

function onPairInput(field, value) {
  runtime.data[field] = value;
  saveState();
  updateTopbar();
}

function confirmNextPair() {
  const hasContent =
    runtime.data.pair1.trim() ||
    runtime.data.pair2.trim() ||
    runtime.data.dilemmaAnswer.trim() ||
    runtime.data.campMessage.trim() ||
    Object.keys(runtime.data.lgpdNotes).length > 0;

  if (!hasContent || Object.keys(runtime.data.completedBlocks).length > 0 || confirm('Preparar esta bancada para uma nova dupla? As respostas atuais da tela serão limpas (o histórico já salvo continua guardado).')) {
    resetForNextPair();
  }
}

function renderStepper(steps) {
  return `
    <div class="stepper">
      ${steps.map((s, idx) => `
        <button class="step-pill ${runtime.subStep === idx ? 'active' : ''}" onclick="setSubStep(${idx})">${s}</button>
      `).join('')}
      <div class="stepper-nav">
        ${runtime.subStep > 0 ? `<button class="btn-step-nav" onclick="setSubStep(${runtime.subStep - 1})">← Anterior</button>` : ''}
        ${runtime.subStep < steps.length - 1 ? `<button class="btn-step-nav next" onclick="setSubStep(${runtime.subStep + 1})">Próxima etapa →</button>` : ''}
      </div>
    </div>
  `;
}

function renderCompletionBox(lessonKey) {
  const checks = getLessonChecklist(lessonKey);
  const doneCount = checks.filter(c => c.done).length;
  const d = runtime.data;

  return `
    <div class="completion-box">
      <div class="completion-header">
        <div>
          <h3>🏁 Registro Final da Dupla neste Bloco</h3>
          <p class="subtitle" style="margin-bottom:0;">Quando terminarem as etapas, salvem a entrega da dupla para o professor conferir depois.</p>
        </div>
        <span class="completion-score">${doneCount}/${checks.length} missões</span>
      </div>

      <ul class="checklist-summary">
        ${checks.map(c => `<li class="${c.done ? 'done' : ''}">${c.done ? '✅' : '⬜'} ${c.label}</li>`).join('')}
      </ul>

      ${!d.completedBlocks[lessonKey] ? `
        <div class="completion-actions">
          <button class="btn-yellow" onclick="submitBlockForPair('${lessonKey}')">✅ Concluir e Salvar Entrega da Dupla</button>
        </div>
      ` : `
        <div class="alert-feedback alert-ok">
          🎉 <strong>Entrega salva na Bancada #${escapeHtml(runtime.station)}!</strong>
          Dupla: <strong>${escapeHtml(d.pair1 || 'Aluno 1')}</strong> & <strong>${escapeHtml(d.pair2 || 'Aluno 2')}</strong>
          ${d.turma ? ` (${escapeHtml(d.turma)})` : ''}.
          <div style="margin-top:0.85rem; display:flex; gap:0.75rem; flex-wrap:wrap;">
            <button class="btn-primary" style="width:auto;" onclick="resetForNextPair()">🔄 Preparar para a Próxima Dupla</button>
            <button class="btn-outline-dark" onclick="openTeacherModal('history')">📋 Ver Entregas da Bancada</button>
          </div>
        </div>
      `}
    </div>
  `;
}

function submitBlockForPair(lessonKey) {
  const d = runtime.data;
  if (!d.pair1.trim() && !d.pair2.trim()) {
    alert('Antes de salvar, escrevam pelo menos um nome na identificação da dupla lá no topo do bloco!');
    focusPairInput();
    return;
  }

  const meta = LESSONS_META.find(l => l.key === lessonKey);
  const checks = getLessonChecklist(lessonKey);
  const doneCount = checks.filter(c => c.done).length;

  let summary = '';
  if (lessonKey === 'aula1') {
    const appObj = LESSONS_DATA.apps.find(a => a.id === d.selectedApp);
    const perms = appObj ? appObj.permissions.filter(p => d.grantedPerms[p.key]).length : 0;
    summary = `App: ${appObj ? appObj.name : 'não escolhido'} (${perms} permissões) | Debate: "${d.dilemmaAnswer.trim() || 'sem texto'}"`;
  } else if (lessonKey === 'aula2') {
    const sentMissions = LESSONS_DATA.lgpdMissions.filter(m => d.lgpdSent[m.id]).map(m => m.team).join(', ');
    summary = `Termos: ${d.tosElapsedSec ? d.tosElapsedSec + 's' : (d.tosRefused ? 'Recusou/Leu' : 'Não feito')} | LGPD: ${sentMissions || 'nenhuma'} | Cartaz: ${d.posterTips.filter(Boolean).join(' / ') || 'padrão'}`;
  } else if (lessonKey === 'aula3') {
    const totalClues = LESSONS_DATA.deepfakeCases.reduce((acc, df) => acc + df.clues.filter(c => c.isFakeClue).length, 0);
    const foundClues = LESSONS_DATA.deepfakeCases.reduce((acc, df) => acc + df.clues.filter(c => c.isFakeClue && d.dfFoundClues[`${df.id}_${c.id}`]).length, 0);
    summary = `Raio-X Deepfake: ${foundClues}/${totalClues} pistas reais identificadas.`;
  } else if (lessonKey === 'aula4') {
    const verdicts = LESSONS_DATA.siftCases.map(sc => `${sc.id}: ${d.siftData[sc.id]?.verdict || '-'}`).join(' | ');
    summary = `SIFT (${verdicts}) | Campanha (${d.campTarget} / ${d.campFormat}): "${d.campMessage.trim() || 'mensagem padrão'}"`;
  }

  const submission = {
    id: `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date().toLocaleString('pt-BR'),
    station: runtime.station,
    blockKey: lessonKey,
    blockTitle: meta.title,
    pair1: d.pair1.trim() || 'Não informado',
    pair2: d.pair2.trim() || 'Não informado',
    turma: d.turma.trim(),
    score: `${doneCount}/${checks.length}`,
    summary
  };

  const list = getSubmissions();
  list.unshift(submission);
  saveSubmissions(list);

  d.completedBlocks[lessonKey] = true;
  d.lastSavedSubmissionId = submission.id;
  saveState();
  render();
}

/* ==================== ENCONTRO 1 ==================== */
function renderAula1() {
  const steps = ['1. Loja de Apps Grátis', '2. Detetive de Metadados', '3. Debate da Dupla'];
  const d = runtime.data;
  let content = '';

  if (runtime.subStep === 0) {
    if (!d.selectedApp) {
      content = `
        <h2>Loja de Apps "Grátis"</h2>
        <p class="subtitle">"Se o produto é de graça, muitas vezes seus dados pagam a conta!" Escolham um app para testar na bancada:</p>
        <div class="app-grid">
          ${LESSONS_DATA.apps.map(a => `
            <div class="app-item">
              <div class="app-icon">${a.icon}</div>
              <h3>${a.name}</h3>
              <p class="app-desc">${a.description}</p>
              <p class="subtitle" style="margin-bottom:1rem;">${a.category} • <strong>R$ 0,00</strong></p>
              <button class="btn-yellow" onclick="selectApp('${a.id}')">Instalar Grátis</button>
            </div>
          `).join('')}
        </div>
      `;
    } else {
      const appObj = LESSONS_DATA.apps.find(a => a.id === d.selectedApp);
      const allowedList = appObj.permissions.filter(p => d.grantedPerms[p.key]);
      const unnecessaryAllowed = allowedList.filter(p => !p.necessary);
      const maxInvasiveValue = appObj.permissions.reduce((acc, p) => acc + p.value, 0) || 1;
      const yearlyProfit = allowedList.reduce((acc, p) => acc + p.value, 0);
      const twoYearProfit = yearlyProfit * 2;
      const exposurePct = Math.round((yearlyProfit / maxInvasiveValue) * 100);

      let exposureLabel = 'Privacidade Protegida 🛡️';
      let exposureColor = 'var(--success)';
      if (exposurePct >= 65) {
        exposureLabel = 'Exposição Alta 🚨';
        exposureColor = 'var(--danger)';
      } else if (exposurePct >= 25) {
        exposureLabel = 'Atenção Moderada ⚠️';
        exposureColor = '#d97706';
      }

      content = `
        <div class="header-split">
          <div>
            <h2>Instalando: ${appObj.icon} ${appObj.name}</h2>
            <p class="subtitle" style="margin-bottom:0.75rem;">Testem ligar e desligar as permissões abaixo para descobrir o que o app <strong>realmente precisa</strong> versus o que é só lucro com seus dados.</p>
          </div>
          <div class="quick-actions-row">
            <button class="btn-outline-dark" onclick="setAppPreset('minimal')">🛡️ Só o Necessário</button>
            <button class="btn-outline-dark" onclick="setAppPreset('all')">⚠️ Aceitar Tudo</button>
          </div>
        </div>

        <div class="exposure-card">
          <div class="exposure-top">
            <span>Nível de Exposição da Dupla: <strong style="color:${exposureColor};">${exposureLabel}</strong></span>
            <strong>${exposurePct}%</strong>
          </div>
          <div class="progress-track lg">
            <div class="progress-fill" style="width:${exposurePct}%; background:${exposureColor};"></div>
          </div>
        </div>

        <div class="perm-list">
          ${appObj.permissions.map(p => {
            const granted = !!d.grantedPerms[p.key];
            return `
              <div class="perm-row ${granted && !p.necessary ? 'perm-risk' : ''}">
                <div>
                  <div class="perm-title-line">
                    <strong>${p.label}</strong>
                    ${granted ? `<span class="mini-pill ${p.necessary ? 'ok' : 'warn'}">${p.necessary ? 'Necessária' : `+R$ ${p.value}/ano`}</span>` : ''}
                  </div>
                  ${granted ? `<div class="perm-reason">💡 <em>${p.reason}</em></div>` : ''}
                </div>
                <button class="${granted ? 'btn-primary' : 'btn-yellow'}" style="width:auto; min-width:115px;" onclick="togglePerm('${p.key}')">
                  ${granted ? '✓ Permitido' : 'Permitir'}
                </button>
              </div>
            `;
          }).join('')}
        </div>

        <div class="receipt-box">
          <h3>🧾 Extrato Oculto da Empresa</h3>
          <p style="margin:0.4rem 0;">Permissões liberadas: <strong>${allowedList.length} de ${appObj.permissions.length}</strong> (${unnecessaryAllowed.length} desnecessária(s) para o app funcionar)</p>
          <p>Valor estimado dos seus dados por ano: <strong>R$ ${yearlyProfit},00 / ano</strong></p>
          <p>Em <strong>2 anos</strong> usando esse app "grátis", vocês renderam: <strong style="color:var(--danger); font-size:1.2rem;">R$ ${twoYearProfit},00</strong> para anúncios!</p>
        </div>

        <div class="action-bar-row">
          <button class="btn-outline-dark" onclick="resetAppChoice()">← Escolher Outro App</button>
          <button class="btn-primary" style="width:auto;" onclick="setSubStep(1)">Ir para Etapa 2 (Metadados) →</button>
        </div>
      `;
    }
  } else if (runtime.subStep === 1) {
    const cases = LESSONS_DATA.metadataCases;
    const mc = cases[d.metaCaseIdx] || cases[0];
    const selectedMap = d.metadataSelected[mc.id] || {};
    const checked = !!d.metadataChecked[mc.id];

    const scoreCount = mc.deductions.filter(item => !!selectedMap[item.id] === item.correct).length;

    content = `
      <h2>Vire um Detetive de Metadados</h2>
      <p class="subtitle">Metadados são as "pegadas" de horário, lugar e cliques — mesmo sem ler suas conversas, algoritmos montam um retrato seu.</p>

      <div class="case-tabs">
        ${cases.map((c, idx) => `
          <button class="step-pill ${d.metaCaseIdx === idx ? 'active' : ''}" onclick="selectMetaCase(${idx})">
            ${d.metadataChecked[c.id] ? '✅ ' : ''}${c.title}
          </button>
        `).join('')}
      </div>

      <p style="margin-bottom:0.75rem; font-weight:600;">${mc.context}</p>
      <div style="margin-bottom:1.25rem;">
        ${mc.clues.map(c => `<div class="clue-card">${c}</div>`).join('')}
      </div>

      <h3>Marquem em dupla apenas as deduções que o computador consegue provar com essas pistas:</h3>
      <div style="margin-top:0.75rem;">
        ${mc.deductions.map(item => {
          const isSelected = !!selectedMap[item.id];
          const isCorrectChoice = isSelected === item.correct;
          let itemClass = '';
          if (checked) {
            itemClass = isCorrectChoice ? 'opt-correct' : 'opt-wrong';
          }
          return `
            <label class="option-label ${itemClass}">
              <input type="checkbox" ${isSelected ? 'checked' : ''} onchange="toggleMeta('${mc.id}', '${item.id}')" />
              <div>
                <span>${item.text}</span>
                ${checked ? `<div class="opt-feedback">${isCorrectChoice ? '✅' : '⚠️'} ${item.feedback}</div>` : ''}
              </div>
            </label>
          `;
        }).join('')}
      </div>

      <div class="action-bar-row">
        <button class="btn-yellow" onclick="checkMetaCase('${mc.id}')">Conferir Deduções da Dupla</button>
        ${d.metaCaseIdx < cases.length - 1 ? `<button class="btn-outline-dark" onclick="selectMetaCase(${d.metaCaseIdx + 1})">Testar Caso 2 →</button>` : ''}
      </div>

      ${checked ? `
        <div class="alert-feedback ${scoreCount === mc.deductions.length ? 'alert-ok' : 'alert-warn'}">
          ${scoreCount === mc.deductions.length
            ? `🎉 <strong>Perfeito! (${scoreCount}/${mc.deductions.length})</strong> Vocês descobriram exatamente o que os metadados revelam sem inventar o que não está nas pistas.`
            : `🔎 <strong>Resultado: ${scoreCount} de ${mc.deductions.length} acertos.</strong> Vejam os comentários em cada frase acima e ajustem se quiserem testar de novo!`}
        </div>
      ` : ''}
    `;
  } else {
    const roles = LESSONS_DATA.debateRoles;
    content = `
      <h2>Debate da Bancada em Dupla</h2>
      <p class="subtitle">Conversem por 3 minutos dividindo os papéis abaixo e registrem a conclusão conjunta:</p>

      <div class="clue-card" style="font-size:1.08rem; background:var(--yellow-soft); border-left-color:var(--yellow-utfpr);">
        💬 "${roles.question}"
      </div>

      <div class="roles-grid">
        <div class="role-card">${roles.roleA}</div>
        <div class="role-card">${roles.roleB}</div>
      </div>

      <label for="dilemma-textarea"><strong>Conclusão oficial da dupla (Bancada #${escapeHtml(runtime.station)}):</strong></label>
      <textarea id="dilemma-textarea" rows="4" placeholder="Escrevam juntos o que vocês decidiram e qual regra propõem..." oninput="onDilemmaInput(this.value)">${escapeHtml(d.dilemmaAnswer)}</textarea>

      <div class="action-bar-row">
        <button class="btn-yellow" onclick="saveDilemmaNote()">💾 Confirmar Resposta da Dupla</button>
        <span id="dilemma-live-status" class="muted-status">${d.dilemmaAnswer.trim().length > 0 ? `${d.dilemmaAnswer.trim().length} caracteres digitados` : 'Aguardando resposta'}</span>
      </div>

      ${d.dilemmaSaved && d.dilemmaAnswer.trim().length >= 5 ? `
        <div class="alert-feedback alert-ok">✅ Resposta confirmada! Agora finalizem o bloco na caixa abaixo para registrar a dupla.</div>
      ` : ''}
      ${d.dilemmaSaved && d.dilemmaAnswer.trim().length < 5 ? `
        <div class="alert-feedback alert-warn">⚠️ Escrevam uma frase um pouco mais completa antes de confirmar.</div>
      ` : ''}
    `;
  }

  return renderPairBanner('aula1') + renderStepper(steps) + `<div class="activity-box">${content}</div>` + renderCompletionBox('aula1');
}

function selectApp(id) {
  runtime.data.selectedApp = id;
  runtime.data.grantedPerms = {};
  saveState();
  render();
}
function resetAppChoice() {
  runtime.data.selectedApp = null;
  runtime.data.grantedPerms = {};
  saveState();
  render();
}
function togglePerm(key) {
  runtime.data.grantedPerms[key] = !runtime.data.grantedPerms[key];
  saveState();
  render();
}
function setAppPreset(mode) {
  const appObj = LESSONS_DATA.apps.find(a => a.id === runtime.data.selectedApp);
  if (!appObj) return;
  const map = {};
  appObj.permissions.forEach(p => {
    map[p.key] = mode === 'all' ? true : !!p.necessary;
  });
  runtime.data.grantedPerms = map;
  saveState();
  render();
}
function selectMetaCase(idx) {
  runtime.data.metaCaseIdx = idx;
  saveState();
  render();
}
function toggleMeta(caseId, dedId) {
  if (!runtime.data.metadataSelected[caseId]) runtime.data.metadataSelected[caseId] = {};
  runtime.data.metadataSelected[caseId][dedId] = !runtime.data.metadataSelected[caseId][dedId];
  runtime.data.metadataChecked[caseId] = false;
  saveState();
  render();
}
function checkMetaCase(caseId) {
  runtime.data.metadataChecked[caseId] = true;
  saveState();
  render();
}
function onDilemmaInput(val) {
  runtime.data.dilemmaAnswer = val;
  runtime.data.dilemmaSaved = false;
  saveState();
  const st = document.getElementById('dilemma-live-status');
  if (st) st.textContent = `${val.trim().length} caracteres digitados`;
}
function saveDilemmaNote() {
  runtime.data.dilemmaSaved = true;
  saveState();
  render();
}

/* ==================== ENCONTRO 2 ==================== */
function startTosTimer() {
  clearInterval(runtime.tosTimerId);
  runtime.data.tosStartMs = Date.now();
  runtime.data.tosTimeLeft = 8;
  runtime.tosTimerId = setInterval(() => {
    if (runtime.data.tosTimeLeft > 0) {
      runtime.data.tosTimeLeft--;
      const el = document.getElementById('tos-clock');
      if (el) el.textContent = `${runtime.data.tosTimeLeft}s`;
    } else {
      clearInterval(runtime.tosTimerId);
    }
  }, 1000);
}

function renderAula2() {
  const steps = ['1. Desafio dos 8 Segundos', '2. Pedindo Direitos (LGPD)', '3. Cartaz da Escola'];
  const d = runtime.data;
  let content = '';

  if (runtime.subStep === 0) {
    const markedCount = Object.values(d.tosMarkedClauses).filter(Boolean).length;

    content = `
      <div class="header-split">
        <div>
          <h2>O Desafio dos Termos de Uso</h2>
          <p class="subtitle" style="margin-bottom:0.5rem;">Na vida real, as pessoas clicam em "Aceito" em <strong>8 segundos</strong> para textos de 22 minutos! Cliquem nas cláusulas suspeitas para marcá-las ou testem aceitar:</p>
        </div>
        <span class="timer-badge">Média real: <span id="tos-clock">${d.tosTimeLeft}s</span></span>
      </div>

      <div class="tos-scroll">
        ${LESSONS_DATA.tosClauses.map(cl => {
          const marked = !!d.tosMarkedClauses[cl.id];
          return `
            <div class="tos-clause ${marked ? 'marked' : ''}" onclick="toggleTosClause('${cl.id}')">
              <div class="tos-clause-top">
                <strong>${cl.title}</strong>
                <span class="mini-pill ${marked ? 'warn' : ''}">${marked ? '🚩 Armadilha marcada!' : 'Clique para marcar risco'}</span>
              </div>
              <p>${cl.text}</p>
            </div>
          `;
        }).join('')}
      </div>

      <div class="muted-status" style="margin-bottom:0.85rem;">Cláusulas suspeitas identificadas pela dupla: <strong>${markedCount} de ${LESSONS_DATA.tosClauses.length}</strong></div>

      ${!d.tosAccepted && !d.tosRefused ? `
        <div class="action-bar-row">
          <button class="btn-yellow" onclick="acceptTos()">Li e ACEITO os Termos de Uso</button>
          <button class="btn-outline-dark" onclick="refuseTos()">🛑 Recusar / Ler Antes de Aceitar</button>
        </div>
      ` : `
        <div class="clause-trap">
          <strong>${d.tosAccepted
            ? `⏱️ Vocês aceitaram em ${d.tosElapsedSec || 'poucos'} segundos! Vejam o que foi autorizado:`
            : `🛡️ Boa escolha em ler com calma (${d.tosElapsedSec || 'alguns'} segundos)! Vejam o que esse termo escondia:`}</strong>
          <ul style="margin-left:1.25rem; margin-top:0.5rem; line-height:1.55;">
            ${LESSONS_DATA.tosClauses.map(cl => `<li>${cl.trapSummary}</li>`).join('')}
          </ul>
        </div>
        <div class="action-bar-row">
          <button class="btn-outline-dark" onclick="resetTosChallenge()">↺ Testar Novamente</button>
          <button class="btn-primary" style="width:auto;" onclick="setSubStep(1)">Usar a Lei LGPD para se proteger →</button>
        </div>
      `}
    `;
  } else if (runtime.subStep === 1) {
    const m = LESSONS_DATA.lgpdMissions[d.lgpdMissionIdx];
    const currentNote = d.lgpdNotes[m.id] || '';
    const isSent = !!d.lgpdSent[m.id];

    content = `
      <h2>Brincando de Pedir Direitos na LGPD</h2>
      <p class="subtitle">Escolham uma missão (ou façam todas em dupla) e escrevam o pedido oficial:</p>

      <div class="case-tabs">
        ${LESSONS_DATA.lgpdMissions.map((item, i) => `
          <button class="step-pill ${d.lgpdMissionIdx === i ? 'active' : ''}" onclick="selectLgpdMission(${i})">
            ${d.lgpdSent[item.id] ? '✅ ' : ''}${item.badge}
          </button>
        `).join('')}
      </div>

      <div class="clue-card">
        <strong>${m.team}</strong><br>
        <span style="font-weight:400;">${m.scenario}</span><br><br>
        🎯 <strong>Missão da Dupla:</strong> ${m.task}
      </div>

      <div class="checklist-box">
        <strong>📌 O que não pode faltar no texto:</strong>
        <ul>
          ${m.checklist.map(item => `<li>${item}</li>`).join('')}
        </ul>
      </div>

      <div class="header-split" style="margin-top:0.75rem;">
        <label for="lgpd-textarea"><strong>Texto oficial da equipe:</strong></label>
        <button class="btn-link" onclick="fillLgpdTemplate('${m.id}')">💡 Usar modelo de ajuda</button>
      </div>
      <textarea id="lgpd-textarea" rows="4" placeholder="Olá, com base na LGPD, nossa equipe solicita..." oninput="onLgpdInput('${m.id}', this.value)">${escapeHtml(currentNote)}</textarea>

      <button class="btn-yellow" onclick="sendLgpdMission('${m.id}')">Protocolar Solicitação LGPD</button>

      ${isSent ? `
        <div class="alert-feedback alert-ok">
          ✅ <strong>Pedido protocolado com sucesso!</strong> Se um app ignorar ou coletar dados de menores de 12 anos sem permissão dos pais, procure um adulto responsável, a <strong>ANPD (gov.br/anpd)</strong> ou o <strong>Procon</strong>.
        </div>
      ` : ''}
    `;
  } else {
    content = `
      <h2>Projeto Final: Cartaz Guia da Escola</h2>
      <p class="subtitle">Criem 3 dicas claras para ensinar colegas mais novos a proteger seus dados:</p>

      <label for="poster-title"><strong>Título / Lema da Dupla (opcional):</strong></label>
      <input id="poster-title" type="text" placeholder="Ex: Proteger seus dados é proteger você!" value="${escapeHtml(d.posterTitle)}" oninput="onPosterField('posterTitle', this.value)" />

      <label for="poster-tip-0"><strong>Dica 1 (Sobre Apps Grátis):</strong></label>
      <input id="poster-tip-0" type="text" placeholder="Ex: Desconfie quando um jogo grátis pede sua localização..." value="${escapeHtml(d.posterTips[0])}" oninput="onPosterTip(0, this.value)" />

      <label for="poster-tip-1"><strong>Dica 2 (Sobre Idade e Permissão dos Pais):</strong></label>
      <input id="poster-tip-1" type="text" placeholder="Ex: Menores de 12 anos precisam pedir ajuda aos pais antes de criar conta..." value="${escapeHtml(d.posterTips[1])}" oninput="onPosterTip(1, this.value)" />

      <label for="poster-tip-2"><strong>Dica 3 (Sobre Termos de Uso e LGPD):</strong></label>
      <input id="poster-tip-2" type="text" placeholder="Ex: Você pode pedir para o app apagar seus dados a qualquer momento..." value="${escapeHtml(d.posterTips[2])}" oninput="onPosterTip(2, this.value)" />

      <button class="btn-primary" onclick="generatePoster()">🎨 Gerar / Atualizar Cartaz da Dupla</button>

      ${d.posterGenerated ? `
        <div class="poster-preview printable-card">
          <div class="badge-lab">GUIA DE CIDADANIA DIGITAL • LABRIOT UTFPR</div>
          <h3 style="margin:0.5rem 0; font-size:1.35rem;">🛡️ ${escapeHtml(d.posterTitle.trim() || 'Proteger seus dados é proteger você!')}</h3>
          <p class="poster-authors">Produzido por: <strong>${escapeHtml(d.pair1.trim() || 'Aluno 1')}</strong> & <strong>${escapeHtml(d.pair2.trim() || 'Aluno 2')}</strong> • Bancada #${escapeHtml(runtime.station)}</p>
          <ol style="margin-left:1.3rem; line-height:1.8; font-weight:600; margin-top:0.75rem;">
            <li>${escapeHtml(d.posterTips[0].trim() || 'Pense antes de entregar permissões desnecessárias para apps grátis.')}</li>
            <li>${escapeHtml(d.posterTips[1].trim() || 'Peça ajuda a um adulto responsável antes de se cadastrar em redes sociais.')}</li>
            <li>${escapeHtml(d.posterTips[2].trim() || 'Conheça seus direitos na LGPD: Acesso, Eliminação e Revogação.')}</li>
          </ol>
          <div class="no-print" style="margin-top:1.15rem;">
            <button class="btn-yellow" onclick="window.print()">🖨️ Imprimir / Salvar PDF do Cartaz</button>
          </div>
        </div>
      ` : ''}
    `;
  }

  return renderPairBanner('aula2') + renderStepper(steps) + `<div class="activity-box">${content}</div>` + renderCompletionBox('aula2');
}

function toggleTosClause(id) {
  runtime.data.tosMarkedClauses[id] = !runtime.data.tosMarkedClauses[id];
  saveState();
  render();
}
function acceptTos() {
  clearInterval(runtime.tosTimerId);
  runtime.data.tosAccepted = true;
  runtime.data.tosElapsedSec = runtime.data.tosStartMs
    ? Math.max(0.5, ((Date.now() - runtime.data.tosStartMs) / 1000)).toFixed(1)
    : '8.0';
  saveState();
  render();
}
function refuseTos() {
  clearInterval(runtime.tosTimerId);
  runtime.data.tosRefused = true;
  runtime.data.tosElapsedSec = runtime.data.tosStartMs
    ? Math.max(0.5, ((Date.now() - runtime.data.tosStartMs) / 1000)).toFixed(1)
    : '8.0';
  saveState();
  render();
}
function resetTosChallenge() {
  runtime.data.tosAccepted = false;
  runtime.data.tosRefused = false;
  runtime.data.tosElapsedSec = null;
  startTosTimer();
  saveState();
  render();
}
function selectLgpdMission(idx) {
  runtime.data.lgpdMissionIdx = idx;
  saveState();
  render();
}
function onLgpdInput(missionId, val) {
  runtime.data.lgpdNotes[missionId] = val;
  runtime.data.lgpdSent[missionId] = false;
  saveState();
}
function fillLgpdTemplate(missionId) {
  const m = LESSONS_DATA.lgpdMissions.find(x => x.id === missionId);
  if (!m) return;
  runtime.data.lgpdNotes[missionId] = m.template;
  runtime.data.lgpdSent[missionId] = false;
  saveState();
  render();
}
function sendLgpdMission(missionId) {
  const text = (runtime.data.lgpdNotes[missionId] || '').trim();
  if (text.length < 15) {
    alert('Escrevam um pedido com pelo menos 15 caracteres (ou usem o "modelo de ajuda" e adaptem com suas palavras!).');
    return;
  }
  runtime.data.lgpdSent[missionId] = true;
  saveState();
  render();
}
function onPosterField(field, val) {
  runtime.data[field] = val;
  saveState();
}
function onPosterTip(idx, val) {
  runtime.data.posterTips[idx] = val;
  saveState();
}
function generatePoster() {
  runtime.data.posterGenerated = true;
  saveState();
  render();
}

/* ==================== ENCONTRO 3 (DEEPFAKES + SVG INTERATIVO) ==================== */
function renderDeepfakeSvg(df) {
  const d = runtime.data;
  const xray = d.dfXrayMode ? 'xray-on' : '';
  const isFound = (cid) => !!d.dfFoundClues[`${df.id}_${cid}`];

  if (df.type === 'video') {
    return `
      <div class="svg-stage ${xray}">
        <svg viewBox="0 0 360 230" class="df-svg" role="img" aria-label="Simulação interativa de vídeo suspeito">
          <rect x="0" y="0" width="360" height="230" rx="10" fill="#171412" />
          <!-- Estúdio escuro -->
          <circle cx="180" cy="95" r="78" fill="#29231e" />
          <!-- Camisa azul (c3) -->
          <path d="M95 210 C105 160, 255 160, 265 210 Z" fill="#1f6feb" class="svg-hotspot ${isFound('c3') ? 'hit-neutral' : ''}" onclick="checkDfClue('df1_c3')" />
          <text x="180" y="193" text-anchor="middle" fill="#cfe2ff" font-size="10" font-weight="700" pointer-events="none">CAMISA #10</text>
          <!-- Borda borrada cabelo/orelha (c2) -->
          <ellipse cx="180" cy="94" rx="49" ry="59" fill="none" stroke="${isFound('c2') ? '#22c55e' : (d.dfXrayMode ? '#ffcc00' : '#78685a')}" stroke-width="4" stroke-dasharray="5 4" class="svg-hotspot" onclick="checkDfClue('df1_c2')" />
          <!-- Rosto -->
          <ellipse cx="180" cy="95" rx="42" ry="52" fill="#d9a074" />
          <!-- Cabelo -->
          <path d="M138 82 C138 42, 222 42, 222 82 C205 64, 155 64, 138 82 Z" fill="#2b2018" />
          <!-- Olhos sem piscar (c1) -->
          <g class="svg-hotspot" onclick="checkDfClue('df1_c1')">
            <rect x="148" y="75" width="64" height="20" rx="6" fill="transparent" stroke="${isFound('c1') ? '#22c55e' : (d.dfXrayMode ? '#ffcc00' : 'transparent')}" stroke-width="2" />
            <circle cx="164" cy="85" r="6" fill="#fff" />
            <circle cx="196" cy="85" r="6" fill="#fff" />
            <circle cx="164" cy="85" r="2.8" fill="#111" />
            <circle cx="196" cy="85" r="2.8" fill="#111" />
            <text x="242" y="88" fill="#ffcc00" font-size="9" font-weight="700">👁️ 18s sem piscar</text>
          </g>
          <!-- Boca + lip-sync (c4) -->
          <g class="svg-hotspot" onclick="checkDfClue('df1_c4')">
            <rect x="157" y="113" width="46" height="18" rx="6" fill="${isFound('c4') ? 'rgba(34,197,94,0.25)' : 'transparent'}" stroke="${isFound('c4') ? '#22c55e' : (d.dfXrayMode ? '#ffcc00' : 'transparent')}" stroke-width="2" />
            <ellipse cx="180" cy="122" rx="13" ry="5" fill="#7a2424" />
          </g>
          <!-- Banner suspeito + barra de som -->
          <rect x="12" y="12" width="150" height="20" rx="4" fill="#d9381e" />
          <text x="87" y="25" text-anchor="middle" fill="#fff" font-size="9.5" font-weight="800">🎁 PRÊMIO GRÁTIS! CLIQUE</text>
          <rect x="12" y="202" width="336" height="18" rx="4" fill="rgba(0,0,0,0.65)" />
          <text x="20" y="214" fill="#ffcc00" font-size="9" font-weight="700" class="svg-hotspot" onclick="checkDfClue('df1_c4')">▶ 00:18 | 🔊 Áudio atrasado +0.5s em relação à boca</text>
        </svg>
        <div class="svg-hint">💡 Dica: cliquem direto nas regiões suspeitas da imagem ou nos cartões ao lado!</div>
      </div>
    `;
  }

  if (df.type === 'photo') {
    return `
      <div class="svg-stage ${xray}">
        <svg viewBox="0 0 360 230" class="df-svg" role="img" aria-label="Simulação interativa de foto suspeita do cachorro azul">
          <defs>
            <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#87ceeb" />
              <stop offset="100%" stop-color="#d8f0ff" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="360" height="150" rx="10" fill="url(#skyGrad)" />
          <!-- Grama (c3) -->
          <rect x="0" y="135" width="360" height="95" rx="8" fill="#4f9d4a" class="svg-hotspot" onclick="checkDfClue('df2_c3')" />
          <!-- Sol à direita -->
          <circle cx="310" cy="40" r="22" fill="#ffdd33" />
          <text x="310" y="74" text-anchor="middle" fill="#433628" font-size="9" font-weight="800">☀️ SOL AQUI</text>
          <!-- Sombra incoerente para a frente-direita (c1) -->
          <g class="svg-hotspot" onclick="checkDfClue('df2_c1')">
            <ellipse cx="220" cy="182" rx="68" ry="16" fill="rgba(0,0,0,0.38)" stroke="${isFound('c1') ? '#22c55e' : (d.dfXrayMode ? '#ffcc00' : 'transparent')}" stroke-width="2.5" />
            <text x="242" y="206" text-anchor="middle" fill="#fff" font-size="9.5" font-weight="800">↘️ Sombra aponta para o lado errado!</text>
          </g>
          <!-- Cachorro Azul -->
          <ellipse cx="165" cy="145" rx="44" ry="28" fill="#1e90ff" />
          <circle cx="132" cy="108" r="24" fill="#259dff" />
          <ellipse cx="115" cy="102" rx="8" ry="16" fill="#0d5bb5" />
          <circle cx="125" cy="104" r="3.2" fill="#111" />
          <circle cx="114" cy="112" r="4" fill="#111" />
          <!-- Pata traseira estranha com 6 dedos (c2) -->
          <g class="svg-hotspot" onclick="checkDfClue('df2_c2')">
            <circle cx="195" cy="166" r="20" fill="rgba(255,255,255,0.22)" stroke="${isFound('c2') ? '#22c55e' : (d.dfXrayMode ? '#ffcc00' : '#fff')}" stroke-width="2" stroke-dasharray="3 2" />
            <path d="M182 172 L185 162 M187 174 L189 162 M192 174 L193 162 M197 174 L197 162 M202 173 L201 162 M207 171 L205 163" stroke="#104e9e" stroke-width="2.6" stroke-linecap="round" />
            <text x="195" y="196" text-anchor="middle" fill="#fff9db" font-size="9" font-weight="800">🐾 6 dedos na grama</text>
          </g>
        </svg>
        <div class="svg-hint">💡 Observem o sol, a sombra e os detalhes das patas!</div>
      </div>
    `;
  }

  // Caso 3: Áudio clonado WhatsApp
  return `
    <div class="svg-stage ${xray}">
      <svg viewBox="0 0 360 230" class="df-svg" role="img" aria-label="Simulação de áudio suspeito no aplicativo de mensagens">
        <rect x="0" y="0" width="360" height="230" rx="10" fill="#182229" />
        <rect x="0" y="0" width="360" height="34" rx="6" fill="#202c33" />
        <text x="16" y="21" fill="#e9edef" font-size="11" font-weight="700">📱 +55 (42) 99999-0000 • Número desconhecido</text>
        <!-- Balão de áudio -->
        <rect x="18" y="48" width="324" height="74" rx="10" fill="#005c4b" />
        <text x="30" y="65" fill="#a7f3d0" font-size="9.5" font-weight="700" class="svg-hotspot" onclick="checkDfClue('df3_c3')">↪ Encaminhada • Áudio 0:12</text>
        <!-- Forma de onda com pausas robóticas (c1) -->
        <g class="svg-hotspot" onclick="checkDfClue('df3_c1')">
          <rect x="28" y="73" width="302" height="34" rx="6" fill="rgba(0,0,0,0.22)" stroke="${isFound('c1') ? '#22c55e' : (d.dfXrayMode ? '#ffcc00' : 'transparent')}" stroke-width="2" />
          <path d="M40 90 L40 82 M48 90 L48 78 M56 90 L56 84 M64 90 L64 76 M72 90 L72 85 M115 90 L115 78 M123 90 L123 82 M131 90 L131 76 M185 90 L185 80 M193 90 L193 77" stroke="#ffcc00" stroke-width="3" stroke-linecap="round" />
          <text x="82" y="102" fill="#fde68a" font-size="8.5" font-weight="700">[corte seco sem respiração]</text>
          <text x="215" y="94" fill="#fff" font-size="9" font-weight="700">⏸️ Pausas robóticas</text>
        </g>
        <!-- Transcrição da fala (c2 e c4) -->
        <rect x="18" y="134" width="324" height="82" rx="10" fill="#202c33" />
        <text x="30" y="153" fill="#fff" font-size="10" font-weight="700" class="svg-hotspot" onclick="checkDfClue('df3_c2')">🗣️ "Oi mãe, aqui é o Pedrin-hô... troquei de chip"</text>
        <text x="30" y="170" fill="#93c5fd" font-size="9" class="svg-hotspot" onclick="checkDfClue('df3_c2')">   ↳ Pronúncia estranha do apelido da família</text>
        <g class="svg-hotspot" onclick="checkDfClue('df3_c4')">
          <rect x="26" y="180" width="308" height="28" rx="6" fill="rgba(217,56,30,0.25)" stroke="${isFound('c4') ? '#22c55e' : (d.dfXrayMode ? '#ffcc00' : '#d9381e')}" stroke-width="1.5" />
          <text x="36" y="198" fill="#fecaca" font-size="9.5" font-weight="800">⚠️ "Faz um Pix AGORA! Não posso atender vídeo!"</text>
        </g>
      </svg>
      <div class="svg-hint">💡 Cliquem nos trechos da onda sonora e da mensagem para investigar!</div>
    </div>
  `;
}

function renderAula3() {
  const steps = ['1. Como a IA Cria Deepfakes', '2. Laboratório Raio-X'];
  const d = runtime.data;
  let content = '';

  if (runtime.subStep === 0) {
    content = `
      <h2>Ver para Crer? A Nova Realidade dos Deepfakes</h2>
      <p class="subtitle">Deepfakes são vídeos, fotos ou áudios gerados por Inteligência Artificial que imitam pessoas reais.</p>
      <div class="app-grid">
        <div class="clue-card" style="background:var(--yellow-soft); border-left-color:var(--yellow-utfpr);">
          <h3>1. Observar e Aprender</h3>
          <p style="font-weight:400; margin-top:0.5rem;">A IA analisa centenas de fotos, vídeos ou áudios de alguém para copiar o rosto, o jeito de falar e o timbre da voz.</p>
        </div>
        <div class="clue-card" style="background:var(--yellow-soft); border-left-color:var(--brown-dark);">
          <h3>2. Gerar e Enganar</h3>
          <p style="font-weight:400; margin-top:0.5rem;">Ela cria uma cena que nunca aconteceu — por isso precisamos treinar os olhos e os ouvidos para achar falhas.</p>
        </div>
      </div>

      <h3>🔍 Guia Rápido do Detetive (4 Sinais):</h3>
      <ul class="guide-list">
        <li><strong>Olhos e Piscadas:</strong> Pessoas em deepfakes às vezes passam segundos demais sem piscar.</li>
        <li><strong>Bordas e Anatomia:</strong> Cabelo borrado, orelha cortada, dedos a mais ou dentes estranhos.</li>
        <li><strong>Luz e Sombra:</strong> Sombras que apontam para o lado errado em relação ao sol.</li>
        <li><strong>Voz e Urgência:</strong> Respiração cortada, pronúncia esquisita e pressa para não confirmar por ligação.</li>
      </ul>
      <button class="btn-primary" style="width:auto;" onclick="setSubStep(1)">Abrir Laboratório Raio-X →</button>
    `;
  } else {
    const df = LESSONS_DATA.deepfakeCases[d.dfCaseIdx] || LESSONS_DATA.deepfakeCases[0];
    const realClues = df.clues.filter(c => c.isFakeClue);
    const foundRealCount = realClues.filter(c => d.dfFoundClues[`${df.id}_${c.id}`]).length;
    const allFound = foundRealCount === realClues.length;

    content = `
      <div class="header-split">
        <div>
          <h2>Laboratório de Inspeção: Encontrem as Falhas da IA</h2>
          <p class="subtitle" style="margin-bottom:0.75rem;">Discutam em dupla e marquem apenas as pistas que realmente provam manipulação.</p>
        </div>
        <button class="btn-outline-dark ${d.dfXrayMode ? 'active-xray' : ''}" onclick="toggleXray()">
          ${d.dfXrayMode ? '🔦 Raio-X Ligado' : '🔦 Ligar Ajuda Raio-X'}
        </button>
      </div>

      <div class="case-tabs">
        ${LESSONS_DATA.deepfakeCases.map((c, idx) => {
          const rClues = c.clues.filter(cl => cl.isFakeClue);
          const done = rClues.every(cl => d.dfFoundClues[`${c.id}_${cl.id}`]);
          return `
            <button class="step-pill ${d.dfCaseIdx === idx ? 'active' : ''}" onclick="selectDfCase(${idx})">
              ${done ? '✅ ' : ''}Caso 0${idx + 1} (${c.type === 'video' ? 'Vídeo' : c.type === 'photo' ? 'Foto' : 'Áudio'})
            </button>
          `;
        }).join('')}
      </div>

      <div class="df-canvas">
        <div class="mock-media">
          <div class="mock-top-row">
            <span class="badge-lab">ARQUIVO SUSPEITO #0${d.dfCaseIdx + 1}</span>
            <span class="xray-counter">Pistas reais: <strong>${foundRealCount}/${realClues.length}</strong></span>
          </div>
          <h3 style="margin:0.6rem 0; color:#ffcc00;">${df.title}</h3>
          <p style="font-size:0.88rem; line-height:1.45; margin-bottom:0.85rem; color:#e6dfd3;">${df.description}</p>
          ${renderDeepfakeSvg(df)}
        </div>

        <div>
          <h3>Cliquem nas pistas suspeitas (${foundRealCount}/${realClues.length} encontradas):</h3>
          ${df.clues.map(cl => {
            const key = `${df.id}_${cl.id}`;
            const clicked = !!d.dfFoundClues[key];
            return `
              <button class="hotspot-btn ${clicked ? (cl.isFakeClue ? 'found' : 'wrong') : ''}" onclick="checkDfClue('${key}')">
                <div class="hotspot-title">${clicked ? (cl.isFakeClue ? '✅ ' : '❌ ') : '🔎 '} ${cl.label}</div>
                ${clicked ? `<div class="hotspot-exp">${cl.explanation}</div>` : ''}
              </button>
            `;
          }).join('')}

          ${allFound ? `
            <div class="alert-feedback alert-ok">
              🎉 <strong>Caso desvendado!</strong> Vocês encontraram todas as falhas desse arquivo.
              ${d.dfCaseIdx < LESSONS_DATA.deepfakeCases.length - 1
                ? `<div style="margin-top:0.6rem;"><button class="btn-primary" style="width:auto;" onclick="selectDfCase(${d.dfCaseIdx + 1})">Ir para o Caso 0${d.dfCaseIdx + 2} →</button></div>`
                : ''}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  return renderPairBanner('aula3') + renderStepper(steps) + `<div class="activity-box">${content}</div>` + renderCompletionBox('aula3');
}

function selectDfCase(idx) {
  runtime.data.dfCaseIdx = idx;
  saveState();
  render();
}
function toggleXray() {
  runtime.data.dfXrayMode = !runtime.data.dfXrayMode;
  saveState();
  render();
}
function checkDfClue(key) {
  runtime.data.dfFoundClues[key] = true;
  saveState();
  render();
}

/* ==================== ENCONTRO 4 (SIFT + CAMPANHA) ==================== */
function getSiftCaseState(caseId) {
  if (!runtime.data.siftData[caseId]) {
    runtime.data.siftData[caseId] = {
      visitedTabs: { stop: true },
      verdict: '',
      notes: '',
      checked: false
    };
  }
  return runtime.data.siftData[caseId];
}

function renderAula4() {
  const steps = ['1. Bancada SIFT & Veredito', '2. Campanha Escolar em Ação'];
  const d = runtime.data;
  let content = '';

  if (runtime.subStep === 0) {
    const sc = LESSONS_DATA.siftCases[d.siftCaseIdx] || LESSONS_DATA.siftCases[0];
    const cs = getSiftCaseState(sc.id);
    const verdicts = ['Verdadeiro', 'Falso', 'Meio Verdadeiro', 'Fora de Contexto'];
    const visitedCount = ['stop', 'inv', 'find', 'trace'].filter(t => cs.visitedTabs[t]).length;

    content = `
      <div class="header-split">
        <div>
          <h2>Detetives de Fake News — Método SIFT Offline</h2>
          <p class="subtitle" style="margin-bottom:0.75rem;">Passem pelas <strong>4 abas S-I-F-T</strong> antes de bater o martelo no veredito!</p>
        </div>
        <span class="mini-pill ${visitedCount === 4 ? 'ok' : ''}">Abas investigadas: ${visitedCount}/4</span>
      </div>

      <div class="case-tabs">
        ${LESSONS_DATA.siftCases.map((item, i) => {
          const itemSt = d.siftData[item.id];
          const ok = itemSt?.checked && itemSt?.verdict === item.expectedVerdict;
          return `
            <button class="step-pill ${d.siftCaseIdx === i ? 'active' : ''}" onclick="selectSiftCase(${i})">
              ${ok ? '✅ ' : ''}Notícia #0${i + 1}
            </button>
          `;
        }).join('')}
      </div>

      <div class="tabs-bar">
        <button class="tab-btn ${d.siftTab === 'stop' ? 'active' : ''}" onclick="setSiftTab('${sc.id}', 'stop')">${cs.visitedTabs.stop ? '✓ ' : ''}✋ S • STOP</button>
        <button class="tab-btn ${d.siftTab === 'inv' ? 'active' : ''}" onclick="setSiftTab('${sc.id}', 'inv')">${cs.visitedTabs.inv ? '✓ ' : ''}🔍 I • INVESTIGATE</button>
        <button class="tab-btn ${d.siftTab === 'find' ? 'active' : ''}" onclick="setSiftTab('${sc.id}', 'find')">${cs.visitedTabs.find ? '✓ ' : ''}📰 F • FIND</button>
        <button class="tab-btn ${d.siftTab === 'trace' ? 'active' : ''}" onclick="setSiftTab('${sc.id}', 'trace')">${cs.visitedTabs.trace ? '✓ ' : ''}📍 T • TRACE</button>
      </div>

      <div class="clue-card" style="min-height:115px;">
        ${d.siftTab === 'stop' ? `<strong>✋ PARE e observe a manchete recebida:</strong><br>"${sc.headline}"<br><br><em>⚠️ Reação emocional provocada: ${sc.emotion}</em>` : ''}
        ${d.siftTab === 'inv' ? `<strong>🔍 INVESTIGUE quem publicou:</strong><br>${sc.sourceInfo}` : ''}
        ${d.siftTab === 'find' ? `<strong>📰 PROCURE cobertura confiável / checagem:</strong><br>${sc.factCheckInfo}` : ''}
        ${d.siftTab === 'trace' ? `<strong>📍 RASTREIE a origem da foto ou afirmação:</strong><br>${sc.reverseSearchInfo}` : ''}
      </div>

      <h3 style="margin-top:1.25rem;">Veredito da Dupla — O que essa notícia é?</h3>
      <div class="verdict-grid">
        ${verdicts.map(v => `
          <button class="verdict-btn ${cs.verdict === v ? 'selected' : ''}" onclick="setSiftVerdict('${sc.id}', '${v}')">${v}</button>
        `).join('')}
      </div>

      <label for="sift-notes"><strong>Justificativa em 1 frase (o que provou esse veredito?):</strong></label>
      <textarea id="sift-notes" rows="2" placeholder="Ex: A foto era de 2021 no Canadá e o Simepar confirmou 14°C..." oninput="onSiftNotes('${sc.id}', this.value)">${escapeHtml(cs.notes)}</textarea>

      <div class="action-bar-row">
        <button class="btn-yellow" onclick="stampSiftVerdict('${sc.id}')">Carimbar Veredito da Dupla</button>
        ${d.siftCaseIdx < LESSONS_DATA.siftCases.length - 1 ? `<button class="btn-outline-dark" onclick="selectSiftCase(${d.siftCaseIdx + 1})">Próxima Notícia →</button>` : ''}
      </div>

      ${cs.checked ? (
        cs.verdict === sc.expectedVerdict
          ? `<div class="alert-feedback alert-ok">🎉 <strong>Investigação perfeita!</strong> Veredito: <strong>${sc.expectedVerdict}</strong>. ${sc.explanation}</div>`
          : `<div class="alert-feedback alert-warn">🤔 Quase lá! Releiam as abas <strong>Find</strong> e <strong>Trace</strong> acima para descobrir se o conteúdo foi inventado, tirado de contexto ou misturado com algo real.</div>`
      ) : ''}
    `;
  } else {
    const quickChips = [
      'Pare antes de encaminhar!',
      'Confira quem assinou a notícia.',
      'Pesquise em dois jornais confiáveis.',
      'Use busca reversa na imagem.'
    ];

    content = `
      <h2>Campanha em Ação na Comunidade Escolar</h2>
      <p class="subtitle">Ser detetive digital é cuidar da verdade com respeito, ajudando familiares e colegas sem humilhar ninguém.</p>

      <div class="two-col-form">
        <div>
          <label for="camp-target"><strong>1. Para quem a dupla vai falar?</strong></label>
          <select id="camp-target" onchange="onCampSelect('campTarget', this.value)">
            <option ${d.campTarget === 'Família no WhatsApp' ? 'selected' : ''}>Família no WhatsApp</option>
            <option ${d.campTarget === 'Colegas menores da escola' ? 'selected' : ''}>Colegas menores da escola</option>
            <option ${d.campTarget === 'Professores e funcionários' ? 'selected' : ''}>Professores e funcionários</option>
          </select>
        </div>
        <div>
          <label for="camp-format"><strong>2. Qual será o formato do aviso?</strong></label>
          <select id="camp-format" onchange="onCampSelect('campFormat', this.value)">
            <option ${d.campFormat === 'Cartaz no mural da escola' ? 'selected' : ''}>Cartaz no mural da escola</option>
            <option ${d.campFormat === 'Folheto digital para grupos' ? 'selected' : ''}>Folheto digital para grupos</option>
            <option ${d.campFormat === 'Roteiro de vídeo curto de dicas' ? 'selected' : ''}>Roteiro de vídeo curto de dicas</option>
          </select>
        </div>
      </div>

      <label for="camp-msg"><strong>3. Escrevam a mensagem principal da campanha (usando o Método SIFT):</strong></label>
      <div class="chips-row">
        ${quickChips.map(chip => `<button type="button" class="chip-insert" onclick="appendCampChip('${chip}')">+ ${chip}</button>`).join('')}
      </div>
      <textarea id="camp-msg" rows="4" placeholder="Ex: Recebeu uma notícia que dá susto? Pare antes de compartilhar! Confira a fonte..." oninput="onCampSelect('campMessage', this.value)">${escapeHtml(d.campMessage)}</textarea>

      <button class="btn-primary" onclick="finishCampaign()">📢 Gerar Cartão de Campanha da Dupla</button>

      ${d.campDone ? `
        <div class="poster-preview printable-card">
          <div class="badge-lab">CAMPANHA SIFT CONTRA FAKE NEWS • LABRIOT UTFPR</div>
          <h3 style="margin:0.5rem 0;">📢 Para: ${escapeHtml(d.campTarget)} | Formato: ${escapeHtml(d.campFormat)}</h3>
          <p class="poster-authors">Autores: <strong>${escapeHtml(d.pair1.trim() || 'Aluno 1')}</strong> & <strong>${escapeHtml(d.pair2.trim() || 'Aluno 2')}</strong> • Bancada #${escapeHtml(runtime.station)}</p>
          <p style="font-size:1.08rem; line-height:1.6; margin-top:0.75rem; font-weight:600;">"${escapeHtml(d.campMessage.trim() || 'Antes de compartilhar, use o Método SIFT: Pare, Investigue a fonte, Encontre checagens e Rastreie a origem!')}"</p>
          <div class="no-print" style="margin-top:1rem;">
            <button class="btn-yellow" onclick="window.print()">🖨️ Imprimir / Salvar PDF da Campanha</button>
          </div>
        </div>
      ` : ''}
    `;
  }

  return renderPairBanner('aula4') + renderStepper(steps) + `<div class="activity-box">${content}</div>` + renderCompletionBox('aula4');
}

function selectSiftCase(idx) {
  runtime.data.siftCaseIdx = idx;
  runtime.data.siftTab = 'stop';
  getSiftCaseState(LESSONS_DATA.siftCases[idx].id);
  saveState();
  render();
}
function setSiftTab(caseId, tab) {
  const cs = getSiftCaseState(caseId);
  cs.visitedTabs[tab] = true;
  runtime.data.siftTab = tab;
  saveState();
  render();
}
function setSiftVerdict(caseId, verdict) {
  const cs = getSiftCaseState(caseId);
  cs.verdict = verdict;
  cs.checked = false;
  saveState();
  render();
}
function onSiftNotes(caseId, val) {
  const cs = getSiftCaseState(caseId);
  cs.notes = val;
  saveState();
}
function stampSiftVerdict(caseId) {
  const cs = getSiftCaseState(caseId);
  if (!cs.verdict) {
    alert('Escolham primeiro um dos 4 vereditos acima!');
    return;
  }
  const visitedCount = ['stop', 'inv', 'find', 'trace'].filter(t => cs.visitedTabs[t]).length;
  if (visitedCount < 4) {
    const proceed = confirm(`Vocês só abriram ${visitedCount} de 4 abas do SIFT. Querem carimbar mesmo assim? (Recomendado olhar todas as 4!)`);
    if (!proceed) return;
  }
  cs.checked = true;
  saveState();
  render();
}
function onCampSelect(field, val) {
  runtime.data[field] = val;
  saveState();
}
function appendCampChip(text) {
  const cur = runtime.data.campMessage.trim();
  runtime.data.campMessage = cur ? `${cur} ${text}` : text;
  saveState();
  render();
}
function finishCampaign() {
  runtime.data.campDone = true;
  saveState();
  render();
}

/* ==================== MODAL PROFESSOR / BANCADA ==================== */
function openTeacherModal(defaultTab = 'config') {
  runtime.modalOpen = true;
  runtime.teacherTab = defaultTab;
  renderModal();
}

function closeTeacherModal() {
  runtime.modalOpen = false;
  renderModal();
}

function switchTeacherTab(tab) {
  runtime.teacherTab = tab;
  renderModal();
}

function renderModal() {
  const root = document.getElementById('modal-root');
  if (!runtime.modalOpen) {
    root.innerHTML = '';
    return;
  }

  const submissions = getSubmissions();
  const baseUrl = `${window.location.origin}${window.location.pathname}`;
  const blockParam = runtime.lockedBlock || 'aula1';
  const shareUrl = `${baseUrl}?bancada=${encodeURIComponent(runtime.station)}&bloco=${encodeURIComponent(blockParam)}&fixo=${runtime.lockedBlock ? '1' : '0'}`;

  root.innerHTML = `
    <div class="modal-backdrop" onclick="if(event.target===this) closeTeacherModal()">
      <div class="modal-card">
        <div class="modal-header">
          <div>
            <span class="badge-lab">MODO PROFESSOR • BANCADA #${escapeHtml(runtime.station)}</span>
            <h3>Configuração da Estação & Entregas das Duplas</h3>
          </div>
          <button class="modal-close" onclick="closeTeacherModal()">✕</button>
        </div>

        <div class="tabs-bar" style="margin-bottom:1rem;">
          <button class="tab-btn ${runtime.teacherTab === 'config' ? 'active' : ''}" onclick="switchTeacherTab('config')">⚙️ Configurar PC / Bloco Fixo</button>
          <button class="tab-btn ${runtime.teacherTab === 'history' ? 'active' : ''}" onclick="switchTeacherTab('history')">📋 Entregas Salvas (${submissions.length})</button>
        </div>

        ${runtime.teacherTab === 'config' ? `
          <div class="modal-section">
            <label for="cfg-station"><strong>Número desta Bancada / Computador:</strong></label>
            <input id="cfg-station" type="text" value="${escapeHtml(runtime.station)}" placeholder="Ex: 1" />

            <label for="cfg-locked-block"><strong>Bloco aberto neste computador:</strong></label>
            <select id="cfg-locked-block">
              <option value="" ${runtime.lockedBlock === '' ? 'selected' : ''}>Livre (alunos escolhem qualquer bloco na tela inicial)</option>
              ${LESSONS_META.map(l => `
                <option value="${l.key}" ${runtime.lockedBlock === l.key ? 'selected' : ''}>Travado em: ${l.tag} — ${l.title}</option>
              `).join('')}
            </select>

            <div class="clue-card" style="font-size:0.85rem; font-weight:400;">
              <strong>🔗 Link direto para favoritar neste PC:</strong><br>
              <code style="word-break:break-all;">${escapeHtml(shareUrl)}</code>
            </div>

            <div class="action-bar-row">
              <button class="btn-primary" style="width:auto;" onclick="applyTeacherConfig()">💾 Salvar Configuração</button>
              <button class="btn-outline-dark" onclick="resetForNextPair(); closeTeacherModal();">🔄 Limpar Tela para Nova Dupla</button>
            </div>
          </div>
        ` : `
          <div class="modal-section">
            ${submissions.length === 0 ? `
              <div class="clue-card" style="font-weight:400;">
                Nenhuma dupla concluiu e salvou uma entrega nesta bancada ainda. Quando uma dupla clicar em <strong>"Concluir e Salvar Entrega"</strong> ao final de um bloco, o registro aparecerá aqui!
              </div>
            ` : `
              <div class="action-bar-row" style="margin-bottom:1rem;">
                <button class="btn-yellow" onclick="exportSubmissionsTxt()">📥 Baixar Relatório (.txt)</button>
                <button class="btn-outline-dark" onclick="clearSubmissions()">🗑️ Limpar Histórico desta Bancada</button>
              </div>
              <div class="submissions-list">
                ${submissions.map(sub => `
                  <div class="submission-item">
                    <div class="submission-top">
                      <strong>👥 ${escapeHtml(sub.pair1)} & ${escapeHtml(sub.pair2)} ${sub.turma ? `(${escapeHtml(sub.turma)})` : ''}</strong>
                      <span class="mini-pill ok">${escapeHtml(sub.score)} missões</span>
                    </div>
                    <div class="submission-meta">Bancada #${escapeHtml(sub.station)} • ${escapeHtml(sub.blockTitle)} • ${escapeHtml(sub.timestamp)}</div>
                    <div class="submission-summary">${escapeHtml(sub.summary)}</div>
                  </div>
                `).join('')}
              </div>
            `}
          </div>
        `}
      </div>
    </div>
  `;
}

function applyTeacherConfig() {
  const stVal = (document.getElementById('cfg-station')?.value || '1').trim() || '1';
  const blkVal = document.getElementById('cfg-locked-block')?.value || '';

  runtime.station = stVal;
  runtime.lockedBlock = blkVal;
  localStorage.setItem(STORAGE_KEYS.STATION, stVal);
  localStorage.setItem(STORAGE_KEYS.LOCKED_BLOCK, blkVal);

  if (blkVal) {
    runtime.view = blkVal;
    runtime.subStep = 0;
    if (blkVal === 'aula2' && !runtime.data.tosAccepted && !runtime.data.tosRefused) {
      startTosTimer();
    }
  }

  saveState();
  updateTopbar();
  closeTeacherModal();
  render();
}

function clearSubmissions() {
  if (confirm('Apagar todo o histórico de entregas salvas neste computador?')) {
    saveSubmissions([]);
    renderModal();
  }
}

function exportSubmissionsTxt() {
  const subs = getSubmissions();
  if (!subs.length) return;
  const lines = [
    `RELATORIO LABRIOT UTFPR - BANCADA #${runtime.station}`,
    `Gerado em: ${new Date().toLocaleString('pt-BR')}`,
    '====================================================',
    ''
  ];
  subs.forEach((s, idx) => {
    lines.push(`${idx + 1}. Dupla: ${s.pair1} & ${s.pair2}${s.turma ? ` | Turma: ${s.turma}` : ''}`);
    lines.push(`   Bancada: #${s.station} | Bloco: ${s.blockTitle} | Data: ${s.timestamp} | Progresso: ${s.score}`);
    lines.push(`   Resumo: ${s.summary}`);
    lines.push('');
  });

  const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `labriot-bancada-${runtime.station}-entregas.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

init();
