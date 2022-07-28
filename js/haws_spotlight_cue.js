const urlString = window.location.search
const urlParams = new URLSearchParams(urlString)
console.log("PARAMS", urlParams.get('UID') )
URL = "ws://162.243.120.86:3034"
last_message_seen = null
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
  cues = paper.project.getItem({name: "spotlight-cues"})
  if(contour){
  cues.fitBounds(contour.bounds.expand(new paper.Size(0, 0)))
  cues.scaling = new paper.Point(origin.contourScale,origin.contourScale)
  clipMask.addChild(contour)
  clipMask.addChild(cues) 
  origin.bringToFront()
  contour.clipMask = origin.clipped
  contour.scale(origin.contourScale)
  contour.simplify(5)
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
  drawSpotlightCues()
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
    header.cue = "SPOTLIGHT"
    header = _.extend(header, data)
    socket.jsend(header)
  }
  socket.log_end = function(data){
    if (data.action != last_message_seen.action)
      socket.log(last_message_seen)
      socket.log(data)

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

  var oldStrokeWidth = 0;
  var newStrokeWidth = 0;
  var iter = 0;
  ctrl.on("message", function(e) {
  if (e.dataType == "pad" && e.track == 0){
      eye1 = paper.project.getItem({name:'eye1'})
      eye1.visible = !eye1.visible
      message = {action: "CHANGE VISIBILITY", value: "EYE1", visible: eye1.visible, MIDI: e}
      socket.log(message)  
   }

 if (e.dataType == "pad" && e.track == 1){
    eye2 = paper.project.getItem({name:'eye2'})
    eye2.visible = !eye2.visible
    message = {action: "CHANGE VISIBILITY", value: "EYE2",visible: eye2.visible, MIDI: e}
    socket.log(message)  
 }

 if (e.dataType == "pad" && e.track == 2){
    nose = paper.project.getItem({name:'nose'})
    nose.visible = !nose.visible
    message = {action: "CHANGE VISIBILITY", value: "NOSE", visible: nose.visible, MIDI: e}
    socket.log(message)   
 }

 if (e.dataType == "pad" && e.track == 3){
    mouth = paper.project.getItem({name:'mouth'})
    mouth.visible = !mouth.visible
    message = {action: "CHANGE VISIBILITY", value: "MOUTH", visible: mouth.visible, MIDI: e}
    socket.log(message)  
 }

 if (e.dataType == "pad" && e.track == 4){
    neck = paper.project.getItem({name:'neck'})
    neck.visible = !neck.visible
    message = {action: "CHANGE VISIBILITY", value: "NECK", visible: neck.visible, MIDI: e}
    socket.log(message)  
 }


 if (e.dataType == "pad" && e.track == 5){
    chest = paper.project.getItem({name:'chest'})
    chest.visible = !chest.visible
    message = {action: "CHANGE VISIBILITY", value: "CHEST", visible: chest.visible, MIDI: e}
    socket.log(message)  
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
      if(event.key == 'a') {
        eye1 = paper.project.getItem({name:'eye1'})
        eye1.visible = !eye1.visible
        }
      if(event.key == 'b') {
      eye2 = paper.project.getItem({name:'eye2'})
      eye2.visible = !eye2.visible
      }
      if(event.key == 'c') {
      nose = paper.project.getItem({name:'nose'})
      nose.visible = !nose.visible
      }
      if(event.key == 'd') {
      mouth = paper.project.getItem({name:'mouth'})
      mouth.visible = !mouth.visible
      }
      if(event.key == 'e') {
      neck = paper.project.getItem({name:'neck'})
      neck.visible = !neck.visible
      }
      if(event.key == 'f') {
      chest = paper.project.getItem({name:'chest'})
      chest.visible = !chest.visible
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
function drawSpotlightCues(){
    var head = new paper.Path.Circle({
        name: 'head',
        center: new paper.Point(935, 330),
        radius: 30
    });

    var eye1 = new paper.Path.Circle({
        name: 'eye1',
        center: new paper.Point(935, 435),
        radius: 30,
        fillColor: 'white'
    });

    var nose = new paper.Path.Circle({
        name: 'nose',
        center: new paper.Point(968, 460),
        radius: 27,
        fillColor: 'white'
    });

    var mouth = new paper.Path.Circle({
        name: 'mouth',
        center: new paper.Point(963, 507),
        radius: 25,
        fillColor: 'white'
    });

    // NECK SVG
    var neckData = 'M5 75L16.5 7.5L30 17L83 50L111 56V102L72 95L5 75Z';
    var neck = new paper.Path(neckData);

    neck.name = 'neck';
    neck.strokeColor = 'white';
    neck.fillColor = 'white';
    neck.strokeWidth = 8;
    neck.position = [900, 555];
    // NECK SVG ENDS

    // CHEST SVG
    var chestData = 'M79 203L4 200.5V142L11.5 74.5L28 49L66 28L96.5 5L220 28L280 58.5L307 196L79 203Z';
    var chest = new paper.Path(chestData);

    chest.name = 'chest';
    chest.strokeColor = 'white';
    chest.fillColor = 'white';
    chest.strokeWidth = 8;
    chest.position = [900, 680];
    // CHEST SVG ENDS

    // EYE2 SVG
    var eye2Data = 'M0.5 23.5C0.500546 -1.90735e-06 26.4998 0 26.4998 0V54C26.4998 54 0.499454 47 0.5 23.5Z';
    var eye2 = new paper.Path(eye2Data);

    eye2.name = 'eye2';
    eye2.strokeColor = 'white';
    eye2.fillColor = 'white';
    eye2.strokeWidth = 0;
    eye2.position = [985, 435];
    // EYE2 SVG ENDS
    // DRAG TO MOVE ALL SPOTLIGHTS 
    var group = new paper.Group([head, eye1, eye2, nose, mouth, neck, chest]);
    group.name = "spotlight-cues"

    group.onMouseDrag = function(event) {
        group.translate(event.delta)
    }
}
