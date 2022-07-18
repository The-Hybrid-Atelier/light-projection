
URL = "ws://162.243.120.86:3034"

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
      radius: 20,
      fillColor: "blue",
      contourScale: 1,
      clipped: false,
      onMouseDrag: function(event){
        this.translate(event.delta)
      },
      position: paper.view.center
    })
  };

  socket.onmessage = function(event) {
    // console.log(event.data);
    path = JSON.parse(event.data)
    if("data" in path){
     
      path = _.map(path.data, function(p){ pt = p[0]; return new paper.Point(pt[0], pt[1])})
      prev = paper.project.getItems({name: "contour"})
      _.each(prev, function(el, i) {
        el.remove()
      })

      origin = paper.project.getItem({name: "origin"})
      grid = paper.project.getItem({name: "grid"})
      g = new paper.Group({name:"clipMask"})
      g.addChild(grid)
      contour = new paper.Path({
        parent: g,
        name: "contour",
        fillColor: "red",
        segments: path, 
        position: origin.position
      })
      contour.scale(origin.contourScale)
      contour.simplify(5)
      origin.bringToFront()
      contour.clipMask = origin.clipped

      // console.log(path)
      // l.position = paper.view.center
    }
    
    
  };

  socket.onclose = function(event) {
    console.log('Connection was closed');
  };

  socket.onerror = function(error) {
    console.log("error", error.message)
  };
  
})
