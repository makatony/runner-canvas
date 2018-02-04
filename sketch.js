let paths = [];
currPath = 0;
paths[currPath] = [];
runners = [];
runnersCount = 0;


function setup() {
  createCanvas(640, 480);
  BGCOLOR = color(120);
  PATHCOLOR = color(255);
  fr = createP('framerate');
  createP('Instructions for visualization: Drag mouse to create a white path. Doubleclick to create a runner at mouse position. Red lines are the runner\'s sight. If runner is close to a wall, the red line goes only until a wall. I call this the "wall distance".\n<br>This is just a canvas for a runner application. The movement of the runner should eventually be based on a neural network rather than random-ish');

  mouseListeners.push({
    type: 'mouseDragged',
    fn: function () {
      if (this.isDoubleClick) {}
      let thisPath = paths[currPath];
      if (thisPath.length > 1 && dist(mouseX, mouseY, thisPath[thisPath.length - 1].x, thisPath[thisPath.length - 1].y) < 10)
        return;
      thisPath.push(createVector(mouseX, mouseY));
    }
  });

  mouseListeners.push({
    type: 'mouseReleased',
    fn: function () {
      if (this.isDoubleClick) {}
      currPath++;
      paths[currPath] = [];
    }
  });

  mouseListeners.push({
    type: 'mousePressed',
    fn: function () {
      if (this.isDoubleClick) {
        runners.push(new Runner(runnersCount, mouseX, mouseY));
        runnersCount++;
      }
    }
  });
}

function draw() {
  background(BGCOLOR);

  for (let p = 0; p < paths.length; p++) {
    let thisPath = paths[p];
    for (let i = 1; i < thisPath.length; i++) {
      stroke(PATHCOLOR);
      strokeWeight(20);
      line(thisPath[i].x, thisPath[i].y, thisPath[i - 1].x, thisPath[i - 1].y);
    }
  }

  //getting pixels once in a while after drawing the path
  if (Math.floor(frameRate()) % 30 == 0) loadPixels();

  Runner.update();
  Runner.draw();


  fr.html(frameRate());
  // for (let p = 0; p < paths.length; p++) {
  //   let thisPath = paths[p];
  //   for (let i = 1; i < thisPath.length; i++) {
  //     fill(0);
  //     noStroke();
  //     ellipse(thisPath[i].x, thisPath[i].y, 5);
  //   }
  // }


}





// ############################
// #### UTIL: MOUSE EVENTS ####
// ############################

let doubleClickMS = 0;
let isDoubleClick = false;
let isMouseDrag = false;
let mouseListeners = [];

var mousePressed = function () {
  this.isDoubleClick = (floor(millis() - doubleClickMS) <= 500 ? true : false); //for some reason this.isDoubleClick is passed to the functions without problems
  doubleClickMS = millis(); //resets doubleclick timer

  mouseEventCallHandlers('mousePressed', arguments);
  this.isMouseDrag = false;
};
var mouseClicked = function () {
  mouseEventCallHandlers('mouseClicked', arguments);
  this.isMouseDrag = false;
};
var mouseReleased = function () {
  mouseEventCallHandlers('mouseReleased', arguments);
  this.isMouseDrag = false;
};
var mouseDragged = function () { // mouseDragged is a P5 function. we use it to call anything that was registered as a mouseDragged event
  this.isMouseDrag = true;
  mouseEventCallHandlers('mouseDragged', arguments);
};
let mouseEventCallHandlers = function (type, arguments) {
  mouseListeners.forEach(function (elt) {
    if (elt.type == type) elt.fn.apply(this, arguments);
  });
};


function cartesian2radian(v1, v2) {
  var deltaX = v2.x - v1.x;
  var deltaY = v2.y - v1.y;
  var rad = Math.atan2(deltaY, deltaX);
  // var deg = rad * (180 / Math.PI);
  return rad;
}

function radian2cartesian(point, angle, length) {
  let x2 = point.x + Math.cos(angle) * length;
  let y2 = point.y + Math.sin(angle) * length;
  return createVector(x2, y2);
}
