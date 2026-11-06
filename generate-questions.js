const fs = require("node:fs");

const names = ["Maya", "Lena", "Sophie", "Clara", "Hannah", "Nora", "Emma", "Julia", "Anna", "Mia"];

const phrases = [
  { base: "check", third: "checks", past: "checked", participle: "checked", ing: "checking", object: "the weekly schedule" },
  { base: "write", third: "writes", past: "wrote", participle: "written", ing: "writing", object: "the course notes" },
  { base: "read", third: "reads", past: "read", participle: "read", ing: "reading", object: "the assignment brief" },
  { base: "prepare", third: "prepares", past: "prepared", participle: "prepared", ing: "preparing", object: "the project outline" },
  { base: "organize", third: "organizes", past: "organized", participle: "organized", ing: "organizing", object: "the research files" },
  { base: "compare", third: "compares", past: "compared", participle: "compared", ing: "comparing", object: "the latest results" },
  { base: "practice", third: "practices", past: "practiced", participle: "practiced", ing: "practicing", object: "the presentation" },
  { base: "update", third: "updates", past: "updated", participle: "updated", ing: "updating", object: "the class website" },
  { base: "research", third: "researches", past: "researched", participle: "researched", ing: "researching", object: "the science topic" },
  { base: "finish", third: "finishes", past: "finished", participle: "finished", ing: "finishing", object: "the lab report" },
  { base: "send", third: "sends", past: "sent", participle: "sent", ing: "sending", object: "the final draft" },
  { base: "review", third: "reviews", past: "reviewed", participle: "reviewed", ing: "reviewing", object: "the grammar exercises" },
  { base: "submit", third: "submits", past: "submitted", participle: "submitted", ing: "submitting", object: "the homework" },
  { base: "translate", third: "translates", past: "translated", participle: "translated", ing: "translating", object: "the short story" },
  { base: "revise", third: "revises", past: "revised", participle: "revised", ing: "revising", object: "the vocabulary list" },
  { base: "bring", third: "brings", past: "brought", participle: "brought", ing: "bringing", object: "the dictionary" },
  { base: "find", third: "finds", past: "found", participle: "found", ing: "finding", object: "the missing handout" },
  { base: "choose", third: "chooses", past: "chose", participle: "chosen", ing: "choosing", object: "the best examples" },
  { base: "draw", third: "draws", past: "drew", participle: "drawn", ing: "drawing", object: "the diagram" },
  { base: "take", third: "takes", past: "took", participle: "taken", ing: "taking", object: "the speaking test" },
  { base: "teach", third: "teaches", past: "taught", participle: "taught", ing: "teaching", object: "the new students" },
  { base: "record", third: "records", past: "recorded", participle: "recorded", ing: "recording", object: "the listening exercise" },
  { base: "plan", third: "plans", past: "planned", participle: "planned", ing: "planning", object: "the group project" },
  { base: "explain", third: "explains", past: "explained", participle: "explained", ing: "explaining", object: "the difficult rule" },
  { base: "measure", third: "measures", past: "measured", participle: "measured", ing: "measuring", object: "the progress" },
];

const questions = [];

function nextName() {
  return names[questions.length % names.length];
}

function addQuestion(direct, correct, distractors, hint, explanation) {
  const options = new Array(4);
  const answerIndex = questions.length % 4;
  options[answerIndex] = correct;
  const wrongOptions = [...new Set(distractors.filter((option) => option !== correct))];
  if (wrongOptions.length < 3) throw new Error(`Not enough distinct choices for: ${direct}`);
  let wrongIndex = 0;
  for (let index = 0; index < options.length; index += 1) {
    if (index !== answerIndex) options[index] = wrongOptions[wrongIndex++];
  }
  questions.push({ direct, options, answerIndex, hint, explanation });
}

const simpleTimes = ["every morning", "before class", "after lunch", "at the library", "on weekdays", "every Friday", "once a week", "on Sundays", "every evening", "during breaks"];
for (const phrase of phrases) for (const time of simpleTimes) {
  const name = nextName();
  const direct = `I ${phrase.base} ${phrase.object} ${time}.`;
  const correct = `${name} said that she ${phrase.past} ${phrase.object} ${time}.`;
  addQuestion(direct, correct, [
    `${name} said that she ${phrase.third} ${phrase.object} ${time}.`,
    `${name} said that I had ${phrase.participle} ${phrase.object} ${time}.`,
    `${name} said that she was ${phrase.ing} ${phrase.object} ${time}.`,
  ], "A present simple verb normally moves back to the past simple after said.", "After the past reporting verb said, the present simple usually backshifts to the past simple. The speaker's I changes to she, while the routine time phrase stays the same.");
}

