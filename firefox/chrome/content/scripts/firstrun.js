var flashaidFirstrun = {

		init: function(){//get current version from extension manager

			try {// Firefox <= 3.6

				//get current version from extension manager
				var gExtensionManager = Components.classes["@mozilla.org/extensions/manager;1"]
				.getService(Components.interfaces.nsIExtensionManager);
				var current = gExtensionManager.getItemForID("flashaid@lovinglinux.megabyet.net").version;

				flashaidFirstrun.updateInstall(current);
			}
			catch(e){// Firefox >=4.0

				//get current version from extension manager
				Components.utils.import("resource://gre/modules/AddonManager.jsm");

				AddonManager.getAddonByID("flashaid@lovinglinux.megabyet.net", function(addon) {

					var current = addon.version;
					flashaidFirstrun.updateInstall(current);
				});
			}
			window.removeEventListener("load",function(){ flashaidFirstrun.init(); },true);
		},

		updateInstall: function(aVersion){//check version and perform updates

			//access preferences interface
			this.prefs = Components.classes["@mozilla.org/preferences-service;1"]
			.getService(Components.interfaces.nsIPrefService)
			.getBranch("extensions.flashaid.");

			//fetch localization from strbundle
			var strbundle = document.getElementById("flashaidstrings");


			//firstrun, update and current declarations
			var ver = -1, firstrun = true;
			var current = aVersion;
			var terminalpath = false;

			try{//check for existing preferences
				ver = this.prefs.getCharPref("version");
				firstrun = this.prefs.getBoolPref("firstrun");
			}catch(e){
				//nothing
			}finally{

				if(firstrun){//actions specific for first installation

					var navbar = document.getElementById("nav-bar");
					var newset = navbar.currentSet + ",flashaid-toolbar-button";
					navbar.currentSet = newset;
					navbar.setAttribute("currentset", newset );
					document.persist("nav-bar", "currentset");

					//set preferences
					this.prefs.setBoolPref("firstrun",false);
					this.prefs.setCharPref("version",current);

					//get paths from environment variables
					var envpaths = Components.classes["@mozilla.org/process/environment;1"]
					.getService(Components.interfaces.nsIEnvironment)
					.get('PATH');

					if(envpaths){

						//split
						newpath = envpaths.split(":");

						//find
						for(var i=0; i< newpath.length; i++){

							//initiate file
							var gnometerminal = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
							gnometerminal.initWithPath(newpath[i]+"/gnome-terminal");
							if(gnometerminal.exists()){
								this.prefs.setCharPref("terminal",gnometerminal.path);
								terminalpath = true;
							}else{
								//initiate file
								var konsole = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
								konsole.initWithPath(newpath[i]+"/konsole");
								if(konsole.exists()){
									this.prefs.setCharPref("terminal",konsole.path);
									terminalpath = true;
								}else{
									//initiate file
									var xfce4 = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
									xfce4.initWithPath(newpath[i]+"/xfce4-terminal");
									if(xfce4.exists()){
										this.prefs.setCharPref("terminal",xfce4.path);
										terminalpath = true;
									}else{
										//initiate file
										var xterminal = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
										xterminal.initWithPath(newpath[i]+"/x-terminal-emulator");
										if(xterminal.exists()){
											this.prefs.setCharPref("terminal",xterminal.path);
											terminalpath = true;
										}
									}
								}
							}
						}
					}
					if(terminalpath === false){

						//reset terminal path
						this.prefs.setCharPref("terminal","");

						//alert user
						var message = strbundle.getString("terminalpath");
						var messagetitle = strbundle.getString("flashaidalert");
						var alertsService = Components.classes["@mozilla.org/alerts-service;1"]
						.getService(Components.interfaces.nsIAlertsService);
						alertsService.showAlertNotification("chrome://flashaid/skin/icon48.png",
								messagetitle, message,
								false, "", null);
					}
				}

				if(ver !== current && !firstrun){//actions specific for extension updates

					//set preferences
					this.prefs.setCharPref("version",current);
				}
			}
		},

		getSysInfo: function(){

			//declare release info
			var version, codename;

			//access preferences interface
			this.prefs = Components.classes["@mozilla.org/preferences-service;1"]
			.getService(Components.interfaces.nsIPrefService)
			.getBranch("extensions.flashaid.");

			//declare and inititate sourcefile with release info
			var sourcefile_path = "/etc/lsb-release";
			var sourcefile = Components.classes["@mozilla.org/file/local;1"]
			.createInstance(Components.interfaces.nsILocalFile);
			sourcefile.initWithPath(sourcefile_path);

			if(sourcefile.exists()){

				//read sourcefile and fetch lines with release info
				var istream = Components.classes["@mozilla.org/network/file-input-stream;1"].
				createInstance(Components.interfaces.nsIFileInputStream);
				istream.init(sourcefile, 0x01, 0444, 0);
				istream.QueryInterface(Components.interfaces.nsILineInputStream);

				var line = {}, lines = [], hasmore;
				do {
					hasmore = istream.readLine(line);
					lines.push(line.value);

					var matchversion = /DISTRIB_RELEASE=/.test(line.value);
					var matchcodename = /DISTRIB_CODENAME=/.test(line.value);

					if (matchversion == true) {
						version = line.value.replace(/DISTRIB_RELEASE=/g, "");
						this.prefs.setCharPref("osversion",version);
					}
					if (matchcodename == true) {
						var codename = line.value.replace(/DISTRIB_CODENAME=/g, "");
						this.prefs.setCharPref("oscodename",codename);
					}

				} while(hasmore);
				istream.close();
			}
		},

		flashBetaUpdate: function(){

			//get os architecture
			var osString = Components.classes["@mozilla.org/network/protocol;1?name=http"]
			.getService(Components.interfaces.nsIHttpProtocolHandler).oscpu;

			//access preferences interface
			this.prefs = Components.classes["@mozilla.org/preferences-service;1"]
			.getService(Components.interfaces.nsIPrefService)
			.getBranch("extensions.flashaid.");

			var updatealert = this.prefs.getBoolPref("updatealert");
			var lastflashupdate = this.prefs.getIntPref("lastflashupdate");

			//get date and time
			var currentDate = new Date();
			var cmonth = currentDate.getMonth();
			var month = cmonth+1;
			var MM = "0" + month;
			MM = MM.substring(MM.length-2, MM.length);
			var day = currentDate.getDate();
			var DD = "0" + day;
			DD = DD.substring(DD.length-2, DD.length);
			var YYYY = currentDate.getFullYear();
			var currenttimestamp = YYYY+MM+DD;

			if(updatealert === true){

				if(currenttimestamp > lastflashupdate){

					//change lastflashupdate to current timestamp
					this.prefs.setIntPref("lastflashupdate",currenttimestamp);

					//fetch localization from strbundle
					var strbundle = document.getElementById("flashaidstrings");
					var messagetitle = strbundle.getString("flashaidalert");

					var flashbetajson, xmlsource, jsonObjectLocal, jsonObjectRemote, JSONtimestamp, req, localtimestamp, remotetimestamp, message, architecture;

					try{
						//get current timestamp
						flashbetajson = this.prefs.getCharPref("flashbetaupdate");
					}catch(e){

						flashbetajson = {};
						flashbetajson.flashbeta32 = currenttimestamp;
						flashbetajson.flashbeta64 = currenttimestamp;
						JSONtimestamp = JSON.stringify(flashbetajson);

						//set timestamp
						this.prefs.setCharPref("flashbetaupdate",JSONtimestamp);
						localtimestamp = currenttimestamp;

					}finally{

						//get current timestamp from  prefs
						jsonObjectLocal = JSON.parse(flashbetajson);

						if(osString.match(/x86_64/)){
							localtimestamp = jsonObjectLocal.flashbeta64;
						}else{
							localtimestamp = jsonObjectLocal.flashbeta32;
						}
					}

					try{
						//declare json source
						xmlsource = "http://updates.webgapps.org/flashbeta";

						//get json document content
						req = new XMLHttpRequest();   
						req.open('GET', xmlsource, true);
						req.channel.loadFlags |= Components.interfaces.nsIRequest.LOAD_BYPASS_CACHE;
						req.onreadystatechange = function () {

							if (this.readyState == 4 && this.status == 200) {

								//access preferences interface
								this.prefs = Components.classes["@mozilla.org/preferences-service;1"]
								.getService(Components.interfaces.nsIPrefService)
								.getBranch("extensions.flashaid.");

								//parse json
								jsonObjectRemote = JSON.parse(req.responseText);

								if(osString.match(/x86_64/)){
									architecture = "Flash 64bit";
									remotetimestamp = jsonObjectRemote.flashbeta64;
								}else{
									architecture = "Flash 32bit";
									remotetimestamp = jsonObjectRemote.flashbeta32;
								}

								if(remotetimestamp > localtimestamp){

									//fetch message
									message = strbundle.getFormattedString("flashbetaupdate", [ architecture ]);
									//prompt user for confirmation
									var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
									.getService(Components.interfaces.nsIPromptService);
									var result = prompts.confirm(window, messagetitle, message);

									if(result == true){//execute if user confirm

										window.open('chrome://flashaid/content/runner.xul', 'flashaid-runner', 'chrome,centerscreen,alwaysRaised');
									}
									this.prefs.setCharPref("flashbetaupdate",req.responseText);
								}
							}
						};
						req.send(null);
					}catch(e){
						//do nothing
					}
				}
			}
		},

		resetNeedRestart: function(){
			//access preferences interface
			this.prefs = Components.classes["@mozilla.org/preferences-service;1"]
			.getService(Components.interfaces.nsIPrefService)
			.getBranch("extensions.flashaid.");

			this.prefs.setBoolPref("needrestart",false);
		}
};
//event listeners to call the functions when Firefox starts
window.addEventListener("load",function(){ flashaidFirstrun.init(); },true);
window.addEventListener("load", function(e) { setTimeout(function () { flashaidFirstrun.getSysInfo(); }, 500); }, false);
window.addEventListener("load", function(e) { setTimeout(function () { flashaidFirstrun.flashBetaUpdate(); }, 5000); }, false);
window.addEventListener("unload", function(e) { flashaidFirstrun.resetNeedRestart(); }, false);
