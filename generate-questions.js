const fs = require("node:fs");

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
];

const questions = [];

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

const simpleTimes = ["every morning", "before class", "after lunch", "at the library", "on weekdays"];
for (const phrase of phrases) for (const time of simpleTimes) {
  const direct = `I ${phrase.base} ${phrase.object} ${time}.`;
  const correct = `Maya said that she ${phrase.past} ${phrase.object} ${time}.`;
  addQuestion(direct, correct, [
    `Maya said that she ${phrase.third} ${phrase.object} ${time}.`,
    `Maya said that I had ${phrase.participle} ${phrase.object} ${time}.`,
    `Maya said that she was ${phrase.ing} ${phrase.object} ${time}.`,
  ], "A present simple verb normally moves back to the past simple after said.", "After the past reporting verb said, the present simple usually backshifts to the past simple. The speaker's I changes to she, while the routine time phrase stays the same.");
}

const continuousTimes = [["now", "then"], ["right now", "at that moment"], ["this afternoon", "that afternoon"], ["this week", "that week"], ["today", "that day"]];
for (const phrase of phrases) for (const [directTime, reportedTime] of continuousTimes) {
  const direct = `I am ${phrase.ing} ${phrase.object} ${directTime}.`;
  const correct = `Maya said that she was ${phrase.ing} ${phrase.object} ${reportedTime}.`;
  addQuestion(direct, correct, [
    `Maya said that she is ${phrase.ing} ${phrase.object} ${reportedTime}.`,
    `Maya said that I was ${phrase.ing} ${phrase.object} ${reportedTime}.`,
    `Maya said that she had been ${phrase.ing} ${phrase.object} ${reportedTime}.`,
  ], "Look for the past form of be, and shift the time expression to match the new viewpoint.", "The present continuous am doing usually becomes the past continuous was doing after said. I changes to she, and the time phrase changes from the speaker's present viewpoint (for example, now to then).");
}

const perfectTimes = ["today", "this week", "this month", "recently", "already"];
for (const phrase of phrases) for (const time of perfectTimes) {
  const direct = `I have ${phrase.participle} ${phrase.object} ${time}.`;
  const reportedTime = time === "today" ? "that day" : time === "this week" ? "that week" : time === "this month" ? "that month" : time;
  const correct = `Maya said that she had ${phrase.participle} ${phrase.object} ${reportedTime}.`;
  addQuestion(direct, correct, [
    `Maya said that she has ${phrase.participle} ${phrase.object} ${reportedTime}.`,
    `Maya said that I had ${phrase.participle} ${phrase.object} ${reportedTime}.`,
    `Maya said that she was ${phrase.ing} ${phrase.object} ${reportedTime}.`,
  ], "The present perfect moves back to the past perfect; keep the correct past participle.", "With said, have plus a past participle usually backshifts to had plus a past participle. I changes to she. Time words such as today and this week may shift to that day and that week.");
}

const pastTimes = [["yesterday", "the day before"], ["last night", "the previous night"], ["last week", "the week before"], ["on Monday", "that Monday"], ["two days ago", "two days earlier"]];
for (const phrase of phrases) for (const [directTime, reportedTime] of pastTimes) {
  const direct = `I ${phrase.past} ${phrase.object} ${directTime}.`;
  const correct = `Maya said that she had ${phrase.participle} ${phrase.object} ${reportedTime}.`;
  addQuestion(direct, correct, [
    `Maya said that she ${phrase.past} ${phrase.object} ${reportedTime}.`,
    `Maya said that I had ${phrase.participle} ${phrase.object} ${reportedTime}.`,
    `Maya said that she had been ${phrase.ing} ${phrase.object} ${reportedTime}.`,
  ], "A simple past verb often backshifts to had plus the past participle.", "The simple past commonly backshifts to the past perfect in reported speech: did becomes had done. The speaker pronoun changes from I to she, and the time expression is adjusted to the reporter's viewpoint.");
}

const futureTimes = [["tomorrow", "the next day"], ["next week", "the following week"], ["on Monday", "the following Monday"], ["next month", "the following month"], ["in two days", "two days later"]];
for (const phrase of phrases) for (const [directTime, reportedTime] of futureTimes) {
  const direct = `I will ${phrase.base} ${phrase.object} ${directTime}.`;
  const correct = `Maya said that she would ${phrase.base} ${phrase.object} ${reportedTime}.`;
  addQuestion(direct, correct, [
    `Maya said that she will ${phrase.base} ${phrase.object} ${reportedTime}.`,
    `Maya said that I would ${phrase.base} ${phrase.object} ${reportedTime}.`,
    `Maya said that she would ${phrase.base} ${phrase.object} ${directTime}.`,
  ], "After a past reporting verb, will usually changes to would.", "Will usually backshifts to would after said. I changes to she, and future time expressions such as tomorrow usually become the next day.");
}

