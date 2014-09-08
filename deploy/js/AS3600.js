var AS3600={};

AS3600["4.10.3.2"] = new (function(){
	this.class_index = [
		"A1",
		"A2",
		"B1",
		"B2",
		"C1",
		"C2"
	];
	this.fc_index = 	[20,25,32,40,50];
	this.coverdata_standard = [ // AS3600+A2 T4.10.3.2
		[20,20,20,20,20],
		[  ,30,25,20,20],
		[  ,  ,40,30,25],
		[  ,  ,  ,45,35],
		[  ,  ,  ,  ,50],
		[  ,  ,  ,  ,65]
	];
	this.coverdata_nonstandard = [ // AS3600+A2 T4.10.3.3
		[20,20,20,20,20],
		[  ,30,20,20,20],
		[  ,  ,30,25,20],
		[  ,  ,  ,35,25],
		[  ,  ,  ,  ,45],
		[  ,  ,  ,  ,60]
	];
	
	this.get_min_cover_from_fc_eclass = function(fc, eclass){
		var f = this.fc_index.indexOf(Math.min(fc,50));
		var c = this.class_index.indexOf(eclass);
		
		if(f === -1 || c === -1){
			console.error("error in AS3600['4.10.3.2'] fc or eclass not found");
			return undefined
		}else{
			return this.coverdata_standard[c][f];
		}
	}.bind(this);
	
	
	this.get_min_fc_from_eclass = function(eclass){
		var c = this.class_index.indexOf(eclass);
		if(c === -1){
			console.error("error in AS3600['4.10.3.2'] eclass not found");
			return undefined;
		}
		var fcs = this.coverdata_standard[c];
		for(var i = 0; fcs[i] === undefined ; i++){}
		return this.fc_index[i];
	}.bind(this);
	
	this.get_max_eclass_from_fc = function(fc){
		var f = this.fc_index.indexOf(Math.min(fc,50));
		
		if(f === -1){
			console.error("error in AS3600['4.10.3.2'] fc not found");
			return undefined
		}
		for(var i = this.coverdata_standard.length-1; this.coverdata_standard[i][f] === undefined &&  i>=0; i--){}
		return this.class_index[i];
	}.bind(this);
	
	this.eclass_lessthan_eclass = function(e1,e2){
		return this.class_index.indexOf(e1) < this.class_index.indexOf(e2);
	}.bind(this);
})