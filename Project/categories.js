const topic = document.getElementById("adam")


previous = document.referrer
let prev = previous.substr(22,previous.length)

console.log(topics)

if (prev="onePlayer.js") {
    topic.removeAttribute("onclick")
}