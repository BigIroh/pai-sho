var session = require('koa-session');
var koa = require('koa');
var paisho = require('./pai-sho');
var app = koa();
var co = require('co');
var level = require('levelup');
var wrap = require('co-level');
var gameDB = wrap(level('games'));
var playerDB = wrap(level('players'));

app.keys = ['the one ring'];
app.use(session());

app.use(function*(next) {
	this.session.player = 'cdawg';
	yield next;
});

app.use(paisho({
	gameDB: gameDB,
	playerDB: playerDB
}));

app.listen(3000);


co(function*() {
	yield gameDB.put('foo', JSON.stringify({
		currentState: {
			lol: 1
		},
		states: []
	}));
	console.log('foo put');
	yield playerDB.put('cdawg', JSON.stringify({
		games: ['foo']
	}));
	console.log('cdawg put');
})();
