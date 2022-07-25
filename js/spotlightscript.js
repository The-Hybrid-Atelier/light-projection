var eye1 = new Path.Circle({
    radius: 50,
  	visible: false,
    position: (0,500),
    fillColor: 'white'
});

var eye2 = new Path.Circle({
    radius: 50,
  	visible: false,
    position: (0, 200),
    fillColor: 'white'
});

var nose = new Path.Circle({
    center: view.center,
    radius: 50,
  	visible: false,
    fillColor: 'white'
});

// var mouth = new Path.Circle({
//     center: view.center,
//     radius: 50,
//   	visible: true,
//     position: (0, -800),
//     fillColor: 'green'
// });

var flagA = 0
var flagB = 0
var flagC = 0
function onKeyDown(event) {
	if(event.key == 'a') {
        if(flagA == 0) {
            eye1.visible = true;
            flagA = 1
        }else {
            eye1.visible = false;
            flagA = 0
        }
    }
    if(event.key == 'b') {
        if(flagB == 0) {
            eye2.visible = true;
            flagB = 1
        }else {
            eye2.visible = false;
            flagB = 0
        }
    }
    if(event.key == 'c') {
        if(flagC == 0) {
            nose.visible = true;
            flagC = 1
        }else {
            nose.visible = false;
            flagC = 0
        }
    }
}