const abilityContexts = ["without help", "at work", "during the exam", "with this software", "whenever needed"];
for (const phrase of phrases) for (const context of abilityContexts) {
  const direct = `I can ${phrase.base} ${phrase.object} ${context}.`;
  const correct = `Maya said that she could ${phrase.base} ${phrase.object} ${context}.`;
  addQuestion(direct, correct, [
    `Maya said that she can ${phrase.base} ${phrase.object} ${context}.`,
    `Maya said that I could ${phrase.base} ${phrase.object} ${context}.`,
    `Maya said that she had been able to ${phrase.base} ${phrase.object} ${context}.`,
  ], "The modal can usually backshifts to could.", "Can usually changes to could after said. The pronoun I also changes to she because Maya is the person being quoted.");
}

const obligationDeadlines = [["today", "that day"], ["tomorrow", "the next day"], ["this week", "that week"], ["by Friday", "by Friday"], ["before the deadline", "before the deadline"]];
for (const phrase of phrases) for (const [directTime, reportedTime] of obligationDeadlines) {
  const direct = `I must ${phrase.base} ${phrase.object} ${directTime}.`;
  const correct = `Maya said that she had to ${phrase.base} ${phrase.object} ${reportedTime}.`;
  addQuestion(direct, correct, [
    `Maya said that she must ${phrase.base} ${phrase.object} ${reportedTime}.`,
    `Maya said that I had to ${phrase.base} ${phrase.object} ${reportedTime}.`,
    `Maya said that she musted ${phrase.base} ${phrase.object} ${reportedTime}.`,
  ], "For past obligation, must usually changes to had to; musted is not a word.", "When must describes an obligation reported in the past, it usually changes to had to. I changes to she, and time expressions may shift with the reporting viewpoint.");
}

const possibilityTimes = [["tomorrow", "the next day"], ["next week", "the following week"], ["this afternoon", "that afternoon"], ["this month", "that month"], ["soon", "soon"]];
for (const phrase of phrases) for (const [directTime, reportedTime] of possibilityTimes) {
  const direct = `I may ${phrase.base} ${phrase.object} ${directTime}.`;
  const correct = `Maya said that she might ${phrase.base} ${phrase.object} ${reportedTime}.`;
  addQuestion(direct, correct, [
    `Maya said that she may ${phrase.base} ${phrase.object} ${reportedTime}.`,
    `Maya said that I might ${phrase.base} ${phrase.object} ${reportedTime}.`,
    `Maya said that she mighted ${phrase.base} ${phrase.object} ${reportedTime}.`,
  ], "May commonly backshifts to might in reported speech.", "May usually changes to might after said to report a past possibility. The speaker pronoun I changes to she, and future time expressions shift as needed.");
}

const questionTimes = [["every morning", "every morning"], ["on weekdays", "on weekdays"], ["today", "that day"], ["this week", "that week"], ["after class", "after class"]];
for (const phrase of phrases) for (const [directTime, reportedTime] of questionTimes) {
  const direct = `Do you ${phrase.base} ${phrase.object} ${directTime}?`;
  const correct = `Maya asked whether I ${phrase.past} ${phrase.object} ${reportedTime}.`;
  addQuestion(direct, correct, [
    `Maya asked whether did I ${phrase.base} ${phrase.object} ${reportedTime}.`,
    `Maya asked whether I do ${phrase.base} ${phrase.object} ${reportedTime}.`,
    `Maya asked whether she ${phrase.past} ${phrase.object} ${reportedTime}.`,
  ], "Use whether or if, change you to I, and use statement word order without do.", "A reported yes/no question uses whether or if and statement word order, so the auxiliary do disappears. The present simple usually backshifts to the past simple, and you becomes I from the reporter's viewpoint.");
}

const whTimes = ["before class", "after lunch", "at the library", "during the workshop", "on Fridays"];
for (const phrase of phrases) for (const time of whTimes) {
  const direct = `Where do you ${phrase.base} ${phrase.object} ${time}?`;
  const correct = `Maya asked where I ${phrase.past} ${phrase.object} ${time}.`;
  addQuestion(direct, correct, [
    `Maya asked where did I ${phrase.base} ${phrase.object} ${time}.`,
    `Maya asked where I do ${phrase.base} ${phrase.object} ${time}.`,
    `Maya asked where she ${phrase.past} ${phrase.object} ${time}.`,
  ], "Keep the wh-word, but use statement word order and backshift the verb.", "In a reported wh-question, keep the question word but use statement word order: where I checked, not where did I check. The present simple usually backshifts to the past simple, and you changes to I.");
}

if (questions.length !== 500) throw new Error(`Expected 500 questions, generated ${questions.length}.`);
if (new Set(questions.map((question) => question.direct)).size !== 500) throw new Error("Question sentences must be unique.");
fs.writeFileSync("database.json", `${JSON.stringify(questions, null, 2)}\n`);
console.log(`Generated ${questions.length} unique questions.`);
