///* EventDispatcher.js


function VarInput(arg_id,arg_notation,arg_type,arg_value,arg_unit,arg_options){
	
	
	EventDispatcher.call(this);
	
	this._options = arg_options;
	this._notation = "";
	this._type = arg_type;
	
	this.validate = function(v){return v;};
	
	
	// ##########################################################################################
	// 			BUILD INTERFACE
	// #########################################################################################
	this.buildInterface = function(){
		this.body = document.createElement("table");
		this.row = document.createElement("tr");
		this.body.className = "varinput";
		this.notationDiv = document.createElement("td");
		this.notationDiv.className = "notation-div";
		this.valueDiv = document.createElement("td");
		this.valueDiv.className = "value-div";
		this.unitDiv = document.createElement("td");
		this.unitDiv.className = "unit-div";
		
		this.helpDiv = document.createElement("td");
		this.helpDiv.className = "help-div";
		this.helpAnchor = document.createElement("a");
		this.helpAnchor.href = "#help_bar_"+arg_id;
		this.helpButton = document.createElement("button");
		this.helpButton.className = "help-button";
		this.helpButton.innerHTML = "?";
		

	
		if(arg_options){
			this.valueInput	= document.createElement("select");
			this.options 		= arg_options;
		}else if(arg_type == "number"){
			this.valueInput		= document.createElement("input");
			this.valueInput.type = "number";
			this.valueInput.step = 5;
			this.valueInput.min = 0;
		}else if(arg_type == "text"){
			this.valueInput		= document.createElement("input");
			this.valueInput.type = "text";
		}else{
			this.valueInput		= document.createElement("input");
			this.valueInput.type = "none";
			this.valueInput.readonly=true;
		}
		
		
		this.valueDiv.appendChild(this.valueInput);
		
		this.row.appendChild(this.notationDiv);
		this.row.appendChild(this.valueDiv);
		this.row.appendChild(this.unitDiv);
		this.row.appendChild(this.helpDiv);
		this.helpDiv.appendChild(this.helpAnchor);
		this.helpAnchor.appendChild(this.helpButton);
		this.body.appendChild(this.row);
		
		
		this.notation	= arg_notation;
		
		
		this.id		= "var_input_"+arg_id;
		this.unit	= arg_unit;
		this.value	= arg_value;
		
		
		
		
		
	}.bind(this);
	// ##########################################################################################
	// 			EVENT LISTENERS
	// ##########################################################################################
	this.configureEvents = function(){
		
		this.valueInput.addEventListener("change",function(e){
			this.value = this.getValidity().value;
			this.update();
			this.change();
		}.bind(this));
		
		this.valueInput.addEventListener("input",function(e){
			var val = {value:this.value, error:[], warning:[], info:[]};
			this.validate(val);
			if(val.error.length>0){
				this.valueInput.setCustomValidity("NO")
			}
			this.update();
			this.change();
		}.bind(this));
		
		this.body.addEventListener("click", function(e){
			if(e.target.tagName!=="INPUT" && e.target.tagName!=="SELECT"){
				//e.preventDefault();
				this.valueInput.click();
				if(this.valueInput.tagName == "SELECT"){
					this.valueInput.focus();
				}else{
					this.valueInput.select();
				}
			}
			this.update();
			this.change();
		}.bind(this))
	}.bind(this);
	
	// ##########################################################################################
	// 			UPDATE/CHANGE
	// ##########################################################################################
	
	this.update = function(){
		this.update_validity();
		this.dispatch("update",this);
	}.bind(this);
	this.change = function(){
		this.dispatch("change",this);
	}.bind(this);
	
	this.update_validity = function(){
		if(!this.valid){
			this.valueInput.setCustomValidity("invalid");
		}else{
			this.valueInput.setCustomValidity("");
		}
	}.bind(this);
	
	// ##########################################################################################
	// 			HELPER FUNCTIONS
	// ##########################################################################################
	
	this.appendTo = function(dom){
		dom.appendChild(this.body)
		this.updateMathJax();
		this.configureEvents();
	}.bind(this);
	
	this.updateMathJax = function(){
		if(document.body.contains(this.body)){
			try{
				MathJax.Hub.Queue(["Typeset",MathJax.Hub,this.body]);
			}catch(e){
				this.notation = this.id;
				// Fail gracefully sort of
			}
		}
	}.bind(this);
	
	this.getValidity = function(){
		var val = {value:this.value, error:[], warning:[], info:[]};
		return this.validate(val);
	}
	
	
	// ###################################################################
	// 			GETTERS AND SETTERS
	// ###################################################################
	Object.defineProperty(this,"valid",{
		get:function(){
			var val = {value:this.value, error:[], warning:[], info:[]};
			return this.validate(val).error.length==0;
		}.bind(this)
	});
	
	Object.defineProperty(this,"notation",{
		get:function(){
			return this._notation;
		}.bind(this),
		set:function(newval){
			this.notationDiv.innerHTML	= newval;
			this.updateMathJax();
		}.bind(this)
	});
	
	
	
	Object.defineProperty(this,"value",{
		get:function(){
			if(this._type == "number"){
				return parseInt(this.valueInput.value);
			}
			return this.valueInput.value;
		}.bind(this),
		set:function(newval){
			this.valueInput.value = newval;
		}.bind(this)
	});
	
	Object.defineProperty(this,"options",{
		get:function(){
			return this._options;
		}.bind(this),
		set:function(newval){
			this._options = newval;
			for(var i=0;i<this._options.length;i++){
				var o = document.createElement("option");
				o.innerHTML = this._options[i];
				o.value = this._options[i];
				this.valueInput.appendChild(o);
			}
		}.bind(this),
	});
	
	Object.defineProperty(this,"unit",{
		get:function(){
			this.unitDiv.innerHTML;
		}.bind(this),
		set:function(newval){
			this.unitDiv.innerHTML = newval;
		}.bind(this)
	});
	
	
	
	
	
	
	
	
	
	this.buildInterface();
}

























