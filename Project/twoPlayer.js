const tpStartButton = document.getElementById("tp-start-btn")
const questionContainerElement = document.getElementById("question-container")
const tpStartMessage = document.getElementById("tp-start-msg")
const nextButton = document.getElementById("next-btn")
const questionElement = document.getElementById("question")
const answerButtonsElement = document.getElementById("answer-buttons")
const questionCounter = document.getElementById("questionCounter")
const mainContainer = document.getElementById("container")
const topics = document.getElementById("topics")
const hud = document.getElementById("hud")

//These are the additional constants creacted for the two player mode:
const player = document.getElementById("player")
//Used to display whos turn it is
const playerOneScore = document.getElementById("p1score")
const playerTwoScore = document.getElementById("p2score")
//Holds the scores of each player
const endMessage = document.getElementById("end-msg")
const winner = document.getElementById("win")
//stores the player who won, dusolayed at end
const scores = document.getElementById("scores")
//stores the scores of each user, displayed at end

var correctSound = new Audio('correct.mp3');
var wrongSound = new Audio('wrong.mp3');

let shuffledQuestions, currentQuestionIndex

let playerOneCorrect = 0
let playerTwoCorrect = 0


tpStartButton.addEventListener("click",startTwoPlayer)
nextButton.addEventListener("click", () =>{
    currentQuestionIndex++
    setNextQuestion()
})

function showQuestion(question) {
    // Checks if the question number is a multiple of 2 (whose turn it is)
if ((currentQuestionIndex+1) % 2 == 0) {
    // If it is, then its player 2s turn
    player.innerText = "2"
    } else {
    // And if it isn't, it is player 1s turn
        player.innerText = "1"
    }
    // Updates the live score in the HUD for each player
    playerOneScore.innerText = playerOneCorrect
    playerTwoScore.innerText = playerTwoCorrect
    questionCounter.innerText = (currentQuestionIndex+1) + "/10" 
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
function twoPlayerEnd() {
    // Display the end message
    endMessage.classList.remove("hide")
    // Hide the questionContainerElement, questionElement, and hud elements
    questionContainerElement.classList.add("hide")
    questionElement.classList.add("hide")
    hud.classList.add("hide")
    // Determine the winner based on the number of correct answers each player has
    if (playerOneCorrect > playerTwoCorrect) {
        // Set the winner element's text to "Player 1 Wins!"
        winner.innerText = "Player 1 Wins!"
    } else if (playerTwoCorrect > playerOneCorrect) {
        // Set the winner element's text to "Player 2 Wins"
        winner.innerText = "Player 2 Wins"
    } else {
        // Set the winner element's text to "It's a draw, play rock paper scissors"
        winner.innerText = "It's a draw, play rock paper scissors"
    }
    // Set the scores element's text to display each player's score
    scores.innerText = "Player 1 scored " + playerOneCorrect + " out of 5 and Player 2 scored " + playerTwoCorrect + " out of 5"
}

// Define the function selectAnswer with parameter e (event)
function selectAnswer(e) {
    // Get the button element that was clicked and assign it to selectedButton
    const selectedButton = e.target
    // Get the value of the "data-correct" attribute of the selected button and assign it to correct
    const correct = selectedButton.dataset.correct
    // If the selected answer is correct
    if (correct) {
        // Play the correctSound audio file
        correctSound.play() 
        // If the current question is even, add one to playerTwoCorrect, else add one to playerOneCorrect
        if ((currentQuestionIndex+1) % 2 == 0) {
            playerTwoCorrect += 1
        } else {
            playerOneCorrect += 1
        }
    } else{
        // Play the wrongSound audio file if the selected answer is incorrect
        wrongSound.play()
    }
    // For each button element in the answerButtonsElement children,
    // set the status class based on whether the answer was correct or incorrect
    Array.from(answerButtonsElement.children).forEach(button => {
        if (button == selectedButton) {
            setStatusClass(button, button.dataset.correct)
        }
    })
    // If there are more questions remaining, show the nextButton and
    // move to the next question. Otherwise, end the quiz.
    if (shuffledQuestions.length > currentQuestionIndex + 1) {
        nextButton.classList.remove('hide')
        currentQuestionIndex++
        setNextQuestion()
    } else {
        twoPlayerEnd()
    }
}


let questions = [];

let selectedButton = '';

const buttons = document.querySelectorAll('.topic');

const waitForClick = new Promise(resolve => {
  buttons.forEach(button => {
    button.addEventListener('click', function() {
      selectedButton = button.innerHTML;
      resolve();
    });
  });
});



waitForClick.then(() => {
    fetch(selectedButton+ ".json")
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
    commenceTwoPlayer()
});


function commenceTwoPlayer() {
    mainContainer.classList.remove("hide")
    tpStartButton.classList.remove("hide")
    tpStartMessage.classList.remove("hide")
    topics.classList.add("hide")
}



function startTwoPlayer() {
    hud.classList.remove("hide")
    tpStartButton.classList.add("hide")
    tpStartMessage.classList.add("hide")
    questionContainerElement.classList.remove("hide")
    shuffledQuestions = questions.sort(() => Math.random() - 0.5)
    currentQuestionIndex = 0
    questionElement.classList.remove("hide")
    setNextQuestion()
}
