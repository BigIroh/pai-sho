var hexToRect = function(origin) {
    return {x : (origin.x + origin.y) / 2,
            y : (origin.y - origin.x) * 0.866]
}

var inBounds = function(coords) {
    var x = coords.x;
    var y = coords.y;
    return x >= 0 && x <= 8 &&
           y >= 0 && y <= 8 &&
           (x < 5 || y > 0) &&
           (x < 6 || y > 1) &&
           (x < 7 || y > 2) &&
           (x < 8 || y > 3) &&
           (y < 5 || x > 0) &&
           (y < 6 || x > 1) &&
           (y < 7 || x > 2) &&
           (y < 8 || x > 3);
}

// returns an array of points from origin to the next solid object, or the end of the board
var line = function(origin, step, board) {
    var newPos = {x: origin.x + step.x,
                  y: origin.y + step.y};
    if(inBounds(newPos) && board[newPos.x][newPos.y] === null) {
        var rest = line(newPos, step, board);
        rest.push(newPos);
        return rest;
    }

    else {
        return [newPos];
    }
}

// returns all in bounds tiles next to the given tile
var adjacents = function(origin) {
    var x = origin.x;
    var y = origin.y;
    var adjacents = [[x + 1, y], [x, y + 1], [x + 1, y + 1],
                     [x - 1, y], [x, y - 1], [x - 1, y -1]];
    return adjacents.filter(inBounds);
}

// returns an array of points reachable from origin in range, without passing other units
var range = function(origin, reach, board) {
    var visited = {};
    var ret = [];
    var queue = [origin];
    var dists = [reach]
    while(queue.length != 0) {
        var current = queue.shift();
        var dist = left.shift();
        if(current in visited || left < 0) {
            continue;
        }
        var x = current[0];
        var y = current[1];

        if(board[x][y] === null) {
            ret.push(current);
            var adj = adjacents(current);
            queue = queue.concat(adj);
            dists = dists.concat(adj.map(function(x) {return dist - 1}));
        }

        visited[current] = true;
    }

    return ret;
}
