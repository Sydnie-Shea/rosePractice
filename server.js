const Player = require('./player.js');
const Game = require('./game.js');

const io = require('socket.io')(3000);
const users = {}
const game = new Game();
io.on('connection', socket => {
    socket.on('new-user', name => {
        users[socket.id] = name;
        game.addPlayer(socket.id, name);
        socket.broadcast.emit('user-connected', name);
    });

    socket.on('disconnect', name => {
        game.removePlayer(socket.id);
        socket.broadcast.emit('user-disconnected', users[socket.id]);
        delete users[socket.id];
    });

    socket.on('start',() => {
        io.sockets.emit('started');
        var player = game.getCurrentPlayer();
        var turnInfo = {
            'player': player,
            'name': player.getName(),
            'sid': player.getId(),
            'cards': player.getCards(),
        };
        socket.broadcast.emit('message', `${player.getName()}'s turn`);
        io.sockets.emit('choose-card',turnInfo);
    });

    socket.on('card-choosen-play', index=>{
        var player = game.getCurrentPlayer();
        game.makePlay(socket.id, index);
        player = game.getCurrentPlayer();
        var turnInfo = {
            'player': player,
            'name': player.getName(),
            'sid': player.getId(),
            'cards': player.getCards(),
        };
        socket.broadcast.emit('message', `${player.getName()}'s turn`);
        io.sockets.emit('choose-card',turnInfo);

    });
    
    socket.on('bet-made', bet=> {
        var player = game.getCurrentPlayer();
        var bet = game.makeBet(socket.id, bet);
        if (bet > 0)
        {
            socket.broadcast.emit('message', `${player.getName()} bet ${bet} cards`);
        } else {
            socket.broadcast.emit('message', `${player.getName()} passed`);
        }
        if (game.getHowMany() > 1) {
            player = game.getCurrentPlayer();
            var turnInfo = {
                'player': player,
                'name': player.getName(),
                'sid': player.getId()
            };
            io.sockets.emit('make-bet', turnInfo);
        } else {
            player = game.getCurrentPlayer();
            var turnInfo = {
                'player': player,
                'name': player.getName(),
                'sid': player.getId(),
                'bet': game.getCurrentBet()
            }
            io.sockets.emit('decide', turnInfo);
        }
        

    });

    socket.on('passing', () => {
        var player = game.getCurrentPlayer();
        left = game.pass(socket.id);
        socket.broadcast.emit('message', `${player.getName()} passed`);
        if (!left) {
            player = game.getCurrentPlayer();
            var turnInfo = {
                'player': player,
                'name': player.getName(),
                'sid': player.getId()
            };
            io.sockets.emit('make-bet', turnInfo);
        } else {
            player = game.getCurrentPlayer();
            var turnInfo = {
                'player': player,
                'name': player.getName(),
                'sid': player.getId(),
                'bet': game.getCurrentBet()
            }
            io.sockets.emit('decide', turnInfo);
        }
    });
    socket.on('reveal-mine', () => {
        var cards = game.getHowManyPlayed(socket.id);
        var allSafe = true;
        for (i = 0; i < cards; i++) {
            card = game.revealCards(socket.id, socket.id);
            io.sockets.emit('message', `${game.getName(socket.id)} had a ${card}`);
            if (card == "rose") {
                game.adjustBet();
            } else {
                //else end round with lose
                allSafe = false;
            }
            
            //chekc if bet = 0, if so end round with a win
        }
        //if all safe continue game asking other players
        if (allSafe) {
            roundInfo = {
                'sids': game.getSids(),
                'names': game.getNames(),
                'left': game.getCardsLeft(),
                'betterSid': game.getCurrentBetSid()
            }
            io.sockets.emit('choose-another-card', roundInfo);

        }
        // }
        //if not all safe do nothing
    })
    socket.on('reveal-card', sid => {
        card = game.revealCards(socket.id, sid);
        if (card == "rose") {
            game.adjustBet();
            if (game.getCurrentBet() == 0) {
                points = game.winRound(socket.id);
                //send info about points
                //players, and current scores
                //announce winner globally and adjust scores
                //Than deal 
                if (points == 2) {
                    //start new game
                } else {
                    //start new round
                }
                //run win scenario
                //winner
                console.log("winner");
            } else {
                roundInfo = {
                    'sids': game.getSids(),
                    'names': game.getNames(),
                    'left': game.getCardsLeft(),
                    'betterSid': game.getCurrentBetSid()
                }
                io.sockets.emit('choose-another-card', roundInfo);
            }
        } else {
            console.log("end game")
            //end game with loss
        }
    })
});