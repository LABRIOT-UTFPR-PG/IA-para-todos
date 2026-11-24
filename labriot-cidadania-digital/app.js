let state = {
  view: 'home',
  subStep: 0,
  station: localStorage.getItem('labriot_station') || '1',
  // Aula 1 states
  selectedApp: null,
  grantedPerms: {},
  metadataSelected: {},
  metadataChecked: false,
  dilemmaAnswer: '',
  // Aula 2 states
  tosAccepted: false,
  tosTimeLeft: 8,
  tosTimerId: null,
  lgpdMissionIdx: 0,
  lgpdNote: '',
  lgpdSent: false,
  posterTips: ['', '', ''],
  posterGenerated: false,
  // Aula 3 states
  dfCaseIdx: 0,
  dfFoundClues: {},
  // Aula 4 states
  siftCaseIdx: 0,
  siftTab: 'stop',
  siftVerdict: '',
  siftNotes: '',
  siftChecked: false,
  campTarget: 'Família no WhatsApp',
  campFormat: 'Cartaz no mural da escola',
  campMessage: '',
  campDone: false
};

function init() {
  document.getElementById('station-label').innerText = `Bancada #${state.station}`;
  render();
}

function setStation() {
  const num = prompt('Digite o número deste computador / bancada (ex: 1 a 5):', state.station);
  if (num && num.trim() !== '') {
    state.station = num.trim();
    localStorage.setItem('labriot_station', state.station);
    document.getElementById('station-label').innerText = `Bancada #${state.station}`;
  }
}

function goHome() {
  clearInterval(state.tosTimerId);
  state.view = 'home';
  state.subStep = 0;
  document.getElementById('btn-home').style.display = 'none';
  render();
}

function openLesson(lessonKey) {
  clearInterval(state.tosTimerId);
  state.view = lessonKey;
  state.subStep = 0;
  document.getElementById('btn-home').style.display = 'inline-block';
  if (lessonKey === 'aula2') {
    startTosTimer();
  }
  render();
}

function setSubStep(idx) {
  clearInterval(state.tosTimerId);
  state.subStep = idx;
  if (state.view === 'aula2' && idx === 0 && !state.tosAccepted) {
    startTosTimer();
  }
  render();
}

function render() {
  const app = document.getElementById('app');
  if (state.view === 'home') {
    app.innerHTML = renderHome();
  } else if (state.view === 'aula1') {
    app.innerHTML = renderAula1();
  } else if (state.view === 'aula2') {
    app.innerHTML = renderAula2();
  } else if (state.view === 'aula3') {
    app.innerHTML = renderAula3();
  } else if (state.view === 'aula4') {
    app.innerHTML = renderAula4();
  }
}

function renderHome() {
  return `
    <section class="hero">
      <h2>Missões de Cidadania Digital — LABRIOT UTFPR</h2>
      <p>Escolha o encontro de hoje abaixo para começar as atividades interativas em equipe na sua bancada.</p>
    </section>

    <div class="grid-lessons">
      <div class="lesson-card highlight">
        <div>
          <div class="lesson-tag">Encontro 01 • Privacidade</div>
          <h3>Seus Dados & Pegadas Digitais</h3>
          <p>Descubra como apps "grátis" ganham dinheiro com você e vire um detetive de metadados.</p>
        </div>
        <button class="btn-primary" onclick="openLesson('aula1')">Iniciar Encontro 01</button>
      </div>

      <div class="lesson-card highlight">
        <div>
          <div class="lesson-tag">Encontro 02 • Privacidade</div>
          <h3>Termos de Uso & Direitos LGPD</h3>
          <p>Enfrente o desafio dos 8 segundos, peça seus direitos na lei e crie o Guia da Escola.</p>
        </div>
        <button class="btn-primary" onclick="openLesson('aula2')">Iniciar Encontro 02</button>
      </div>

      <div class="lesson-card">
        <div>
          <div class="lesson-tag">Encontro 03 • Deepfakes</div>
          <h3>Ver para Crer? Raio-X de Deepfakes</h3>
          <p>Aprenda como a IA cria vídeos e fotos falsas e treine seus olhos no laboratório visual.</p>
        </div>
        <button class="btn-primary" onclick="openLesson('aula3')">Iniciar Encontro 03</button>
      </div>

      <div class="lesson-card">
        <div>
          <div class="lesson-tag">Encontro 04 • Fake News</div>
          <h3>Detetives SIFT & Campanha Escolar</h3>
          <p>Investigue boatos virais usando ferramentas de checagem offline e monte sua campanha.</p>
        </div>
        <button class="btn-primary" onclick="openLesson('aula4')">Iniciar Encontro 04</button>
      </div>
    </div>
  `;
}

