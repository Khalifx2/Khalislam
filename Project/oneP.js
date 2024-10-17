const opStartButton = document.getElementById("op-start-btn")
const questionContainerElement = document.getElementById("question-container")
const opStartMessage = document.getElementById("op-start-msg")
const nextButton = document.getElementById("next-btn")
const questionElement = document.getElementById("question")
const answerButtonsElement = document.getElementById("answer-buttons")
const questionCounter = document.getElementById("questionCounter")
const score = document.getElementById("score")
const mainContainer = document.getElementById("container")
const topics = document.getElementById("topics")
const hud = document.getElementById("hud")

var correctSound = new Audio('correct.mp3');
var wrongSound = new Audio('wrong.mp3');


let shuffledQuestions, currentQuestionIndex
let right = 0

opStartButton.addEventListener("click",startOnePlayer)
nextButton.addEventListener("click", () =>{
    currentQuestionIndex++
    setNextQuestion()
})

function showQuestion(question) {
    questionCounter.innerText = (currentQuestionIndex+1) + "/10" 
    score.innerText = right 
    questionElement.innerText = question.question
    question.answers.forEach(answer => {
        const button = document.createElement("button")
        button.innerText = answer.text
        button.classList.add("btn")
        if (answer.correct) {
            button.dataset.correct = answer.correct
        }
        button.addEventListener("click",selectAnswer)
        answerButtonsElement.appendChild(button)
    });
}

function setNextQuestion() {
    resetState()
    showQuestion(shuffledQuestions[currentQuestionIndex])
}


function resetState() {
    nextButton.classList.add("hide")
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild)
    }
}

function setStatusClass(element, correct) {
    clearStatusClass(element)
    if (correct) {
        element.classList.add("correct")
    } else {
        element.classList.add("wrong")
    }
}

function clearStatusClass(element) {
    element.classList.remove("correct")
    element.classList.remove("wrong")
}

function selectAnswer(e) {
    const selectedButton = e.target
    const correct = selectedButton.dataset.correct
    if (correct) {
        right += 1
        correctSound.play();
    } else{
        wrongSound.play()
    }
    Array.from(answerButtonsElement.children).forEach(button => {
        if (button == selectedButton) {
            setStatusClass(button, button.dataset.correct)
        }
    })
    if (shuffledQuestions.length > currentQuestionIndex + 1) {
        nextButton.classList.remove('hide')
        currentQuestionIndex++
        setNextQuestion()
    } else {
        localStorage.setItem("mostRecentScore",right)
        location.href = 'end.html';
        right = 0
    }
  }

let questions = [];

var a = ""

const topicButtons = document.querySelectorAll('.topic');

topicButtons.forEach(item => {
    item.addEventListener('click', () =>{
        a =item.innerHTML
        startOnePlayer()
    })
  })
  
console.log(a)

fetch(a+ ".json")
    .then(Response => {
        return Response.json();
    })
    .then(loadedQuestions => {
        questions = loadedQuestions;
        ;
    })
    .catch(err =>{
        console.error(err);
    })

function startOnePlayer() {
    opStartButton.classList.add("hide")
    opStartMessage.classList.add("hide")
    questionContainerElement.classList.remove("hide")
    mainContainer.classList.remove("hide")
    shuffledQuestions = questions.sort(()=> Math.random -.5)
    currentQuestionIndex = 0
    questionElement.classList.remove("hide")
    setNextQuestion()
}

function commenceOnePlayer(btn) {
    opStartButton.classList.remove("hide")
    opStartMessage.classList.remove("hide")
}