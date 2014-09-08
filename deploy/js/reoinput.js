
///* EventDispatcher.js

function ReoInput(arg_manager){
	this.manager = arg_manager;
	
	EventDispatcher.call(this);
	
	
	this.diameters	= [10,	12,		16,		20,		24,		28,		32,		36,		40];
	this.areas		= [78,	113,	201,	314,	452,	616,	804,	1020,	1260];
	this.masses		= [0.632,0.910,1.619,2.528,3.640,4.955,6.471,8.910,10.112];
	


	this._isFirstRow = false;


	this.create = function(){
		this.body = document.createElement("tr");
		this.body.className = "reoinput";
		this.body.innerHTML = 
		'\
		<td class="layernum">#</td>\
		<td><input type="checkbox" class="enabled"></td>\
		<td style="white-space:nowrap;"><input class="barcode" required value="2N10"/> <span class="offmessage" style="display:none;color:lightgrey;">&#8592; Click here to add a new row</span></td>\
		<td><button class="more" tabindex="-1">+</button><button class="less" tabindex="-1">-</button></td>\
		<td><select class="from"><option value="highest">&#8593; Top</option><option value="lowest" selected>&#8595; Bottom</option></select></td>\
		<td><input type="number" class="offset" value="0" required/></td>\
		\
		<td class="area">--</td>\
		<td class="depth">0</td>\
		';
		
		this.enabledCheckbox = this.body.querySelector(".enabled");
		this.barcodeInput	= this.body.querySelector(".barcode");
		this.moreButton		= this.body.querySelector(".more");
		this.lessButton		= this.body.querySelector(".less");
		this.areaOutput		= this.body.querySelector(".area");
		this.layerNumberOutput = this.body.querySelector(".layernum");
		this.layerNumberOutput.style.fontWeight = "bold";
		this.layerDepthOutput = this.body.querySelector(".depth");
		this.offsetInput	= this.body.querySelector(".offset");
		this.fromInput		= this.body.querySelector(".from");
		this.selectedCheckbox = this.body.querySelector(".selected");

		this.offMessageOutput = this.body.querySelector(".offmessage");
		
		this.enabled = false;
	}.bind(this);
	// ##########################################################################################
	// 			BIND EVENTS
	// ##########################################################################################
	this.appendTo = function(dom){
		dom.appendChild(this.body);
		this.enabledCheckbox.addEventListener("change",function(e){
			this.enabled = this.enabledCheckbox.checked;
			this.change();
		}.bind(this));
		this.moreButton.addEventListener("click",function(){
			this.more();
			this.update();
			this.change();
		}.bind(this));
		this.lessButton.addEventListener("click",function(){
			this.less();
			this.update();
			this.change();
		}.bind(this));
		this.offsetInput.addEventListener("change",function(){
			this.update();
			this.change();
		}.bind(this))
		this.offsetInput.addEventListener("input",function(){
			this.update();
			this.change();
		}.bind(this));
		this.fromInput.addEventListener("change",function(){
			this.update();
			this.change();
		}.bind(this))
		
		// BARCODE CHANGE EVENT LISTENERs
		this.barcodeInput.addEventListener("keydown",function(e){
			if(e.keyCode == 38){	// up button
				this.more();
				e.preventDefault();
				this.update();
				this.change();
			}
			if(e.keyCode == 40){	// down button
				this.less();
				e.preventDefault();
				this.update();
				this.change();
			}
		}.bind(this))
		
		this.barcodeInput.addEventListener("change",function(){
			this.update();
			this.change();
		}.bind(this));
		
		this.barcodeInput.addEventListener("input",function(e){
			var val = e.target.value;
			var ss = e.target.selectionStart;
			var se = e.target.selectionEnd;
			var arr = val.split("")
			var flag = false;
			var noN = true;
			for(var i=0;i<arr.length;i++){
				
				if((/[^0-9nN]/).test(arr[i])){
					arr.splice(i--,1);
					;
					if(i<ss){
						ss--;
						se=ss;
					}
				}
				if(arr[i]=="N"){
					noN = false;
				}
			}
			val = arr.join("");
			val = val.toUpperCase();
			e.target.value =  val;
			e.target.setSelectionRange(ss,se);
			this.update();
			this.change();
		}.bind(this))
	}.bind(this);
	// ##########################################################################################
	// 			GETTER/SETTERS
	// ##########################################################################################
	
	//				GET/SET ENABLED
	Object.defineProperty(this,"enabled",{
		get:function(){
			return this.enabledCheckbox.checked;
		}.bind(this),
		set:function(newval){
			
			this.enabledCheckbox.checked = newval;
			
			
			
			this.barcodeInput.disabled		= !newval;
			this.moreButton.disabled		= !newval;
			this.lessButton.disabled		= !newval;
			this.areaOutput.disabled		= !newval;
			this.offsetInput.disabled		= !newval;
			this.fromInput.disabled			= !newval;
			
			this.update();
			
		}.bind(this),
	});
	
	
	
	// 			GET/SET barcode
	Object.defineProperty(this,"barcode",{
		get:function(){
			var inp = this.barcodeInput.value;
			//if(inp.match(/^(10|[1-9])(N)(10|12|16|20|24|28|32|36|40)$/)){
			if(inp.match(/^([0-9]+)(N)([0-9]+)$/)){
				return inp;
			}else{
				return "";
			}
		}.bind(this),
		set:function(newval){
			this.barcodeInput.value = newval;
			this.update();
		}.bind(this),
	});
	
	// 			GET/SET area
	Object.defineProperty(this,"area",{
		get:function(){
			return this.areas[this.diameters.indexOf(this.diameter)]*this.number || undefined;
		}.bind(this)
	});
	
	
	// 			GET/SET mass_per_meter
	Object.defineProperty(this,"mass_per_meter",{
		get:function(){
			return this.masses[this.diameters.indexOf(this.diameter)]*this.number || undefined;
		}.bind(this)
	});
	
	
	// 			GET/SET diameter
	Object.defineProperty(this,"diameter",{
		get:function(){
			return parseInt(this.barcode.split("N")[1]) || 10;
		}.bind(this),
		set:function(newval){
			if(this.diameters.indexOf(newval)!==-1){
				this.barcode = this.number + "N" + newval;
			}else{
				console.warn("Invalid assignment to reo-input diameter: "+newval);
			}
		}.bind(this)
	});
	
	
	// 			GET/SET number
	Object.defineProperty(this,"number",{
		get:function(){
			return parseInt(this.barcode.split("N")[0]) || 2;
		}.bind(this),
		set:function(newval){
			if(typeof newval == "number" && newval!==NaN && newval!==undefined && newval>=2 && newval<100){
				this.barcode = newval + "N" + this.diameter;
			}else{
				console.warn("Invalid assignment to reo-input number: "+newval);
			}
		}.bind(this)
	});
	
	
	// 			GET/SET OFFSET
	Object.defineProperty(this,"offset",{
		get:function(){
			return parseInt(this.offsetInput.value) || 0;
		}.bind(this),
		set:function(newval){
			this.offsetInput.value = Math.abs(Math.round(parseFloat(newval)));
			//this.update();
		}.bind(this),
	});
	
	
	// 			GET/SET FROM
	Object.defineProperty(this,"from",{
		get:function(){
			return this.fromInput.value;
		}.bind(this),
		set:function(newval){
			this.fromInput.value = newval;
			this.update();
		}.bind(this),
	});


	// 			GET/SET IS AT HIGHEST POSITION
	Object.defineProperty(this,"isAtHighestPosition",{
		get:function(){
			return this.isHighestHighestRow && (this.offset === 0);
		}.bind(this)
	});

	Object.defineProperty(this,"isAtLowestPosition",{
		get:function(){
			return this.isLowestLowestRow && (this.offset === 0);
		}.bind(this)
	});
	
	Object.defineProperty(this,"isHighestHighestRow",{
		get:function(){
			return this.manager.getHighestHighestRow() === this;
		}.bind(this)
	});

	Object.defineProperty(this,"isLowestLowestRow",{
		get:function(){
			return this.manager.getLowestLowestRow() === this;
		}.bind(this)
	});

Object.defineProperty(this,"isFirstRow",{
		get:function(){
			return this._isFirstRow;
		}.bind(this),
		set:function(newval){
			this._isFirstRow = newval;

			if(this._isFirstRow){
				this.enabledCheckbox.disabled = true;
				this.offsetInput.disabled = true;
				this.fromInput.disabled = true;
				this.offsetInput.style.visibility = "hidden";
				this.fromInput.style.visibility = "hidden";
			}else{
				this.enabledCheckbox.disabled = false;
				this.offsetInput.disabled = false;
				this.fromInput.disabled = false;
				this.offsetInput.style.visibility = "";
				this.fromInput.style.visibility = "";
			}
		}.bind(this)
	})

	
	
	// ##########################################################################################
	// 			UPDATE
	// ##########################################################################################
	
	this.update = function(){
		if(this.enabled){
			this.body.style.color = "";
			this.areaOutput.innerHTML = this.area;

			this.offsetInput.style.display	= "";
			this.fromInput.style.display	= "";
			this.moreButton.style.display	= "";
			this.lessButton.style.display	= "";
			this.barcodeInput.style.display = "";

			this.offMessageOutput.style.display = "none";

			if(this.isHighestHighestRow){
				if(this.offest!== 0){
					this.offset = 0;
				}
				this.offsetInput.style.display	= "none";
			}
			
		}else{
			this.areaOutput.innerHTML = "";
			this.body.style.color = "grey";

			this.offsetInput.style.display	= "none";
			this.fromInput.style.display	= "none";
			this.moreButton.style.display	= "none";
			this.lessButton.style.display	= "none";
			this.barcodeInput.style.display	= "none";

			this.offMessageOutput.style.display = "";
		}


		
		
		
		this.update_validity();
		this.dispatch("update",this);
	}.bind(this);
	this.change = function(){
		this.dispatch("change",this);
	}.bind(this);
	
	this.update_validity = function(){
		var valid = this.getValidity();
		if(valid.error.length>0){
			this.body.style.backgroundColor = "lightyellow";
			this.body.style.color = "red";
		}else{
			this.body.style.backgroundColor = "";
			this.body.style.color = "";
		}
	}.bind(this);
	
	
	
	// ##########################################################################################
	// 			HELPERS
	// ##########################################################################################

	
	// ##########################################################################################
	// 			MORE AND LESS HELPER FUNCTIONS
	// ##########################################################################################
	
	
	this.more = function(){
		var b = parseInt(vin.b.value);
		var D = parseInt(vin.D.value);
		var df = parseInt(vin.df.value);
		var cover = parseInt(vin.cover.value);
		var fitwidth = b-2*cover-2*df;
		
		var manager = this.manager;
		if(this.isAtLowestPosition || this.isAtHighestPosition){// TODO: or if the row is pressed against the top allow multi bars of comp reo.
			// ASSUME: assume minimum spacing of 20mm between
			// ASSUME: assume maximum spacing of 300mm c-c
			// ASSUME: assume maximum of 10 bars
			this.barcode = this._more_less_barcode(true, 10, 300, 20, fitwidth, this.area) || this.barcode;
		}else{
			// ASSUME: assume maximum of 2 bars
			// ASSUME: assume maximum spacing of Infinity
			this.barcode = this._more_less_barcode(true, 2,  Infinity, 20, fitwidth, this.area) || this.barcode;
		}
	}.bind(this);
	
	
	
	
	this.less = function(){
		var b = parseInt(vin.b.value);
		var D = parseInt(vin.D.value);
		var df = parseInt(vin.df.value);
		var cover = parseInt(vin.cover.value);
		var fitwidth = b-2*cover-2*df;
		
		var manager = this.manager;
		if(this.isAtLowestPosition || this.isAtHighestPosition){// TODO: or if the row is pressed against the top allow multi bars of comp reo.
			// ASSUME: assume minimum spacing of 20mm between
			// ASSUME: assume maximum spacing of 300mm c-c
			// ASSUME: assume maximum of 10 bars
			this.barcode = this._more_less_barcode(false, 10, 300, 20, fitwidth, this.area) || this.barcode;
		}else{
			// ASSUME: assume maximum of 2 bars
			// ASSUME: assume maximum spacing of Infinity
			this.barcode = this._more_less_barcode(false, 2,  Infinity, 20, fitwidth, this.area) || this.barcode;
		}
	}.bind(this);
	
	
	
	this._more_less_barcode = function (getmore, maxbar, max_spacing, min_gap, fitwidth, current_area){
		
		
		var combs = [];
		var num,dia,diai,minw,maxw;
		for(num = 2; num<=maxbar;num++){
			for(diai=0;diai<this.diameters.length;diai++){
				dia = this.diameters[diai];
				
				minw = dia*num+(num-1)*min_gap;
				maxw = dia*num+(num-1)*max_spacing;
				if(fitwidth>=minw && fitwidth<=maxw){
					combs.push({number:num, diameter:dia, area:this.areas[diai]*num})
				}
			}
		}
		
		
		if(combs.length==0){
			console.log("never was possible combinations error");
			return "2N10";
		}
		
		combs.sort(function(a,b){
			if(getmore){
				return a.area-b.area;
			}else{
				return b.area-a.area;
			}
		})
		//console.table(combs);
		
		// go through pairwise and remove all adjacent combos within 50mm^2 of eachother where one has less bars than the other
		var da = 0;
		var dn = 0;
		for(var i = 0;i<combs.length-1;i++){
			da = Math.abs(combs[i].area - combs[i+1].area);
			if(da>50){
				if(combs[i].number<combs[i+1].number){
					combs.splice(i+1,1);
				}else if(combs[i].number>combs[i+1].number){
					combs.splice(i,1);
					i--;
				}
			}
		}
		// go through pairwise and remove all adjacent combos within 100mm^2 of eachother if one has less than or equal to half the number of bars.
		var da = 0;
		var dn = 0;
		for(var i = 0;i<combs.length-1;i++){
			da = Math.abs(combs[i].area - combs[i+1].area);
			if(da>50){
				if(combs[i].number<=combs[i+1].number/2){
					combs.splice(i+1,1);
				}else if(combs[i+1].number<=combs[i].number/2){
					combs.splice(i,1);
					i--;
				}
			}
		}

		//console.log(combs.length);
		
		for(var i = 0;i<combs.length;i++){
			if(getmore){
				if(combs[i].area>current_area){
					return combs[i].number+"N"+combs[i].diameter;
				}
			}else{
				if(combs[i].area<current_area){
					return combs[i].number+"N"+combs[i].diameter;
				}
			}
		}
		
		// no suitable combination was found. Return the top combination.
		if(combs.length==0){
			console.log("no possible combinations error");
			return "2N10";
		}
		return combs[combs.length-1].number+"N"+combs[combs.length-1].diameter;
		
	
	}.bind(this);// end _more_less_barcode

	
	
	
	
	
	
	
	
	
	
	
	
	
	this.getValidity = function(){
		var result = {error:[], warning:[], infos:[]};
		if(!this.enabled) return result;
		
		var rowname = ("Layer "+this.manager.getEnabledRowIndex(this)).bold();
		
		// Check that this layer isn't near the neutral axis
		
		
		if(!this.barcodeInput.value.match(/^[0-9]+N[0-9]+$/)){
			result.error.push(rowname+' incorrect \'Bars\' column. This software uses the shorthand \"<b>2N10</b>\" to indicate 2 <a href="#help_bar_reoclass">normal ductility bars</a> with a diameter of 10mm.');
		}else{
			var number = parseInt(this.barcodeInput.value.split("N")[0]);
			var diameter = parseInt(this.barcodeInput.value.split("N")[1]);
			if(number<2){
				// we should never have less than 2 bars
				result.error.push(rowname+" has less than 2 bars. At least 2 bars in each layer are required to form a symmetrical reo cage for transportation.");
			}else if(!this.isAtHighestPosition && !this.isAtLowestPosition){
				// If this is a "middle" row, then it shouldn't have more than 2 bars!
				if(number > 2){
					result.error.push(rowname+" has bars floating in mid air! This layer should have only 2 bars.")
				}
			}
			if(number>10){
				result.error.push(rowname+" has too many bars (<b>>10</b>). Consider using larger bar diameters instead.");
			}
			if(this.diameters.indexOf(diameter)===-1){
				result.error.push(rowname+" non-standard bar diameter. This software can only function with standard deformed bar diameters: ["+this.diameters.join(", ")+"] mm");
			}
			// lets calculate the spacing between the bars in this layer!
			var b = parseInt(vin.b.value);
			var df = parseInt(vin.df.value);
			var cover = parseInt(vin.cover.value);
			var fitwidth = b-2*cover-2*df;
			var gap = (fitwidth - (number*diameter))/(number-1);
			if(gap<20){
				result.error.push(rowname+" not enough space between bars (<20mm). Use fewer bars so that aggregate can completely surround the bars and and air bubbles can escape.");
			}

			// TODO: get code references for this section
			// verify!
			if(this.isAtHighestPosition || this.isAtLowestPosition){
				if(gap > 300){
					result.error.push(rowname+" has too much space between bars (>300mm) for crack control requirements! Only bars which are \u2265 half the diameter of the largest bar can be counted.")
				}
			}
		}
		
		// if this is the top or bottom layer, gap can be 0. otherwise gap should be at least 20mm.
		if(this.isAtLowestPosition || this.isAtHighestPosition){
			// do nothing
		}else{
			if(this.offset<20){
				result.error.push(rowname+" is too close to another layer. The <b>'Gap' should be at least 20mm</b> so that aggregate can completely surround the bars and and air bubbles can escape.");
			}
		}


		
		
		// Check that this layer's diameter isnt less than half the diameter of the largest bar.
		//var rs = this.manager.getEnabledRows();
		//var largest = -Infinity;
		//for(var i= 0; i <rs.length;i++){
		//	if(rs[i].diameter>largest){
		//		largest = rs[i].diameter;
		//	}
		//}
		//var largeston2 = largest/2;
		//if(this.diameter<largeston2){
		//	result.error.push("Reo Layer "+this.manager.getEnabledRowIndex(this)+": "+"is less than half the diameter of the largest bar. This layer should be excluded from calculations.")
		//}
		
		return result;
	}.bind(this);
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	

	this.create();
}