

///* function.dim.js

///* Beam.drawSection.js
///* Beam.drawStressBlock.js

///* ReoInput.js
///* ReoManager.js
///* ProTips.js
///* CalcDiv.js
///* HelpBar.js


// Order matters for these ones :(
///* main.function.outputCalculations.js
///* main.code.setupVatiableInputs.js



setTimeout(function(){
try{
	var v = parseInt(localStorage.getItem("visits"));
	if(v==null || v==undefined || isNaN(v)){
		v=0;
	}
	if(v<3){
		var el = document.getElementById("apptitlebox");
		el.style.outline="red 4px dashed";
		alert("When you are ready, open the tutorial & survey with the red link in the top left corner. \n\n This message will be displayed the first 3 times you open this page.");
		el.style.outline="";
	}else{
	}
	v++;
	localStorage.setItem("visits", v);

}catch(e){
}},2000);


///////////////  HELP BAR SETUP  ///////////////////////////
var helpBar  = new HelpBar("varinfodiv")


///////////////    SETUP TOOLTIPS     /////////////////////
var ttips = new ProTips(document.querySelector("#protips"));



ttips.add(vin.b.body,"Breadth or Width of beam.");
ttips.add(vin.D.body,"Depth or height of beam.");
ttips.add(vin.cover.body,"Distance from outer surface to the steel embedded in the beam.");
ttips.add(vin.eclass.body,"Exposure Classification. A designation of the harshness of the beam's enviroment. <b>See AS3600 Table 4.3</b>");
ttips.add(vin.df.body,"Diameter of 'fitments' which make up the 'ribcage' of the beam. This software uses <b>Standard Round Bar Diameters</b>");
ttips.add(vin.fc.body,"The concrete strength (standard grades only. See AS3600 3.1.1.1)");




///////////////    SETUP BEAM OBJECT     /////////////////////
// Create global beam object
var b = new Beam();

///////////////     SETUP REO MANAGER     /////////////////////
var rman = new ReoManager(document.querySelector("#reorows"), b);
rman.on("change",mainUpdateListener);







/////////////////// SETUP CANVAS VARIABLES //////////////////////////////

var cs_canvas = document.querySelector("#crosssectioncanvas");
var cs_ctx = cs_canvas.getContext('2d');



//////////////// INITIAL BEAM CONFIGURATION //////////////////////////
rman.rows[0].barcode = "3N32";
//rman.rows[1].enabled = true;
//rman.rows[1].offset = 80;
//rman.rows[2].enabled = true;
//rman.rows[2].offset = 80;
//rman.rows[3].enabled = true;
rman.rows[2].from = "highest";
rman.rows[3].from = "highest";



///////////////// FINALIZE TOOLTIPS //////////////////////////
ttips.grab(document.body);

///////////////////// MAIN UPDATE LISTENER  /////////////////////////////
mainUpdateListener()
function mainUpdateListener(e){
	
	
	intakeBeamValues();
	
	document.querySelector("#reosumarea").innerHTML = b.As || "";
	
	b.drawStressBlock(document.querySelector(".dncanvas").getContext('2d'));
	collapseCalcs();
	flagCalcsForUpdate();
	b.drawSection(cs_ctx);
	
	updateErrorOutput();
	
	
	
}



function updateErrorOutput(){
	var err_list = [];
	var war_list = [];
	for(var i in vin){
		var v = vin[i].getValidity()
		err_list = err_list.concat(v.error);
		war_list = war_list.concat(v.warning);
	}
	var rs = rman.getEnabledRows()
	for(var i = 0; i<rs.length; i++){
		var v = rs[i].getValidity(b.dn);
		err_list = err_list.concat(v.error);
		war_list = war_list.concat(v.warning);
	}
	
	if(b.kuo < 0.1){
		err_list.push('<a href="#help_bar_kuo">k<sub>uo</sub></a> &lt;0.1 The beam may be under-reinforced. See calculations below.');
	}else if(b.kuo>0.36){
		err_list.push('<a href="#help_bar_kuo">k<sub>uo</sub></a> &gt;0.36 The beam may be over-reinforced. See calculations below. See AS3600 8.1.5');
	}
	
	if(b.Muo<b.Muo_min){
		err_list.push('<a href="#help_bar_Muo">M<sub>uo</sub></a> &lt; <a href="#help_bar_Muo_min">(M<sub>uo</sub>)<sub>min</sub></a> ( '+b.Muo.toFixed(0)+'kNm < '+b.Muo_min.toFixed(0)+'kNm). See AS3600 8.6.1.');
	}
	
	
	ttips.setError(err_list, war_list);
}


