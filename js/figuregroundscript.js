var circle = new Path.Circle({
    center: view.center,
    radius: 50,
    fillColor: 'purple'
});

var square = new Path.Rectangle({
    position: view.center,
    size: 200,
    fillColor: 'purple'
});

var figure = square.intersect(circle);
  figure.fillColor = 'pink';
  figure.strokeColor = 'black'
  figure.translate(0,-500)
  
var ground = square.exclude(circle);
  ground.fillColor = 'rgba(0, 0, 255, 0.2)';
  ground.strokeColor = 'black'
  ground.translate(0,-250)