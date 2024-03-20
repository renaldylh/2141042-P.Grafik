const canvas = document.querySelector("canvas");
const gl = canvas.getContext("webgl");

if (!gl) {
  throw new Error("Tidak Support WebGL");
}

alert("Silahkan Klik OK");

const canvasWidth = 400;
const canvasHeight = 400;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

gl.clearColor(0.0, 1.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.viewport(0, 0, canvas.width, canvas.height);

const vertexShaderSource = `
  attribute vec2 a_position;
  void main() {
    gl_PointSize = 12.0;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision mediump float;  

  void main() {
      gl_FragColor = vec4(0, 0, 0, 1);
  }
`;

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertexShaderSource);
gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fragmentShaderSource);
gl.compileShader(fragmentShader);

const shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram);
gl.useProgram(shaderProgram);

var kotakPosisi = { x: 0, y: 0 };
var kecepatanVertikal = 0;
const kecepatanLompat = 0.03;
const gravitasi = 0.001;

function GambarKotak() {
  const kotakVertices = [
    // Vertices kotak
    -0.4 + kotakPosisi.x,  0.4 + kotakPosisi.y,
    -0.4 + kotakPosisi.x, -0.4 + kotakPosisi.y,
     0.4 + kotakPosisi.x,  0.4 + kotakPosisi.y,
    -0.4 + kotakPosisi.x, -0.4 + kotakPosisi.y,
     0.4 + kotakPosisi.x, -0.4 + kotakPosisi.y,
     0.4 + kotakPosisi.x,  0.4 + kotakPosisi.y
  ];

  const positionBuffer = createAndBindBuffer(kotakVertices);

  const positionAttributeLocation = gl.getAttribLocation(shaderProgram, "a_position");
  gl.enableVertexAttribArray(positionAttributeLocation);
  
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
}

function createAndBindBuffer(data) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
  return buffer;
}

function handleKeyPress(event) {
  if (event.code === "Space") {
    kecepatanVertikal = kecepatanLompat;
  }
}

function handleJumpButtonClick() {
  kecepatanVertikal = kecepatanLompat;
}

document.addEventListener("keydown", handleKeyPress);
document.getElementById("lompat").addEventListener("click", handleJumpButtonClick);


function Animasi() {
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Terapkan gravitasi
  kecepatanVertikal -= gravitasi;

  // Perbarui posisi vertikal kotak
  kotakPosisi.y += kecepatanVertikal;

  // Batasi pergerakan kotak agar tidak keluar dari layar
  if (kotakPosisi.y > 0.6) {
    kotakPosisi.y = 0.6;
    kecepatanVertikal = -0;
  } else if (kotakPosisi.y < 0.0) {
    kotakPosisi.y = 0.0;
    kecepatanVertikal = -0;
  } 

  GambarKotak();
  gl.drawArrays(gl.TRIANGLES, 0, 6); // Menggunakan TRIANGLES untuk menggambar kotak
  requestAnimationFrame(Animasi);
}

Animasi();