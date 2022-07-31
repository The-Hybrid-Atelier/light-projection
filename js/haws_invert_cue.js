const urlString = window.location.search
const urlParams = new URLSearchParams(urlString)
console.log("PARAMS", urlParams.get('UID') )
URL = "ws://162.243.120.86:3034"
var last_message_seen = {}
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
  contour = paper.project.getItem({name: "contour"})
  clipMask = paper.project.getItem({name: "clipMask"})
  if(contour){
    clipMask.addChild(contour)
    contour.clipMask = origin.clipped
    origin.bringToFront()
  }
}
function initDrawing(){
  var square = new Path.Rectangle({
    name: "square",
    position: view.center,
    size: 2000,
    visible: false
});
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
    header.cue = "INVERT"
    header = _.extend(header, data)
    socket.jsend(header)
  }
  socket.log_end = function(data){
    if (Math.abs(data.square_color - last_message_seen.square_color) > 10)
    {
      console.log("LOGGING")
      socket.log(last_message_seen)
      socket.log(data)
    }
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
  var ctrl = new LaunchControl(); 
  ctrl.open().then(function() {
    ctrl.led("all", "off");
  });
  ctrl.on("message", function(e) {
    //SWITCH 1
    if (e.dataType == "pad" && e.track == 0){
       square.fillColor = 'yellow'
       contour.fillColor = 'blue'
       square.visible = true
       contour.visible = true
       origin.fillColor = null
       contour.strokeColor = null
    }
    //KNOB 0 and SQUARE OPACITY
    if (e.dataType == "knob1" && e.track == 0){
       var raw = e.value;
       var hue_value = e.value/127.0 * 360;
       contour.fillColor.hue = hue_value;
       square.fillColor.hue = contour.fillColor.hue + 180;
       message = {MIDI: e, action: "CHANGE HUE", square_color: square.fillColor.hue, contour_color: contour.fillColor.hue }
       last_message_seen = message;  
    }

    if (e.dataType == "pad" && e.track == 1){
      socket.log(message);
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
      square = paper.project.getItem({name: "square"})


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
      if (event.key == "a"){
        console.log("REGISTERING KEY DOWN")
        square.visible = true
        contour.visible = true
        origin.fillColor = null
        contour.strokeColor = null
        square.fillColor = 'blue'
        contour.fillColor = 'yellow'
      }
      if (event.key == "b"){
        square.fillColor = 'blue'
        contour.fillColor = 'blue'
      }
      if (event.key == "c"){
        square.fillColor = 'yellow'
        contour.fillColor = 'blue'
      }
      if (event.key == "d"){
        square.fillColor = 'blue'
        contour.fillColor = 'yellow'
      }
      if (event.key == "e"){
        square.fillColor = null
        contour.fillColor = 'blue'
      }
      if (event.key == "f"){
        square.fillColor = null
        contour.fillColor = 'yellow'
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

