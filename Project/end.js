const username = document.getElementById("username");
const saveScoreBtn = document.getElementById("saveScoreBtn")
const finalScore = document.getElementById("finalScore")
const mostRecentScore = localStorage.getItem("mostRecentScore")

// Retrieve the "highScores" item from the local storage 
// or set an empty array if it doesn't exist
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

finalScore.innerText = mostRecentScore
// Updates the final score displayed on the end screen

// create an arrow function and pass in the event object as its parameter
saveHighScore = e => {
    // prevent the default behavior of the form submission
    e.preventDefault();

    // create an object to store the user's score and name
    const score = {
        score: mostRecentScore, // get the score from the mostRecentScore variable
        name: username.value // get the name from the username input field
    };

    // add the score object to the highScores array
    highScores.push(score)

    // sort the highScores array in descending order based on the score
    highScores.sort((a,b) => b.score - a.score)

    // keep only the top 5 scores in the highScores array
    highScores.splice(5)

    // store the updated highScores array in localStorage as a JSON string
    localStorage.setItem("highScores",JSON.stringify(highScores))

    // redirect the user to the index.html page
    window.location.assign("index.html")
}


username.addEventListener("keyup",() =>{
    saveScoreBtn.disabled=!username.value
})
// Whenever there is no username value, the save score button is disabled
