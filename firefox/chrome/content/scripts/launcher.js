var flashaidLauncher = {

		scriptManager: function(aMethod){

			//access preferences interface
			this.prefs = Components.classes["@mozilla.org/preferences-service;1"]
			.getService(Components.interfaces.nsIPrefService)
			.getBranch("extensions.flashaid.");

			//get preferences
			var needrestart = this.prefs.getBoolPref("needrestart");

			//fetch localization from strbundle
			var strbundle = document.getElementById("flashaidstrings");
			var messagetitle = strbundle.getString("flashaidalert");

			if(needrestart === true){//check if user restarted the browser after running the script

				var message = strbundle.getString("needrestart");
				//alert user
				var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
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