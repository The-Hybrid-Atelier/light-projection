var path = new Path.Circle({
    center: view.center,
    radius: view.bounds.height * 0.4
});

// Fill the path with a radial gradient color with three stops:
// yellow from 0% to 5%, mix between red from 5% to 20%,
// mix between red and black from 20% to 100%:
path.fillColor = {
    gradient: {
        stops: [['yellow', 0.05], ['red', 0.2], ['black', 1]],
        radial: true
    },
    origin: path.position,
    destination: path.bounds.rightCenter
};

