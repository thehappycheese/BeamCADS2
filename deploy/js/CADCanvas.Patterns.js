

CanvasPatterns = new (function(){
	


	this.set2x2Hatch = function(ctx, color){
		var canvas = document.createElement("canvas");
		var c = canvas.getContext('2d');


		canvas.width = 2;
		canvas.height = 2;
		c.fillStyle = color;
		c.fillRect(0,0,1,1);
		c.fillRect(0,1,1,1);

		ctx.fillStyle = ctx.createPattern(canvas,"repeat");

	}
	
	this.setHorizontalLine = function(ctx,color){
		var canvas = document.createElement("canvas");
		var c = canvas.getContext('2d');


		canvas.width = 1;
		canvas.height = 6;
		c.fillStyle = color;
		c.fillRect(0,0,1,1);

		ctx.fillStyle = ctx.createPattern(canvas,"repeat");
	}

})();