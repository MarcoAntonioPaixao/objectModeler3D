//selecting elements
const objectDetails = document.getElementById('objectDetails');
const drawButton = document.getElementById('draw');
const selectButton = document.getElementById('select');
const rotateHorizontalButton = document.getElementById('rotateHorizontal');
const rotateVerticalButton = document.getElementById('rotateVertical');
const scaleButton = document.getElementById('scale');

const saveSceneButton = document.getElementById('saveScene');
const loadSceneButton = document.getElementById('loadScene');
const newSceneButton = document.getElementById('newScene');
const fileElem = document.getElementById('fileElem');
const generateObjectButton = document.getElementById('generateObject');

const noOcultationButton = document.getElementById('noOcultation');
const withOcultationButton = document.getElementById('withOcultation');
const flatShadingButton = document.getElementById('flatShading');

const rotationAngleField = document.getElementById('revolutionRotationAngle');
const rotationAxisField = document.getElementById('revolutionRotationAxis');
const numberSectionsField = document.getElementById('numberSections');

const TOLERANCE_MARGIN = 100;


//initialize all canvas
function addMarkings(context, canvas) {
  context.lineWidth = .1;
  context.beginPath();
  context.moveTo(canvas.width/2, 0);
  context.lineTo(canvas.width/2, canvas.height);
  context.moveTo(0, canvas.height/2);
  context.lineTo(canvas.width, canvas.height/2);
  context.stroke();
  context.lineWidth = 1;
}


let drawingOnFrontCanvas = false;
const frontCanvas = document.getElementById('frontCanvas');
const frontContext = frontCanvas.getContext('2d');

const altura = frontCanvas.height;
const largura = frontCanvas.width;

function initFrontCanvas() {
  frontCanvas.width = 2 * (window.innerWidth / 5);
  frontCanvas.height = 2 * (window.innerHeight / 5);
  frontContext.strokeStyle = 'black';
  addMarkings(frontContext, frontCanvas);
  frontContext.lineWidth = 1;
}

loadSceneButton.addEventListener('click', function(e) {
  if (fileElem) {
    fileElem.click();
  }

}, false);

function handleFiles(files) {
  
  let file = files[0];
  let fileReader = new FileReader();
  fileReader.readAsText(file);

  fileReader.onload = function(event) {
    console.log('this is the read string from the json file: ' + event.target.result);
    let fakeScene = JSON.parse(fileReader.result);

    Scene = {
      objects: []
    };

    for(let i = 0; i < fakeScene.objects.length; i++){
      object3d.verticesList = fakeScene.objects[i].verticesList;
    
      object3d.initialFace = fakeScene.objects[i].initialFace;
      
      object3d.lastFace = fakeScene.objects[i].lastFace;
    
      defineArestas(object3d);
      
      defineFaces(object3d);
      
      Scene.objects.push(new wingedEdge(object3d.verticesList, object3d.arestasList, 
        object3d.facesList, object3d.initialFace, object3d.lastFace));
    }
    cleanAllCanvas();
    initFrontCanvas();
    initSideCanvas();
    initAboveCanvas();
    drawFrontVista();
    drawSideVista();
    drawAboveVista();
  }
}

saveSceneButton.addEventListener('click', function(e) {
  let sceneJSON = JSON.stringify(Scene);
  let fileName = prompt("Please enter the filename.");
  setTimeout(function(){
    saveText(sceneJSON, fileName+".json");
  }, 1000);
  
});

newSceneButton.addEventListener('click', function() {
  Scene.objects = [];
  originalObjects.objects = [];
  cleanAllCanvas();
  initAboveCanvas();
  initFrontCanvas();
  initSideCanvas();
  objectDetails.classList.add('hide');
  drawingOnAboveCanvas = false;
  drawingOnFrontCanvas = false;
  drawingOnSideCanvas = false;
  initial3dVertice = [];
  pointArray = [];
});

function saveText(text, filename){
  var a = document.createElement('a');
  a.setAttribute('href', 'data:text/plain;charset=utf-u,'+encodeURIComponent(text));
  a.setAttribute('download', filename);
  setTimeout(function(){
    a.click();
  }, 1000);
  
}

noOcultationButton.addEventListener('click', function() {
  noOcultation = true;
  noOcultationButton.classList.add('selected');
  noOcultationButton.classList.remove('shadow');

  withOcultation = false;
  withOcultationButton.classList.remove('selected');
  withOcultationButton.classList.add('shadow');
  flatShading = false;
  flatShadingButton.classList.remove('selected');
  flatShadingButton.classList.add('shadow');
  cleanAllCanvas();
  drawAboveVista();
  drawFrontVista();
  drawSideVista();
});

withOcultationButton.addEventListener('click', function() {
  withOcultation = true;
  withOcultationButton.classList.add('selected');
  withOcultationButton.classList.remove('shadow');

  noOcultation = false;
  noOcultationButton.classList.remove('selected');
  noOcultationButton.classList.add('shadow');
  flatShading = false;
  flatShadingButton.classList.remove('selected');
  flatShadingButton.classList.add('shadow');
  cleanAllCanvas();
  drawAboveVista();
  drawFrontVista();
  drawSideVista();
});

flatShadingButton.addEventListener('click', function(){
  flatShading = true;
  flatShadingButton.classList.add('selected');
  flatShadingButton.classList.remove('shadow');

  noOcultation = false;
  noOcultationButton.classList.remove('selected');
  noOcultationButton.classList.add('shadow');
  withOcultation = false;
  withOcultationButton.classList.remove('selected');
  withOcultationButton.classList.add('shadow');
  cleanAllCanvas();
  drawAboveVista();
  drawFrontVista();
  drawSideVista();
});

drawButton.addEventListener('click', function() {
  modeDraw = true;
  modeSelect = false;
  modeScale = false;
  modeRotationVertical = false;
  modeRotationHorizontal = false;

  drawButton.classList.add('selected')
  selectButton.classList.remove('selected');
  scaleButton.classList.remove('selected');
  rotateHorizontalButton.classList.remove('selected');
  rotateVerticalButton.classList.remove('selected');

  drawButton.classList.remove('shadow');
  selectButton.classList.add('shadow');
  scaleButton.classList.add('shadow');
  rotateHorizontalButton.classList.add('shadow');
  rotateVerticalButton.classList.add('shadow');
});

selectButton.addEventListener('click', function() {
  modeDraw = false;
  modeSelect = true;
  modeScale = false;
  modeRotationVertical = false;
  modeRotationHorizontal = false;

  drawButton.classList.remove('selected');
  selectButton.classList.add('selected');
  scaleButton.classList.remove('selected');
  rotateHorizontalButton.classList.remove('selected');
  rotateVerticalButton.classList.remove('selected');

  drawButton.classList.add('shadow');
  selectButton.classList.remove('shadow');
  scaleButton.classList.add('shadow');
  rotateHorizontalButton.classList.add('shadow');
  rotateVerticalButton.classList.add('shadow');
});

scaleButton.addEventListener('click', function() {
  modeDraw = false;
  modeSelect = false;
  modeScale = true;
  modeRotationVertical = false;
  modeRotationHorizontal = false;

  drawButton.classList.remove('selected');
  selectButton.classList.remove('selected');
  scaleButton.classList.add('selected');
  rotateHorizontalButton.classList.remove('selected');
  rotateVerticalButton.classList.remove('selected');

  drawButton.classList.add('shadow');
  selectButton.classList.add('shadow');
  scaleButton.classList.remove('shadow');
  rotateHorizontalButton.classList.add('shadow');
  rotateVerticalButton.classList.add('shadow');
});

rotateHorizontalButton.addEventListener('click', function() {
  modeDraw = false;
  modeSelect = false;
  modeScale = false;
  modeRotationVertical = false;
  modeRotationHorizontal = true;

  drawButton.classList.remove('selected');
  selectButton.classList.remove('selected');
  scaleButton.classList.remove('selected');
  rotateHorizontalButton.classList.add('selected');
  rotateVerticalButton.classList.remove('selected');

  drawButton.classList.add('shadow');
  selectButton.classList.add('shadow');
  scaleButton.classList.add('shadow');
  rotateHorizontalButton.classList.remove('shadow');
  rotateVerticalButton.classList.add('shadow');
});

rotateVerticalButton.addEventListener('click', function() {
  modeDraw = false;
  modeSelect = false;
  modeScale = false;
  modeRotationVertical = true;
  modeRotationHorizontal = false;

  drawButton.classList.remove('selected');
  selectButton.classList.remove('selected');
  scaleButton.classList.remove('selected');
  rotateHorizontalButton.classList.remove('selected');
  rotateVerticalButton.classList.add('selected');

  drawButton.classList.add('shadow');
  selectButton.classList.add('shadow');
  scaleButton.classList.add('shadow');
  rotateHorizontalButton.classList.add('shadow');
  rotateVerticalButton.classList.remove('shadow');
});

frontCanvas.addEventListener('mouseout', function() {
  if(drawingOnFrontCanvas) {
    objectDetails.classList.remove('hide');
  }
});

