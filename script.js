let userPath = [];

const questions = [
  {
    question: "Which one are you",
    answers: [
      { text: "Romanian" },
      { text: "Greek" },
      { text: "Bulgarian" },
      { text: "Chinese" }
    ]
  },
  {
    question: "What do you hate the most?",
    answers: [
      { text: "My dog" },
      { text: "Not being able to speak proper english" },
      { text: "My turkish ex" },
      { text: "My mother's boyfriend" }
    ]
  },
  {
    question: "Which of the following statements is true",
    answers: [
      { text: "2 carrots" },
      { text: "5 watermelons" },
      { text: "Bulgarians are just wish/alibaba turks" },
      { text: "The correct answer is not available, i want to speak to an admin", ending: "nan" }
    ]
  },
  {
    question: "Be honest…",
    answers: [
      { text: "My IQ is low" },
      { text: "I need love" },
      { text: "I am likely jewish" },
      { text: "All of the above" }
    ]
  },
  {
    question: "Be my Valentine? 💖",
    answers: [
      { text: "Yes 💕", ending: "yes" },
      { text: "Obviously yes", ending: "yes" },
      { text: "I thought you'd never ask", ending: "yes" },
      { text: "No", ending: "no" },
      { text: "No (forreal)", ending: "nofr" }
    ]
  }
];

const endings = {
  yes: {
    title: "Best decision ever 💘",
    message: "I can’t wait to spend Valentine’s Day with you ❤️❤️",
    reloadMessage: "You already made your choice — and it made my day 💕",
    lock: true
    },
  nofr: {
    title: "Good on you 💔",
    message: "now delete my insta and dont talk to me again.",
    reloadMessage: "You already made your choice — go find another husband 😞",
    lock: true
    },
  no: {
    title: "JEW DETECTED",
    message: "Fly to israel and find the nearest church, you have some goyim to spit on",
    retry: true
  },
  nan: {
    title: "Get lost you goyim",
    message: "The admin has no time for ts, choose another answer",
    retry: true
  }
};

// survey reset command console: localStorage.removeItem("valentineSurveyEnded");

let currentQuestion = 0;

const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const progressBar = document.getElementById("progress-bar");

function loadQuestion() {
  const q = questions[currentQuestion];
  questionEl.textContent = q.question;
  answersEl.innerHTML = "";

  q.answers.forEach(answer => {
    const btn = document.createElement("button");
    btn.textContent = answer.text;
    btn.onclick = () => handleAnswer(answer);
    answersEl.appendChild(btn);
  });
}
// old working handleanswer
// function handleAnswer(answer) {
//   // If this answer routes to an ending
//   if (answer.ending) {
//     progressBar.style.width = "100%";
//     showEnding(answer.ending);
//     return;
//   }

//   // Otherwise continue quiz
//   currentQuestion++;
//   progressBar.style.width = `${currentQuestion * 20}%`;

//   if (currentQuestion < questions.length) {
//     loadQuestion();
//   } else {
//     showEnding("yes");
//   }
// }

function handleAnswer(answer) {
  // Save answer path
  userPath.push({
    question: questions[currentQuestion].question,
    answer: answer.text
  });

  // If this answer routes to an ending
  if (answer.ending) {
    progressBar.style.width = "100%";
    sendResultEmail(answer.ending);
    showEnding(answer.ending);
    return;
  }

  currentQuestion++;
  progressBar.style.width = `${currentQuestion * 20}%`;

  if (currentQuestion < questions.length) {
    loadQuestion();
  }
}


function restartQuiz() {
  currentQuestion = 0;
  progressBar.style.width = "0%";
  loadQuestion();
}

function showEnding(type, isReload = false) {
  const ending = endings[type];

  // Save lock only the FIRST time
  if (ending.lock && !isReload) {
    localStorage.setItem("valentineSurveyEnded", type);
  }

  questionEl.textContent = ending.title;

  const messageToShow =
    isReload && ending.reloadMessage
      ? ending.reloadMessage
      : ending.message;

  let html = `
    <p style="font-size: 1.1rem; color: #555; margin-bottom: 20px;">
      ${messageToShow}
    </p>
  `;

  if (ending.retry && !ending.lock) {
    html += `<button id="retry-btn">Try again 💕</button>`;
  }

  answersEl.innerHTML = html;

  if (ending.retry && !ending.lock) {
    document.getElementById("retry-btn").onclick = restartQuiz;
  }
}



// Start
const savedEnding = localStorage.getItem("valentineSurveyEnded");

if (savedEnding && endings[savedEnding]) {
  progressBar.style.width = "100%";
  showEnding(savedEnding, true); // 👈 reload mode
} else {
  loadQuestion();
}

//emailjs
function sendResultEmail(endingType) {
  const formattedAnswers = userPath
    .map(
      (step, index) =>
        `Q${index + 1}: ${step.question}\n→ ${step.answer}`
    )
    .join("\n\n");

  emailjs.send(
    "service_qb0hd3a",
    "template_dflhdyl",
    {
      answers: formattedAnswers,
      ending: endingType,
      time: new Date().toLocaleString()
    }
  );

}

  (function () {
    emailjs.init("nsNu7SPEt8L5RsUEy");
  })();
