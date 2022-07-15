// URL = "ws://162.243.120.86:3034"
//   $(function(){
//     console.log("JS Main Function");

//     // Create WebSocket connection.
//     let socket = new WebSocket(URL);

//     socket.onopen = function(e) {
//       console.log("Connection established");

//       // PROTOCOL STEP 1: GREET
//       message = {event:"greeting", name: "js-client"};
//       socket.send(JSON.stringify(message));
//       // PROTOCOL STEP 2: SUBSCRIBE
//       message = {subscribe:"depthai", service: "contour"}
//       socket.send(JSON.stringify(message));
//     };

//     socket.onmessage = function(event) {
//       // console.log(event.data);
//       path = JSON.parse(event.data)
//       if("data" in path){
//         path = _.map(path.data, function(p){ pt = p[0]; return new paper.Point(pt[0], pt[1])})
//         paper.project.clear()
//         l = new paper.Path({
//           fillColor: "white",
//           segments: path
//         })
//         // console.log(path)
//         l.position = paper.view.center
//       }
      
      
//     };

//     socket.onclose = function(event) {
//       console.log('Connection was closed');
//     };

//     socket.onerror = function(error) {
//       console.log("error", error.message)
//     };
    
//   })

//   window.make_circle = function(remote_id) {
//     new paper.Path.Circle({
//       radius: 50,
//       fillColor: "red",
//       position: paper.view.center,
//       remote_id: remote_id
//     });
//   };

//   $(function() {
//     window.app = new PaperJSApp({
//       canvas: $('canvas'),
//       name: "App"
//     });
    
//     make_circle()
//   });
   
// / DO NOT MODIFY CODE UNDER THIS LINE      
// :scss
//   html, body, #sandbox{
//     width: 100%;
//     height: 100%;
//     overflow:hidden;
//   }
//   canvas{
//     border: 1px solid blue;
//     background: lighten(blue, 40%);
//   }
//   button{
//     position: fixed;
//     z-index: 100;
//     bottom: 2em;
//     right: 2em;
//   }


// #sandbox
//   %canvas{resize: "resize"}
  
var drawGridRects = function(num_rectangles_wide, num_rectangles_tall, boundingRect) {
    var width_per_rectangle = boundingRect.width / num_rectangles_wide;
    var height_per_rectangle = boundingRect.height / num_rectangles_tall;
    for (var i = 0; i < num_rectangles_wide; i++) {
        for (var j = 0; j < num_rectangles_tall; j++) {
            var aRect = new paper.Path.Rectangle(boundingRect.left + i * width_per_rectangle, boundingRect.top + j * height_per_rectangle, width_per_rectangle, height_per_rectangle);
            aRect.strokeColor = 'black';
            aRect.fillColor = 'white';
        }
    }
}

drawGridRects.onMouseDrag = function(event) {
    group1.position += event.delta;
}

rectangle.onClick = function (e) {
    // do what you need to do, like delete the item
}

drawGridRects(4, 4, paper.view.bounds);