function intakeBeamValues(){
	b.b			= Math.max(150, vin.b.value) || 200;
	b.D			= Math.max(150, vin.D.value) || 300;
	b.cover		= Math.max(5, vin.cover.value);
	b.eclass	= vin.eclass.value;
	b.df		= vin.df.value;
	b.fc		= vin.fc.value;
	b.reo		= rman.value;
	
	for(var i in vin){
		vin[i].update_validity();
	}
	for(var i in rman.rows){
		rman.rows[i].update_validity();
	}
}









///////////// CALCS HELPER FUNCTIONS ////////////////

var calculationdiv = document.querySelector("#calcdiv-content");
initCalcs(calculationdiv);



function initCalcs(calculationdiv){
	calc.alpha2.appendTo(calculationdiv)
	calc.dn.appendTo(calculationdiv);
	calc.Muo.appendTo(calculationdiv);
	calc.kuo.appendTo(calculationdiv);
	calc.phi.appendTo(calculationdiv);
	calc.phiMuo.appendTo(calculationdiv);
	calc.checks.appendTo(calculationdiv);
}

var calc_update_timeout_id = null;

function flagCalcsForUpdate(){
	clearTimeout(calc_update_timeout_id);
	calc_update_timeout_id = setTimeout(updateCalculations,500);
}
function updateCalculations(){
	calc_update_timeout_id = null;
	
	calc.alpha2.updateTitle();
	calc.dn.updateTitle();
	calc.Muo.updateTitle();
	calc.kuo.updateTitle();
	calc.phi.updateTitle();
	calc.phiMuo.updateTitle();
	calc.checks.updateTitle();
}

function collapseCalcs(){
	calc.alpha2.collapsed = true;
	calc.dn.collapsed = true;
	calc.Muo.collapsed = true;
	calc.kuo.collapsed = true;
	calc.phi.collapsed = true;
	calc.phiMuo.collapsed = true;
	calc.checks.collapsed = true;
}






function printcalcs(){
	
	var w = window.open("","_blank","width=1500,height=700, top=100,left=100");

	w.document.write('<link rel="stylesheet" href="style/index.css" type="text/css">');

	w.document.write('<div style="width:100%;">BEAMCALCS:</div><hr />');

	//w.document.head.innerHTML = head;
	
	var cnv = document.querySelectorAll("canvas");
	
	for(var i = 0;i<cnv. length;i++){
		var img = w.document.createElement("img");
		img.src = cnv[i].toDataURL();
		w.document.body.appendChild(img);
		img.style.marginLeft = "auto";
		img.style.marginRight = "auto";
		img.style.display = "block";
	}

	var div = w.document.createElement('div');
	w.document.body.appendChild(div);
	
	w.document.body.style.width = "calc(100% - 1cm)";
	w.document.body.style.margin = "0.5cm";
	w.document.body.style.display = "block";
	w.document.body.style.background = "white";

	calc.alpha2.appendTo(div);
	calc.dn.appendTo(div);
	calc.Muo.appendTo(div);
	calc.kuo.appendTo(div);
	calc.phi.appendTo(div);
	calc.phiMuo.appendTo(div);
	calc.checks.appendTo(div);
	
	calc.alpha2.collapsed = false;
	calc.dn.collapsed = false;
	calc.Muo.collapsed = false;
	calc.kuo.collapsed = false;
	calc.phi.collapsed =false;
	calc.phiMuo.collapsed =false;
	calc.checks.collapsed =false;
	
	MathJax.Hub.Queue(function () {
		w.print();
		w.close();
		initCalcs(calculationdiv);
	});
	
}






