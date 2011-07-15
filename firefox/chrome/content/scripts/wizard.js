var flashaidWizard = {

		flashaidOnLoad: function(){

			//get os architecture
			var osString = Components.classes["@mozilla.org/network/protocol;1?name=http"]
			.getService(Components.interfaces.nsIHttpProtocolHandler).oscpu;

			//access preferences interface
			this.prefs = Components.classes["@mozilla.org/preferences-service;1"]
			.getService(Components.interfaces.nsIPrefService)
			.getBranch("extensions.flashaid.");

			//get preferences
			var osversion = this.prefs.getCharPref("osversion");
			var oscodename = this.prefs.getCharPref("oscodename");

			//switch instalaltion options based on architecture
			if(osString.match(/x86_64/)){

				document.getElementById("installtip32").hidden = true;
				document.getElementById("installtip64").hidden = false;
				document.getElementById("repo32").hidden = true;
				document.getElementById("repo64").hidden = false;
				document.getElementById("beta").hidden = false;
				document.getElementById("googlechrome").hidden = true;
				try{
					if(osversion === "8.04" || oscodename === "hardy"){
						document.getElementById("flversion").value = "repo64";
					}else{
						document.getElementById("flversion").value = "beta";
					}
				}catch(e){
					//do nothing
				}
			}else{
				document.getElementById("installtip32").hidden = false;
				document.getElementById("installtip64").hidden = true;
				document.getElementById("repo32").hidden = false;
				document.getElementById("repo64").hidden = true;
				document.getElementById("beta").hidden = false;
				try{
					document.getElementById("flversion").value = "beta";
				}catch(e){
					//do nothing
				}
				//check file
				var googlechrome = flashaidCommon.checkItem("googlechrome");
				if(googlechrome === true){
					document.getElementById("googlechrome").hidden = false;
				}else{
					document.getElementById("googlechrome").hidden = true;
				}
			}

			//hide and unselect all removal/tweak options
			document.getElementById("lightspark").hidden = true;
			document.getElementById("lightspark").checked = false;
			document.getElementById("gnash").hidden = true;
			document.getElementById("gnash").checked = false;
			document.getElementById("swfdec").hidden = true;
			document.getElementById("swfdec").checked = false;
			document.getElementById("adobeinstaller").hidden = true;
			document.getElementById("adobeinstaller").checked = false;
			document.getElementById("adobenonfree").hidden = true;
			document.getElementById("adobenonfree").checked = false;
			document.getElementById("adobepartner").hidden = true;
			document.getElementById("adobepartner").checked = false;
			document.getElementById("systemplugin").hidden = true;
			document.getElementById("systemplugin").checked = false;
			document.getElementById("systempluginf").hidden = true;
			document.getElementById("systempluginf").checked = false;
			document.getElementById("mozilla").hidden = true;
			document.getElementById("mozilla").checked = false;
			document.getElementById("opt").hidden = true;
			document.getElementById("opt").checked = false;
			document.getElementById("firefox").hidden = true;
			document.getElementById("firefox").checked = false;
			document.getElementById("wine").hidden = true;
			document.getElementById("wine").checked = false;
			document.getElementById("overridegpuvalidation").hidden = true;
			document.getElementById("overridegpuvalidation").checked = false;
			document.getElementById("enablelinuxhwvideodecode").hidden = true;
			document.getElementById("enablelinuxhwvideodecode").checked = false;
			document.getElementById("npviewer").hidden = true;
			document.getElementById("npviewer").checked = false;

			///declare variables
			var lightspark, swfdec, gnash, adobeinstaller, adobenonfree, adobepartner, systemplugin, systempluginf, mozilla, 
			opt, firefox, wine, vdpauso, npviewer, istream, pluginreg, gpu;

			//**************************check plugins********************************************

			//check files
			lightspark = flashaidCommon.checkItem("lightspark");
			swfdec = flashaidCommon.checkItem("swfdec");
			gnash = flashaidCommon.checkItem("gnash");
			adobenonfree = flashaidCommon.checkItem("adobenonfree");
			adobeinstaller = flashaidCommon.checkItem("adobeinstaller");
			adobepartner = flashaidCommon.checkItem("adobepartner");
			systemplugin = flashaidCommon.checkItem("systemplugin");
			systempluginf = flashaidCommon.checkItem("systempluginf");
			mozilla = flashaidCommon.checkItem("mozilla");
			opt = flashaidCommon.checkItem("opt");
			firefox = flashaidCommon.checkItem("firefox");
			wine = flashaidCommon.checkItem("wine");
			vdpauso = flashaidCommon.checkItem("vdpauso");
			npviewer = flashaidCommon.checkItem("npviewer");

			if(lightspark === true){
				document.getElementById("lightspark").checked = true;
				document.getElementById("lightspark").hidden = false;
			}
			if(swfdec === true){
				document.getElementById("swfdec").checked = true;
				document.getElementById("swfdec").hidden = false;
			}
			if(gnash === true){
				document.getElementById("gnash").checked = true;
				document.getElementById("gnash").hidden = false;
			}
			if(adobenonfree === true){
				document.getElementById("adobenonfree").checked = true;
				document.getElementById("adobenonfree").hidden = false;
			}
			if(adobeinstaller === true){
				document.getElementById("adobeinstaller").checked = true;
				document.getElementById("adobeinstaller").hidden = false;
			}
			if(adobepartner === true){
				document.getElementById("adobepartner").checked = true;
				document.getElementById("adobepartner").hidden = false;
			}
			if(systemplugin === true && lightspark !== true && gnash !== true && swfdec !== true && adobepartner !== true && adobeinstaller !== true && adobenonfree !== true){
				document.getElementById("systemplugin").checked = true;
				document.getElementById("systemplugin").hidden = false;
			}else{
				systemplugin = false;
			}
			if(systempluginf === true && lightspark !== true && gnash !== true && swfdec !== true && adobepartner !== true && adobeinstaller !== true && adobenonfree !== true){
				document.getElementById("systempluginf").checked = true;
				document.getElementById("systempluginf").hidden = false;
			}else{
				systempluginf = false;
			}
			if(mozilla === true){
				document.getElementById("mozilla").checked = true;
				document.getElementById("mozilla").hidden = false;
			}
			if(opt === true){
				document.getElementById("opt").checked = true;
				document.getElementById("opt").hidden = false;
			}
			if(firefox === true){
				document.getElementById("firefox").checked = true;
				document.getElementById("firefox").hidden = false;
			}
			if(wine === true){
				document.getElementById("wine").checked = true;
				document.getElementById("wine").hidden = false;
			}

			//gpu validation
			document.getElementById("overridegpuvalidation").hidden = false;
			document.getElementById("overridegpuvalidation").checked = true;

			if(vdpauso === true){
				document.getElementById("enablelinuxhwvideodecode").hidden = false;
				document.getElementById("enablelinuxhwvideodecode").checked = true;
			}

			if(npviewer === true){
				document.getElementById("npviewer").hidden = false;
				document.getElementById("npviewer").checked = true;
			}
		},
		
		infoUpdater: function(){
			
			//access preferences interface
			this.prefs = Components.classes["@mozilla.org/preferences-service;1"]
			.getService(Components.interfaces.nsIPrefService)
			.getBranch("extensions.flashaid.");

			//get os architecture
			var osString = Components.classes["@mozilla.org/network/protocol;1?name=http"]
			.getService(Components.interfaces.nsIHttpProtocolHandler).oscpu;
			
			//fetch localization from strbundle
			var strbundle = document.getElementById("flashaidstrings");
			var strrepositories = strbundle.getString("repositories");
			
			var version = document.getElementById("flversion").value;

			if(version == "repo32"){
				document.getElementById("flash-aid-wizard-info").hidden = false;
				document.getElementById("flash-aid-wizard-info-hash-label").hidden = true;
				document.getElementById("flash-aid-wizard-info-hash").hidden = true;
				document.getElementById("flash-aid-wizard-info-release-label").hidden = true;
				document.getElementById("flash-aid-wizard-info-release").hidden = true;
				document.getElementById("flash-aid-wizard-info-source").setAttribute('value',strrepositories);
				document.getElementById("flash-aid-wizard-info-source").setAttribute('tooltiptext',strrepositories);
				document.getElementById("flash-aid-wizard-info-architecture").setAttribute('value',"32bit");
			}
			if(version == "repo64"){
				document.getElementById("flash-aid-wizard-info").hidden = false;
				document.getElementById("flash-aid-wizard-info-hash-label").hidden = true;
				document.getElementById("flash-aid-wizard-info-hash").hidden = true;
				document.getElementById("flash-aid-wizard-info-release-label").hidden = true;
				document.getElementById("flash-aid-wizard-info-release").hidden = true;
				document.getElementById("flash-aid-wizard-info-source").setAttribute('value',strrepositories);
				document.getElementById("flash-aid-wizard-info-source").setAttribute('tooltiptext',strrepositories);
				document.getElementById("flash-aid-wizard-info-architecture").setAttribute('value',"64bit");
			}	
			if(version == "beta"){
				document.getElementById("flash-aid-wizard-info").hidden = false;
				document.getElementById("flash-aid-wizard-info-hash-label").hidden = false;
				document.getElementById("flash-aid-wizard-info-hash").hidden = false;
				document.getElementById("flash-aid-wizard-info-release-label").hidden = false;
				document.getElementById("flash-aid-wizard-info-release").hidden = false;
				
				try{
					//parse json data
					var datawebgapps = this.prefs.getCharPref("datawebgapps");
					var jsonObjectLocal = JSON.parse(datawebgapps);
					var timestamp64 = jsonObjectLocal.flashbeta64[0].timestamp;
					var timestamp32 = jsonObjectLocal.flashbeta32[0].timestamp;
					var url64 = jsonObjectLocal.flashbeta64[0].url;
					var url32 = jsonObjectLocal.flashbeta32[0].url;
					var hash64 = jsonObjectLocal.flashbeta64[0].hash;
					var hash32 = jsonObjectLocal.flashbeta32[0].hash;
					
					if(osString.match(/x86_64/)){
						if(osString.match(/i686/)){
							document.getElementById("flash-aid-wizard-info-source").setAttribute('value',url32+" | "+url64);
							document.getElementById("flash-aid-wizard-info-source").setAttribute('tooltiptext',url32+" | "+url64);
							document.getElementById("flash-aid-wizard-info-architecture").setAttribute('value',"32bit | 64bit");
							document.getElementById("flash-aid-wizard-info-hash").setAttribute('value',hash32+" | "+hash64);
							document.getElementById("flash-aid-wizard-info-release").setAttribute('value',timestamp32+" | "+timestamp64);
						}else{
							document.getElementById("flash-aid-wizard-info-source").setAttribute('value',url64);
							document.getElementById("flash-aid-wizard-info-source").setAttribute('tooltiptext',url64);
							document.getElementById("flash-aid-wizard-info-architecture").setAttribute('value',"64bit");
							document.getElementById("flash-aid-wizard-info-hash").setAttribute('value',hash64);
							document.getElementById("flash-aid-wizard-info-release").setAttribute('value',timestamp64);
						}
					}else{
						document.getElementById("flash-aid-wizard-info-source").setAttribute('value',url32);
						document.getElementById("flash-aid-wizard-info-source").setAttribute('tooltiptext',url32);
						document.getElementById("flash-aid-wizard-info-architecture").setAttribute('value',"32bit");
						document.getElementById("flash-aid-wizard-info-hash").setAttribute('value',hash32);
						document.getElementById("flash-aid-wizard-info-release").setAttribute('value',timestamp32);
					}
				}catch(e){
					document.getElementById("flash-aid-wizard-info").hidden = true;
				}
			}
			if(version == "googlechrome"){
				document.getElementById("flash-aid-wizard-info").hidden = false;
				document.getElementById("flash-aid-wizard-info-hash-label").hidden = true;
				document.getElementById("flash-aid-wizard-info-hash").hidden = true;
				document.getElementById("flash-aid-wizard-info-release-label").hidden = true;
				document.getElementById("flash-aid-wizard-info-release").hidden = true;
				document.getElementById("flash-aid-wizard-info-source").setAttribute('value',"/opt/google/chrome/libgcflashplayer.so");
				document.getElementById("flash-aid-wizard-info-source").setAttribute('tooltiptext',"/opt/google/chrome/libgcflashplayer.so");
				document.getElementById("flash-aid-wizard-info-architecture").setAttribute('value',"32bit");
			}
		},

		scriptManager: function(){

			//fetch localization from strbundle
			var strbundle = document.getElementById("flashaidstrings");
			var pleasewaitmessage = strbundle.getString("pleasewait");
			var removecommands = strbundle.getString("removecommands");
			var updatecommands = strbundle.getString("updatecommands");
			var installcommands = strbundle.getString("installcommands");
			var tweakcommands = strbundle.getString("tweakcommands");
			var exported = strbundle.getString("exported");
			var messagetitle = strbundle.getString("flashaidmessage");

			//get os architecture
			var osString = Components.classes["@mozilla.org/network/protocol;1?name=http"]
			.getService(Components.interfaces.nsIHttpProtocolHandler).oscpu; 

			//access preferences interface
			this.prefs = Components.classes["@mozilla.org/preferences-service;1"]
			.getService(Components.interfaces.nsIPrefService)
			.getBranch("extensions.flashaid.");

			//get options from selections
			var lightspark = document.getElementById("lightspark").checked;
			var gnash = document.getElementById("gnash").checked;
			var swfdec = document.getElementById("swfdec").checked;
			var adobeinstaller = document.getElementById("adobeinstaller").checked;
			var adobepartner = document.getElementById("adobepartner").checked;
			var adobenonfree = document.getElementById("adobenonfree").checked;
			var systemplugin = document.getElementById("systemplugin").checked;
			var systempluginf = document.getElementById("systempluginf").checked;
			var mozilla = document.getElementById("mozilla").checked;
			var opt = document.getElementById("opt").checked;
			var firefox = document.getElementById("firefox").checked;
			var wine = document.getElementById("wine").checked;
			var overridegpuvalidation = document.getElementById("overridegpuvalidation").checked;
			var enablelinuxhwvideodecode = document.getElementById("enablelinuxhwvideodecode").checked;
			var npviewer = document.getElementById("npviewer").checked;
			var flversion = document.getElementById("flversion").value;
			var scriptmode = document.getElementById("scriptmode").value;
			var aAction = document.getElementById("scriptdonotconfirm").checked;

			//declare terminal path
			var terminal_path = this.prefs.getCharPref("terminal");
			var terminalok;
			//declare basic shell script lines
			var bashline = "#!/bin/bash";
			var newline = "\n";
			var command;
			var pleasewait = "echo \""+pleasewaitmessage+"\"";
			var endlinemessage = strbundle.getString("done");
			var endline = "echo -n \""+endlinemessage+"\" && read";

			//check terminal binary existance
			try{

				if(terminal_path !== ""){
					//initialize terminal with path
					var terminal = Components.classes["@mozilla.org/file/local;1"]
					.createInstance(Components.interfaces.nsILocalFile);
					terminal.initWithPath(terminal_path);

					if(terminal.exists()){
						terminalok = true;
					}
				}else{
					terminalok = false;
				}

			}catch(e){
				terminalok = false;
			}

			if(terminalok === true){//match if terminal binary exist, generates and run the script

				//declare temp folder
				var tempfolder = Components.classes["@mozilla.org/file/directory_service;1"]
				.getService(Components.interfaces.nsIProperties)
				.get("ProfD", Components.interfaces.nsIFile);
				tempfolder.append("extensions");
				tempfolder.append("flashaid@lovinglinux.megabyet.net");
				tempfolder.append("chrome");
				tempfolder.append("content");
				tempfolder.append("tmp");
				if(tempfolder.exists()){
					//delete and recreate temp folder
					tempfolder.remove(true);
				}
				tempfolder.create(Components.interfaces.nsIFile.DIRECTORY_TYPE, 0777);

				//declare, remove and create temporary script
				var tempscript = Components.classes["@mozilla.org/file/directory_service;1"]
				.getService(Components.interfaces.nsIProperties)
				.get("ProfD", Components.interfaces.nsIFile);
				tempscript.append("extensions");
				tempscript.append("flashaid@lovinglinux.megabyet.net");
				tempscript.append("chrome");
				tempscript.append("content");
				tempscript.append("tmp");
				tempscript.append("flashaid.sh");
				if(tempscript.exists()) {
					tempscript.remove(false);
				}
				tempscript.createUnique(Components.interfaces.nsIFile.NORMAL_FILE_TYPE, 0777);

				//declare desktop folder
				var desktop = Components.classes['@mozilla.org/file/directory_service;1']
				.getService(Components.interfaces.nsIProperties)
				.get("Desk", Components.interfaces.nsILocalFile);

				//declare commands
				command = bashline+newline+pleasewait+newline+"sudo -k";

				//***********************************removal commands***************************************
				command = command+newline+"echo '"+removecommands+"'";

				if(lightspark === true){
					command = command+newline+flashaidCommon.scriptManager(aAction,"lightspark-removal");
				}
				if(gnash === true){
					command = command+newline+flashaidCommon.scriptManager(aAction,"gnash-removal");
				}
				if(swfdec === true){
					command = command+newline+flashaidCommon.scriptManager(aAction,"swfdec-removal");
				}
				if(adobeinstaller === true){
					command = command+newline+flashaidCommon.scriptManager(aAction,"adobeinstaller-removal");
				}
				if(adobepartner === true){
					command = command+newline+flashaidCommon.scriptManager(aAction,"adobepartner-removal");
				}
				if(adobenonfree === true){
					command = command+newline+flashaidCommon.scriptManager(aAction,"adobenonfree-removal");
				}
				if(mozilla === true){
					command = command+newline+flashaidCommon.scriptManager(aAction,"mozilla-removal");
				}
				if(opt === true){
					command = command+newline+flashaidCommon.scriptManager(aAction,"opt-removal");
				}
				if(firefox === true){
					command = command+newline+flashaidCommon.scriptManager(aAction,"firefox-removal");
				}
				if(wine === true){
					command = command+newline+flashaidCommon.scriptManager(aAction,"wine-removal");
				}
				if(systemplugin === true){
					command = command+newline+flashaidCommon.scriptManager(aAction,"systemplugin-removal");
				}
				if(systempluginf === true){
					command = command+newline+flashaidCommon.scriptManager(aAction,"systempluginf-removal");
				}

				//***********************************update commands***************************************
				command = command+newline+"echo '"+updatecommands+"'";

				if(flversion.match(/repo/)){
					command = command+newline+flashaidCommon.scriptManager(aAction,"update");
				}

				//***********************************install commands***************************************
				command = command+newline+"echo '"+installcommands+"'";

				if(flversion === "repo32" || flversion === "repo64"){
					command = command+newline+flashaidCommon.scriptManager(aAction,"flashplugin-nonfree-install");
					if(opt === true){
						command = command+newline+flashaidCommon.scriptManager(aAction,"flashplugin-nonfree-symlink-opt");
					}
				}
				if(flversion === "beta"){
					if(osString.match(/x86_64/)){

						if(osString.match(/i686/)){
							command = command+newline+flashaidCommon.scriptManager(aAction,"beta64-install-x86_64-i686");
							command = command+newline+flashaidCommon.scriptManager(aAction,"beta32-install-x86_64-i686");
						}else{
							command = command+newline+flashaidCommon.scriptManager(aAction,"beta64-install");
						}
					}else{
						command = command+newline+flashaidCommon.scriptManager(aAction,"beta32-install");
					}
					if(opt === true){
						command = command+newline+flashaidCommon.scriptManager(aAction,"beta-symlink-opt");
					}
				}
				if(flversion === "googlechrome"){
					command = command+newline+flashaidCommon.scriptManager(aAction,"googlechrome-install");
					if(opt === true){
						command = command+newline+flashaidCommon.scriptManager(aAction,"googlechrome-symlink-opt");
					}
				}

				//***********************************tweak commands***************************************
				command = command+newline+"echo '"+tweakcommands+"'";

				var etcadobe = flashaidCommon.checkItem("etcadobe");
				if(etcadobe === false){
					command = command+newline+"sudo mkdir /etc/adobe";
				}
				var mmscfg = flashaidCommon.checkItem("mmscfg");
				if(mmscfg === false){
					command = command+newline+"sudo touch /etc/adobe/mms.cfg";
				}
				if(overridegpuvalidation === true){
					command = command+newline+flashaidCommon.scriptManager(aAction,"gpuoverride-tweak-add1");
					command = command+newline+flashaidCommon.scriptManager(aAction,"gpuoverride-tweak-add2");
					command = command+newline+flashaidCommon.scriptManager(aAction,"gpuoverride-tweak-add3");
					command = command+newline+flashaidCommon.scriptManager(aAction,"gpuoverride-tweak-add4");
				}else{
					command = command+newline+flashaidCommon.scriptManager(aAction,"gpuoverride-tweak-remove");
				}

				if(enablelinuxhwvideodecode === true){
					command = command+newline+flashaidCommon.scriptManager(aAction,"vdpau-tweak-add1");
					command = command+newline+flashaidCommon.scriptManager(aAction,"vdpau-tweak-add2");
					command = command+newline+flashaidCommon.scriptManager(aAction,"vdpau-tweak-add3");
					command = command+newline+flashaidCommon.scriptManager(aAction,"vdpau-tweak-add4");
				}else{
					command = command+newline+flashaidCommon.scriptManager(aAction,"vdpau-tweak-remove");
				}

				if(npviewer === true){
					command = command+newline+flashaidCommon.scriptManager(aAction,"npviewer-tweak-add1");
					command = command+newline+flashaidCommon.scriptManager(aAction,"npviewer-tweak-add2");
					command = command+newline+flashaidCommon.scriptManager(aAction,"npviewer-tweak-add3");
					command = command+newline+flashaidCommon.scriptManager(aAction,"npviewer-tweak-add4");
					command = command+newline+flashaidCommon.scriptManager(aAction,"npviewer-tweak-add5");
					command = command+newline+flashaidCommon.scriptManager(aAction,"npviewer-tweak-add6");
					command = command+newline+flashaidCommon.scriptManager(aAction,"npviewer-tweak-add7");
					command = command+newline+flashaidCommon.scriptManager(aAction,"npviewer-tweak-add8");
					command = command+newline+flashaidCommon.scriptManager(aAction,"npviewer-tweak-add9");
					command = command+newline+flashaidCommon.scriptManager(aAction,"npviewer-tweak-add10");
					command = command+newline+flashaidCommon.scriptManager(aAction,"npviewer-tweak-add11");
					command = command+newline+flashaidCommon.scriptManager(aAction,"npviewer-tweak-add12");
					command = command+newline+flashaidCommon.scriptManager(aAction,"npviewer-tweak-add13");
					command = command+newline+flashaidCommon.scriptManager(aAction,"npviewer-tweak-add14");
					command = command+newline+flashaidCommon.scriptManager(aAction,"npviewer-tweak-add15");
				}else{
					//initiate file
					var npviewer = flashaidCommon.checkItem("npviewer");
					if(npviewer === true){
						command = command+newline+flashaidCommon.scriptManager(aAction,"npviewer-tweak-remove");
					}
				}

				//write command lines to temporary script
				var foStream = Components.classes["@mozilla.org/network/file-output-stream;1"]
				.createInstance(Components.interfaces.nsIFileOutputStream);
				foStream.init(tempscript, 0x02 | 0x10 , 0777, 0);

				var converter = Components.classes["@mozilla.org/intl/converter-output-stream;1"]
				.createInstance(Components.interfaces.nsIConverterOutputStream);
				converter.init(foStream, "UTF-8", 0, 0);
				converter.writeString(command);
				converter.writeString(newline);
				converter.writeString(endline);
				converter.close(); 

				if(scriptmode === "execute"){
					//execute the script
					var process = Components.classes['@mozilla.org/process/util;1']
					.createInstance(Components.interfaces.nsIProcess);
					process.init(terminal);
					var arguments = ["-e","'"+tempscript.path+"'"];
					process.run(false, arguments, arguments.length);

					this.prefs.setBoolPref("needrestart",true);
				}
				if(scriptmode === "export"){
					//declare and remove export script
					var exportscript = Components.classes["@mozilla.org/file/directory_service;1"]
					.getService(Components.interfaces.nsIProperties)
					.get("Desk", Components.interfaces.nsIFile);
					exportscript.append("flashaid.sh");
					if(exportscript.exists()) {
						exportscript.remove(false);
					}
					tempscript.copyTo(desktop,"flashaid.sh");
					//alert user
					alertsService = Components.classes["@mozilla.org/alerts-service;1"]
					.getService(Components.interfaces.nsIAlertsService);
					alertsService.showAlertNotification("chrome://flashaid/skin/icon32.png",
							messagetitle, exported,
							false, "", null);
				}				
			}
		}
};
window.addEventListener("load", function(e) { flashaidWizard.flashaidOnLoad(); }, false);