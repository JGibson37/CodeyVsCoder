export { renderAllContent };
import {
  fetchQuestion,
  fetchQuestions,
  submitQuestion,
} from "./fetchQuestions.js";
import { questionGrabber } from "./gameLoop.js";

const walkieTalkie = new Audio("audio/walkie-talkie.mp3");
const codeyStart = new Audio("audio/codey-start.wav");
const codeyEnd = new Audio("audio/codey-end.wav");
const backgroundMusic = new Audio("audio/backgroundMusic.mp3");
codeyStart.volume = 0.5;
codeyEnd.volume = 0.5;
walkieTalkie.volume = 0.4;
backgroundMusic.volume = 0.05;
const numberOfTries = document.querySelector(".score");
const totalNumberOfTries = document.querySelector(".total-score");
const unMute = document.querySelector(".unmute");
const mute = document.querySelector(".mute");

mute.addEventListener("click", () => {
  walkieTalkie.muted = true;
  codeyStart.muted = true;
  backgroundMusic.muted = true;
  codeyEnd.muted = true;
  mute.classList.add("hidden");
  unMute.classList.remove("hidden");
});

unMute.addEventListener("click", () => {
  walkieTalkie.muted = false;
  codeyStart.muted = false;
  backgroundMusic.muted = false;
  codeyEnd.muted = false;
  unMute.classList.add("hidden");
  mute.classList.remove("hidden");
});

const renderAllContent = (question, turnCounter) => {
  backgroundMusic.play();
  renderWrongIframeContent(question);
  renderWholeErrorCode(question, turnCounter);
  renderCodeyStartingDialogue(question);
  renderGroundControlBeginning(question);
  codeyMoodShift("bored");
  developerTabClickable();
};
const renderWrongIframeContent = (question) => {
  const renderIFrameQuestion = document.querySelector(".iframe-display");
  renderIFrameQuestion.srcdoc = question.iframeWrong;
};

const renderCorrectIFrameContent = (question) => {
  const iframeDisplay = document.querySelector(".iframe-display");
  iframeDisplay.srcdoc = question.iframeCorrect;
};

const renderWholeErrorCode = (question, turnCounter) => {
  const codeBlock = document.querySelector(".question-code-block");
  while (codeBlock.firstChild) {
    codeBlock.firstChild.remove();
  }
  const beforeError = document.createElement("p");
  beforeError.innerText = `${question.beforeErrorCode}`;
  beforeError.addEventListener("click", function beforeListener() {
    beforeError.removeEventListener("click", beforeListener);
    renderGroundControlHint(question);
    walkieTalkie.play();
    numberOfTries.innerHTML = Number(numberOfTries.innerHTML) + 1;
    totalNumberOfTries.innerHTML = Number(totalNumberOfTries.innerHTML) + 1;
  });
  codeBlock.appendChild(beforeError);
  const errorCode = document.createElement("p");
  errorCode.classList.add("error--block");
  errorCode.classList.remove("highlight--corrected");
  errorCode.innerText = `${question.errorCode}`;

  errorCode.addEventListener("click", function listener() {
    errorCode.removeEventListener("click", listener);
    updateAllDisplays(question, turnCounter);
    numberOfTries.innerHTML = Number(numberOfTries.innerHTML) + 1;
    totalNumberOfTries.innerHTML = Number(totalNumberOfTries.innerHTML) + 1;
  });
  codeBlock.appendChild(errorCode);
  const afterError = document.createElement("p");
  afterError.innerText = `${question.afterErrorCode}`;
  afterError.addEventListener("click", function afterListener() {
    afterError.removeEventListener("click", afterListener);
    renderGroundControlHint(question);
    walkieTalkie.play();
    numberOfTries.innerHTML = Number(numberOfTries.innerHTML) + 1;
    totalNumberOfTries.innerHTML = Number(totalNumberOfTries.innerHTML) + 1;
  });
  codeBlock.appendChild(afterError);
  const fakeCode = document.querySelector(".overlay");
  fakeCode.innerText = ``;
  const fakeCodeContainer = document.createElement("code");
  fakeCodeContainer.innerText = `${question.beforeErrorCode}${question.errorCode}${question.afterErrorCode}`;
  fakeCode.appendChild(fakeCodeContainer);
};

const updateAllDisplays = (question, turnCounter) => {
  renderGroundControlFinished(question, turnCounter);
  renderCorrectIFrameContent(question);
  renderCorrectCodeBlock(question);
  codeyMoodShift("surprised");
  renderCodeyEndingDialogue(question);
};

