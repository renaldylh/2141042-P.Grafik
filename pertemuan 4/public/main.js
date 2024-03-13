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

var garisawal = 0.0;

function Gambar() {
  const garis = [
    -0.8,
    garisawal,
    0.8,
    garisawal
  ];

  function createAndBindBuffer(data) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    return buffer;
  }
  
  const positionBuffer3 = createAndBindBuffer(garis);

  const positionAttributeLocation = gl.getAttribLocation(
    shaderProgram,
    "a_position"
  );
  gl.enableVertexAttribArray(positionAttributeLocation);
  
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer3);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
}

let arah = 1; // bikin arah

function Animasi() {
  gl.clear(gl.COLOR_BUFFER_BIT);

  const kecepatan = 0.01 * arah; // buat kecepatan berubah kalau 1 maka ke atas kalau -1 kebawah

  garisawal += kecepatan; // buat nilai garis awal ditambah kecepatan 

  // jadiin arah pergerakan berubah mencapai batas atas atau bawah
  if (garisawal >= 0.8 || garisawal <= -0.8) {
    arah *= -1; 
  }

  Gambar(); 
  gl.drawArrays(gl.LINES, 0, 2);
  requestAnimationFrame(Animasi);
}

Animasi();
