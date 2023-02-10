//Code taken from https://www.youtube.com/watch?v=nHjqkLV_Tp0
let maze = document.querySelector(".maze");
let ctx = maze.getContext("2d");


let current; //position to start the maze generation from

class Maze
{
    constructor(size, rows, columns)
    {
        this.size = size;
        this.rows = rows;
        this.columns = columns;
        this.grid = [];
        this.stack = [];
    }

    //Generate maze structure
    setup()
    {
        for(let r=0; r< this.rows; r++)
        {
            let row = [];
            for(let c=0; c<this.columns; c++)
            {
                let cell = new Cell(r, c, this.grid, this.size);
                row.push(cell);
            }
            this.grid.push(row);
        }
        current = this.grid[0][0];
    }

    draw()
    {
        maze.width = this.size;
        maze.height = this.size;
        maze.style.background = "black";

        current.visited = true;

        for(let r=0; r < this.rows; r++)
        {
            for(let col=0; col<this.columns; col++)
            {
                let grid = this.grid;
                grid[r][col].show(this.size, this.rows, this.columns);
            }

        }

    }
}

class Cell
{
    constructor(rowNumber, colNumber, parentGrid, parentSize)
    {
        this.rowNumber = rowNumber;
        this.colNumber = colNumber;
        this.parentGrid = parentGrid;
        this.parentSize = parentSize;
        
        this.visited = false; //Used for checking if a cell has been added to stack or not
        
        this.walls = 
        {
            topWall: true,
            rightWall: true,
            bottomWall: true,
            leftWall: true
        };

    }
    
    checkNeighbours()
    {
        let grid = this.parentGrid;
        let row = this.rowNumber;
        let col = this.colNumber;
        let neighbours = [];

        
    }


    /*  
        Draw line from here (x,y)
        |           ______________ To here (x + size/columns, y)
        |          |
        v          v
        O----------+
        
        Draw line starting at O and finishing at +
    */
    drawTopWall(x, y, size, columns, rows)
    {
        ctx.beginPath();
        ctx.moveTo(x,y);
        ctx.lineTo(x + size/columns, y);
        ctx.stroke();
    }

    /*  
        Draw line from here (x,y)
        |           ______________ To here (x + size/columns, y)
        |          |
        v          v
        O----------+
        
        Draw line starting at O and finishing at +
    */
        drawBottomWall(x, y, size, columns, rows)
        {
            ctx.beginPath();
            ctx.moveTo(x, y + size/rows);
            ctx.lineTo(x + size/columns, y + size/rows);
            ctx.stroke();
        }

    /*  
        O<--------- Draw line from here (x,y)
        | 
        |          
        |         
        +<--------- To here (x + size/columns, y)
        
        Draw line starting at O and finishing at +
    */
        drawRightWall(x, y, size, columns, rows)
        {
            ctx.beginPath();
            ctx.moveTo(x + size/columns,y);
            ctx.lineTo(x + size/columns, y + size/rows);
            ctx.stroke();
        }

    /*  
        O<--------- Draw line from here (x,y)
        | 
        |          
        |         
        +<--------- To here (x + size/columns, y)
        
        Draw line starting at O and finishing at +
    */
        drawLeftWall(x, y, size, columns, rows)
        {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + size/rows);
            ctx.stroke();
        }
    
        show(size, rows, columns)
        {
            let x = (this.colNumber * size) / columns;
            let y = (this.rowNumber * size) / rows;

            ctx.strokeStyle = "white";
            ctx.fillStyle = "black";
            ctx.lineWidth = 2;

            if (this.walls.topWall) this.drawTopWall(x, y, size, columns, rows);
            if (this.walls.rightWall) this.drawRightWall(x, y, size, columns, rows);
            if (this.walls.bottomWall) this.drawBottomWall(x, y, size, columns, rows);
            if (this.walls.leftWall) this.drawLeftWall(x, y, size, columns, rows);
            if(this.visited)
            {
                ctx.fillRect(x+1, y+1, size/columns - 2, size/rows - 2);
            }

        }
}

let newMaze = new Maze(500, 10, 10);
newMaze.setup();
newMaze.draw();