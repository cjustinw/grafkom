const state = new State();
state.drawAll();

//var r = JSON.stringify(state.shapeColor["red"]);
//var g = JSON.stringify(state.shapeColor["green"]);
//var b = JSON.stringify(state.shapeColor["blue"]);
// shapeColor = [r, g, b];

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
  //alert (JSON.stringify(state.shapeColor));
  //alert(JSON.stringifiy(state.shapeList));
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


// Baru buat warna
canvas.addEventListener("mouseup", e => {
  var color1 = parseInt(document.getElementById('color-picker').value.substr(1, 6),16,)
  color1 = [Math.floor(color1 / 65536) / 255,
  Math.floor((color1 % 65536) / 256) / 255,
  (color1 % 256) / 255,]
  // alert(color1)
  var selectedVertex = -1
  const {x, y} = state.getCursorCoordinate(e);
  // alert(JSON.stringify(state.shapeList));
  // Buat ubah warna, pencet salah satu titik sudut yg mau diubah
    // Titik sudut dipencet = ubah warnanya sesuai color picker
  alert(state.shapeList.length);
  // Cari titik sudut yang dipencet kursor
  // Tapi entah kenapa 1 warna berubah, berubah semua (?) sama berubah warna buat ngegambarnya
  for(var i=0; i < state.shapeList.length;i++) {
    //alert());
    for(var j=0; j < state.shapeList[i].points.length ; j++) {
      if (state.shapeList[i].points[j].x==x && state.shapeList[i].points[j].y==y) {
        //alert(state.shapeList[i].points[j].x);
        state.shapeList[i].color.red = color1[0];
        state.shapeList[i].color.green = color1[1];
        state.shapeList[i].color.blue = color1[2];    
        //selectedVertex = i;
        //alert(selectedVertex);
        break;
      }
    }
  }
});