let lastX;
let lastY;
frontCanvas.addEventListener('mousedown', function(event) {
  event.preventDefault();
  event.stopPropagation();
  let clickedPoint = getCoord(event, frontContext);
  console.log('clicked point X: ' + clickedPoint.coordX);
  console.log('clicked point Y: ' + clickedPoint.coordY);
  lastX = convertFromCanvasX(clickedPoint.coordX);
  lastY = convertFromCanvasY(clickedPoint.coordY);

  if(modeSelect || modeScale || modeRotationHorizontal || modeRotationVertical){
    selectedObject = 10000; 
    selectedObject = lookForClosestPoint(clickedPoint, frontContext);
    console.log('after returning selected object is: ' + selectedObject);
    if(selectedObject < 10000) {
      console.log('setting isDown to true!');
      isDown = true;
    }
  } else if(modeDraw) {
    drawingOnFrontCanvas = true;
    drawingOnSideCanvas = false;
    drawingOnAboveCanvas = false;
    storePoint(getCoord(event, frontContext), frontContext);
  }
});

frontCanvas.addEventListener('mousemove', function(event) {
  event.preventDefault();
  event.stopPropagation();
  if(!isDown) {
    return;
  }
  let auxiliaryPoint = getCoord(event, frontContext);
  let currentX = convertFromCanvasX(auxiliaryPoint.coordX);
  let currentY = convertFromCanvasY(auxiliaryPoint.coordY);
  //get difference between current position and last position
  let differenceX = currentX - lastX;
  let differenceY = currentY - lastY;
  
  if(modeSelect) {
    executeTranslation(differenceX, differenceY, 0, selectedObject);
  } else if(modeScale) {
    let distanceBetweenPoints = Math.sqrt( Math.pow(differenceX, 2) + Math.pow(differenceY, 2) );

    if(distanceBetweenPoints === 0) {
      executeScale(1, 1, 1, selectedObject);
      Scene.objects[selectedObject].centerPoint = defineCenterPoint(Scene.objects[selectedObject]);
    }else{
      //first execute translation putting the object's center in the center(0, 0, 0)
      executeTranslation(0 - Scene.objects[selectedObject].centerPoint.coordX,
        0 - Scene.objects[selectedObject].centerPoint.coordY,
        0 - Scene.objects[selectedObject].centerPoint.coordZ , selectedObject);

      if(isIncreasingScale(lastX, lastY, currentX, currentY)) {
        executeScale(1 + getRatioX(distanceBetweenPoints), 1 + getRatioY(distanceBetweenPoints), 
        1 + getRatioZ(distanceBetweenPoints), selectedObject);
      } else {
        executeScale(1 - getRatioX(distanceBetweenPoints), 1 - getRatioY(distanceBetweenPoints), 
        1 - getRatioZ(distanceBetweenPoints), selectedObject);
      }

      //return to object's center to original position
      executeTranslation(0 + Scene.objects[selectedObject].centerPoint.coordX,
        0 + Scene.objects[selectedObject].centerPoint.coordY,
        0 + Scene.objects[selectedObject].centerPoint.coordZ , selectedObject);

      }
    
  } else if(modeRotationHorizontal || modeRotationVertical) {
    let angleInRad = Math.atan2(differenceY, differenceX);
    
      if(modeRotationHorizontal){
        if(lastX < currentX){
          executeTranslation(0 - Scene.objects[selectedObject].centerPoint.coordX,
            0 - Scene.objects[selectedObject].centerPoint.coordY,
            0 - Scene.objects[selectedObject].centerPoint.coordZ , selectedObject);
  
          angleInRad = Math.atan2(differenceX, differenceY);
          executeRotationY(angleInRad * (-1), selectedObject);
  
          executeTranslation(0 + Scene.objects[selectedObject].centerPoint.coordX,
            0 + Scene.objects[selectedObject].centerPoint.coordY,
            0 + Scene.objects[selectedObject].centerPoint.coordZ , selectedObject);
  
        }else if(lastX >= currentX){
          angleInRad = Math.atan2(differenceX, differenceY);
          executeTranslation(0 - Scene.objects[selectedObject].centerPoint.coordX,
            0 - Scene.objects[selectedObject].centerPoint.coordY,
            0 - Scene.objects[selectedObject].centerPoint.coordZ , selectedObject);
  
          executeRotationY(angleInRad * (-1), selectedObject);
  
          executeTranslation(0 + Scene.objects[selectedObject].centerPoint.coordX,
            0 + Scene.objects[selectedObject].centerPoint.coordY,
            0 + Scene.objects[selectedObject].centerPoint.coordZ , selectedObject);
        }
      }else {
        if(lastY < currentY){
          //angleInRad = Math.atan2(differenceX, differenceY);
          executeTranslation(0 - Scene.objects[selectedObject].centerPoint.coordX,
            0 - Scene.objects[selectedObject].centerPoint.coordY,
            0 - Scene.objects[selectedObject].centerPoint.coordZ , selectedObject);
  
          executeRotationX(angleInRad * (-1), selectedObject); //
  
          executeTranslation(0 + Scene.objects[selectedObject].centerPoint.coordX,
            0 + Scene.objects[selectedObject].centerPoint.coordY,
            0 + Scene.objects[selectedObject].centerPoint.coordZ , selectedObject);
  
        }else if(lastY >= currentY) {
          angleInRad = Math.atan2(differenceX, differenceY);
  
          executeTranslation(0 - Scene.objects[selectedObject].centerPoint.coordX,
            0 - Scene.objects[selectedObject].centerPoint.coordY,
            0 - Scene.objects[selectedObject].centerPoint.coordZ , selectedObject);
  
          executeRotationX(angleInRad, selectedObject); //* (-1)
  
          executeTranslation(0 + Scene.objects[selectedObject].centerPoint.coordX,
            0 + Scene.objects[selectedObject].centerPoint.coordY,
            0 + Scene.objects[selectedObject].centerPoint.coordZ , selectedObject);
        }
      }
      
        
    Scene.objects[selectedObject].centerPoint = defineCenterPoint(Scene.objects[selectedObject]);
  }

  lastX = currentX;
  lastY = currentY;

  console.log("I'm drawing!!!");

  //redraw everything
  cleanAllCanvas();
  drawFrontVista();
  drawSideVista();
  drawAboveVista();
});

frontCanvas.addEventListener('mouseup', function(event) {
  event.preventDefault();
  event.stopPropagation();
  isDown = false;
});

let drawingOnSideCanvas = false;
const sideCanvas = document.getElementById('sideCanvas');
const sideContext = sideCanvas.getContext('2d');
function initSideCanvas() {
  sideCanvas.width = 2 * (window.innerWidth / 5);
  sideCanvas.height = 2 * (window.innerHeight / 5);
  sideContext.strokeStyle = 'black';
  addMarkings(sideContext, sideCanvas);
  sideContext.lineWidth = 1;
}

sideCanvas.addEventListener('mousedown', function(event) {
  event.preventDefault();
  event.stopPropagation();
  let clickedPoint = getCoord(event, sideContext);
  console.log('clicked point X: ' + clickedPoint.coordX);//this is z actually
  console.log('clicked point Y: ' + clickedPoint.coordY);
  lastX = convertFromCanvasX(clickedPoint.coordX);
  lastY = convertFromCanvasY(clickedPoint.coordY);

  if(modeSelect || modeScale || modeRotationHorizontal || modeRotationVertical){
    selectedObject = 10000; 
    selectedObject = lookForClosestPoint(clickedPoint, sideContext);
    if(selectedObject < 10000)
      isDown = true;
  } else if(modeDraw){
    drawingOnFrontCanvas = false;
    drawingOnSideCanvas = true;
    drawingOnAboveCanvas = false;
    storePoint(getCoord(event, sideContext), sideContext);
  }
});

