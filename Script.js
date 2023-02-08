//Code used from https://codepen.io/nakessler/pen/qOdJWm
// function that builds a grid in the "container"
function createGrid(sizeOfGrid) {
    for (var rows = 0; rows < sizeOfGrid; rows++) {
        for (var columns = 0; columns < sizeOfGrid; columns++) {
            $("#container").append("<div class='grid'></div>");
        };
    };
    $(".grid").width(960/sizeOfGrid);
    $(".grid").height(960/sizeOfGrid);
};

// function that clears the grid
function clearGrid(){
    $(".grid").remove();
};  

// function that prompts the user to select the number of boxes in a new grid
// the function then also creates that new grid
function refreshGrid(){
    var gridSize = prompt("How many boxes per side?");
    clearGrid();
    createGrid(gridSize);
};

// create a 2x2 grid when the page loads
// creates a hover effect that changes the color of a square to black when
// the mouse passes over it, leaving a (pixel) trail through the grid
// allows the click of a button to prompt the user to create a new grid
$(document).ready(
function() 
{
    createGrid(4);

    gridEvents();

    $(".newGrid").click(function() {
        refreshGrid();

       gridEvents();
    });
}
);

function findBlueGridsNumber()
{
    var blueSum = 0;

    //Retrieve all grids in the area, to check which grids are blue
    var grids = document.getElementsByClassName("grid");

    //loop through all the grids and check which of them has
    //a blue colour
    for (var rows = 0; rows < grids.length; rows++) {

            if(grids[rows].style.backgroundColor == "blue")
            {
                blueSum = blueSum + 1 ;
            }
            
    };

    return blueSum;
}

function gridEvents()
{
    $(".grid")
    //Change the colour of the grid to black to indicate the cursor
    //is hovering over it
    .mouseenter( function() 
        {
            var Current_grid_colour = $(this).css("background-color");
            //Check if colour is Blue
            if (Current_grid_colour == 'rgb(0, 0, 255)' || Current_grid_colour == 'rgb(0, 128, 0)')
            {
                return;
            }

        $(this).css("background-color", "black");
        }
    )
    //Change the colour of the grid back to white to indicate the mouse
    //is no longer on it
    .mouseleave(function() 
        {
            var Current_grid_colour = $(this).css("background-color");
            //Check if colour is Blue
            if (Current_grid_colour == 'rgb(0, 0, 255)' || Current_grid_colour == 'rgb(0, 128, 0)')
            {
                return;
            }
            $(this).css("background-color", "white");
            $(this).css("outline", "black 1px #000");
            
        }
    )
    .click(function() {
        numberOfBlueGrids = findBlueGridsNumber();


        if(numberOfBlueGrids == 2)
        {
            $(this).css("background-color", "white");
        }

        var Current_grid_colour = $(this).css("background-color");
        //Check if colour is Blue
        if (Current_grid_colour == 'rgb(0, 0, 255)')
        {
            $(this).css("background-color", "white");
        }
        // In case colour is white turn Tile to blue
        else if (Current_grid_colour == 'rgb(0, 0, 0)' && numberOfBlueGrids == 0)
        {
            $(this).css("background-color", "blue");
            $(this).css("outline", "4px solid rgb(255, 0, 0)");
        }
        else if (Current_grid_colour == 'rgb(0, 0, 0)' && numberOfBlueGrids == 1)
        {
            $(this).css("background-color", "blue");
            $(this).css("outline", "4px solid rgb(0, 255, 0)");
        }
        
      });
}

function findBlueGridPositions()
{
    var startPosition = [-1, -1];
    var endPosition = [-1, -1];

    //Retrieve all grids in the area, to find the starting and ending points
    var grids = document.getElementsByClassName("grid");

    var rows = Math.sqrt(grids.length);
    var columns = rows;
    var element = 0;
    //loop through all the grids and check which of them has
    //a blue colour
    for (var row = 0; row < rows; row++) 
    {
        for (var column = 0; column < columns; column++) 
        {
           if(grids[element].style.backgroundColor == "blue")
            {
                if (grids[element].style.outline == "rgb(255, 0, 0) solid 4px")
                {
                    startPosition[0] = row;
                    startPosition[1] = column;
                }
                else
                {
                    endPosition[0] = row;
                    endPosition[1] = column;
    
                }
            }

            element++;
        }

    }

    var positons = [startPosition, endPosition];
    return positons; 
}

