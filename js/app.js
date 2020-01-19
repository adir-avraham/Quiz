const TRIVIA_DOM = {
  question_title: document.getElementById("question"),
  inputA: document.getElementById("choiceA"),
  inputB: document.getElementById("choiceB"),
  inputC: document.getElementById("choiceC"),
  inputD: document.getElementById("choiceD"),
  submit_button: document.getElementById("submitBtn"),
  counter_question: document.getElementById("counterQuestions"),
  question_div: document.getElementById("questionDiv"),
  results_div: document.getElementById("resultsDiv"),
  full_question: document.getElementById("fullQuestion"),
  added_choiceA: document.getElementById("addedChoiceA"),
  added_choiceB: document.getElementById("addedChoiceB"),
  added_choiceC: document.getElementById("addedChoiceC"),
  added_choiceD: document.getElementById("addedChoiceD"),
  correct_answer: document.getElementById("answer"),
  add_question_div: document.getElementById("addQuestionDiv"),
  submit_question_button: document.getElementById("submitQuestionButton"),
  add_question_form: document.getElementById("addQuestionForm"),
};

function draw(arrayOfQuestions, questionCounter) {
  if (!arrayOfQuestions[questionCounter]) {
    return showResults();
  }

  const { question_title, inputA, inputB, inputC, inputD, counter_question, question_div } = TRIVIA_DOM;

  if (question_div.style.display === "none") {
    question_div.style.display = "block";
  }
  question_title.innerText = arrayOfQuestions[questionCounter].question;

  inputA.innerHTML = arrayOfQuestions[questionCounter].choiceA;
  inputA.previousElementSibling.checked = false
  inputB.innerText = arrayOfQuestions[questionCounter].choiceB;
  inputB.previousElementSibling.checked = false;
  inputC.innerText = arrayOfQuestions[questionCounter].choiceC;
  inputC.previousElementSibling.checked = false;
  inputD.innerText = arrayOfQuestions[questionCounter].choiceD;
  inputD.previousElementSibling.checked = false;

  counter_question.innerText = `Question ${questionCounter + 1} of ${
    arrayOfQuestions.length
  }`;
}

document.querySelector("#submitBtn").addEventListener("click", getAnswer);

function getAnswer() {
  const { inputA, inputB, inputC, inputD } = TRIVIA_DOM;
  const choice = [inputA, inputB, inputC, inputD];
  const answer = choice.find(c => c.previousElementSibling.checked);
  if (!answer) return alert("Please select your answer");
  const userAnswer = answer.previousElementSibling.value;
  checkAnswer(userAnswer);
}

function checkAnswer(userAnswer) {
  if (arrayOfQuestions[questionCounter].correct === userAnswer) {
    arrayOfQuestions[questionCounter].isCorrect = true;
    correctAnswers++;
  }
  questionCounter++;
  draw(arrayOfQuestions, questionCounter);
}

function showResults() {
  const { question_div, results_div } = TRIVIA_DOM;
  const ul = document.createElement("ul");
  const retakeButton = document.createElement("button");
  const addQuestionButton = document.createElement("button");
  const levelMessage = document.createElement("div"); 

  levelMessage.className = "alert alert-info";
                             
  results_div.style.display = "inline-block";

  retakeButton.className = "btn btn-info btn-sm mt-1";
  retakeButton.innerText = "Retake the quiz!";
  retakeButton.id = "retakeButton";
  retakeButton.addEventListener("click", retake);

  addQuestionButton.className = "btn btn-info btn-sm mt-1 ml-3";
  addQuestionButton.innerText = "Contribute to question set!";
  addQuestionButton.id = "addQuestionButton";
  addQuestionButton.addEventListener("click", addQuestionPage);

  ul.className = "list-group";
  question_div.style.display = "none";
  
  switch (correctAnswers) {
    case 8:
      levelMessage.innerText = "Your level of English: Fluent";
    break;
    case 7:
      levelMessage.innerText = "Your level of English: Advanced";
    break;
    case 6:
      levelMessage.innerText = "Your level of English: Advanced";
    break;
    case 5:
      levelMessage.innerText = "Your level of English: Intermediate";
    break;
    case 4:
      levelMessage.innerText = "Your level of English: Intermediate";
    break;
    default:
      levelMessage.innerText = "Your level of English: Beginner";
  }

  for (let i = 0; arrayOfQuestions.length >= i; i++) {
    if (!arrayOfQuestions[i]) return;
    if (arrayOfQuestions[i].isCorrect) {
      const li = document.createElement("li");
      li.className = "list-group-item text-center text-success p-1";
      li.innerText = `Question ${i + 1}: correct `;
      ul.append(li);
    } else {
      const li = document.createElement("li");
      li.className = "list-group-item text-center text-danger p-1";
      li.innerText = `Question ${i + 1}: incorrect `;
      ul.append(li);
    }
    results_div.append(levelMessage ,ul, retakeButton, addQuestionButton);
  }
}

function init() {
  questionCounter = 0;
  arrayOfQuestions = JSON.parse(localStorage.getItem("questions")) || arrayOfQuestions;
  draw(arrayOfQuestions, questionCounter);
}

function retake() {
  const { results_div, counter_question } = TRIVIA_DOM;
  results_div.innerHTML = "";
  questionCounter = 0;
  correctAnswers = 0;
  arrayOfQuestions.forEach(question => {
    if (question.isCorrect) {
      question.isCorrect = false;
    }
  });
  counter_question.innerText = `Question ${questionCounter + 1} of ${ arrayOfQuestions.length }`;
  init();
}

function addQuestionPage() {
  const { add_question_div, submit_question_button, results_div } = TRIVIA_DOM;
  results_div.innerHTML = "";
  if (add_question_div.style.display === "none") {
    add_question_div.style.display = "inline-block";
  }
  submit_question_button.addEventListener("click", saveQuestion);
}

function saveQuestion() {
  const { full_question, added_choiceA, added_choiceB, added_choiceC, added_choiceD, correct_answer, add_question_div, add_question_form } = TRIVIA_DOM;
  if ( !full_question.value || !added_choiceA.value || !added_choiceB.value || !added_choiceC.value || !added_choiceD.value || !correct_answer.value )
    return alert("Please complete the form");
  
  const new_question = {
    question: full_question.value,
    choiceA: added_choiceA.value,
    choiceB: added_choiceB.value,
    choiceC: added_choiceC.value,
    choiceD: added_choiceD.value,
    correct: correct_answer.value,
    isCorrect: false
  };
  arrayOfQuestions.push(new_question);
  add_question_form.reset();
  saveToLocalStorage("questions", arrayOfQuestions);
  alert("Your question saved!");
  add_question_div.style.display = "none";
  init();
}

function saveToLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

init();
