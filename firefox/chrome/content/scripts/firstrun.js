var flashaidFirstrun = {

		init: function(){//get current version from extension manager

			"use strict";

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
			
			"use strict";

			//access preferences interface
			this.prefs = Components.classes["@mozilla.org/preferences-service;1"]
			.getService(Components.interfaces.nsIPrefService)
			.getBranch("extensions.flashaid.");

			//reset prefs
			this.prefs.setBoolPref("sudo",false);
			this.prefs.setBoolPref("apt",false);
			this.prefs.setBoolPref("wget",false);
			this.prefs.setBoolPref("md5sum",false);

			//firstrun, update and current declarations
			var ver = -1, firstrun = true;
			var current = aVersion;

			try{//check for existing preferences
				ver = this.prefs.getCharPref("version");
				firstrun = this.prefs.getBoolPref("firstrun");
			}catch(e){
				//nothing
			}finally{

				if(firstrun){//actions specific for first installation

					//add toolbar button
					var navbar = document.getElementById("nav-bar");
					var newset = navbar.currentSet + ",flashaid-toolbar-button";
					navbar.currentSet = newset;
					navbar.setAttribute("currentset", newset );
					document.persist("nav-bar", "currentset");

					//set preferences
					this.prefs.setBoolPref("firstrun",false);
					this.prefs.setCharPref("version",current);
				}

				if(ver !== current && !firstrun){//actions specific for extension updates

					//set preferences
					this.prefs.setCharPref("version",current);
				}

				try{
					//initiate file
					var apt = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
					apt.initWithPath("/etc/apt");
					if(apt.exists()){
						this.prefs.setBoolPref("apt",true);
					}
				}catch(e){
					//do nothing
				}

				//get paths from environment variables
				var envpaths = Components.classes["@mozilla.org/process/environment;1"]
				.getService(Components.interfaces.nsIEnvironment)
				.get('PATH');

				if(envpaths){

					//split
					var newpath = envpaths.split(":");

					//find
					for(var i=0; i< newpath.length; i++){

						if(firstrun){
							
							try{
								//initiate file
								var xterminal = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
								xterminal.initWithPath(newpath[i]+"/x-terminal-emulator");
								if(xterminal.exists()){
									this.prefs.setCharPref("terminal",xterminal.path);
								}
							}catch(e){
								//do nothing
							}
							try{
								//initiate file
								var xfce4 = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
								xfce4.initWithPath(newpath[i]+"/xfce4-terminal");
								if(xfce4.exists()){
									this.prefs.setCharPref("terminal",xfce4.path);
								}
							}catch(e){
								//do nothing
							}
							try{
								//initiate file
								var konsole = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
								konsole.initWithPath(newpath[i]+"/konsole");
								if(konsole.exists()){
									this.prefs.setCharPref("terminal",konsole.path);
								}
							}catch(e){
								//do nothing
							}
							try{
								//initiate file
								var gnometerminal = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
								gnometerminal.initWithPath(newpath[i]+"/gnome-terminal");
								if(gnometerminal.exists()){
									this.prefs.setCharPref("terminal",gnometerminal.path);
								}
							}catch(e){
								//do nothing
							}
						}
						try{
							//initiate file
							var sudo = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
							sudo.initWithPath(newpath[i]+"/sudo");
							if(sudo.exists()){
								this.prefs.setBoolPref("sudo",true);
							}
						}catch(e){
							//do nothing
						}
						try{
							//initiate file
							var wget = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
							wget.initWithPath(newpath[i]+"/wget");
							if(wget.exists()){
								this.prefs.setBoolPref("wget",true);
							}
						}catch(e){
							//do nothing
						}
						try{
							//initiate file
							var apt = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
							apt.initWithPath(newpath[i]+"/apt");
							if(apt.exists()){
								this.prefs.setBoolPref("apt",true);
							}
						}catch(e){
							//do nothing
						}
						try{
							//initiate file
							var md5sum = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
							md5sum.initWithPath(newpath[i]+"/md5sum");
							if(md5sum.exists()){
								this.prefs.setBoolPref("md5sum",true);
							}
						}catch(e){
							//do nothing
						}
					}
				}

				if(firstrun){//actions specific for first installation
					setTimeout(function () { flashaidFirstrun.firstrunAlert(); }, 1500);
					setTimeout(function () { flashaidFirstrun.flashBetaUpdate('auto'); }, 5000);
				}
			}
		},

		firstrunAlert: function(){

			"use strict";

			//fetch localization from strbundle
			var strbundle = document.getElementById("flashaidstrings");

			//alert user
			var message = strbundle.getString("firstinstall");
			var messagetitle = strbundle.getString("flashaidalert");
			var alertsService = Components.classes["@mozilla.org/alerts-service;1"]
			.getService(Components.interfaces.nsIAlertsService);
			alertsService.showAlertNotification("chrome://flashaid/skin/icon32.png", messagetitle, message,	false, "", null);
		},

		getSysInfo: function(){

			"use strict";

			//declare release info
			var distro, version, codename;
			
			//get os architecture
			var osstring = Components.classes["@mozilla.org/network/protocol;1?name=http"]
			.getService(Components.interfaces.nsIHttpProtocolHandler).oscpu;

			//access preferences interface
			this.prefs = Components.classes["@mozilla.org/preferences-service;1"]
			.getService(Components.interfaces.nsIPrefService)
			.getBranch("extensions.flashaid.");
			
			//uate prefs
			this.prefs.setCharPref("osstring",osstring);
			
			try{
				//declare and inititate sourcefile with release info
				var sourcefile_path = "/etc/lsb-release";
				var sourcefile = Components.classes["@mozilla.org/file/local;1"]
				.createInstance(Components.interfaces.nsILocalFile);
				sourcefile.initWithPath(sourcefile_path);
				
				if(sourcefile.exists()){

					//read sourcefile and fetch lines with release info
					var istream = Components.classes["@mozilla.org/network/file-input-stream;1"].
					createInstance(Components.interfaces.nsIFileInputStream);
					istream.init(sourcefile, -1, 0, 0);
					istream.QueryInterface(Components.interfaces.nsILineInputStream);

					var line = {}, lines = [], hasmore;
					do {
						hasmore = istream.readLine(line);
						lines.push(line.value);

						var matchdistro = /DISTRIB_ID=/.test(line.value);
						var matchversion = /DISTRIB_RELEASE=/.test(line.value);
						var matchcodename = /DISTRIB_CODENAME=/.test(line.value);

						if (matchdistro == true) {
							distro = line.value.replace(/DISTRIB_ID=/g, "");
							this.prefs.setCharPref("osdistro",distro);
						}
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
			}catch(e){
				//do nothing
			}
			try{
				//reset pref
				this.prefs.setBoolPref("partner",false);
				
				//declare and inititate sourcefile with release info
				var sourcefile_path = "/etc/apt/sources.list";
				var sourcefile = Components.classes["@mozilla.org/file/local;1"]
				.createInstance(Components.interfaces.nsILocalFile);
				sourcefile.initWithPath(sourcefile_path);
				
				if(sourcefile.exists()){

					//read sourcefile and fetch lines with release info
					var istream = Components.classes["@mozilla.org/network/file-input-stream;1"].
					createInstance(Components.interfaces.nsIFileInputStream);
					istream.init(sourcefile, -1, 0, 0);
					istream.QueryInterface(Components.interfaces.nsILineInputStream);

					var line = {}, lines = [], hasmore;
					do {
						hasmore = istream.readLine(line);
						lines.push(line.value);

						var matchrepo = /deb http:\/\/archive.canonical.com\/ubuntu.*partner/.test(line.value);
						var matchcomment = /#/.test(line.value);

						if (matchrepo == true) {
							if(matchcomment === false){
								this.prefs.setBoolPref("partner",true);
							}
						}
					} while(hasmore);
					istream.close();
				}
			}catch(e){
				//do nothing
			}
		},
		
		forceflashBetaUpdate: function(){
			
			//access preferences interface
			this.prefs = Components.classes["@mozilla.org/preferences-service;1"]
			.getService(Components.interfaces.nsIPrefService)
			.getBranch("extensions.flashaid.");
			
			//get date from prefs
			var newdate = flashaidCommon.dateManager('datestamp')-1;
			//reset date in prefs
			this.prefs.setIntPref("dataupdate",newdate);
			//launch update manager
			flashaidFirstrun.flashBetaUpdate('manual');
		},

		flashBetaUpdate: function(aMode){

			"use strict";

			//access preferences interface
			this.prefs = Components.classes["@mozilla.org/preferences-service;1"]
			.getService(Components.interfaces.nsIPrefService)
			.getBranch("extensions.flashaid.");

			var osstring = this.prefs.getCharPref("osstring");
			var dataupdate = this.prefs.getIntPref("dataupdate");
			var remotetest = this.prefs.getCharPref("remotetest");
			var remoteurl = this.prefs.getCharPref("remoteurl");

			//get date and time
			var currenttimestamp = flashaidCommon.dateManager('datestamp');

			if(currenttimestamp > dataupdate){

				//change dataupdate to current timestamp
				this.prefs.setIntPref("dataupdate",currenttimestamp);
				this.prefs.setBoolPref("ssl",false);

				//fetch localization from strbundle
				var strbundle = document.getElementById("flashaidstrings");
				var messagetitle = strbundle.getString("flashaidalert");

				var remotedata, xmlsource, jsonObjectLocal, jsonObjectRemote, JSONtimestamp, req, localtimestamp, remotetimestamp, message, architecture;

				try{
					//get current timestamp
					remotedata = this.prefs.getCharPref("remotedata");

					//get current timestamp from  prefs
					jsonObjectLocal = JSON.parse(remotedata);

					if(osstring.match(/x86_64/)){
						localtimestamp = jsonObjectLocal.flashbeta64[0].timestamp;
					}else{
						localtimestamp = jsonObjectLocal.flashbeta32[0].timestamp;
					}
				}catch(e){
					localtimestamp = "0";
				}

				try{

					var httpRequest = Components.classes["@mozilla.org/xmlextras/xmlhttprequest;1"].createInstance();
					// Disable alert popups on SSL error
					httpRequest.mozBackgroundRequest = true;
					httpRequest.open("GET", remotetest, true); 	
					httpRequest.onreadystatechange = function (aEvt) {  
						if (httpRequest.readyState == 4) {

							//validate SSL
							var auhtentication = flashaidFirstrun.flashBetaUpdateSSL(httpRequest.channel);

							if(auhtentication === "ok"){

								//get json document content
								req = Components.classes["@mozilla.org/xmlextras/xmlhttprequest;1"].createInstance();
								req.open('GET', remoteurl, true);
								req.channel.loadFlags |= Components.interfaces.nsIRequest.LOAD_BYPASS_CACHE;
								req.onreadystatechange = function () {

									if (this.readyState == 4 && this.status == 200) {

										//access preferences interface
										this.prefs = Components.classes["@mozilla.org/preferences-service;1"]
										.getService(Components.interfaces.nsIPrefService)
										.getBranch("extensions.flashaid.");
										
										//set pref
										this.prefs.setBoolPref("ssl",true);

										//parse json
										jsonObjectRemote = JSON.parse(req.responseText);
										this.prefs.setCharPref("remotedata",req.responseText);
										
										if(osstring.match(/x86_64/)){
											architecture = "Flash 64bit Beta";
											remotetimestamp = jsonObjectRemote.flashbeta64[0].timestamp;
										}else{
											architecture = "Flash 32bit Beta";
											remotetimestamp = jsonObjectRemote.flashbeta32[0].timestamp;
										}

										if(remotetimestamp > localtimestamp){
											
											//fetch message
											message = strbundle.getFormattedString("flashbetaupdate", [ architecture ]);
											//alert user
											var alertsService = Components.classes["@mozilla.org/alerts-service;1"]
											.getService(Components.interfaces.nsIAlertsService);
											alertsService.showAlertNotification("chrome://flashaid/skin/icon32.png", messagetitle, message,	false, "", null);

										}else{
											if(aMode === "manual"){
												//fetch message
												message = strbundle.getString("noupdate");
												//alert user
												var alertsService = Components.classes["@mozilla.org/alerts-service;1"]
												.getService(Components.interfaces.nsIAlertsService);
												alertsService.showAlertNotification("chrome://flashaid/skin/icon32.png", messagetitle, message,	false, "", null);
											}
										}
									}
								};
								req.send(null);
							}else{
								if(aMode === "manual"){
									//fetch message
									message = strbundle.getString("nossl");
									//alert user
									var alertsService = Components.classes["@mozilla.org/alerts-service;1"]
									.getService(Components.interfaces.nsIAlertsService);
									alertsService.showAlertNotification("chrome://flashaid/skin/icon32.png", messagetitle, message,	false, "", null);
								}
							}
						}
					};
					httpRequest.send(null);
				}catch(e){
					if(aMode === "manual"){
						//fetch message
						message = strbundle.getString("nossl");
						//alert user
						var alertsService = Components.classes["@mozilla.org/alerts-service;1"]
						.getService(Components.interfaces.nsIAlertsService);
						alertsService.showAlertNotification("chrome://flashaid/skin/icon32.png", messagetitle, message,	false, "", null);
					}
				}
			}
		},

		flashBetaUpdateSSL: function(channel){

			"use strict";

			var security;
			var auhtentication = false;

			try {
				const Ci = Components.interfaces;

				//invalid channel
				if (! channel instanceof  Ci.nsIChannel) {
					return auhtentication;
				}

				//security check
				var secInfo = channel.securityInfo;
				if (secInfo instanceof Ci.nsITransportSecurityInfo) {

					secInfo.QueryInterface(Ci.nsITransportSecurityInfo);

					// Check security state flags
					if ((secInfo.securityState & Ci.nsIWebProgressListener.STATE_IS_SECURE) == Ci.nsIWebProgressListener.STATE_IS_SECURE){
						security = "secure";
					}else if ((secInfo.securityState & Ci.nsIWebProgressListener.STATE_IS_INSECURE) == Ci.nsIWebProgressListener.STATE_IS_INSECURE){
						security = "insecure";
					}else if ((secInfo.securityState & Ci.nsIWebProgressListener.STATE_IS_BROKEN) == Ci.nsIWebProgressListener.STATE_IS_BROKEN){
						security = "unknown";
					}
				}
				else {
					security = "unknown";
				}

				if(security === "secure"){

					//return SSL certificate details
					if (secInfo instanceof Ci.nsISSLStatusProvider) {

						var cert = secInfo.QueryInterface(Ci.nsISSLStatusProvider).
						SSLStatus.QueryInterface(Ci.nsISSLStatus).serverCert;

						var verificationResult = cert.verifyForUsage(Ci.nsIX509Cert.CERT_USAGE_SSLServer);

						switch (verificationResult) {
						case Ci.nsIX509Cert.VERIFIED_OK:
							auhtentication = "ok";
							break;
						case Ci.nsIX509Cert.NOT_VERIFIED_UNKNOWN:
							auhtentication = "not verfied/unknown";
							break;
						case Ci.nsIX509Cert.CERT_REVOKED:
							auhtentication = "revoked";
							break;
						case Ci.nsIX509Cert.CERT_EXPIRED:
							auhtentication = "expired";
							break;
						case Ci.nsIX509Cert.CERT_NOT_TRUSTED:
							auhtentication = "not trusted";
							break;
						case Ci.nsIX509Cert.ISSUER_NOT_TRUSTED:
							auhtentication = "issuer not trusted";
							break;
						case Ci.nsIX509Cert.ISSUER_UNKNOWN:
							auhtentication = "issuer unknown";
							break;
						case Ci.nsIX509Cert.INVALID_CA:
							auhtentication = "invalid CA";
							break;
						default:
							auhtentication = "unexpected failure";
						break;
						}
					}
				}
			} catch(e) {
				//do nothing
			}
			return auhtentication;
		},

		resetNeedRestart: function(){

			"use strict";

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
window.addEventListener("unload", function(e) { flashaidFirstrun.resetNeedRestart(); }, false);
