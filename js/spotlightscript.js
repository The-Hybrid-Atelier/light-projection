
URL = "ws://162.243.120.86:3034"
function setupPaper(){
    console.log("Setting up paper")
    canvas = $('canvas')[0]
    parent = $('canvas').parent()
    $(canvas)
     .attr('width', parent.width())
     .attr('height', parent.height())
    window.paper = new paper.PaperScope
    paper.setup(canvas)
    paper.view.zoom = 1
    $(canvas)
     .attr('width', parent.width())
     .attr('height', parent.height())
    paper.install(window)
     // KEY CONTROLS
   
     
    tool = new paper.Tool({
     onKeyDown: function(event) {
       origin = paper.project.getItem({name: "origin"})
   
       if (event.key == "enter"){
         origin.capture = !origin.capture
       }
       if (event.key == "right"){
         origin.contourScale *= 1.05
       }
       if (event.key == "left"){
         origin.contourScale *= 0.95
       }
       if (event.key == "i"){
        console.log("inverting", origin.clipped)
        origin = paper.project.getItem({name: "origin"})
        origin.clipped = !origin.clipped
        origin.visible = !origin.visible
       }
       if (event.key == 'space') {
           // Scale the path by 110%:
           path.scale(1.1);
           // Prevent the key event from bubbling
           return false;
         }
       
        if(event.key == 'a') {
        eye1 = paper.project.getItem({name:'eye1'})
        eye1.visible = !eye1.visible
        }
        if(event.key == 'b') {
        eye2 = paper.project.getItem({name:'eye2'})
        eye2.visible = !eye2.visible
        }
        if(event.key == 'c') {
        nose = paper.project.getItem({name:'nose'})
        nose.visible = !nose.visible
        }
        if(event.key == 'd') {
        mouth = paper.project.getItem({name:'mouth'})
        mouth.visible = !mouth.visible
        }
        if(event.key == 'e') {
        neck = paper.project.getItem({name:'neck'})
        neck.visible = !neck.visible
        }
        if(event.key == 'f') {
        chest = paper.project.getItem({name:'chest'})
        chest.visible = !chest.visible
        }
    }
    })
    return paper
}

  
//    MAIN FUNCTION
   $(function(){
     paper = setupPaper();
     draw()
     console.log("Websocket Function");
     let socket = new WebSocket(URL);
     socket.onopen = function(e) {
       console.log("Listening to Cues");
     }; 
     socket.onclose = function(event) {
       console.log('No longer listening to cues');
     };
     socket.onerror = function(error) {
       console.log("error", error.message)
     };
     

     var ctrl = new LaunchControl();
    ctrl.open().then(function() {
        ctrl.led("all", "off");
    });
    ctrl.on("message", function(e) {

        if (e.dataType == "pad" && e.track == 0){
            message = {event: "LOG", cue: "SPOTLIGHT", timestamp: Date.now()}
            socket.send(JSON.stringify(message))
            eye1 = paper.project.getItem({name:'eye1'})
            eye1.visible = !eye1.visible
         }

         if (e.dataType == "pad" && e.track == 1){
            eye2 = paper.project.getItem({name:'eye2'})
            eye2.visible = !eye2.visible
         }

         if (e.dataType == "pad" && e.track == 2){
            nose = paper.project.getItem({name:'nose'})
            nose.visible = !nose.visible
         }

         if (e.dataType == "pad" && e.track == 3){
            mouth = paper.project.getItem({name:'mouth'})
            mouth.visible = !mouth.visible
         }

         if (e.dataType == "pad" && e.track == 4){
            neck = paper.project.getItem({name:'neck'})
            neck.visible = !neck.visible
         }


         if (e.dataType == "pad" && e.track == 5){
            chest = paper.project.getItem({name:'chest'})
            chest.visible = !chest.visible
         }

    })
   })

function draw(){
    var head = new paper.Path.Circle({
        name: 'head',
        center: new paper.Point(935, 330),
        radius: 30
        // fillColor: 'orange',
        // visible: false
    });

    var eye1 = new paper.Path.Circle({
        name: 'eye1',
        center: new paper.Point(935, 435),
        radius: 30,
        // visible: false,
        fillColor: 'white'
    });

    // var eye2 = new paper.Path.Circle({
    //     name: 'eye2',
    //     center: new paper.Point(990, 435),
    //     radius: 25,
    //     // visible: false,
    //     fillColor: 'white'
    // });

    var nose = new paper.Path.Circle({
        name: 'nose',
        center: new paper.Point(968, 460),
        radius: 27,
        // visible: false,
        fillColor: 'white'
    });

    var mouth = new paper.Path.Circle({
        name: 'mouth',
        center: new paper.Point(963, 507),
        radius: 25,
        // visible: false,
        fillColor: 'white'
    });

    // NECK SVG
    var neckData = 'M5 75L16.5 7.5L30 17L83 50L111 56V102L72 95L5 75Z';
    var neck = new paper.Path(neckData);

    neck.name = 'neck';
    neck.strokeColor = 'white';
    neck.fillColor = 'white';
    neck.strokeWidth = 8;
    neck.position = [900, 555];
    // neck.visible = false;
    // NECK SVG ENDS

    // CHEST SVG
    var chestData = 'M79 203L4 200.5V142L11.5 74.5L28 49L66 28L96.5 5L220 28L280 58.5L307 196L79 203Z';
    var chest = new paper.Path(chestData);

    chest.name = 'chest';
    chest.strokeColor = 'white';
    chest.fillColor = 'white';
    chest.strokeWidth = 8;
    chest.position = [900, 680];
    // chest.visible = false;
    // CHEST SVG ENDS


    // EYE2 SVG
    var eye2Data = 'M0.5 23.5C0.500546 -1.90735e-06 26.4998 0 26.4998 0V54C26.4998 54 0.499454 47 0.5 23.5Z';
    var eye2 = new paper.Path(eye2Data);

    eye2.name = 'eye2';
    eye2.strokeColor = 'white';
    eye2.fillColor = 'white';
    eye2.strokeWidth = 0;
    eye2.position = [985, 435];
    // eye2.visible = false;
    // EYE2 SVG ENDS

    

    // DRAG TO MOVE ALL SPOTLIGHTS 


    var group = new paper.Group([head, eye1, eye2, nose, mouth, neck, chest]);
    group.name = "spotlight-cues"



    group.onMouseDrag = function(event) {
        group.translate(event.delta)
    }
}