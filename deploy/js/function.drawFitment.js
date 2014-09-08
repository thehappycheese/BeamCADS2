function drawFitment(ctx,x,y,w,h,rad,fitmentlen,scaled_dfitments){
	if(scaled_dfitments>=3){
		ctx.lineCap = "square";
		ctx.strokeStyle = "black";
		ctx.lineWidth = Math.ceil(scaled_dfitments);
		do_draw();
		ctx.lineCap = "square";
		ctx.strokeStyle = "white";
		ctx.lineWidth = Math.ceil(scaled_dfitments)-2;
		do_draw();

	}else{
		ctx.lineCap = "square";
		ctx.strokeStyle = "black";
		ctx.lineWidth = scaled_dfitments;
		do_draw();
	}

	function do_draw(){
		ctx.beginPath();
			ctx.moveTo(x+w-rad-rad/Math.SQRT2-fitmentlen,y+rad-rad/Math.SQRT2+fitmentlen);
			ctx.arc(x+w-rad,y+rad, rad, Math.PI*1.5-Math.PI/4, Math.PI*2);
			ctx.moveTo(x+w,y+h-rad);
			ctx.lineTo(x+w,y+rad);
			ctx.arc(x+w-rad,y+h-rad,rad,0,Math.PI/2)
			ctx.lineTo(x+w-rad*3,y+h)
			ctx.moveTo(x+w-rad,y+h);
			ctx.lineTo(x+rad,y+h);
			ctx.arc(x+rad,y+h-rad,rad,Math.PI/2,Math.PI)
			ctx.moveTo(x,y+h-rad);
			ctx.lineTo(x,y+rad);
			ctx.arc(x+rad,y+rad,rad,Math.PI,Math.PI*1.5)
			ctx.moveTo(x+rad,y);
			ctx.lineTo(x+w-rad,y);
			
			ctx.arc(x+w-rad,y+rad, rad, -Math.PI/2, Math.PI/4);
			ctx.lineTo(x+w-rad+rad/Math.SQRT2-fitmentlen,y+rad+rad/Math.SQRT2+fitmentlen);
		ctx.stroke();
	}
}