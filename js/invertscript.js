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
//color changes on key presses
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

