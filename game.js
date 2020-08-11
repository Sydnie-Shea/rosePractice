const Player = require("./player");

class Game {
    constructor() {
        this.currentPlayer = 0;
        this.stillIn = [];
        this.players = {};
        this.allPlayers = [];
        this.cardsPlayed = 0;
        this.betPlayer = "";
        this.currentBet = 0;
    }

    addPlayer(sid, name) {
        var p =new Player(name, sid);
        this.players[sid] = p;
        this.stillIn.push(p);
        this.allPlayers.push(p);
    }

    removePlayer(sid) {
        var p = this.players[sid];
        delete this.players[sid];
        var index = this.stillIn.indexOf(p);
        if (index > -1) {
            this.stillIn.splice(index, 1);
        }
        var index = this.allPlayers.indexOf(p);
        if (index > -1) {
            this.allPlayers.splice(index, 1);
        }

        return p;
    }

    prepareNewRound() {
        //prepare each player for new roudn
    }

    newGame() {
        //prepare each player for new game
    }

    winRound(sid) {
        var winner = this.players[sid];
        var points = winner.win();
        return points;
    }

    getCurrentPlayer() {
        return this.stillIn[this.currentPlayer];
    }

    makePlay(sid, index) {
        this.players[sid].play(index);
        this.currentPlayer++;
        if (this.currentPlayer == this.stillIn.length) {
            this.currentPlayer = 0;
        } 
        this.cardsPlayed++;
    }

    getHowMany() {
        return this.stillIn.length;
    }

    revealCards(sidB, sidR) {
        var playerB = this.players[sidB];
        var playerR = this.players[sidR];
        var card = playerR.reveal();
        return card;
    }

    adjustBet() {
        this.currentBet = this.currentBet - 1;
    }

    makeBet(sid, bet) {
        this.currentPlayer++;
        if (this.currentPlayer == this.stillIn.length) {
            this.currentPlayer = 0;
        }
        if (this.cardsPlayed == bet) {
            this.betPlayer = this.players[sid];
            this.currentBet = bet;
            this.stillIn = [this.players[sid]];
            this.currentPlayer = 0;
            return bet;
        }
        if (bet > this.currentBet && bet < this.cardsPlayed) {

            this.betPlayer = this.players[sid];
            this.currentBet = bet;
            return this.currentBet;
        }
        var t = []
        for (var i = 0; i<this.stillIn.length; i++) {
            if (this.stillIn[i] != this.players[sid]) {
                t.push(this.stillIn[i]);
            }
        }
        this.stillIn = t;this.currentPlayer++;
        if (this.currentPlayer == this.stillIn.length) {
            this.currentPlayer = 0;
        }
        if (this.currentPlayer == this.stillIn.length) {
            this.currentPlayer = 0;
        }
        return 0;
    }

    pass(sid){
        var player = this.players[sid];
        var t = []
        for (var i = 0; i<this.stillIn.length; i++) {
            if (this.stillIn[i] != player) {
                t.push(this.stillIn[i]);
            }
        }
        this.stillIn = t;
        this.currentPlayer++;
        if (this.currentPlayer == this.stillIn.length) {
            this.currentPlayer = 0;
        }
        if (this.stillIn.length == 1) {
            return true;
        }
        return false;
    }

    getCurrentBet() {
        return this.currentBet;
    }

    getSids() {
        var t = [];
        for (var i = 0; i < this.allPlayers.length; i++) {
            t.push(this.allPlayers[i].getId());
        }
        return t;
    }

    getNames() {
        var t = [];
        for (var i = 0; i < this.allPlayers.length; i++) {
            t.push(this.allPlayers[i].getName());
        }
        return t;
    }
    getCardsLeft() {
        var t = [];
        for (var i = 0; i < this.allPlayers.length; i++) {
            t.push(this.allPlayers[i].getHowManyPlayed());
        }
        return t;
    }

    getHowManyPlayed(sid) {
        return this.players[sid].getHowManyPlayed();
    }

    getName(sid) {
        return this.players[sid].getName();
    }

    getCurrentBetSid() {
        return this.betPlayer.getId();
    }


}
module.exports = Game;