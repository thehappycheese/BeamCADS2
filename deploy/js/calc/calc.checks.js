///* ../CalcDiv.js
if(calc===undefined) var calc = {};

calc.checks = new (function(){
	CalcDiv.call(this); // Extends calcdiv
	
	this.updateTitle = function(){
		this.title = 'Other Values';
	}.bind(this);
	
	this.update = function(){
		
		this.content = "";
		
		
		
		
		
		// TODO: Highlight error bar and this ones title if there is a problem
		
		
		
		
		this.addParagraph(
						"This software does not check serviceability requirements (yet)."
		);
		this.addParagraph(
						"Values for which calculations are not shown in this software: "+
						"$$\\begin{aligned}"+
						"I_g &= " + (b.Ixx).toFixed(0) + " ~mm^4\\\\"+
						"Z_e &= " + b.Ze.toFixed(0) + " ~mm^3 \\\\"+
						"A_g &= " + b.Ag.toFixed(0) + " ~mm^2 \\\\"+
						"f'_{ct.f} &= " + b.fctf.toFixed(2) + " MPa \\\\"+
						"(M_{uo})_{min} &= "+ b.Muo_min.toFixed(0) +" ~kNm ~(\\text{See AS3600 8.1.6.1}) \\\\"+
						"(A_{st})_{min} &= "+ b.Muo_min_Ast_min.toFixed(0) +" ~mm^2 ~(\\text{See AS3600 8.1.6.1}) \\\\"+
						"\\end{aligned}$$"
		);
		
		this.updateMathJax();
	}.bind(this);
	
	this.on("init",this.updateTitle);
	this.on("show",this.update);

})();
