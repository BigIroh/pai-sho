// janky enum

var Pieces = {
    pawn : 0,
    ninja : 1,
    wizard : 2,
    paladin : 3,
    berserker: 4,
    jouster: 5
}

var movements = {
    Pieces.pawn: function(piece, board) {
        var origin = piece.position;
        return adjacents(origin).filter(occupied(board));
    },

    Pieces.ninja: function(piece, board) {
        var origin = piece.position;
        return range(origin, 2, board);
    },

    Pieces.wizard: function(piece, board) {
        var origin = piece.position;
        return adjacents(origin).filter(occupied(board));
    },

    Pieces.paladin: function(piece, board) {
        var origin = piece.position;
        var x = origin.x;
        var y = origin.y;
        var candidates = [
            {x: x + 1,
             y: y - 1},
            {x: x + 2,
             y: y + 1},
            {x: x + 1,
             y: y + 2},
            {x: x - 1,
             y: y + 1},
            {x: x - 2,
             y: y - 1},
            {x: x - 1,
             y: y - 2}
        ];

        return candidates.filter(inBounds);
    },

    4: function(piece, board) {
        var origin = piece.position;
        var candidates = range(origin, 2, board);
        return candidates.filter(function(terminal) {
            if(piece.player === 0) {
                return terminal.x >= origin.x &&
                       terminal.y >= origin.y;
            }
            else {
                return terminal.x <= origin.x &&
                       terminal.y <= origin.y;
            }
        });
    },

    5: function(piece, board) {
        var origin = piece.position;
    }
}
