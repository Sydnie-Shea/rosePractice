class Player {
    
    constructor(nameOfPlayer, sid) {
        this.name = nameOfPlayer;
        this.socketId = sid;
        //this.listOfColors = ["blue", "red", "green", "pink", "pruple"];
        //this.color = this.listOfColors[numOfPlayers];
        this.numOfCards = 4;
        this.cards = ["rose", "rose", "rose", "skull"];
        this.have = [true, true, true, true]
        this.aHave = [true, true, true, true]
        this.played = [];
        this.points = 0;
        this.wins = 0;
    }

    removeCard(index) {
        this.ahave[index] = false;
        this.numOfCards -= 1;
    }

    // delete(index) {
    //     tempCards = []
    //     for (var i = 0; i < this.numOfCards; i++) {
    //         if (i != index) {
    //             this.tempCards.push(this.cards[i]);
    //         }
    //     }
    //     this.cards = tempCards;
    //     this.numOfCards -= 1;
    // }

    win() {
        this.points += 1;
        if (this.points == 2) {
            this.wins += 1;
        }
        return this.points;
    }

    reveal() {
        return this.played.pop();
    }

    play(index) {
        this.played.push(this.cards[index]);
        this.have[index] = false;

    }
    
    newRound(){
        this.played = [];
        var t = [];
        for (i = 0; i<4; i++) {
            t.push[this.aHave[i]];
        }
        this.have = t;
    }

    startOver() {
        this.numOfCards = 4;
        this.have = [true, true, true, true];
        this.actuallyHave = [true, true, true, true]
        this.played = [];
        this.points = 0;
    }

    getName() {
        return this.name;
    }
    getId() {
        return this.socketId;
    }
    getCards(){
        return this.have;
    }
    getHowManyPlayed() {
        return this.played.length;
    }
    getPoints() {
        return this.points;
    }
    getWins() {
        return this.wins();
    }

}

module.exports = Player;