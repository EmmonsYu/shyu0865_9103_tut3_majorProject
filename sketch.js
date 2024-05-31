// Define the Mondrian class
class Mondrian {
  constructor() {
    this.aspect = 0;
    this.width = 600;
    this.height = 600;
    this.xOffset = 0;
    this.yOffset = 0;
  }

  // Method to calculate Mondrian properties based on canvas size
  calculateMondrian(canvasWidth, canvasHeight) {
    this.aspect = 1; // Square aspect ratio

    if (canvasWidth < canvasHeight) {
      this.width = canvasWidth;
      this.height = canvasWidth / this.aspect;
      this.yOffset = (canvasHeight - this.height) / 2;
      this.xOffset = 0;
    } else if (canvasWidth > canvasHeight) {
      this.width = canvasHeight * this.aspect;
      this.height = canvasHeight;
      this.xOffset = (canvasWidth - this.width) / 2;
      this.yOffset = 0;
    } else {
      this.width = canvasWidth;
      this.height = canvasHeight;
      this.xOffset = 0;
      this.yOffset = 0;
    }
  }
}

// Create an instance of the Mondrian class
let mondrian;

//This is a preliminary sketch for the group task, made by Yusong Xie
//Set properties for the Mondrian painting
let rectSize = 50;

//Make two arrays to store the horizontal and vertical lines
let horizontalLines = [];
let verticalLines = [];

let easingTime = 40; // Duration of the easing effect
let startFrame; // Frame number when easing starts
let targetFrameRate; // Target frame rate when easing ends
let initialFrameRate = 10; // Initial frame rate

let horizontalYellowLines = 10; // Initial number of horizontal yellow lines
let verticalYellowLines = 10; // Initial number of vertical yellow lines

function setup() {
  createCanvas(windowWidth, windowHeight);
  mondrian = new Mondrian(); // Initialize the Mondrian object
  mondrian.calculateMondrian(windowWidth, windowHeight); // Calculate Mondrian properties
  frameRate(initialFrameRate); // Set the initial frame rate
  startFrame = frameCount; // Record the frame number when easing starts
  targetFrameRate = initialFrameRate; // Set the initial target frame rate
}

function draw() {
  background(255, 250, 240); // Clear background
  mondrian.calculateMondrian(windowWidth, windowHeight); // Recalculate Mondrian properties
  drawGrid();
  drawLine();
  drawRectangle();

  // If the frame count reaches the easing time
  if (frameCount - startFrame >= easingTime) {
    // Reset the frame number when easing starts
    startFrame = frameCount;
    // Set a new target frame rate
    targetFrameRate = floor(random(1, 80)); // Random frame rate
  }

  // Calculate the easing progress
  let t = (frameCount - startFrame) / easingTime;
  // Calculate the current frame rate
  let currentFrameRate = initialFrameRate + (targetFrameRate - initialFrameRate) * t;
  frameRate(currentFrameRate); // Set the current frame rate

  // The map() function is used to map a value from one range to another and return the mapped value
  // I use the map() function to map mouseY to the number of yellow lines, dynamically adjusting the number of horizontal and vertical yellow lines based on the mouse's position along the y-axis
  // The floor() function is used to round a number down to the nearest integer
  // Control the number of horizontal yellow lines based on the value of mouseY
  horizontalYellowLines = floor(map(mouseY, 0, height, 4, 10));
  // Control the number of vertical yellow lines based on the value of mouseY
  verticalYellowLines = floor(map(mouseY, 0, height, 4, 10));
}

function drawGrid(){
  //rectangle layout
  //This divides the whole canvas into grids, so that the specific grid
  //can be filled with color.
  for (let y = 0; y < mondrian.height; y += rectSize){
    for (let x = 0; x < mondrian.width; x += rectSize){
      fill(255, 250, 240);
      noStroke(); //remove the outline of the grids
      square(x + mondrian.xOffset, y + mondrian.yOffset, rectSize);
    }
  }
}