function find_adjacent_nodes(starting_node, gridSize)
{   
    var nodes = []
    var edges = gridSize - 1;
    switch(starting_node[0])
    {
        case 0:
            if(starting_node[1] == 0)
            { 
                nodes[0] = [(starting_node[0]), (starting_node[1]) + 1];
                nodes[1] = [(starting_node[0] + 1), (starting_node[1])];
                nodes[2] = [(starting_node[0] + 1), (starting_node[1] + 1)];
            }
            else if(starting_node[1] == edges)
            {
                nodes[0] = [(starting_node[0]), (starting_node[1]) - 1];
                nodes[1] = [(starting_node[0] + 1), (starting_node[1])];
                nodes[2] = [(starting_node[0] + 1), (starting_node[1] - 1)];
            }
            else
            {
                nodes[0] = [(starting_node[0]), (starting_node[1]) - 1];
                nodes[1] = [(starting_node[0] + 1), (starting_node[1] - 1)];
                nodes[2] = [(starting_node[0] + 1), (starting_node[1])];
                nodes[3] = [(starting_node[0] + 1), (starting_node[1]) + 1];
                nodes[4] = [(starting_node[0]), (starting_node[1]) + 1];
            }
            break;

        case edges:
            if(starting_node[1] == 0)
            { 
                nodes[0] = [(starting_node[0]) - 1, (starting_node[1])];
                nodes[1] = [(starting_node[0] - 1), (starting_node[1] + 1)];
                nodes[2] = [(starting_node[0]), (starting_node[1] + 1)];
            }
            else if(starting_node[1] == edges)
            {
                nodes[0] = [(starting_node[0]), (starting_node[1]) - 1];
                nodes[1] = [(starting_node[0] - 1), (starting_node[1])];
                nodes[2] = [(starting_node[0] - 1), (starting_node[1] - 1)];
            }
            else
            {
                nodes[0] = [(starting_node[0]), (starting_node[1] - 1)];
                nodes[1] = [(starting_node[0] - 1), (starting_node[1] - 1)];
                nodes[2] = [(starting_node[0] - 1), (starting_node[1])];
                nodes[3] = [(starting_node[0] - 1), (starting_node[1]) + 1];
                nodes[4] = [(starting_node[0]), (starting_node[1]) + 1];
            }
            break;

        default: 
            if(starting_node[1] != 0 && starting_node[1] != edges)
            { 
                nodes[0] = [(starting_node[0] - 1), (starting_node[1] - 1)];
                nodes[1] = [(starting_node[0] - 1), (starting_node[1])];
                nodes[2] = [(starting_node[0] - 1), (starting_node[1] + 1)];
                nodes[3] = [(starting_node[0]), (starting_node[1] - 1)];
                nodes[4] = [(starting_node[0]), (starting_node[1] + 1)];
                nodes[5] = [(starting_node[0] + 1), (starting_node[1] - 1)];
                nodes[6] = [(starting_node[0] + 1), (starting_node[1])];
                nodes[7] = [(starting_node[0] + 1), (starting_node[1] + 1)];
            }
            else if(starting_node[1] == edges)
            { 
                nodes[0] = [(starting_node[0] - 1), (starting_node[1])];
                nodes[1] = [(starting_node[0] - 1), (starting_node[1] - 1)];
                nodes[2] = [(starting_node[0]), (starting_node[1] - 1)];
                nodes[3] = [(starting_node[0] + 1), (starting_node[1] - 1)];
                nodes[4] = [(starting_node[0] + 1), (starting_node[1])];
            }
            else if(starting_node[1] == 0)
            { 
                nodes[0] = [(starting_node[0] - 1), (starting_node[1])];
                nodes[1] = [(starting_node[0] - 1), (starting_node[1] + 1)];
                nodes[2] = [(starting_node[0]), (starting_node[1] + 1)];
                nodes[3] = [(starting_node[0] + 1), (starting_node[1] + 1)];
                nodes[4] = [(starting_node[0] + 1), (starting_node[1])];
            }
    }
    return nodes;

}

