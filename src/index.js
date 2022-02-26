const scalePointRange = document.getElementById("scale-point");
const cursorMode = document.getElementById("cursor-mode");
const scaleValue = document.getElementById("scale-value");
const shapes = document.getElementById("shapes");

const mode = {
  DRAW: "draw",
  MOVE: "move",
  SCALE: "scale",
}

const state = new State();

state.drawAll();

scalePointRange.addEventListener("change", () => {
  scaleValue.innerHTML = scalePointRange.value;
});

cursorMode.addEventListener("change", () => {
  state.setMode(cursorMode.value);
});

shapes.addEventListener("change", () => {
  switch (shapes.value) {
    case "line":
      state.setShape(Line);
      break;

    case "square":
      state.setShape(Square);
      break;

    case "rectangle":
      state.setShape(Rectangle);
      break;

    case "polygon":
      state.setShape(Polygon);
      break;

    default:
      state.setShape(Line);
      break;
  }
});


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
  const { x, y } = state.getCursorCoordinate(e);
  if (cursorMode === "draw") {
    if (state.getCoordinatesLength() < 1) {

canvas.addEventListener("click", (e) => {
  const { x, y } = state.getCursorCoordinate(e);
  if (state.mode === mode.DRAW) {
    state.addCoordinate(x, y);
    if (state.getCoordinatesLength() <= 1) {
      state.setIsDrawing(true);
    }
    else if (state.shape != Polygon && state.getCoordinatesLength() >= 2) {
      state.addShape();
      state.drawAll();
      state.setIsDrawing(false);
      state.setCoordinates([]);
    }
  } 
  else if (state.mode === mode.MOVE) {
    state.addCoordinate(x, y);
    console.log(state.coordinates);
    if (state.getCoordinatesLength() <= 1) {
      state.setIsMove(true);
    }

  } else if (cursorMode === "scale") {
    let shapeIndex = state.getIndexOfShapeInCoordinate(new Point(x, y));
    // console.log(shapeIndex);
    // console.log(state.shapeList[shapeIndex]);
    state.shapeList[shapeIndex].scaleMatrix(scalePoint);
    // state.getNearestPoint(e, scalePoint);
    else {
      const index = state.getIndexOfShapeInCoordinate(state.coordinates[0]);
      if(index !== null) {
        console.log(index);
        const distX = state.coordinates[1].x - state.coordinates[0].x;
        const distY = state.coordinates[1].y - state.coordinates[0].y;
        state.shapeList[index].move(distX, distY);
        state.drawAll();
      }
      state.setIsMove(false);
      state.setCoordinates([]);
    }
  }
  else if (state.mode === mode.SCALE) {
    const scalePoint = scalePointRange.value;
    state.getNearestPoint(e, scalePoint);

    state.drawAll();
  } else {
    state.getNearestPointColor(e);
    state.drawAll();
  }
});

canvas.addEventListener("keypress", (e) => {
  if (state.mode === mode.DRAW) {
    if (state.shape === Polygon && e.keyCode === 13) {
      state.addShape();
      state.drawAll();
      state.setIsDrawing(false);
      state.setCoordinates([]);
    }
  }
});

canvas.addEventListener("mousemove", (e) => {
  if (state.mode === mode.DRAW) {
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
  }
  else if (state.mode === mode.MOVE) {
    //
  }
});

var download = function (filename, text) {
  var element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
};

var exportButton = document.getElementById("export_button");
exportButton.addEventListener("click", () => {
  var filename = document.getElementById("export_file").value;
  console.log(state);

  if (!filename) {
    filename = "data";
  }

  var data = JSON.stringify(state);
  download(filename + ".json", data);

  console.log("The file was saved!");
});

var importButton = document.getElementById("import_button");
importButton.addEventListener("click", () => {
  var file = document.getElementById("import_file").files[0];
  var reader = new FileReader();
  // var data = [];
  reader.onload = function (e) {
    console.log("file imported");
    let arrObjects = JSON.parse(e.target.result);
    console.log(arrObjects);
    state.setState(
      arrObjects.shapeList,
      arrObjects.coordinates,
      arrObjects.isDrawing,
      arrObjects.shapeColor,
      arrObjects.backgroundColor
    );
    // state.setShape(Line)
    // state.drawAll();
    // console.log(state)
    // console.log(data)
    // arrObjects = data
    // renderAll()
  };

  reader.readAsText(file);
  if (!file) {
    alert("Blank file");
  }
});
