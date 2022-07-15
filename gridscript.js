var rects = [];
var i = 0;
for (x = 0; x <= 25; x++) {
    for (y = 0; y <= 25; y++) {
        rects[i] = new Path.Rectangle(new Point(y * 100, x * 50), new Point(100 + (y * 100), 50 + (x * 50)));
        rects[i].strokeColor = "black";
        i += 1;
    }
}

function clickHandler(j, rectangles) {
    rectangles[j].fillColor = "white"
}
for (r in rects) {
    rects[r].onClick = clickHandler(r, rects)
}

for (r in rects) {
    rects[r].onMouseMove = function (e) {
        e.target.selected = true
        document.body.style.cursor = "pointer";
    }

    rects[r].onMouseLeave = function (e) {
        e.target.selected = false
    }

    rects[r].onClick = function (e) {
        if (e.target.myColor && e.target.myColor === "white") {
            e.target.myColor = "black";
        } else if (e.target.myColor && e.target.myColor === "black") {
            e.target.myColor = "white"
        } else {
            e.target.myColor = "black"
        }
        e.target.fillColor = e.target.myColor
    }
}