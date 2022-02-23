const state = new State();
state.drawAll();

const drawNewShape = () => {
  state.addShape();
  state.drawAll();
  state.setIsDrawing(false);
  state.setCoordinates([]);
}

canvas.addEventListener("click", e => {
  const {x, y} = state.getCursorCoordinate(e);
  if (state.getCoordinatesLength() < 1) {
    state.setIsDrawing(true);
  }
  state.addCoordinate(x, y);
  if(state.shape != Polygon && state.getCoordinatesLength() >= 2) {
    drawNewShape();
  }
});

canvas.addEventListener("keypress", e => {
  if(state.shape === Polygon && e.keyCode === 13){
    drawNewShape();
  }
});

canvas.addEventListener("mousemove", e => {
  if (state.isDrawing) {
    state.drawAll();
    const {x, y} = state.getCursorCoordinate(e);
    const tempCoordinates = [...state.coordinates, new Point(x, y)];
    if (state.shape === Polygon && state.getCoordinatesLength() < 2) {
      (new Line(tempCoordinates, state.shapeColor)).draw();
      return;
    }
    (new state.shape(tempCoordinates, state.shapeColor)).draw(); 
  }
});