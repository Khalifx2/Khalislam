const streakStartButton = document.getElementById("streak-start-btn")
const questionContainerElement = document.getElementById("question-container")
const streakStartMessage = document.getElementById("streak-start-msg")
const nextButton = document.getElementById("next-btn")
const questionElement = document.getElementById("question")
const answerButtonsElement = document.getElementById("answer-buttons")
const questionCounter = document.getElementById("questionCounter")
const score = document.getElementById("score")
const mainContainer = document.getElementById("container")
const topics = document.getElementById("topics")
const hud = document.getElementById("hud")
const scored = document.getElementById("scored")
const endMessage = document.getElementById("end-msg")
const wrongHUD = document.getElementById("wrong")

var correctSound = new Audio('correct.mp3');
var wrongSound = new Audio('wrong.mp3');


let shuffledQuestions, currentQuestionIndex

// right keeps count of the # questions correct
let right = 0
// wrong keeps count of the # questions wrong
let wrong = 0

streakStartButton.addEventListener("click",startStreakPlayer)
nextButton.addEventListener("click", () =>{
    currentQuestionIndex++
    setNextQuestion()
})

function showQuestion(question) {
    questionCounter.innerText = (currentQuestionIndex+1)
    score.innerText = right 
    wrongHUD.innerText = wrong
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

function streakEnd() {
    // Sets the mostRecentScore key in localStorage to the value of right
    localStorage.setItem("mostRecentScore",right)
    // Redirects the user to the end.html page where they will input their name
    location.href = "end.html"
}


function selectAnswer(e) {
    const selectedButton = e.target
    const correct = selectedButton.dataset.correct
    if (correct) {
        right += 1
        correctSound.play()
    } else{
        // If the selected answer is incorrect, increment wrong by 1 and play the wrongSound audio file
        wrong += 1
        wrongSound.play()
    }
    Array.from(answerButtonsElement.children).forEach(button => {
        if (button == selectedButton) {
            setStatusClass(button, button.dataset.correct)
        }
    })
    // If the player has answered three questions incorrectly in a row, end the streak.
    if (wrong>=3) {
        streakEnd()
    // Otherwise, if there are more questions remaining,move to the next question.
    } else if (shuffledQuestions.length > currentQuestionIndex + 1) {
        currentQuestionIndex++
        setNextQuestion()
    } else {
        streakEnd()
    }
}


let questions = [];


// questions.json is fetched
fetch("questions.json")
// It contains all the questions from every topic
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



function startStreakPlayer() {
    hud.classList.remove("hide")
    streakStartButton.classList.add("hide")
    streakStartMessage.classList.add("hide")
    questionContainerElement.classList.remove("hide")
    shuffledQuestions = questions.sort(() => Math.random() - 0.5)
    currentQuestionIndex = 0
    questionElement.classList.remove("hide")
    setNextQuestion()
}
