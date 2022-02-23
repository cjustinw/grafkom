class State {
  constructor() {
    this.shapeList = [];
    this.coordinates = [];
    this.isDrawing = false;
    this.shape = Polygon;
    this.shapeColor = new Color(1, 1, 1);
    this.backgroundColor = new Color(0, 0, 0);
  }

  drawAll() {
    gl.clearColor(this.backgroundColor.red, this.backgroundColor.green, this.backgroundColor.blue, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    this.shapeList.forEach(shape => {
      shape.draw();
    });
  }

  clearAll() {
    this.shapeList = [];
    gl.clearColor(this.backgroundColor.red, this.backgroundColor.green, this.backgroundColor.blue, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }

  addCoordinate(x, y) {
    this.coordinates.push(new Point(x, y));
  }

  addShape() {
    if (this.isDrawing) {
      this.shapeList.push(new state.shape(this.coordinates, this.shapeColor));
      this.coordinates = [];
    }
  }

  setIsDrawing(isDrawing) {
    this.isDrawing = isDrawing;  
  }

  setShape(shape) {
    this.shape = shape;  
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

  getCoordinatesLength() {
    return this.coordinates.length;
  }

  getCursorCoordinate(event) {
    const x = (event.offsetX / canvas.clientWidth) * 2 - 1;
    const y = (1 - (event.offsetY / canvas.clientHeight)) * 2 - 1;
    return {x, y};
  }
}