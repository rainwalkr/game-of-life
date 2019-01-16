function Grid(rows,cols,fillValue) {
    var defaultValue = fillValue !== undefined? fillValue:null
    this.rows = rows;
    this.cols = cols;
    this.array = []
    for (var i = 0; i < rows; i++) {
        this.array.push(new Array(rows))
        for (var j = 0; j < cols; j++) {
            this.array[i][j] = defaultValue;
        }
    }
}

Grid.prototype = {
    get:function(){
        return this.array;
    },
    getCellValue:function(cell){
        return this.array[cell.i][cell.j];
    },
    setCellValue:function(cell,value){
        this.array[cell.i][cell.j] = value;
        return this;
    }
}

function TorusGrid(rows,cols,fillValue) {
    Grid.call(this,rows,cols,fillValue)

    this.ilookup = Array.from(Array(this.rows - 1).keys()),
    this.jlookup = Array.from(Array(this.cols - 1).keys());

    this.ilookup.unshift(this.rows - 1)
    this.jlookup.unshift(this.cols - 1)
}

TorusGrid.prototype = Object.create(Grid.prototype)

TorusGrid.prototype.getNeighbours = function(cell){
    var topCell = {i:null,j:cell.j},
        bottomCell = {i:null,j:cell.j},
        rightCell = {i:cell.i,j:null},
        leftCell = {i:cell.i,j:null};
    
        leftCell.j = this.jlookup[cell.j]
        rightCell.j = this.jlookup.indexOf(cell.j)
        topCell.i = this.ilookup[cell.i]
        bottomCell.i = this.ilookup.indexOf(cell.i)

        return [
            {i:topCell.i,j:leftCell.j},topCell,{i:topCell.i,j:rightCell.j},
            leftCell,rightCell,
            {i:bottomCell.i,j:leftCell.j},bottomCell,{i:bottomCell.i,j:rightCell.j}
        ];
}

// The Simulation

function GameOfLife(rows,cols) {
    this.generation = 0;
    this.grid = new TorusGrid(rows,cols,0);
}

GameOfLife.prototype = {
    
    init:function(){
        // oscillator
       this.grid.setCellValue({i:1,j:1},1)
        .setCellValue({i:1,j:0},1)
        .setCellValue({i:1,j:2},1)
    },
    getGrid:function(){
        return this.grid;
    },
    tick:function(){
        var nextGrid = new TorusGrid(this.grid.rows,this.grid.cols,0),
            neighbours=[],
            livingNeighbours,
            currentCell;

        for (var i = 0; i < this.grid.rows; i++) {
           for (var j = 0; j < this.grid.cols; j++) {
                currentCell = {i:i,j:j} 
                neighbours = this.grid.getNeighbours(currentCell)
                livingNeighbours = neighbours.filter(function(neighbours){
                        return this.grid.getCellValue(neighbours);
                    }.bind(this))

                if (this.grid.getCellValue(currentCell) === 0 && livingNeighbours.length === 3) {
                    nextGrid.setCellValue(currentCell,1)
                } else if (this.grid.getCellValue(currentCell) === 1 && (livingNeighbours.length === 2 || livingNeighbours.length === 3)) {
                    nextGrid.setCellValue(currentCell,1)
                } else {
                    nextGrid.setCellValue(currentCell,0)
                }
           }            
        }
        this.generation++;
        this.grid = nextGrid; 
    }
}


var life =  new GameOfLife(30,30);

life.init()

life.tick();
life.tick();
life.tick();


console.table(life.getGrid().get())

