const canvas = document.getElementById('jsCanvas');
const ctx = canvas.getContext('2d'); // canvas는 픽셀를 다룬다.
const colors = document.getElementsByClassName('jsColor');
const range = document.getElementById('jsRange');
const mode = document.getElementById('jsMode');
const saveBtn = document.getElementById('jsSave');

const INITIAL_COLOR = '#2c2c2c';
const CANVAS_SIZE = 700;

// canvas 크기를 설정해야 painting할 수 있다.
canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;

// image로 저장했을 때 배경을 투명이 아닌 흰색으로 만든다.
ctx.fillStyle = 'white';
ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
ctx.strokeStyle = INITIAL_COLOR;
ctx.fillStyle = INITIAL_COLOR;
ctx.lineWidth = 2.5;

let painting = false;
let filling = false;

function stopPainting() {
  painting = false;
}

function startPainting(event) {
  // 아래 조건문을 하지 않으면 paint일 때 오른쪽 클릭시 fill도 할 수 있다.
  // 왼쪽 클릭은 event.button === 0 or evnet.which ===1 이다.
  if (event.button !== 0) {
    painting = false;
  } else {
    painting = true;
  }
}

function onMouseMove(event) {
  // offsetX, offsetY는 canvas 에서의 위치값
  // clientX, clientY는 window 에서의 위치값
  const x = event.offsetX;
  const y = event.offsetY;

  // painting이 아닐 땐, 보이지 않는 path와 시작점(path의 끝점)을 만들고
  // painting일 땐, 시작점에서 다음까지의 연결선을 보이는 선으로 만든다.
  if (!painting) {
    ctx.beginPath();
    ctx.moveTo(x, y);
  } else {
    ctx.lineTo(x, y);
    ctx.stroke();
  }
}

function handleColorClick(event) {
  // console.log(event.target.style)을 찍어서 필요한 데이터를 찾는다.
  const color = event.target.style.backgroundColor;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
}

function handleRangeChange(event) {
  const size = event.target.value;
  ctx.lineWidth = size;
}

function handleModeClick(event) {
  // fill버튼이 보인다면(filling이라면) paint 중인거고
  // paint버튼이 보인다면(filling아니라면) fill 중인것이다.
  if (filling) {
    filling = false;
    mode.innerText = 'Fill';
  } else {
    filling = true;
    mode.innerText = 'Paint';
  }
}

// evnet는 안 써도 되지만 통일성을 위해 계속 썼다.
function handleCanvasClick(event) {
  // paint 중일때 canvas를 채운다.
  if (filling) {
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  }
}

function handleCM(event) {
  // 설정된 이벤트를 실행을 막는다.
  event.preventDefault();
}

function handleSaveClick(event) {
  // toDataURL(image/jpg)로 확장자를 변경할 수 있다. 기본은 Png
  // 클릭하면 a태그 안에 image url 데이터를 png 파일(이미지명 PaintJS)로 다운로드 할 수 있다.
  const image = canvas.toDataURL();
  const link = document.createElement('a');
  link.href = image;
  link.download = 'PaintJS[🎨]';
  link.click();
}

if (canvas) {
  canvas.addEventListener('mousemove', onMouseMove);
  canvas.addEventListener('mousedown', startPainting);
  canvas.addEventListener('mouseup', stopPainting);
  canvas.addEventListener('mouseleave', stopPainting);
  // 아래 이벤트를 click으로 하면 fill일 때, drag로 paint이 잠깐 된다.
  // 이를 방지하기 위해 click -> mousedown으로 바꿈
  canvas.addEventListener('mousedown', handleCanvasClick);
  canvas.addEventListener('contextmenu', handleCM);
}

// Array로 colors를 확인한다.
Array.from(colors).forEach((color) =>
  color.addEventListener('click', handleColorClick)
);

// if(range)처럼 확인하는 것이 좋다.
if (range) {
  range.addEventListener('input', handleRangeChange);
}

if (mode) {
  mode.addEventListener('click', handleModeClick);
}

if (saveBtn) {
  saveBtn.addEventListener('click', handleSaveClick);
}
