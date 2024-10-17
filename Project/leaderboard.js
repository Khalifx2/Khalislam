// get the reference to the list element where the high scores will be displayed
const highScoresList = document.getElementById("highScoresList")
// retrieve the high scores from local storage or set an empty array if there are none

const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

// map each score into an HTML list item element and join them into a single string
// which will be set as the innerHTML of the highScoresList
highScoresList.innerHTML = highScores
    .map(score =>{
        return(`<li class='high-score'>${score.name} - ${score.score}</li>`)
    }).join("")
