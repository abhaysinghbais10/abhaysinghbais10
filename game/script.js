const QUESTIONS = [
  {
    category: "JavaScript",
    difficulty: "MEDIUM",
    question: "What does Array.prototype.map() return?",
    answers: ["The original array", "A new transformed array", "A single number", "A boolean"],
    correct: 1,
    explanation: "map() creates and returns a new array containing the results of the callback."
  },
  {
    category: "Java",
    difficulty: "EASY",
    question: "Which keyword is used to inherit a class in Java?",
    answers: ["inherits", "extends", "implements", "super"],
    correct: 1,
    explanation: "A Java class uses extends to inherit from another class."
  },
  {
    category: "React",
    difficulty: "MEDIUM",
    question: "What is the main purpose of a React key in a list?",
    answers: ["Style list items", "Encrypt component data", "Help React identify changed items", "Create a database ID"],
    correct: 2,
    explanation: "Keys give list elements a stable identity so React can efficiently reconcile changes."
  },
  {
    category: "Node.js",
    difficulty: "MEDIUM",
    question: "Which built-in Node.js module is commonly used to create an HTTP server?",
    answers: ["fs", "path", "http", "events"],
    correct: 2,
    explanation: "The built-in http module provides APIs for creating HTTP servers and clients."
  },
  {
    category: "Git",
    difficulty: "EASY",
    question: "Which command creates a new commit from staged changes?",
    answers: ["git push", "git pull", "git commit", "git merge"],
    correct: 2,
    explanation: "git commit records the currently staged changes in your local repository."
  },
  {
    category: "JavaScript",
    difficulty: "HARD",
    question: "What is logged by: console.log(typeof null)?",
    answers: ["null", "object", "undefined", "boolean"],
    correct: 1,
    explanation: "typeof null is the historic JavaScript result 'object'."
  },
  {
    category: "React",
    difficulty: "HARD",
    question: "Which hook is designed to memoize a computed value?",
    answers: ["useEffect", "useRef", "useMemo", "useContext"],
    correct: 2,
    explanation: "useMemo caches the result of a calculation between renders when dependencies stay the same."
  },
  {
    category: "Java",
    difficulty: "MEDIUM",
    question: "Which collection does not allow duplicate elements?",
    answers: ["List", "Set", "Queue", "ArrayList"],
    correct: 1,
    explanation: "Set represents a collection of unique elements."
  },
  {
    category: "Node.js",
    difficulty: "HARD",
    question: "Node.js is best known for which execution model?",
    answers: ["Single-threaded event loop", "One thread per request", "GPU-only execution", "Blocking I/O by default"],
    correct: 0,
    explanation: "Node.js uses an event-driven architecture centered around a single main event loop."
  },
  {
    category: "Git",
    difficulty: "MEDIUM",
    question: "Which command downloads remote commits without merging them?",
    answers: ["git fetch", "git clone", "git reset", "git stash"],
    correct: 0,
    explanation: "git fetch updates your remote-tracking references without changing your current branch."
  }
];

const TOTAL = 5;
let questions = [];
let current = 0;
let score = 0;
let streak = 0;

const $ = (id) => document.getElementById(id);
const startScreen = $("startScreen");
const gameScreen = $("gameScreen");
const resultScreen = $("resultScreen");

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function startGame() {
  questions = shuffle(QUESTIONS).slice(0, TOTAL);
  current = 0;
  score = 0;
  streak = 0;
  $("score").textContent = "0";
  startScreen.classList.add("hidden");
  resultScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  renderQuestion();
}

function renderQuestion() {
  const item = questions[current];
  $("roundLabel").textContent = `ROUND ${String(current + 1).padStart(2, "0")} / ${String(TOTAL).padStart(2, "0")}`;
  $("categoryLabel").textContent = item.category;
  $("difficulty").textContent = item.difficulty;
  $("streak").textContent = `STREAK ${streak}`;
  $("question").textContent = item.question;
  $("feedback").textContent = "";
  $("feedback").className = "feedback";
  $("nextBtn").classList.add("hidden");
  $("progressBar").style.width = `${(current / TOTAL) * 100}%`;

  const answers = $("answers");
  answers.innerHTML = "";
  item.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.className = "answer";
    button.textContent = `${String.fromCharCode(65 + index)}. ${answer}`;
    button.addEventListener("click", () => chooseAnswer(index));
    answers.appendChild(button);
  });
}

function chooseAnswer(selected) {
  const item = questions[current];
  const buttons = [...document.querySelectorAll(".answer")];
  buttons.forEach((button) => { button.disabled = true; });
  buttons[item.correct].classList.add("correct");

  const feedback = $("feedback");
  if (selected === item.correct) {
    streak += 1;
    const gained = 100 + Math.max(0, streak - 1) * 25;
    score += gained;
    feedback.textContent = `Correct. +${gained} XP — ${item.explanation}`;
    feedback.className = "feedback good";
  } else {
    streak = 0;
    buttons[selected].classList.add("wrong");
    feedback.textContent = `Not quite. ${item.explanation}`;
    feedback.className = "feedback bad";
  }

  $("score").textContent = score;
  $("streak").textContent = `STREAK ${streak}`;
  $("progressBar").style.width = `${((current + 1) / TOTAL) * 100}%`;
  $("nextBtn").textContent = current === TOTAL - 1 ? "See result →" : "Next challenge →";
  $("nextBtn").classList.remove("hidden");
}

function nextQuestion() {
  current += 1;
  if (current >= TOTAL) finishGame();
  else renderQuestion();
}

function finishGame() {
  gameScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");
  $("finalScore").textContent = score;

  let rank = ["Code Explorer", "Bug Hunter", "Code Warrior", "Full-Stack Ninja", "Software Architect"][Math.min(4, Math.floor(score / 150))];
  let icon = ["◇", "⌁", "⚔", "◆", "★"][Math.min(4, Math.floor(score / 150))];
  if (score >= 550) rank = "Full-Stack Ninja";
  if (score >= 700) rank = "Software Architect";
  $("rankTitle").textContent = rank;
  $("rankIcon").textContent = icon;
  $("resultCopy").textContent = score >= 550
    ? "Strong run. The bugs are officially worried."
    : score >= 300
      ? "Solid work. Keep shipping and the next rank is yours."
      : "Good start. Run it again and beat your score.";
}

$("startBtn").addEventListener("click", startGame);
$("nextBtn").addEventListener("click", nextQuestion);
$("retryBtn").addEventListener("click", startGame);
