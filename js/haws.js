
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
  contour.scale(origin.contourScale)
  contour.simplify(5)

  grid.fitBounds(contour.bounds.expand(800))
  grid.scaling = new paper.Point(origin.gridScaling,origin.gridScaling)
  g.addChild(grid)
  g.addChild(contour)
  
  origin.bringToFront()
  contour.clipMask = origin.clipped
}
function drawInvertCue(path, origin){
  path = _.map(path.data, function(p){ pt = p[0]; return new paper.Point(pt[0], pt[1])})
  
  prev = paper.project.getItems({name: "contour"})
  _.each(prev, function(el, i) {
    el.remove()
  })

  contour = new paper.Path({
    name: "contour",
    segments: path, 
    position: origin.position,
    strokeColor: 'white',
    fillColor: 'white'
  })

var square = new Path.Rectangle({
    position: view.center,
    size: 300,
    strokeColor: 'white', 
    fillColor:'yellow'
});

// tool = new paper.Tool({
//   onKeyDown: function(event) {
//     if (event.key == 'a'){
//       var scene = square.divide(contour);
//       scene.fillColor = 'rgba(0, 0, 255, 0.2)';
//       scene.strokeColor = 'red'
//     }
//     if (event.key == "b"){
//       square.fillColor = 'blue'
//       contour.fillColor = 'black'
//     }
//     if (event.key == "c"){
//       square.fillColor = 'blue'
//       contour.fillColor = 'yellow'
//     }
//     if (event.key == "d"){
//       square.fillColor = 'black'
//       contour.fillColor = 'black'
//     }
//   }
//  })


// color changes on key presses

// tool = new paper.Tool({
//   onKeyDown: function(event) {
//     origin = paper.project.getItem({name: "origin"})

//     if (event.key == "a"){
//       square.fillColor = 'black'
//       contour.fillColor = 'yellow'
//     }
//     if (event.key == "b"){
//       square.fillColor = 'blue'
//       contour.fillColor = 'black'
//     }
//     if (event.key == "c"){
//       square.fillColor = 'blue'
//       contour.fillColor = 'yellow'
//     }
//     if (event.key == "d"){
//       square.fillColor = 'black'
//       contour.fillColor = 'black'
//     }
//   }
//  })

// Boolean operations 

var scene = square.divide(contour);
  scene.fillColor = 'rgba(0, 0, 255, 0.2)';
  // scene.strokeColor = 'red'
  scene.translate(0,-300)

var ground = square.intersect(contour);
  ground.fillColor = 'purple';
  // ground.strokeColor = 'red'

var figure = square.exclude(contour);
  figure.fillColor = 'rgba(0, 0, 255, 0.2)';
  // figure.strokeColor = 'red'
  figure.translate(0,300)



  contour.scale(origin.contourScale)
  ground.scale(origin.contourScale)
  figure.scale(origin.contourScale)
  scene.scale(origin.contourScale)
  contour.simplify(5)
  
  origin.bringToFront()

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
        // drawGridCue(path, origin);
        drawInvertCue(path, origin);
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
