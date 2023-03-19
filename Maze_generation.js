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
        this.parent;
        this.walkable = false;
        
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
        let f_cost = parseInt(this.h_cost) + parseInt(this.g_cost);
        return f_cost;
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
        this.count = 0;
        this.grid = maze.grid;
        this.start =  maze.start;
        this.end = maze.end;
        this.current;
        
        this.rows = maze.rows;
        this.cols = maze.columns;
        
        this.open_set = [];
        this.closed_set = [];

    }

    getNeighbours(node)
    {
        let neighbours = [];

        for (let x=-1; x<=1; x++)
        {
            for (let y=-1; y<=1; y++)
            {
                if(x==0 && y==0)
                {
                    continue;
                }

                let checkY = node.colNumber + x;
                let checkX = node.rowNumber + y;

                if(checkX >=0 && checkX < this.cols && checkY >=0 && checkY < this.rows)
                {
                    neighbours.push(this.grid[checkX][checkY]);
                }
            }
        }

        return neighbours;
    }

    setContainsNode(closedList, node)
    {
        for(let i = 0; i<closedList.length; i++)
        {
                if(closedList[i].rowNumber === node.rowNumber && closedList[i].colNumber === node.colNumber)
                {
                    return true;
                }
        }

        return false;
    }

    //Check if is it possible to go to a node,
    //If there are walls present then its not possible
    //If no walls present then it possible to go to that node
    check_if_walkable(node)
    {
        let neighbours = [];
        
        let x = node.colNumber;
        let y = node.rowNumber;

        console.log(x, y);


    }
    // check_if_walkable(node)
    // {
    //     let neighbours = [];

    //     console.log(node);
    //     let x = node.colNumber;
    //     let y = node.rowNumber;

    //     if(node.walls.topWall == false)
    //     {
    //         console.log("Top Wall False");
    //         if(x >=0 && x < this.cols && y >=0 && y < this.rows)
    //         {
    //             if(this.grid[x-1][y].walls.bottomWall == false)
    //             {
    //                 console.log(x - 1, y);
    //                 neighbours.push(this.grid[x-1][y-1]);
    //             }
    //         }

    //     }
    //     if(node.walls.bottomWall == false)
    //     {
    //         console.log("Bottom Wall False");
    //         if(x >=0 && x < this.cols && y >=0 && y < this.rows)
    //         {
    //             if(this.grid[x+1][y].walls.topWall == false)
    //             {
    //                 console.log(x + 1, y);
    //                 neighbours.push(this.grid[x+1][y]);
    //             }
    //         }
    //     }

    //     if(node.walls.rightWall == false)
    //     {
    //         console.log("Right Wall False");
    //         if(x >=0 && x < this.cols && y >=0 && y < this.rows)
    //         {
    //             if(this.grid[x][y + 1].walls.leftWall == false)
    //             {
    //                 console.log(x, y + 1);
    //                 neighbours.push(this.grid[x][y + 1]);
    //             }
    //         }

    //     }

    //     if(node.walls.leftWall == false)
    //     {
    //         console.log("Left Wall False");
    //         if(x >=0 && x < this.cols && y >=0 && y < this.rows)
    //         {
    //             if(this.grid[x][y - 1].walls.rightWall == false)
    //             {
    //                 console.log(x, y - 1);
    //                 neighbours.push(this.grid[x][y - 1]);
    //             }
    //         }

    //     }      

    //     if(neighbours.length > 0) return true;
    //     else
    //     {
    //         return false;
    //     }

    // }

    //Explanation to add later, for now explanation here
    // https://www.youtube.com/watch?v=mZfyt03LDH4&t=369s
    getDistanceBetweenNodes(nodeA, nodeB)
    {
        var distance_x = Math.abs(nodeA.colNumber - nodeB.colNumber);
        var distance_y = Math.abs(nodeA.rowNumber - nodeB.rowNumber);

        if(distance_x > distance_y)
        {
            return (14 * distance_y) + 10 * (distance_x - distance_y);
        }

        return parseInt((14 * distance_x) + 10 * (distance_y - distance_x));

    }

    findPath()
    {
        this.start.g_cost = 0;
        this.start.h_cost = this.getDistanceBetweenNodes(this.start, this.end) + this.getDistanceBetweenNodes(this.start, this.end);
        this.open_set = [];
        
        this.open_set.push(this.start);
        this.current = this.open_set[0];
        
        
        while(this.open_set.length > 0)
        {   
            let index = 0;
            for(let i=0; i<this.open_set.length; i++)
            {
                if(this.open_set[i].fcost() < this.current.fcost() || (this.open_set[i].fcost() == this.current.fcost() && this.open_set[i].h_cost < this.current.h_cost))
                {             
                    this.current = this.open_set[i];
                    index = i;
                    
                    let x = this.current.colNumber * 600/this.cols + 1;
                    let y = this.current.rowNumber * 600/this.cols + 1;
                    ctx.fillStyle = "green";
                    ctx.fillRect(x, y, 600/this.cols - 3, 600/this.cols - 3);
                                 
                }
                
            }
            
            this.open_set.splice(index, 1);
            this.closed_set.push(this.current);

            
            if(this.current.rowNumber == this.end.rowNumber && this.current.colNumber == this.end.colNumber)
            {
                return;
            }

            let neighbours = this.getNeighbours(this.current);

            //TODO: check if we can walk
            for(let i=0; i<neighbours.length; i++)
            {
                if(this.setContainsNode(this.closed_set, neighbours[i]))
                {
                    continue;
                }

                var newCostToNode = this.current.g_cost + this.getDistanceBetweenNodes(this.current, neighbours[i]);

                if(newCostToNode < neighbours[i].g_cost || !this.setContainsNode(this.open_set, neighbours[i]))
                {
                    neighbours[i].g_cost = newCostToNode;
                    neighbours[i].h_cost = this.getDistanceBetweenNodes(neighbours[i], this.end);
                    neighbours[i].parent = this.current;
                    
                    if(!this.setContainsNode(this.open_set, neighbours[i]))
                    {
                        this.open_set.push(neighbours[i]);
                        
                    }
                }

            }
            
        }

        
    }
    
}

let newMaze = new Maze(600, 10, 10);
newMaze.setup();
newMaze.draw();
let pathfind = new astar(newMaze); 

