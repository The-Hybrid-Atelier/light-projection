var rects = [];
var i = 0;
var x = 0;
var y = 0;
for (x = 0; x < 10; x++) {
    for (y = 0; y < 10; y++) {
        rects[i] = new Path.Rectangle(new Point(y * 150, x * 100), new Point(150 + (y * 150), 100 + (x * 100)));
        rects[i].strokeColor = "black";
        i += 1;
    }
}
console.log(rects)
var rect_value = 0;
var clicked_values = []
var ctrl = new LaunchControl();
ctrl.open().then(function() {
  ctrl.led("even", "dark red");
});
ctrl.on("message", function(e) {
  if (e.dataType == "knob1" && e.track == 1){
    console.log("I AM DETECTING KNOB1");
    if (e.value != rect_value){
        rects[e.value].selected = true;
        rects[rect_value].selected = false;
    }
    else{
        rects[e.value].selected = true;
    }
    console.log(!clicked_values.includes(e.value));
    console.log(rects[e.value].fillColor == "black");
    if ( !clicked_values.includes(e.value) && rects[e.value].fillColor != "black"){
        rects[e.value].fillColor = "grey";
    }
    if ( !clicked_values.includes(rect_value) && rects[rect_value].fillColor == "grey"){
        rects[rect_value].fillColor = null;
    }
    rect_value = e.value;
  }
    if (e.dataType == "pad" && e.track == 0){
    console.log("I AM PRESSING BUTTON");
        rects[rect_value].fillColor = "black"; 
        if(!clicked_values.includes(rect_value))
           clicked_values.push(rect_value);
  }

      if (e.dataType == "pad" && e.track == 1){
        console.log("I AM PRESSING BUTTON 2");
        rects[rect_value].fillColor = "grey"; 
        var index = clicked_values.indexOf(rect_value);
        clicked_values.splice(index, 1);

  }
 console.log(clicked_values);
});