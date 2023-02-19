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
        this.start;
        this.end;
    }

    getRandomInt(max) 
    {
        return Math.floor(Math.random() * max);
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
        this.start = this.grid[0][this.getRandomInt(this.columns - 1)];
        this.start.walls.topWall = false;

        this.end = this.grid[this.rows - 1][this.getRandomInt(this.columns - 1)];
        this.end.walls.bottomWall = false;

    }

    draw()
    {
        maze.width = this.size;
        maze.height = this.size;
        maze.style.background = "white";

        current.visited = true;

        for(let r=0; r < this.rows; r++)
        {
            for(let col=0; col<this.columns; col++)
            {
                let grid = this.grid;
                grid[r][col].show(this.size, this.rows, this.columns);
            }

        }

        let next = current.checkNeighbours();

        
        if(next)
        {
            next.visited = true;

            this.stack.push(current);

            current.highlight(this.columns);

            current.removeWalls(current, next);

            current = next;
        }
        else if(this.stack.length > 0)
        {
            let cell = this.stack.pop();
            current = cell;
            current.highlight(this.columns);

        }

        if(this.stack.length == 0)
        {
            return;
        }

        window.requestAnimationFrame(()=>{
            this.draw();
        })

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
        this.h_cost = 0;
        this.g_cost = 0;
        
        this.visited = false; //Used for checking if a cell has been added to stack or not
        
        this.walls = 
        {
            topWall: true,
            rightWall: true,
            bottomWall: true,
            leftWall: true
        };

    }

    fcost()
    {
        return this.f_cost = parseInt(this.h_cost) + parseInt(this.g_cost);
    }
    
    checkNeighbours()
    {
        let grid = this.parentGrid;
        let row = this.rowNumber;
        let col = this.colNumber;
        let neighbours = [];

        let top = row !== 0 ? grid[row-1][col]: undefined;
        let right = col !== grid.length - 1 ? grid[row][col + 1]: undefined;
        let bottom = row !== grid.length - 1 ? grid[row + 1][col]: undefined;
        let left = col !== 0 ? grid[row][col - 1]: undefined;

        if(top && !top.visited) neighbours.push(top);
        if(right && !right.visited) neighbours.push(right);
        if(bottom && !bottom.visited) neighbours.push(bottom);
        if(left && !left.visited) neighbours.push(left);


        if(neighbours.length !== 0)
        {
            let random = Math.floor(Math.random() * neighbours.length);
            return neighbours[random];
        }
        else
        {
            return undefined;
        }

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
        
        highlight(columns)
        {
            let x = this.colNumber * this.parentSize/columns + 1;
            let y = this.rowNumber * this.parentSize/columns + 1;

            ctx.fillStyle = "purple";
            ctx.fillRect(x, y, this.parentSize/columns - 3, this.parentSize/columns - 3);

        }

        removeWalls(cell_1, cell_2)
        {
            let x = cell_1.colNumber - cell_2.colNumber;

            if(x == 1)
            {
                cell_1.walls.leftWall = false;
                cell_2.walls.rightWall = false;
            }
            else if (x == -1)
            {
                cell_1.walls.rightWall = false;
                cell_2.walls.leftWall = false;
            }

            let y = cell_1.rowNumber - cell_2.rowNumber;

            if(y == 1)
            {
                cell_1.walls.topWall = false;
                cell_2.walls.bottomWall = false;
            }
            else if (y == -1)
            {
                cell_1.walls.bottomWall = false;
                cell_2.walls.topWall = false;
            }

        }

        show(size, rows, columns)
        {
            let x = (this.colNumber * size) / columns;
            let y = (this.rowNumber * size) / rows;

            ctx.strokeStyle = "black";
            ctx.fillStyle = "white";
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

class astar
{
    constructor(maze)
    {
        this.grid = maze.grid;
        this.start =  maze.start;
        this.end = maze.end;
        this.current;
        

        this.open_set = [];
        this.closed_set = [];
        console.log(this.start.fcost());

    }

    findPath()
    {
        this.open_set.push(this.start);

        while(this.open_set.length == 0)
        {   
            this.current = this.open_set[0];
            let index = 0;
            for(let i=1; i<this.open_set.length; i++)
            {
                if(this.open_set[i].f_cost() < this.current.f_cost() || 
                   this.open_set[i].f_cost() == this.current.f_cost() && this.open_set[i].h_cost < this.current.h_cost)
                {
                    this.current = this.open_set[i];
                    index = i;
                }
            }

            this.open_set = this.open_set.splice(index, 1);
            this.closed_set.push(this.current);

            

        }

    }

}

let newMaze = new Maze(600, 10, 10);
newMaze.setup();
newMaze.draw();
let pathfind = new astar(newMaze); 
