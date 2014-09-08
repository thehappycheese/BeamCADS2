///* Vector.js
///* CADCanvas.js

function dim(ctx,x1,y1,x2,y2,angle,dist,txt){
	var fontpx = 15;
	ctx.save();
	ctx.font = fontpx+"px serif";
	ctx.textBaseline="middle"
	ctx.textAlign="center"
	
	var metric = ctx.measureText(txt);
	
	
	var v1 = new Vector(x1,y1);
	var v2 = new Vector(x2,y2);
	var offset = (new Vector()).fromAngLen(angle,Math.max(10,Math.abs(dist),metric.width/2*Math.cos(angle)+5)*dist/Math.abs(dist));
	var va = v1.copy().add(offset);
	var dimlen = (new Vector()).fromAngLen(angle+Math.PI/2,1).dot(v2.copy().minus(v1))
	var vb = va.copy().add((new Vector()).fromAngLen(angle+Math.PI/2,1).scalar(dimlen));
	var vt = va.copy().add(vb).scalar(0.5);
	if(va.copy().minus(vb).len<30){
		offset = (new Vector()).fromAngLen(angle, Math.max(10, Math.abs(dist))*dist/Math.abs(dist));
		va = v1.copy().add(offset);
		dimlen = (new Vector()).fromAngLen(angle+Math.PI/2,1).dot(v2.copy().minus(v1))
		vb = va.copy().add((new Vector()).fromAngLen(angle+Math.PI/2,1).scalar(dimlen));
		vt = va.copy().add(vb).scalar(0.5).add(offset.unit().scalar(metric.width/2+5));
	}
	
	var angAtoB = vb.copy().minus(va).ang;
	
	ctx.lineWidth = 1;
	ctx.strokeStyle = "#555555";
	ctx.fillStyle = "#555555";
	
	// Draw line bodies
	ctx.beginPath();
		var vc = va.copy().minus(v1).unit().scalar(4).add(v1);
		var vd = va.copy().minus(v1).unit().scalar(4).add(va);
		ctx.moveTo(vc.x,vc.y);
		ctx.lineTo(vd.x,vd.y);
		//ctx.sharpLineV(vc,vd,0,0,0,255);
		
		
		var vc = vb.copy().minus(v2).unit().scalar(4).add(v2);
		var vd = vb.copy().minus(v2).unit().scalar(4).add(vb);
		ctx.moveTo(vc.x,vc.y);
		ctx.lineTo(vd.x,vd.y);
		//ctx.sharpLineV(vc,vd,0,0,0,255);
		
		ctx.moveTo(va.x,va.y);
		ctx.lineTo(vb.x,vb.y);
		//ctx.sharpLineV(va,vb,0,0,0,255);
	ctx.stroke();
	
	// Arrowhead A
	ctx.save()
		ctx.translate(va.x,va.y);
		ctx.rotate(angAtoB-Math.PI/2);
		ctx.beginPath();
		ctx.moveTo(0,0);
		ctx.lineTo(2,5);
		ctx.lineTo(-2,5);
		ctx.fill();
		
		//ctx.sharpLine(0,0,2,5,0,0,0,255);
		//ctx.sharpLine(0,0,-2,5,0,0,0,255);
	ctx.restore();
	
	// Arrowhead B
	ctx.save()
		ctx.translate(vb.x, vb.y);
		ctx.rotate(angAtoB+Math.PI/2);
		ctx.moveTo(0,0);
		ctx.lineTo(2,5);
		ctx.lineTo(-2,5);
		//ctx.sharpLine(0,0,2,5,0,0,0,255);
		//ctx.sharpLine(0,0,-2,5,0,0,0,255);
		ctx.fill();
	ctx.restore();
	
	if(txt && txt !== "") {
		// Draw text
		ctx.fillStyle = "#000000";

		ctx.clearRect(vt.x-metric.width/2-3,vt.y-fontpx/2-1,metric.width+6,fontpx+4);
		ctx.fillText(txt,vt.x,vt.y);
	}
	ctx.restore();
	
}