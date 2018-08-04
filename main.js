var xx = document.getElementById('xx');
var context = xx.getContext('2d');
var actions = document.getElementById('actions');
var pen = document.getElementById('pen');
var eraser = document.getElementById('eraser');
var color = document.getElementsByClassName('colors')[0];
var clera = document.getElementById("clear");
var download = document.getElementById("download");
var lineWidth = 5;
//自动设置高宽
autoSetCanvasSize(xx);
//监听鼠标事件
ListenToUser(xx);

/**********************************************************************/
//橡皮状态
var usingEraser = false;
//改变画笔粗细
thin.onclick = function () {
  lineWidth = 5;
}
thick.onclick = function () {
  lineWidth = 10;
}
//循环绑定事件
for (var i = 0; i < color.children.length; i++) {
  color.children[i].onclick = function (e) {
    for (var j = 0; j < color.children.length; j++) {
      color.children[j].classList.remove('active');
    }
    var penColor = this.className;
    this.classList.add('active');
    context.strokeStyle = penColor;
    context.fillStyle = penColor;
    console.log(penColor);
  }
}
eraser.onclick = function () {
  usingEraser = true;
  eraser.classList.add('active');
  pen.classList.remove('active');
  clera.classList.remove('active');

}
pen.onclick = function () {
  usingEraser = false;
  pen.classList.add('active');
  eraser.classList.remove('active');
  clera.classList.remove('active');
}
clera.onclick = function () {
  clera.classList.add('active');
  context.clearRect(0, 0, xx.width, xx.width);
  clera.classList.remove('active');
}
download.onclick = function () {
  var url = xx.toDataURL('image/png/jpg');
   var a = document.createElement('a');
   a.href = url;
   a.download = "canvas图片";
   a.target = "_blank";
   a.click();
  }
/**********************************************************************/
//自动设置宽高函数
function autoSetCanvasSize(canvas) {
  setCanvasSize();
  window.onresize = function () {
    setCanvasSize();
  };

  function setCanvasSize() {
    var pagex = document.documentElement.clientWidth;
    var pagey = document.documentElement.clientHeight;
    //设置属性值不是样式
    canvas.width = pagex;
    canvas.height = pagey;
  }
}
/**********************************************************************/
//监听用户动作
function ListenToUser(canvas) {
  //画笔状态
  var paining = false;
  var last = {
    x: undefined,
    y: undefined
  };
  if (document.body.ontouchstart !== undefined) {
    //触摸事件
    canvas.ontouchstart = function (a) {
      var x = a.touches[0].clientX;
      var y = a.touches[0].clientY;
      paining = true;
      if (usingEraser) {
        context.clearRect(x - 15, y - 15, 30, 30);
      } else {
        huayuan(x, y, 2);
        //记录鼠标按下的坐标
        last.x = x;
        last.y = y;
      }
    }
    canvas.ontouchmove = function (a) {
      //记录当前坐标
      var newx = {
        x: a.touches[0].clientX,
        y: a.touches[0].clientY
      };
      if (!paining) {
        return;
      } else if (usingEraser) {
        context.clearRect(newx.x - 10, newx.y - 10, 20, 20);
      } else {
        //鼠标移动时画线，并与上一次移动时的坐标之间相连
        huaxian(last.x, last.y, newx.x, newx.y);
        //更新上一次移动时的坐标
        last = newx;
      }
    }
    canvas.ontouchend = function () {
      paining = false;
    }

  } else {
    //鼠标事件
    canvas.onmousedown = function (aa) {
      var x = aa.clientX;
      var y = aa.clientY;
      paining = true;
      if (usingEraser) {
        context.clearRect(x - 5, y - 5, 10, 10);
      } else {
        huayuan(x, y, 2);
        //记录鼠标按下的坐标
        last.x = x;
        last.y = y;
      }
    };
    canvas.onmousemove = function (aa) {
      //记录当前坐标
      var newx = {
        x: aa.clientX,
        y: aa.clientY
      };
      if (!paining) {
        return;
      } else if (usingEraser) {
        context.clearRect(newx.x - 10, newx.y - 10, 20, 20);
      } else {
        //鼠标移动时画线，并与上一次移动时的坐标之间相连
        huaxian(last.x, last.y, newx.x, newx.y);
        //更新上一次移动时的坐标
        last = newx;
      }
    };
    canvas.onmouseup = function (aa) {
      paining = false;

    };
  }

  function huayuan(x, y, rudius) {
    context.beginPath();
    context.lineWidth = lineWidth;
    context.arc(x, y, rudius, Math.PI * 2, false);
    context.fill();
  }

  function huaxian(x1, y1, x2, y2) {
    context.beginPath();
    context.lineWidth = lineWidth;
    context.moveTo(x1, y1); //起点
    context.lineTo(x2, y2); //终点
    context.stroke();
    context.closePath();
  }
}