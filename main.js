var xx = document.getElementById('xx');
var actions = document.getElementById('actions');
//自动设置高宽
autoSetCanvasSize(xx);
//监听鼠标事件
ListenToUser(xx);

/**********************************************************************/

var usingEraser = false;
eraser.onclick = function () {
  usingEraser = true;
  actions.className = "actions x";
  console.log(brush.display);
};
brush.onclick = function () {
  usingEraser = false;
  actions.className = "actions";
};
/**********************************************************************/
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

function ListenToUser(canvas) {
  var context = canvas.getContext('2d');
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
        context.clearRect(x - 5, y - 5, 10, 10);
      } else {
        huayuan(x,y,2);
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
      usingEraser = false;
      actions.className = "actions";
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
      usingEraser = false;
      actions.className = "actions";

    };
  }
  function huayuan(x, y, rudius) {
    context.beginPath();
    context.fillStyle = "blank";
    context.arc(x, y, rudius, Math.PI * 2, false);
    context.fill();
  }

  function huaxian(x1, y1, x2, y2) {
    context.beginPath();
    context.strokeStyle = "blank";
    context.lineWidth = 4;
    context.moveTo(x1, y1); //起点
    context.lineTo(x2, y2); //终点
    context.stroke();
    context.closePath();
  }
}