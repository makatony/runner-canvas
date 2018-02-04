class Runner {

  constructor(id, x, y) {
    this.id = id;
    this.pos = createVector(x, y);
    this.heading = 0;

    this.wallDistance = [99, 99, 99, 99]; // to be used as input for neural network
    this.sightDist = 20; //assumes everything above this.sightDist pixels is a wall

    //random movement for now
    this.xoff = random(0,100);
    this.yoff = random(0,100);
  }

  update() {
    //random movement for now
    this.xoff = this.xoff + 0.01;
    this.pos.x = this.pos.x + noise(this.xoff) - 0.5;
    this.yoff = this.yoff + 0.01;
    this.pos.y = this.pos.y + noise(this.yoff) - 0.5;

    this.calcWallDistance();

    if (this.wallDistance[0] == 0) {
      Runner.remove(this);
      console.log('Runner ' + this.id + ' hit the wall');
    }
  }

  draw() {
    //draw the sightdistance
    stroke(255, 0, 0);
    strokeWeight(2);
    let thisHeading = this.heading;
    for (let h = 0; h < 4; h++) {
      thisHeading = this.heading + h / 2 * Math.PI;
      let vector = radian2cartesian(this.pos, thisHeading, this.wallDistance[h]);
      line(this.pos.x, this.pos.y, vector.x, vector.y);
    }

    // draw the runner
    fill(0);
    noStroke();
    ellipse(this.pos.x, this.pos.y, 10);
  }

  calcWallDistance() {
    let pixelCol = [];
    let thisHeading, vector, pxlIndex;

    for (let h = 0; h < 4; h++) {
      thisHeading = this.heading + h / 2 * Math.PI;
      // for each heading direction, check up to this.sightDistance pixels
      for (let d = 0; d < this.sightDist; d++) { //calculating distance to wall based on 4 sights
        this.wallDistance[h] = d;
        vector = radian2cartesian(this.pos, thisHeading, d);
        //ignore cases at the edge of the screen
        if (vector.x < 0 || vector.x > width || vector.y < 0 || vector.y > height) break;
        //get the pixel color to compare
        pxlIndex = (Math.floor(vector.x) + width * Math.floor(vector.y)) * pixelDensity() * 4;
        pixelCol = color([pixels[pxlIndex + 0], pixels[pxlIndex + 1], pixels[pxlIndex + 2]]);
        //stop adding to walldistance as soon as a wall is seen
        if (pixelCol.toString() == BGCOLOR.toString()) break;
      }
    }
  }


  static update() {
    for (let i = 0; i < runners.length; i++) {
      runners[i].update();
    }
  }
  static draw() {
    for (let i = 0; i < runners.length; i++) {
      runners[i].draw();
    }
  }
  static remove(obj) {
    for (let i = runners.length - 1; i >= 0; i--) {
      if (runners[i].id == obj.id) {
        runners.splice(i, 1);
        break;
      }
    }
  }
}
