
/*
var dragging = false;
var dcoords = {x:0,y:0};
document.body.addEventListener("mousedown",function(e){
	console.log(e);
	dragging = true;
	dcoords.x= e.pageX;
	dcoords.y= e.pageY;
	
	dcoords.ox = window.scrollX;
	dcoords.oy = window.scrollY;
	document.body.style.cursor = "all-scroll";
	e.preventDefault();
},true);

document.addEventListener("mouseout",function(e){
	if(!e.relatedTarget || e.relatedTarget.nodeName=="HTML"){
		dragging = false;
		document.body.style.cursor = "";
	}
},true);
window.addEventListener("blur",function(){
	dragging = false;
	document.body.style.cursor = "";
},true);
document.body.addEventListener("mouseup",function(){
	dragging = false;
	document.body.style.cursor = "";
},true);

document.body.addEventListener("mousemove",function(e){
	console.log(e)
	
	if(dragging){
		var x = e.pageX;
		var y = e.pageY;
		window.scrollTo(
			dcoords.ox+(-x+dcoords.x),
			dcoords.oy+(-y+dcoords.y)
		);
	}
},true)

*/