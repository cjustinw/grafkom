/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas");

const gl = canvas.getContext("webgl", {
  preserveDrawingBuffer: true
});

gl.viewport(0, 0, canvas.width, canvas.height);
gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

const vertex = gl.createShader(gl.VERTEX_SHADER);
const fragment = gl.createShader(gl.FRAGMENT_SHADER);

const vertexSource = [
    'precision mediump float;',
    '',
    'attribute vec2 vPosition;',
    'attribute vec3 vColor;',
    'varying vec3 fragColor;',
    'void main()',
    '{',
    'fragColor = vColor;',
    'gl_Position = vec4(vPosition,0.0,1.0);',
    '}'
].join("\n");

const fragmentSource = [
    'precision mediump float;',
    'varying vec3 fragColor;',
    'void main(){',
    'gl_FragColor = vec4(fragColor, 1.0);',
    '}'
].join("\n");

gl.shaderSource(vertex, vertexSource);
gl.shaderSource(fragment, fragmentSource);

gl.compileShader(vertex);
if (!gl.getShaderParameter(vertex, gl.COMPILE_STATUS)) {
  console.log("ERROR:", gl.getShaderInfoLog(vertex));
}

gl.compileShader(fragment);
if (!gl.getShaderParameter(fragment, gl.COMPILE_STATUS)) {
  console.log("ERROR:", gl.getShaderInfoLog(fragment));
}

const program = gl.createProgram();
gl.attachShader(program, vertex);
gl.attachShader(program, fragment);

gl.linkProgram(program);
if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
  console.log("ERROR: ", gl.getProgramInfoLog(program));
}

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

const vPosition = gl.getAttribLocation(program, 'vPosition');
gl.vertexAttribPointer(
  vPosition, 
  2, 
  gl.FLOAT, 
  gl.FALSE, 
  5 * Float32Array.BYTES_PER_ELEMENT, 
  0  
);

const vColor = gl.getAttribLocation(program, 'vColor');
gl.vertexAttribPointer(
  vColor, 
  3, gl.FLOAT, 
  gl.FALSE, 
  5 * Float32Array.BYTES_PER_ELEMENT, 
  2 * Float32Array.BYTES_PER_ELEMENT  
);

gl.enableVertexAttribArray(vPosition);
gl.enableVertexAttribArray(vColor);
gl.useProgram(program);