

function Renderer(canvasId, board, ant, scale, colors) {
	var ctx = document.getElementById(canvasId).getContext("2d");

	this.render = function () {
		for (x in board.cols()) {
			for (y in board.rows()) {
				ctx.fillStyle = colors[board.get(x, y)];
				ctx.fillRect(x * scale, y * scale, scale, scale);
			}
		}
		ctx.fillStyle = "#f99";
		ctx.fillRect(ant.x() * scale, ant.y() * scale, scale, scale);
		
	};

	this.clear = function () {
		ctx.fillStyle = "#fff";
		ctx.fillRect(0, 0, board.width() * scale, board.height() * scale);
	};
}

$(function () {
	var intval = null,
		ant = null,
		renderer = null,
		isRunning = false,
		$loc = $("#loc"),
		$start = $("#start"),
		$iter= $("#iter"),
		$heading = $("#heading"),
		$tick = $("#tick");

	function start() {
		changeSpeed($tick.val());
	}

	function stop() {
		clearInterval(intval);
		intval = null;
	}

	function lock() {
		$("#pattern").prop("disabled", true);
		$("#colors").prop("disabled", true);

	}

	function unlock() {
		$("#pattern").prop("disabled", false);
		$("#colors").prop("disabled", false);
	}

	function changeSpeed(tick) {
		if (typeof tick === 'undefined') {
			tick = $tick.val();
		}

		console.log("adjusting speed to ", tick);
		if (intval !== null) clearInterval(intval);
		intval = setInterval(function () {
			ant.tick();
			renderer.render();

			$iter.html(ant.iteration());
			$heading.html(ant.heading());
			$loc.html(ant.x() + ", " + ant.y());

		}, tick);
	}

	// Play/pause
	$start.click(function () {
		if (isRunning === false) { // Initialize
			var sequence = $("#pattern").val();
			var colors = $("#colors").val().split(/[\s;,]+/);

			var board = new ants.Board(150, 120);
			ant = new ants.Ant(board, sequence, [74, 49]);
			renderer = new Renderer("langton", board, ant, 5, colors);
			isRunning = true;
			lock();
		}
		console.log(isRunning, intval);
		if (intval === null) { // Play
			$start.html('<i class="icon-pause"></i>');
			start();

		} else { 			   // Pause
			$start.html('<i class="icon-play"></i>');
			stop();
		}
	});


	$("#stop").click(function () {
		if (confirm("This will end the simulation and clear the canvas. Are you sure?")) {
			stop();
			isRunning = false;
			renderer.clear();
			$start.html('<i class="icon-play"></i>');
			unlock();
		}
	});


	$("#faster").click(function () { 
		$tick.val(Math.min(parseInt($tick.val() * 0.1), 5000));
		changeSpeed();
	});

	$("#slower").click(function () {
		$tick.val(Math.max(parseInt($tick.val() * 10), 1));
		changeSpeed();
	});

	$tick.change(function () {
		changeSpeed($tick.val());
	});
		
});
