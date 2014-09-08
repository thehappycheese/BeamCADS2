///* ../CalcDiv.js
if(calc===undefined) var calc = {};

calc.phiMuo = new (function(){
	CalcDiv.call(this); // Extends calcdiv
	
	
	this.updateTitle = function(){
		this.title = '<a href="#help_bar_phi">&#x3d5;</a><a href="#help_bar_Muo">M<sub>uo</sub></a> = '+b.phiMuo.toFixed(0)+" kNm";
	}.bind(this);
	
	this.update = function(){
	
		this.content = "";
		this.addParagraph("Find Ultimate Capacity According to AS3600 2.2.2:");
		this.addParagraph(
			"$$\\begin{aligned}"+
				"\\phi M_{uo} &= "+b.phi.toFixed(2)+"\\times"+b.Muo.toFixed(0)+"~kNm \\\\"+
						"&= "+b.phiMuo.toFixed(0)+" ~kNm"+
			"\\end{aligned}$$"
		);
		
		this.updateMathJax();
	}.bind(this);
	
	this.on("init",this.updateTitle);
	this.on("show",this.update);

})();
