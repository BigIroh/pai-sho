(function () {
	/* Create a new instance of a Game 
	 * @param opts:
	 *	-validateStateChange: a function  which validates a turn based on
	 *   the current game state
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
		var _url = window.location.pathname;
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
	}

	/* Applies an update to the client and the server's game state.
	 * If the server disagrees, the client state will updated to match
	 * the server's.
	 *
	 * @param update: a piece of an object to merge in to the state
	 *
	 * @return success: a boolean if the client validates the update.
	 */
	Game.prototype.applyStateChange = function (update) {
		var newState = this.state.clone().absorb(update);

		if(this.validateStateChange(newState)) {
			
			this.history.unverified.push(newState);

			http.post({
				url: this.url, 
				data: update,
				done: function (status, response) {
					this.history.unverified.remove(newState);
					switch(status) {
						case 200:
							this.history.verified.push(newState);
						break;
						case 205:
							//reset state, bad update given
							this.state = response
						break;
						default:
						break;

					}
				}.bind(this)
			});
		}
		else {
			return false;
		}
	}

}())