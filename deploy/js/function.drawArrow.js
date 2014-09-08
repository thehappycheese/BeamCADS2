



function drawArrow(ctx,fx,fy,tx,ty,s){
	
	var ix = tx-fx;
	var iy = ty-fy;
	var im = Math.sqrt(ix*ix+iy*iy);
	ix = ix/im*(im-s+1)+fx;
	iy = iy/im*(im-s+1)+fy;
	
	s=Math.min(s,im/2);
	
	ctx.beginPath();
		ctx.moveTo(fx,fy);
		ctx.lineTo(ix,iy);
	ctx.stroke();

	// Arrowhead A
	ctx.save()
		ctx.translate(tx,ty);
		ctx.rotate(Math.atan2(ty-fy,tx-fx)+Math.PI/2);
		ctx.beginPath();
			ctx.moveTo(0,0);
			ctx.lineTo(s/2,s);
			ctx.lineTo(-s/2,s);
		ctx.fill();
		ctx.stroke();
		
		//ctx.sharpLine(0,0,2,5,0,0,0,255);
		//ctx.sharpLine(0,0,-2,5,0,0,0,255);
	ctx.restore();
}