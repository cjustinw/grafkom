const state = new State();
state.drawAll();

var scalePointRange = document.getElementById("scale-point");
var scaleValue = document.getElementById("scale-value");
scalePointRange.addEventListener("change", () => {
  scaleValue.innerHTML = scalePointRange.value;
})

var shapes = document.getElementById("shapes");
shapes.addEventListener("change", () => {
  switch (shapes.value){
    case ("line"):
      state.setShape(Line);
      break;
    
    case ("square"):
      state.setShape(Square);
      break;
    
    case ("rectangle"):
      state.setShape(Rectangle);
      break;

    case ("polygon"):
      state.setShape(Polygon);
      break;
    
    default:
      state.setShape(Line);
      break;
  }
})

const drawNewShape = () => {
  state.addShape();
  state.drawAll();
  state.setIsDrawing(false);
  state.setCoordinates([]);
};

canvas.addEventListener("click", (e) => {
  var cursorMode = document.getElementById("cursor-mode").value;
  var scalePoint = document.getElementById("scale-point").value;
  console.log(cursorMode);
  if (cursorMode === "draw") {
    const { x, y } = state.getCursorCoordinate(e);
    if (state.getCoordinatesLength() < 1) {
      state.setIsDrawing(true);
    }
    state.addCoordinate(x, y);
    if (state.shape != Polygon && state.getCoordinatesLength() >= 2) {
      drawNewShape();
    }
  } else if (cursorMode === "scale") {
    state.getNearestPoint(e, scalePoint);
    state.drawAll();
  }
  else {
    state.getNearestPointColor(e);
    state.drawAll();
  }
});

canvas.addEventListener("keypress", (e) => {
  if (state.shape === Polygon && e.keyCode === 13) {
    drawNewShape();
  }
});

canvas.addEventListener("mousemove", (e) => {
  // console.log(scalePoint);
  if (state.isDrawing) {
    state.drawAll();
    const { x, y } = state.getCursorCoordinate(e);
    const tempCoordinates = [...state.coordinates, new Point(x, y)];
    if (state.shape === Polygon && state.getCoordinatesLength() < 2) {
      new Line(tempCoordinates, state.shapeColor).draw();
      return;
    }
    new state.shape(tempCoordinates, state.shapeColor).draw();
  }
});

var download = function(filename, text) {
  var element = document.createElement('a')
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
  element.setAttribute('download', filename)

  element.style.display = 'none'
  document.body.appendChild(element)

  element.click()

  document.body.removeChild(element)
}

var exportButton = document.getElementById("export_button");
exportButton.addEventListener("click", () => {
  var filename = document.getElementById("export_file").value
  console.log(state)

  if (!filename) {
      filename = 'data'
  }

  var data = JSON.stringify(state);
  download(filename + ".json", data);

  console.log("The file was saved!"); 
})

var importButton = document.getElementById("import_button");
importButton.addEventListener("click", () => {
    var file = document.getElementById("import_file").files[0]
    var reader = new FileReader();
    // var data = [];
    reader.onload = function(e){
        console.log('file imported')
        let arrObjects = JSON.parse(e.target.result);
        console.log(arrObjects);
        state.setState(arrObjects.shapeList, arrObjects.coordinates, arrObjects.isDrawing, arrObjects.shapeColor, arrObjects.backgroundColor);
        // state.setShape(Line)
        // state.drawAll();
        // console.log(state)
        // console.log(data)
        // arrObjects = data
        // renderAll()
    }
    
    reader.readAsText(file);
    if (!file) {
        alert('Blank file')
    }
})
