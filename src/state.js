class State {
  constructor() {
    this.shapeList = [];
    this.coordinates = [];
    this.isDrawing = false;
    this.isMove = false;
    this.selectedShape = null;
    this.mode = "draw"
    this.shape = Line;
    this.shapeColor = new Color(1, 1, 1);
    this.backgroundColor = new Color(0, 0, 0);
  }

  drawAll() {
    gl.clearColor(
      this.backgroundColor.red,
      this.backgroundColor.green,
      this.backgroundColor.blue,
      1
    );
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    this.shapeList.forEach((shape) => {
      shape.draw();
    });
  }

  clearAll() {
    this.shapeList = [];
    gl.clearColor(
      this.backgroundColor.red,
      this.backgroundColor.green,
      this.backgroundColor.blue,
      1
    );
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }

  setState(shapeList, coordinates, isDrawing, shapeColor, backgroundColor) {
    this.shapeList = shapeList;
    this.coordinates = coordinates;
    this.isDrawing = isDrawing;
    this.shapeColor = shapeColor;
    this.backgroundColor = backgroundColor;
  }

  setSelectedShape(index) {
    this.selectedShape = index;
  }

  addCoordinate(x, y) {
    this.coordinates.push(new Point(x, y));
  }

  addShape() {
    if (this.isDrawing) {
      this.shapeList.push(new this.shape(this.coordinates, this.shapeColor));
      this.coordinates = [];
    }
  }

  setIsDrawing(isDrawing) {
    this.isDrawing = isDrawing;
  }

  setIsMove(isMove) {
    this.isMove = isMove;
  }

  setShape(shape) {
    this.shape = shape;
  }

  setMode(mode) {
    this.mode = mode;
  }

  setShapeColor(red, green, blue) {
    this.shapeColor = new Color(red, green, blue);
  }

  setBackgroundColor(red, green, blue) {
    this.backgroundColor = new Color(red, green, blue);
  }

  setCoordinates(coordinates) {
    this.coordinates = coordinates;
  }

  moveShape(index, src, dest) {
    if(index !== null) {
      let distX = dest.x - src.x;
      let distY = dest.y - src.y;
      this.shapeList[index].move(distX, distY);
    }
  }

  getCoordinatesLength() {
    return this.coordinates.length;
  }

  getCursorCoordinate(event) {
    const x = (event.offsetX / canvas.clientWidth) * 2 - 1;
    const y = (1 - event.offsetY / canvas.clientHeight) * 2 - 1;
    return { x, y };
  }

  getIndexOfShapeInCoordinate(point) {
    let result = null;
    this.shapeList.forEach((shape, index) => {
      if (shape.isPointInside(point)) {
        result = index;
      }
    });
    return result;
  }
}