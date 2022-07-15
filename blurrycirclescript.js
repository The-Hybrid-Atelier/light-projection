function drawBlurryCircle(center, radius, blurAmount, color) {
    const circle = new Path.Circle({
        center,
        radius,
        shadowColor: color,
        shadowBlur: blurAmount,
        // set a fill color to make sure that the shadow is displayed
        fillColor: 'white',
        // use blendmode to hide the fill and only see the shadow
        blendMode: 'multiply'
    });

    const blurPlaceholder = circle
        .clone()
        .set({ shadowColor: null, fillColor: null })
        .scale((circle.bounds.width + (blurAmount * 2)) / circle.bounds.width);

    return new Group({
        children: [circle, blurPlaceholder],
        blendMode: 'source-over'
    });
}

drawBlurryCircle(view.center, 50, 20, 'red');
drawBlurryCircle(view.center + 30, 40, 30, 'lime');
drawBlurryCircle(view.center + 60, 30, 30, 'blue');