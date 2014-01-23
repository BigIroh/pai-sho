(function () {
	/* Create a new instance of a Game. I've locked down all the props on
	 * this so Scandi doesn't fuck them up.
	 *
	 * @param {object} opts:
	 *  -state: the initial state of the game.  must be jsonable
	 *	-validateStateChange: a function  which validates a turn based on
	 *   the current game state
	 *  -pathname [optional]: a url where all game requests should be 
	 *   directed. This defaults to the window's basepath
	 */
	var Game = window.Game = function (opts) {
		if(opts === undefined) {
			throw new Error('Missing required argument `opts`');
		}
		else if(opts.validateStateChange === undefined) {
			throw new Error('Missing required parameter `validateStateChange`');
		}
		else if(typeof opts.validateStateChange != 'function') {
			throw new Error('Required parameter `validateStateChange` must be a function');
		}
		
		var _state = {};
		var _hasChanged = false;
		var _history = {verified: [], unverified: []};
		var _url = opts.pathname || window.location.pathname;
		var _validateStateChange = opts.validateStateChange;

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

		Object.defineProperty(this, 'validateStateChange', {
			value: _validateStateChange,
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
		var newState = this.state.clone().absorb(update);

		var applyStateError;
		try {
			this.validateStateChange(this.state, newState) 
			applyStateError = false;
		}
		catch(err) {
			console.error(e.stack);
			applyStateError = err;
		}

		if(!applyStateError) {
			this.history.unverified.push(newState);
			
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
}())