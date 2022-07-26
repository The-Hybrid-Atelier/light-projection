
var eye1 = new Path.Circle({
    center: [935, 435],
    radius: 30,
    visible: false,
    fillColor: 'white'
});

var eye2 = new Path.Circle({
    center: [990, 435],
    radius: 25,
    visible: false,
    fillColor: 'white'
});

var nose = new Path.Circle({
    center: [963, 460],
    radius: 27,
    visible: false,
    fillColor: 'white'
});

var mouth = new Path.Circle({
    center: [960, 510],
    radius: 25,
    visible: false,
    fillColor: 'white'
});

// NECK SVG
var neckData = 'M5 81L15 10L22 18L75 51L103 57L108 96H64L5 81Z';
var neck = new Path(neckData);

neck.strokeColor = 'white';
neck.fillColor = 'white';
neck.strokeWidth = 8;
neck.position = [900, 550];
// NECK SVG ENDS

// CHEST SVG
var chestData = 'M13 54L91 5L206 21L281 59L293 189L65 196L4 184V99L13 54Z';
var chest = new Path(chestData);

chest.strokeColor = 'white';
chest.fillColor = 'white';
chest.strokeWidth = 8;
chest.position = [900, 680];
// CHEST SVG ENDS

// DRAG TO MOVE ALL SPOTLIGHTS 
var group = new Group([eye1, eye2, nose, mouth, neck, chest]);

  function onMouseDrag(event) {
	group.translate(event.delta)
  }

var flagA = 0
var flagB = 0
var flagC = 0
var flagD = 0
var flagE = 0
var flagF = 0
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
            neck.visible = true;
            flagE = 1
        }else {
            neck.visible = false;
            flagE = 0
        }
    }
    if(event.key == 'f') {
        if(flagF == 0) {
            chest.visible = true;
            flagF = 1
        }else {
            chest.visible = false;
            flagF = 0
        }
    }
}


// var neck = new Path.Circle({
//     center: [945, 509],
//     radius: 30,
//     // visible: true,
//     fillColor: 'white'
// });

// START CODES FOR SHAPE SPOTLIGHTS
// var eye1 = new Path.Circle({
//     center: [920, 430],
//     radius: 30,
//     // visible: false,
//     fillColor: 'white'
// });

// var eye2 = new Path.Circle({
//     center: [980, 430],
//     radius: 30,
//     // visible: false,
//     fillColor: 'white'
// });

// var nose = new Path.Circle({
//     center: [950, 460],
//     radius: 30,
//     // visible: false,
//     fillColor: 'white'
// });

// var mouth = new Path.Circle({
//     center: [945, 509],
//     radius: 30,
//     // visible: false,
//     fillColor: 'white'
// });

// var chest = new Path({
//     segments: [[850, 510], [920, 520], [945, 525], [1050, 610], [735, 610]],
//     fillColor: 'white',
//     closed: true,
//     strokeWidth: 3,
//     // visible: false,
//     strokeJoin: 'round'
// });

// var neck = new Path({
//     segments: [[745, 610], [1020, 610], [1050,780], [735, 780]],
//     fillColor: 'white',
//     closed: true,
//     strokeWidth: 3,
//     strokeColor: 'red',
//     visible: false,
//     strokeJoin: 'round'
// });
// END CODE FOR SHAPE SPOTLIGHTS
// // EYE1 SVG
// var eye1 = new Path.Ellipse ({
// strokeColor: 'white',
// fillColor: 'white',
// strokeWidth: 8,
// position: [100, 100]
// });
// // EYE1 SVG ENDS

// // EYE2 SVG
// var eye2Data = 'M5 81L15 10L22 18L75 51L103 57L108 96H64L5 81Z';
// var eye2 = new Path(eye2Data);

// eye2.strokeColor = 'white';
// eye2.fillColor = 'white';
// eye2.strokeWidth = 8;
// eye2.position = [900, 550];
// // EYE2 SVG ENDS

// // NOSE SVG
// var noseData = 'M5 81L15 10L22 18L75 51L103 57L108 96H64L5 81Z';
// var nose = new Path(neckData);

// nose.strokeColor = 'white';
// nose.fillColor = 'white';
// nose.strokeWidth = 8;
// nose.position = [900, 550];
// // NOSE SVG ENDS

// // MOUTH SVG
// var mouthData = 'M5 81L15 10L22 18L75 51L103 57L108 96H64L5 81Z';
// var mouth = new Path(mouthData);

// mouth.strokeColor = 'white';
// mouth.fillColor = 'white';
// mouth.strokeWidth = 8;
// mouth.position = [900, 550];
// // MOUTH SVG ENDS

