const scalePointRange = document.getElementById("scale-point");
const colorPointRange = document.getElementById("color-point");
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

const option = {
  LINE: "line",
  SQUARE: "square",
  RECTANGLE: "rectangle",
  POLYGON: "polygon"
}

const state = new State();
state.drawAll();

cursorMode.addEventListener("change", () => {
  state.setMode(cursorMode.value);
});

scalePointRange.addEventListener("change", () => {
  scaleValue.innerHTML = scalePointRange.value;
});

colorPointRange.addEventListener("change", () => {
  let color = parseInt(document.getElementById('color-point').value.substr(1, 6),16,)
  state.setDefaultShapeColor(color);
});

shapes.addEventListener("change", () => {
  switch (shapes.value) {
    case option.LINE:
      state.setShape(Line);
      break;

    case option.SQUARE:
      state.setShape(Square);
      break;

    case option.RECTANGLE:
      state.setShape(Rectangle);
      break;

    case option.POLYGON:
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
    if (!state.isDrawing) {
      state.setIsDrawing(true);
    }
    else if (state.shape != Polygon && state.isDrawing) {
      state.addShape();
      state.drawAll();
      state.setIsDrawing(false);
      state.setCoordinates([]);
    }
  } 
  else if (state.mode === mode.MOVE) {
    if (!state.isMove) {
      let shapeIndex = state.getIndexOfShapeInCoordinate(new Point(x, y));
      if(shapeIndex !== null) {
        state.addCoordinate(x, y);
        state.setSelectedShape(shapeIndex);
        state.setIsMove(true);
      }
    }
    else {
      state.moveShape(state.selectedShape, state.coordinates[state.getCoordinatesLength()-2], state.coordinates[state.getCoordinatesLength()-1]);
      state.setSelectedShape(null);
      state.drawAll();
      state.setIsMove(false);
      state.setCoordinates([]);
    }
  } 
  else if (state.mode === mode.SCALE) {
    let shapeIndex = state.getIndexOfShapeInCoordinate(new Point(x, y));
    if (shapeIndex !== null) {
      let scalePoint = scalePointRange.value;
      state.shapeList[shapeIndex].scaleMatrix(scalePoint);
      state.drawAll();
    }
  } 
  else if (state.mode === mode.COLOR){
      let shapeIndex = state.getIndexOfShapeInCoordinate(new Point(x, y));
      if (shapeIndex !== null) {
        let color = parseInt(document.getElementById('color-point').value.substr(1, 6),16,)
        state.setShapeColor(shapeIndex, color);
        state.drawAll();
      }
  }
});

canvas.addEventListener("keypress", (e) => {
  if (state.mode === mode.DRAW) {
    if (state.isDrawing) {
      if (state.shape === Polygon && e.keyCode === 13) {
        state.addShape();
        state.drawAll();
        state.setIsDrawing(false);
        state.setCoordinates([]);
      }
      else if (e.keyCode === 113) {
        state.setIsDrawing(false);
        state.setCoordinates([]);
        state.drawAll();
      }
    }
  }
  else if (state.mode === mode.MOVE) {
    if (state.isMove) {
      if (e.keyCode === 113) {
        state.moveShape(state.selectedShape, state.coordinates[state.getCoordinatesLength()-1], state.coordinates[0]);
        state.setIsMove(false);
        state.setCoordinates([]);
        state.drawAll();
      }
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
    if (state.isMove) {
      if (state.selectedShape !== null) {
        state.drawAll();
        let { x, y } = state.getCursorCoordinate(e);
        state.addCoordinate(x, y);
        state.moveShape(state.selectedShape, state.coordinates[state.getCoordinatesLength()-2], state.coordinates[state.getCoordinatesLength()-1]);
      }
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
  reader.onload = (e) => {
    console.log("file imported");
    let arrObjects = JSON.parse(e.target.result);
    let shapeList = []
    arrObjects.shapeList.forEach(shape => {
      let newShape = null;
      if (shape.name === option.LINE) {
        newShape = new Line();
      }
      else if (shape.name === option.SQUARE) {
        newShape = new Square();
      }
      else if (shape.name === option.RECTANGLE) {
        newShape = new Rectangle();
      }
      else if (shape.name === option.POLYGON) {
        newShape = new Polygon();
      }
      if (newShape !== null) {
        newShape.load(shape.name, shape.points, shape.shape, shape.color);
        shapeList.push(newShape);
      }
    });
    state.setState(
      shapeList,
      arrObjects.coordinates,
      arrObjects.isDrawing,
      arrObjects.shapeColor,
      arrObjects.backgroundColor
    );
    state.drawAll();
  };

  reader.readAsText(file);
  if (!file) {
    alert("Blank file");
  }
});