/* ==================== ENCONTRO 1 ==================== */
function renderAula1() {
  const steps = ['1. Loja de Apps Grátis', '2. Detetive de Metadados', '3. Debate da Bancada'];
  let content = '';

  if (state.subStep === 0) {
    if (!state.selectedApp) {
      content = `
        <h2>Loja de Apps "Grátis"</h2>
        <p class="subtitle">"Se o app é de graça, talvez o produto seja você!" Escolha um aplicativo para instalar na bancada:</p>
        <div class="app-grid">
          ${LESSONS_DATA.apps.map(a => `
            <div class="app-item">
              <div class="app-icon">${a.icon}</div>
              <h3>${a.name}</h3>
              <p class="subtitle">${a.category} • R$ 0,00</p>
              <button class="btn-yellow" onclick="selectApp('${a.id}')">Baixar Grátis</button>
            </div>
          `).join('')}
        </div>
      `;
    } else {
      const appObj = LESSONS_DATA.apps.find(a => a.id === state.selectedApp);
      const allowedList = appObj.permissions.filter(p => state.grantedPerms[p.key]);
      const yearlyProfit = allowedList.reduce((acc, p) => acc + p.value, 0);
      const twoYearProfit = yearlyProfit * 2;

      content = `
        <h2>Instalando: ${appObj.icon} ${appObj.name}</h2>
        <p class="subtitle">O aplicativo está pedindo acesso aos seus dados para liberar o uso gratuito. O que a equipe permite?</p>
        <div class="perm-list">
          ${appObj.permissions.map(p => {
            const granted = !!state.grantedPerms[p.key];
            return `
              <div class="perm-row">
                <div>
                  <strong>${p.label}</strong>
                  ${granted ? `<div style="font-size:0.82rem; color:#5c4b39; margin-top:4px;">💡 <em>${p.reason}</em></div>` : ''}
                </div>
                <button class="${granted ? 'btn-primary' : 'btn-yellow'}" style="width:auto;" onclick="togglePerm('${p.key}')">
                  ${granted ? '✓ Permitido' : 'Permitir'}
                </button>
              </div>
            `;
          }).join('')}
        </div>

        <div class="receipt-box">
          <h3>🧾 Extrato Oculto da Empresa (Fórmula: V_total = T × V_ano)</h3>
          <p style="margin:0.5rem 0;">Permissões entregues pela equipe: <strong>${allowedList.length} de ${appObj.permissions.length}</strong></p>
          <p>Lucro estimado por ano com seus dados: <strong>R$ ${yearlyProfit},00 / ano</strong></p>
          <p>Em <strong>2 anos</strong> usando esse app "grátis", você rendeu: <strong style="color:#d9381e; font-size:1.2rem;">R$ ${twoYearProfit},00</strong> para a empresa!</p>
        </div>
        <div style="margin-top:1rem; display:flex; gap:0.75rem;">
          <button class="btn-outline" style="color:#433628; border-color:#433628;" onclick="state.selectedApp=null; state.grantedPerms={}; render();">Trocar App</button>
          <button class="btn-primary" style="width:auto;" onclick="setSubStep(1)">Ir para Etapa 2 →</button>
        </div>
      `;
    }
  } else if (state.subStep === 1) {
    const mc = LESSONS_DATA.metadataCase;
    content = `
      <h2>Vire um Detetive de Dados (Metadados)</h2>
      <p class="subtitle">Mesmo sem ler mensagens, veja o que um computador descobre juntando horários e lugares:</p>
      <div style="margin-bottom:1.25rem;">
        ${mc.clues.map(c => `<div class="clue-card">${c}</div>`).join('')}
      </div>
      <h3>Marque quais deduções o computador faz sobre essa pessoa:</h3>
      <div style="margin-top:0.75rem;">
        ${mc.deductions.map(d => `
          <label class="option-label">
            <input type="checkbox" ${state.metadataSelected[d.id] ? 'checked' : ''} onchange="toggleMeta('${d.id}')" />
            <span>${d.text}</span>
          </label>
        `).join('')}
      </div>
      <button class="btn-yellow" style="margin-top:0.75rem;" onclick="state.metadataChecked=true; render();">Conferir Deduções</button>
      ${state.metadataChecked ? `
        <div class="alert-feedback alert-ok">
          ✅ <strong>Análise concluída!</strong> O computador acerta que a pessoa dorme tarde, gosta de futebol (mostrando anúncios de chuteiras) e tem um amigo próximo — mas não há nenhuma pista sobre culinária francesa!
        </div>
      ` : ''}
    `;
  } else {
    content = `
      <h2>Desafio para Discutir na Bancada</h2>
      <p class="subtitle">Conversa em grupo (5 a 10 minutos):</p>
      <div class="clue-card" style="font-size:1.1rem; background:#fff9db; border-left-color:#ffcc00;">
        "Se uma loja descobre pelos seus dados que você adora um brinquedo e cobra mais caro só de você, isso é justo?"
      </div>
      <label><strong>Registre a conclusão da Bancada #${state.station}:</strong></label>
      <textarea rows="4" placeholder="Escrevam aqui o que o grupo decidiu e por quê..." oninput="state.dilemmaAnswer=this.value">${state.dilemmaAnswer}</textarea>
      ${state.dilemmaAnswer.trim().length > 5 ? `<div class="alert-feedback alert-ok">Resposta registrada! Preparem-se para compartilhar oralmente com a turma.</div>` : ''}
    `;
  }

  return renderStepper(steps) + `<div class="activity-box">${content}</div>`;
}

