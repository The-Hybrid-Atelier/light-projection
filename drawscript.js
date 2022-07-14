var path = new Path();
path.strokeColor = 'black';

var myPath = new Path();

function onMouseDown(event){
myPath = new Path();
myPath.strokeColor ='black';
myPath.strokeWidth=5;
}

function onMouseDrag(event){
myPath.add(event.point);
}

// add function for clicking

tool.onKeyDown = function(event){
if (event.key =='1'){
myPath.strokeWidth=7;  
}
// get this to change gradually as we press the up arrow
}