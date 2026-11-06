const prizeValues = [100, 200, 300, 500, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 125000, 250000, 500000, 1000000];
const answerLetters = ["A", "B", "C", "D"];

const state = {
  questionBank: [],
  questions: [],
  round: 0,
  score: 0,
  correctCount: 0,
  selectedIndex: null,
  locked: false,
  answered: false,
  finished: false,
  showingResult: false,
  fiftyUsed: false,
  hintUsed: false,
};

const elements = {
  questionCounter: document.querySelector("#question-counter"),
  questionPrize: document.querySelector("#question-prize"),
  questionTitle: document.querySelector("#question-title"),
  answers: document.querySelector("#answers"),
  feedback: document.querySelector("#feedback"),
  feedbackHeading: document.querySelector("#feedback-heading"),
  explanation: document.querySelector("#explanation"),
  gameStatus: document.querySelector("#game-status"),
  lockButton: document.querySelector("#lock-button"),
  acceptButton: document.querySelector("#accept-button"),
  nextButton: document.querySelector("#next-button"),
  fiftyButton: document.querySelector("#fifty-button"),
  hintButton: document.querySelector("#hint-button"),
  prizeLadder: document.querySelector("#prize-ladder"),
  scoreLabel: document.querySelector("#score-label"),
};

function formatPrize(value) {
  return `$${value.toLocaleString("en-US")}`;
}

function shuffle(items) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

function canUseTools() {
  return state.questions.length > 0 && !state.finished && !state.locked && !state.answered;
}

function renderLadder() {
  elements.prizeLadder.replaceChildren();
  prizeValues.forEach((value, index) => {
    const step = document.createElement("li");
    step.className = "prize-step";
    if (value <= state.score) step.classList.add("is-won");
    if (index === state.round && !state.showingResult) step.classList.add("is-current");
    step.innerHTML = `<span class="step-number">${String(index + 1).padStart(2, "0")}</span><span>${formatPrize(value)}</span>`;
    elements.prizeLadder.append(step);
  });
  elements.scoreLabel.textContent = `${formatPrize(state.score)} WON`;
}

function renderTools() {
  elements.fiftyButton.disabled = state.fiftyUsed || !canUseTools() || state.selectedIndex !== null;
  elements.hintButton.disabled = state.hintUsed || !canUseTools();
}

function setAnswerButtonsDisabled() {
  elements.answers.querySelectorAll(".answer-button").forEach((button) => {
    button.disabled = true;
  });
}

function renderQuestion() {
  const question = state.questions[state.round];
  state.selectedIndex = null;
  state.locked = false;
  state.answered = false;
  elements.questionCounter.innerHTML = `QUESTION ${String(state.round + 1).padStart(2, "0")} <span class="meta-muted">/ ${String(state.questions.length).padStart(2, "0")}</span>`;
  elements.questionPrize.textContent = formatPrize(prizeValues[state.round]);
  elements.questionTitle.textContent = `“${question.direct}”`;
  elements.answers.replaceChildren();
  elements.feedback.hidden = true;
  elements.feedback.classList.remove("is-wrong");
  elements.nextButton.hidden = true;
  elements.lockButton.hidden = true;
  elements.lockButton.disabled = true;
  elements.acceptButton.hidden = true;
  elements.gameStatus.textContent = "Select an answer, then lock it in.";

  question.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.className = "answer-button";
    button.type = "button";
    button.dataset.index = String(index);
    button.innerHTML = `<span class="answer-letter">${answerLetters[index]}</span><span class="answer-text"></span>`;
    button.querySelector(".answer-text").textContent = option;
    button.addEventListener("click", () => selectAnswer(index));
    elements.answers.append(button);
  });

  renderTools();
  renderLadder();
}

function selectAnswer(index) {
  if (!canUseTools()) return;
  state.selectedIndex = index;
  elements.answers.querySelectorAll(".answer-button").forEach((button, buttonIndex) => {
    button.classList.toggle("is-selected", buttonIndex === index);
  });
  elements.lockButton.hidden = false;
  elements.lockButton.disabled = false;
  elements.gameStatus.textContent = `Answer ${answerLetters[index]} selected. Lock it in to continue.`;
  renderTools();
}

function lockAnswer() {
  if (state.selectedIndex === null || !canUseTools()) return;
  state.locked = true;
  setAnswerButtonsDisabled();
  elements.lockButton.hidden = true;
  elements.acceptButton.hidden = false;
  elements.gameStatus.textContent = "Answer locked. Accept it to see the result.";
  renderTools();
}

