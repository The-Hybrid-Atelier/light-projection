const urlString = window.location.search
const urlParams = new URLSearchParams(urlString)
console.log("PARAMS", urlParams.get('UID') )
URL = "ws://162.243.120.86:3034"
// MAIN FUNCTION
$(function(){
  console.log("Loading GridWorld")
  setupPaper()
  initDrawing()
  paper.view.onFrame = updateCanvas
  window.socket = socketConfiguration(drawContour)  
  keyBindings()  
  midiBindings()
})

function updateCanvas(){
  grid = paper.project.getItem({name: "grid"})
  contour = paper.project.getItem({name: "contour"})
  clipMask = paper.project.getItem({name: "clipMask"})
  if(contour){
    grid.fitBounds(contour.bounds.expand(800))
    grid.scaling = new paper.Point(origin.gridScaling,origin.gridScaling)
    clipMask.addChild(grid)
    clipMask.addChild(contour)
    contour.clipMask = origin.clipped
    origin.bringToFront()
  }
}
function initDrawing(){
  origin = new paper.Path.Circle({
    name: "origin",
    radius: 10,
    fillColor: "white",
    contourScale:  1,
    clipped: false,
    capture: true,
    captureScale: 1,
    gridScaling: 1,
    onMouseDrag: function(event){
      this.translate(event.delta)
    },
    position: paper.view.center
  })
  clipMask = new paper.Group({name:"clipMask"})
  drawGrid()
}
function socketConfiguration(socketDrawingFn){
  console.log("Socket Configuration");
  // Create WebSocket connection.
  let socket = new WebSocket(URL);
  socket.jsend = function(msg){
    socket.send(JSON.stringify(msg))
  }
  socket.log = function(data){
    header = {event: "LOG", timestamp: Date.now(), UID: urlParams.get('UID')}
    header.cue = "GRID"
    header = _.extend(header, data)
    socket.jsend(header)
  }
  last_message_seen = null
  socket.log_end = function(data){
    //compare data against the last_message_seen
    // if its different, then log this message and the last message
    // else ignore it, but update last message
  }
  socket.onopen = function(e) {
    console.log("Connection established");
    // paper.view.onFrame = updateCanvas
    // PROTOCOL STEP 1: GREET
    message = {event:"greeting", name: "js-client"};
    socket.jsend(message);
    // PROTOCOL STEP 2: SUBSCRIBE
    message = {subscribe:"depthai", service: "contour"}
    socket.jsend(message);
  };

  socket.onmessage = function(event) {
    // console.log(event.data);
    origin = paper.project.getItem({name: "origin"})
    if(origin.capture){
      path = JSON.parse(event.data)
      if("event" in path && path.event == "contour" && "data" in path){
        socketDrawingFn(path)
      }
    }
  };

  socket.onclose = function(event) { console.log('Connection was closed');};
  socket.onerror = function(error) { console.log("error", error.message)};
  return socket
}
function midiBindings(){
  var rect_value = -1;
  var clicked_values = []
  rects = paper.project.getItem({name: "grid"}).children
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
    }
   // USE BUTTONS TO CHOOSE COLUMNS
   if (e.dataType == "pad" && e.track == 0){
    console.log("I AM DETECTING PAD", e.track, clicked_values, rect_value);
    if (clicked_values.includes(rect_value))
    {
     rects[rect_value].fillColor = "black";
     ctrl.led(e.track, "off");
     var index = clicked_values.indexOf(rect_value);
     clicked_values.splice(index, 1);
     message = { MIDI: e, action: "DESELECT", value: rect_value }
     socket.log(message)
    }
    else
    {
      ctrl.led(e.track, "dark red");
      rects[rect_value].fillColor = "white";
      clicked_values.push(rect_value);
      message = { MIDI: e, action: "SELECT", value: rect_value }
      socket.log(message) 
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
      message = {event: "LOG", timestamp: Date.now(), UID: urlParams.get('UID'),  cue: "GRID", MIDI: e, action: "CHANGE STROKE WIDTH", value: newStrokeWidth }
      socket.jsend(message)  
    oldStrokeWidth = newStrokeWidth;

  }
  //ZOOM IN ON RECTANGLES
    if (e.dataType == "knob1" && e.track == 2){
      // var cap_was_off = false;
        
        // console.log(e.value)
        p = e.value/127.0 // [0,1]
        p = p * 0.67 // [0, 2]
        // console.log(p)
        if (p > 0.15 && p < 0.67){
          console.log("DETECTING KNOB1 TRACK 2", p)
          
            grid = paper.project.getItem({name: "grid"})
            origin = paper.project.getItem({name: "origin"})
            origin.gridScaling = p
        }

      message = {event: "LOG", timestamp: Date.now(), UID: urlParams.get('UID'),  cue: "GRID", MIDI: e, action: "ZOOM", value: p }
      socket.jsend(message)  
  }

  //CHANGE RECTANGLE OPACITY
    if (e.dataType == "knob1" && e.track == 3)
    {
        console.log("DETECTING KNOB1 TRACK 3")
        for( iter = 0; iter < rects.length; iter++){
            rects[iter].opacity = e.value/127.0;
        }
    }

        if (e.dataType == "pad" && e.track == 1)
    {
        console.log("DETECTING KNOB1 TRACK 3")
        origin.capture = !origin.capture;
    }

 });
}
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
}  
function keyBindings(){
  tool = new paper.Tool({
    onKeyDown: function(event) {
      origin = paper.project.getItem({name: "origin"})

      if (event.key == "enter"){
        origin.capture = !origin.capture
        origin.captureScale = origin.gridScaling
        origin.fillColor = null
      }
      if (event.key == "right"){
        origin.contourScale *= 1.15
      }
      if (event.key == "left"){
        origin.contourScale *= 0.85
      }
      if (event.key == "["){
        origin.gridScaling *= 1.15
      }
      if (event.key == "]"){
        origin.gridScaling *= 0.85
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
}
function drawContour(){
  console.log("Drawing contour")
  origin = paper.project.getItem({name: "origin"})
  path = _.map(path.data, function(p){ pt = p[0]; return new paper.Point(pt[0], pt[1])})
  prev = paper.project.getItems({name: "contour"})
  _.each(prev, function(el, i) {
    el.remove()
  })
  contour = new paper.Path({
    name: "contour",
    fillColor: "red",
    segments: path, 
    position: origin.position
  })
  contour.scaling = origin.contourScale
  contour.simplify(5)
}
function drawGrid(){
  var gridGroup = new paper.Group({name: "grid"})
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
}
