class Color {
  constructor(red, green, blue) {
    this.red = red;
    this.green = green;
    this.blue = blue;
  }
}

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Shape {
  constructor(points, shape, color) {
    this.points = points;
    this.shape = shape;
    this.color = color;
  }

  draw() {
    const vertices = [];
    this.points.forEach(point => {
      vertices.push(point.x, point.y, this.color.red, this.color.green, this.color.blue);
    });
    console.log(this.points);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.drawArrays(this.shape, 0, this.points.length);
  }
}

class Line extends Shape {
  constructor(points, color) {
    const newPoints = [
      points[0], 
      points[1]
    ];
    super(newPoints, gl.LINE_STRIP, color);
  }
}

class Rectangle extends Shape {
  constructor(points, color) {
    const newPoints = [
      new Point(points[0].x, points[0].y),
      new Point(points[1].x, points[0].y),
      new Point(points[1].x, points[1].y),
      new Point(points[0].x, points[1].y)
    ];
    super(newPoints, gl.TRIANGLE_FAN, color);
  }
}

class Polygon extends Shape {
  constructor(points, color) {
    super(points, gl.TRIANGLE_FAN, color);
  }
}