function drawRectangle() {
  let rectangles = []; // Array to store generated rectangles
  let minRectangles = 10; // Minimum number of rectangles
  let maxRectangles = 15; // Maximum number of rectangles

  // Generate rectangles between adjacent horizontal lines, ensuring no overlap
  for (let i = 0; i < horizontalLines.length - 1 && rectangles.length < maxRectangles; i++) {
    // Determine boundaries for the rectangle
    let yMin = horizontalLines[i].y + horizontalLines[i].h;
    let yMax = horizontalLines[i + 1].y;
    let h = yMax - yMin;

    // Attempt to place the rectangle without overlap, with a maximum number of attempts
    let attempts = 0;
    let validPosition = false;
    let x, y, w;
    while (!validPosition && attempts < 1000) { 
      x = floor(random(mondrian.width / rectSize)) * rectSize;
      w = rectSize; // Keep rectangle width constant

      // Adjust rectangle position to align with horizontal lines
      y = yMin; // Set top edge of rectangle to bottom edge of horizontal line
      if (y + h > yMax) {
        y -= (y + h - yMax); // Adjust position if exceeding top boundary
      }

      validPosition = true;

      // Check for overlap with existing rectangles
      for (let rect of rectangles) {
        if (!(x + w < rect.x || x > rect.x + rect.w || y + h < rect.y || y > rect.y + rect.h)) {
          validPosition = false;
          break;
        }
      }
      attempts++;
    }

    // Draw the rectangle if a valid position is found
    if (validPosition && h > 0) {
      // Draw the rectangle with a random color
      let randomColor = random([color(238,216,34), color(173,57,42), color(67,103,187), color(200)]);
      fill(randomColor);
      noStroke();
      strokeWeight(1);
      rect(x + mondrian.xOffset, y + mondrian.yOffset, w, h);
      rectangles.push({x: x, y: y, w: w, h: h}); // Add the rectangle to the array
      if((w>rectSize||h>rectSize)&&h>w){
        let smallRectW = w;
        let smallRectH = floor(random(h/4,h/2));
        let smallX = x;
        let smallY = y + floor(random(0, h - smallRectH));
        let smallColor = random([color(238, 216, 34), color(173, 57, 42), color(67, 103, 187), color(200)]);
        fill(smallColor);
        noStroke();
        rect(smallX + mondrian.xOffset, smallY + mondrian.yOffset, smallRectW, smallRectH);
        //To generate a smaller rectangle in the middle of a larger rectangle
        if(smallRectH>rectSize&&smallRectW>rectSize){
          let centerRectW = smallRectW / 2;
          let centerRectH = smallRectH / 2;
          let centerX = smallX + (smallRectW - centerRectW) / 2;
          let centerY = smallY + (smallRectH - centerRectH) / 2;
          let centerColor = random([color(238, 216, 34),color(200)]);
          fill(centerColor);
          noStroke();
          rect(centerX + mondrian.xOffset, centerY + mondrian.yOffset, centerRectW, centerRectH);
        }
      }
      if((w>rectSize||h>rectSize)&&h<w){
        let smallRectW = floor(random(w/4,w/2));
        let smallRectH = h;
        let smallX = x + floor(random(0, w - smallRectW));
        let smallY = y;
        let smallColor = random([color(238, 216, 34), color(173, 57, 42), color(67, 103, 187), color(200)]);
        fill(smallColor);
        noStroke();
        rect(smallX + mondrian.xOffset, smallY + mondrian.yOffset, smallRectW, smallRectH);
        //To generate a smaller rectangle in the middle of a larger rectangle
        if(smallRectH>rectSize&&smallRectW>rectSize){
          let centerRectW = smallRectW / 2;
          let centerRectH = smallRectH / 2;
          let centerX = smallX + (smallRectW - centerRectW) / 2;
          let centerY = smallY + (smallRectH - centerRectH) / 2;
          let centerColor = random([color(238, 216, 34),color(200)]);
          fill(centerColor);
          noStroke();
          rect(centerX + mondrian.xOffset, centerY + mondrian.yOffset, centerRectW, centerRectH);
        }
      }
    }
  }

  // Generate rectangles between adjacent vertical lines, ensuring no overlap
  for (let i = 0; i < verticalLines.length - 1 && rectangles.length < maxRectangles; i++) {
    // Determine boundaries for the rectangle
    let xMin = verticalLines[i].x + verticalLines[i].w;
    let xMax = verticalLines[i + 1].x;
    let w = xMax - xMin;

    // Attempt to place the rectangle without overlap, with a maximum number of attempts
    let attempts = 0;
    let validPosition = false;
    let x, y, h;
    while (!validPosition && attempts < 1000) { // Increase maximum attempts
      y = floor(random(mondrian.height / rectSize)) * rectSize;
      h = rectSize; // Keep rectangle height constant

      // Adjust rectangle position to align with vertical lines
      x = xMin; // Set left edge of rectangle to right edge of vertical line
      if (x + w > xMax) {
        x -= (x + w - xMax); // Adjust position if exceeding left boundary
      }

      validPosition = true;

      // Check for overlap with existing rectangles
      for (let rect of rectangles) {
        if (!(x + w < rect.x || x > rect.x + rect.w || y + h < rect.y || y > rect.y + rect.h)) {
          validPosition = false;
          break;
        }
      }
      attempts++;
    }

    // Draw the rectangle if a valid position is found
    if (validPosition && w > 0) {
      // Draw the rectangle with a random color
      let randomColor = random([color(238,216,34), color(173,57,42), color(67,103,187), color(200)]);
      fill(randomColor);
      noStroke();
      strokeWeight(1);
      rect(x + mondrian.xOffset, y + mondrian.yOffset, w, h);
      rectangles.push({x: x, y: y, w: w, h: h}); // Add the rectangle to the array
      if((w>rectSize||h>rectSize)&&h>w){
        let smallRectW = w;
        let smallRectH = floor(random(h/4,h/2));
        let smallX = x;
        let smallY = y + floor(random(0, h - smallRectH));
        let smallColor = random([color(238, 216, 34), color(173, 57, 42), color(67, 103, 187), color(200)]);
        fill(smallColor);
        noStroke();
        rect(smallX + mondrian.xOffset, smallY + mondrian.yOffset, smallRectW, smallRectH);
        //To generate a smaller rectangle in the middle of a larger rectangle
        if(smallRectH>=rectSize&&smallRectW>=rectSize){
          let centerRectW = smallRectW / 2;
          let centerRectH = smallRectH / 2;
          let centerX = smallX + (smallRectW - centerRectW) / 2;
          let centerY = smallY + (smallRectH - centerRectH) / 2;
          let centerColor = random([color(238, 216, 34),color(200)]);
          fill(centerColor);
          noStroke();
          rect(centerX + mondrian.xOffset, centerY + mondrian.yOffset, centerRectW, centerRectH);
        }
      }
      if((w>rectSize||h>rectSize)&&h<w){
        let smallRectW = floor(random(w/4,w/2));
        let smallRectH = h;
        let smallX = x + floor(random(0, w - smallRectW));
        let smallY = y;
        let smallColor = random([color(238, 216, 34), color(173, 57, 42), color(67, 103, 187), color(200)]);
        fill(smallColor);
        noStroke();
        rect(smallX + mondrian.xOffset, smallY + mondrian.yOffset, smallRectW, smallRectH);
        //To generate a smaller rectangle in the middle of a larger rectangle
        if(smallRectH>=rectSize&&smallRectW>=rectSize){
          let centerRectW = smallRectW / 2;
          let centerRectH = smallRectH / 2;
          let centerX = smallX + (smallRectW - centerRectW) / 2;
          let centerY = smallY + (smallRectH - centerRectH) / 2;
          let centerColor = random([color(238, 216, 34),color(200)]);
          fill(centerColor);
          noStroke();
          rect(centerX + mondrian.xOffset, centerY + mondrian.yOffset, centerRectW, centerRectH);
        }
      }
    }
  }

  // Generate additional rectangles if the minimum quantity is not met
  while (rectangles.length < minRectangles) {
    let yMin = floor(random(mondrian.height / rectSize)) * rectSize;
    let xMin = floor(random(mondrian.width / rectSize)) * rectSize;
    let w = rectSize;
    let h = rectSize;
    let validPosition = true;

    // Check for overlap with existing rectangles
    for (let rect of rectangles) {
      if (!(xMin + w < rect.x || xMin > rect.x + rect.w || yMin + h < rect.y || yMin > rect.y + rect.h)) {
        validPosition = false;
        break;
      }
    }

    // Draw the rectangle if a valid position is found
    if (validPosition) {
      // Draw the rectangle with a random color
      let randomColor = random([color(238,216,34), color(173,57,42), color(67,103,187), color(200)]);
      fill(randomColor);
      noStroke();
      strokeWeight(1);
      rect(xMin + mondrian.xOffset, yMin + mondrian.yOffset, w, h);
      rectangles.push({x: xMin, y: yMin, w: w, h: h}); // Add the rectangle to the array
    }
  }
}