const renderCorrectedError = (question) => {
  const fakeCode = document.querySelector(".overlay");
  fakeCode.innerText = ``;
  const fakeCodeContainer = document.createElement("code");
  const beforeError = document.createElement("p");
  beforeError.innerText = `${question.beforeErrorCode}`;
  const correctedError = document.createElement("p");
  correctedError.classList.add("highlight--corrected");
  correctedError.innerText = `${question.correctedError}`;
  const afterError = document.createElement("p");
  afterError.innerText = `${question.afterErrorCode}`;
  fakeCodeContainer.appendChild(beforeError);
  fakeCodeContainer.appendChild(correctedError);
  fakeCodeContainer.appendChild(afterError);
  fakeCode.appendChild(fakeCodeContainer);
  const codeTag = document.querySelector(".error--block");
  codeTag.classList.add("highlight--corrected");
  codeTag.innerText = `${question.correctedError}`;
  codeTag.removeEventListener("click", () => {
    updateAllDisplays(question, turnCounter);
  });
};

const renderCorrectCodeBlock = (question) => {
  renderCorrectedError(question);
};

const renderCodeyEndingDialogue = (question) => {
  const pTag = document.querySelector(".codey-dialogue");
  pTag.innerHTML = "";
  const text = `${question.codeyEndingDialogue}`;
  let i = 0;
  codeyEnd.play();
  typeWriter();
  function typeWriter() {
    on();
    if (i < text.length) {
      pTag.innerHTML += text.charAt(i);
      i++;
      setTimeout(typeWriter, 30);
    }
    if (i == text.length) {
      off();
    }
  }
};

const renderCodeyStartingDialogue = (question) => {
  const pTag = document.querySelector(".codey-dialogue");
  pTag.innerHTML = "";
  const text = `${question.codeyStartingDialogue}`;
  let i = 0;
  codeyStart.play();
  typeWriter();
  function typeWriter() {
    on();
    if (i < text.length) {
      pTag.innerHTML += text.charAt(i);
      i++;
      setTimeout(typeWriter, 30);
    }
    if (i == text.length) {
      off();
    }
  }
};

const renderGroundControlBeginning = (question) => {
  const pTag = document.querySelector(".ground-control-dialogue");
  pTag.innerHTML = "";
  const text = `${question.groundControlBeginningDialogue}`;
  let i = 0;
  typeWriter();
  on();
  function typeWriter() {
    if (i < text.length) {
      pTag.innerHTML += text.charAt(i);
      i++;
      setTimeout(typeWriter, 30);
    }
  }
  if (i == text.length) {
    off();
  }
};

const renderGroundControlFinished = (question, turnCounter) => {
  const pTag = document.querySelector(".ground-control-dialogue");
  pTag.innerHTML = "";
  const text = `${question.groundControlCompletedDialogue}`;
  let i = 0;
  typeWriter();
  function typeWriter() {
    on();
    if (i < text.length) {
      pTag.innerHTML += text.charAt(i);
      i++;
      setTimeout(typeWriter, 30);
    }
    if (i == text.length) {
      continueContainer.prepend(continueButton);
    }
    if (i == text.length) {
      off();
    }
  }
  const continueContainer = document.querySelector(".continue-button");
  const continueButton = document.createElement("button");
  continueButton.innerText = "Continue";
  continueButton.addEventListener("click", () => {
    numberOfTries.firstChild.remove();
    continueContainer.firstChild.remove();
    questionGrabber();
  });
};

const renderGroundControlHint = (question) => {
  const pTag = document.querySelector(".ground-control-dialogue");
  pTag.innerHTML = "";
  const text = `${question.hintText}`;
  let i = 0;
  typeWriter();
  function typeWriter() {
    on();
    if (i < text.length) {
      pTag.innerHTML += text.charAt(i);
      i++;
      setTimeout(typeWriter, 30);
    }

    if (i == text.length) {
      off();
    }
  }
};

const developerTabClickable = () => {
  const sTag = document.querySelector(".developer-tab");
  sTag.innerText = `Developers`;
  const gTab = document.querySelector(".game-tab");
  gTab.innerText = `Codeys Game`;
  sTag.addEventListener("click", () => {
    renderDeveloperTab();
  });
};

const renderDeveloperTab = () => {
  const modal = document.getElementById("developer-modal");
  modal.style.display = "block";
  const sTag = document.getElementsByClassName("close-modal")[0];
  sTag.onclick = () => {
    modal.style.display = "none";
  };
};

const codeyMoodShift = (mood) => {
  const codeyImg = document.querySelector(".clippy-img");
  if (mood === "bored") {
    codeyImg.src = "./images/codeyboredloop1darker.gif";
  } else if (mood === "surprised") {
    codeyImg.src = "./images/codeysurprised1darker.gif";
  }
};

function on() {
  const overlay = document.querySelector(".overlay");
  const wholeCode = document.querySelector(".whole-code");
  wholeCode.style.display = "none";
  overlay.style.display = "block";
  overlay.style.zIndex = "2";
}

function off() {
  const overlay = document.querySelector(".overlay");
  const wholeCode = document.querySelector(".whole-code");
  wholeCode.style.display = "block";
  overlay.style.zIndex = "-1";
  overlay.style.display = "none";
}