sideCanvas.addEventListener('mousemove', function(event) {
  event.preventDefault();
  event.stopPropagation();
  if(!isDown) {
    return;
  }
  let auxiliaryPoint = getCoord(event, sideContext);
  let currentX = convertFromCanvasX(auxiliaryPoint.coordX);//this is actually z
  let currentY = convertFromCanvasY(auxiliaryPoint.coordY);
  //get difference between current position and last position
  let differenceX = currentX - lastX;
  let differenceY = currentY - lastY;
  
  if(modeSelect) {
    executeTranslation(0, differenceY, differenceX, selectedObject);
  } else if(modeScale) {
    let distanceBetweenPoints = Math.sqrt( Math.pow(differenceX, 2) + Math.pow(differenceY, 2) );

    if(distanceBetweenPoints === 0) {
      executeScale(1, 1, 1, selectedObject);
      Scene.objects[selectedObject].centerPoint = defineCenterPoint(Scene.objects[selectedObject]);
    }else{
      //first execute translation putting the object's center in the center(0, 0, 0)
      executeTranslation(0 - Scene.objects[selectedObject].centerPoint.coordX,
        0 - Scene.objects[selectedObject].centerPoint.coordY,
        0 - Scene.objects[selectedObject].centerPoint.coordZ , selectedObject);

      if(isIncreasingScale(lastX, lastY, currentX, currentY)) {
        executeScale(1 + getRatioX(distanceBetweenPoints), 1 + getRatioY(distanceBetweenPoints), 
        1 + getRatioZ(distanceBetweenPoints), selectedObject);
      } else {
        executeScale(1 - getRatioX(distanceBetweenPoints), 1 - getRatioY(distanceBetweenPoints), 
        1 - getRatioZ(distanceBetweenPoints), selectedObject);
      }

      //return to object's center to original position
      executeTranslation(0 + Scene.objects[selectedObject].centerPoint.coordX,
        0 + Scene.objects[selectedObject].centerPoint.coordY,
        0 + Scene.objects[selectedObject].centerPoint.coordZ , selectedObject);

      }
    
  } else if(modeRotationHorizontal || modeRotationVertical) {
    let angleInRad = Math.atan2(differenceY, differenceX);
    // if(lastX >= 0) {
    //   if(lastY < currentY)
    //     executeRotationZ(angleInRad, selectedObject);
    //   else
    //     executeRotationZ(angleInRad, selectedObject); 
    // } else {
    //   if(lastY < currentY)
    //     executeRotationZ(angleInRad * (-1), selectedObject);
    //   else
    //     executeRotationZ(angleInRad * (-1), selectedObject);
    // }
      if(modeRotationHorizontal){
        if(lastX < currentX){
          executeTranslation(0 - Scene.objects[selectedObject].centerPoint.coordX,
            0 - Scene.objects[selectedObject].centerPoint.coordY,
            0 - Scene.objects[selectedObject].centerPoint.coordZ , selectedObject);
  
          angleInRad = Math.atan2(differenceX, differenceY);
          executeRotationY(angleInRad * (-1), selectedObject);
  
          executeTranslation(0 + Scene.objects[selectedObject].centerPoint.coordX,
            0 + Scene.objects[selectedObject].centerPoint.coordY,
            0 + Scene.objects[selectedObject].centerPoint.coordZ , selectedObject);
  
        }else if(lastX >= currentX){
          angleInRad = Math.atan2(differenceX, differenceY);
          executeTranslation(0 - Scene.objects[selectedObject].centerPoint.coordX,
            0 - Scene.objects[selectedObject].centerPoint.coordY,
            0 - Scene.objects[selectedObject].centerPoint.coordZ , selectedObject);
  
          executeRotationY(angleInRad * (-1), selectedObject);
  
          executeTranslation(0 + Scene.objects[selectedObject].centerPoint.coordX,
            0 + Scene.objects[selectedObject].centerPoint.coordY,
            0 + Scene.objects[selectedObject].centerPoint.coordZ , selectedObject);
        }
      }else {
        if(lastY < currentY){
          //angleInRad = Math.atan2(differenceX, differenceY);
          executeTranslation(0 - Scene.objects[selectedObject].centerPoint.coordX,
            0 - Scene.objects[selectedObject].centerPoint.coordY,
            0 - Scene.objects[selectedObject].centerPoint.coordZ , selectedObject);
  
          executeRotationZ(angleInRad * (-1), selectedObject); //
  
          executeTranslation(0 + Scene.objects[selectedObject].centerPoint.coordX,
            0 + Scene.objects[selectedObject].centerPoint.coordY,
            0 + Scene.objects[selectedObject].centerPoint.coordZ , selectedObject);
  
        }else if(lastY >= currentY) {
          angleInRad = Math.atan2(differenceX, differenceY);
  
          executeTranslation(0 - Scene.objects[selectedObject].centerPoint.coordX,
            0 - Scene.objects[selectedObject].centerPoint.coordY,
            0 - Scene.objects[selectedObject].centerPoint.coordZ , selectedObject);
  
          executeRotationZ(angleInRad, selectedObject); //* (-1)
  
          executeTranslation(0 + Scene.objects[selectedObject].centerPoint.coordX,
            0 + Scene.objects[selectedObject].centerPoint.coordY,
            0 + Scene.objects[selectedObject].centerPoint.coordZ , selectedObject);
        }
      }
    Scene.objects[selectedObject].centerPoint = defineCenterPoint(Scene.objects[selectedObject]);
  }

  lastX = currentX;
  lastY = currentY;

  //redraw everything
  cleanAllCanvas();
  drawFrontVista();
  drawSideVista();
  drawAboveVista();
});

sideCanvas.addEventListener('mouseup', function(event) {
  event.preventDefault();
  event.stopPropagation();
  isDown = false;
});

sideCanvas.addEventListener('mouseout', function() {
  if(drawingOnSideCanvas) {
    objectDetails.classList.remove('hide');
  }
});


let drawingOnAboveCanvas = false;
const aboveCanvas = document.getElementById('aboveCanvas');
const aboveContext = aboveCanvas.getContext('2d');
function initAboveCanvas() {
  aboveCanvas.width = 2 * (window.innerWidth / 5);
  aboveCanvas.height = 2 * (window.innerHeight / 5);
  aboveContext.strokeStyle = 'black';
  addMarkings(aboveContext, aboveCanvas);
  aboveContext.lineWidth = 1;
}

aboveCanvas.addEventListener('mousedown', function(event) {
  event.preventDefault();
  event.stopPropagation();
  let clickedPoint = getCoord(event, aboveContext);
  console.log('clicked point X: ' + clickedPoint.coordX);
  console.log('clicked point Y: ' + clickedPoint.coordY);//this is z actually
  lastX = convertFromCanvasX(clickedPoint.coordX);
  lastY = convertFromCanvasY(clickedPoint.coordY);
  
  if(modeSelect || modeScale || modeRotationHorizontal || modeRotationVertical){
    selectedObject = 10000; 
    selectedObject = lookForClosestPoint(clickedPoint, aboveContext);
    if(selectedObject < 10000) {
      isDown = true;
    }
  } else if(modeDraw) {
    drawingOnFrontCanvas = false;
    drawingOnSideCanvas = false;
    drawingOnAboveCanvas = true;
    storePoint(getCoord(event, aboveContext), aboveContext);
  }
});

aboveCanvas.addEventListener('mousemove', function(event) {
  event.preventDefault();
  event.stopPropagation();
  if(!isDown) {
    return;
  }
  let auxiliaryPoint = getCoord(event, aboveContext);
  let currentX = convertFromCanvasX(auxiliaryPoint.coordX);
  let currentY = convertFromCanvasY(auxiliaryPoint.coordY);//this is actually z
  //get difference between current position and last position
  let differenceX = currentX - lastX;
  let differenceY = currentY - lastY;
  
  if(modeSelect) {
    executeTranslation(differenceX, 0, differenceY, selectedObject);
  } else if(modeScale) {
    let distanceBetweenPoints = Math.sqrt( Math.pow(differenceX, 2) + Math.pow(differenceY, 2) );

    if(distanceBetweenPoints === 0) {
      executeScale(1, 1, 1, selectedObject);
      Scene.objects[selectedObject].centerPoint = defineCenterPoint(Scene.objects[selectedObject]);
    }else{
      //first execute translation putting the object's center in the center(0, 0, 0)
      executeTranslation(0 - Scene.objects[selectedObject].centerPoint.coordX,
        0 - Scene.objects[selectedObject].centerPoint.coordY,
        0 - Scene.objects[selectedObject].centerPoint.coordZ , selectedObject);

      if(isIncreasingScale(lastX, lastY, currentX, currentY)) {
        executeScale(1 + getRatioX(distanceBetweenPoints), 1 + getRatioY(distanceBetweenPoints), 
        1 + getRatioZ(distanceBetweenPoints), selectedObject);
      } else {
        executeScale(1 - getRatioX(distanceBetweenPoints), 1 - getRatioY(distanceBetweenPoints), 
        1 - getRatioZ(distanceBetweenPoints), selectedObject);
      }

      //return to object's center to original position
      executeTranslation(0 + Scene.objects[selectedObject].centerPoint.coordX,
        0 + Scene.objects[selectedObject].centerPoint.coordY,
        0 + Scene.objects[selectedObject].centerPoint.coordZ , selectedObject);

      }
    
  } else if(modeRotationHorizontal || modeRotationVertical) {
    let angleInRad = Math.atan2(differenceY, differenceX);
    
      if(modeRotationHorizontal){
        if(lastX < currentX){
          executeTranslation(0 - Scene.objects[selectedObject].centerPoint.coordX,
            0 - Scene.objects[selectedObject].centerPoint.coordY,
            0 - Scene.objects[selectedObject].centerPoint.coordZ , selectedObject);
  
          angleInRad = Math.atan2(differenceX, differenceY);
          executeRotationZ(angleInRad * (-1), selectedObject);
  
          executeTranslation(0 + Scene.objects[selectedObject].centerPoint.coordX,
            0 + Scene.objects[selectedObject].centerPoint.coordY,
            0 + Scene.objects[selectedObject].centerPoint.coordZ , selectedObject);
  
        }else if(lastX >= currentX){
          angleInRad = Math.atan2(differenceX, differenceY);
          executeTranslation(0 - Scene.objects[selectedObject].centerPoint.coordX,
            0 - Scene.objects[selectedObject].centerPoint.coordY,
            0 - Scene.objects[selectedObject].centerPoint.coordZ , selectedObject);
  
          executeRotationZ(angleInRad * (-1), selectedObject);
  
          executeTranslation(0 + Scene.objects[selectedObject].centerPoint.coordX,
            0 + Scene.objects[selectedObject].centerPoint.coordY,
            0 + Scene.objects[selectedObject].centerPoint.coordZ , selectedObject);
        }
      }else {
        if(lastY < currentY){
          //angleInRad = Math.atan2(differenceX, differenceY);
          executeTranslation(0 - Scene.objects[selectedObject].centerPoint.coordX,
            0 - Scene.objects[selectedObject].centerPoint.coordY,
            0 - Scene.objects[selectedObject].centerPoint.coordZ , selectedObject);
  
          executeRotationX(angleInRad * (-1), selectedObject); //
  
          executeTranslation(0 + Scene.objects[selectedObject].centerPoint.coordX,
            0 + Scene.objects[selectedObject].centerPoint.coordY,
            0 + Scene.objects[selectedObject].centerPoint.coordZ , selectedObject);
  
        }else if(lastY >= currentY) {
          angleInRad = Math.atan2(differenceX, differenceY);
  
          executeTranslation(0 - Scene.objects[selectedObject].centerPoint.coordX,
            0 - Scene.objects[selectedObject].centerPoint.coordY,
            0 - Scene.objects[selectedObject].centerPoint.coordZ , selectedObject);
  
          executeRotationX(angleInRad, selectedObject); //
  
          executeTranslation(0 + Scene.objects[selectedObject].centerPoint.coordX,
            0 + Scene.objects[selectedObject].centerPoint.coordY,
            0 + Scene.objects[selectedObject].centerPoint.coordZ , selectedObject);
        }
      }
    Scene.objects[selectedObject].centerPoint = defineCenterPoint(Scene.objects[selectedObject]);
  }

  lastX = currentX;
  lastY = currentY;

  console("I'm now drawing the object!!!");

  //redraw everything
  cleanAllCanvas();
  drawFrontVista();
  drawSideVista();
  drawAboveVista();
});

