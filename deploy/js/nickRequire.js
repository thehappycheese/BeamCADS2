

(function(w){
	"use strict";

	try{
		var myscripttag = document.querySelectorAll('[data-main]')
		var main = myscripttag[0].getAttribute("data-main");
		var root = myscripttag[0].getAttribute("data-root");
	}catch(e){
		console.log("nickReqire.js --> Could not find [data-main] or [data-root] in document");
		return;
	}
	
	
	var inspected	= [];
	var toinspect 	= [main];
	var currentFile = null;
	
	var rules = [];
	var orders = [];
	
	w.compiled = "";
	
	loopInspect();

	function loopInspect(){
		if(toinspect.length>0){
			
			var url = toinspect.pop();
			currentFile = {url:url, after:[], name:getName(url), path:getPath(url), content:""};
			rules.push(currentFile);
			
			var xreq = new XMLHttpRequest();
				xreq.open("GET", root+"/"+url, true);
				xreq.onreadystatechange = textLoaded;
				xreq.ontimeout = function () { alert("nickReqire.js --> Build timed out!"); };
				xreq.onerror = function(e){
					// pass
				}
				xreq.timeout = 4000;
				try{
					xreq.send(null);
				}catch(e){
					// pass
				}
		}else{
			//console.log("nickReqire.js --> Inspection Complete!");
			order(rules);
		}
	}
	function textLoaded (e){
		if(e.target.readyState==4){
			if(e.target.status==200){
				var text = e.target.responseText.split(/\r?\n/);
				currentFile.content = e.target.responseText;
				
				for(var i = 0; i<text.length;i++){
					// =============== USE RELATIVE PATH ===============
					if(text[i].substr(0,4)=="///*"){
						var url = text[i].substr(5,text[i].length-5);
						toinspect.push(getPath(currentFile.url)+url);
						currentFile.after.push(getPath(currentFile.url)+url);
					}
					// =============== USE ROOT PATH ===========
					if(text[i].substr(0,4)=="///~"){
						var url = text[i].substr(5,text[i].length-5);
						toinspect.push(url);
						currentFile.after.push(url);
					}
				}
				loopInspect();
			}else{
				console.warn("nickReqire.js --> File inspection failed: "+currentFile.url);
			}
		}
	}
	
	
	function order(rule){
		var i, j;
		var satisfied = false;
		if(rule.length==0){
			// No rules have been made since the mainfile is the only file.
			orders.push(main);
			console.log("nickReqire.js --> Was "+main+" the only file you wanted?");
			loopLoad();
			
			return;
		}
		
		// TODO: remove duplicate imports:
		
		for(i=0;i<rule.length;i++){
			for(j=i+1;j<rule.length;j++){
				if(rule[i].url === rule[j].url){
					//console.log("removed duplicate import: " + rule[j].url);
					rule.splice(j,1);
					i--;
					break;
				}
			}
		}
		
		
		// orders is the list of script tag urls to load. rules contains all the file infos.
		for(i = 0; i< rule.length; i++){
			if(rule[i].after.length==0){
				if(rule[i].name.substr(rule[i].name.length-3)==".js"){
					w.compiled = w.compiled+"\n"+rule[i].content;
				}
				orders.push(rule[i].url);
				rule.splice(i--,1);
			}
		}
		
		var killcount = 1000;
		
		while(rule.length>0 && killcount>0){
			killcount--;
			
			// try to satisfy condition of each
			for(i = 0; i< rule.length; i++){
				satisfied = true;
				for(j=0;j<rule[i].after.length;j++){
					if(orders.indexOf(rule[i].after[j])==-1){
						satisfied = false;
						break;
					}
				}
				if(satisfied){
					w.compiled = w.compiled+"\n"+rule[i].content;
					orders.unshift(rule[i].url);
					rule.splice(i--,1);
				}
			}
		}
		
		if(rule.length>0){
			console.log(rule);
			throw new Error("nickReqire.js --> Cross dependancy error!");
		}
		
		loopLoad();
		
	}
	
	
	function loopLoad(){
		if(orders.length>0){
			var file = orders.pop();
			if(file.substr(file.length-4)==".css"){
				var link = document.createElement("link");
				link.onload = loopLoad;
				link.rel = "stylesheet"
				link.type = "text/css"
				link.href = root+"/"+file;
				document.head.appendChild(link);
			}else{
				var script = document.createElement("script");
				script.onload = loopLoad;
				script.src = root+"/"+file;
				document.head.appendChild(script);
			}
		}else{
			//console.log("nickReqire.js --> Build Complete!");
		}
	}

	
	
	
})(window);

function getName(url){
	var result = "";
	for(var i = url.length-1; i >=0; i--){
		if(url[i]!="/"){
			result = url[i] + result;
		}else{
			break;
		}
	}
	return result;
}
function getPath(url){
	var len = getName(url).length;
	return url.substring(0,url.length-len);
}