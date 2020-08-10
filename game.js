const Player = require("./player");

class Game {
    constructor() {
        this.currentPlayer = 0;
        this.stillIn = [];
        this.players = {};
        this.cardsPlayed = 0;
        this.betPlayer = "";
        this.currentBet = 0;
    }

    addPlayer(sid, name) {
        console.log(sid);
        console.log(name);
        var p =new Player(name, sid);
        this.players[sid] = p;
        this.stillIn.push(p);
    }

    removePlayer(sid) {
        var p = this.players[sid];
        delete this.players[sid];
        var index = this.stillIn.indexOf(p);
        if (index > -1) {
            this.stillIn.splice(index, 1);
        }
        return p;
    }

    getCurrentPlayer() {
        return this.stillIn[this.currentPlayer];
    }

    makePlay(player, index) {
        player.play(index);
        this.currentPlayer++;
        if (this.currentPlayer == this.stillIn.length) {
            this.currentPlayer = 0;
        } 
        this.cardsPlayed++;
    }

    getHowMany() {
        return this.stillIn.length;
    }

    revealCards(playerB, playerR) {
        var card = playerR.reveal();
        return card;
    }

    adjustBet() {
        this.currentBet = this.currentBet - 1;
    }

    makeBet(player, bet) {
        this.currentPlayer++;
        if (this.currentPlayer == this.stillIn.length) {
            this.currentPlayer = 0;
        }
        if (this.cardsPlayed == bet) {
            this.stillIn = [player];
            this.currentPlayer = 0;
            return bet;
        }
        if (bet > this.currentBet && bet < this.cardsPlayed) {

            this.betPlayer = player;
            this.currentBet = bet;
            return this.currentBet;
        }
        var t = []
        for (var i = 0; i<this.stillIn.length; i++) {
            if (this.stillIn[i] != player) {
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

    pass(player){
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
        for (var i = 0; i < this.players.length; i++) {
            t.push(this.players[i].getId());
        }
        return t;
    }

    getNames() {
        var t = [];
        for (var i = 0; i < this.players.length; i++) {
            t.push(this.players[i].getName());
            console.log(this.players[i].getName())
        }
        console.log(t);
        return t;
    }
    getCardsLeft() {
        var t = [];
        for (var i = 0; i < this.players.length; i++) {
            t.push(this.players[i].getHowManyPlayed());
        }
        return t;
    }


}
module.exports = Game;