function compute_costs(start, end, current)
{
    //distance of current node from starting node
    var g_cost = Math.round(
                            Math.sqrt((current[0] - start[0]) * (current[0] - start[0])
                            + (current[1] - start[1]) * (current[1] - start[1])) * 10
                            ); 
    
    //distance of current node from ending node
    var h_cost = Math.round(
                            Math.sqrt((current[0] - end[0]) * (current[0] - end[0])
                            + (current[1] - end[1]) * (current[1] - end[1])) * 10
                            ); 
    // console.log("start" + start)
    // console.log("end" + end)
    // console.log(g_cost + h_cost);
    return [g_cost, h_cost];

}

function a_star_algorithm()
{   
    var positons;
    positons = findBlueGridPositions();
    var start = positons[0];
    var end = positons[1];

    var grids = document.getElementsByClassName("grid");
    var gridSize = Math.sqrt(grids.length);

    var green_nodes = [];
    var red_nodes = [];


    var f_costs = [];

    var rows = Math.sqrt(grids.length);
    var columns = rows;

    green_nodes[0] = start;

    while(green_nodes.length > 0)
    {   

        // var lowest_f_cost_value = green_nodes[0][2];
        // var lowest_f_cost_index = 0;
        // for (var i = 0; i < green_nodes.length; i++) 
        // {
        //     if ((green_nodes[i][2] + green_nodes[i][3]) < lowest_f_cost_value) 
        //     {
        //       lowest_f_cost_value = (green_nodes[i][2] + green_nodes[i][3]);
        //       lowest_f_cost_index = i;
        //     }
        // }
        // current_node = green_nodes[lowest_f_cost_index];
        // green_nodes = green_nodes.splice(lowest_f_cost_index, 1);
        // red_nodes.push(current_node); 

        //store g_cost and h_cost for each node as positions 2 and 3 for each node
        for(var i=0; i<green_nodes.length; i++)
        {
            //g_cost
            green_nodes[nodes][2] = compute_costs(start, end, green_nodes[nodes])[0];
            //h_cost
            green_nodes[nodes][3] = compute_costs(start, end, green_nodes[nodes])[1];
        }


        var current_node = green_nodes[0];
        var current_node_fcost = current_node[0][2] + current_node[0][3];
        var node_to_remove = 0;

        for(var i = 1; i<green_nodes.length; i++)
        {
            var green_h_cost = green_nodes[i][3];
            var green_f_cost = (green_nodes[i][2] + green_h_cost);

            if(green_f_cost < current_node_fcost || open_f_cost == current_node_fcost && green_h_cost < current_node[0][3])
            {
                current_node = green_nodes[0];
                node_to_remove = i;
            }
        }

        //Remove current node from green node list
        //Add current node to red node list
        red_nodes.push(green_nodes.splice(node_to_remove, 1));
        
        //If path has been found, exit out of the loop
        if(current_node[0] == end[0] && current_node[1] == end[1])
        {
            return;
        }

        var neighbouring_nodes = find_adjacent_nodes(current_node, gridSize);

        for(var neighbours = 0; neighbours<neighbouring_nodes.length; neighbours++)
        {
            if(!grids[element].style.backgroundColor == "rgb(255, 0, 0)" || arrayAlreadyHasArray(red_nodes, neighbours))
            {
                continue;
            }

        }


    }
}

//Explanation to add later, for now explanation here
https://www.youtube.com/watch?v=mZfyt03LDH4&t=369s
function getDistanceBetweenNodes(nodeA, nodeB)
{
    var distance_x = Math.abs(nodeA[0] - nodeB[0]);
    var distance_y = Math.abs(nodeA[1] - nodeB[1]);

    if(distance_x > distance_y)
    {
        return (14 * distance_y) + 10 * (distance_x - distance_y);
    }

    return (14 * distance_x) + 10 * (distance_y - distance_x);

}

//Function to check if a node is available in the red nodes
//Returns true or false
//https://stackoverflow.com/questions/48538162/how-to-check-if-a-two-dimensional-array-includes-a-string
function exists(nodes, node_to_find) 
{
    return nodes.some(row => row.includes(node_to_find));
}

//Simple check for finding if an array exists within 2D array
https://betterprogramming.pub/check-if-an-array-is-within-a-2d-array-using-javascript-c534d96cb269
function arrayAlreadyHasArray(arr, subarr){
    for(var i = 0; i<arr.length; i++){
        let checker = false
        for(var j = 0; j<arr[i].length; j++){
            if(arr[i][j] === subarr[j]){
                checker = true
            } else {
                checker = false
                break;
            }
        }
        if (checker){
            return true
        }
    }
    return false
}