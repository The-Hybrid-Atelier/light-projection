var square = new Path.Rectangle({
    position: view.center,
    size: 1000,
  	visible: false
});

var circle = new Path.Circle({
    center: view.center,
    radius: 200,
  	visible: false
});


/*
a = yellow circle yellow square
b = blue circle blue square
c = yellow circle blue square
d = blue circle yellow square
e = blue circle null square
f = yellow circle null suqare
*/

function onKeyDown(event) {
    circle.visible = true;
    square.visible = true;
	if(event.key == 'a') {
        circle.fillColor = 'yellow';
        square.fillColor = 'yellow';
    }
    if(event.key == 'b') {
        circle.fillColor = 'blue';
        square.fillColor = 'blue';
    }
    if(event.key == 'c') {
        circle.fillColor = 'yellow';
        square.fillColor = 'blue';
    }
    if(event.key == 'd') {
        circle.fillColor = 'blue';
        square.fillColor = 'yellow';
    }
    if(event.key == 'e') {
        circle.fillColor = 'blue';
        square.fillColor = null;
    }
    if(event.key == 'f') {
        circle.fillColor = 'yellow';
        square.fillColor = null;
    }
}

