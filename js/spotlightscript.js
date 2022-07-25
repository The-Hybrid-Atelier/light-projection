var eye1 = new Path.Circle({
    center: [920, 430],
    radius: 30,
    visible: false,
    fillColor: 'white'
});

var eye2 = new Path.Circle({
    center: [980, 430],
    radius: 30,
    visible: false,
    fillColor: 'white'
});

var nose = new Path.Circle({
    center: [950, 460],
    radius: 30,
    visible: false,
    fillColor: 'white'
});

var mouth = new Path.Circle({
    center: [945, 509],
    radius: 30,
    visible: false,
    fillColor: 'white'
});

var neck = new Path.Circle({
    center: [945, 509],
    radius: 30,
    visible: true,
    fillColor: 'white'
});

var chest = new Path.Circle({
    center: [945, 509],
    radius: 30,
    visible: true,
    fillColor: 'white'
});

var flagA = 0
var flagB = 0
var flagC = 0
var flagD = 0
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
}


