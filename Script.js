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

// create a 16x16 grid when the page loads
// creates a hover effect that changes the color of a square to black when the mouse passes over it, leaving a (pixel) trail through the grid
// allows the click of a button to prompt the user to create a new grid
$(document).ready(
function() 
{
    createGrid(16);

    gridEvents();

    $(".newGrid").click(function() {
        refreshGrid();

       gridEvents();
    });
}
);

function gridEvents()
{
    $(".grid")
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