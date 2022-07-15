var rectangle = new Rectangle(new Point(50, 50), new Point(150, 100));
var path = new Path.Rectangle(rectangle);
// path.fillColor = '#e9e9ff';
// path.selected = true;

// var copy = path.clone();
// copy.pivot = copy.bounds.leftCenter;
// copy.position = path.bounds.rightCenter;
// copy.strokeColor = 'red';

var path = new Path.Rectangle(rectangle);
path.strokeColor = "black";
path.position = [51, 26];
console.log(view);
for(x = 0; x <= 8; x++)
{
    for(y = 0; y <= 25; y++){
        clone = path.clone();
        clone.position = [clone.position.x + (x * 100), clone.position.y + (y * 50)];
    }
        // clone = path_2.clone();
        // clone.position = [clone.position.x + (i * 100), clone.position.y];
}



// copy.position = new Point(100, 139);


    function onMouseMove(event) {
		event.item.selected = true;
	}

	function onMouseDown(event) {
		path.style = {
			fillColor: 'null',
	  	}
	}

    path.onDoubleClick = function(event) {
        this.fillColor = null;
    }

	// apply these functions to all clones
