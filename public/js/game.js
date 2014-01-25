(function () {
	/* Create a new instance of a Game. I've locked down all the props on
	 * this so Scandi doesn't fuck them up.
	 *
	 * @param {object} opts:
	 *  -state {object}: the initial state of the game.  must be jsonable
	 *	-checkStateChange {function}: validates a turn based on
	 *   the current game state
	 *	-checkEndGame {function}: ends the game after server has validated the
	 *	 last move made
	 *  -pathname {string} [optional]: a url where all game requests should be 
	 *   directed. This defaults to the window's basepath
	 */
	var Game = window.Game = function (opts) {
		if(opts === undefined) {
			throw new Error('Missing required argument `opts`');
		}
		else if(opts.checkStateChange === undefined) {
			throw new Error('Missing required parameter `checkStateChange`');
		}
		else if(typeof opts.checkStateChange != 'function') {
			throw new Error('Required parameter `checkStateChange` must be a function');
		}
		
		var _state = {};
		var _hasChanged = false;
		var _history = {verified: [], unverified: []};
		var _url = opts.pathname || window.location.pathname;
		var _checkStateChange = opts.checkStateChange;

		Object.defineProperty(this, 'state', {
			get: function () {
				return _state;
			},
			set: function (val) {
				_state = val;
				_hasChanged = true;
			},
			enumerable: true,
			configurable: false
		});

		Object.defineProperty(this, 'stateHasChanged', {
			get: function () {
				return _hasChanged;
			},
			set: function (val) {
				_hasChanged = !!val;
			},
			enumerable: true,
			configurable: false
		});

		Object.defineProperty(this, 'url', {
			value: _url,
			configurable: false,
			writable: false,
			enumerable: true
		});

		Object.defineProperty(this, 'history', {
			value: _history,
			configurable: false,
			writable: false,
			enumerable: true
		});

		Object.defineProperty(this, 'checkStateChange', {
			value: _checkStateChange,
			configurable: false,
			writable: false,
			enumerable: true
		});

		this.state = opts.state;
	}

	/* Applies an update to the client and the server's game state.
	 * If the server disagrees, the client state will updated to match
	 * the server's.
	 *
	 * @param {object} update: a piece of state to merge in to the state
	 *
	 * @return {boolean} success: client validates the update?
	 */
	Game.prototype.applyStateChange = function (update) {
		var newState = this.state.clone();
		newState.absorb(update);

		var applyStateError;
		try {
			this.checkStateChange(this.state, newState) 
			applyStateError = false;
		}
		catch(err) {
			console.error(err.stack);
			applyStateError = err;
		}

		if(!applyStateError) {
			this.state = newState;
			this.history.unverified.push(newState);
			// http.post({
			// 	url: this.url, 
			// 	data: update,
			// 	done: function (status, response) {
			// 		this.history.unverified.remove(newState);
			// 		switch(status) {
			// 			case 200:
			// 				this.history.verified.push(newState);
			// 			break;
			// 			case 205:
			// 				//reset state, bad update given
			// 				this.onServerStateRefusal();
			// 				this.state = response
			// 			break;
			// 			default:
			// 				this.onServerError();
			// 			break;

			// 		}
			// 	}.bind(this)
			// });
		}
		else {
			this.onBadMove(applyStateError);
		}
	}

	/* Default handler for when applyStateChange throws an error.  Ideally this
	 * will be overridden with some nice client facing code
	 *
	 * @param {error} err: An Error thrown by applyStateChange
	 */
	Game.prototype.onBadMove = function (err) {
		alert(err.message);
		console.error("Please pass onBadMove as a param when you make a new game!\n", err.stack);
	}

	/* Requests the most up to date state from the server.  It is possible this will
	 * 304, in which case we don't do anything. This function will be used to
	 * poll the server for opponent's moves.
	 */
	Game.prototype.fetchServerState = function () {
		http.post({
			url: this.url, 
			data: update,
			done: function (status, response) {
				switch(status) {
					case 200:
						this.history.verified.push(response);
						this.state = response;
					break;
					case 304:
						//no change in state
						return;
					break;
					default:
						//undefined error
						return;
					break;

				}
			}.bind(this)
		});
	}
}())