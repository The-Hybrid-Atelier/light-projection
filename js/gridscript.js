const urlString = window.location.search
const urlParams = new URLSearchParams(urlString)
console.log("PARAMS", urlParams.get('UID') )
URL = "ws://162.243.120.86:3034"
function setupPaper(){
 console.log("Setting up paper")
 canvas = $('canvas')[0]
 parent = $('canvas').parent()
 $(canvas)
  .attr('width', parent.width())
  .attr('height', parent.height())
 window.paper = new paper.PaperScope
 paper.setup(canvas)
 paper.view.zoom = 1
 $(canvas)
  .attr('width', parent.width())
  .attr('height', parent.height())
 paper.install(window)
  // KEY CONTROLS

  
 tool = new paper.Tool({
  onKeyDown: function(event) {
    origin = paper.project.getItem({name: "origin"})

    if (event.key == "enter"){
      origin.capture = !origin.capture
      origin.fillColor = null
    }
    if (event.key == "right"){
      origin.contourScale *= 1.15
    }
    if (event.key == "left"){
      origin.contourScale *= 0.85
    }
    if (event.key == "i"){
     origin = paper.project.getItem({name: "origin"})
     origin.clipped = !origin.clipped
    }
    if (event.key == 'space') {
        // Scale the path by 110%:
        path.scale(1.1);
        // Prevent the key event from bubbling
        return false;
      }
    }
 })
 return paper
}


$(function(){
  paper = setupPaper();

  var gridGroup = new paper.Group({
   name: "grid"
  })
  var rects = [];
  RECT_SIZE = 200
  var i = 0;
  var x = 0;
  var y = 0;

  for (x = 0; x < 8; x++) {
      for (y = 0; y < 8; y++) {
          rects[i] = new paper.Path.Rectangle({
             parent: gridGroup,
             from: new paper.Point(y * RECT_SIZE, x * RECT_SIZE), 
             to: new paper.Point(RECT_SIZE + (y * RECT_SIZE), RECT_SIZE + (x * RECT_SIZE))
            });
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
  console.log("Websocket Function");
 let socket = new WebSocket(URL);
 socket.onopen = function(e) {
   console.log("Listening to Cues");
 }; 
 socket.onclose = function(event) {
   console.log('No longer listening to cues');
 };
 socket.onerror = function(error) {
   console.log("error", error.message)
 };
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
      if(e.value < 64)
      {
        if (!clicked_values.includes(rect_value)){
          rects[e.value].fillColor = "pink";
          if (rect_value != -1)
          {
            rects[rect_value].fillColor = "black";
          }
        }

        if (clicked_values.includes(rect_value)){
          rects[e.value].fillColor = "pink";
          if (rect_value != -1)
          {
            rects[rect_value].fillColor = "white";
          }
        }

        rect_value = e.value
      }
    
      // if(e.value < 64 && e.value%8 == 0)
      // {
      //   for (var row_rects = 0; row_rects < 8; row_rects++){
      //     // rects[e.value].selected = true;
      //     if(rects[e.value + row_rects].fillColor != "white")
      //         rects[e.value + row_rects].strokeColor = "blue";
      //     if (rect_value != -1){
      //         rects[rect_value + row_rects].selected = false;
      //         if(rects[rect_value +row_rects].fillColor != "white")
      //             rects[rect_value +row_rects].fillColor = "black";}
      //             rects[rect.value + row_rects].strokeColor = "white";
      //       }
      //     rect_value = e.value;
      // }
    }
 //USE BUTTONS TO CHOOSE COLUMNS
   if (e.dataType == "pad"){
    console.log("I AM DETECTING PAD", e.track, clicked_values, rect_value);
    if (clicked_values.includes(rect_value))
    {
     rects[rect_value].fillColor = "black";
     ctrl.led(e.track, "off");
     var index = clicked_values.indexOf(rect_value);
     clicked_values.splice(index, 1);
     message = {event: "LOG", timestamp: Date.now(), UID: ,  cue: "GRID", MIDI: e, action: "DESELECT", value: rect_value }
     socket.send(JSON.stringify(message))  
    }
    else
    {
      ctrl.led(e.track, "dark red");
      rects[rect_value].fillColor = "white";
      clicked_values.push(rect_value);
      message = {event: "LOG", timestamp: Date.now(), UID: urlParams.get('UID'),  cue: "GRID", MIDI: e, action: "SELECT", value: rect_value }
      socket.send(JSON.stringify(message))  
    }
    // if (clicked_values.includes(rect_value + e.track))
    // {
    //  rects[rect_value + e.track].fillColor = "black";
    //  ctrl.led(e.track, "off");
    //  var index = clicked_values.indexOf(rect_value + e.track);
    //  clicked_values.splice(index, 1);
    // }
    // else
    // {
    //   ctrl.led(e.track, "dark red");
    //   rects[rect_value + e.track].fillColor = "white";
    //   clicked_values.push(rect_value + e.track);
    // }
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
      message = {event: "LOG", timestamp: Date.now(), UID: urlParams.get('UID'),  cue: "GRID", MIDI: e, action: "CHANGE STROKE WIDTH", value: newStrokeWidth }
      socket.send(JSON.stringify(message))  
    oldStrokeWidth = newStrokeWidth;

  }
  //ZOOM IN ON RECTANGLES
    if (e.dataType == "knob1" && e.track == 2){
      var cap_was_off = false;
        console.log("DETECTING KNOB1 TRACK 2")
        // console.log(e.value)
        p = e.value/127.0 // [0,1]
        p = p * 2 // [0, 2]
        // console.log(p)
        if (p > 0.5 && p < 2){
            
          

            origin = paper.project.getItem({name: "origin"})
            if (!origin.capture){
              console.log("CAPTURE OFF")
              origin.capture = !origin.capture
              cap_was_off = true;
              origin.gridScaling = p
              // origin.capture = !origin.capture
            }
            else
            {
              origin.gridScaling = p
            }
            // grid.gridScaling  = p
            
            }

      message = {event: "LOG", timestamp: Date.now(), UID: urlParams.get('UID'),  cue: "GRID", MIDI: e, action: "ZOOM", value: p }
      socket.send(JSON.stringify(message))  
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
})
