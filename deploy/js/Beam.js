

function Beam(){
	"use strict";
	this.create = function(){
		
		// #########################################################
		// Misc considerations
		this.eclass 			= "A1";
		this.minbarspacing		= undefined;
		
		
		// #########################################################
		// Reinforcement considerations
		this.reo = [
			{number:2, diameter:10, area:156, depth:25+10+10/2		},
			{number:2, diameter:10, area:200, depth:600-25-10-10/2	},
		];
		this.df		= 10;
		
		
		// #########################################################
		// Geometric considerations
		this.b		= 300;
		this.D		= 600;
		this.cover	= 25;
		this.Ln		= 3000;
		
		
		// #########################################################
		// Material considerations
		this.fc		= 32;
		this.Ec		= undefined;
		this.epsiloncmax = 0.003;// TODO: getcorrect code ref. AS3600 8.1.3??
		this.rhoc	= 2400;
		// AS4671 500MPa Steel && AS3600
		this.fsy = 500;// Steel characteristic yield stress: MPa
		// AS3600 3.2.2 taken to be (or determined by test)
		// TODO: add Es to variable inputs (commit with35mins)
		this.Es = 200000;// Steel Young's modulus of elasticity: MPa
		this.epsilonsy = this.fsy/this.Es; // 0.0025 or there-abouts
		
	}.bind(this);


	// #############################################################################
	// ### CODE COMPLIANCE CHECKERS HELPER FUNCTIONS ###############################
	// #############################################################################	
	
	// TODO: is_deep_beam ?
	
	// #############################################################################
	// ### SERVICEABILITY LIMITS ###################################################
	// #############################################################################	
	
	
	// TODO:
	
	
	// #############################################################################
	// ### GEOMETRIC HELPER FUNCTIONS ##############################################
	// #############################################################################
	
	Object.defineProperty(this,"innerWidth",{
		get:function innerWidth(){
			return this.b - 2*(this.cover+this.df);
		}.bind(this)}
	);
	
	
	
	
	
	this.get_tension_reo = function(){
		console.warn("check this function before use")
		var result = [];
		var dn = this.dn ;
		for(var i = 0; i < this.reo.length;i++){
			if(this.layer_strain_from_layer_dn(this.reo[i], dn)>0){
				result.push(this.reo[i]);
			}
		}
		return result;
	}.bind(this);
	
	this.get_compression_reo = function(){
		console.warn("check this function before use")
		var result = [];
		var dn = this.dn ;
		for(var i = 0; i < this.reo.length;i++){
			if(this.layer_strain_from_layer_dn(this.reo[i], dn)<0){
				result.push(this.reo[i]);
			}
		}
		return result;
	}.bind(this);
	
	
	// #############################################################################
	// ### HIGH LEVEL CAPACITY FUNCTIONS ###########################################
	// #############################################################################
	
	// TODO: WHY IS THIS WRONG:(It is very concerning!)
	Object.defineProperty(this,"MuoWRONG",{
		get:function Muo(){
			var dn		= this.dn;
			var cc		= this.Cc_from_dn(dn);
			var ccd		= this.Cc_centroid_depth_from_dn(dn);
			var ts		= this.Ts_from_dn(dn);
			var tsd		= this.Ts_centroid_depth_from_dn(dn);
			var cs		= this.Cs_from_dn(dn);
			var csd		= this.Cs_centroid_depth_from_dn(dn);
			
			return (cc*ccd + ts*tsd + (cs*csd || 0)) / 1000; //kNm
		}.bind(this)}
	);
	
	Object.defineProperty(this,"Muo",{
		get:function Muo(){
			var dn		= this.dn;
			
			var result = this.Cc_from_dn(dn)*this.Cc_centroid_depth_from_dn(dn);
			
			for(var i = 0;i<this.reo.length;i++){
				result += this.layer_force_from_layer_dn(this.reo[i],dn) * this.reo[i].depth;
			}
			
			return result / 1000; //kNm
		}.bind(this)}
	);
	
	
	Object.defineProperty(this,"kuo",{
		get:function kuo(){
			return this.dn/this.d0; // ratio
		}.bind(this)}
	);
	Object.defineProperty(this,"ku",{
		get:function kuo(){
			var dn = this.dn;
			return dn/this.Ts_centroid_depth_from_dn(dn); // ratio
		}.bind(this)}
	);
	
	Object.defineProperty(this,"phi",{
		get:function phi(){
			// TODO - FOR N CLASS MEMBERS ONLY!
			return Math.max(0.6,Math.min(0.8,1.19-13/12*this.kuo)); // ratio
		}.bind(this)}
	);
	Object.defineProperty(this,"phiMuo",{
		get:function phiMuo(){
			// TODO - FOR N CLASS MEMBERS ONLY!
			return this.phi*this.Muo; // ratio
		}.bind(this)}
	);
	
	
	Object.defineProperty(this,"d0",{
		get:function d0(){
			var d0 = -Infinity;
			for(var i = 0;i<this.reo.length;i++){
				if(this.reo[i].depth>d0){
					d0=this.reo[i].depth;
				}
			}
			return d0; //mm
		}.bind(this)}
	);
	
	
	// AS3600 8.1.6.1(1)
	Object.defineProperty(this,"Muo_min",{
		get:function Muo_min(){
			// no prestress only.
			return 1.2*this.Ze*this.fctf/1000000; //mm^3*MPa => Nmm /1000/1000 => kNm
		}.bind(this)}
	);
	// AS3600 8.1.6.1(2)
	Object.defineProperty(this,"Muo_min_Ast_min",{
		get:function(){
			// rect sections only
			// TODO: fix this probalem:
			//console.warn("Check this function before use. 'd' may be wrong here. Using Ts_centroid_depth instead");
			return 0.2*Math.pow(  this.D/this.Ts_centroid_depth   ,2)*this.fctf/this.fsy*this.b*this.Ts_centroid_depth;
		}.bind(this)}
	);
	// TODO: create a proper getter for d, ku and kuo

	
	Object.defineProperty(this,"dn",{
		get:function(){
			// TODO: make a beam flag to determine whether compression steel is considered in this calculation.
			// TODO: make a check to see that reo that is too small is never fed into this beam calculator
			var dn;
			var top = this.D;
			var bot = 0;
			var diff;
			var cnt = 0;
			do{
				dn = (top+bot)/2;
				diff = this.Ts_from_dn(dn)+this.Cs_from_dn(dn)+this.Cc_from_dn(dn);
				if(diff>0){
					bot = dn;
				}else{
					top = dn;
				}
				cnt++
			}while(Math.abs(diff) > 0.05 && cnt<50);

			return dn;
		}.bind(this)
	});
	
	
	
	
	// #############################################################################
	// ### GET TOTAL FORCES ########################################################
	// #############################################################################
	
	Object.defineProperty(this,"Ts",{get:function(){
		return this.Ts_from_dn(this.dn);
	}.bind(this)});
	Object.defineProperty(this,"Cs",{get:function(){
		return this.Cs_from_dn(this.dn);
	}.bind(this)});
	Object.defineProperty(this,"Cc",{get:function(){
		return this.Cc_from_dn(this.dn);
	}.bind(this)});
	
	
	this.Ts_from_dn = function(dn){
		return this.Fs_from_dn_tension(dn,true);
	}.bind(this);
	this.Cs_from_dn = function(dn){
		return this.Fs_from_dn_tension(dn,false);
	}.bind(this);
	this.Cc_from_dn = function(dn){
		return -(this.b*dn*this.gamma) * (this.fc*this.alpha2)/1000; // kN
	}.bind(this);
	
	
	this.Fs_from_dn_tension = function(dn, returntension){
		var result = 0;
		var epsilonsi;
		for(var i = 0;i<this.reo.length;i++){
			// First get strain in the steel layer according to similar triangles:
			epsilonsi = this.epsiloncmax/dn*(this.reo[i].depth - dn);
			// Limit the strain to a range of -0.0025 to 0.0025
			if(returntension){
				epsilonsi = Math.max(0, Math.min(epsilonsi, this.epsilonsy));
			}else{
				epsilonsi = Math.max(-this.epsilonsy, Math.min(epsilonsi, 0));
			}
			result += this.reo[i].area * this.Es * epsilonsi/1000; // kN
		}
		return result;
	}.bind(this);
	
	
	// #############################################################################
	// ### GET FORCE CENTROIDS #####################################################
	// #############################################################################
	
	
	// TODO: Which layers of steel should be disregarded? Surely steel 'close' to the centroid should be left out.
	Object.defineProperty(this,"Ts_centroid_depth",{get:function(){
		return this.Ts_centroid_depth_from_dn(this.dn);
	}.bind(this)});
	Object.defineProperty(this,"d",{get:function(){
		return this.Ts_centroid_depth_from_dn(this.dn);
	}.bind(this)});
	Object.defineProperty(this,"Cs_centroid_depth",{get:function(){
		return this.Cs_centroid_depth_from_dn(this.dn);
	}.bind(this)});
	Object.defineProperty(this,"Cc_centroid_depth",{get:function(){
		return this.Cc_centroid_depth_from_dn(this.dn)
	}.bind(this)});
	
	
	
	
	this.Ts_centroid_depth_from_dn = function(dn){
		return this.Fs_centroid_from_dn_tension(dn, true);
	}.bind(this);
	this.Cs_centroid_depth_from_dn = function(dn){
		return this.Fs_centroid_from_dn_tension(dn, false);
	}.bind(this);
	this.Cc_centroid_depth_from_dn = function(dn){
		return this.gamma * dn / 2;
	}.bind(this);
	
	
	this.Fs_centroid_from_dn_tension = function(dn, returntension){
		var epsilonsi;
		var sum_area = 0;
		var sum_area_times_depth = 0;
		for(var i = 0;i<this.reo.length;i++){
			// First get strain in the steel layer according to similar triangles:
			epsilonsi = this.layer_strain_from_layer_dn(this.reo[i], dn);
			// Then depending on if we are looking for tension or compression steel, get weighted average depth
			if(  (returntension && epsilonsi>0)  ||  (!returntension && epsilonsi<0)  ){
				sum_area += this.reo[i].area;
				sum_area_times_depth += this.reo[i].area * this.reo[i].depth;
			}
		}
		return sum_area_times_depth/sum_area || undefined;
	}.bind(this);
	
	
	
	
	// #############################################################################
	// ### GET INDIVIDUAL STEEL FORCES #############################################
	// #############################################################################
	
	this.strain_from_d_dn = function(d,dn){
		// First get strain at specified depth according to similar triangles:
		var epsilonsi = this.epsiloncmax/dn*(d - dn);
		return epsilonsi
	}.bind(this);
	
	
	
	this.layer_strain_from_layer_dn = function(layer,dn,uncapped){
		// First get strain in the steel layer according to similar triangles:
		var epsilonsi = this.strain_from_d_dn(layer.depth,dn);
		// Limit the strain to a range of -0.0025 to 0.0025
		// (The stress does not increase after yielding at fsy)
		if(!uncapped){
			epsilonsi = Math.max(-this.epsilonsy, Math.min(epsilonsi, this.epsilonsy));
		}
		
		return epsilonsi
	}.bind(this);
	
	
	this.layer_force_from_layer_dn = function(layer,dn){
		var layer_strain = this.layer_strain_from_layer_dn(layer,dn,false);
		return layer.area * this.Es * layer_strain / 1000; // kN
	}.bind(this);
	
	this.layer_force_from_layer_strain = function(layer,layer_strain){
		return layer.area * this.Es * Math.max(-this.epsilonsy,Math.min(this.epsilonsy,layer_strain))/1000; // kN
	}.bind(this);
	
	
	this.layer_yielded_from_layer_dn = function(layer,dn){
		var layer_strain = this.layer_strain_from_layer_dn(layer, dn);
		return layer_strain<=-0.0025 || layer_strain>=0.0025;
	}.bind(this);
	
	

	// #############################################################################
	// ### GET STEEL AREAS #########################################################
	// #############################################################################
	
	Object.defineProperty(this,"As",{get:function(){
		var sum = 0;
		for(i = 0;i<this.reo.length;i++){
			sum += this.reo[i].area;
		}
		return sum;
	}.bind(this)});
	
	
	Object.defineProperty(this,"Ast",{get:function(){
		return this.Ast_from_dn(this.dn);
	}.bind(this)});
	
	Object.defineProperty(this,"Asc",{get:function(){
		return this.Asc_from_dn(this.dn);
	}.bind(this)});
	Object.defineProperty(this,"Acc",{get:function(){
		return this.gamma*this.dn*this.b;
	}.bind(this)});
	
	
	this.Ast_from_dn = function(dn){
		return this.As_from_dn_tension(dn,true);
	}.bind(this);
	this.Asc_from_dn = function(dn){
		return this.As_from_dn_tension(dn,false);
	}.bind(this);
	
	this.As_from_dn_tension = function(dn, returntension){
		var epsilonsi;
		var sum_area = 0;
		for(var i = 0;i<this.reo.length;i++){
			// First get strain in the steel layer according to similar triangles:
			epsilonsi = this.epsiloncmax/dn*(this.reo[i].depth - dn);
			// Then depending on if we are looking for tension or compression steel, get weighted average depth
			if(  (returntension && epsilonsi>0)  ||  (!returntension && epsilonsi<0)  ){
				sum_area += this.reo[i].area;
			}
		}
		return sum_area || undefined;
	}.bind(this);
	
	
	// ########################################################################
	// #### MISC COEFICIENTS ##################################################
	// ########################################################################
	
	Object.defineProperty(this,"gamma",{get:function(){
		var r1 = 1.05-this.fc*0.007;
		var r2 = Math.max(0.67,Math.min(0.85,r1)) 
		return r2;
	}.bind(this)});
	
	
	Object.defineProperty(this,"alpha2",{get:function(){
		var r1 = 1-this.fc*0.003
		var r2 = Math.max(0.67,Math.min(0.85,r1));
		return r2;
	}.bind(this)});
	
	// TODO: note that this is only when no better info is avaliable.
	// TODO: sort
	Object.defineProperty(this,"fctf",{get:function(){
		return 0.6*Math.sqrt(this.fc);
	}.bind(this)});
	
	// TODO: Ensure technical correctness.
	Object.defineProperty(this,"k",{get:function(){
		var dn = this.dn;
		var dts = this.Ts_centroid_depth_from_dn(dn); 
		return dn/dts;
	}.bind(this)});
	
	
	// ########################################################################
	// #### SECTION PROPERTIES ################################################
	// ########################################################################
	Object.defineProperty(this,"Ze",{get:function(){
		// Rectangular section only
		return this.b*Math.pow(this.D,2)/6;
	}.bind(this)});
	
	Object.defineProperty(this,"Ixx",{get:function(){
		// Rectangular section only
		return this.b*Math.pow(this.D,3)/12;
	}.bind(this)});
	
	
	// STARTOFF: 4:35 14 04 14
	this.toString = function(){
		return JSON.stringify(this).replace(/,/g,",\n");
	}.bind(this);
	
	Object.defineProperty(this,"Ag",{get:function(){
		// Rectangular section only
		return this.b*this.D;
	}.bind(this)});
	
	// TODO: sort
	// Reo ratio
	Object.defineProperty(this,"p",{get:function(){
		// rect section only
		return this.Ast/this.b/this.D;
	}.bind(this)});
	
	// AS3600 8.5.3.1
	Object.defineProperty(this,"beta",{get:function(){
		// rect section only
		return this.Ast/this.b/this.D;
	}.bind(this)});
	
	
	this.create();
	
	/*
	*/
};











