///* Vector.js


CanvasRenderingContext2D.prototype.moveToV = function(v){
	this.moveTo(v.x,v.y)
}
CanvasRenderingContext2D.prototype.lineToV = function(v){
	this.lineTo(v.x,v.y)
}
CanvasRenderingContext2D.prototype.arrowv = function(from,to,size){
	this.beginPath();
	this.moveTo(from.x,from.y);
	this.lineTo(to.x,to.y);
	this.stroke();
	var ang = Math.atan2(to.y-from.y,to.x-from.x);
	this.save();
		this.translate(to.x,to.y);
		this.rotate(ang-Math.PI/2);
		this.beginPath();
		this.moveTo(-0.3*size,-1*size);
		this.lineTo( 0, 0  );
		this.lineTo( 0.3*size,-1*size);
		this.stroke();
	this.restore();
}


CanvasRenderingContext2D.prototype.arrow = function(fx,fy,tx,ty,size){
	this.beginPath();
		this.moveTo(fx,fy);
		this.lineTo(tx,ty);
	this.stroke();
	var ang = Math.atan2(ty-fy,tx-fx);
	this.save();
		this.translate(tx,ty);
		this.rotate(ang-Math.PI/2);
		this.beginPath();
		this.moveTo(-0.3*size,-1*size);
			this.lineTo( 0, 0  );
			this.lineTo( 0.3*size,-1*size);
		this.stroke();
	this.restore();
}


///////////////////////////////////////////////////////////////////
//		Circle drawing Functions
///////////////////////////////////////////////////////////////////
CanvasRenderingContext2D.prototype.circle = function(x,y,radius){
	this.arc(x,y,Math.max(0,radius),0,Math.PI*2);
}
CanvasRenderingContext2D.prototype.fillCircle = function(x,y,radius){
	this.beginPath();
	this.circle(x,y,radius);
	this.fill();
}
CanvasRenderingContext2D.prototype.strokeCircle = function (x,y,radius) {
	this.beginPath();
	this.circle(x,y,radius);
	this.stroke();
}

CanvasRenderingContext2D.prototype.fillStrokeCircle = function(x,y,radius){
	this.beginPath();
	this.circle(x,y,radius);
	this.fill();
	this.stroke();
}



////////////////////////////////////////////////////////////////////////////////////////
//		SHARP LINE
////////////////////////////////////////////////////////////////////////////////////////
CanvasRenderingContext2D.prototype.sharpLine = function (aa, bb, cc, dd, r,g,b,a) {

	
	var v1 = {x:aa,y:bb};
	var v2 = {x:cc,y:dd};
	
	var x0 = Math.round(v1.x);
	var y0 = Math.round(v1.y);
	var x1 = Math.round(v2.x);
	var y1 = Math.round(v2.y);
	
	var imd = this.getImageData(0,0,this.canvas.width,this.canvas.height);
	var index;
	
	
	var dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
	var dy = Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1; 
	var err = (dx>dy ? dx : -dy)/2;
	//var out = 0;
	while (true) {
		index = 4*x0 + (4*this.canvas.width)*y0;
		imd.data[index+0]	= r;
		imd.data[index+1]	= g;
		imd.data[index+2]	= b;
		imd.data[index+3]	= a;
		//this.setPixel(x0,y0,0,0,0,255);
		
		if (x0 === x1 && y0 === y1) break;
		var e2 = err;
		if (e2 > -dx) { err -= dy; x0 += sx; }
		if (e2 < dy) { err += dx; y0 += sy; }
	}
	//console.log(out);
  this.putImageData(imd,0,0);
}
CanvasRenderingContext2D.prototype.sharpLineV = function(v1,v2,r,g,b,a){
	this.sharpLine(v1.x,v1.y,v2.x,v2.y,r,g,b,a);
}
////////////////////////////////////////////////////////////////////////////////////////
//		SET PIXEL
////////////////////////////////////////////////////////////////////////////////////////
CanvasRenderingContext2D.prototype.setPixel = function (x,y, r,g,b,a) {
	var imd = this.getImageData(0,0,this.canvas.width,this.canvas.height);
	var index = 4*x + (4*this.canvas.width)*y;

	imd.data[index+0]	= r;
	imd.data[index+1]	= g;
	imd.data[index+2]	= b;
	imd.data[index+3]	= a;
	this.putImageData(imd,0,0);
}