function acceptAnswer() {
  if (!state.locked || state.answered) return;
  state.answered = true;
  const question = state.questions[state.round];
  const correct = state.selectedIndex === question.answerIndex;
  const buttons = [...elements.answers.querySelectorAll(".answer-button")];

  buttons.forEach((button, index) => {
    if (index === question.answerIndex) button.classList.add("is-correct");
    if (index === state.selectedIndex && !correct) button.classList.add("is-wrong");
  });

  if (correct) {
    state.score = prizeValues[state.round];
    state.correctCount += 1;
  }
  state.finished = !correct || state.round === state.questions.length - 1;

  elements.acceptButton.hidden = true;
  elements.feedback.hidden = false;
  elements.feedback.classList.toggle("is-wrong", !correct);
  elements.feedbackHeading.textContent = correct ? "Correct. You’re moving up." : "Not quite. Here’s the rule.";
  elements.explanation.textContent = question.explanation;
  elements.gameStatus.textContent = correct ? `${formatPrize(state.score)} secured.` : "Wrong answer. The game is over.";
  elements.nextButton.textContent = state.finished ? "See your result" : "Next question";
  elements.nextButton.hidden = false;
  renderTools();
  renderLadder();
}

function useFiftyFifty() {
  if (state.fiftyUsed || !canUseTools() || state.selectedIndex !== null) return;
  state.fiftyUsed = true;
  const correctIndex = state.questions[state.round].answerIndex;
  const wrongIndices = shuffle([0, 1, 2, 3].filter((index) => index !== correctIndex)).slice(0, 2);
  wrongIndices.forEach((index) => {
    const button = elements.answers.querySelector(`[data-index="${index}"]`);
    button.classList.add("is-removed");
    button.disabled = true;
    button.setAttribute("aria-hidden", "true");
  });
  renderTools();
}

function useHint() {
  if (state.hintUsed || !canUseTools()) return;
  state.hintUsed = true;
  elements.gameStatus.textContent = state.questions[state.round].hint;
  renderTools();
}

function showFinalResult() {
  const wonMillion = state.score === prizeValues[prizeValues.length - 1];
  state.showingResult = true;
  elements.questionCounter.textContent = "ROUND COMPLETE";
  elements.questionPrize.textContent = formatPrize(state.score);
  elements.questionTitle.textContent = wonMillion ? "You won the million!" : "Game over.";
  elements.answers.replaceChildren();
  elements.lockButton.hidden = true;
  elements.acceptButton.hidden = true;
  elements.feedback.hidden = false;
  elements.feedback.classList.remove("is-wrong");
  elements.feedbackHeading.textContent = `${state.correctCount} of ${state.questions.length} correct`;
  elements.explanation.textContent = `You finished with ${formatPrize(state.score)} on the ladder. Reported speech gets easier when you track the reporting verb, pronouns and time expressions together.`;
  elements.gameStatus.textContent = "Ready for another round?";
  elements.nextButton.textContent = "Play again";
  elements.nextButton.hidden = false;
  renderTools();
  renderLadder();
}

function handleNext() {
  if (state.showingResult) {
    startGame();
    return;
  }
  if (state.finished) {
    showFinalResult();
    return;
  }
  state.round += 1;
  renderQuestion();
}

function shuffleOptions(question) {
  const correctText = question.options[question.answerIndex];
  const options = shuffle(question.options);
  return { ...question, options, answerIndex: options.indexOf(correctText) };
}

function startGame(questions) {
  if (questions) state.questionBank = questions;
  state.questions = shuffle(state.questionBank).slice(0, prizeValues.length).map(shuffleOptions);
  state.round = 0;
  state.score = 0;
  state.correctCount = 0;
  state.finished = false;
  state.showingResult = false;
  state.fiftyUsed = false;
  state.hintUsed = false;
  renderQuestion();
}

elements.fiftyButton.addEventListener("click", useFiftyFifty);
elements.hintButton.addEventListener("click", useHint);
elements.lockButton.addEventListener("click", lockAnswer);
elements.acceptButton.addEventListener("click", acceptAnswer);
elements.nextButton.addEventListener("click", handleNext);

fetch("database.json")
  .then((response) => {
    if (!response.ok) throw new Error("Question database could not be loaded.");
    return response.json();
  })
  .then((questions) => {
    if (!Array.isArray(questions) || questions.length !== 500) {
      throw new Error("The quiz needs exactly 500 questions.");
    }
    startGame(questions);
  })
  .catch((error) => {
    elements.questionTitle.textContent = "The quiz could not start.";
    elements.gameStatus.textContent = "Run this folder through a static web server to load database.json.";
    elements.gameStatus.classList.add("error-message");
    elements.answers.replaceChildren();
    console.error(error);
  });
