var path = new Path.RegularPolygon({
	center: [100, 100],
	radius: 50,
	sides: 10
  });

  path.style = {
	fillColor: 'red',
	strokeColor: null
  }
  path.smooth();
  path.selected = true;

  function onMouseMove(event) {
	project.activeLayer.selected = false;
	if (event.item)
		event.item.selected = true;
	}

	function onMouseDown(event) {
		path.style = {
			fillColor: 'black',
	  	}
	} 
	// make this so that it changes back when clicked again
