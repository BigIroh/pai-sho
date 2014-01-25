var route = require('koa-route');
var mount = require('koa-mount');
var parse = require('co-body');
var koa = require('koa');


module.exports = function(options) {
	var app = koa();

	var validate = options.validate || function*() {
		return true;
	};
	
	var gameDB = options.gameDB;
	var playerDB = options.playerDB;
	
	app.use(route.post('/', function*() {
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
	}));

	app.use(route.get('/', function*() {
		var player = yield playerDB.get(this.session.player);
		player = JSON.parse(player);
		if(player.games.indexOf(this.query.game) > -1) {
			var game = JSON.parse(yield gameDB.get(this.query.game));
			this.body = game.currentState;
		} else {
			this.status = 205;
		}
	}));

	return mount('/pai-sho', app);
};