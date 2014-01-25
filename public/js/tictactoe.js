var TicTacToe ={}
TicTacToe.X = 'X';
TicTacToe.O = 'O';
TicTacToe.EMPTY = '_';

TicTacToe.game = new Game({
	state: {
		board: [
			[TicTacToe.EMPTY, TicTacToe.EMPTY, TicTacToe.EMPTY],
			[TicTacToe.EMPTY, TicTacToe.EMPTY, TicTacToe.EMPTY],
			[TicTacToe.EMPTY, TicTacToe.EMPTY, TicTacToe.EMPTY]
		],
		player: 0	
	},
	checkStateChange: function(state, next) {
		//verify next player
		if(state.player === 1) {
			if(next.player !== 0) {
				throw new Error("Next player must be 0");
			}
		}
		else if(state.player === 0) {
			if(next.player !== 1) {
				throw new Error("Next player must be 1");
			}
		}
		else {
			throw new Error("Player must be 0 or 1");
		}

		//verify that one empty square has changed
		var foundChange;
		for(var i=0; i<state.board.length; i++) {
			for(var j=0; j<state.board[0].length; j++) {
				if(state.board[i][j] !== next.board[i][j]) {
					if(foundChange) {
						throw new Error("You can only move once!");
					}
					else {
						if(state.board[i][j] !== TicTacToe.EMPTY) {
							throw new Error("You can only go on an empty square!");
						}
						else {
							foundChange = true;
						}
					}
				}
			}
		}

		if(!foundChange) {
			throw new Error("You haven't made any moves yet!");
		}
		return true;
	},
});
