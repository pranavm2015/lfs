var Life = new Object();
var Grid = new Object();

/**
 *
 * Why is half of the stuff attached to a Life object and the
 * other half to a Grid object?: No good reason. Just to
 * indicate which stuff is related to life cycle and which
 * to grid operations.
 *
 * Controls below @line:302
 *
 */

///// GRID ///////////////////////////////////////////////////

Grid.init = function (m, n) {
    var i, j, column, array = [];
    for (i = 0; i < m; i++) {
        column = [];
        for (j = 0; j < n; j++) {
            column[j] = Life.DEAD;
        }
        array[i] = column;
    }
    return array;
};

Grid.drawOnCanvas = function () {
    var i, j, column;
    for (i = 0; i < Life.grid.length; i++) {
        column = Life.grid[i];
        for (j = 0; j < column.length; j++) {
            if (column[j] == Life.ALIVE) {
                Life.context.fillStyle = Life.COLOR_ALIVE;
            } else {
                Life.context.fillStyle = Life.COLOR_DEAD;
            }
            Life.context.fillRect(Life.CELL_GAP + i * (Life.CELL_SIZE + 2 * Life.CELL_GAP), Life.CELL_GAP + j * (Life.CELL_SIZE + 2 * Life.CELL_GAP), Life.CELL_SIZE, Life.CELL_SIZE);
        }
    }
};

Grid.clone = function (from, to) {
    for (var i = 0; i < from.length; i++) {
        to[i] = from[i].slice(0); //cloning the array...
    }
};

Grid.shiftDown = function () {
    var i, j, column, changes = 0;
    for (i = 0; i < Life.grid.length; i++) {
        column = Life.grid[i];
        j = Life.pile[i];
        while (Life.grid[i][j] == Life.ALIVE) {
            j--;
        }
        Life.pile[i] = j;
        j--; //skip the first empty cell
        while (j >= 0) {
            if (Life.grid[i][j] == Life.ALIVE) {
                Life.grid[i][j] = Life.DEAD;
                Life.grid[i][j + 1] = Life.ALIVE;
                changes++;
            }
            j--;
        }
    }
    if (changes === 0) {
        Life.state = Life.IDLE;
        clearInterval(Life.interval);
    }
};

Grid.shiftUp = function () {
    var i, originalColumn,
        snapshotColumn,
        originalCell,
        snapshotCell,
        originalIndex,
        snapshotIndex,
        changes = 0;
    for (i = 0; i < Life.grid.length; i++) {
        originalColumn = Life.grid[i];
        snapshotColumn = Life.snapshot[i];
        originalIndex = 0;
        snapshotIndex = 0;
        for (var q = 0; q < Life.count[i]; q++) {
            originalCell = Grid.nextCell(originalColumn, originalIndex);
            snapshotCell = Grid.nextCell(snapshotColumn, snapshotIndex);
            if (originalCell == snapshotCell) {
                break;
            }
            changes++;
            originalColumn[originalCell] = Life.DEAD;
            originalColumn[originalCell - 1] = Life.ALIVE; //shift the corresponding cell 1 up
            originalIndex = originalCell + 1;
            snapshotIndex = snapshotCell + 1;
        }
        Life.grid[i] = originalColumn;
    }
    if (changes === 0) {
        if (Life.swipeLine != -1) {
            Life.state = Life.SWIPE;
        } else {
            Life.updateTick(Life.NORMAL_TICK);
            Life.state = Life.LIVE;
            Life.stopwatch.start();
        }
    }
};

Grid.nextCell = function (column, offset) {
    for (var i = offset; i < column.length; i++) {
        if (column[i] == 1) {
            return i;
        }
    }
    return -1;
};

Grid.swipe = function () {
    var column;
    if (Life.swipeLine != -1) {
        column = Life.grid[Life.swipeLine];

        for (var j = 0; j < Life.HEIGHT; j++) {
            column[j] = (Math.random() < Life.SPAWN_COEF) ? Life.ALIVE : Life.DEAD;
        }
        Life.grid[Life.swipeLine] = column;
    }
    Life.swipeLine++;
    if (Life.swipeLine != Life.WIDTH) {
        column = Life.grid[Life.swipeLine];
        for (j = 0; j < Life.HEIGHT; j++) {
            column[j] = Life.ALIVE;
        }
        Life.grid[Life.swipeLine] = column;
    } else {
        Life.swipeLine = -1;
        Life.stopwatch.reset();
        Life.stopwatch.start();
        Life.state = Life.LIVE;
        Life.updateTick(Life.NORMAL_TICK);
    }
};

