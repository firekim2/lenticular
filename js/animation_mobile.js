var body = document.body;
var totalWidth = window.innerWidth;
var color1 = 'rgb(204, 204, 204)';
var color2 = 'rgb(255, 4, 1)';
var lenticular = document.querySelector( '.lenticular' );
var canvas_p = document.getElementById("canvas_p");
var canvas_t = document.getElementById("canvas_t");
var ctx_p = canvas_p.getContext("2d");
var ctx_t = canvas_t.getContext("2d");
var grid_width = 4;
function App() {

    this.init = () => {
      canvas_p.width = grid_width;
      canvas_p.height = lenticular.offsetHeight;
      canvas_t.width = grid_width;
      canvas_t.height = lenticular.offsetHeight;
  		window.onmousemove = ( event ) => {
  			var percentage = event.x / totalWidth;
  			var color = fadeToColor(color1, color2, percentage)
  			body.style.backgroundColor = color;
  			var segment = Math.floor( 24 * percentage );
        if ( segment > 22 ) {
            segment = 22;
        } else if ( segment < 1 ) {
            segment = 1;
        }
        mask_p(segment);
        mask_t(segment);
  	  }
      if (window.DeviceOrientationEvent) {
          window.addEventListener("deviceorientation", function () {
              mobileTilt([event.beta, event.gamma]);
          }, true);
      } else if (window.DeviceMotionEvent) {
          window.addEventListener('devicemotion', function () {
              mobileTilt([event.acceleration.x * 2, event.acceleration.y * 2]);
          }, true);
      } else {
          window.addEventListener("MozOrientation", function () {
              mobileTilt([orientation.x * 50, orientation.y * 50]);
          }, true);
      }
      window.onresize = () => {
          totalWidth = window.innerWidth;
      }
    }

  mask_p = (ratio) => {
    setTimeout(() => {
      ctx_p.clearRect(0, 0, canvas_p.width, canvas_p.height);
      ctx_p.fillStyle = "rgba(0, 0, 0, 1)";
      ctx_p.filter = "blur(3px)";
      ctx_p.fillRect(0, 0, grid_width * ratio / 23, canvas_p.height);
      ctx_p.filter = "blur(0px)";
      ctx_p.fillRect(0, 0, grid_width * ratio / 23, canvas_p.height);
      var dataURL = canvas_p.toDataURL("image/png");
      document.getElementById("p").setAttribute("style","-webkit-mask-image:url(" + dataURL + ")");
    }, 0);
  }

  mask_t = (ratio) => {
    setTimeout(() => {
      ctx_t.clearRect(0, 0, canvas_t.width, canvas_t.height);
      ctx_t.fillStyle = "rgba(0, 0, 0, 1)";
      ctx_t.filter = "blur(3px)";
      ctx_t.fillRect(grid_width * ratio / 23, 0, grid_width - grid_width * ratio / 23, canvas_t.height);
      ctx_t.filter = "blur(0px)";
      ctx_t.fillRect(grid_width * ratio / 23, 0, grid_width - grid_width * ratio / 23, canvas_t.height);
      dataURL = canvas_t.toDataURL("image/png");
      document.getElementById("t").setAttribute("style","-webkit-mask-image:url(" + dataURL + ")");
    }, 0);
  }

	fadeToColor = (rgbColor1, rgbColor2, ratio) => {
      if (ratio < 0) ratio = 0;
      else if (ratio > 1) ratio = 1;
	    var color1 = rgbColor1.substring(4, rgbColor1.length - 1).split(','),
	        color2 = rgbColor2.substring(4, rgbColor2.length - 1).split(','),
	        difference,
	        newColor = [];

	    for (var i = 0; i < color1.length; i++) {
	        difference = color2[i] - color1[i];
	        newColor.push(Math.floor(parseInt(color1[i], 10) + difference * ratio));
	    }

	    return 'rgb(' + newColor + ')';
	}

   mobileTilt = (data) => {
        var percentage = (data[1] + 45) / 90;
        var color = fadeToColor(color1, color2, percentage)
        body.style.backgroundColor = color;
        var segment = Math.floor( 24 * percentage );
        if ( segment > 22 ) {
            segment = 22;
        } else if ( segment < 1 ) {
            segment = 1;
        }
        mask_p(segment);
        mask_t(segment);
    }
}

var app = new App();
app.init();
