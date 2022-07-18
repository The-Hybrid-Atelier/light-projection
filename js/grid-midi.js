var rects = [];
var i = 0;
var x = 0;
var y = 0;
for (x = 0; x < 8; x++) {
    for (y = 0; y < 8; y++) {
        rects[i] = new Path.Rectangle(new Point(y * 150, x * 100), new Point(150 + (y * 150), 100 + (x * 100)));
        rects[i].strokeColor = "white";
        rects[i].fillColor = "black";
        rects[i].strokeWidth = 1;
        i += 1;
    }
}
console.log(rects)
var rect_value = -1;
var clicked_values = []
var ctrl = new LaunchControl();
ctrl.open().then(function() {
  ctrl.led("all", "off");
});

var oldStrokeWidth = 0;
var newStrokeWidth = 0;
var iter = 0;
ctrl.on("message", function(e) {
//USE KNOB TO SCROLL THROUGH ROWS
  if (e.dataType == "knob1" && e.track == 0){
    console.log("I AM DETECTING KNOB1");
    console.log(e.value)
    if(e.value < 64 && e.value%8 == 0)
    {
        rects[e.value].selected = true;
        if(rects[e.value].fillColor != "white")
            rects[e.value].fillColor = "grey";
        if (rect_value != -1){
            rects[rect_value].selected = false;
            if(rects[rect_value].fillColor != "white")
                rects[rect_value].fillColor = "black";}
        rect_value = e.value;
    }
  }
 //USE BUTTONS TO CHOOSE COLUMNS
   if (e.dataType == "pad"){
    console.log("I AM DETECTING PAD", e.track);
    if (clicked_values.includes(rect_value + e.track))
    {
     rects[rect_value + e.track].fillColor = "black";
     ctrl.led(e.track, "off");
     var index = clicked_values.indexOf(rect_value + e.track);
     clicked_values.splice(index, 1);
    }
    else
    {
      ctrl.led(e.track, "dark red");
      rects[rect_value + e.track].fillColor = "white";
      clicked_values.push(rect_value + e.track);
    }
  }

  //CHANGE STROKE WIDTH OF RECTANGLES
  if (e.dataType == "knob1" && e.track == 1){
        console.log("DETECTING KNOB1 TRACK 2")
       for( iter = 0; iter < rects.length; iter++){
            console.log(iter, rects.length, rects[iter], rects[iter].strokeWidth, newStrokeWidth, oldStrokeWidth);
            newStrokeWidth = e.value;
            if (newStrokeWidth > oldStrokeWidth) {rects[iter].strokeWidth+= Math.abs(newStrokeWidth - oldStrokeWidth)}
            else if (newStrokeWidth < oldStrokeWidth){rects[iter].strokeWidth-= Math.abs(newStrokeWidth - oldStrokeWidth)}           
        }
    oldStrokeWidth = newStrokeWidth;

  }
  //ZOOM IN ON RECTANGLES
    if (e.dataType == "knob1" && e.track == 2){
        console.log("DETECTING KNOB1 TRACK 2")
        if (e.value > 10 && e.value < 100){
            console.log(e.value)
            view.zoom = e.value/10
            }
  }

  //CHANGE RECTANGLE OPACITY
    if (e.dataType == "knob1" && e.track == 3)
    {
        console.log("DETECTING KNOB1 TRACK 3")
        for( iter = 0; iter < rects.length; iter++){
            rects[iter].opacity = e.value/127.0;
        }
    }

});