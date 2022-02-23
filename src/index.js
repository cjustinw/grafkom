const state = new State();
state.drawAll();

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
  } else {
    state.getNearestPoint(e, scalePoint);
    state.drawAll();
  }
});

canvas.addEventListener("keypress", (e) => {
  if (state.shape === Polygon && e.keyCode === 13) {
    drawNewShape();
  }
});

canvas.addEventListener("mousemove", (e) => {
  // var scalePoint = document.getElementById("scale-point").value;
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
