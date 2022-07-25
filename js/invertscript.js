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
              square = paper.project.getItem({name: "square"})
              if (event.key == "enter"){
                origin.capture = !origin.capture
              }
              if (event.key == "right"){
                origin.contourScale *= 1.1
              }
              if (event.key == "left"){
                origin.contourScale *= 0.9
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
                square.fillColor = 'black'
                contour.fillColor = 'yellow'
                square.lightness = 1
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
    return paper
   }

   $(function(){
    paper = setupPaper();

    var square = new Path.Rectangle({
    name: "square",
    position: view.center,
    // fillColor: "pink",
    size: 2000,
  	visible: false
});


  })
  
   
   











// function drawInvertCue(path, origin){
//   // COMMENT FROM HERE 
// var square = new Path.Rectangle({
//     position: view.center,
//     size: 300,
//     strokeColor: 'white', 
//     fillColor:'yellow'
// });
// var scene = square.divide(contour);
//   scene.fillColor = 'rgba(0, 0, 255, 0.2)';
//   // scene.strokeColor = 'red'
//   scene.translate(0,-300)

// var ground = square.intersect(contour);
//   ground.fillColor = 'purple';
//   // ground.strokeColor = 'red'

// var figure = square.exclude(contour);
//   figure.fillColor = 'rgba(0, 0, 255, 0.2)';
//   // figure.strokeColor = 'red'
//   figure.translate(0,300)


//   tool = new paper.Tool({
//     onKeyDown: function(event) {
//       origin = paper.project.getItem({name: "origin"})
  
//       if (event.key == "a"){
//         console.log("REGISTERING KEY DOWN")
//         square.fillColor = 'red'
//         contour.fillColor = 'blue'
//       }
//       if (event.key == "b"){
//         square.fillColor = 'blue'
//         contour.fillColor = 'black'
//       }
//       if (event.key == "c"){
//         square.fillColor = 'blue'
//         contour.fillColor = 'yellow'
//       }
//       if (event.key == "d"){
//         square.fillColor = 'black'
//         contour.fillColor = 'black'
//       }
//     }
//    })
//   contour.scale(origin.contourScale)
//   ground.scale(origin.contourScale)
//   figure.scale(origin.contourScale)
//   scene.scale(origin.contourScale)
//   contour.simplify(5)
  
//   origin.bringToFront()




// }

// // INVERT SCRIPT STARTS
// var square = new Path.Rectangle({
//     position: view.center,
//     size: 1000,
//   	visible: false
// });

// var circle = new Path.Circle({
//     center: view.center,
//     radius: 200,
//   	visible: false
// });
// /*
// a = yellow circle yellow square
// b = blue circle blue square
// c = yellow circle blue square
// d = blue circle yellow square
// e = blue circle null square
// f = yellow circle null suqare
// */
// function onKeyDown(event) {
//     circle.visible = true;
//     square.visible = true;
// 	if(event.key == 'a') {
//         circle.fillColor = 'yellow';
//         square.fillColor = 'yellow';
//     }
//     if(event.key == 'b') {
//         circle.fillColor = 'blue';
//         square.fillColor = 'blue';
//     }
//     if(event.key == 'c') {
//         circle.fillColor = 'yellow';
//         square.fillColor = 'blue';
//     }
//     if(event.key == 'd') {
//         circle.fillColor = 'blue';
//         square.fillColor = 'yellow';
//     }
//     if(event.key == 'e') {
//         circle.fillColor = 'blue';
//         square.fillColor = null;
//     }
//     if(event.key == 'f') {
//         circle.fillColor = 'yellow';
//         square.fillColor = null;
//     }
// }
// // INVERT SCRIPT ENDS

