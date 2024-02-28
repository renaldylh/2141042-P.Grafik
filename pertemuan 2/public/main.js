const canvas = document.querySelector("canvas");
const gl = canvas.getContext("webgl");

if (!gl) {
  throw new Error("Tidak Support WebGL");
}

alert("Silahkan Klik OK");

// atur ukuran canvas yang digunakan
// canvas.width = 800; // ini ukuran lebar dalam pixel
// canvas.height = 800; // ini ukuran tinggi dalam pixel


const canvasWidth = 800;
const canvasHeight = 800;

// Set ukuran canvas
canvas.width = canvasWidth;
canvas.height = canvasHeight;



// bersihkan layer
gl.clearColor(0, 0, 1, 1); // Updated alpha value to 1
gl.clear(gl.COLOR_BUFFER_BIT);
gl.viewport(0,0,canvas.width,canvas.height);

// membuat data koordinat titik
const points1 = [
  -0.10, 0.8,   // titik pertama
  0.4, -0.3,   // titik kedua
  -0.5, -0.9   // titik ketiga
];

const points2 = [
  0.1, 0.5,   // titik pertama
  0.3, 0.8,   // titik kedua
  0.5, 0.5    // titik ketiga
];

const points3 = [
  -0.8, 0.1,   // titik pertama
  0.5, 0.2,    // titik kedua
  0.0, -0.7    // titik ketiga
];

// Membuat vertex shader
const vertexShaderSource = `
  attribute vec2 a_position;
  void main() {
    gl_PointSize = 12.0;
    gl_Position = vec4(a_position, 0.0, 1.0); // Posisi titik
  }
`;

// Membuat fragment shader
const fragmentShaderSource = `
  precision mediump float;  

  void main() {
      gl_FragColor = vec4(0, 0, 0, 1); // Warna titik
  }
`;

// membuat prog shader dan menghubungkan shader
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertexShaderSource);
gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fragmentShaderSource);
gl.compileShader(fragmentShader);

// Membuat program shader
const shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram);
gl.useProgram(shaderProgram);

// Mendapatkan lokasi atribut posisi dari shader
const positionAttributeLocation = gl.getAttribLocation(
  shaderProgram,
  "a_position"
);
gl.enableVertexAttribArray(positionAttributeLocation);


// Menggambar titik
function createAndBindBuffer(data) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
  return buffer;
}

const positionBuffer1 = createAndBindBuffer(points1);
const positionBuffer2 = createAndBindBuffer(points2);
const positionBuffer3 = createAndBindBuffer(points3);


// Menggambar objek pertama dengan gl.LINE_LOOP
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer1);
gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
gl.drawArrays(gl.LINE_LOOP, 0, 3);

// Menggambar objek kedua dengan gl.LINES
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer2);
gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
gl.drawArrays(gl.LINES, 0, 3);

// Menggambar objek ketiga dengan gl.LINE_STRIP
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer3);
gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
gl.drawArrays(gl.LINE_STRIP, 0, 3);
