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
});

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
  }
  else {
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
