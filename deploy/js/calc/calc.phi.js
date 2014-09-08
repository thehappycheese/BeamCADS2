///* ../CalcDiv.js
if(calc===undefined) var calc = {};

calc.phi = new (function(){
	CalcDiv.call(this); // Extends calcdiv
	
	
	this.updateTitle = function(){
		this.title = '<a href="#help_bar_phi">&#x3d5;</a> = '+b.phi.toFixed(2);
	}.bind(this);
	
	this.update = function(){
	
		this.content = "";
		this.addParagraph("Find Capacity Reduction Factor From AS3600 from Table 2.2.2 (b)(i)");
		this.addParagraph(
			"$$\\begin{aligned}"+
				"\\phi &= 1.19 - \\frac{13}{12} k_{uo} \\\\"+
						"&= 1.19 - \\frac{13}{12} "+b.kuo.toFixed(3)+"\\\\"+
						"&= "+(1.19-13/12*b.kuo).toFixed(3)+
			"\\end{aligned}$$"
		);
		
		this.addParagraph("$$Where ~~~ 0.6 \\le \\phi \\le 0.8$$");
		
		this.addParagraph("Thus:");
		this.addParagraph("$$\\phi = "+b.phi.toFixed(2)+"$$");
		
		
		this.updateMathJax();
	}.bind(this);
	
	this.on("init",this.updateTitle);
	this.on("show",this.update);

})();
