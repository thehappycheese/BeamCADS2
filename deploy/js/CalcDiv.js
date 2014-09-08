
///* EventDispatcher.js



function CalcDiv(){
	EventDispatcher.call(this);
	
	this.body;
	this.topdiv;
	this.contentdiv;
	
	this._collapsed = false;
	
	
	
	
	this.init = function(){
		
		
		
		this.body = this.body || document.createElement("div");
		
		this.body.innerHTML = '<div class="CalcDiv">\
			<table class="topdiv">\
				<tr>\
					<td style="width:30px;padding-right:10px;">\
						<button class="minmaxbutton" title="Show workings.">+</button>\
					</td>\
					<td class="titlediv">\
						[Title]\
					</td>\
				</tr>\
			</table>\
			<div class="contentdiv" style="display: none;">\
				<p>[Content]</p>\
			</div>\
		</div>';
		
		this.topdiv = this.body.querySelector(".topdiv");
		this.minmaxbutton = this.body.querySelector(".minmaxbutton");
		this.titlediv = this.body.querySelector(".titlediv");
		this.contentdiv = this.body.querySelector(".contentdiv");
		
		this._collapsed = true;

		
		
		this.dispatch("init",null);
		
		
		
		
		
	}.bind(this);
	
	
	this.appendTo = function(dom){
		this.init();
		dom.appendChild(this.body);
		this.topdiv.addEventListener("click",this.toggleCollapse,false);
		this.dispatch("added");
	}.bind(this);
	
	
	this.toggleCollapse = function(){
		this.collapsed = !this.collapsed;
	}.bind(this);
	
	
	this.updateMathJax = function(){
		MathJax.Hub.Queue(["Typeset",MathJax.Hub,this.body]);
	}.bind(this);
	
	
	Object.defineProperty(this,"collapsed",{
		get:function(){
			return this._collapsed;
		}.bind(this),
		set:function(newval){
			this._collapsed = newval;
			this.contentdiv.style.display = (newval)? "none" : "";
			if(newval){
				this.minmaxbutton.innerHTML = "+";
				this.dispatch("hide");
			}else{
				this.minmaxbutton.innerHTML = "-";
				this.dispatch("show");
			}
		}.bind(this)
	})
	
	
	Object.defineProperty(this,"title",{
		get:function(){
			return this.titlediv.innerHTML;
		}.bind(this),
		set:function(newval){
			this.titlediv.innerHTML = newval;
		}.bind(this)
	});
	
	
	Object.defineProperty(this,"content",{
		get:function(){
			return this.contentdiv.innerHTML;
		}.bind(this),
		set:function(newval){
			this.contentdiv.innerHTML = newval;
		}.bind(this)
	});
	
	
	
	this.addParagraph = function(content){
		var newp = document.createElement("p");
		newp.innerHTML = content;
		this.contentdiv.appendChild(newp);
	}.bind(this);
	
	this.addSpace = function(){
		var newp = document.createElement("div");
		newp.style.height = "5px";
		this.contentdiv.appendChild(newp);
	}.bind(this);
	
	this.addElement = function(element){
		this.contentdiv.appendChild(element);
	}.bind(this);
	
	
	
	this.init();
}