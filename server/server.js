var koa = require('koa');
var session = require('koa-session');
var logger = require('koa-logger');
var paisho = require('./pai-sho');
var serve = require('koa-static');
var auth = require('basic-auth');
var route = require('koa-route');
var parse = require('co-body');

var co = require('co');

var level = require('levelup');
var wrap = require('co-level');

var gameDB = wrap(level('games'));
var playerDB = wrap(level('players'));
var paiDB = wrap(level('paisho'));

var app = koa();

app.keys = ['the one ring'];
app.use(session());
app.use(logger());
app.use(serve(process.cwd() + '/public'));

app.use(route.post('/signup', function*() {
	var body = yield parse(this);
	var name = body.name.toString();
	var password = body.password.toString();
	var playerExists;
	try {
		playerExists = yield playerDB.get(name);
	} catch(e) {
		console.log(e);
	}
	if(playerExists) {
		this.status = 500;
	} else {
		var user = {
			name: name,
			password: password,
			games: []
		};
		var failure = yield playerDB.put(name, JSON.stringify(user));
		if(failure) {
			this.status = 500;
		} else {
			this.session.player = name;
			this.status = 200;
		}
	}
}));

app.use(function*(next) {
	var credentials = auth(this);
	if(credentials) {
		var user = JSON.parse(yield playerDB.get(credentials.name));
		if(user && user.password == credentials.pass) {
			this.session.player = credentials.name;
			yield next;
		} else {
			this.status = 401;
		}
	} else {
		this.status = 401;
	}
});

var logout = function*() {
	this.session = null;
	this.status = 200;
};

app.use(route.get('/logout', logout));
app.use(route.post('/logout', logout));

app.use(paisho({
	paiDB: paiDB,
	gameDB: gameDB,
	playerDB: playerDB
}));

app.listen(3000);

co(function*() {
	yield gameDB.put('foo', JSON.stringify({
		players: ['cdawg', 'mscandal'],
		currentState: {
			lol: 1
		},
		states: [],
		lastAction: (new Date()).getTime()
	}));
	console.log('foo put');
	yield playerDB.put('cdawg', JSON.stringify({
		name: 'cdawg',
		games: [{
			id: 'foo',
			opponent: 'mscandal'
		}],
		password: 'password'
	}));
	console.log('cdawg put');
})();