aboveCanvas.addEventListener('mouseup', function(event) {
  event.preventDefault();
  event.stopPropagation();
  isDown = false;
});

aboveCanvas.addEventListener('mouseout', function() {
  if(drawingOnAboveCanvas) {
    objectDetails.classList.remove('hide');
  }
});

const profileCanvas = document.getElementById('profileCanvas');
const profileContext = profileCanvas.getContext('webgl');
function initProfileCanvas() {
  profileCanvas.width = 2 * (window.innerWidth / 5);
  profileCanvas.height = 2 * (window.innerHeight / 5);
  profileContext.viewport(0, 0, 2 * (window.innerWidth / 5), 2 * (window.innerHeight / 5));
  profileContext.strokeStyle = 'black';
  profileContext.lineWidth = 1;
}

generateObjectButton.addEventListener('click', function() {
  rotationAxis = rotationAxisField.value;
  numberSections = numberSectionsField.value;
  rotationAngle = rotationAngleField.value;
  //add data gathering from html and how to pass the data to the set object data function
  //converts coordinates of points and stores them on the vertices array
  setObjectData();
  //turns the 2d vertices to 3d by adding the last coordinate with the value of 0 
  //depends on which coordinates where entered xy, xz, yz 
  convertVerticesTo3d();
  //execute the rotation
  transformObjectTo3d();
  drawFrontVista();
  drawSideVista();
  drawAboveVista();
  //saving original objects coordinates for saving
  originalObjects.objects.push(new wingedEdge(object3d.verticesList, object3d.arestasList, 
    object3d.facesList, object3d.initialFace, object3d.lastFace));
  objectDetails.classList.add('hide');
  drawingOnAboveCanvas = false;
  drawingOnFrontCanvas = false;
  drawingOnSideCanvas = false;
  initial3dVertices = [];
  pointArray = [];
  object3d.verticesList = [];
  object3d.arestasList = [];
})


let vertices = [];
class point {
  constructor(x, y) {
    this.coordX = x;
    this.coordY = y;
  }
}

class point3d {
  constructor(x, y, z) {
    this.coordX = x;
    this.coordY = y;
    this.coordZ = z;
  }
}

class point2d {
  constructor(x, y) {
    this.coordX = x;
    this.coordY = y;
  }
}

class aresta {
  constructor(point1, point2) {
    this.point1 = point1;
    this.point2 = point2;
  }
}

class face {
  constructor(aresta1, aresta2, aresta3, aresta4) {
    this.aresta1 = aresta1;
    this.aresta2 = aresta2;
    this.aresta3 = aresta3;
    this.aresta4 = aresta4;
    this.visible = false;
  }
}

class wingedEdge {
  constructor(verticesList, arestasList, facesList, initialFace, lastFace) {
    this.verticesList = verticesList;
    this.arestasList = arestasList;
    this.facesList = facesList;
    this.initialFace = initialFace;
    this.lastFace = lastFace;
    this.zMenor = 10000;
    this.zMaior = -10000; 
    this.yMenor = 10000;
    this.yMaior = -10000;
    this.xMenor = 10000;
    this.xMaior = -10000;
    this.centerPoint = defineCenterPoint(this);
  }

}

function isIncreasingScale(lastX, lastY, currentX, currentY) {
  return (  Math.sqrt( Math.pow( ( Scene.objects[selectedObject].centerPoint.coordX - currentX), 2 ) + 
  Math.pow( (Scene.objects[selectedObject].centerPoint.coordY - currentY), 2) ) ) > 
  ( Math.sqrt( Math.pow( (Scene.objects[selectedObject].centerPoint.coordX - lastX), 2) + 
  Math.pow((Scene.objects[selectedObject].centerPoint.coordY - lastY), 2) ) );
}

function defineCenterPoint(object) {
  for(let i = 0; i < object.verticesList.length; i++) {
    for(let j = 0; j < object.verticesList[i].length; j++) {

      if(object.verticesList[i][j].coordX > object.xMaior) {
        object.xMaior = object.verticesList[i][j].coordX;
      } else if(object.verticesList[i][j].coordX < object.xMenor) {
        object.xMenor = object.verticesList[i][j].coordX;
      }

      if(object.verticesList[i][j].coordY > object.yMaior) {
        object.yMaior = object.verticesList[i][j].coordY;
      } else if(object.verticesList[i][j].coordY < object.yMenor) {
        object.yMenor = object.verticesList[i][j].coordY;
      }

      if(object.verticesList[i][j].coordZ > object.zMaior) {
        object.zMaior = object.verticesList[i][j].coordZ;
      } else if(object.verticesList[i][j].coordZ < object.zMenor) {
        object.zMenor = object.verticesList[i][j].coordZ;
      }
    }
  }

    return new point3d((object.xMaior + object.xMenor)/2,
    (object.yMaior + object.yMenor)/2,
    (object.zMaior + object.zMenor)/2);
}

function getRatioX(distanceBetweenPoints) {
  return ((distanceBetweenPoints * 100) / 
  (Scene.objects[selectedObject].xMaior - Scene.objects[selectedObject].xMenor))/100;
}

function getRatioY(distanceBetweenPoints) {
  return ((distanceBetweenPoints * 100) / 
  (Scene.objects[selectedObject].yMaior - Scene.objects[selectedObject].yMenor))/100;
}

function getRatioZ(distanceBetweenPoints) {
  return ((distanceBetweenPoints * 100) / 
  (Scene.objects[selectedObject].zMaior - Scene.objects[selectedObject].zMenor))/100;
}

function getCoord(event, context) {
  let clickedPoint = new point2d();
  clickedPoint.coordX = event.offsetX;// - beginnerCanvas.width/2;
  clickedPoint.coordY = event.offsetY;// - beginnerCanvas.height/2) * (-1);
  //console.log("x coords: " + clickedPoint.coordX + ", y coords: " + clickedPoint.coordY);
  //storePoint(clickedPoint, context);
  return clickedPoint;
}

function storePoint(point, context) {
  pointArray.push(point);
  if(pointArray.length === 2){
    console.log('reached store this point');
    context.beginPath();
    drawLine(pointArray, context);
  }else if(pointArray.length > 2) {
    drawLine(pointArray, context);
  }
}

function lookForClosestPoint(clickedPoint, context) {
  let closestObjectIndex = 10000;
  //console.log('selected object original: ' + closestObjectIndex);
  let closestObjectDistance = 10000;
  for (let i = 0; i < Scene.objects.length; i++) {
    for (let j = 0; j < Scene.objects[i].verticesList.length; j++) {
        for (let k = 0; k < Scene.objects[i].verticesList[j].length; k++) {
          console.log('Distance is: ' + getDistance(clickedPoint, Scene.objects[i].verticesList[j][k], context));
          console.log('current selected object is: ' + closestObjectIndex);
        if(getDistance(clickedPoint, Scene.objects[i].verticesList[j][k], context) < closestObjectDistance &&
        getDistance(clickedPoint, Scene.objects[i].verticesList[j][k], context) < TOLERANCE_MARGIN) {
          closestObjectIndex = i;
          console.log('selected object change: ' + closestObjectIndex);
          closestObjectDistance = getDistance(clickedPoint, Scene.objects[i].verticesList[j][k], context);
          console.log('New closest Distance: ' + closestObjectDistance);
        }
      }
    }
  }
  console.log('RETURNING: ' + closestObjectIndex);
  return closestObjectIndex;
}

