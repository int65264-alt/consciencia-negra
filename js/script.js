// Fundo estrelado animado
const starCanvas = document.getElementById('starfield');
const starCtx = starCanvas.getContext('2d');
let stars = [];

function resizeStarfield() {
  starCanvas.width = window.innerWidth;
  starCanvas.height = window.innerHeight;
  stars = Array.from({ length: 120 }, () => ({
    x: Math.random() * starCanvas.width,
    y: Math.random() * starCanvas.height,
    r: Math.random() * 1.6 + 0.3,
    alpha: Math.random(),
    speed: Math.random() * 0.015 + 0.004
  }));
}

function animateStars() {
  starCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);
  stars.forEach((s) => {
    s.alpha += s.speed;
    if (s.alpha > 1 || s.alpha < 0.15) s.speed *= -1;
    starCtx.beginPath();
    starCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    starCtx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
    starCtx.fill();
  });
  requestAnimationFrame(animateStars);
}

window.addEventListener('resize', resizeStarfield);
resizeStarfield();
animateStars();

// Menu mobile
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Animação ao rolar a página
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

// Contadores animados
document.querySelectorAll('.stat-number').forEach((counter) => {
  const target = Number(counter.dataset.target);
  let current = 0;
  const step = Math.max(1, Math.ceil(target / 60));
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      counter.textContent = target;
      clearInterval(timer);
    } else {
      counter.textContent = current;
    }
  }, 24);
});

// Filtro de Missões
const filterButtons = document.querySelectorAll('.filter-btn');
const missionCards = document.querySelectorAll('.mission-card');

filterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterButtons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;

    missionCards.forEach((card) => {
      if (filter === 'todos' || card.dataset.category === filter) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// Simulador Orbital
const angleInput = document.getElementById('angleInput');
const velocityInput = document.getElementById('velocityInput');
const angleValue = document.getElementById('angleValue');
const velocityValue = document.getElementById('velocityValue');
const simStatus = document.getElementById('simStatus');
const optimalBtn = document.getElementById('optimalBtn');
const orbitCanvas = document.getElementById('orbitCanvas');
const oCtx = orbitCanvas.getContext('2d');

function drawSimulation() {
  const angle = Number(angleInput.value);
  const velocity = Number(velocityInput.value);
  angleValue.textContent = `${angle}°`;
  velocityValue.textContent = `${velocity.toFixed(1)} km/s`;

  oCtx.clearRect(0, 0, orbitCanvas.width, orbitCanvas.height);

  // Terra
  const cx = 190;
  const cy = 165;
  oCtx.beginPath();
  oCtx.arc(cx, cy, 34, 0, Math.PI * 2);
  oCtx.fillStyle = '#2563eb';
  oCtx.fill();
  oCtx.strokeStyle = '#60a5fa';
  oCtx.lineWidth = 2;
  oCtx.stroke();

  // Órbita alvo
  oCtx.beginPath();
  oCtx.arc(cx, cy, 98, 0, Math.PI * 2);
  oCtx.setLineDash([5, 5]);
  oCtx.strokeStyle = 'rgba(245, 183, 59, 0.55)';
  oCtx.stroke();
  oCtx.setLineDash([]);

  // Trajetória calculada
  const rx = 65 + velocity * 5;
  const ry = 55 + angle * 1.1;
  const isOptimal = angle >= 38 && angle <= 46 && velocity >= 7.5 && velocity <= 8.2;

  oCtx.beginPath();
  oCtx.ellipse(cx, cy, rx, ry, (angle * Math.PI) / 180, 0, Math.PI * 2);
  oCtx.strokeStyle = isOptimal ? '#22c55e' : '#e04f96';
  oCtx.lineWidth = 2.5;
  oCtx.stroke();

  if (isOptimal) {
    simStatus.innerHTML = '<strong>Status da Trajetória:</strong> Órbita Estável! Janela aprovada para missão lunar.';
    simStatus.style.borderColor = '#22c55e';
    simStatus.style.background = 'rgba(34, 197, 94, 0.14)';
  } else if (velocity < 7.5) {
    simStatus.innerHTML = '<strong>Alerta:</strong> Velocidade insuficiente. Risco de reentrada prematura na atmosfera.';
    simStatus.style.borderColor = '#f5b73b';
    simStatus.style.background = 'rgba(245, 183, 59, 0.14)';
  } else {
    simStatus.innerHTML = '<strong>Alerta:</strong> Desvio angular detectado. Ajuste o ângulo próximo a 42° e 7.8 km/s.';
    simStatus.style.borderColor = '#e04f96';
    simStatus.style.background = 'rgba(224, 79, 150, 0.14)';
  }
}

angleInput.addEventListener('input', drawSimulation);
velocityInput.addEventListener('input', drawSimulation);
optimalBtn.addEventListener('click', () => {
  angleInput.value = 42;
  velocityInput.value = 7.8;
  drawSimulation();
});
drawSimulation();

// Quiz Interativo
const quizData = [
  {
    question: 'Qual era a função inicial de Katherine Johnson na NASA antes dos computadores eletrônicos?',
    options: ['Astronauta piloto', 'Computador Humano (cálculos manuais de trajetória)', 'Engenheira química de foguetes'],
    answer: 1,
    explanation: 'Ela integrava o grupo de matemáticas negras conhecidas como "Computadores Humanos".'
  },
  {
    question: 'Qual astronauta pediu que Katherine conferisse manualmente os cálculos da IBM antes de voar?',
    options: ['John Glenn', 'Yuri Gagarin', 'Buzz Aldrin'],
    answer: 0,
    explanation: 'John Glenn confiou na precisão matemática de Katherine antes do voo orbital Friendship 7 em 1962.'
  },
  {
    question: 'Em qual missão histórica de 1969 Katherine calculou a janela de lançamento e acoplamento lunar?',
    options: ['Apollo 11', 'Voyager 1', 'Challenger'],
    answer: 0,
    explanation: 'Seus cálculos foram essenciais para o sucesso da Apollo 11, que levou o homem à Lua.'
  },
  {
    question: 'Qual honraria civil Katherine Johnson recebeu em 2015 do presidente Barack Obama?',
    options: ['Prêmio Nobel da Paz', 'Medalha Presidencial da Liberdade', 'Medalha Fields'],
    answer: 1,
    explanation: 'Ela recebeu a Medalha Presidencial da Liberdade pelo seu legado na ciência e na luta por igualdade.'
  }
];

let currentQuiz = 0;
let score = 0;

const quizProgress = document.getElementById('quizProgress');
const quizScore = document.getElementById('quizScore');
const quizQuestion = document.getElementById('quizQuestion');
const quizOptions = document.getElementById('quizOptions');
const quizFeedback = document.getElementById('quizFeedback');
const nextQuestionBtn = document.getElementById('nextQuestionBtn');

function renderQuiz() {
  const item = quizData[currentQuiz];
  quizProgress.textContent = `Pergunta ${currentQuiz + 1} de ${quizData.length}`;
  quizScore.textContent = `Acertos: ${score}`;
  quizQuestion.textContent = item.question;
  quizFeedback.textContent = '';
  nextQuestionBtn.classList.add('hidden');
  quizOptions.innerHTML = '';

  item.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option';
    btn.textContent = opt;
    btn.addEventListener('click', () => handleAnswer(idx, btn));
    quizOptions.appendChild(btn);
  });
}

