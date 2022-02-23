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

// prettier-ignore
class Shape {
  constructor(points, shape, color) {
    this.points = points;
    this.shape = shape;
    this.color = color;
    // prettier-ignore
    this.matrix = [
      1, 0, 0, 0, 
      0, 1, 0, 0, 
      0, 0, 1, 0, 
      0, 0, 0, 1
    ];
  }

  draw() {
    const vertices = [];
    this.points.forEach((point) => {
      vertices.push(
        point.x,
        point.y,
        this.color.red,
        this.color.green,
        this.color.blue
      );
    });
    console.log(this.points);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    const uProjectionMatrix = gl.getUniformLocation(
      program,
      "uProjectionMatrix"
    );
    gl.uniformMatrix4fv(uProjectionMatrix, false, this.matrix);

    gl.drawArrays(this.shape, 0, this.points.length);
  }

  setMatrix(matrix) {
    this.matrix = matrix;
  }

  // prettier-ignore
  scaleMatrix(x = 1) {
    // prettier-ignore
    let scale = [
      x, 0, 0, 0,
      0, x, 0, 0,
      0, 0, x, 0,
      0, 0, 0, 1
    ]
    // prettier-ignore
    let result = [
      scale[0] * this.matrix[0], 0, 0, 0,
      0, scale[5] * this.matrix[5], 0, 0,
      0, 0, scale[10] * this.matrix[10], 0,
      0, 0, 0, scale[15] * this.matrix[15]
    ]
    this.setMatrix(result)
  }
}

class Line extends Shape {
  constructor(points, color) {
    const newPoints = [points[0], points[1]];
    super(newPoints, gl.LINE_STRIP, color);
  }
}

class Square extends Shape {
  constructor(points, color) {
    const newPoints = [
      new Point(points[0].x, points[0].y), //0
      new Point(points[1].x, points[0].y), //1
      new Point(points[1].x, points[1].y), //2
      new Point(points[0].x, points[1].y), //3
    ];
    super(newPoints, gl.TRIANGLE_FAN, color);
  }
}

class Rectangle extends Shape {
  constructor(points, color) {
    const newPoints = [
      new Point(points[0].x, points[0].y),
      new Point(points[1].x, points[0].y),
      new Point(points[1].x, points[1].y),
      new Point(points[0].x, points[1].y),
    ];
    super(newPoints, gl.TRIANGLE_FAN, color);
  }
}

class Polygon extends Shape {
  constructor(points, color) {
    super(points, gl.TRIANGLE_FAN, color);
  }
}
