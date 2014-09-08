///* ../CalcDiv.js
if(calc===undefined) var calc = {};

calc.Muo = new (function(){
	CalcDiv.call(this); // Extends calcdiv
	
	
	this.updateTitle = function(){
		var Muo_min = b.Muo_min;
		var Muo = b.Muo;
		
		var addendum = "";
		this.topdiv.style.backgroundColor = "";
		if(Muo<Muo_min){
			addendum = '<span style="color:red"> &lt; <a href="#help_bar_Muomin">(M<sub>uo</sub>)<sub>min</sub></a>  (= '+Muo_min.toFixed(0)+' kNm) (See AS3600 8.1.6 Minimum Capacity)</span>';
			this.topdiv.style.backgroundColor = "yellow";
		}
		
		this.title = '<a href="#help_bar_Muo"> M<sub>uo</sub></a> = '+Muo.toFixed(0)+' kNm'+addendum;
		
	}.bind(this);
	
	this.update = function(){
		
		this.content = "";
		
		
		
		
		
		
		
		
		
		
		// TODO: this is bad!... wait... no it isnt really so bad...
		b_dn = b.dn;
		
		var vallines = []
		vallines.push("C_c &= -"+(b.alpha2*b.fc*b.b*b.gamma/1000).toFixed(2)+"\\color{green}{d_n}"+" &{}&="+b.Cc_from_dn(b_dn).toFixed(1)+" ~kN");
		
		var dilines = ["\\frac{\\gamma \\color{green}{d_n}}{2} &= "+(b.gamma*b_dn*0.5).toFixed(0)+"mm"];
		
		var sumlines = [b.Cc_from_dn(b_dn).toFixed(1)+"kN \\times&"+(b.gamma*b_dn*0.5/1000).toFixed(3)+"m & {}&="+(b.Cc_from_dn(b_dn)*b.gamma*b_dn*0.5/1000).toFixed(0)+"~kNm"];
		
		
		///// LOOP THROUGH REO LAYERS  ///////
		// d_n - T_s & C_s ================================
		for(var i = b.reo.length-1;i>=0;i--){
		
			
			dilines.push("d_{"+i+"} &= "+b.reo[i].depth.toFixed(0)+" mm");
			var layer_strain = b.layer_strain_from_layer_dn(b.reo[i],b_dn,true);
			var layer_force = b.layer_force_from_layer_dn(b.reo[i],b_dn);
			
			sumlines.push(layer_force.toFixed(1)+"kN \\times& "+(b.reo[i].depth/1000).toFixed(3)+"m &{}&= "+(layer_force*b.reo[i].depth/1000).toFixed(1)+"~kNm");
			
			
			////////////// Figure out in advance if the strain value is negative or positive
			
			var neg = 1;
			if(layer_strain<=0){
				// COMPRESSIVE LAYER
				neg = -1;
			}else{
				// TENSILE LAYER
				neg = 1;
			}
			
			//////////// FIND STRAIN components for fancy equations
			
			var layer_esi_real = 0;
			var layer_esi_dn = 0;
			if( Math.abs(layer_strain)>=0.0025){
				// yielded
				layer_esi_dn = 0;
				layer_esi_real = neg*0.0025;
			}else{
				// elastic
				layer_esi_dn = 0.003*b.reo[i].depth;
				layer_esi_real = -0.003;
				
			}
			
			////////////// Develop equations for Ts and Tc for each layer:
			
			if(layer_strain<=0){
				// COMPRESSIVE LAYER
				if(Math.abs(layer_strain)>=0.0025){
					// yielded
					vallines.push("C_{s"+i+"} &= "+(b.Es*b.reo[i].area*layer_esi_real/1000).toFixed(0)+"&{} &="+layer_force.toFixed(1)+"~kN");
				}else{
					// elastic
					vallines.push("C_{s"+i+"} &= {"+(b.Es*b.reo[i].area*layer_esi_dn/1000).toFixed(0)+"} /{\\color{green}{d_n}} "+(b.Es*b.reo[i].area*layer_esi_real/1000).toFixed(0)+"&{} &= "+layer_force.toFixed(1)+" ~kN");
				}
			}else{
				// TENSILE LAYER
				if(Math.abs(layer_strain)>=0.0025){
					// yielded
					vallines.push("T_{s"+i+"} &= "+(b.Es*b.reo[i].area*layer_esi_real/1000).toFixed(0)+"& {}&="+layer_force.toFixed(1)+" ~kN");
				}else{
					// elastic
					vallines.push("T_{s"+i+"} &= {"+(b.Es*b.reo[i].area*layer_esi_dn/1000).toFixed(0)+"} /{\\color{green}{d_n}} "+(b.Es*b.reo[i].area*layer_esi_real/1000).toFixed(0)+"& {} &="+layer_force.toFixed(1)+"~kN");
				}
			}
		}
		
		
		
		
		
		
		
		
		
		
		
		this.addParagraph("$$$M_{uo}$$$ is found by the sum of moments of internal forces at ultimate loading.<br>This software uses the top surface of the beam as the 'fulcrum point' about which moments are calculated.");
		
		this.addParagraph(
						"$$M_{uo} = \\sum M_{\\text{at top surface}} = C_c \\frac{\\gamma d_n}{2} + C_{si}d_i + T_{si}d_i\\\\~\\\\~\\\\"+
						"\\begin{aligned}"+
						"Where~~ C_c =& \\href{#help_bar_Cc}{\\text{Compression in Concrete}} \\\\"+
						"		 C_{si} =& \\href{#help_bar_Cs}{\\text{Compression in steel layer i}} \\\\"+
						"		 T_{si} =& \\href{#help_bar_Ts}{\\text{Tension in steel layer i}} \\\\"+
						"d_i =& \\text{Depth from top of beam}\\\\ & \\text{to centroid of steel layer i} \\\\"+
						"\\end{aligned}$$"
		);
		
		this.addParagraph("To find these values, substitute $$$\\color{green}{d_n = "+b_dn.toFixed(0)+" mm}$$$ back into the equations developed in the calculations above:");
		
		this.addParagraph("$$\\begin{aligned}"+vallines.join("\\\\")+"\\end{aligned}$$");
		
		
		this.addParagraph("And:");
		this.addParagraph("$$\\begin{aligned}"+dilines.join("\\\\")+"\\end{aligned}$$");
		
		
		this.addParagraph("Finally, substitute back into $$$\\sum M_x$$$ equation above:");
		this.addParagraph(
			"$$\\begin{aligned}"+
				"\\bf{Force} \\times& \\bf{d_i} &{} &= \\bf{Moment}\\\\"
				+sumlines.join("\\\\")+"\\\\"+
				"{}&{}&\\sum {}&=\\overline{\\underline{"+b.Muo.toFixed(0)+"~kNm}} = M_{uo}"+
			"\\end{aligned}$$");
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		this.updateMathJax();
	}.bind(this);
	
	this.on("init",this.updateTitle);
	this.on("show",this.update);

})();