function handleAnswer(selectedIdx, selectedBtn) {
  const item = quizData[currentQuiz];
  const allBtns = quizOptions.querySelectorAll('.quiz-option');
  allBtns.forEach((b) => (b.disabled = true));

  if (selectedIdx === item.answer) {
    selectedBtn.classList.add('correct');
    score++;
    quizScore.textContent = `Acertos: ${score}`;
    quizFeedback.textContent = `Correto! ${item.explanation}`;
  } else {
    selectedBtn.classList.add('wrong');
    allBtns[item.answer].classList.add('correct');
    quizFeedback.textContent = `Não foi dessa vez. ${item.explanation}`;
  }

  nextQuestionBtn.textContent = currentQuiz < quizData.length - 1 ? 'Próxima Pergunta' : 'Reiniciar Quiz';
  nextQuestionBtn.classList.remove('hidden');
}

nextQuestionBtn.addEventListener('click', () => {
  if (currentQuiz < quizData.length - 1) {
    currentQuiz++;
  } else {
    currentQuiz = 0;
    score = 0;
  }
  renderQuiz();
});

renderQuiz();

// Mural de Homenagens com localStorage
const tributeForm = document.getElementById('tributeForm');
const tributeList = document.getElementById('tributeList');

const defaultTributes = [
  {
    name: 'Turma de Tecnologia & Ciência',
    message: 'Katherine Johnson nos ensinou que a matemática e a persistência derrubam qualquer barreira.'
  },
  {
    name: 'Projeto Consciência Negra',
    message: 'Celebrar mulheres negras na NASA é inspirar as próximas gerações de programadoras e cientistas!'
  }
];

function loadTributes() {
  const saved = JSON.parse(localStorage.getItem('katherine_tributes')) || defaultTributes;
  tributeList.innerHTML = '';
  saved.forEach((item) => {
    const div = document.createElement('div');
    div.className = 'tribute-item';
    div.innerHTML = `<strong>${item.name}</strong><p>${item.message}</p>`;
    tributeList.appendChild(div);
  });
}

tributeForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('authorName').value.trim();
  const message = document.getElementById('authorMessage').value.trim();
  if (!name || !message) return;

  const saved = JSON.parse(localStorage.getItem('katherine_tributes')) || defaultTributes;
  saved.unshift({ name, message });
  localStorage.setItem('katherine_tributes', JSON.stringify(saved));
  tributeForm.reset();
  loadTributes();
});

loadTributes();
