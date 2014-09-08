///* function.dim.js
///* Vector.js
///* CADCanvas.js
///* CADCanvas.Patterns.js
///* Beam.js
///* function.drawArrow.js
Beam.prototype.drawStressBlock = function(ctx){
	
	var options = {
		draw_d:false,
		draw_dn:true,
		draw_gammadn:true
	}
	
	
	// PREPARE THE CANVAS:
	var canvas = ctx.canvas;
	if (!ctx.setLineDash) {
		console.warn("Your browser isnt able to draw dashed lines :(")
		ctx.setLineDash = function () {}
	}
	ctx.font = "12px serif";
	ctx.textBaseline = "top";
	ctx.textAlign = "left";


	
	
	// PREPARE THE LAYOUT AND SCALING
	var padding_left = 2;
	var padding_top = 40;
	var padding_bottom = 30;
	var padding_right = 2;
	
	var max_height = canvas.height - (padding_top+padding_bottom);
	var max_width = canvas.width - (padding_left+padding_right);
	
	
	
	
	var scaleX = function(n){
		return n*(s_b/this.b);
	}.bind(this);
	
	var scaleY = function(n){
		return n*(s_D/this.D);
	}.bind(this);
	
	
	
	
	// PREPARE SOME CASHED VAIABLES TO PREVENT REPEATED FUNCTION CALLS:
	var dn = this.dn;
	var d = this.Ts_centroid_depth_from_dn(dn)
	var b = null;
	var s_b = 100;// Set the beam width at 100;
	var s_D = Math.max(100,Math.min(max_height,this.D/this.b*s_b));
	var s_dn= scaleY(dn);
	var s_d = scaleY(d);
	
	
	

	
	
	// BEING DRAWING:
	ctx.clearRect(0,0,canvas.width,canvas.height);
	ctx.save()
		// TRANSFORM:
		ctx.translate(padding_left,	padding_top);
		
		
		// DRAW CROSS SECTION
		// Lable cross section
		ctx.save()
			ctx.textBaseline = "top";
			ctx.textAlign = "left";
			ctx.font = "15px sans-serif";
			ctx.fillStyle = "grey";
			ctx.fillText("CROSS-SECTION",0,-padding_top+2);
		ctx.restore();
		
		
		
		
		
		if(options.draw_dn){
			// Draw dn the Neutral axisline and lable:
			ctx.setLineDash([4,4,12,4]);
			ctx.beginPath();
			ctx.strokeStyle = "grey";
			ctx.lineWidth = 1;
			ctx.moveTo(-10,s_dn);
			ctx.lineTo(max_width+10,s_dn)
			ctx.stroke();
			ctx.fillStyle = "grey";
			ctx.fillText("dn = "+dn.toFixed(0)+"mm", s_b+5,s_dn+2);
		}
		
		if(options.draw_d){
			// Draw d the effective depth line and lable:
			ctx.setLineDash([8,4]);
			ctx.beginPath();
			ctx.strokeStyle = "darkred";
			ctx.lineWidth = 2;
			ctx.moveTo(-10,s_d);
			ctx.lineTo(max_width+10,s_d)
			ctx.stroke();
			ctx.fillStyle = "darkred";
			ctx.fillText("d = "+d.toFixed(0)+"mm", s_b+5,s_d+2);
		}
		
		
		
		ctx.setLineDash([]);
		if(options.draw_gammadn){
			// Draw compressive zone and lable
			CanvasPatterns.set2x2Hatch(ctx,"limegreen");
			ctx.fillRect(0,0,s_b,s_dn*this.gamma);
			ctx.fillStyle = "limegreen";
			ctx.textBaseline = "bottom";
			ctx.fillText("\u0263dn = "+(dn*this.gamma).toFixed(0)+"mm", s_b+5,s_dn*this.gamma-2);
		}

		// draw basic section
		ctx.lineWidth = 2;
		ctx.strokeStyle = "black";
		ctx.strokeRect(0,0,s_b,s_D);
		
		

		

		// draw section with reo bars
		for(var i = 0;i<this.reo.length;i++){
			var layer = this.reo[i];
			var x = s_b*0.1;
			var spacing = s_b*0.8/(layer.number-1);

			var f = this.layer_strain_from_layer_dn(layer, dn);
			if(f>0){
				ctx.fillStyle = "red";
			}else{
				ctx.fillStyle = "blue";
			}
			var rad = Math.max(2,Math.min(scaleX(10),scaleY(10)));
			var sid = rad*1.8;
			for(var j = 0; j<layer.number;j++){
				if(f>0){
					ctx.fillCircle(x+spacing*j,scaleY(layer.depth),rad);
				}else{
					ctx.fillRect(x+spacing*j-sid/2,scaleY(layer.depth)-sid/2,sid,sid);
				}
			}
		}
		
		
		
		
		////////////////////////////////////////////////////////
		// DRAW THE STRAIN COMPATIBILITY DIAGRAM
		////////////////////////////////////////////////////////
		ctx.translate(200,0);
		// Lable cross section
		ctx.save()
			ctx.textBaseline = "top";
			ctx.textAlign = "center";
			ctx.font = "15px sans-serif";
			ctx.fillStyle = "grey";
			ctx.fillText("STRAIN DIAGRAM",0,-padding_top+2);
		ctx.restore();

		
		// Establish plot function

		var strain_from_d = function(arg_d,capped){
			if(capped){
				return -Math.min(0.0025,Math.max(-0.0025,this.strain_from_d_dn(arg_d,dn)))/0.0025*60;
			}
			
			return -this.strain_from_d_dn(arg_d,dn)/0.003*10;
		}.bind(this);
		//console.log(strain_from_d(0),strain_from_d(this.D),strain_from_d(this.D/2));
		
		
		
		if(Math.abs(strain_from_d(this.D))>60){
			var strain_from_d = function(arg_d,capped){
				if(capped){
					return -Math.min(0.0025,Math.max(-0.0025,this.strain_from_d_dn(arg_d,dn)))/0.0025*60;
				}
				
				var i = this.strain_from_d_dn(arg_d,dn);
				var k = Math.abs(this.strain_from_d_dn(this.D,dn));
				return -i/k*60;
			}.bind(this);
		}
		
		// plot graph line
		CanvasPatterns.setHorizontalLine(ctx,"#FFC9FF");
		ctx.lineWidth = 1;
		ctx.strokeStyle = "magenta";
		ctx.beginPath();
			ctx.moveTo(0,0);
			ctx.lineTo(strain_from_d(0),0);
			ctx.lineTo(strain_from_d(this.D),s_D);
			ctx.lineTo(0,s_D)
		ctx.fill();
		ctx.stroke();
		
		// Label concrete strain
		ctx.fillStyle = "magenta";
		ctx.textAlign = "left";
		ctx.textBaseline = "bottom";
		ctx.fillText("\u03B5cmax = 0.003",strain_from_d(0),-2);
		
		// TODO: Pack this function out a utility file.
		var unicodeToNumSubscript=function(str){
			var result = [];
			var inp = String(str).split("")
			var offset = ("\u2080").charCodeAt(0)-("0").charCodeAt(0);
			while(inp.length>0){
				result.push(
					String.fromCharCode(inp.shift().charCodeAt(0)+offset)
				);
			}
			return result.join('')
		}
		
		// Draw/label reo strains
		for(var i = 0;i<this.reo.length;i++){
			var layer= this.reo[i];
			var strain = this.layer_strain_from_layer_dn(layer,dn,true);
			if(strain>0){
				ctx.strokeStyle="red";
				ctx.fillStyle="red";
			}else{
				ctx.strokeStyle="blue";
				ctx.fillStyle="blue";
			}
			ctx.lineWidth=2;
			ctx.beginPath();
				ctx.moveTo(0,scaleY(layer.depth));
				ctx.lineTo(strain_from_d(layer.depth),scaleY(layer.depth));
			ctx.stroke();
			ctx.textAlign = "left";
			ctx.textBaseline = "middle";
			ctx.fillText("\u03B5s"+i+" = "+strain.toFixed(4)+((Math.abs(strain)>0.0025)?" yield":" elast"),10,scaleY(layer.depth));
		}
		
		
		// Draw origin line
		ctx.lineWidth = 2;
		ctx.strokeStyle = "black";
		ctx.beginPath();
			ctx.moveTo(0,0);
			ctx.lineTo(0,s_D);
		ctx.stroke();
		 
		
		
		
		
		
		
		////////////////////////////////////////////////////////
		// DRAW THE FORCE DIAGRAM
		////////////////////////////////////////////////////////
		ctx.translate(180,0);
		// Lable cross section
		ctx.save()
			ctx.textBaseline = "top";
			ctx.textAlign = "center";
			ctx.font = "15px sans-serif";
			ctx.fillStyle = "grey";
			ctx.fillText("FORCE DIAGRAM",0,-padding_top+2);
		ctx.restore();
		
		
		// Draw the green square
		CanvasPatterns.set2x2Hatch(ctx,"limegreen");
		ctx.lineWidth = 1;
		ctx.strokeStyle = "limegreen";
		ctx.fillRect(0,0,50,s_dn*this.gamma);
		ctx.strokeRect(0,0,50,s_dn*this.gamma);
		ctx.fillStyle = "limegreen";
		ctx.textAlign = "center";
		ctx.textBaseline = "bottom";
		var Cc = this.Cc_from_dn(dn);
		ctx.fillText("Cc = "+Cc.toFixed(0)+"kN ("+(-this.fc*this.alpha2).toFixed(0)+"MPa)",25,-2);
		
		
		
		// Draw the force vectors
		for(var i = 0;i<this.reo.length;i++){
			var layer= this.reo[i];
			var strain = this.layer_strain_from_layer_dn(layer,dn);
			var force = this.layer_force_from_layer_dn(layer,dn);
			
			
			ctx.textBaseline = "middle";
			if(strain>0){
				ctx.strokeStyle="red";
				ctx.fillStyle="red";
				ctx.textAlign = "left";
				ctx.fillText("Ts"+i+" = "+force.toFixed(0)+"kN",3,scaleY(layer.depth));
			}else{
				ctx.strokeStyle="blue";
				ctx.fillStyle="blue";
				ctx.textAlign = "right";
				ctx.fillText("Cs"+i+" = "+force.toFixed(0)+"kN",-3,scaleY(layer.depth));
			}
			ctx.lineWidth=2;
			drawArrow(ctx,
				0,scaleY(layer.depth),
				strain_from_d(layer.depth,true),scaleY(layer.depth),
				6);
			
			
		}
		
		
		
		
		
		
		
		
		
		
		// Draw origin line
		ctx.lineWidth = 2;
		ctx.strokeStyle = "black";
		ctx.beginPath();
			ctx.moveTo(0,0);
			ctx.lineTo(0,s_D);
		ctx.stroke();
		
		
		
		
		
		
		
		
		
		
	ctx.restore()
	
	
	
	return "ended draw normally";
}