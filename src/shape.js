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
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    const uProjectionMatrix = gl.getUniformLocation(
      program,
      "uProjectionMatrix"
    );
    gl.uniformMatrix4fv(uProjectionMatrix, false, this.matrix);

    gl.drawArrays(this.shape, 0, this.points.length);
  }

  move(distX, distY) {
    this.points.forEach((point, index) => {
      this.points[index].x += distX;
      this.points[index].y += distY;
    });
  }

  setMatrix(matrix) {
    this.matrix = matrix;
  }

  setColor(color) {
    this.color = color;
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

    this.setMatrix(result);
  }

  isPointInside(point) {
    let x = point.x;
    let y = point.y;
    let n = this.points.length;
    let result = false;
    for (let i = 0, j = n-1; i < n; j = i++) {
      let pointXi = this.points[i].x;
      let pointYi = this.points[i].y;
      let pointXj = this.points[j].x;
      let pointYj = this.points[j].y;
      if ( ((pointYi>y) != (pointYj>y)) && (x < (pointXj-pointXi) * (y-pointYi) / (pointYj-pointYi) + pointXi) ) {
        result = !result;
      }
    }
    return result;
  }

  isPointInside(point) {
    let x = point.x;
    let y = point.y;
    let n = this.points.length;
    let result = false;
    for (let i = 0, j = n - 1; i < n; j = i++) {
      let pointXi = this.points[i].x;
      let pointYi = this.points[i].y;
      let pointXj = this.points[j].x;
      let pointYj = this.points[j].y;
      if (
        pointYi > y != pointYj > y &&
        x <
          ((pointXj - pointXi) * (y - pointYi)) / (pointYj - pointYi) + pointXi
      ) {
        result = !result;
      }
    }
    return result;
  }
}

class Line extends Shape {
  constructor(points, color) {
    const newPoints = [points[0], points[1]];
    super(newPoints, gl.LINE_STRIP, color);
  }
}

// cari selisih titik x1 y1 sama x2 y2(cursor)
// cari selisih x dan y yang paling besar
class Square extends Shape {
  constructor(points, color) {
    const x1 = points[0].x;
    const y1 = points[0].y;
    let x2 = points[1].x;
    let y2 = points[1].y;

    const longestDistXY =
      Math.abs(x1 - x2) > Math.abs(y1 - y2)
        ? Math.abs(x1 - x2)
        : Math.abs(y1 - y2);

    x2 = x1 > x2 ? x1 - longestDistXY : x1 + longestDistXY;
    y2 = y1 > y2 ? y1 - longestDistXY : y1 + longestDistXY;

    const newPoints = [
      new Point(x1, y1), //0
      new Point(x2, y1), //1
      new Point(x2, y2), //2
      new Point(x1, y2), //3
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
