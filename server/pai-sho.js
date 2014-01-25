var route = require('koa-route');
var parse = require('co-body');

module.exports = function(options) {
	var validate = options.validate || function*() {
		return true;
	};
	var gameDB = options.gameDB;
	var playerDB = options.playerDB;
	return route.post('/pai-sho', function*() {
		var body = yield parse(this);
		var player = yield playerDB.get(this.session.player);
		player = JSON.parse(player);
		if(player.games.indexOf(body.game) > -1) {
			var game = JSON.parse(yield gameDB.get(body.game));
			var valid = yield validate(game.currentState, body.state);
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
};