function drawLine(){
  //Make two arrays to store the horizontal and vertical lines
  horizontalLines = [];
  verticalLines = [];
//The starting point coordinates of Y, this is the position of the first horizontal line, and the subsequent vertical lines are arranged based on this.
    let firstY=floor(random(0,2))*rectSize;
    let firstX=floor(random(0,2))*rectSize;
  // Draw Horizontal lines
  for (let i = 0; i < horizontalYellowLines; i++) {
    // Divide the canvas into equal parts based on horizontalYellowLines,
    // and randomly generate yellow lines within each section
    let regionHeight = (mondrian.height - firstY) / horizontalYellowLines;
    let y = firstY + i * regionHeight + floor(random(regionHeight / rectSize)) * rectSize;

    //Limit the maximum value
    if(y>mondrian.height){
      y=mondrian.height
    }
    let h = rectSize/2;

    fill(238,216,34);
    noStroke();
    rect(mondrian.xOffset, y + mondrian.yOffset, mondrian.width, h);

    //store the y and h values in the array, so the cross points can be 
    //drawn later
    horizontalLines.push({y: y, h: h, x: 0, w: mondrian.width});

    //Add random colored squares along the horizontal line to mimic 
    //Mondrian painting
    for (let i = 0; i < verticalYellowLines; i ++){
      if(random() > 0.5){ //Randomly decide to place a colored square
        let randomColor = random([color(238,216,34), //yellow
                                  color(173,57,42), //red
                                  color(67,103,187), //blue
                                  color(200, 200, 200)]); //grey
        fill(randomColor);
        noStroke();
        square(i * rectSize + mondrian.xOffset, y + mondrian.yOffset, rectSize/2);
      }
    }
  }

  //Draw Vertical lines
  for (let i = 0; i < verticalYellowLines; i ++){
    // Divide the canvas into equal parts based on verticalYellowLines,
    // and randomly generate yellow lines within each section
    let regionWidth = (mondrian.width - firstX) / verticalYellowLines;
    let x = firstX + i * regionWidth + floor(random(regionWidth / rectSize)) * rectSize;

    if (x<mondrian.width) { // Add boundary check

      let w =  rectSize/2;

      fill(238,216,34);
      noStroke();
      rect(x + mondrian.xOffset, mondrian.yOffset, w, mondrian.height);

      //store the x and w values in the array
      verticalLines.push({x: x, w: w, y: 0, h: mondrian.height});

      //Add random colored squares along the vertical line
      for (let i = rectSize; i < mondrian.height; i += rectSize){
        if(random() > 0.5){
          let randomColor = random([color(238,216,34), //yellow
                                    color(173,57,42), //red
                                    color(67,103,187), //blue
                                    color(200, 200, 200)]); //grey
          fill(randomColor);
          noStroke();
          square(x + mondrian.xOffset, i + mondrian.yOffset, rectSize/2);
        }
      }
    }
  }

  //Draw cross points with new color, the cross points are the 
  //intersection of the horizontal and vertical lines
  for (let horizontal of horizontalLines){ 
    for (let vertical of verticalLines){
      //
      if(vertical.x < mondrian.width && horizontal.y < mondrian.height){ 
        let randomColor = random([color(173,57,42),   //red
                                  color(67,103,187),    //blue
                                  color(200, 200, 200)]);  //grey
        fill(randomColor);
        square(vertical.x + mondrian.xOffset, 
               horizontal.y + mondrian.yOffset, rectSize/2);
      }
    }
  }
}


function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
  // Recalculate Mondrian properties when window is resized
  mondrian.calculateMondrian()(windowWidth, windowHeight);
}