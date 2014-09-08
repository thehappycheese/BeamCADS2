

function Vector(x,y){
	this.x = x || 0;
	this.y = y || 0;
	
	this.set = function(x,y){
		this.x = x;
		this.y = y;
		return this;
	}.bind(this);
	
	this.fromVector = function(v){
		this.x = v.x;
		this.y = v.y;
		return this;
	}.bind(this);
	
	this.fromPoints = function(a,b){
		this.x = b.x-a.x;
		this.y = b.y-a.y;
		return this;
	}
	
	this.fromAngLen = function(angle,length){
		this.x = Math.cos(angle)*length;
		this.y = Math.sin(angle)*length;
		return this;
	}.bind(this);
	
	this.copy = function(){
		return new Vector(this.x,this.y);
	}.bind(this);
	this.duplicate = this.copy;
	
	
	this.plus = function(v){
		this.x+=v.x;
		this.y+=v.y;
		return this;
	}.bind(this);
	this.add = this.plus;
	this.plusScalar = function(s){
		this.x+=s;
		this.y+=s;
		return this;
	}.bind(this);
	this.addScalar = this.plusScalar;
	
	this.minus = function(v){
		this.x-=v.x;
		this.y-=v.y;
		return this;
	}.bind(this);
	this.subtract = this.minus;
	this.minusScalar = function(s){
		this.x-=s;
		this.y-=s;
		return this;
	}.bind(this);
	this.subtractScalar = this.minusScalar;
	
	this.scalar = function(s){
		this.x*=s;
		this.y*=s;
		return this;
	}.bind(this);
	
	this.dot = function(v){
		return  this.x*v.x + this.y*v.y;
	}.bind(this);
	
	
	this.left = function(){
		var tmpy = this.y;
		this.y = this.x;
		this.x = -tmpy;
		return this;
	}.bind(this);
	this.right = function(){
		var tmpy = this.y;
		this.y = -this.x;
		this.x = tmpy;
		return this;
	}.bind(this);
	this.unit = function(){
		var mag = this.len;
		this.x/=mag;
		this.y/=mag;
		return this;
	}.bind(this);
	
	Object.defineProperty(this,"lenSquared",{
		get:function(){
			return this.x*this.x + this.y*this.y;
		}.bind(this)
	});
	
	Object.defineProperty(this,"len",{
		get:function(){
			return Math.sqrt(this.lenSquared);
		}.bind(this)
	});
	
	Object.defineProperty(this,"ang",{
		get:function(){
			return Math.atan2(this.y,this.x);
		}.bind(this)
	});
	
	this.toString = function(){
		return "<"+this.x.toFixed(2)+", "+this.y.toFixed(2)+">";
	}.bind(this);


	this.rounded = function(){
		this.x =Math.round(this.x);
		this.y =Math.round(this.y);
		return this;
	}
	
	
	this.moveTo = function(ctx){
		ctx.moveTo(this.x,this.y);
		return this;
	}.bind(this);
	this.lineTo = function(ctx){
		ctx.lineTo(this.x,this.y);
		return this;
	}.bind(this);
	
}