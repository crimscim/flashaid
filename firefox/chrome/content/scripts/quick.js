var flashaidQuick = {

		scriptManager: function(aAction){

			"use strict";

			//fetch localization from strbundle
			var strbundle = document.getElementById("flashaidstrings");
			var messagetitle = strbundle.getString("flashaidalert");
			var noterminal = strbundle.getString("noterminal");
			var pleasewaitmessage = strbundle.getString("pleasewait");
			var removecommands = strbundle.getString("removecommands");
			var updatecommands = strbundle.getString("updatecommands");
			var installcommands = strbundle.getString("installcommands");
			var tweakcommands = strbundle.getString("tweakcommands");
			var messagetitle = strbundle.getString("flashaidmessage");

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

			///declare variables
			var lightspark, swfdec, gnash, adobeinstaller, adobenonfree, adobepartner, systemplugin, systempluginf, mozilla, 
			opt, firefox, wine, vdpauso, npviewer, mmscfg, etcadobe, istream, pluginreg, gpu;

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
			etcadobe = flashaidCommon.checkItem("etcadobe");
			mmscfg = flashaidCommon.checkItem("mmscfg");

			if(systemplugin === true && lightspark !== true && gnash !== true && swfdec !== true && adobepartner !== true && adobeinstaller !== true && adobenonfree !== true){
				systemplugin = true;
			}else{
				systemplugin = false;
			}
			if(systempluginf === true && lightspark !== true && gnash !== true && swfdec !== true && adobepartner !== true && adobeinstaller !== true && adobenonfree !== true){
				systempluginf = true;
			}else{
				systempluginf = false;
			}

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
				flashaidCommon.fileManager("resettempscript");

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

				if(aAction === "stable"){
					command = command+newline+flashaidCommon.scriptManager(aAction,"update");
				}

				//***********************************install commands***************************************
				command = command+newline+"echo '"+installcommands+"'";

				if(aAction === "beta"){
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
				if(aAction === "stable"){
					command = command+newline+flashaidCommon.scriptManager(aAction,"flashplugin-nonfree-install");
					if(opt === true){
						command = command+newline+flashaidCommon.scriptManager(aAction,"flashplugin-nonfree-symlink-opt");
					}
				}
				if(aAction === "chrome"){
					command = command+newline+flashaidCommon.scriptManager(aAction,"googlechrome-install");
					if(opt === true){
						command = command+newline+flashaidCommon.scriptManager(aAction,"googlechrome-symlink-opt");
					}
				}

				//***********************************tweak commands***************************************
				command = command+newline+"echo '"+tweakcommands+"'";

				if(etcadobe === false){
					command = command+newline+"sudo mkdir /etc/adobe";
				}
				if(mmscfg === false){
					command = command+newline+"sudo touch /etc/adobe/mms.cfg";
				}
				command = command+newline+flashaidCommon.scriptManager(aAction,"gpuoverride-tweak-add1");
				command = command+newline+flashaidCommon.scriptManager(aAction,"gpuoverride-tweak-add2");
				command = command+newline+flashaidCommon.scriptManager(aAction,"gpuoverride-tweak-add3");
				command = command+newline+flashaidCommon.scriptManager(aAction,"gpuoverride-tweak-add4");

				if(vdpauso === true){
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
				}

				//write command lines to temporary script
				var foStream = Components.classes["@mozilla.org/network/file-output-stream;1"]
				.createInstance(Components.interfaces.nsIFileOutputStream);
				foStream.init(tempscript, -1 , 0, 0);

				var converter = Components.classes["@mozilla.org/intl/converter-output-stream;1"]
				.createInstance(Components.interfaces.nsIConverterOutputStream);
				converter.init(foStream, "UTF-8", 0, 0);
				converter.writeString(command);
				converter.writeString(newline);
				converter.writeString(endline);
				converter.close();

				//prompt user for confirmation
				var message = strbundle.getString("quickexecute");
				var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
				.getService(Components.interfaces.nsIPromptService);
				var result = prompts.confirm(window, messagetitle, message);

				if(result == true){//execute if user confirm
					//execute the script
					var process = Components.classes['@mozilla.org/process/util;1']
					.createInstance(Components.interfaces.nsIProcess);
					process.init(terminal);
					var args = ["-e","'"+tempscript.path+"'"];
					process.run(false, args, args.length);

					//set restart pref to force restart
					this.prefs.setBoolPref("needrestart",true);
				}

			}else{
				//alert user
				var message = strbundle.getString("noterminal");
				var messagetitle = strbundle.getString("flashaidalert");
				var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
				.getService(Components.interfaces.nsIPromptService);
				prompts.alert(window, messagetitle, message);
			}
		}
};