function getDistance(clickedPoint, vertice, context) {

  if(context === frontContext) {
    return Math.sqrt( Math.pow((convertFromCanvasX(clickedPoint.coordX) - vertice.coordX), 2) + 
    Math.pow((convertFromCanvasY(clickedPoint.coordY) - vertice.coordY), 2) + 
    Math.pow((0 - 0), 2));
  }

  if(context === sideContext) {
    return Math.sqrt( Math.pow((0 - 0), 2) + 
    Math.pow((convertFromCanvasY(clickedPoint.coordY) - vertice.coordY), 2) + 
    Math.pow((convertFromCanvasX(clickedPoint.coordX) - vertice.coordZ), 2));
  }

  if(context === aboveContext) {
    return Math.sqrt( Math.pow((convertFromCanvasX(clickedPoint.coordX) - vertice.coordX), 2) + 
    Math.pow((0 - 0), 2) + 
    Math.pow((convertFromCanvasY(clickedPoint.coordY) - vertice.coordZ), 2));
  }
}

function drawLine(pointArray, context) {
  const index = pointArray.length - 1;
  context.moveTo(pointArray[index-1].coordX, pointArray[index-1].coordY);
  context.lineTo(pointArray[index].coordX, pointArray[index].coordY);
  context.stroke();
}

function setObjectData() {
  const numVertices = pointArray.length;
  //global array containing vertices with converted coordinates
  vertices = [];

  let x = 0;
  let y = 0;

  for (let i = 0; i < numVertices; i++) {
    //console.log("Before Conversion: x coords: " + pointArray[i].coordX + ", y coords: " + pointArray[i].coordY);
    x = convertFromCanvasX(pointArray[i].coordX);
    y = convertFromCanvasY(pointArray[i].coordY);
    //console.log("After Conversion: x coords: " + x + ", y coords: " + y);
    //console.log("Converted to Canvas x: " + convertXtoCanvas(x) + " y: " + convertYtoCanvas(y));
    let tempPoint = new point();
    tempPoint.coordX = x;
    tempPoint.coordY = y;
    vertices.push(tempPoint);
  }
}

function cleanAllCanvas() {
  frontContext.clearRect(0, 0, frontCanvas.width, frontCanvas.height);
  sideContext.clearRect(0, 0, sideCanvas.width, sideCanvas.height);
  aboveContext.clearRect(0, 0, aboveCanvas.width, aboveCanvas.height);
}

function convertVerticesTo3d() {
  if(drawingOnFrontCanvas){
    for (let i = 0; i < vertices.length; i++) {
      initial3dVertices.push(new point3d(vertices[i].coordX, vertices[i].coordY, 0));
    }
  } 
  else if (drawingOnAboveCanvas) {
    for (let i = 0; i < vertices.length; i++) {
      initial3dVertices.push(new point3d(vertices[i].coordX, 0, vertices[i].coordY));
    }
  } 
  else if (drawingOnSideCanvas) {
    for (let i = 0; i < vertices.length; i++) {
      initial3dVertices.push(new point3d(0, vertices[i].coordY, vertices[i].coordX));
    }
  }
  
}

function convertXtoCanvas(value) {
  return value + frontCanvas.width / 2;
}

function convertYtoCanvas(value) {
  return (value * -1) + frontCanvas.height / 2;
}

function convertFromCanvasX(value) {
  return (value - aboveCanvas.width / 2);
}

function convertFromCanvasY(value) {
  return ((value - aboveCanvas.height / 2) * (-1));
}

function degreeToRadian(degrees){
  return degrees * (Math.PI/180);
}

function transformObjectTo3d() {
  detectRotationAxis();
}

function detectRotationAxis() {
  if (rotationAxis === 'y')
    revolutionY();
  else if (rotationAxis === 'x')
    revolutionX();
  else
    revolutionZ();
}

function revolutionY() {
  //definig how many points to be calculated
  let pointsToBeCalculated = numberSections;
  if (rotationAngle === '360')
    pointsToBeCalculated--;

  //defining angle between each point
  let angleBetweenPoints = rotationAngle / numberSections;

  //calculate the new points
  calculatePointsRotationY(pointsToBeCalculated, angleBetweenPoints);
}

function calculatePointsRotationY(pointsToBeCalculated, angleBetweenPoints) {
  //for each point of the 2d profile calculate all points derived through revolution
  for (let i = 0; i < initial3dVertices.length; i++) {
    object3d.verticesList.push(derivePointsY(pointsToBeCalculated, angleBetweenPoints, initial3dVertices[i]));
  }

  //flags which define if there is "closing" faces on the object at the beginning and at the end
  if( initial3dVertices[0].coordX === 0 ) {
    object3d.initialFace = false;
  }
  
  if( initial3dVertices[initial3dVertices.length-1].coordX === 0 ) {
    object3d.lastFace = false;
  }


  defineArestas(object3d);
  
  defineFaces(object3d);
  
  //debugger;
  Scene.objects.push(new wingedEdge(object3d.verticesList, object3d.arestasList, 
    object3d.facesList, object3d.initialFace, object3d.lastFace));
}

function derivePointsY(pointsToBeCalculated, angleBetweenPoints, initial3dVertice) {
  let lastPoint = new point3d(initial3dVertice.coordX, initial3dVertice.coordY, initial3dVertice.coordZ);
  //rotacao no eixo y anti horaria
  let calculationMatrix = 
  [[Math.cos(degreeToRadian(angleBetweenPoints)), 0, Math.sin(degreeToRadian(angleBetweenPoints)), 0],
  [0, 1, 0, 0],
  [-Math.sin(degreeToRadian(angleBetweenPoints)), 0, Math.cos(degreeToRadian(angleBetweenPoints)), 0],
  [0, 0, 0, 1]];
  const calculationMatrixColumns = 4;
  let derivedVertices = [];

  derivedVertices.push(new point3d(initial3dVertice.coordX, initial3dVertice.coordY, initial3dVertice.coordZ));

  for (let k = 0; k < pointsToBeCalculated; k++) {
    //calculate each point based on last points coordinates
    let x = calculateX(calculationMatrix, lastPoint);
    let y = calculateY(calculationMatrix, lastPoint);
    let z = calculateZ(calculationMatrix, lastPoint);

    //construct new 3d point and push the point to the temporary array
    derivedVertices.push(new point3d(x, y, z));
    lastPoint.coordX = x;
    lastPoint.coordY = y;
    lastPoint.coordZ = z;
  }
  return derivedVertices;
}

function calculateX(calculationMatrix, lastPoint) {
  let x = 0;
  let extraCoordinate = 1;
  x += calculationMatrix[0][0] * lastPoint.coordX;
  x += calculationMatrix[0][1] * lastPoint.coordY;
  x += calculationMatrix[0][2] * lastPoint.coordZ;
  x += calculationMatrix[0][3] * extraCoordinate;
  return x;
}

function calculateY(calculationMatrix, lastPoint) {
  let y = 0;
  let extraCoordinate = 1;
  y += calculationMatrix[1][0] * lastPoint.coordX;
  y += calculationMatrix[1][1] * lastPoint.coordY;
  y += calculationMatrix[1][2] * lastPoint.coordZ;
  y += calculationMatrix[1][3] * extraCoordinate;
  return y;
}

function calculateZ(calculationMatrix, lastPoint) {
  let z = 0;
  let extraCoordinate = 1;
  z += calculationMatrix[2][0] * lastPoint.coordX;
  z += calculationMatrix[2][1] * lastPoint.coordY;
  z += calculationMatrix[2][2] * lastPoint.coordZ;
  z += calculationMatrix[2][3] * extraCoordinate;
  return z;
}

function defineArestas(object3d) {
  const rows = object3d.verticesList.length;
  const columns = object3d.verticesList[0].length;
  let count = 0;
  

  //define arestas horizontais
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      let tempAresta = new aresta(object3d.verticesList[i][j], object3d.verticesList[i][(j + 1) % columns]);
      object3d.arestasList.push(tempAresta);
      count++;
    }
  }
  console.log('number of horizontal arestas: ' + count);
  count = 0;

  //define arestas verticais
  for (let i = 0; i < rows - 1; i++) {
    for (let j = 0; j < columns; j++) {
      let tempAresta = new aresta(object3d.verticesList[i][j], object3d.verticesList[i + 1][j]);
      object3d.arestasList.push(tempAresta);
      count++;
    }
  }
  console.log('number of vertical arestas: ' + count);
}

function defineFaces(object3d) {
  const rows = object3d.verticesList.length;
  const columns = object3d.verticesList[0].length;
  const numHorizontalArestasPerOriginalVertice = parseInt(numberSections);
  console.log('number of horizontal arestas per vertice calculated: ' + numHorizontalArestasPerOriginalVertice);
  

  let totalNumberOfHorizontalArestas = (numHorizontalArestasPerOriginalVertice * initial3dVertices.length);
  console.log('number of total horizontal arestas calculated: ' + totalNumberOfHorizontalArestas);
  
  
  for(let i = 0; i < (totalNumberOfHorizontalArestas - numHorizontalArestasPerOriginalVertice); i++) {
    let aresta1 = object3d.arestasList[i];
    let aresta2 = object3d.arestasList[(totalNumberOfHorizontalArestas) + i];
    let aresta3 = object3d.arestasList[i + numHorizontalArestasPerOriginalVertice];
    let aresta4;
    //estabelecendo a aresta vertical esquerda da face
    if((i %  numHorizontalArestasPerOriginalVertice) === 0){
      aresta4 = object3d.arestasList[totalNumberOfHorizontalArestas + i + (numHorizontalArestasPerOriginalVertice -1) ];
    }else{
      aresta4 = object3d.arestasList[totalNumberOfHorizontalArestas + i -1];
    }
    object3d.facesList.push(new face(aresta1, aresta2, aresta3, aresta4));
  }
  
}

