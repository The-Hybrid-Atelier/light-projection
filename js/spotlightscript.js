var eye1 = new Path.Circle({
    center: [920, 430],
    radius: 30,
    // visible: false,
    fillColor: 'white'
});

var eye2 = new Path.Circle({
    center: [980, 430],
    radius: 30,
    // visible: false,
    fillColor: 'white'
});

var nose = new Path.Circle({
    center: [950, 460],
    radius: 30,
    // visible: false,
    fillColor: 'white'
});

var mouth = new Path.Circle({
    center: [945, 509],
    radius: 30,
    // visible: false,
    fillColor: 'white'
});

var chest = new Path({
    segments: [[755, 610], [1000, 610], [1060,800], [770, 800]],
    fillColor: 'white',
    closed: true,
    strokeWidth: 3,
    // visible: false,
    strokeJoin: 'round'
});

var group = new Group([eye1, eye2, nose, mouth, chest]);

group.center = [500, 460];

  function onMouseDrag(event) {
	group.translate(event.delta)
  }

// var neck = new Path.Circle({
//     center: [945, 509],
//     radius: 30,
//     // visible: true,
//     fillColor: 'white'
// });

var flagA = 0
var flagB = 0
var flagC = 0
var flagD = 0
var flagE = 0
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
    if(event.key == 'd') {
        if(flagD == 0) {
            mouth.visible = true;
            flagD = 1
        }else {
            mouth.visible = false;
            flagD = 0
        }
    }
    if(event.key == 'e') {
        if(flagE == 0) {
            chest.visible = true;
            flagE = 1
        }else {
            chest.visible = false;
            flagE = 0
        }
    }
}


