// PAPER.JS DRAWING TOOL

// var path = new Path();
// path.strokeColor = 'black';

// var myPath = new Path();

// function onMouseDown(event){
// myPath = new Path();
// myPath.strokeColor ='black';
// myPath.strokeWidth=5;
// }

// function onMouseDrag(event){
// myPath.add(event.point);
// }

// // add function for clicking

// tool.onKeyDown = function(event){
// if (event.key =='1'){
// myPath.strokeWidth=7;  
// }
// // get this to change gradually as we press the up arrow
// }

var drawGridRects = function(num_rectangles_wide, num_rectangles_tall, boundingRect) {
    var width_per_rectangle = boundingRect.width / num_rectangles_wide;
    var height_per_rectangle = boundingRect.height / num_rectangles_tall;
    for (var i = 0; i < num_rectangles_wide; i++) {
        for (var j = 0; j < num_rectangles_tall; j++) {
            var aRect = new paper.Path.Rectangle(boundingRect.left + i * width_per_rectangle, boundingRect.top + j * height_per_rectangle, width_per_rectangle, height_per_rectangle);
            aRect.strokeColor = 'black';
            aRect.fillColor = 'white';
        }
    }
}

drawGridRects(4, 4, paper.view.bounds);