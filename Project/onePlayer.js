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
const scored = document.getElementById("scored")
const endMessage = document.getElementById("end-msg")

//I've stored the audio files in the project folder
//and then stored each sound in a constant
var correctSound = new Audio('correct.mp3');
var wrongSound = new Audio('wrong.mp3');


let shuffledQuestions, currentQuestionIndex
let right = 0

opStartButton.addEventListener("click", startOnePlayer)
nextButton.addEventListener("click", () => {
    currentQuestionIndex++
    setNextQuestion()
})

function showQuestion(question) {
    questionCounter.innerText = (currentQuestionIndex + 1) + "/10"
    score.innerText = right
    questionElement.innerText = question.question
    question.answers.forEach(answer => {
        const button = document.createElement("button")
        button.innerText = answer.text
        button.classList.add("btn")
        if (answer.correct) {
            button.dataset.correct = answer.correct
        }
        button.addEventListener("click", selectAnswer)
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

function onePlayerEnd() {
    endMessage.classList.remove("hide")
    questionContainerElement.classList.add("hide")
    questionElement.classList.add("hide")
    hud.classList.add("hide")
    opStartButton.classList.add("hide")
    opStartButton.innerText = "Restart"
    scored.innerText = "You scored " + right + " out of 10"
}

function selectAnswer(e) {
    const selectedButton = e.target
    const correct = selectedButton.dataset.correct
    if (correct) {
        right += 1
        correctSound.play()
    } else {
        wrongSound.play()
    }
//Here I check if the users selected button is the correct answer.
//If it is correct, then i add 1 to the users score and also play the sound stored in the correctSound
//If it is incorrect, then the sound stored in wrongSound is played 
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
        onePlayerEnd()
    }
}

// Declared an empty array to store questions
let questions = [];

// Declared a variable to store the clicked button's inner HTML
let selectedButton = '';

// This selects all the elements with the class "topic" and stores them in a constant
const buttons = document.querySelectorAll('.topic');

// I Created a new Promise object that resolves when a button is clicked
const waitForClick = new Promise(resolve => {
    buttons.forEach(button => {
        // Add a click event listener to each button
        button.addEventListener('click', function () {
            // Store the inner HTML of the clicked button in the selectedButton variable
            selectedButton = button.innerHTML;
            // Resolve the waitForClick Promise
            resolve();
        });
    });
});

// After the Promise is resolved, fetch the JSON file with the selected button's name and load its contents
waitForClick.then(() => {
    fetch(selectedButton + ".json")
        .then(Response => {
            // Parse the JSON response
            return Response.json();
        })
        .then(loadedQuestions => {
            // Store the loaded questions in the questions array
            questions = loadedQuestions;
            ;
        })
        .catch(err => {
            // Log any errors that occur during the fetch and JSON parsing process
            console.error(err);
        })
    // Call the commenceOnePlayer function to start the quiz game
    commenceOnePlayer()
});


function commenceOnePlayer() {
    mainContainer.classList.remove("hide")
    opStartButton.classList.remove("hide")
    opStartMessage.classList.remove("hide")
    topics.classList.add("hide")
}



function startOnePlayer() {
    hud.classList.remove("hide")
    opStartButton.classList.add("hide")
    opStartMessage.classList.add("hide")
    questionContainerElement.classList.remove("hide")
    shuffledQuestions = questions.sort(() => Math.random() - 0.5)
    currentQuestionIndex = 0
    questionElement.classList.remove("hide")
    setNextQuestion()
}
