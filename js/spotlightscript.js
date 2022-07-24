var eye1 = new Path.Circle({
    radius: 40,
  	visible: true,
    position: (0,500),
    fillColor: 'white'
});

var eye2 = new Path.Circle({
    radius: 20,
  	visible: true,
    position: (100, 200),
    fillColor: 'white'
});

var nose = new Path.Circle({
    center: view.center,
    radius: 50,
  	visible: true,
    fillColor: 'white'
});

var mouth = new Path.Circle({
    center: view.center,
    radius: 10,
  	visible: true,
    position: (0, -200),
    fillColor: 'white'
});



// function onKeyDown(event) {
//     circle.visible = true;
//     square.visible = true;
// 	if(event.key == 'a') {
//         circle.fillColor = 'white';
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
//         square.fillColor = nuefll;
//     }
//     if(event.key == 'f') {
//         circle.fillColor = 'yellow';
//         square.fillColor = null;
//     }
// }

