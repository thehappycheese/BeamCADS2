
///* calc/calc.js

var calcs = {};
function outputCalculations(){
	var calculationdiv = document.querySelector("#calcdiv-content");
	calculationdiv.innerHTML = "";
	
	
	
	var b_dn= b.dn;
	
	
	
	
	
	
	// ALPHA 2 and GAMMA;///////////////////////////////
	calc.alpha2.update();
	calc.alpha2.appendTo(calculationdiv)
	
	calc.dn.update();
	calc.dn.appendTo(calculationdiv);
	
	
	
	
	
	
	//d ///////////////////////////////
	
	calcs.d = calcs.d || new CalcDiv();
	calcs.d.title = "$$$d ~~=~~ "+b.d.toFixed(0)+"~ mm $$$";
	calcs.d.content = "";
	calcs.d.addParagraph("d is the depth to the <b>centroid of the tension steel</b> from the upper surface of the beam.")
	//calcs.d.addParagraph("d is found by: (sum of (tension steel layer depth)*(tension steel layer area)) divide by (sum of(tension steel layer area))");
	calcs.d.addParagraph("$$ \\sum{d_i \\times A_{st i}}\\over\\sum{A_{st i}} $$");
	calcs.d.addParagraph("<b>Note:</b> The 'top' reo layer may or may not be in tension! <i>Be sure to check that you assume correctly in hand calculations</i>. (Once you have calculated Depth to Neutral Axis (dn), all layers below dn are in tension.)")
	
	var sum_dast_sym = "";
	var sum_dast_val = "";
	var sum_dast_res = 0;
	
	var sum_ast_sym = "";
	var sum_ast_val = "";
	var sum_ast_res = 0;
	var discluded_layers = [];
	
	for(var i = 0;i<b.reo.length;i++){
		
		if(b.layer_strain_from_layer_dn(b.reo[i],b_dn)<=0){
			discluded_layers.push(i);
			continue;
		}
		
		sum_dast_sym += "d_"+i+" "+"A_{st "+i+"}";
		sum_dast_val += b.reo[i].depth.toFixed(0)+" \\times "+b.reo[i].area.toFixed(0);
		sum_dast_res +=b.reo[i].depth*b.reo[i].area

		sum_ast_sym += "A_{st "+i+"}";
		sum_ast_val += b.reo[i].area+"";
		sum_ast_res += b.reo[i].area;
		
		if(i!=b.reo.length-1){
			sum_dast_sym+="~+~";
			sum_dast_val+="~+~";
			sum_ast_sym+="~+~";
			sum_ast_val+="~+~";
		}
	}
	calcs.d.addParagraph("$$\\begin{aligned} d &= {{"+sum_dast_sym+"}\\over{"+sum_ast_sym+"}} \\\\ &= {{"+sum_dast_val+"}\\over{"+sum_ast_val+"}}\\\\ &= {{"+(sum_dast_res/sum_ast_res).toFixed(0)+"}}mm\\end{aligned}$$")
	if(discluded_layers.length){
		calcs.d.addParagraph("<b>Note:</b> layers  <b>"+discluded_layers.join(", ")+"</b> are compressive and have been excluded.");
	}
	calcs.d.appendTo(calculationdiv);
	
	
	// DN; =============================================
	calcs.dn = calcs.dn || new CalcDiv();
	calcs.dn.appendTo(calculationdiv);
	calcs.dn.title = "$$$d_n ~~=~~ "+b.dn.toFixed(0)+"~ mm $$$";
	calcs.dn.content = "";
	// TODO simplify this shiz
	calcs.dn.addParagraph("Depth to neutral axis ($$$d_n$$$) is calculated by the 'Rectangular Stress Block' Method. This involves solving the internal horizontal forces in the beam:")
	calcs.dn.addParagraph("$$\\sum F_x = C_c + C_s + (-T_s) = 0$$");//TODO: check sign convention
	calcs.dn.addParagraph("Where...");
	calcs.dn.addParagraph("$$\\begin{aligned} C_{concrete} &= \\alpha_2 f'_c \\times (b)(\\gamma d_n) \\\\ "+
							"T_{steel} &= E_s \\sum(\\epsilon_{s i} A_{s i}) &\\text{for tensile steel layers}\\\\"+
							"C_{steel} &= E_s \\sum(\\epsilon_{s i} A_{s i}) &\\text{for compressive steel layers}\\end{aligned}$$");
		
		calcs.howtoknowtension = calcs.howtoknowtension || new CalcDiv(); // Create
		calcs.howtoknowtension.appendTo(calcs.dn.contentdiv);// Append
		calcs.howtoknowtension.title = "How to tell if a layer is in tension/compression?"
		calcs.howtoknowtension.addParagraph("When a beam has multiple layers of reinforcement, it is sometimes unclear which layers are in tension or compression. The only way to know is to 'guess and check' which layers are in tension/compression.")
		calcs.howtoknowtension.addParagraph("If you get the guess wrong, the sum of horizontal forces equation below will have non-nonsensical or no solutions. This is because a force balance does not exist for an incorrect guess.")
		calcs.howtoknowtension.addParagraph("This software finds d_n by the same force equilibrium equation but uses a blind guess and check 'bisection' solver to find the root of  $$$F_x(d_n) = 0$$$.")
		
	calcs.dn.addParagraph("Where...");
		// d_n - epsilon_si ====================================
		calcs.esi = calcs.esi || new CalcDiv(); // Create
		calcs.esi.content = "";
		calcs.esi.appendTo(calcs.dn.contentdiv);// Append
		calcs.esi.title = "$$$\\epsilon_{si} = 0.003 ({{d_i}/{d_n}} - 1)$$$";
		calcs.esi.addParagraph("$$$\\epsilon_{si}$$$ is the strain of each layer of steel.");
		calcs.esi.addParagraph("It is calculated by similar triangles from the following diagram.");
	calcs.dn.addParagraph("$$$A_{si}$$$ =  the sectional area of each layer of steel ($$$mm^2$$$)");
	calcs.dn.addParagraph("$$$E_{si}$$$ =  the young's modulus of the steel (200,000 MPa)");
	calcs.dn.addParagraph("For this beam, the full equations are as follows:")
	
	// d_n - C_c =========================================
	
	
	
	// TODO: add units to all calcs
	var T_s = [];
	var C_s = [];
	
	var T_s_sym = [];
	var C_s_sym = [];
	
	var T_s_simp = [];
	var C_s_simp = [];
	
	// d_n - T_s & C_s ================================
	for(var i = 0;i<b.reo.length;i++){
		
		if(b.layer_strain_from_layer_dn(b.reo[i],b_dn)<=0){
			// compression
			// numeric
			var e_si = "0.003("+b.reo[i].depth.toFixed(0)+"/{d_n} - 1)";
			C_s.push("["+e_si+"]\\times"+b.reo[i].area.toFixed(0))
			// symbolic
			var e_si = "0.003(d_{"+i+"}+/{d_n} - 1)";
			C_s_sym.push("["+e_si+"]\\times A_{s"+i+"}")
		}else{
			// tension
			// numeric
			var e_si = "0.003("+b.reo[i].depth.toFixed(0)+"/{d_n} - 1)";
			T_s.push("["+e_si+"]\\times"+b.reo[i].area.toFixed(0))
			// symbolic
			var e_si = "0.003(d_{"+i+"}/{d_n} - 1)";
			T_s_sym.push("["+e_si+"]\\times A_{s"+i+"}")
		}

		
		
	}
	// Lets create a symbolic representation first:
	var fe = [] // create a temporary array to hold the next few lines of calcs
	fe.push("C_c &= (\\alpha_2 f_c)(b \\times \\gamma d_n)")
	fe.push("T_s &= E_s \\times ("+((T_s_sym.length>0)?T_s_sym.join("+"):"0")+")")
	fe.push("C_s &= E_s \\times ("+((C_s_sym.length>0)?C_s_sym.join("+"):"0")+")")
	calcs.dn.addParagraph("$$\\begin{aligned}"+fe.join("\\\\")+"\\end{aligned}$$");
	
		
	
	calcs.dn.addParagraph("Substituting in all the known values:");
	
	// now lets do the numeric representation:
	var fe = [] // create a temporary array to hold the next few lines of calcs
	fe.push("C_c &= ("+b.alpha2.toFixed(2)+"\\times"+b.fc.toFixed(0)+")("+b.b.toFixed(0)+"\\times"+b.gamma.toFixed(2)+" d_n"+")")
	fe.push("T_s &= "+b.Es+" \\times ("+((T_s.length>0)?T_s.join("+"):"0")+")")
	fe.push("C_s &= "+b.Es+" \\times ("+((C_s.length>0)?C_s.join("+"):"0")+")")
	calcs.dn.addParagraph("$$\\begin{aligned}"+fe.join("\\\\")+"\\end{aligned}$$");
	
	calcs.dn.addParagraph("These equations are now all in terms of $$$d_n$$$. This software can't simplify them for you, but they should end up as some kind of quadratic equation when subsituted back into");
	calcs.dn.addParagraph("$$\\sum F_x = C_c + C_s + (-T_s) = 0$$"); //TODO: check sign convention
		
	
	
	// M_uo //////////////////////////////////
	calcs.Muo = calcs.Muo || new CalcDiv(); // Create
	calcs.Muo.appendTo(calculationdiv);// Append
	calcs.Muo.title = "$$$M_{uo} ~~=~~ "+b.Muo.toFixed(1)+" ~kNm $$$";
	calcs.Muo.addParagraph("");
	// TODO: finish Muo calculations
	calcs.Muo.addParagraph("");
	
	
	// k_uo //////////////////////////////////
	calcs.kuo = calcs.kuo || new CalcDiv(); // Create
	calcs.kuo.appendTo(calculationdiv);// Append
	calcs.kuo.title = "$$$k_{uo} ~~=~~ "+""+" $$$";
	// TODO: finish kuo calculation
	calcs.kuo.addParagraph("");
	calcs.kuo.addParagraph("");
	
	// phi //////////////////////////////////
	calcs.phi = calcs.phi || new CalcDiv(); // Create
	calcs.phi.appendTo(calculationdiv);// Append
	// TODO: finish phi calculation
	calcs.phi.title = "$$$\\Phi ~~=~~ "+""+"$$$";
	calcs.phi.addParagraph("");
	calcs.phi.addParagraph("");
	
	calcs.capacity = calcs.capacity || new CalcDiv(); // Create
	calcs.capacity.appendTo(calculationdiv);// Append
	// TODO: finish capacity calculation
	calcs.capacity.title = "$$$\\Phi M_{uo} ~~=~~ "+""+" ~kNm$$$ (Capacity)";
	calcs.capacity.addParagraph("");
	calcs.capacity.addParagraph("");
	
	
	MathJax.Hub.Queue(["Typeset",MathJax.Hub,calculationdiv]);
	return;
}