function revolutionX() {
  //definig how many points to be calculated
  let pointsToBeCalculated = numberSections;
  if (rotationAngle === '360')
    pointsToBeCalculated--;

  //defining angle between each point
  let angleBetweenPoints = rotationAngle / numberSections;

  //calculate the new points
  calculatePointsRotationX(pointsToBeCalculated, angleBetweenPoints);
}

function calculatePointsRotationX(pointsToBeCalculated, angleBetweenPoints) {
  //for each point of the 2d profile calculate all points derived through revolution
  for (let i = 0; i < initial3dVertices.length; i++) {
    object3d.verticesList.push(derivePointsX(pointsToBeCalculated, angleBetweenPoints, initial3dVertices[i]));
  }

  //flags which define if there is "closing" faces on the object at the beginning and at the end
  if( initial3dVertices[0].coordY === 0 ) {
    object3d.initialFace = false;
  }
  
  if( initial3dVertices[initial3dVertices.length-1].coordY === 0 ) {
    object3d.lastFace = false;
  }

  defineArestas(object3d);
  defineFaces(object3d);
  Scene.objects.push(new wingedEdge(object3d.verticesList, object3d.arestasList, 
    object3d.facesList, object3d.initialFace, object3d.lastFace));
}

function derivePointsX(pointsToBeCalculated, angleBetweenPoints, initial3dVertice) {
  let lastPoint = new point3d(initial3dVertice.coordX, initial3dVertice.coordY, initial3dVertice.coordZ);
  //rotacao no eixo x anti horaria
  let calculationMatrix = [
  [1, 0, 0, 0],
  [0, Math.cos(degreeToRadian(angleBetweenPoints)), -Math.sin(degreeToRadian(angleBetweenPoints)), 0],
  [0, Math.sin(degreeToRadian(angleBetweenPoints)), Math.cos(degreeToRadian(angleBetweenPoints)), 0],
  [0, 0, 0, 1]];
  const calculationMatrixColumns = 4;
  let derivedVertices = [];

  derivedVertices.push(new point3d(initial3dVertice.coordX, initial3dVertice.coordY, initial3dVertice.coordZ));

  for (let k = 0; k < pointsToBeCalculated; k++) {
    //calculate each point based on last points coordinates
    let x = calculateX(calculationMatrix, lastPoint);
    let y = calculateY(calculationMatrix, lastPoint);
    let z = calculateZ(calculationMatrix, lastPoint);

    //construct new 3d point and push the point to the temporary array
    derivedVertices.push(new point3d(x, y, z));
    lastPoint.coordX = x;
    lastPoint.coordY = y;
    lastPoint.coordZ = z;
  }
  return derivedVertices;
}

function revolutionZ() {
  //definig how many points to be calculated
  let pointsToBeCalculated = numberSections;
  if (rotationAngle === 360)
    pointsToBeCalculated--;

  //defining angle between each point
  let angleBetweenPoints = rotationAngle / numberSections;

  //calculate the new points
  calculatePointsRotationZ(pointsToBeCalculated, angleBetweenPoints);
}

function calculatePointsRotationZ(pointsToBeCalculated, angleBetweenPoints) {
  //for each point of the 2d profile calculate all points derived through revolution
  for (let i = 0; i < initial3dVertices.length; i++) {
    object3d.verticesList.push(derivePointsZ(pointsToBeCalculated, angleBetweenPoints, initial3dVertices[i]));
  }

  //flags which define if there is "closing" faces on the object at the beginning and at the end
  if( initial3dVertices[0].coordZ === 0 ) {
    object3d.initialFace = false;
  }
  
  if( initial3dVertices[initial3dVertices.length-1].coordZ === 0 ) {
    object3d.lastFace = false;
  }

  defineArestas(object3d);
  defineFaces(object3d);
  Scene.objects.push(new wingedEdge(object3d.verticesList, object3d.arestasList, 
    object3d.facesList, object3d.initialFace, object3d.lastFace));
}

function derivePointsZ(pointsToBeCalculated, angleBetweenPoints, initial3dVertice) {
  let lastPoint = new point3d(initial3dVertice.coordX, initial3dVertice.coordY, initial3dVertice.coordZ);
  //rotacao no eixo x anti horaria
  let calculationMatrix = [
  [Math.cos(degreeToRadian(angleBetweenPoints)), -Math.sin(degreeToRadian(angleBetweenPoints)), 0, 0],
  [Math.sin(degreeToRadian(angleBetweenPoints)), Math.cos(degreeToRadian(angleBetweenPoints)), 0, 0],
  [0, 0, 1, 0],
  [0, 0, 0, 1]];
  const calculationMatrixColumns = 4;
  let derivedVertices = [];

  derivedVertices.push(new point3d(initial3dVertice.coordX, initial3dVertice.coordY, initial3dVertice.coordZ));

  for (let k = 0; k < pointsToBeCalculated; k++) {
    //calculate each point based on last points coordinates
    let x = calculateX(calculationMatrix, lastPoint);
    let y = calculateY(calculationMatrix, lastPoint);
    let z = calculateZ(calculationMatrix, lastPoint);

    //construct new 3d point and push the point to the temporary array
    derivedVertices.push(new point3d(x, y, z));
    lastPoint.coordX = x;
    lastPoint.coordY = y;
    lastPoint.coordZ = z;
  }
  return derivedVertices;
}

function drawFrontVista() {
  frontContext.clearRect(0, 0, frontCanvas.width, frontCanvas.height);
  addMarkings(frontContext, frontCanvas);
  //desenhar as arestas
  if(noOcultation) {
    frontContext.beginPath();
    for (let i = 0; i < Scene.objects.length; i++) {
      for (let j = 0; j < Scene.objects[i].arestasList.length; j++) {
        frontContext.moveTo(convertXtoCanvas(Scene.objects[i].arestasList[j].point1.coordX),
        convertYtoCanvas(Scene.objects[i].arestasList[j].point1.coordY));
        frontContext.lineTo(convertXtoCanvas(Scene.objects[i].arestasList[j].point2.coordX),
        convertYtoCanvas(Scene.objects[i].arestasList[j].point2.coordY));
      }
    }
    frontContext.stroke();
  } else {
    //draw only the visible faces from the front
    drawFrontWithOcultation();
  }
  
}

function drawFrontWithOcultation(){
  //debugger;
  defineWhichFacesAreVisible(Camera.front, Camera.p);
  frontContext.beginPath();
  //Camera.side;
  for (let i = 0; i < Scene.objects.length; i++) {
    for (let j = 0; j < Scene.objects[i].facesList.length; j++) {
      if(Scene.objects[i].facesList[j].visible){
        //aresta1
        frontContext.moveTo(convertXtoCanvas(Scene.objects[i].facesList[j].aresta1.point1.coordX),
        convertYtoCanvas(Scene.objects[i].facesList[j].aresta1.point1.coordY));
        frontContext.lineTo(convertXtoCanvas(Scene.objects[i].facesList[j].aresta1.point2.coordX),
        convertYtoCanvas(Scene.objects[i].facesList[j].aresta1.point2.coordY));
        //aresta2
        frontContext.moveTo(convertXtoCanvas(Scene.objects[i].facesList[j].aresta2.point1.coordX),
        convertYtoCanvas(Scene.objects[i].facesList[j].aresta2.point1.coordY));
        frontContext.lineTo(convertXtoCanvas(Scene.objects[i].facesList[j].aresta2.point2.coordX),
        convertYtoCanvas(Scene.objects[i].facesList[j].aresta2.point2.coordY));
        //aresta3
        frontContext.moveTo(convertXtoCanvas(Scene.objects[i].facesList[j].aresta3.point1.coordX),
        convertYtoCanvas(Scene.objects[i].facesList[j].aresta3.point1.coordY));
        frontContext.lineTo(convertXtoCanvas(Scene.objects[i].facesList[j].aresta3.point2.coordX),
        convertYtoCanvas(Scene.objects[i].facesList[j].aresta3.point2.coordY));
        //aresta4
        frontContext.moveTo(convertXtoCanvas(Scene.objects[i].facesList[j].aresta4.point1.coordX),
        convertYtoCanvas(Scene.objects[i].facesList[j].aresta4.point1.coordY));
        frontContext.lineTo(convertXtoCanvas(Scene.objects[i].facesList[j].aresta4.point2.coordX),
        convertYtoCanvas(Scene.objects[i].facesList[j].aresta4.point2.coordY));
      }
    }
  }

  frontContext.stroke();
}

function drawSideVista() {
  sideContext.clearRect(0, 0, sideCanvas.width, sideCanvas.height);
  addMarkings(sideContext, sideCanvas);
  //desenhar as arestas
  if(noOcultation){
    sideContext.beginPath();
    for (let i = 0; i < Scene.objects.length; i++) {
      for (let j = 0; j < Scene.objects[i].arestasList.length; j++) {
        sideContext.moveTo(convertXtoCanvas(Scene.objects[i].arestasList[j].point1.coordZ),
        convertYtoCanvas(Scene.objects[i].arestasList[j].point1.coordY));
        sideContext.lineTo(convertXtoCanvas(Scene.objects[i].arestasList[j].point2.coordZ),
        convertYtoCanvas(Scene.objects[i].arestasList[j].point2.coordY));
      }
    }
    sideContext.stroke();
  } else {
    //draw only the visible faces from the side
    drawSideWithOcultation();
  }
  
}

