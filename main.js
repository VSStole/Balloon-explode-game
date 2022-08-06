 'use strict';

let clickCount = 0;
let height = 150;
let width = 170;
let inflationRate = 20;
let maxsize = 330;
let highestExplodeCount = 0;
let currentExplodeCount = 0;
let gameLength = 33000;
let clockId = 0;
let timeRemaining = 0;
let currentPlayer = {};
let currentColor = 'red'
let possibleColors = ['green', 'blue', 'purple', 'pink', 'yellow', 'silver', 'brown', 'black'];
const gameControls = document.getElementById('game-controls');
const mainControls = document.getElementById('main-controls');
const scoreBoard = document.getElementById('scoreboard');
const countdown = document.getElementById('countdown');
const balloon = document.getElementById('balloon');
const explodeSound = document.getElementById('explode-sound');
const explodeCount = document.getElementById('explode-count');
const highExplodeCount = document.getElementById('high-explode-count');
let game = document.getElementById("game");
const playerForm = document.getElementById('player-form');

//console.log();



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
    clockId = setInterval(drawClock, 100)
}

function stopClock() {
    clearInterval(clockId)
}
function drawClock() {
    countdown.innerText = (timeRemaining / 1000).toString()
    timeRemaining -= 100
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
    checkballoonExplode()
    draw()
}
function checkballoonExplode() {
    if (height >= maxsize) {
        console.log('explode the balloon')
        balloon.classList.remove(currentColor)
        getRandomColor()
        balloon.classList.add(currentColor)
        //@ts-ignore

        explodeSound.play()
        currentExplodeCount++
        height = 30
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
    let explodeCountElem = document.getElementById('explode-count')
    let highExplodeCountElem = document.getElementById('high-explode-count')
    let playerNameElem = document.getElementById('player-name')

    balloonElement.style.height = height + "px"
    balloonElement.style.width = width + "px"

    clickCountElem.innerText = clickCount.toString()
    explodeCountElem.innerText = currentExplodeCount.toString()
    highExplodeCountElem.innerText = currentPlayer.topScore.toString()

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

    if (currentExplodeCount > currentPlayer.topScore) {
        currentPlayer.topScore = currentExplodeCount
        savePlayers()
    }

    currentExplodeCount = 0

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
// function changePlayer() {
//     document.getElementById("player-form").classList.remove("hidden")
//     document.getElementById("game").classList.add("hidden")
//   }
function changePlayer() {
  playerForm.classList.remove("hidden")
    game.classList.add("hidden")
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
        </span>
        <span>score: ${player.topScore}</span></div>`
    })
    document.getElementById("players").innerHTML = template
}


drawScoreboard()


