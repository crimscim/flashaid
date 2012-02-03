var flashaidLauncher = {

		scriptManager: function(aMethod){

			"use strict";

			//access preferences interface
			this.prefs = Components.classes["@mozilla.org/preferences-service;1"]
			.getService(Components.interfaces.nsIPrefService)
			.getBranch("extensions.flashaid.");

			//get preferences
			var needrestart = this.prefs.getBoolPref("needrestart");
			var ssl = this.prefs.getBoolPref("ssl");
			var datawebgapps = this.prefs.getCharPref("datawebgapps");
			var jsonObjectLocal = JSON.parse(datawebgapps);
			var hash = jsonObjectLocal.flashbeta32[0].hash;
			
			//fetch date and time
			var currenttimestamp = flashaidCommon.dateManager('datestamp');

			//fetch localization from strbundle
			var strbundle = document.getElementById("flashaidstrings");
			var messagetitle = strbundle.getString("flashaidalert");
			var message, prompts, result = false, data, JSONdata;

			if(needrestart === true){//check if user restarted the browser after running the script

				message = strbundle.getString("needrestart");
				//alert user
				prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
				.getService(Components.interfaces.nsIPromptService);
				prompts.alert(window, messagetitle, message);

			}else{
				
				if(ssl === false){
					//alert user
					message = strbundle.getString("sslerror");
					prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
					.getService(Components.interfaces.nsIPromptService);
					result = prompts.confirm(window, messagetitle, message);
					
					if(result == true){//execute if user confirm
						data = {};
						data.flashbeta32 = [{"timestamp":"20120119","version":"*","url":"http://download.macromedia.com/pub/labs/flashplatformruntimes/flashplayer11-2/flashplayer11-2_p4_install_lin_32_011912.tar.gz","hash":"*"}];
						data.flashbeta64 = [{"timestamp":"20120119","version":"*","url":"http://download.macromedia.com/pub/labs/flashplatformruntimes/flashplayer11-2/flashplayer11-2_p4_install_lin_64_011912.tar.gz","hash":"*"}];
						JSONdata = JSON.stringify(data);
 						this.prefs.setCharPref("datawebgapps",JSONdata);
					}else{
						if(hash === "*"){
							this.prefs.clearUserPref("datawebgapps");	
						}
					}
				}

				if(aMethod === "stable" || aMethod === "beta" || aMethod === "chrome"){
					flashaidQuick.scriptManager(aMethod);
				}
				if(aMethod === "wizard"){
					window.open('chrome://flashaid/content/wizard.xul', 'flashaid-wizard', 'chrome,centerscreen,alwaysRaised');
				}
				if(aMethod === "advanced"){
					window.open('chrome://flashaid/content/advanced.xul', 'flashaid-advanced', 'chrome,centerscreen,alwaysRaised');
				}
			}
		}
};