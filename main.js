'use strict';

let clickCount = 0
let height = 160
let width = 200
let inflationRate = 20
let maxsize = 400
let highestPopCount = 0
let currentPopCount = 0
let gameLength = 50000
let clockId = 0
let timeRemaining = 0
let currentPlayer = {}
let currentColor = 'red'
let possibleColors = [ 'green', 'blue', 'purple', 'pink', 'yellow', 'silver', 'brown', 'black']
const gameControls = document.getElementById('game-controls');
const mainControls = document.getElementById('main-controls');
const scoreBoard = document.getElementById('scoreboard');
const countdown = document.getElementById('countdown');
const balloon = document.getElementById('balloon');
const popSound = document.getElementById('pop-sound');
const popCount = document.getElementById('pop-count');
const playerName = document.getElementById('player-name');
const highpopCount = document.getElementById('high-pop-count');
const game = document.getElementById("game");
const playerForm = document.getElementById('player-form');





function startGame() {
    gameControls.classList.remove("hidden")
    mainControls.classList.add("hidden")
    scoreBoard.classList.add("hidden")
    startClock()
    setTimeout(stopGame, gameLength)
}


function startClock() {
    timeRemaining = gameLength
    drawClock()
    clockId = setInterval(drawClock, 1000)
}

function stopClock() {
    clearInterval(clockId)
}
function drawClock() {
    countdown.innerText = (timeRemaining / 1000).toString()
    timeRemaining -= 1000
}
// function drawClock() {
//     let countdownElem = document.getElementById('countdown')
//     countdownElem.innerText = (timeRemaining / 1000).toString()
//     timeRemaining -= 1000
//   }

function inflate() {
    clickCount++
    height += inflationRate
    width += inflationRate
    checkBalloonPop()
    draw()
}
function checkBalloonPop() {
    if (height >= maxsize) {
        console.log('pop the balloon')
        balloon.classList.remove(currentColor)
        getRandomColor()
        balloon.classList.add(currentColor)
        //@ts-ignore

        popSound.play()
        currentPopCount++
        height = 40
        width = 0
    }
}

function getRandomColor() {
    let i = Math.floor(Math.random() * possibleColors.length);
    currentColor = possibleColors[i]
}



function draw() {
    let balloonElement = document.getElementById("balloon")
    let clickCountElem = document.getElementById("click-count")
    let popCountElem = document.getElementById('pop-count')
    let highPopCountElem = document.getElementById('high-pop-count')
    let playerNameElem = document.getElementById('player-name')
  
    balloonElement.style.height = height + "px"
    balloonElement.style.width = width + "px"
  
    clickCountElem.innerText = clickCount.toString()
    popCountElem.innerText = currentPopCount.toString()
    highPopCountElem.innerText = currentPlayer.topScore.toString()
  
    playerNameElem.innerText = currentPlayer.name
  }



function stopGame() {
    console.log("the game is over")
    mainControls.classList.remove('hidden')
    scoreBoard.classList.remove('hidden')
    gameControls.classList.add('hidden')

    clickCount = 0
    height = 120
    width = 100

    if (currentPopCount > currentPlayer.topScore) {
        currentPlayer.topScore = currentPopCount
        savePlayers()
    }

    currentPopCount = 0

    stopClock()
    draw()
    drawScoreboard()
}
//console.log(balloonElement,clickCounElement,popCountElem)

//endregion
let players = []
loadPlayers()

function setPlayer(event) {
    event.preventDefault()
    let form = event.target

    let playerName = form.playerName.value

    currentPlayer = players.find(player => player.name == playerName)

    if (!currentPlayer) {
        currentPlayer = { name: playerName, topScore: 0 }
        players.push(currentPlayer)
        savePlayers()
    }

    form.reset()
    game.classList.remove("hidden")
    form.classList.add("hidden")
    draw()
    drawScoreboard()
}
function changePlayer() {
    playerName.classList.remove("hidden")
    form.classList.add("hidden")
}



function savePlayers() {
    window.localStorage.setItem("players", JSON.stringify(players))
}
function loadPlayers() {
    let palayersData = JSON.parse(window.localStorage.getItem("players"))
    if (palayersData) {
        players = palayersData
    }

}
function drawScoreboard() {
    let template = ""

    players.sort((p1, p2) => p2.topScore - p1.topScore)
    players.forEach(player => {
        template += `
        <div class="d-flex space-between">
        <span>
        <i class="fa fa-user"></i>
        ${player.name}
        </div>
        <span>score:${player.topScore}</span></div>`
    })
    document.getElementById("players").innerHTML = template
}


drawScoreboard()

