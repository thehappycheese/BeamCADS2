///* ../CalcDiv.js
if(calc===undefined) var calc = {};

calc.kuo = new (function(){
	CalcDiv.call(this); // Extends calcdiv
	
	
	this.updateTitle = function(){
		var kuo = b.kuo;
		
		var addendum = "";
		this.topdiv.style.backgroundColor = ""
		if(kuo>0.36){
			addendum = '<span style="color:red"> &gt;0.36 beam is over-reinforced (See AS3600 8.1.5)</span>';
			this.topdiv.style.backgroundColor = "yellow";
			console.log(this.topdiv);
		}
		if(kuo<0.1){
			addendum = '<span style="color:red"> &lt;0.1 beam might be under-reinforced (See AS3600 8.1.5)</span>';
			this.topdiv.style.backgroundColor = "yellow";
		}
		
		this.title = '<a href="#help_bar_kuo"> k<sub>uo</sub></a> = '+b.kuo.toFixed(3)+addendum;
		
	}.bind(this);
	
	this.update = function(){
	
		var b_kuo = b.kuo
		this.content = "";
		this.addParagraph("$$k_{uo} = \\frac{d_n}{d_o}$$");
		this.addParagraph("Where:");
		this.addParagraph("$$d_o =\\href{#help_bar_do}{\\text{Depth to lowest reo layer from top surface}} = "+b.d0.toFixed(0)+"$$");
		this.addParagraph("$$d_n =\\href{#help_bar_dn}{\\text{Depth to Neutral Axis}} = "+b.dn.toFixed(0)+"$$");
		
		this.addParagraph("Thus:");
		this.addParagraph("$$k_{uo} = "+b_kuo.toFixed(3)+"$$");
		
		
		// TODO: verify!
		if(b_kuo<0.1 || b_kuo>0.36){
			this.addParagraph('<div class="calcerror">ERROR! $$$k_uo$$$ should be more than ~0.1 and less than 0.36 (Except for in special conditions.) - See AS3600 8.1.5.</div>');
			this.addParagraph('<div class="calcerror">To fix this you must change the depth of the beam or add / remove reinforcment</div>');
		}else{
			this.addParagraph("Within limits: $$$k_{uo}$$$ should be more than ~0.1 and less than 0.36 (Except for in special conditions.) - See AS3600 8.1.5.");
		}
		
		
		this.updateMathJax();
	}.bind(this);
	
	this.on("init",this.updateTitle);
	this.on("show",this.update);

})();
