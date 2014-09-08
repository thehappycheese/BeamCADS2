///* ReoInput.js
///* EventDispatcher.js


function ReoManager(arg_body, arg_beam){
	
	EventDispatcher.call(this);
	
	this.beam = arg_beam;
	
	this.body = arg_body;
	this.rows = [];
	
	this.create = function(){
		var firstrow = this.createReoInput();
		firstrow.isFirstRow = true;
		firstrow.enabled = true;
		this.rows.push(firstrow);
		this.rows.push(this.createReoInput());
		this.rows.push(this.createReoInput());
		this.rows.push(this.createReoInput());
		
		// TODO: reversed row order. make things independat of row orderish.
		for(var i = this.rows.length - 1;i>=0;i--){
			this.rows[i].appendTo(this.body);
		}
		
		this.update();
	}.bind(this);
	
	
	
	
	

	
	
	
	this.getEnabledRows = function(){
		var result = [];
		for(var i = 0;i<this.rows.length;i++){
			if(this.rows[i].enabled){
				result.push(this.rows[i]);
			}
		}
		return result;
	}.bind(this);
	
	
	this.getRowIndex = function(row){
		for(var i=0; i<this.rows.length;i++){
			if(row === this.rows[i]){
				return i;
			}
		}
		return undefined
	}.bind(this);
	
	this.getEnabledRowIndex = function(row){
		var rs = this.getEnabledRows();
		for(var i=0; i<rs.length;i++){
			if(row === rs[i]){
				return i;
			}
		}
		return undefined
	}.bind(this);
	
	
	


	
	this.getHighestHighestRow = function(){
		r = this.getEnabledRows();
		for(var i = r.length-1;i>=0;i--){
			if(r[i].from==="highest"){
				return r[i];
			}
		}
		return undefined;
	}.bind(this);
	
	
	
	
	
	
	this.getLowestLowestRow = function(){
		r = this.getEnabledRows();
		for(var i = 0;i<r.length;i++){
			if(r[i].from === "lowest"){
				return r[i];
			}
		}
		return undefined;
	}.bind(this);
	
	
	
	this.getDepthOfRow = function(row){
		// TODO: update
		var D = this.beam.D;
		var df = this.beam.df;
		var cover = this.beam.cover;
		
		var rs = this.getEnabledRows();
		var br = this.getLowestLowestRow();
		
		var last_low_depth = D-cover-df;
		var last_high_depth = cover+df;
		
		
		// loop bottom to top
		for(var i = 0;i<rs.length;i++){
			if(rs[i].from === "lowest"){
				if(rs[i] === row){
					return last_low_depth - rs[i].offset - rs[i].diameter/2;
				}else{
					last_low_depth -= rs[i].offset + rs[i].diameter;
				}
			}
		}
		// loop top to bottom
		for(var i = rs.length-1; i>=0; i--){
			if(rs[i].from === "highest"){
				if(rs[i] === row){
					return last_high_depth + rs[i].offset + rs[i].diameter/2;
				}else{
					last_high_depth += rs[i].offset + rs[i].diameter;
				}
			}
		}
		throw new Error("Failed to get depth of row.")
	}.bind(this);
	
	
	
	
	
	
	
	
	
	this.createReoInput = function(){
		var nr = new ReoInput(this);
		nr.on("update",this.update);
		nr.on("change",this.change);
		return nr;
	}.bind(this);
	
	
	
	
	
	this.change = function(e){
		//console.log("reo-manager change");

		this.dispatch("change",this);
	}.bind(this);
	
	
	this.lock_update = false;
	this.update = function(e){
		if(this.lock_update) return;
		this.lock_update = true;
		//console.log("reo-manager update");
		this.sort_rows(); // TODO: does this trigger when offset is changed in a row? prolly not :(
		this.update_renumberRows();
		this.lock_update = false;
		this.dispatch("update",this);
	}.bind(this);
	


	this.sort_rows = function(){
		var r = this.rows; // Alias for the reoinput objects
		var a, b, ad, bd;
		for(i=0;i<r.length-1;i++){
			a = r[i];
			b = r[i+1];

			// swap when:
			// highest&enabled below an (enabled&lowest or a disabled) OR
			// disabled item below an enabled&lowest
			if(((a.from === "highest" && a.enabled === true) && ((b.from === "lowest" && b.enabled === true) || b.enabled === false))||
				(a.enabled===false && (b.from==="lowest" && b.enabled===true))){
			// dont sort against blanks!
			// didnt work :(
			//if((a.from==="highest" && a.enabled) && (b.from === "lowest" && b.enabled)){ 
				// swap required. only need to swap in this direction to finish
				this.swap_rows(a,b)
				// set i to 0 and restart
				i=0;
			}



		}
		//this.update_renumberRows();
	}.bind(this);

	this.swap_rows = function(a,b){
		var t_offset = a.offset;
		var t_barcode = a.barcode;
		var t_from = a.from;
		var t_enabled = a.enabled;
		var t_isFirstRow = a.isFirstRow;

		a.offset = b.offset;
		a.barcode = b.barcode;
		a.from = b.from;
		a.enabled = b.enabled;
		a.isFirstRow = b.isFirstRow;

		b.offset = t_offset;
		b.barcode = t_barcode;
		b.from = t_from;
		b.enabled = t_enabled;
		b.isFirstRow = t_isFirstRow;


	}.bind(this);
	
	
	
	this.update_renumberRows = function(){
		for(var i=0; i<this.rows.length;i++){
			this.rows[i].layerNumberOutput.innerHTML = "";
			this.rows[i].layerDepthOutput.innerHTML = "";
			this.rows[i].layerDepthOutput.innerHTML = "";
		}
		var rs = this.getEnabledRows();
		for(var i=0; i<rs.length;i++){
			rs[i].layerNumberOutput.innerHTML = i;
			rs[i].layerDepthOutput.innerHTML = this.getDepthOfRow(rs[i]);
		}
	}.bind(this);
	
	
	
	
	
	
	Object.defineProperty(this,"value",{
		get:function(){
			var result = [];
			var rs = this.getEnabledRows(); 
			var rw;
			for(var i = 0;i<rs.length;i++){
				rw = {
					number:		rs[i].number,
					diameter:	rs[i].diameter,
					area:		rs[i].area,
					depth:		this.getDepthOfRow(rs[i]),
					from:		rs[i].from,
					offset:		rs[i].offset,

				}
				result.push(rw);
			}
			return result;
			
		},
		set:function(newval){
			// TODO: DESERIELIZEEEE :|
		}
	});
	
	
	
	
	
	

	this.create();
};