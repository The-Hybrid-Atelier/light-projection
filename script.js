console.log("I AM IN UI");

var myPath;
function onMouseDown(event){
myPath = new Path();
myPath.strokeColor ='black';
myPath.strokeWidth=5;
}

function onMouseDrag(event){
myPath.add(event.point);
}

/* MIDI BOARD INTEGRATION */
var ctrl = new LaunchControl();
var oldStrokeWidth = 0;
var newStrokeWidth = 0;

ctrl.open().then(function() {
  ctrl.led("even", "dark red");
});

ctrl.on("message", function(e) {
  if (e.dataType == "knob1" && e.track == 0){
  	newStrokeWidth = e.value;
  	if (newStrokeWidth > oldStrokeWidth) {myPath.strokeWidth+= Math.abs(newStrokeWidth - oldStrokeWidth)}
  	else if (newStrokeWidth < oldStrokeWidth){myPath.strokeWidth-= Math.abs(newStrokeWidth - oldStrokeWidth)}
  	oldStrokeWidth = newStrokeWidth;
  	console.log(newStrokeWidth, oldStrokeWidth);
  }
});