///* varinput.js
///* AS3600.js
///////////////    SETUP VARIABLE INPUTS     /////////////////////
// TODO: varinfodiv iframe is no longer relevant here! Remove it from the definition of the thing and replace with #help_bar_ etc



// first, create the global variables
var vin = {};
//vin.Ln     = new VarInput('Ln' , "$$$L_n$$$" , "number" , 4000, "mm");
vin.b      = new VarInput('b' , "$$$b$$$" , "number" , 300, "mm");
vin.D      = new VarInput('Depth' , "$$$D$$$" , "number" , 600, "mm");
vin.cover  = new VarInput('cover' , "Cover" , "number" , 25, "mm");
vin.df     = new VarInput('dfitments' , "$$$d_f$$$" , "number" , 10, "mm",[10, 12, 13, 14, 15, 15, 17, 18, 19, 20]);
vin.eclass = new VarInput('eclass' , "E. Class" , "text" , "A1", "",["A1","A2","B1","B2","C1","C2"]);
// TODO: SUPERVISOR Round bars http://www.onesteel.com/products.asp?action=showProduct&productID=52&categoryName=Bar%20Sections
//vin.rhoc   = new VarInput('rhoc', "$$$\\rho_c$$$" , "number" , 2400, "kg/m&#179;");
vin.fc     = new VarInput('fc' , "$$$f'_c$$$" , "number" , 32, "MPa",[20, 25, 32, 40, 50, 65, 80, 100]);


// append to dom and attatch a listener
for(var i in vin){
	vin[i].appendTo(document.querySelector("#invardiv-content"));
	vin[i].on("change",function(){
		mainUpdateListener()
	});
}




// A helper function for formating sstrings in html






vin.b.validate = function(e){
	//var e = {value:this.value, error:[], warning:[], info:[]};
	var link = '<a href="#help_bar_b">b</a> '
	
	
	var MIN_BREADTH = 150;
	var MAX_BREADTH = 2000;
	
	
	if(e.value == undefined || e.value == null|| isNaN(e.value)){
		e.warning.push(link+' Should not be left blank.');
	}else if(e.value%5!==0){
		e.error.push(link+" should be rounded to nearest 5mm.");
		// TODO: do not autocoorect rounding to 5mm because, firefox spin buttons stop working if you do.
		//e.value = Math.round(e.value/5)*5;
	}
	if(e.value<MIN_BREADTH){
		e.error.push(link+" is too small. Beams should be at least "+(MIN_BREADTH+"mm").bold()+" wide for this software to work.");
	}
	if(e.value>MAX_BREADTH){
		e.error.push(link+" is too large. Beams should be at most "+(MAX_BREADTH+"mm").bold()+" wide for this software to work.");
	}
	
	
	
	
	//8.9.2 Simply supported and continuous beams
		// For a simply supported or continuous beam, the distance L_l between points at which lateral
		// restraint is provided shall be such that L_l/bef does not exceed the lesser of 180bef/D and 60.
		// Here we assume beam Ln == L_1
	//var breadth_on_depth = e.value/vin.D.value;
	//var length_on_breadth = vin.Ln.value/e.value;
	//if(length_on_breadth>Math.min(60,180*breadth_on_depth)){
	//	e.warning.push(link+"L_n/b =  <b>"+length_on_breadth.toFixed(1)+"</b> > minimum(180*b/D , 60) = <b>"+Math.min(60,180*breadth_on_depth)+"</b> This beam is too slender! Assuming there is no lateral restraint on its length. See AS3600 8.9.2");
	//}// TODO: THIS CHECK HAS NO EFFECT!
	
	return e;
}


vin.D.validate = function(e){
	//var e = {value:this.value, error:[], warning:[], info:[]};
	var link = '<a href="#help_bar_Depth">D</a> '
	
	var MIN_DEPTH = 150;
	var MAX_DEPTH = 2000;
	
	if(e.value == undefined || e.value == null|| isNaN(e.value)){
		e.warning.push(link+' Should not be left blank.');
	}else if(e.value%5!==0){
		e.error.push(link+" should be rounded to nearest 5 mm.");
		//e.value = Math.round(e.value/5)*5;
	}
	if(e.value<MIN_DEPTH){
		e.error.push(link+" is too small. Beams  should be at least "+(MIN_DEPTH+" mm").bold()+" deep for this software to work.");
	}
	if(e.value>1500){
		e.error.push(link+"Beam too deep. Beams should be at most "+(MAX_DEPTH+" mm").bold()+" deep for this software to work.");
	}
	return e;
}


vin.cover.validate = function(e){
	/** cover
				match with eclass 4.10.3.2
				reasonable multiple
				not too big ?? how big is too big?
				not too small
	**/
	
	if(e.value == undefined || e.value == null|| isNaN(e.value)){
		e.warning.push('<a href="#help_bar_cover">Cover</a> Should not be left blank.');
	}else if(e.value> 150){
		// silent warning?
		e.warning.push('<a href="#help_bar_cover">Cover</a> might be too big... unless there is a special reason.');
	}else if(e.value< 20){
		// error
		e.error.push('<a href="#help_bar_cover">Cover</a> is too small');
		e.value = 20;
	}else{
		if(e.value%5!==0){
			e.error.push('<a href="#help_bar_cover">Cover</a> should be rounded to nearest 5 mm.');
			//e.value = Math.round(e.value/5)*5;
		}
		var min_cover = AS3600["4.10.3.2"].get_min_cover_from_fc_eclass(vin.fc.value, vin.eclass.value);
		if(min_cover!==undefined && e.value<min_cover){
			e.error.push('<a href="#help_bar_cover">Cover</a> insufficient for <a href="#help_bar_fc">f\'c</a> and <a href="#help_bar_eclass">Exposure Classification</a>. See AS3600 4.10.3.2: The minimum cover without special provisions is: ' + (min_cover+" mm").bold());
		}
	}
	return e;
}

vin.fc.validate = function(e){
	var minfc = AS3600["4.10.3.2"].get_min_fc_from_eclass(vin.eclass.value);
	var maxec = AS3600["4.10.3.2"].get_max_eclass_from_fc(vin.fc.value);
	if(minfc !== undefined){
		if(e.value < minfc){
			e.error.push('<a href="#help_bar_fc">f\'c</a> is too small for <a href="#help_bar_eclass">Exposure Classification</a>. See AS3600 4.10.3.2:<br>'+
							'The minimum f\c without special provisions is: '+(minfc+" MPa").bold()+"<br>"+
							'Alternatively, reduce <a href="#help_bar_eclass">Exposure Classification</a> to '+String(maxec).bold());
		}
	}
	return e;
}

