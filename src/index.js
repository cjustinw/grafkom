const scalePointRange = document.getElementById("scale-point");
const cursorMode = document.getElementById("cursor-mode");
const scaleValue = document.getElementById("scale-value");
const shapes = document.getElementById("shapes");
const exportButton = document.getElementById("export_button");
const importButton = document.getElementById("import_button");

const mode = {
  DRAW: "draw",
  MOVE: "move",
  SCALE: "scale",
  COLOR: "color",
}

const state = new State();
state.drawAll();

cursorMode.addEventListener("change", () => {
  state.setMode(cursorMode.value);
});

scalePointRange.addEventListener("change", () => {
  scaleValue.innerHTML = scalePointRange.value;
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

canvas.addEventListener("click", (e) => {
  let { x, y } = state.getCursorCoordinate(e);
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
    if (state.getCoordinatesLength() < 1) {
      let shapeIndex = state.getIndexOfShapeInCoordinate(new Point(x, y));
      if(shapeIndex !== null) {
        state.addCoordinate(x, y);
        state.setSelectedShape(shapeIndex);
        state.setIsMove(true);
      }
    }
    else if (state.getCoordinatesLength() > 1){
      state.moveShape(state.selectedShape, state.coordinates[state.getCoordinatesLength()-2], state.coordinates[state.getCoordinatesLength()-1]);
      state.setSelectedShape(null);
      state.drawAll();
      state.setIsMove(false);
      state.setCoordinates([]);
    }
  } 
  else if (state.mode === mode.SCALE) {
    let shapeIndex = state.getIndexOfShapeInCoordinate(new Point(x, y));
    let scalePoint = scalePointRange.value;
    state.shapeList[shapeIndex].scaleMatrix(scalePoint);
    state.drawAll();
  } 
  else if (state.mode === mode.COLOR){
      let shapeIndex = state.getIndexOfShapeInCoordinate(new Point(x, y));
      var color1 = parseInt(document.getElementById('color-point').value.substr(1, 6),16,)
      color1 = [Math.floor(color1 / 65536) / 255,
      Math.floor((color1 % 65536) / 256) / 255,
      (color1 % 256) / 255,];
  
      var color2 = new Color(color1[0], color1[1], color1[2]);
      state.shapeList[shapeIndex].setColor(color2);
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
      let { x, y } = state.getCursorCoordinate(e);
      let tempCoordinates = [...state.coordinates, new Point(x, y)];
      if (state.shape === Polygon && state.getCoordinatesLength() < 2) {
        new Line(tempCoordinates, state.shapeColor).draw();
        return;
      }
      new state.shape(tempCoordinates, state.shapeColor).draw();
    }
  }
  else if (state.mode === mode.MOVE) {
    if (state.selectedShape !== null) {
      state.drawAll();
      let { x, y } = state.getCursorCoordinate(e);
      state.addCoordinate(x, y);
      state.moveShape(state.selectedShape, state.coordinates[state.getCoordinatesLength()-2], state.coordinates[state.getCoordinatesLength()-1]);
    }
  }
});

const download = (filename, text) => {
  let element = document.createElement("a");
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

exportButton.addEventListener("click", () => {
  let filename = document.getElementById("export_file").value;
  console.log(state);

  if (!filename) {
    filename = "data";
  }

  let data = JSON.stringify(state);
  download(filename + ".json", data);

  console.log("The file was saved!");
});

importButton.addEventListener("click", () => {
  let file = document.getElementById("import_file").files[0];
  let reader = new FileReader();
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
