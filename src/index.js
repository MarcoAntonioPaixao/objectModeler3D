const beginnerCanvas = document.getElementById('beginnerCanvas');
beginnerCanvas.width = 2* (window.innerWidth / 5);
beginnerCanvas.height = 2*(window.innerHeight / 5);
const context = beginnerCanvas.getContext('2d');
context.strokeStyle = 'black';
context.lineWidth = 1;
localStorage.clear();

const cleanCanvasButton = document.getElementById('cleanCanvas');
const generateObjectButton = document.getElementById('generateObject');
const rotationAngle = document.getElementById('rotationAngle');
const numberSections = document.getElementById('numberSections');
const rotationAxis = document.getElementById('rotationAxis');

let pointArray = [];

init();

class point {
  constructor(x, y) {
    this.coordX = x;
    this.coordY = y;
  }
}

beginnerCanvas.addEventListener('click', function() {
  getCoord(event);
})

cleanCanvasButton.addEventListener('click', function() {
  context.clearRect(0, 0, beginnerCanvas.width, beginnerCanvas.height);
  init();
  pointArray = [];
})

generateObjectButton.addEventListener('click', function() {
  //validatePoints();

  localStorage.setItem('numVertices', pointArray.length.toString());

  for(let i = 0; i < pointArray.length; i++){
    localStorage.setItem(i.toString(), pointArray[i].coordX.toString());
    localStorage.setItem(i.toString() + i.toString(), pointArray[i].coordY.toString());
  }

  localStorage.setItem('axis', rotationAxis.value);
  localStorage.setItem('angle', rotationAngle.value);
  localStorage.setItem('sections', numberSections.value);
  localStorage.setItem('largura', beginnerCanvas.width);
  localStorage.setItem('altura', beginnerCanvas.height);

});

function init() {
  context.beginPath();
  context.moveTo(beginnerCanvas.width/2, 0);
  context.lineTo(beginnerCanvas.width/2, beginnerCanvas.height);
  context.moveTo(0, beginnerCanvas.height/2);
  context.lineTo(beginnerCanvas.width, beginnerCanvas.height/2);
  context.stroke();
}


function getCoord(event) {
  let clickedPoint = new point();
  clickedPoint.coordX = event.offsetX;// - beginnerCanvas.width/2;
  clickedPoint.coordY = event.offsetY;// - beginnerCanvas.height/2) * (-1);
  console.log("x coords: " + clickedPoint.coordX + ", y coords: " + clickedPoint.coordY);
  storePoint(clickedPoint);
}

function storePoint(point) {
  pointArray.push(point);
  if(pointArray.length === 2){
    console.log('reached this point');
    context.beginPath();
    drawLine(pointArray);
  }else if(pointArray.length > 2) {
    drawLine(pointArray);
  }
}

function drawLine(pointArray) {
  const index = pointArray.length - 1;
  context.moveTo(pointArray[index-1].coordX, pointArray[index-1].coordY);
  context.lineTo(pointArray[index].coordX, pointArray[index].coordY);
  context.stroke();
}

// function validatePoints() {
//   let xAxisFlag = false;
//   let yAxisFlag = false;
//   lastPoint = new point(0, 0);

//   for(let i = 0; i < pointArray; i++) {
//     if(xAxisFlag)
//       correctPointsToX();
//     if(yAxisFlag)
//       correctPointsToY();

//     if((lastPoint.coordX <= beginnerCanvas.width/2 && pointArray[i].coordX > beginnerCanvas.width/2) 
//     || (lastPoint.coordX >= beginnerCanvas.width/2 && pointArray[i].coordX < beginnerCanvas.width/2))
//       xAxisFlag = true;

//     if((lastPoint.coordY <= beginnerCanvas.height/2 && pointArray[i].coordY > beginnerCanvas.height/2) || 
//     (lastPoint.coordY >= beginnerCanvas.height/2 && pointArray[i].coordY < beginnerCanvas.height/2))
//       yAxisFlag = true;
//   }
// }

// function correctPointsToX() {
//   let positive = true;
//   let count = 0;
//   while(true){
//     if(pointArray[count].coordY > beginnerCanvas.height/2) {
//       positive = true;
//       break;
//     }

//     if(pointArray[count].coordY < beginnerCanvas.height/2) {
//       positive = false;
//       break;
//     }
//     count++;
//   }

//   if(positive){
//     for(let i = 0; i < pointArray; i++) {
//       if(pointArray[i].coordY < beginnerCanvas.height/2)
//         pointArray[i].coordY = beginnerCanvas.height/2;
//     }
//   }else{
//     for(let i = 0; i < pointArray; i++) {
//       if(pointArray[i].coordY > beginnerCanvas.height/2)
//         pointArray[i].coordY = beginnerCanvas.height/2;
//     }
//   }
  
// }

// function correctPointsToY() {
//   let positive = true;
//   let count = 0;
//   while(true){
//     if(pointArray[count].coordX > beginnerCanvas.width/2) {
//       positive = true;
//       break;
//       console.log('corrected point ' + count);
//     }

//     if(pointArray[count].coordX < beginnerCanvas.width/2) {
//       positive = false;
//       break;
//       console.log('corrected point ' + count);
//     }
//     count++;
//   }

//   debugger;

//   if(positive){
//     for(let i = 0; i < pointArray; i++) {
//       if(pointArray[i].coordX < beginnerCanvas.width/2)
//         pointArray[i].coordX = beginnerCanvas.width/2;
//     }
//   }else{
//     for(let i = 0; i < pointArray; i++) {
//       if(pointArray[i].coordX > beginnerCanvas.width/2)
//         pointArray[i].coordX = beginnerCanvas.width/2;
//     }
//   }
// }