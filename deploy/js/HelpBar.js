

///* tinyxhr.js




function HelpBar(arg_host){
	this.host = document.getElementById(arg_host);
	this.data = null;
	this.startload = function(){
		tinyxhr("infos/infos.json",function(err,text,xhr){
			if(err && !text){
				console.log("Failed to load help bar json content");
				throw err;
			}
			this.data = JSON.parse(text)
			this.init()
		}.bind(this));
		
		// Add a listner or an interval to check for hash change events
		
		 if ("onhashchange" in window) {
			 window.addEventListener("hashchange",this.hashChangeListener,false);
		}else {
			this.prevHash = window.location.hash;
			window.setInterval(function () {
			   if (window.location.hash != this.prevHash) {
				  this.prevHash = window.location.hash;
				  this.hashChangeListener(this.prevHash);
			   }
			}.bind(this), 100);
		}
		
		
	}.bind(this)
	
	this.init=function(){
		this.buildBar();
		try{
			MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
		}catch(e){
			console.log("Failed to typeset help bar",e);
		}
		ttips.grab(this.host);
	}.bind(this);
	
	
	
	
	
	this.buildBar = function (){
		var indexdiv = makeDiv("help_bar_index","helpblock");
		this.host.appendChild(indexdiv)
		var items = [];
		// convert object to array for sorting:
		for(var k in this.data){
			items.push(this.data[k]);
		}
		items.sort(function(a,b){
			return a.unicode.localeCompare(b.unicode)
		})
		var indexhtml = "<div><h1>Help Index</h1>";
		for(var i = 0;i<items.length;i++){
			this.host.appendChild(makeHelpBlock(items[i],this.data));
			//indexhtml +='<a href="#help_bar_'+items[i].id+'">$$$'+items[i].notation+'$$$ '+items[i].name+'</a>';
			indexhtml += makeIndexLink(items[i])
		}
		indexhtml +="</div>"
		indexdiv.innerHTML = indexhtml;
		
		
		function makeIndexLink(item){
			var html ="";
			if(item.id){
				html+= '<a href="#help_bar_'+item.id+'">';
			}
				html+= '<table class="help_bar_link" data-tooltip="'+item.description+'"><tr>';
				html+= '<td class="c1">$$$'+item.notation+'$$$</td><td class="c2">'+item.name+'</td>';
				html+= "</tr></table>";
			if(item.id){
				html+= "</a>";
			}
			return html;
		}
		function makeHelpBlock(item,data){
			var result = makeDiv("help_bar_"+item.id,"helpblock");
			var html = "";
			html += '<a href="#help_block_index" style="display:block;line-height:40px;height:40px;text-align:center;">Back to Help Index.</a>'
			html += '<h1>'+
						((item.notation)?("$$$"+item.notation+"$$$ "):"")+
						item.name+
						((item.unit)?(" ("+item.unit+")"):"")+
					"</h1>";
			if(item.description){
				html += "<p><b>"+item.description+"</b></p>";
			}
			html += item.docs;
			if(item.coderef.length>0){
				html += '<table class="help_bar_coderef">';
				for(var i = 0;i<item.coderef.length;i++){
					html+='<tr><td class="c1">'+item.coderef[i].ref+'</td><td class="c2">'+item.coderef[i].data+"</td></tr>";
				}
				html+="</table>";
			}
			if(item.related.length>0){
				html += "<h2>Related:</h2>";
				item.related.sort();
				for(var i = 0;i<item.related.length;i++){
					// TRY TO FIND THE RELATED item in this.data
					try{
						// Create a link
						html +=  makeIndexLink(data[item.related[i]]);
					}catch(e){
						// show non-link
						html +=  makeIndexLink({id:"",notation:"",name:item.related[i]});
					}
				}
			}
			result.innerHTML = html;
			result.style.display="none";
			return result;
		}
		
		
		function makeDiv(id,classname){
			var result = document.createElement("div");
			result.id = id || "";
			result.className = classname || "";
			return result;
		}
		
	}.bind(this);
	
	this.hideAll = function(){
		var els = this.host.children;
		for(var i = 0; i < els.length; i++){
			els[i].style.display = "none";
		}
	}.bind(this);
	
	this.hashChangeListener = function(e){
		var new_hash = undefined;
		if(typeof e === "string"){
			new_hash = e.split("#")[1];
		}else{
			try{
				new_hash = e.newURL.split("#")[1];
			}catch(e){
				new_hash = window.location.hash.split("#")[1];
			}
		}
		
		this.hideAll();
		if(new_hash){
			var element_to_make_visible = this.host.querySelector("#"+new_hash);
			if(!element_to_make_visible){
				element_to_make_visible = this.host.querySelector("#help_bar_index");
			}
			element_to_make_visible.style.display = "";
		}else{
			var element_to_make_visible = this.host.querySelector("#help_bar_index");
			element_to_make_visible.style.display = "";
		}
		
	}.bind(this);
	
	
	
	window.open("#","_self");
	this.startload();
}

















