var o = new Path({segments:[
    [110, 70], [130, 70], [130,70], [110,60]], closed:true});
  o.scale(15, 15);
  o.translate(100, 45);
  o.fillColor = 'rgba(255, 0, 0, 0.2)';
  o.strokeColor = 'black';
  
var p = new Path({segments:[
    [110,70], [130,70], [130,75], [110,75], [110,70]], closed:true});
  p.scale(15, 15);
  p.translate(100, 100);
  p.fillColor = 'rgba(255, 0, 0, 0.2)';
  p.strokeColor = 'black';
  
var r = p.exclude(o);
  r.fillColor = 'rgba(0, 0, 255, 0.2)';
  r.strokeColor = 'black'
  r.translate(0,250)

var s = p.intersect(o);
  s.fillColor = 'rgba(0, 0, 255, 0.2)';
  s.strokeColor = 'black'
  s.translate(0,500)

// var circle = new Path.Circle(new Point(80, 50), 30);
//   circle.strokeColor = 'black';
//   circle.fillColor = 'rgba(255, 0, 0, 0.2)';
//   circle.strokeColor = 'black';


