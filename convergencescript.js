var path1 = new Path.Line({
    from: [20, 20],
    to: [200, 200],
    strokeColor: 'black'
});

var path2 = new Path.Line({
    from: [25, 20],
    to: [200, 200],
    strokeColor: 'black'
});

var path3 = new Path.Line({
    from: [30, 20],
    to: [200, 200],
    strokeColor: 'black'
});

var path4 = new Path.Line({
    from: [20, 20],
    to: [200, 200],
    strokeColor: 'black'
});

// use this to move all lines at once

var group1 = new Group();
group1.addChild(path1);
group1.addChild(path2);
group1.addChild(path3);
group1.addChild(path4);
group1.onMouseDrag = function(event) {
    group1.position += event.delta;
}
project.activeLayer.addChild(group1);

