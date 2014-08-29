
/**
 * Simple simulator of Langton's Ant
 *
 * Colors:
 *  0: White
 *  1: Black
 *  n: ???
 *
 * Directions:
 *  0: N
 *  1: E
 *  2: S
 *  3: W
 */
var ants = (function () {

	dirnames = ["North", "East", "South", "West"];

	function Ring(list, pos) {
		if (typeof pos === 'undefined') {
			pos = 0;
		}

		this.current = function () {
			return list[pos];
		};

		this.next = function () {
			++pos;
			if (pos >= list.length) pos = 0;
			return list[pos];
		};

		this.prev = function () {
			if (pos == 0) {
				pos = list.length - 1;
			} else {
				--pos;
			}
			return list[pos];
		};

		this.from = function (position) {
			return new Ring(list, position);
		};

		this.toString = function () {
			return "Pos: " + pos + "; List: [" + list.join(",") + "]";
		};
	}

	function Board(width, height) {

		// Initialize empty array of cells
		var cells = [];
		for (var x = 0; x < width; x++) {
			cells[x] = [];
			for (var y = 0; y < height; y++) {
				cells[x][y] = 0;
			}
		}
		
		var rows = [], cols = [];
		for (var x = 0; x < width; x++) { cols.push(x); }
		for (var y = 0; y < height; y++) { rows.push(y); }
	
		this.isValid = function (x, y) {
			return x >= 0 && x < width && y >= 0 && y < height;
		};

		this.width = function () { return width; };
		this.height = function () { return height; };
		this.rows = function () { return rows; };
		this.cols = function () { return cols; };

		this.get = function (x, y) {
			if (!this.isValid(x, y)) {
				throw new Error("Invalid point for get(): {" + x + ", " + y + "}");
			}
			return cells[x][y];
		};

		this.put = function (x, y, value) {
			if (!this.isValid(x, y)) {
				throw new Error("Invalid point for put(): {" + x + ", " + y + "}");
			}
			cells[x][y] = value;
		};

	}

	function Ant(board, sequence, start) {
		// Bail on invalid sequences
		if (sequence.search(/[^LR]/) !== -1) {
			throw Error("Invalid sequence; must contain only L and R.");
		}

		// Current direction and all possible directions
		var directions = new Ring([0, 1, 2, 3]);
		var iter = 0;

		var color = 0;
		var colors = (function () {
			var value = [];
			for (var n = 0; n < sequence.length; n++) {
				value.push(n);
			}
			return new Ring(value);
		})();

		var position = [];
		if (typeof start === 'undefined') {
			position = [0, 0];
		} else {
			position = start;
		}

		function row() { return position[1]; };
		function col() { return position[0]; };

		function move() {
			switch (directions.current()) {
				case 0: // N
					var y = row() - 1;
					if (y < 0) y = board.height() - 1;
					position = [col(), y];
					break;

				case 2: // S
					var y = row() + 1;
					if (y >= board.height) y = 0;
					position = [col(), y];
					break;

				case 1: // E
					var x = col() + 1;
					if (x >= board.width) x = 0;
					position = [x, row()];
					break;
				
				case 3: // W
					var x = col() - 1;
					if (x < 0) x = board.width - 1;
					position = [x, row()];
					break;
			}
			++iter;
		}


		this.tick = function () {
			var c = board.get(this.x(), this.y());
			switch (sequence[c]) {
				case "L":
					directions.prev();
					break;
				case "R":
					directions.next();
					break;
			}
			board.put(this.x(), this.y(), colors.from(c).next());
			move();
			
		};
		
		this.x = function () { return position[0]; };
		this.y = function () { return position[1]; };
		this.iteration = function () { return iter; };
		this.direction = function () { return directions.current; };
		this.heading = function () { return dirnames[directions.current()]; };

		this.toString = function () {
			return "Ant at {" + this.x() + ", " + this.y() + "} facing " + 
				dirnames[directions.current()] + 
				" after " + iter + " iterations.";
		};

	}


	return {
		"Board": Board,
		"Ant": Ant,
		"Ring": Ring,
		"Directions": dirnames
	};
})();