function drawSideWithOcultation(){
  defineWhichFacesAreVisible(Camera.side, Camera.p);
  sideContext.beginPath();
  //Camera.side;
  for (let i = 0; i < Scene.objects.length; i++) {
    for (let j = 0; j < Scene.objects[i].facesList.length; j++) {
      if(Scene.objects[i].facesList[j].visible){
        //aresta1
        sideContext.moveTo(convertXtoCanvas(Scene.objects[i].facesList[j].aresta1.point1.coordZ),
        convertYtoCanvas(Scene.objects[i].facesList[j].aresta1.point1.coordY));
        sideContext.lineTo(convertXtoCanvas(Scene.objects[i].facesList[j].aresta1.point2.coordZ),
        convertYtoCanvas(Scene.objects[i].facesList[j].aresta1.point2.coordY));
        //aresta2
        sideContext.moveTo(convertXtoCanvas(Scene.objects[i].facesList[j].aresta2.point1.coordZ),
        convertYtoCanvas(Scene.objects[i].facesList[j].aresta2.point1.coordY));
        sideContext.lineTo(convertXtoCanvas(Scene.objects[i].facesList[j].aresta2.point2.coordZ),
        convertYtoCanvas(Scene.objects[i].facesList[j].aresta2.point2.coordY));
        //aresta3
        sideContext.moveTo(convertXtoCanvas(Scene.objects[i].facesList[j].aresta3.point1.coordZ),
        convertYtoCanvas(Scene.objects[i].facesList[j].aresta3.point1.coordY));
        sideContext.lineTo(convertXtoCanvas(Scene.objects[i].facesList[j].aresta3.point2.coordZ),
        convertYtoCanvas(Scene.objects[i].facesList[j].aresta3.point2.coordY));
        //aresta4
        sideContext.moveTo(convertXtoCanvas(Scene.objects[i].facesList[j].aresta4.point1.coordZ),
        convertYtoCanvas(Scene.objects[i].facesList[j].aresta4.point1.coordY));
        sideContext.lineTo(convertXtoCanvas(Scene.objects[i].facesList[j].aresta4.point2.coordZ),
        convertYtoCanvas(Scene.objects[i].facesList[j].aresta4.point2.coordY));
      }
    }
  }

  sideContext.stroke();
}

function defineWhichFacesAreVisible(cameraPosition, p) {
  
  let vetorNormalFace = [];
  let normaVetor; 
  let vetor1 = [];
  let vetor2 = [];
  let normal = [];
  //here p is always set in the same place because I only implemented side, front and above view, 
  //no perspective
  if(cameraPosition === Camera.front){
    p = [0, 0, cameraPosition.coordZ * -1];
  }else if(cameraPosition === Camera.side){
    p = [cameraPosition.coordX * -1, 0, 0];
  }else if(cameraPosition === Camera.above){
    p = [0, cameraPosition.coordY * -1, 0];
  }

  for(let i = 0; i < Scene.objects.length; i++) {
    for(let j = 0; j < Scene.objects[i].facesList.length; j++) {
      vetor1.push(Scene.objects[i].facesList[j].aresta1.point1.coordX - Scene.objects[i].facesList[j].aresta1.point2.coordX);
      vetor1.push(Scene.objects[i].facesList[j].aresta1.point1.coordY - Scene.objects[i].facesList[j].aresta1.point2.coordY);
      vetor1.push(Scene.objects[i].facesList[j].aresta1.point1.coordZ - Scene.objects[i].facesList[j].aresta1.point2.coordZ);

      vetor2.push(Scene.objects[i].facesList[j].aresta2.point2.coordX - Scene.objects[i].facesList[j].aresta2.point1.coordX);
      vetor2.push(Scene.objects[i].facesList[j].aresta2.point2.coordY - Scene.objects[i].facesList[j].aresta2.point1.coordY);
      vetor2.push(Scene.objects[i].facesList[j].aresta2.point2.coordZ - Scene.objects[i].facesList[j].aresta2.point1.coordZ);

      vetorNormalFace = calculateVetorNormal(vetor1, vetor2);

      normaVetor = Math.sqrt(Math.pow(vetorNormalFace[0], 2) + Math.pow(vetorNormalFace[1], 2), Math.pow(vetorNormalFace[2], 2));
      
      //vetor unitario normalizado
      vetorNormalFace[0] = vetorNormalFace[0] / normaVetor;
      vetorNormalFace[1] = vetorNormalFace[1] / normaVetor;
      vetorNormalFace[2] = vetorNormalFace[2] / normaVetor;

      normal[0] = cameraPosition.coordX - p[0];
      normal[1] = cameraPosition.coordY - p[1];
      normal[2] = cameraPosition.coordZ - p[2];
      
      normaVetor = Math.sqrt(Math.pow(normal[0], 2) + Math.pow(normal[1], 2) + Math.pow(normal[2], 2));

      //vetor unitario normalizado
      normal[0] = normal[0] / normaVetor;
      normal[1] = normal[1] / normaVetor;
      normal[2] = normal[2] / normaVetor;

      if(((normal[0] * vetorNormalFace[0]) + (normal[1] * vetorNormalFace[1]) + (normal[2] * vetorNormalFace[2])) > 0){
        Scene.objects[i].facesList[j].visible = true;
      }else{
        Scene.objects[i].facesList[j].visible = false;
      }

      vetor1 = [];
      vetor2 = [];
      vetorNormalFace = [];
    }
  }
}

function calculateVetorNormal(vetor1, vetor2) {
  let vetorResultado = [];

  vetorResultado.push( (vetor1[1] * vetor2[2]) - (vetor2[1] * vetor1[2]) );
  vetorResultado.push( (vetor1[2] * vetor2[0]) - (vetor2[2] * vetor1[0]) );
  vetorResultado.push( (vetor1[0] * vetor2[1]) - (vetor2[0] * vetor1[1]) );

  return vetorResultado;
}

function drawAboveVista() {
  aboveContext.clearRect(0, 0, aboveCanvas.width, aboveCanvas.height);
  addMarkings(aboveContext, aboveCanvas);
  //desenhar as arestas
  if(noOcultation) {
    aboveContext.beginPath();
    for (let i = 0; i < Scene.objects.length; i++) {
      for (let j = 0; j < Scene.objects[i].arestasList.length; j++) {
        aboveContext.moveTo(convertXtoCanvas(Scene.objects[i].arestasList[j].point1.coordX),
        convertYtoCanvas(Scene.objects[i].arestasList[j].point1.coordZ));
        aboveContext.lineTo(convertXtoCanvas(Scene.objects[i].arestasList[j].point2.coordX),
        convertYtoCanvas(Scene.objects[i].arestasList[j].point2.coordZ));
      }
    }
    aboveContext.stroke();
  } else {
    //draw only the visible faces from above
    drawAboveWithOcultation();
  }
  
}

function drawAboveWithOcultation(){
  defineWhichFacesAreVisible(Camera.above, Camera.p);
  aboveContext.beginPath();
  
  for (let i = 0; i < Scene.objects.length; i++) {
    for (let j = 0; j < Scene.objects[i].facesList.length; j++) {
      if(Scene.objects[i].facesList[j].visible){
        //aresta1
        aboveContext.moveTo(convertXtoCanvas(Scene.objects[i].facesList[j].aresta1.point1.coordX),
        convertYtoCanvas(Scene.objects[i].facesList[j].aresta1.point1.coordZ));
        aboveContext.lineTo(convertXtoCanvas(Scene.objects[i].facesList[j].aresta1.point2.coordX),
        convertYtoCanvas(Scene.objects[i].facesList[j].aresta1.point2.coordZ));
        //aresta2
        aboveContext.moveTo(convertXtoCanvas(Scene.objects[i].facesList[j].aresta2.point1.coordX),
        convertYtoCanvas(Scene.objects[i].facesList[j].aresta2.point1.coordZ));
        aboveContext.lineTo(convertXtoCanvas(Scene.objects[i].facesList[j].aresta2.point2.coordX),
        convertYtoCanvas(Scene.objects[i].facesList[j].aresta2.point2.coordZ));
        //aresta3
        aboveContext.moveTo(convertXtoCanvas(Scene.objects[i].facesList[j].aresta3.point1.coordX),
        convertYtoCanvas(Scene.objects[i].facesList[j].aresta3.point1.coordZ));
        aboveContext.lineTo(convertXtoCanvas(Scene.objects[i].facesList[j].aresta3.point2.coordX),
        convertYtoCanvas(Scene.objects[i].facesList[j].aresta3.point2.coordZ));
        //aresta4
        aboveContext.moveTo(convertXtoCanvas(Scene.objects[i].facesList[j].aresta4.point1.coordX),
        convertYtoCanvas(Scene.objects[i].facesList[j].aresta4.point1.coordZ));
        aboveContext.lineTo(convertXtoCanvas(Scene.objects[i].facesList[j].aresta4.point2.coordX),
        convertYtoCanvas(Scene.objects[i].facesList[j].aresta4.point2.coordZ));
      }
    }
  }

  aboveContext.stroke();
}

