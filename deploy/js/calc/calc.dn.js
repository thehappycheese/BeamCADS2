///* ../CalcDiv.js


if(calc===undefined) var calc = {};

calc.dn = new (function(){
	CalcDiv.call(this); // Extends calcdiv
	
	
	this.updateTitle = function(){
		this.title = '<a href="#help_bar_dn">d<sub>n</sub></a> = '+b.dn.toFixed(0)+' mm';
	}.bind(this);
	
	this.update = function(){
		
		
		this.updateTitle();
		this.content = "";
		
		this.addParagraph(
			"Depth to neutral axis ($$$\\href{#help_bar_dn}{d_n}$$$) is calculated by the 'Rectangular Stress Block' Method (See the diagram above). This involves solving the internal horizontal forces in the beam at ultimate loading:"
		);
		
		
		this.addParagraph(
						"$$\\sum F_x = C_c + C_s + T_s = 0\\\\~\\\\~\\\\"+
						"\\begin{aligned}"+
						"Where~~ C_c &= \\href{#help_bar_Cc}{\\text{Compression in Concrete}}	& {} &= \\alpha_2f'_c \\times (b)(\\gamma \\color{green}{d_n}) \\\\"+
						"		 C_s &= \\href{#help_bar_Cs}{\\text{Compression in Steel}}			& {} &= E_s \\sum(\\color{brown}{\\epsilon_{s i}} A_{s i}) \\\\"+
						"		 T_s &= \\href{#help_bar_Ts}{\\text{Tension in Steel}}				& {} &= E_s \\sum(\\color{brown}{\\epsilon_{s i}} A_{s i})\\\\"+
						"		\\\\"+
						"b &= \\href{#help_bar_b}{\\text{Breadth of beam}} & {} &= "+b.b+"mm\\\\"+
						"{A_{s i}} &= \\href{#help_bar_As}{\\text{Area of reo in layer i}}\\\\"+
						"\\color{brown}{\\epsilon_{s i}} &= \\href{#help_bar_epsilonsi}{\\text{Strain in reo layer i}} & {} &= 0.003 ({{d_i}/\\color{green}{d_n}} - 1)\\\\"+
						"&Where~~~&  &-\\epsilon_{sy}\\le \\color{brown}{\\epsilon_{s i}} \\le \\epsilon_{sy}\\\\"+
						"\\epsilon_{s y} &= \\href{#help_bar_epsilonsy}{\\text{Steel Yeild Strain}} & {} &= 0.0025 \\\\"+
						"\\epsilon_{c max} &= \\href{#help_bar_epsiloncmax}{\\text{Highest allowable strain in Concrete}} & {} &= 0.003 \\\\"+
						"E_s &= \\href{#help_bar_Es}{\\text{Young's Modulus of Steel}} & {} &= 200000MPa"+
						"\\end{aligned}$$"
		);
		
		this.addParagraph("At this point, there are 3 unknowns:");
		
		this.addParagraph(
			"<ol>"+
				"<li>$$$ \\color{green}{d_n} $$$</li>"+
				"<li>Which layers are in tension and which are in compression?</li>"+
				"<li>Which steel layers are yeilded/elastic?</li>"+
			"</ol>"
		);
		
		this.addParagraph('You need to make assumptions for 2 & 3. <b>This software solves this problem by brute force guess-and check. The strain diagram above shows which layers are in tension/compression and yeilded/elastic</b>');
		
		
		// TODO: this is naughty :O
		b_dn = b.dn;
		
		
		// TODO: add units to all calcs

		
		
		
		
		
		// Create some temporary arrays to hold the next few lines of calcs
		
		var symlines = [] 
		symlines.push("C_c &= (\\alpha_2 f_c)(b \\times \\gamma \\color{green}{d_n})")
		
		var numlines = []
		numlines.push("C_c &= ("+b.alpha2.toFixed(2)+"\\times"+b.fc.toFixed(0)+")("+b.b.toFixed(0)+"\\times"+b.gamma.toFixed(2)+"  \\color{green}{d_n})"+" &&N");
		
		var vallines = []
		vallines.push("C_c &= -"+(b.alpha2*b.fc*b.b*b.gamma/1000).toFixed(2)+"\\color{green}{d_n}"+" &kN");
		
		
		var esilines = [];
		
		var finallines = [{dn:1,val:-b.alpha2*b.fc*b.b*b.gamma}];
		
		
		
		///// LOOP THROUGH REO LAYERS  ///////
		// d_n - T_s & C_s ================================
		for(var i = b.reo.length-1;i>=0;i--){
			// IS THIS LAYER YEILDED?
			
			var layer_strain = b.layer_strain_from_layer_dn(b.reo[i],b_dn,true);
			
			
			////////////// Figure out in advance if the strain value is negative or positive
			
			var neg = "";
			if(layer_strain<=0){
				// COMPRESSIVE LAYER
				neg = "-";
			}else{
				// TENSILE LAYER
				neg = "";
			}
			
			//////////// Develope equations for esi for each layer
			
			var layer_esi = null;
			var layer_esi_real = 0;
			var layer_esi_dn = 0;
			if( Math.abs(layer_strain)>=0.0025){
				// layer is yeilded
				esilines.push("\\epsilon_{s"+i+"} &= yielded &  {} &= "+neg+"0.0025");
				layer_esi = neg+"0.0025";
				
				layer_esi_dn = 0;
				layer_esi_real = parseFloat(layer_esi);
				
				
			}else{
				esilines.push("\\epsilon_{s"+i+"} &= elastic &  {} &= 0.003( "+b.reo[i].depth.toFixed(0)+" / {\\color{green}{d_n}} - 1)");
				layer_esi = "0.003( "+b.reo[i].depth.toFixed(0)+" / {\\color{green}{d_n}} - 1)";
				
				layer_esi_dn = 0.003*b.reo[i].depth;
				layer_esi_real = -0.003;
				
			}
			
			////////////// Develop equations for Ts and Tc for each layer:
			
			if(layer_strain<=0){
				// COMPRESSIVE LAYER
				symlines.push("C_{s"+i+"} &= E_s \\times ([\\epsilon_{s"+i+"}] \\times A_{s"+i+"})");
				numlines.push("C_{s"+i+"} &= "+b.Es+" \\times (["+layer_esi+"] &\\times "+b.reo[i].area.toFixed(0)+") &N");
				
				if(layer_esi_dn!==0){
					vallines.push("C_{s"+i+"} &= {"+(b.Es*b.reo[i].area*layer_esi_dn/1000).toFixed(0)+"} /{\\color{green}{d_n}} "+(b.Es*b.reo[i].area*layer_esi_real/1000).toFixed(0)+" &kN");
					
					finallines.push({dn:-1,val:b.Es*b.reo[i].area*layer_esi_dn})
					finallines.push({dn:0,val:b.Es*b.reo[i].area*layer_esi_real});
					
				}else{
					vallines.push("C_{s"+i+"} &= "+(b.Es*b.reo[i].area*layer_esi_real/1000).toFixed(0)+" &kN");
					finallines.push({dn:0,val:(b.Es*b.reo[i].area*layer_esi_real)})
				}
			}else{
				// TENSILE LAYER
				// symbolic
				symlines.push("T_{s"+i+"} &= E_s \\times ([\\epsilon_{s"+i+"}] \\times A_{s"+i+"})");
				// numeric
				numlines.push("T_{s"+i+"} &= "+b.Es+" \\times (["+layer_esi+"] &\\times "+b.reo[i].area.toFixed(0)+") &N");
				
				if(layer_esi_dn!==0){
					vallines.push("T_{s"+i+"} &= {"+(b.Es*b.reo[i].area*layer_esi_dn/1000).toFixed(0)+"} /{\\color{green}{d_n}} "+(b.Es*b.reo[i].area*layer_esi_real/1000).toFixed(0)+" &kN");
					finallines.push({dn:-1,val:b.Es*b.reo[i].area*layer_esi_dn})
					finallines.push({dn:0,val:b.Es*b.reo[i].area*layer_esi_real});
				}else{
					vallines.push("T_{s"+i+"} &= "+(b.Es*b.reo[i].area*layer_esi_real/1000).toFixed(0)+" &kN");
					finallines.push({dn:0,val:(b.Es*b.reo[i].area*layer_esi_real)})
				}
			}
		}
		
		
		
		
		



		
		// process final lines:
		//first, lets sort based on dn
		finallines.sort(function(a,b){return a.dn-b.dn;});
		
		var quadratic = [0,0,0];
		for(var i = 0;i<finallines.length;i++){
			line = finallines[i];
			if(finallines[0].dn<0){
				quadratic[line.dn+1]+=line.val;
			}else{
				quadratic[line.dn]+=line.val;
			}
		}
		console.log(finallines)
		console.log(quadratic)
		
		var finalline = []
		if(quadratic[2]!==0){
			finalline.push("("+(quadratic[2]/1000).toFixed(2)+"){\\color{green}{d^2_n}}");
		}
		if(quadratic[1]!==0){
			finalline.push("("+(quadratic[1]/1000).toFixed(2)+"){\\color{green}{d_n}}");
		}
		
		if(quadratic[0]!==0){
			finalline.push("("+(quadratic[0]/1000).toFixed(2)+")");
		}
		
		
		

		
		
		
		this.addParagraph("Here are our strains: (note that yielded layers are at $$$\\epsilon_{sy}$$$)");
		this.addParagraph("$$\\begin{aligned}"+esilines.join("\\\\")+"\\end{aligned}$$");
		
		
		
		this.addParagraph("And our full equations:");
		this.addParagraph("$$\\begin{aligned}"+symlines.join("\\\\")+"\\end{aligned}$$");
		
		this.addParagraph("Substituting in all the known values:");
		this.addParagraph("$$\\begin{aligned}"+numlines.join("\\\\")+"\\end{aligned}$$");
		
		this.addParagraph("Simplifing:");
		this.addParagraph("$$\\begin{aligned}"+vallines.join("\\\\")+"\\end{aligned}$$");
		
		
		this.addParagraph("Now resubstitute back into the following equation and solve for $$$\\color{green}{d_n}$$$!");
		
		
		
		
		this.addParagraph(
			"$$\\begin{aligned}"+
			"\\sum F_x &= C_c + C_s + T_s = 0 \\\\"+
			((finallines[0].dn<0)?"\\color{green}{d_n} \\times":"")+" \\sum F_x &= "+finalline.join(" + ")+" = 0\\\\"+
			"\\color{green}{d_n} &= "+b_dn.toFixed(0)+"mm"+
			"\\end{aligned}$$"
		);
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		this.updateMathJax();
	}.bind(this);
	
	this.on("init",this.updateTitle);
	this.on("show",this.update);

})();