const continuousTimes = [["now", "then"], ["right now", "at that moment"], ["this afternoon", "that afternoon"], ["this week", "that week"], ["today", "that day"], ["at the moment", "at that time"], ["this morning", "that morning"], ["these days", "in those days"]];
for (const phrase of phrases) for (const [directTime, reportedTime] of continuousTimes) {
  const name = nextName();
  const direct = `I am ${phrase.ing} ${phrase.object} ${directTime}.`;
  const correct = `${name} said that she was ${phrase.ing} ${phrase.object} ${reportedTime}.`;
  addQuestion(direct, correct, [
    `${name} said that she is ${phrase.ing} ${phrase.object} ${reportedTime}.`,
    `${name} said that I was ${phrase.ing} ${phrase.object} ${reportedTime}.`,
    `${name} said that she had been ${phrase.ing} ${phrase.object} ${reportedTime}.`,
  ], "Look for the past form of be, and shift the time expression to match the new viewpoint.", "The present continuous am doing usually becomes the past continuous was doing after said. I changes to she, and the time phrase changes from the speaker's present viewpoint (for example, now to then).");
}

const perfectTimes = [["today", "that day"], ["this week", "that week"], ["this month", "that month"], ["recently", "recently"], ["already", "already"], ["this year", "that year"], ["lately", "lately"], ["so far", "so far"]];
for (const phrase of phrases) for (const [directTime, reportedTime] of perfectTimes) {
  const name = nextName();
  const direct = `I have ${phrase.participle} ${phrase.object} ${directTime}.`;
  const correct = `${name} said that she had ${phrase.participle} ${phrase.object} ${reportedTime}.`;
  addQuestion(direct, correct, [
    `${name} said that she has ${phrase.participle} ${phrase.object} ${reportedTime}.`,
    `${name} said that I had ${phrase.participle} ${phrase.object} ${reportedTime}.`,
    `${name} said that she was ${phrase.ing} ${phrase.object} ${reportedTime}.`,
  ], "The present perfect moves back to the past perfect; keep the correct past participle.", "With said, have plus a past participle usually backshifts to had plus a past participle. I changes to she. Time words such as today and this week may shift to that day and that week.");
}

const pastTimes = [["yesterday", "the day before"], ["last night", "the previous night"], ["last week", "the week before"], ["on Monday", "that Monday"], ["two days ago", "two days earlier"], ["last month", "the month before"], ["this morning", "that morning"], ["last Friday", "the Friday before"], ["earlier today", "earlier that day"], ["a week ago", "a week earlier"]];
for (const phrase of phrases) for (const [directTime, reportedTime] of pastTimes) {
  const name = nextName();
  const direct = `I ${phrase.past} ${phrase.object} ${directTime}.`;
  const correct = `${name} said that she had ${phrase.participle} ${phrase.object} ${reportedTime}.`;
  addQuestion(direct, correct, [
    `${name} said that she ${phrase.past} ${phrase.object} ${reportedTime}.`,
    `${name} said that I had ${phrase.participle} ${phrase.object} ${reportedTime}.`,
    `${name} said that she had been ${phrase.ing} ${phrase.object} ${reportedTime}.`,
  ], "A simple past verb often backshifts to had plus the past participle.", "The simple past commonly backshifts to the past perfect in reported speech: did becomes had done. The speaker pronoun changes from I to she, and the time expression is adjusted to the reporter's viewpoint.");
}

