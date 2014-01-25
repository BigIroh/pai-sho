var compose = require('koa-compose');
var route = require('koa-route');
var parse = require('co-body');


module.exports = function(options) {
	var validate = options.validate || function() {
		return true;
	};

	var gameDB = options.gameDB;
	var playerDB = options.playerDB;
	
	var saveState = route.post('/pai-sho/state', function*() {
		var body = yield parse(this);
		var player = yield playerDB.get(this.session.player);
		player = JSON.parse(player);
		console.log(player.games.indexOf(body.game))
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

	var getGames = route.get('/pai-sho/games', function*() {
		var player = yield playerDB.get(this.session.player);
		player = JSON.parse(player);
		this.body = player.games;
	});

	var getValidator = route.get('/pai-sho/validator', function*() {
		this.body = validate.toString();
	});

	return compose([saveState, getState, getGames, getValidator]);
};