var compose = require('koa-compose');
var route = require('koa-route');
var parse = require('co-body');
var co = require('co');

module.exports = function(options) {
	var validate = options.validate || function() {
		return true;
	};

	var paiDB = options.paiDB;
	var gameDB = options.gameDB;
	var playerDB = options.playerDB;

	co(function*() {
		try {
			yield paiDB.get('games');
		} catch(e) {
			yield paiDB.put('games', '0');
		}
	})();
	
	var saveState = route.post('/pai-sho/state', function*() {
		var body = yield parse(this);
		var player = yield playerDB.get(this.session.player);
		player = JSON.parse(player);
		if(player.games.indexOf(body.game) > -1) {
			var game = JSON.parse(yield gameDB.get(body.game));
			var valid = validate(game.currentState, body.state, this.session.player);
			if(valid) {
				game.states.push(game.currentState);
				game.currentState = body.state;
				yield gameDB.put(body.game, JSON.stringify(game));
				this.status = 200;
			} else {
				this.status = 205;
			}
		} else {
			this.status = 205;
		}
	});

	var getState = route.get('/pai-sho/state', function*() {
		var player = yield playerDB.get(this.session.player);
		player = JSON.parse(player);
		if(player.games.indexOf(this.query.game) > -1) {
			var game = JSON.parse(yield gameDB.get(this.query.game));
			this.body = game.currentState;
		} else {
			this.status = 205;
		}
	});

	var getStates = route.get('/pai-sho/states', function*() {
		var player = yield playerDB.get(this.session.player);
		player = JSON.parse(player);
		if(player.games.indexOf(this.query.game) > -1) {
			var game = JSON.parse(yield gameDB.get(this.query.game));
			game.states.push(game.currentState);
			this.body = game.states;
		} else {
			this.status = 205;
		}
	});

	var getGames = route.get('/pai-sho/games', function*() {
		var player = yield playerDB.get(this.session.player);
		player = JSON.parse(player);
		for(var index in player.games) {
			var gameData = player.games[index];
			var game = JSON.parse(yield gameDB.get(gameData.id));
			gameData.lastAction = game.lastAction;
		}
		console.log(player.games);
		this.body = player.games;
	});

	var waiting = null;
	
	var findGame = route.post('/pai-sho/find-game', function*() {
		console.log('waiting', waiting);
		if(waiting) {
			var opponent = waiting;
			waiting = null;
			var game = {
				players: [
					this.session.player,
					opponent
				],
				states: [],
				currentState: {}
			};
			var games = yield paiDB.get('games');
			yield gameDB.put(games, JSON.stringify(game));
			var player = JSON.parse(yield playerDB.get(this.session.player));
			var opponentPlayer = JSON.parse(yield playerDB.get(opponent));
			player.games.push({
				id: games,
				opponent: opponent
			});
			opponentPlayer.games.push({
				id: games,
				opponent: player.name
			});
			console.log('player', player);
			console.log('opponentPlayer', opponentPlayer);
			yield playerDB.put(player.name, JSON.stringify(player));
			yield playerDB.put(opponentPlayer.name, JSON.stringify(opponentPlayer));
			this.body = {
				id: games,
				opponent: opponent
			};
			games = ~~games;
			games++;
			yield paiDB.put('games', games.toString());
		} else {
			waiting = this.session.player;
			this.body = 'waiting';
		}
	});

	var getValidator = route.get('/pai-sho/validator', function*() {
		this.body = validate.toString();
	});

	return compose([saveState, getState, getStates, getGames, getValidator, findGame]);
};