Grid.update = function () {
    var neighbours;
    var nextGenerationGrid = Grid.init(Life.WIDTH, Life.HEIGHT);

    for (var i = 0; i < Life.WIDTH; i++) {
        for (var j = 0; j < Life.HEIGHT; j++) {
            neighbours = Grid.calculateNeighbours(i, j);
            if (Life.grid[i][j] !== Life.DEAD) {
                if ((neighbours >= Life.MINIMUM_NEIGHBORS) && (neighbours <= Life.MAXIMUM_NEIGHBORS)) {
                    nextGenerationGrid[i][j] = Life.ALIVE;
                }
            } else {
                if (neighbours === Life.SPAWN_COUNT) {
                    nextGenerationGrid[i][j] = Life.ALIVE;
                }
            }
        }
    }
    if (Grid.compare(nextGenerationGrid, Life.previousGrid)) {
        Life.swipe();
    }
    Grid.clone(Life.grid, Life.previousGrid);
    Grid.clone(nextGenerationGrid, Life.grid);
};

Grid.compare = function (first, second) {
    var columnFirst, columnSecond;
    for (var i = 0; i < Life.WIDTH; i++) {
        columnFirst = first[i];
        columnSecond = second[i];
        for (var j = 0; j < Life.HEIGHT; j++) {
            if (columnFirst[j] != columnSecond[j]) {
                return false;
            }
        }
    }
    return true;
};

Grid.calculateNeighbours = function (x, y) {
    var total = 0;
    for (var i = -1; i <= 1; i++) {
        for (var j = -1; j <= 1; j++) {
            total += Life.grid[(Life.WIDTH + (x + i)) % Life.WIDTH]
                [(Life.HEIGHT + (y + j)) % Life.HEIGHT]; //mod is used for the edge warp
        }
    }
    total -= Life.grid[x][y];
    return total;
};

///// LIFE ///////////////////////////////////////////////////

Life.updateTick = function (tick) {
    if (Life.TICK != tick) {
        Life.TICK = tick;
        clearInterval(Life.interval);
        Life.interval = setInterval(lifeCycle, Life.TICK);
    }
};

Life.shiftDown = function () {
    if (Life.state != Life.UP) {
        Grid.clone(Life.grid, Life.snapshot);
    }
    Life.stopwatch.stop();
    Life.state = Life.DOWN;
    Life.pile = [];
    for (i = 0; i < Life.WIDTH; i++) {
        Life.pile[i] = Life.HEIGHT - 1;
    }
    Life.updateTick(Life.FAST_TICK);
};

Life.shiftUp = function () {
    Life.calculateColumnCount();
    Life.state = Life.UP;
    Life.updateTick(Life.FAST_TICK);
};

Life.calculateColumnCount = function () {
    for (var i = 0; i < Life.WIDTH; i++) {
        Life.count[i] = Life.countCells(Life.grid[i]);
    }
};

Life.countCells = function (column) {
    var count = 0;
    for (var i = 0; i < column.length; i++) {
        if (column[i] == Life.ALIVE) {
            count++;
        }
    }
    return count;
};

Life.swipe = function () {
    Life.skipTicks = 30;
    Life.stopwatch.stop();
    Life.state = Life.SWIPE;
    Life.swipeLine = -1;
    Life.updateTick(Life.FAST_TICK);
};

function lifeCycle() {
    if (Life.skipTicks > 0) {
        Life.skipTicks--;
    } else {
        switch (Life.state) {
            case Life.IDLE:
            {
                //do nothing;
                break;
            }
            case Life.LIVE:
            {
                Grid.update();
                break;
            }
            case Life.DOWN:
            {
                Grid.shiftDown();
                break;
            }
            case Life.UP:
            {
                Grid.shiftUp();
                break;
            }
            case Life.SWIPE:
            {
                Grid.swipe();
                break;
            }
        }
        Grid.drawOnCanvas();
    }
}

Life.handleClick = function () {
    switch (Life.state) {
        case Life.IDLE:
        {
            Life.interval = setInterval(lifeCycle, Life.TICK);
        }
        case Life.DOWN:
        {
            Life.shiftUp();
            break;
        }
        default:
        {
            Life.shiftDown();
            break;
        }

    }
};

