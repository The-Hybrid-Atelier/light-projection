var values = {
    amount: 30
};

var raster,
    group;
var piece = createPiece();
var count = 0;

handleImage('bg.jpg');

var text = new PointText({
    point: view.center,
    justification: 'center',
    fillColor: 'white',
    fontSize: 15,
    content: window.FileReader
        ? 'Drag & drop an image from your desktop'
        : 'To drag & drop images, please use Webkit, Firefox, Chrome or IE 10'
});

function createPiece() {
    var group = new Group();
    var hexagon = new Path.RegularPolygon({
        center: view.center,
        sides: 6,
        radius: 50,
        fillColor: 'white',
        parent: group
    });
    for (var i = 0; i < 2; i++) {
        var path = new Path({
            closed: true,
            parent: group,
            fillColor: i == 0 ? 'white' : 'white'
        });
        for (var j = 0; j < 3; j++) {
            var index = (i * 2 + j) % hexagon.segments.length;
            path.add(hexagon.segments[index].clone());
        }
        path.add(hexagon.bounds.center);
    }
    group.remove();
    return group;
}


document.body.style.cursor = "pointer";
function handleImage(image) {
    count = 0;
    var size = piece.bounds.size;

    if (group)
        group.remove();
    raster = new Raster(image);
    raster.visible = false;
    raster.on('load', function () {
        raster.fitBounds(view.bounds, true);
        group = new Group();
        for (var y = 0; y < values.amount; y++) {
            for (var x = 0; x < values.amount; x++) {
                var copy = piece.clone();
                copy.position += size * [x + (y % 2 ? 0.5 : 0), y * 0.75];
                group.addChild(copy);
            }
        }
        group.fitBounds(view.bounds, true);
        group.scale(1.1);
    })
}

function onFrame(event) {
    if (!group)
        return;

    var length = Math.min(count + values.amount, group.children.length);
    for (var i = count; i < length; i++) {
        piece = group.children[i];
        piece.onClick = function (e) {
            piece = e.target
            console.log(piece.fillColor)
            if (piece.fillColor) {
                piece.fillColor ? color = "#9F9F9F" : color = "white";
                var hexagon = piece.children[0];
                hexagon.fillColor = color

                var right = piece.children[1];
                right.fillColor = color;
                right.fillColor.brightness *= 0.75;

                var left = piece.children[2];
                left.fillColor = color;
                left.fillColor.brightness *= 0.5;
            } else {
                color = "white"
                var hexagon = piece.children[0];
                hexagon.fillColor = color

                var right = piece.children[1];
                right.fillColor = color;

                var left = piece.children[2];
                left.fillColor = color;
            }
        }
    }
    count += values.amount;
}