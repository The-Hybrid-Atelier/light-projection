function makeRect(from, to) {
    var rect = new Path.Rectangle(from, to);
    rect.strokeColor = 'black';
    rect.fillColor ='black'
    rect.strokeWidth = 3;
    rect.data.state = null;
    rect.data.corners = new Group();
    rect.data.showBounds = new Path.Rectangle({
        rectangle: rect.bounds,
        strokeColor: 'aqua'
    });
    var colors = [
        'red',
        'orange',
        'yellow',
        'green'
        ]
    rect.segments.forEach(function(segment, i) {
        var circle = new Path.Circle({
            center: segment.point,
            fillColor: colors[i],
            radius: 4
        });
        rect.data.corners.addChild(circle);
    })
    return rect;
}

function moveCircles(rect) {
    var circles = rect.data.corners.children;
    for (var i = 0; i < circles.length; i++) {
        circles[i].position = rect.segments[i].point;
    }
}

function adjustRect(rect) {
    moveCircles(rect);
    if (rect.data.showBounds) {
        rect.data.showBounds.remove();
        rect.data.showBounds = new Path.Rectangle({
            rectangle: rect.bounds,
            strokeColor: 'aqua'
        })
    }
}

var rect = makeRect([100, 100], [200, 250]);

tool.onMouseDown = function(e) {
    if (rect.contains(e.point)) {
        rect.data.state = 'moving';
        return;
    }
    if (rect.hitTest(e.point, {segments: true, tolerance: 3})) {
        if (e.modifiers.control) {
            rect.data.state = 'rotating';
        } else {
            // save the scale base (distance from center of click point)
            rect.data.state = 'resizing';
            rect.data.bounds = rect.bounds.clone();
            rect.data.scaleBase = e.point - rect.bounds.center;
        }
    }
}

tool.onMouseDrag = function(e) {
    if (rect.data.state === 'moving') {
        rect.position = rect.position + e.point - e.lastPoint;
        adjustRect(rect);
    } else if (rect.data.state === 'resizing') {
        // scale by distance from down point
        var bounds = rect.data.bounds;
        var scale = e.point.subtract(bounds.center).length /
                        rect.data.scaleBase.length;
        var tlVec = bounds.topLeft.subtract(bounds.center).multiply(scale);
        var brVec = bounds.bottomRight.subtract(bounds.center).multiply(scale);
        var newBounds = new Rectangle(tlVec + bounds.center, brVec + bounds.center);        
        rect.bounds = newBounds;        
        adjustRect(rect);
    } else if (rect.data.state === 'rotating') {
        // rotate by difference of angles, relative to center, of
        // the last two points.
        var center = rect.bounds.center;
        var baseVec = center - e.lastPoint;
        var nowVec = center - e.point;
        var angle = nowVec.angle - baseVec.angle;
        rect.rotate(angle);
        adjustRect(rect);
    }
}

tool.onMouseUp = function(e) {
    rect.data.state = null;
}
// function makeRect(from, to) {
//     var rect = new Path.Rectangle(from, to);
//     rect.strokeColor = 'black';
//     rect.fillColor ='black'
//     rect.strokeWidth = 3;
//     rect.data.state = null;
//     rect.data.corners = new Group();
//     rect.data.showBounds = new Path.Rectangle({
//         rectangle: rect.bounds,
//         strokeColor: 'aqua'
//     });
//     var colors = [
//         'red',
//         'orange',
//         'yellow',
//         'green'
//         ]
//     rect.segments.forEach(function(segment, i) {
//         var circle = new Path.Circle({
//             center: segment.point,
//             fillColor: colors[i],
//             radius: 4
//         });
//         rect.data.corners.addChild(circle);
//     })
//     return rect;
// }

// function moveCircles(rect) {
//     var circles = rect.data.corners.children;
//     for (var i = 0; i < circles.length; i++) {
//         circles[i].position = rect.segments[i].point;
//     }
// }

// function adjustRect(rect) {
//     moveCircles(rect);
//     if (rect.data.showBounds) {
//         rect.data.showBounds.remove();
//         rect.data.showBounds = new Path.Rectangle({
//             rectangle: rect.bounds,
//             strokeColor: 'aqua'
//         })
//     }
// }

// var rect = makeRect([100, 100], [200, 250]);

// tool.onMouseDown = function(e) {
//     if (rect.contains(e.point)) {
//         rect.data.state = 'moving';
//         return;
//     }
//     if (rect.hitTest(e.point, {segments: true, tolerance: 3})) {
//         if (e.modifiers.control) {
//             rect.data.state = 'rotating';
//         } else {
//             // save the scale base (distance from center of click point)
//             rect.data.state = 'resizing';
//             rect.data.bounds = rect.bounds.clone();
//             rect.data.scaleBase = e.point - rect.bounds.center;
//         }
//     }
// }

// tool.onMouseDrag = function(e) {
//     if (rect.data.state === 'moving') {
//         rect.position = rect.position + e.point - e.lastPoint;
//         adjustRect(rect);
//     } else if (rect.data.state === 'resizing') {
//         // scale by distance from down point
//         var bounds = rect.data.bounds;
//         var scale = e.point.subtract(bounds.center).length /
//                         rect.data.scaleBase.length;
//         var tlVec = bounds.topLeft.subtract(bounds.center).multiply(scale);
//         var brVec = bounds.bottomRight.subtract(bounds.center).multiply(scale);
//         var newBounds = new Rectangle(tlVec + bounds.center, brVec + bounds.center);        
//         rect.bounds = newBounds;        
//         adjustRect(rect);
//     } else if (rect.data.state === 'rotating') {
//         // rotate by difference of angles, relative to center, of
//         // the last two points.
//         var center = rect.bounds.center;
//         var baseVec = center - e.lastPoint;
//         var nowVec = center - e.point;
//         var angle = nowVec.angle - baseVec.angle;
//         rect.rotate(angle);
//         adjustRect(rect);
//     }
// }

// tool.onMouseUp = function(e) {
//     rect.data.state = null;
// }