///// STOPWATCH //////////////////////////////////////////////

function Stopwatch(text) {

    this.text=text;

    var	startAt	= 0;
    var	lapTime	= 0;

    var	now	= function() {
        return (new Date()).getTime();
    };

    this.start = function() {
        startAt	= startAt ? startAt : now();
        //TODO: there must be a more civilized way to achieve this...
        this.timer = setInterval(redirect, 100, this);


        
        function redirect(w) {
            w.update();

        }
    };

    this.stop = function() {
        lapTime	= startAt ? lapTime + now() - startAt : lapTime;
        startAt	= 0;
        clearInterval(this.timer);

    };

    this.reset = function() {
        lapTime = startAt = 0;
    };

    this.time = function() {
        return lapTime + (startAt ? now() - startAt : 0);
    };

    var pad = function(num, size) {
        var s = "0000" + num;
        return s.substr(s.length - size);
    }

    this.formattedTime = function(){
        var  m = s = ms = 0;
        var newTime = this.time();

        newTime = newTime % (60 * 60 * 1000);
        m = Math.floor( newTime / (60 * 1000) );
        newTime = newTime % (60 * 1000);
        s = Math.floor( newTime / 1000 );
        ms = newTime % 1000;
        if (s==3){
        	alert("Time's up! Your booking has been cancelled!")
            window.history.back();
        	this.stop();

        }

        return pad(m, 2) + ':' + pad(s, 2) + ':' + pad(ms, 3);
    };

    this.update =  function(){
        text.innerHTML = this.formattedTime();
    };
};


///// CONTROLS ///////////////////////////////////////////////
/*                                                          //
/** side of a single square cell (in pixels)                */
Life.CELL_SIZE = 4;                                         //
/** gap between two cels (in pixels)                        */
Life.CELL_GAP = 0.5;                                        //
/** nuber of grid columns                                   */
Life.WIDTH = 50;                                            //
/** number of grid rows                                     */
Life.HEIGHT = 50;                                           //
/** interval when the grid is 'active' (in milliseconds)    */
Life.NORMAL_TICK = 50;                                      //
/** interval when swipe/pause/resume animations are played  */
Life.FAST_TICK = 25;                                        //
/** frequency of alive cells after a grid wipe              */
Life.SPAWN_COEF = 0.4;                                      //

///// CONSTANTSS /////////////////////////////////////////////
Life.COLOR_BACKGROUND = "#031634";                          //
Life.COLOR_DEAD = "#033649";                                //
Life.COLOR_ALIVE = "#036564";                               //
/**                                                         */
Life.DEAD = 0;                                              //
Life.ALIVE = 1;                                             //
Life.MINIMUM_NEIGHBORS = 2;                                 //
Life.MAXIMUM_NEIGHBORS = 3;                                 //
Life.SPAWN_COUNT = 3;                                       //
/**                                                         */
Life.IDLE = 0;                                              //
Life.LIVE = 1;                                              //
Life.DOWN = 2;                                              //
Life.UP = 3;                                                //
Life.SWIPE = 4;                                             //

Life.TICK = Life.FAST_TICK;
Life.skipTicks = 0;
Life.state = -1;
Life.interval = null; //the object returned by "setInterval" used to stop the timer

Life.grid = [];
Life.previousGrid = [];
Life.canvas;
Life.context;

Life.pile = []; //holds the pile top position for each column
Life.count = []; //holds cell count for each column
Life.swipeLine = -1;
Life.snapshot = []; //holds the snapshot of the current grid state to be restored later

Life.grid = Grid.init(Life.WIDTH, Life.HEIGHT);
Life.previousGrid = Grid.init(Life.WIDTH, Life.HEIGHT);
Life.canvas = document.getElementById("life");
Life.canvas.width = Life.WIDTH * (Life.CELL_SIZE + 2 * Life.CELL_GAP);
Life.canvas.height = Life.HEIGHT * (Life.CELL_SIZE + 2 * Life.CELL_GAP);
//Life.canvas.addEventListener('click', Life.handleClick, false);
Life.context = Life.canvas.getContext("2d");
Life.context.fillStyle = Life.COLOR_BACKGROUND;
Life.context.fillRect(0, 0, Life.context.width, Life.context.height);
Life.state = Life.SWIPE;
Life.stopwatch = new Stopwatch(document.getElementById('time'));
Life.interval = setInterval(lifeCycle, Life.TICK);