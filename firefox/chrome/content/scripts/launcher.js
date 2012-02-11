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
			var remotedata = this.prefs.getCharPref("remotedata");
			var jsonObjectLocal = JSON.parse(remotedata);
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