const futureTimes = [["tomorrow", "the next day"], ["next week", "the following week"], ["on Monday", "the following Monday"], ["next month", "the following month"], ["in two days", "two days later"], ["next year", "the following year"], ["this evening", "that evening"], ["later today", "later that day"], ["after the holiday", "after the holiday"], ["by the end of term", "by the end of term"]];
for (const phrase of phrases) for (const [directTime, reportedTime] of futureTimes) {
  const name = nextName();
  const direct = `I will ${phrase.base} ${phrase.object} ${directTime}.`;
  const correct = `${name} said that she would ${phrase.base} ${phrase.object} ${reportedTime}.`;
  addQuestion(direct, correct, [
    `${name} said that she will ${phrase.base} ${phrase.object} ${reportedTime}.`,
    `${name} said that I would ${phrase.base} ${phrase.object} ${reportedTime}.`,
    `${name} said that she would have ${phrase.participle} ${phrase.object} ${reportedTime}.`,
  ], "After a past reporting verb, will usually changes to would.", "Will usually backshifts to would after said. I changes to she, and future time expressions such as tomorrow usually become the next day.");
}

const abilityContexts = ["without help", "at work", "during the exam", "with this software", "whenever needed", "in the library", "on the train", "at home", "in English", "without a dictionary"];
for (const phrase of phrases) for (const context of abilityContexts) {
  const name = nextName();
  const direct = `I can ${phrase.base} ${phrase.object} ${context}.`;
  const correct = `${name} said that she could ${phrase.base} ${phrase.object} ${context}.`;
  addQuestion(direct, correct, [
    `${name} said that she can ${phrase.base} ${phrase.object} ${context}.`,
    `${name} said that I could ${phrase.base} ${phrase.object} ${context}.`,
    `${name} said that she had been able to ${phrase.base} ${phrase.object} ${context}.`,
  ], "The modal can usually backshifts to could.", "Can usually changes to could after said. The pronoun I changes to she because the reported speaker is a woman.");
}

const obligationDeadlines = [["today", "that day"], ["tomorrow", "the next day"], ["this week", "that week"], ["by Friday", "by Friday"], ["before the deadline", "before the deadline"], ["by noon", "by noon"], ["this evening", "that evening"], ["before the exam", "before the exam"], ["by next Monday", "by the following Monday"], ["tonight", "that night"]];
for (const phrase of phrases) for (const [directTime, reportedTime] of obligationDeadlines) {
  const name = nextName();
  const direct = `I must ${phrase.base} ${phrase.object} ${directTime}.`;
  const correct = `${name} said that she had to ${phrase.base} ${phrase.object} ${reportedTime}.`;
  addQuestion(direct, correct, [
    `${name} said that she must ${phrase.base} ${phrase.object} ${reportedTime}.`,
    `${name} said that I had to ${phrase.base} ${phrase.object} ${reportedTime}.`,
    `${name} said that she musted ${phrase.base} ${phrase.object} ${reportedTime}.`,
  ], "For past obligation, must usually changes to had to; musted is not a word.", "When must describes an obligation reported in the past, it usually changes to had to. I changes to she, and time expressions may shift with the reporting viewpoint.");
}

const possibilityTimes = [["tomorrow", "the next day"], ["next week", "the following week"], ["this afternoon", "that afternoon"], ["this month", "that month"], ["soon", "soon"], ["later today", "later that day"], ["next year", "the following year"], ["this evening", "that evening"], ["after the holiday", "after the holiday"], ["sometime this week", "sometime that week"]];
for (const phrase of phrases) for (const [directTime, reportedTime] of possibilityTimes) {
  const name = nextName();
  const direct = `I may ${phrase.base} ${phrase.object} ${directTime}.`;
  const correct = `${name} said that she might ${phrase.base} ${phrase.object} ${reportedTime}.`;
  addQuestion(direct, correct, [
    `${name} said that she may ${phrase.base} ${phrase.object} ${reportedTime}.`,
    `${name} said that I might ${phrase.base} ${phrase.object} ${reportedTime}.`,
    `${name} said that she mighted ${phrase.base} ${phrase.object} ${reportedTime}.`,
  ], "May commonly backshifts to might in reported speech.", "May usually changes to might after said to report a past possibility. The speaker pronoun I changes to she, and future time expressions shift as needed.");
}

if (questions.length < 15) throw new Error(`Expected at least 15 questions, generated ${questions.length}.`);
if (new Set(questions.map((question) => question.direct)).size !== questions.length) throw new Error("Question sentences must be unique.");
fs.writeFileSync("database.json", `${JSON.stringify(questions, null, 2)}\n`);
console.log(`Generated ${questions.length} unique questions.`);
