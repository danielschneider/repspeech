const prizeValues = [100, 200, 300, 500, 1000];
const answerLetters = ["A", "B", "C", "D"];

const state = {
  questions: [],
  round: 0,
  score: 0,
  answered: false,
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

function renderLadder() {
  elements.prizeLadder.replaceChildren();
  prizeValues.forEach((value, index) => {
    const step = document.createElement("li");
    step.className = "prize-step";
    if (index < state.round && state.score >= value) step.classList.add("is-won");
    if (index === state.round && state.round < prizeValues.length) step.classList.add("is-current");
    step.innerHTML = `<span class="step-number">${String(index + 1).padStart(2, "0")}</span><span>${formatPrize(value)}</span>`;
    elements.prizeLadder.append(step);
  });
  elements.scoreLabel.textContent = `${formatPrize(state.score)} WON`;
}

function renderQuestion() {
  const question = state.questions[state.round];
  state.answered = false;
  elements.questionCounter.innerHTML = `QUESTION ${String(state.round + 1).padStart(2, "0")} <span class="meta-muted">/ ${String(state.questions.length).padStart(2, "0")}</span>`;
  elements.questionPrize.textContent = formatPrize(prizeValues[state.round]);
  elements.questionTitle.textContent = `“${question.direct}”`;
  elements.answers.replaceChildren();
  elements.feedback.hidden = true;
  elements.feedback.classList.remove("is-wrong");
  elements.nextButton.hidden = true;
  elements.gameStatus.textContent = "Choose the best transformation.";

  question.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.className = "answer-button";
    button.type = "button";
    button.dataset.index = String(index);
    button.innerHTML = `<span class="answer-letter">${answerLetters[index]}</span><span class="answer-text"></span>`;
    button.querySelector(".answer-text").textContent = option;
    button.addEventListener("click", () => chooseAnswer(index));
    elements.answers.append(button);
  });

  elements.fiftyButton.disabled = state.fiftyUsed;
  elements.hintButton.disabled = state.hintUsed;
  renderLadder();
}

function chooseAnswer(selectedIndex) {
  if (state.answered) return;
  state.answered = true;
  const question = state.questions[state.round];
  const correct = selectedIndex === question.answerIndex;
  const buttons = [...elements.answers.querySelectorAll(".answer-button")];

  buttons.forEach((button, index) => {
    button.disabled = true;
    if (index === question.answerIndex) button.classList.add("is-correct");
    if (index === selectedIndex && !correct) button.classList.add("is-wrong");
  });

  if (correct) state.score = prizeValues[state.round];
  elements.feedback.hidden = false;
  elements.feedback.classList.toggle("is-wrong", !correct);
  elements.feedbackHeading.textContent = correct ? "Correct. You’re moving up." : "Not quite. Here’s the rule.";
  elements.explanation.textContent = question.explanation;
  elements.gameStatus.textContent = correct ? `${formatPrize(state.score)} secured.` : "Take a moment with the explanation.";
  elements.nextButton.textContent = state.round === state.questions.length - 1 ? "See your result" : "Next question";
  elements.nextButton.hidden = false;
  renderLadder();
}

function useFiftyFifty() {
  if (state.fiftyUsed || state.answered) return;
  state.fiftyUsed = true;
  const correctIndex = state.questions[state.round].answerIndex;
  const wrongIndices = shuffle([0, 1, 2, 3].filter((index) => index !== correctIndex)).slice(0, 2);
  wrongIndices.forEach((index) => {
    const button = elements.answers.querySelector(`[data-index="${index}"]`);
    button.classList.add("is-removed");
    button.disabled = true;
    button.setAttribute("aria-hidden", "true");
  });
  elements.fiftyButton.disabled = true;
}

function useHint() {
  if (state.hintUsed || state.answered) return;
  state.hintUsed = true;
  elements.hintButton.disabled = true;
  elements.gameStatus.textContent = state.questions[state.round].hint;
}

function showFinalResult() {
  const correctCount = state.questions.filter((question, index) => index < state.round && question.wasCorrect).length;
  elements.questionCounter.textContent = "ROUND COMPLETE";
  elements.questionPrize.textContent = formatPrize(state.score);
  elements.questionTitle.textContent = "That’s a wrap.";
  elements.answers.replaceChildren();
  elements.feedback.hidden = false;
  elements.feedback.classList.remove("is-wrong");
  elements.feedbackHeading.textContent = `${correctCount} of ${state.questions.length} correct`;
  elements.explanation.textContent = `You finished with ${formatPrize(state.score)} on the ladder. Reported speech gets easier when you track the reporting verb, pronouns and time expressions together.`;
  elements.gameStatus.textContent = "Ready for another round?";
  elements.nextButton.textContent = "Play again";
  elements.nextButton.hidden = false;
  elements.nextButton.dataset.restart = "true";
  elements.questionPrize.textContent = formatPrize(state.score);
  renderLadder();
}

function advance() {
  const currentQuestion = state.questions[state.round];
  currentQuestion.wasCorrect = elements.feedback.classList.contains("is-wrong") === false;
  if (elements.nextButton.dataset.restart === "true") {
    startGame();
    return;
  }
  state.round += 1;
  if (state.round >= state.questions.length) {
    showFinalResult();
    return;
  }
  renderQuestion();
}

function startGame(questions) {
  if (questions) state.questions = shuffle(questions);
  state.round = 0;
  state.score = 0;
  state.fiftyUsed = false;
  state.hintUsed = false;
  delete elements.nextButton.dataset.restart;
  renderQuestion();
}

elements.fiftyButton.addEventListener("click", useFiftyFifty);
elements.hintButton.addEventListener("click", useHint);
elements.nextButton.addEventListener("click", advance);

fetch("database.json")
  .then((response) => {
    if (!response.ok) throw new Error("Question database could not be loaded.");
    return response.json();
  })
  .then((questions) => {
    if (!Array.isArray(questions) || questions.length !== prizeValues.length) {
      throw new Error("The quiz needs exactly five questions.");
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