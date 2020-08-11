const socket = io('http://localhost:3000');

const totalScores = document.getElementById('total-scores');
const roundScores = document.getElementById('round-scores');
const scoreToggleButton = document.getElementById('toggle-scores');
const messageContainer = document.getElementById('message-container');
const startButton = document.getElementById('start');
const rose1Button = document.getElementById('rose1');
const rose2Button = document.getElementById('rose2');
const rose3Button = document.getElementById('rose3');
const skullButton = document.getElementById('skull');
const betMessage = document.getElementById('bet-input');
const betButton = document.getElementById('bet');
const passButton = document.getElementById('pass');
const cards = [rose1Button, rose2Button, rose3Button, skullButton];
for (i = 0; i < 4; i++) {
    cards[i].style.display = "none";
}
const player1Button = document.getElementById('player1');
const player2Button = document.getElementById('player2');
const player3Button = document.getElementById('player3');
const player4Button = document.getElementById('player4');
const player5Button = document.getElementById('player5');
const player6Button = document.getElementById('player6');
const player7Button = document.getElementById('player7');
const player8Button = document.getElementById('player8');
const player9Button = document.getElementById('player9');
const players = [player1Button, player2Button, player3Button, player4Button, player5Button, player6Button, player7Button, player8Button, player9Button];
for (i=0; i<players.length; i++) {
    players[i].style.display = "none";
}
var matchPlayers = {};
for (i=0; i<players.length; i++) {
    players[i].addEventListener('click', button => {
        socket.emit('reveal-card', matchPlayers[players[i]])
        for (i=0; i<players.length; i++) {
            players[i].style.display = "none";
        }
        });
    
}
betMessage.style.display = "none";
betButton.style.display = "none";
passButton.style.display = "none";
roundScores.style.display = "none";
totalScores.style.display = "none";
scoreToggleButton.style.display = "none";
var total = true;


scoreToggleButton.addEventListener('click', button => {
    if (total) {
        roundScores.style.display = "block";
        totalScores.style.display = "none";
        scoreToggleButton.innerText = "Show Total Scores"
        total = false;
    } else {
        roundScores.style.display = "none";
        totalScores.style.display = "block";
        scoreToggleButton.innerText = "Show Round Scores"
        total = true;
    }
})


const name = prompt("What is your name?");
appendMessage('You joined');
socket.emit('new-user', name);
var playing = true;

var totalScoresText = `${name} - 0`;
var roundScoresText = `${name} - 0`;
totalScores.innerText = totalScoresText;
roundScores.innerText = roundScoresText;

socket.on('message', mes => {
    appendMessage(mes);
})

socket.on('user-connected',name  => {
    appendMessage(name + ' connected');
    totalScoresText += `\n${name} - 0`
    roundScoresText += `\n${name} - 0`
    totalScores.innerText = totalScoresText;
    roundScores.innerText = roundScoresText;

});

socket.on('user-disconnected', name => {
    appendMessage(name + ' disconnected');
});

socket.on('started', () => {
    startButton.style.display = "none";
    socket.emit("player-turn");
})

socket.on('choose-card', roundInfo => {
    if (roundInfo['sid'] == socket.id){
        betMessage.style.display = "block";
        betButton.style.display = "block";
        for (i=0; i<4; i++) {
            if (roundInfo['cards'][i]){
                cards[i].style.display = "block";
            }
        }
    }

})



socket.on('make-bet', roundInfo => {
    if (roundInfo['sid'] == socket.id) {
        betMessage.style.display = "block";
        betButton.style.display = "block";
        passButton.style.display = "block";
    }
});

socket.on('decide', turnInfo => {
    appendMessage(`${turnInfo["name"]} has the bet with ${turnInfo["bet"]}`)
    if (turnInfo['sid'] == socket.id) {
        appendMessage("you have a decision to make");
        socket.emit('reveal-mine');

    }
})
socket.on('choose-another-card', turnInfo => {
    var playerSids = turnInfo['sids'];
    var playerNames = turnInfo['names'];
    var playerLeft = turnInfo['left'];
    if (socket.id == turnInfo['betterSid']) {
        for (i = 0; i<playerSids.length; i++) {
            if (playerLeft[i]>0) {
                matchPlayers[players[i]] = playerSids[i];
                players[i].innerText = `${playerNames[i]} has ${playerLeft[i]} cards left`;
                players[i].style.display = "block";
            }
        }
    }
})

startButton.addEventListener('click', button => {
    socket.emit('start');
});

rose1Button.addEventListener('click', button => {
    for (i = 0; i < 4; i++) {
        cards[i].style.display = "none";
    }
    betMessage.style.display = "none";
    betButton.style.display = "none";
    socket.emit('card-choosen-play', 0);
});

rose2Button.addEventListener('click', button => {
    for (i = 0; i < 4; i++) {
        cards[i].style.display = "none";
    }
    betMessage.style.display = "none";
    betButton.style.display = "none";
    socket.emit('card-choosen-play', 1);
});

rose3Button.addEventListener('click', button => {
    for (i = 0; i < 4; i++) {
        cards[i].style.display = "none";
    }
    betMessage.style.display = "none";
    betButton.style.display = "none";
    socket.emit('card-choosen-play', 2);
});

skullButton.addEventListener('click', button => {
    for (i = 0; i < 4; i++) {
        cards[i].style.display = "none";
    }
    betMessage.style.display = "none";
    betButton.style.display = "none";
    socket.emit('card-choosen-play', 3);
});

betButton.addEventListener('click', button => {
    button.preventDefault();
    var bet = parseInt(betMessage.value, 10);
    betMessage.value = "";
    for (i = 0; i < 4; i++) {
        cards[i].style.display = "none";
    }
    betMessage.style.display = "none";
    betButton.style.display = "none";
    passButton.style.display ="none";
    socket.emit('bet-made', bet);
})

passButton.addEventListener('click', button => {
    betMessage.style.display = "none";
    betButton.style.display = "none";
    passButton.style.display ="none";
    button.preventDefault();
    socket.emit('passing');
});




function appendMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageContainer.append(messageElement);
}
