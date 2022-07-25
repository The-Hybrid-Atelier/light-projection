
URL = "ws://162.243.120.86:3034"

  

function drawGridCue(path, origin){
  path = _.map(path.data, function(p){ pt = p[0]; return new paper.Point(pt[0], pt[1])})
  prev = paper.project.getItems({name: "contour"})
  _.each(prev, function(el, i) {
    el.remove()
  })
  
  grid = paper.project.getItem({name: "grid"})
  g = new paper.Group({name:"clipMask"})
  
  contour = new paper.Path({
    name: "contour",
    fillColor: "red",
    segments: path, 
    position: origin.position
  })

  grid.fitBounds(contour.bounds.expand(800))
  grid.scaling = new paper.Point(origin.gridScaling,origin.gridScaling)
  g.addChild(grid)
  g.addChild(contour)
  
  origin.bringToFront()
  contour.clipMask = origin.clipped

  contour.scale(origin.contourScale)
  contour.simplify(5)
}

$(function(){
  console.log("JS Main Function");
  // Create WebSocket connection.
  let socket = new WebSocket(URL);

  socket.onopen = function(e) {
    console.log("Connection established");

    // PROTOCOL STEP 1: GREET
    message = {event:"greeting", name: "js-client"};
    socket.send(JSON.stringify(message));
    // PROTOCOL STEP 2: SUBSCRIBE
    message = {subscribe:"depthai", service: "contour"}
    socket.send(JSON.stringify(message));

    c = new paper.Path.Circle({
      name: "origin",
      radius: 10,
      fillColor: "white",
      contourScale:  1,
      clipped: false,
      capture: true,
      gridScaling: 1,
      onMouseDrag: function(event){
        this.translate(event.delta)
      },
      position: paper.view.center
    })
  };

  socket.onmessage = function(event) {
    // console.log(event.data);
    origin = paper.project.getItem({name: "origin"})

    if(origin.capture){
      path = JSON.parse(event.data)
      // console.log(path)
      if("event" in path && path.event == "contour" && "data" in path){
        drawGridCue(path, origin);
        // drawInvertCue(path, origin);
      }
    }
    
  };

  socket.onclose = function(event) {
    console.log('Connection was closed');
  };

  socket.onerror = function(error) {
    console.log("error", error.message)
  };
  
})