function selectApp(id) {
  state.selectedApp = id;
  state.grantedPerms = {};
  render();
}
function togglePerm(key) {
  state.grantedPerms[key] = !state.grantedPerms[key];
  render();
}
function toggleMeta(id) {
  state.metadataSelected[id] = !state.metadataSelected[id];
  state.metadataChecked = false;
  render();
}

/* ==================== ENCONTRO 2 ==================== */
function startTosTimer() {
  state.tosTimeLeft = 8;
  state.tosTimerId = setInterval(() => {
    if (state.tosTimeLeft > 0) {
      state.tosTimeLeft--;
      const el = document.getElementById('tos-clock');
      if (el) el.innerText = `${state.tosTimeLeft}s`;
    } else {
      clearInterval(state.tosTimerId);
    }
  }, 1000);
}

function renderAula2() {
  const steps = ['1. Desafio dos 8 Segundos', '2. Pedindo Direitos (LGPD)', '3. Guia da Escola'];
  let content = '';

  if (state.subStep === 0) {
    content = `
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
        <h2>O Desafio dos Termos de Uso</h2>
        <span class="timer-badge">Tempo médio de leitura: <span id="tos-clock">${state.tosTimeLeft}s</span></span>
      </div>
      <p class="subtitle">Os termos reais têm milhares de palavras (22 min de leitura), mas as pessoas clicam em "Aceito" em 8 segundos!</p>
      <div class="tos-scroll">
        <p><strong>CLÁUSULA 1 — DO ACESSO GERAL:</strong> Ao utilizar esta plataforma gratuita, o usuário declara estar ciente de que todas as interações, cliques, pausas de tela e preferências serão catalogadas em servidores internacionais por tempo indeterminado.</p><br>
        <p><strong>CLÁUSULA 2 — DA LICENÇA DE IMAGEM E VOZ:</strong> O usuário concede à empresa licença mundial, irrevogável, gratuita e eterna para reproduzir, modificar e distribuir qualquer foto, desenho ou texto publicado, inclusive após o encerramento da conta.</p><br>
        <p><strong>CLÁUSULA 3 — TREINAMENTO DE INTELIGÊNCIA ARTIFICIAL:</strong> Todos os textos, áudios e imagens enviados poderão ser utilizados para treinar algoritmos comerciais e robôs de aprendizado de máquina, sem qualquer pagamento ou aviso prévio ao autor.</p><br>
        <p><strong>CLÁUSULA 4 — ARBITRAGEM E RECLAMAÇÕES:</strong> Em caso de conflito, o usuário renuncia ao direito de abrir processos coletivos, devendo resolver qualquer disputa em foro privado escolhido exclusivamente pela plataforma.</p>
      </div>
      ${!state.tosAccepted ? `
        <button class="btn-yellow" onclick="acceptTos()">Li e ACEITO os Termos de Uso</button>
      ` : `
        <div class="clause-trap">
          <strong>⚠️ Veja o que a equipe acabou de aceitar sem perceber:</strong>
          <ul style="margin-left:1.25rem; margin-top:0.5rem; line-height:1.5;">
            <li><strong>Robôs aprendendo:</strong> Suas fotos e textos vão treinar IAs sem você ganhar nada.</li>
            <li><strong>Fotos para sempre:</strong> A empresa pode usar suas fotos publicadas em qualquer lugar para sempre.</li>
            <li><strong>Reclamar é difícil:</strong> Fica muito mais complicado reclamar contra a empresa.</li>
          </ul>
        </div>
        <button class="btn-primary" style="margin-top:1rem; width:auto;" onclick="setSubStep(1)">Usar a Lei LGPD para se proteger →</button>
      `}
    `;
  } else if (state.subStep === 1) {
    const m = LESSONS_DATA.lgpdMissions[state.lgpdMissionIdx];
    content = `
      <h2>Brincando de Pedir Direitos na LGPD</h2>
      <p class="subtitle">Escolha a missão sorteada pelo professor para a Bancada #${state.station}:</p>
      <div style="display:flex; gap:0.5rem; margin-bottom:1rem; flex-wrap:wrap;">
        ${LESSONS_DATA.lgpdMissions.map((item, i) => `
          <button class="step-pill ${state.lgpdMissionIdx === i ? 'active' : ''}" onclick="state.lgpdMissionIdx=${i}; state.lgpdSent=false; render();">${item.badge}</button>
        `).join('')}
      </div>
      <div class="clue-card">
        <strong>${m.team}</strong><br>
        <span style="font-weight:400;">${m.scenario}</span><br><br>
        🎯 <strong>Missão:</strong> ${m.task}
      </div>
      <label><strong>Escreva o pedido oficial da equipe para o app:</strong></label>
      <textarea rows="4" placeholder="Olá, com base na LGPD, nossa equipe exige..." oninput="state.lgpdNote=this.value">${state.lgpdNote}</textarea>
      <button class="btn-yellow" onclick="state.lgpdSent=true; render();">Enviar Solicitação LGPD</button>
      ${state.lgpdSent ? `
        <div class="alert-feedback alert-ok">
          ✅ <strong>Pedido protocolado!</strong> Lembre-se: se um app não respeitar ou não pedir permissão dos pais (para menores de 12 anos), conte a um adulto! Vocês podem pedir ajuda à <strong>ANPD (gov.br/anpd)</strong> e ao <strong>Procon</strong>.
        </div>
      ` : ''}
    `;
  } else {
    content = `
      <h2>Projeto Final: Guia de Privacidade da Escola</h2>
      <p class="subtitle">Escrevam 3 dicas fáceis para ensinar aos colegas mais novos como proteger seus dados:</p>
      <label><strong>Dica 1 (Sobre Apps Grátis):</strong></label>
      <input type="text" placeholder="Ex: Desconfie quando um jogo grátis pede sua localização..." value="${state.posterTips[0]}" oninput="state.posterTips[0]=this.value" />
      <label><strong>Dica 2 (Sobre Senhas e Permissão dos Pais):</strong></label>
      <input type="text" placeholder="Ex: Menores de 12 anos precisam pedir ajuda aos pais antes de criar conta..." value="${state.posterTips[1]}" oninput="state.posterTips[1]=this.value" />
      <label><strong>Dica 3 (Sobre Termos de Uso e LGPD):</strong></label>
      <input type="text" placeholder="Ex: Você pode pedir para o app apagar seus dados a qualquer momento..." value="${state.posterTips[2]}" oninput="state.posterTips[2]=this.value" />

      <button class="btn-primary" onclick="state.posterGenerated=true; render();">Gerar Cartaz da Bancada</button>

      ${state.posterGenerated ? `
        <div class="poster-preview">
          <div class="badge-lab">GUIA DE CIDADANIA DIGITAL • LABRIOT UTFPR</div>
          <h3 style="margin:0.5rem 0; font-size:1.3rem;">🛡️ Proteger seus dados é proteger você! (Bancada #${state.station})</h3>
          <ol style="margin-left:1.3rem; line-height:1.7; font-weight:600;">
            <li>${state.posterTips[0] || 'Pense antes de entregar seus dados para apps grátis.'}</li>
            <li>${state.posterTips[1] || 'Peça ajuda a um adulto responsável antes de se cadastrar.'}</li>
            <li>${state.posterTips[2] || 'Conheça seus direitos na LGPD: Acesso, Eliminação e Mudar de Ideia.'}</li>
          </ol>
          <button class="btn-yellow" style="margin-top:1rem;" onclick="window.print()">🖨️ Imprimir / Salvar PDF do Cartaz</button>
        </div>
      ` : ''}
    `;
  }

  return renderStepper(steps) + `<div class="activity-box">${content}</div>`;
}

function acceptTos() {
  clearInterval(state.tosTimerId);
  state.tosAccepted = true;
  render();
}

/* ==================== ENCONTRO 3 ==================== */
function renderAula3() {
  const steps = ['1. Como Funciona a Tecnologia', '2. Laboratório de Inspeção Visual'];
  let content = '';

  if (state.subStep === 0) {
    content = `
      <h2>Ver para Crer? A Nova Realidade dos Deepfakes</h2>
      <p class="subtitle">Deepfakes são vídeos, áudios ou fotos criados ou mudados por Inteligência Artificial que parecem reais.</p>
      <div class="app-grid">
        <div class="clue-card" style="background:#fff9db; border-left-color:#ffcc00;">
          <h3>1. Observar e Aprender</h3>
          <p style="font-weight:400; margin-top:0.5rem;">O computador analisa milhares de fotos, vídeos e gravações de uma pessoa para aprender como o rosto dela se mexe e como é o jeito de falar.</p>
        </div>
        <div class="clue-card" style="background:#fff9db; border-left-color:#433628;">
          <h3>2. Criar e Colar</h3>
          <p style="font-weight:400; margin-top:0.5rem;">A IA gera um rosto falso igualzinho e cola em outro vídeo, tentando combinar boca e olhos com a fala.</p>
        </div>
      </div>
      <h3>🔍 Tabela de Pistas do Detetive:</h3>
      <ul style="margin:0.75rem 0 1.25rem 1.3rem; line-height:1.6;">
        <li><strong>Olhos e Piscadas:</strong> A IA costuma errar ao imitar o piscar natural.</li>
        <li><strong>Bordas do Rosto:</strong> Contorno borrado perto das orelhas e do cabelo.</li>
        <li><strong>Luz e Sombras:</strong> Sombras no rosto que não combinam com a luz do ambiente.</li>
        <li><strong>Voz e Boca:</strong> Boca mexendo um pouco antes ou depois do som da voz.</li>
      </ul>
      <button class="btn-primary" style="width:auto;" onclick="setSubStep(1)">Ir para o Laboratório Visual →</button>
    `;
  } else {
    const df = LESSONS_DATA.deepfakeCases[state.dfCaseIdx];
    content = `
      <h2>Laboratório de Inspeção: Encontre as Falhas da IA</h2>
      <div style="display:flex; gap:0.5rem; margin-bottom:1rem;">
        ${LESSONS_DATA.deepfakeCases.map((c, idx) => `
          <button class="step-pill ${state.dfCaseIdx === idx ? 'active' : ''}" onclick="state.dfCaseIdx=${idx}; render();">Caso 0${idx + 1}</button>
        `).join('')}
      </div>

      <div class="df-canvas">
        <div class="mock-media">
          <div class="badge-lab">ARQUIVO SUSPEITO #0${state.dfCaseIdx + 1}</div>
          <h3 style="margin:0.6rem 0; color:#ffcc00;">${df.title}</h3>
          <p style="font-size:0.9rem; line-height:1.5; margin-bottom:1rem;">${df.description}</p>
          <div style="background:rgba(255,255,255,0.08); padding:0.9rem; border-radius:8px; font-size:0.88rem;">
            ${df.imageSummary}
          </div>
        </div>

        <div>
          <h3>Clique nas pistas que provam que é Deepfake/IA:</h3>
          ${df.clues.map(cl => {
            const key = `${df.id}_${cl.id}`;
            const clicked = !!state.dfFoundClues[key];
            return `
              <button class="hotspot-btn ${clicked && cl.isFakeClue ? 'found' : ''}" style="color:#2b231a; background:${clicked ? (cl.isFakeClue ? '#d4edda' : '#f8d7da') : '#f5f2eb'}; border-color:#ccc;" onclick="checkDfClue('${key}')">
                ${clicked ? (cl.isFakeClue ? '✅ ' : '❌ ') : '🔎 '} ${cl.label}
                ${clicked ? `<div style="font-size:0.8rem; margin-top:4px; font-weight:400;">${cl.explanation}</div>` : ''}
              </button>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  return renderStepper(steps) + `<div class="activity-box">${content}</div>`;
}

function checkDfClue(key) {
  state.dfFoundClues[key] = true;
  render();
}

/* ==================== ENCONTRO 4 ==================== */
function renderAula4() {
  const steps = ['1. Bancada SIFT & Veredito', '2. Campanha Escolar em Ação'];
  let content = '';

  if (state.subStep === 0) {
    const sc = LESSONS_DATA.siftCases[state.siftCaseIdx];
    const verdicts = ['Verdadeiro', 'Falso', 'Meio Verdadeiro', 'Fora de Contexto'];

    content = `
      <h2>Detetives de Fake News — Método SIFT Offline</h2>
      <div style="display:flex; gap:0.5rem; margin-bottom:1rem;">
        ${LESSONS_DATA.siftCases.map((_, i) => `
          <button class="step-pill ${state.siftCaseIdx === i ? 'active' : ''}" onclick="selectSiftCase(${i})">Notícia Suspeita #0${i + 1}</button>
        `).join('')}
      </div>

      <div class="tabs-bar">
        <button class="tab-btn ${state.siftTab === 'stop' ? 'active' : ''}" onclick="state.siftTab='stop'; render();">✋ S • STOP (Notícia)</button>
        <button class="tab-btn ${state.siftTab === 'inv' ? 'active' : ''}" onclick="state.siftTab='inv'; render();">🔍 I • INVESTIGATE (Fonte)</button>
        <button class="tab-btn ${state.siftTab === 'find' ? 'active' : ''}" onclick="state.siftTab='find'; render();">📰 F • FIND (Checagem)</button>
        <button class="tab-btn ${state.siftTab === 'trace' ? 'active' : ''}" onclick="state.siftTab='trace'; render();">📍 T • TRACE (Busca Reversa)</button>
      </div>

      <div class="clue-card" style="min-height:110px;">
        ${state.siftTab === 'stop' ? `<strong>Manchete recebida:</strong><br>"${sc.headline}"<br><br><em>⚠️ Primeira Reação: ${sc.emotion}</em>` : ''}
        ${state.siftTab === 'inv' ? `<strong>Investigando quem publicou:</strong><br>${sc.sourceInfo}` : ''}
        ${state.siftTab === 'find' ? `<strong>Consulta aos Sites de Checagem (Lupa / Aos Fatos):</strong><br>${sc.factCheckInfo}` : ''}
        ${state.siftTab === 'trace' ? `<strong>Rastreando a Origem da Foto (Google Imagens / TinEye):</strong><br>${sc.reverseSearchInfo}` : ''}
      </div>

      <h3 style="margin-top:1.25rem;">Ficha de Trabalho do Detetive — Qual é o Veredito?</h3>
      <div class="verdict-grid">
        ${verdicts.map(v => `
          <button class="verdict-btn ${state.siftVerdict === v ? 'selected' : ''}" onclick="state.siftVerdict='${v}'; state.siftChecked=false; render();">${v}</button>
        `).join('')}
      </div>
      <textarea rows="2" placeholder="Explique em uma frase o que provou esse veredito..." oninput="state.siftNotes=this.value">${state.siftNotes}</textarea>
      <button class="btn-yellow" onclick="state.siftChecked=true; render();">Carimbar Veredito da Equipe</button>

      ${state.siftChecked ? (
        state.siftVerdict === sc.expectedVerdict
          ? `<div class="alert-feedback alert-ok">🎉 <strong>Investigação perfeita!</strong> O veredito realmente é <strong>${sc.expectedVerdict}</strong>.</div>`
          : `<div class="alert-feedback alert-warn">🤔 Quase lá! Releiam as abas <strong>Find</strong> e <strong>Trace</strong> acima para conferir se a foto é antiga ou totalmente inventada.</div>`
      ) : ''}
    `;
  } else {
    content = `
      <h2>Campanha em Ação na Comunidade Escolar</h2>
      <p class="subtitle">Ser um detetive de notícias não é se achar melhor que os outros. É cuidar da verdade e ser gentil com as pessoas.</p>

      <label><strong>1. Para quem a equipe vai falar?</strong></label>
      <select onchange="state.campTarget=this.value">
        <option ${state.campTarget === 'Família no WhatsApp' ? 'selected' : ''}>Família no WhatsApp</option>
        <option ${state.campTarget === 'Colegas menores da escola' ? 'selected' : ''}>Colegas menores da escola</option>
        <option ${state.campTarget === 'Professores e funcionários' ? 'selected' : ''}>Professores e funcionários</option>
      </select>

      <label><strong>2. Qual será o formato do aviso?</strong></label>
      <select onchange="state.campFormat=this.value">
        <option ${state.campFormat === 'Cartaz no mural da escola' ? 'selected' : ''}>Cartaz no mural da escola</option>
        <option ${state.campFormat === 'Folheto digital para grupos' ? 'selected' : ''}>Folheto digital para grupos</option>
        <option ${state.campFormat === 'Roteiro de vídeo curto de dicas' ? 'selected' : ''}>Roteiro de vídeo curto de dicas</option>
      </select>

      <label><strong>3. Escrevam a mensagem principal da campanha (usando o Método SIFT):</strong></label>
      <textarea rows="4" placeholder="Ex: Recebeu uma notícia que dá muito susto? Pare antes de compartilhar! Confira a fonte e pesquise no Google Imagens..." oninput="state.campMessage=this.value">${state.campMessage}</textarea>

      <button class="btn-primary" onclick="state.campDone=true; render();">Finalizar Plano de Campanha</button>

      ${state.campDone ? `
        <div class="poster-preview">
          <div class="badge-lab">CAMPANHA CONTRA FAKE NEWS • BANCADA #${state.station}</div>
          <h3 style="margin:0.5rem 0;">📢 Público: ${state.campTarget} | Formato: ${state.campFormat}</h3>
          <p style="font-size:1.05rem; line-height:1.6; margin-top:0.5rem;">"${state.campMessage || 'Antes de compartilhar, use o Método SIFT: Pare, Investigue a fonte, Encontre outras notícias e Rastreie a origem!'}"</p>
        </div>
      ` : ''}
    `;
  }

  return renderStepper(steps) + `<div class="activity-box">${content}</div>`;
}

function selectSiftCase(idx) {
  state.siftCaseIdx = idx;
  state.siftTab = 'stop';
  state.siftVerdict = '';
  state.siftNotes = '';
  state.siftChecked = false;
  render();
}

function renderStepper(steps) {
  return `
    <div class="stepper">
      ${steps.map((s, idx) => `
        <button class="step-pill ${state.subStep === idx ? 'active' : ''}" onclick="setSubStep(${idx})">${s}</button>
      `).join('')}
    </div>
  `;
}

init();
