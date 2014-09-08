///* ../CalcDiv.js
if(calc===undefined) var calc = {};

calc.alpha2 = new (function(){
	CalcDiv.call(this); // Extends calcdiv
	
	
	this.updateTitle = function(){
		this.title = '<a href="#help_bar_alpha2"> &alpha;<sub>2</sub></a> = '+b.alpha2.toFixed(2)+' &nbsp;&nbsp;&nbsp;and&nbsp;&nbsp;&nbsp; <a href="#help_bar_gamma">&gamma;</a> = '+b.gamma.toFixed(2);
	}.bind(this);
	
	this.update = function(){
		var para = function(str){
			return '<p>'+str+'</p>';
		}
		
		var str1 = "";
		str1 += para("$$$\\begin{aligned}\\alpha_2 &= 1.0 - 0.003 f'_c \\\\"+
						"&= 1.0-0.003\\times "+b.fc.toFixed(0)+"\\\\"+
						"&= "+(1-0.003*b.fc).toFixed(2)+"\\end{aligned}$$$");
		str1 += para("where $$$0.67 \\le \\alpha_2 \\le 0.85 $$$");
		str1 += para(" &there4; $$$\\alpha_2 = "+b.alpha2.toFixed(2)+" $$$");
		
		var str2 = "";
		str2 += para("$$$\\begin{aligned}\\gamma &= 1.05 - 0.007 f'_c \\\\"+
						"&= 1.05-0.007\\times "+b.fc.toFixed(0)+"\\\\"+
						"&= "+(1.05-0.007*b.fc).toFixed(2)+"\\end{aligned}$$$");
		str2 += para("where $$$0.67 \\le \\gamma \\le 0.85 $$$");
		str2 += para(" &there4; $$$\\gamma = "+b.gamma.toFixed(2)+" $$$");
		
		
		
		this.content =  para("From AS3600 Section 8.1.3(b)(ii)")+'<table style="width:100%;"><tr><td>'+str1+'</td><td>'+str2+'</td></tr></table>';
		this.updateMathJax();
	}.bind(this);
	
	this.on("init",this.updateTitle);
	this.on("show",this.update);

})();