function executeTranslation(coordX, coordY, coordZ, objectIndex) {
  console.log('Inside translation!!!');
  console.log('coord x: ' + coordX);
  console.log('coord y: ' + coordY);
  console.log('coord z: ' + coordZ);
  console.log('objectIndex: ' + objectIndex);

  const calculationMatrix = [
    [1, 0, 0, coordX],
    [0, 1, 0, coordY],
    [0, 0, 1, coordZ],
    [0, 0, 0, 1]];

  
  console.log('selected object is: ' + Scene.objects[objectIndex]);

  let pointsToBeCalculated = Scene.objects[objectIndex].verticesList.length;
  for(let j = 0; j < pointsToBeCalculated; j++) {
    for(let k = 0; k < Scene.objects[objectIndex].verticesList[0].length; k++){
      //for each object calculate all points
      let x = calculateX(calculationMatrix, Scene.objects[objectIndex].verticesList[j][k]);
      let y = calculateY(calculationMatrix, Scene.objects[objectIndex].verticesList[j][k]);
      let z = calculateZ(calculationMatrix, Scene.objects[objectIndex].verticesList[j][k]);

      //modify point with new coordinates
      Scene.objects[objectIndex].verticesList[j][k].coordX = x;
      Scene.objects[objectIndex].verticesList[j][k].coordY = y;
      Scene.objects[objectIndex].verticesList[j][k].coordZ = z;
    }
  } 

  console.log('Outside of translation!!!');
}

function executeTranslationAlternative(coordX, coordY, coordZ, objectIndex, event){
  event.preventDefault();
  event.stopPropagation();
  console.log('Inside translationAlternative!!!');
  console.log('coord x: ' + coordX);
  console.log('coord y: ' + coordY);
  console.log('coord z: ' + coordZ);
  console.log('objectIndex: ' + objectIndex);

  const calculationMatrix = [
    [1, 0, 0, coordX],
    [0, 1, 0, coordY],
    [0, 0, 1, coordZ],
    [0, 0, 0, 1]];

  
  console.log('selected object is: ' + Scene.objects[objectIndex]);

  let pointsToBeCalculated = Scene.objects[objectIndex].verticesList.length;
  for(let j = 0; j < pointsToBeCalculated; j++) {
    for(let k = 0; k < Scene.objects[objectIndex].verticesList[0].length; k++){
      //for each object calculate all points
      let x = calculateX(calculationMatrix, Scene.objects[objectIndex].verticesList[j][k]);
      let y = calculateY(calculationMatrix, Scene.objects[objectIndex].verticesList[j][k]);
      let z = calculateZ(calculationMatrix, Scene.objects[objectIndex].verticesList[j][k]);

      //modify point with new coordinates
      Scene.objects[objectIndex].verticesList[j][k].coordX = x;
      Scene.objects[objectIndex].verticesList[j][k].coordY = y;
      Scene.objects[objectIndex].verticesList[j][k].coordZ = z;
    }
  } 

  console.log('Outside of translationAlternative!!!');
}

function executeScale(ratioX, ratioY, ratioZ, objectIndex) {
  //modiffy diference to equal the true scale in percentage
  //must add the difference to the three axis

  const calculationMatrix = [
    [ratioX, 0, 0, 0],
    [0, ratioY, 0, 0],
    [0, 0, ratioZ, 0],
    [0, 0, 0, 1]];


  let pointsToBeCalculated = Scene.objects[objectIndex].verticesList.length;
  for(let j = 0; j < pointsToBeCalculated; j++) {
    for(let k = 0; k < Scene.objects[objectIndex].verticesList[0].length; k++){
      //for each object calculate all points
      let x = calculateX(calculationMatrix, Scene.objects[objectIndex].verticesList[j][k]);
      let y = calculateY(calculationMatrix, Scene.objects[objectIndex].verticesList[j][k]);
      let z = calculateZ(calculationMatrix, Scene.objects[objectIndex].verticesList[j][k]);

      //modify point with new coordinates
      Scene.objects[objectIndex].verticesList[j][k].coordX = x;
      Scene.objects[objectIndex].verticesList[j][k].coordY = y;
      Scene.objects[objectIndex].verticesList[j][k].coordZ = z;
    }
  } 
}

function executeRotationZ(angle, objectIndex) {
  //modiffy diference to equal the true scale in percentage
  //must add the difference to the three axis

  const calculationMatrix = [
    [Math.cos(degreeToRadian(angle)), -Math.sin(degreeToRadian(angle)), 0, 0],
    [Math.sin(degreeToRadian(angle)), Math.cos(degreeToRadian(angle)), 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1]];


  let pointsToBeCalculated = Scene.objects[objectIndex].verticesList.length;
  for(let j = 0; j < pointsToBeCalculated; j++) {
    for(let k = 0; k < Scene.objects[objectIndex].verticesList[0].length; k++){
      //for each object calculate all points
      let x = calculateX(calculationMatrix, Scene.objects[objectIndex].verticesList[j][k]);
      let y = calculateY(calculationMatrix, Scene.objects[objectIndex].verticesList[j][k]);
      let z = calculateZ(calculationMatrix, Scene.objects[objectIndex].verticesList[j][k]);

      //modify point with new coordinates
      Scene.objects[objectIndex].verticesList[j][k].coordX = x;
      Scene.objects[objectIndex].verticesList[j][k].coordY = y;
      Scene.objects[objectIndex].verticesList[j][k].coordZ = z;
    }
  } 
}

function executeRotationY(angle, objectIndex) {
  //modiffy diference to equal the true scale in percentage
  //must add the difference to the three axis
  const calculationMatrix = [
    [Math.cos(degreeToRadian(angle)), 0, Math.sin(degreeToRadian(angle)), 0],
    [0, 1, 0, 0],
    [-Math.sin(degreeToRadian(angle)), 0, Math.cos(degreeToRadian(angle)), 0],
    [0, 0, 0, 1]];


  let pointsToBeCalculated = Scene.objects[objectIndex].verticesList.length;
  for(let j = 0; j < pointsToBeCalculated; j++) {
    for(let k = 0; k < Scene.objects[objectIndex].verticesList[0].length; k++){
      //for each object calculate all points
      let x = calculateX(calculationMatrix, Scene.objects[objectIndex].verticesList[j][k]);
      let y = calculateY(calculationMatrix, Scene.objects[objectIndex].verticesList[j][k]);
      let z = calculateZ(calculationMatrix, Scene.objects[objectIndex].verticesList[j][k]);

      //modify point with new coordinates
      Scene.objects[objectIndex].verticesList[j][k].coordX = x;
      Scene.objects[objectIndex].verticesList[j][k].coordY = y;
      Scene.objects[objectIndex].verticesList[j][k].coordZ = z;
    }
  } 
}

function executeRotationX(angle, objectIndex) {
  //modiffy diference to equal the true scale in percentage
  //must add the difference to the three axis

  const calculationMatrix = [
    [1, 0, 0, 0],
    [0, Math.cos(degreeToRadian(angle)), -Math.sin(degreeToRadian(angle)), 0],
    [0, Math.sin(degreeToRadian(angle)), Math.cos(degreeToRadian(angle)), 0],
    [0, 0, 0, 1]];


  let pointsToBeCalculated = Scene.objects[objectIndex].verticesList.length;
  for(let j = 0; j < pointsToBeCalculated; j++) {
    for(let k = 0; k < Scene.objects[objectIndex].verticesList[0].length; k++){
      //for each object calculate all points
      let x = calculateX(calculationMatrix, Scene.objects[objectIndex].verticesList[j][k]);
      let y = calculateY(calculationMatrix, Scene.objects[objectIndex].verticesList[j][k]);
      let z = calculateZ(calculationMatrix, Scene.objects[objectIndex].verticesList[j][k]);

      //modify point with new coordinates
      Scene.objects[objectIndex].verticesList[j][k].coordX = x;
      Scene.objects[objectIndex].verticesList[j][k].coordY = y;
      Scene.objects[objectIndex].verticesList[j][k].coordZ = z;
    }
  } 
}


//initializing global variables
let modeSelect = false;
let modeDraw = true;
let modeScale = false;
let modeRotationHorizontal = false;
let modeRotationVertical = false;
let pointArray = [];
let rotationAxis = 0;
let numberSections = 0;
let rotationAngle = 0;
let selectedObject;
let isDown = false;
let withOcultation = false;
let noOcultation = true;
let flatShading = false;
let loadedFromFile = false;

//vertices from the 2d profile converted to 3d
let initial3dVertices = [];
//modeled object
let object3d = {
  verticesList: [],
  arestasList: [],
  facesList: [],
  initialFace: true,
  lastFace: true
};

let Scene = {
  objects: []
};

const Camera = {
  front: new point3d(0, 0, 350),
  side: new point3d(350, 0, 0),
  above: new point3d(0, -350, 0),
  p: new point3d(0, 0, 0),
  near: 350,
  far: -350,
  viewUp: new point3d(0, 0, 350)
}

const materialAndIlumination = {
  lightPos: new point3d(0, 0, 350),
  lightInt: 150,
  ka: 0.5,
  kd: 0.5,
  ks: 0.5,
  n: 2.5
}

//beginning execution when the page loads
initFrontCanvas();
initSideCanvas();
initAboveCanvas();
initProfileCanvas();

let originalObjects = {
  objects: []
}


