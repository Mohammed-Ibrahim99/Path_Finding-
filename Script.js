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
            if (Current_grid_colour == 'rgb(0, 0, 255)')
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
            if (Current_grid_colour == 'rgb(0, 0, 255)')
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
        else if (Current_grid_colour == 'rgb(0, 0, 0)')
        {
            $(this).css("background-color", "blue");
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
           if(grids[element].style.backgroundColor == "blue" && startPosition[1] == -1)
            {
                startPosition[0] = row;
                startPosition[1] = column;
            }
            else if (grids[element].style.backgroundColor == "blue" )
            {
                endPosition[0] = row;
                endPosition[1] = column;

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
    switch(starting_node[0])
    {
        case 0:
            break;
        case gridSize:
            break;

        default: 
            if(starting_node[1] != 0 && starting_node[1] != gridSize)
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
    }
    console.log(starting_node);
    console.log(nodes);
    return 1;

}

function a_star_algorithm()
{   
    var positons;
    positons = findBlueGridPositions();
    var start = positons[0];
    var end = positons[1];

    var grids = document.getElementsByClassName("grid");
    var gridSize = Math.sqrt(grids.length);

    var green_nodes = find_adjacent_nodes(start, gridSize);
    var red_nodes = [];


    // current_node = green_nodes[0];

    // while(current_node != end)
    // {
        

    // }
}