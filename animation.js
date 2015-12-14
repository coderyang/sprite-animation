;(function(window) {

  var canvas = null,
    	context = null;

  function extend(obj1, obj2) {
    var key;
    for (key in obj2) {
      obj1[key] = obj2[key];
    }

    return obj1;
  }

  function Canvas(elem, options) {

    if (!(this instanceof Canvas)) {
      return new Canvas(elem, options);
    }

    this.elem = elem;

    var self = this;

    canvas = document.createElement("canvas");

    if (canvas.getContext) {
      context = canvas.getContext("2d");
    }

    if (typeof elem == "undefined" || Object.prototype.toString.call(elem) == "[object Object]") {

      options = elem;
      var div = document.createElement("div");
      div.className = "canvas-container";
      div.appendChild(canvas);
      document.body.appendChild(div);
      this.elem = div;

    } else if (elem.nodeType && elem.nodeType == 1) {
      elem.appendChild(canvas);
    }

    (function init() {

      var key;

      for (key in options) {
        self[key] = options[key];
        if (key == "width" || key == "height") {
          canvas[key] = self[key];
        }
      }

    })();

  }

  Canvas.prototype = {

    constructor: Canvas,

    refresh: function(callback) {

      context.clearRect(0, 0, this.width, this.height);

      if (callback && typeof callback == "function") {
        callback.call(this);
      }

    },

    destroy: function() {
      context.clearRect(0, 0, this.width, this.height);
      document.body.removeChild(this.elem);
    },

    /**
     * @param  {Array} sprite options
     */
    animate: function(options) {

      var self = this,
      		sprite = {},
      		img = new Image();

      img.src = options.src;

      img.onload = function(){

    	  extend(sprite, {
    	    tickCount: 0,
    	    frameWidth: img.width / options.numberOfFrames,
    	    frameHeight: img.height,
    	    index: 0,
    	    tickPerFrame: options.tickPerFrame || 0
    	  });

    	  (function loop() {

    	    requestAnimationFrame(loop);

    	    sprite.tickCount++;
    	    if (sprite.tickCount > sprite.tickPerFrame) {
    	      sprite.tickCount = 0;
    	      sprite.index %= options.numberOfFrames - 1;
    	      self.refresh(function() {
    	      	context.fillStyle = "#6c8";
    	      	context.fillRect(0, 0, this.width, this.height);
    	      	for (var i = 0, leni = options.numberOfFrames; i < leni; i++) {
    	      		for (var j = 0, lenj = options.numberOfFrames; j < lenj; j++) {
		    	        context.drawImage(img, sprite.index * sprite.frameWidth, 0, sprite.frameWidth, sprite.frameHeight, 
		    	        									i*sprite.frameWidth, j*sprite.frameHeight+5, sprite.frameWidth, sprite.frameHeight);
    	      		}
    	      	}
    	        sprite.index++;
    	      });
    	    }
    	  })();
			};
    },
  };

  (function test() {

    var canvas = Canvas({
      width: 440,
      height: 410
    });

    canvas.refresh(function() {
    	context.fillStyle = "#6c8";
    	context.fillRect(0, 0, this.width, this.height);
      this.animate({
      	src: "coin-sprite-animation-sprite-sheet.png",
      	numberOfFrames: 10,
      	tickPerFrame: 5
      });
    });

  })();


})(window);