var flashaidAdvanced = {

		flashaidOnLoad: function(){

			"use strict";

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

			//toggle lightspark installation option
			if(osversion === "10.10" || osversion === "11.04" || oscodename === "maverick" || oscodename === "natty"){

				//hide swfdec install
				document.getElementById("reposwfdec").hidden = true;
				//hide lifespark install
				document.getElementById("repolightspark").hidden = true;

				//check file
				var sources = flashaidCommon.checkItem("lightspark-ppa-maverick");
				if(sources === true){
					document.getElementById("repolightspark").hidden = false;
				}
				//check file
				var sources = flashaidCommon.checkItem("lightspark-ppa-natty");
				if(sources === true){
					document.getElementById("repolightspark").hidden = false;
				}
			}else{
				document.getElementById("repolightspark").hidden = true;
			}

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

			//update the script preview
			flashaidAdvanced.scriptManager("preview");
		},

		scriptManager: function(aAction){

			"use strict";

			//hide script action buttons after executing
			if(aAction === "execute"){
				document.getElementById("executebutton").hidden = true;
				document.getElementById("exportbutton").hidden = true;
				document.getElementById("testbutton").hidden = true;
			}

			//fetch localization from strbundle
			var strbundle = document.getElementById("flashaidstrings");
			var noterminal = strbundle.getString("noterminal");
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
			var customurl = document.getElementById("customurlpath").value;

			//declare terminal path
			var terminal_path = this.prefs.getCharPref("terminal");
			var terminalok;
			//declare basic shell script lines
			var bashline = "#!/bin/bash";
			var newline = "\n";
			var pleasewait = "echo \""+pleasewaitmessage+"\"";
			var endlinemessage = strbundle.getString("done");
			var endline = "echo -n \""+endlinemessage+"\" && read";
			var command, simulate, runscript, tarball;

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

				document.getElementById("testbutton").disabled = false;
				document.getElementById("executebutton").disabled = false;
				document.getElementById("exportbutton").disabled = false;

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

				//declare desktop folder
				var desktop = Components.classes['@mozilla.org/file/directory_service;1']
				.getService(Components.interfaces.nsIProperties)
				.get("Desk", Components.interfaces.nsILocalFile);

				//switch modes
				if(aAction === "preview"){
					runscript = false;
				}else{
					runscript = true;
				}

				//declare commands
				if(aAction === "preview"){
					command = bashline+newline;
				}else{
					command = bashline+newline+pleasewait+newline+"sudo -k";
				}
				//***********************************removal commands***************************************
				if(aAction !== "preview"){
					command = command+newline+"echo '"+removecommands+"'";
				}
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
				if(aAction !== "test"){

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
				}
				//***********************************update commands***************************************
				if(aAction !== "preview"){
					command = command+newline+"echo '"+updatecommands+"'";
				}

				if(flversion.match(/repo/)){
					command = command+newline+flashaidCommon.scriptManager(aAction,"update");
				}

				//***********************************install commands***************************************
				if(aAction !== "preview"){
					command = command+newline+"echo '"+installcommands+"'";
				}
				if(flversion !== "donotinstall"){

					if(flversion === "repognash"){
						command = command+newline+flashaidCommon.scriptManager(aAction,"gnash-install");
						if(opt === true){
							if(aAction !== "test"){
								command = command+newline+flashaidCommon.scriptManager(aAction,"gnash-symlink-opt");
							}
						}
					}
					if(flversion === "reposwfdec"){
						command = command+newline+flashaidCommon.scriptManager(aAction,"swfdec-install");
						if(opt === true){
							if(aAction !== "test"){
								command = command+newline+flashaidCommon.scriptManager(aAction,"swfdec-symlink-opt");
							}
						}
					}
					if(flversion === "repolightspark"){
						command = command+newline+flashaidCommon.scriptManager(aAction,"lightspark-install");
						if(opt === true){
							if(aAction !== "test"){
								command = command+newline+flashaidCommon.scriptManager(aAction,"lightspark-symlink-opt");
							}
						}
					}
					if(flversion === "repo32" || flversion === "repo64"){
						command = command+newline+flashaidCommon.scriptManager(aAction,"flashplugin-nonfree-install");
						if(opt === true){
							if(aAction !== "test"){
								command = command+newline+flashaidCommon.scriptManager(aAction,"flashplugin-nonfree-symlink-opt");
							}
						}
					}
					if(flversion === "beta"){
						if(osString.match(/x86_64/)){

							if(osString.match(/i686/)){
								if(aAction === "test"){
									command = command+newline+flashaidCommon.scriptManager(aAction,"beta64-install-test");
									command = command+newline+flashaidCommon.scriptManager(aAction,"beta32-install-test");
								}else{
									command = command+newline+flashaidCommon.scriptManager(aAction,"beta64-install-x86_64-i686");
									command = command+newline+flashaidCommon.scriptManager(aAction,"beta32-install-x86_64-i686");
								}
							}else{
								if(aAction === "test"){
									command = command+newline+flashaidCommon.scriptManager(aAction,"beta64-install-test");
								}else{
									command = command+newline+flashaidCommon.scriptManager(aAction,"beta64-install");
								}
							}
						}else{
							if(aAction === "test"){
								command = command+newline+flashaidCommon.scriptManager(aAction,"beta32-install-test");
							}else{
								command = command+newline+flashaidCommon.scriptManager(aAction,"beta32-install");
							}
						}
						if(opt === true){
							if(aAction !== "test"){
								command = command+newline+flashaidCommon.scriptManager(aAction,"beta-symlink-opt");
							}
						}
					}
					if(flversion === "googlechrome"){
						if(aAction !== "test"){
							command = command+newline+flashaidCommon.scriptManager(aAction,"googlechrome-install");
						}
						if(opt === true){
							if(aAction !== "test"){
								command = command+newline+flashaidCommon.scriptManager(aAction,"googlechrome-symlink-opt");
							}
						}
					}
					if(flversion === "customurl"){

						if(customurl.match(/flashplayer.*\.tar\.gz/)){

							//escape path strings
							var tempfolderpath = tempfolder.path.replace(/[\\"$]/g, "\\$&").quote();
							var customurlpath = customurl.replace(/[\\"$]/g, "\\$&").quote();
							var tarball = customurl.replace(/.*\//g,"").quote();

							if(customurl.match(/http:\/\/.*/) || customurl.match(/ftp:\/\/.*/)){

								if(aAction === "test"){
									command = command+newline+"cd "+tempfolderpath+" && rm -f *.tar.gz* && wget "+customurlpath+" && tar xvf "+tarball+" && sudo chown root:root libflashplayer.so && sudo chmod 0644 libflashplayer.so && rm -f libflashplayer.so && rm -f *.tar.gz*";
								}else{
									command = command+newline+"cd "+tempfolderpath+" && rm -f *.tar.gz* && wget "+customurlpath+" && tar xvf "+tarball+" && sudo chown root:root libflashplayer.so && sudo chmod 0644 libflashplayer.so && sudo mv libflashplayer.so /usr/lib/mozilla/plugins/ && rm -f *.tar.gz* && sudo ln -s /usr/lib/mozilla/plugins/libflashplayer.so /usr/lib/firefox-addons/plugins/libflashplayer.so";
								}
								if(opt === true){
									if(aAction !== "test"){
										command = command+newline+flashaidCommon.scriptManager(aAction,"beta-symlink-opt");
									}
								}
							}
							if(customurl.match(/\/home\/.*/) && !customurl.match(/http:\/\/.*/) && !customurl.match(/ftp:\/\/.*/)){

								try{
									//initialize terminal with path
									customfile = Components.classes["@mozilla.org/file/local;1"]
									.createInstance(Components.interfaces.nsILocalFile);
									customfile.initWithPath(customurl);

									if(customfile.exists() && !customfile.isDirectory()){

										if(aAction === "test"){
											command = command+newline+"cd "+tempfolderpath+" && rm -f *.tar.gz* && cp "+customurlpath+" "+tempfolderpath+" && tar xvf "+tarball+" && sudo chown root:root libflashplayer.so && sudo chmod 0644 libflashplayer.so && rm -f libflashplayer.so && rm -f *.tar.gz*";
										}else{
											command = command+newline+"cd "+tempfolderpath+" && rm -f *.tar.gz* && cp "+customurlpath+" "+tempfolderpath+" && tar xvf "+tarball+" && sudo chown root:root libflashplayer.so && sudo chmod 0644 libflashplayer.so && sudo mv libflashplayer.so /usr/lib/mozilla/plugins/ && rm -f *.tar.gz* && sudo ln -s /usr/lib/mozilla/plugins/libflashplayer.so /usr/lib/firefox-addons/plugins/libflashplayer.so";
										}
										if(opt === true){
											if(aAction !== "test"){
												command = command+newline+flashaidCommon.scriptManager(aAction,"beta-symlink-opt");
											}
										}
									}
								}catch(e){
									//do nothing
								}
							}
						}
					}
				}

				//***********************************tweak commands***************************************
				if(aAction !== "preview"){
					command = command+newline+"echo '"+tweakcommands+"'";
				}

				var etcadobe = flashaidCommon.checkItem("etcadobe");
				if(etcadobe === false){
					command = command+newline+"sudo mkdir /etc/adobe";
				}
				var mmscfg = flashaidCommon.checkItem("mmscfg");
				if(mmscfg === false){
					command = command+newline+"sudo touch /etc/adobe/mms.cfg";
				}
				if(overridegpuvalidation === true){

					if(aAction !== "test"){
						command = command+newline+flashaidCommon.scriptManager(aAction,"gpuoverride-tweak-add1");
						command = command+newline+flashaidCommon.scriptManager(aAction,"gpuoverride-tweak-add2");
						command = command+newline+flashaidCommon.scriptManager(aAction,"gpuoverride-tweak-add3");
						command = command+newline+flashaidCommon.scriptManager(aAction,"gpuoverride-tweak-add4");
					}
				}else{
					if(aAction !== "test"){
						command = command+newline+flashaidCommon.scriptManager(aAction,"gpuoverride-tweak-remove");
					}
				}

				if(enablelinuxhwvideodecode === true){

					if(aAction !== "test"){
						command = command+newline+flashaidCommon.scriptManager(aAction,"vdpau-tweak-add1");
						command = command+newline+flashaidCommon.scriptManager(aAction,"vdpau-tweak-add2");
						command = command+newline+flashaidCommon.scriptManager(aAction,"vdpau-tweak-add3");
						command = command+newline+flashaidCommon.scriptManager(aAction,"vdpau-tweak-add4");
					}
				}else{
					if(aAction !== "test"){
						command = command+newline+flashaidCommon.scriptManager(aAction,"vdpau-tweak-remove");
					}
				}

				if(npviewer === true){

					if(aAction !== "test"){
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
				}else{
					if(aAction !== "test"){
						//initiate file
						var npviewer = flashaidCommon.checkItem("npviewer");
						if(npviewer === true){
							command = command+newline+flashaidCommon.scriptManager(aAction,"npviewer-tweak-remove");
						}
					}
				}

				//write and launch the script
				if(runscript === true){

					//write command lines to temporary script
					var foStream = Components.classes["@mozilla.org/network/file-output-stream;1"]
					.createInstance(Components.interfaces.nsIFileOutputStream);
					foStream.init(tempscript, -1 , 0, 0);

					var converter = Components.classes["@mozilla.org/intl/converter-output-stream;1"]
					.createInstance(Components.interfaces.nsIConverterOutputStream);
					converter.init(foStream, "UTF-8", 0, 0);
					converter.writeString(command);
					if(aAction !== "preview"){
						converter.writeString(newline);
						converter.writeString(endline);
					}
					converter.close(); 

					if(aAction !== "export"){
						//execute the script
						var process = Components.classes['@mozilla.org/process/util;1']
						.createInstance(Components.interfaces.nsIProcess);
						process.init(terminal);
						var args = ["-e","'"+tempscript.path+"'"];
						process.run(false, args, args.length);
					}
					if(aAction === "export"){
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
						var alertsService = Components.classes["@mozilla.org/alerts-service;1"]
						.getService(Components.interfaces.nsIAlertsService);
						alertsService.showAlertNotification("chrome://flashaid/skin/icon32.png",
								messagetitle, exported,
								false, "", null);
					}
					//set restart pref to force restart
					if(aAction !== "test" && aAction !== "export"){
						this.prefs.setBoolPref("needrestart",true);
					}

				}else{
					document.getElementById("script").value = command;
				}
			}else{
				document.getElementById("script").value = noterminal;
				document.getElementById("testbutton").disabled = true;
				document.getElementById("executebutton").disabled = true;
				document.getElementById("exportbutton").disabled = true;
			}
		},

		optionsInstall: function(){

			"use strict";

			//get os architecture
			var osString = Components.classes["@mozilla.org/network/protocol;1?name=http"]
			.getService(Components.interfaces.nsIHttpProtocolHandler).oscpu; 

			//get selected install option
			var flversion = document.getElementById("flversion").value;

			//toggle custom field display
			if(flversion !== "customurl"){
				document.getElementById("customurlpath").value = "";
				document.getElementById("customurlpath").hidden = true;
				document.getElementById("customurlpath").disabled = true;
				document.getElementById("customurlpathtip").hidden = true;
				document.getElementById("customurlpathsearch").hidden = true;
				document.getElementById("customurlpathreset").hidden = true;
				if(flversion === "repo64"){
					document.getElementById("npviewer").hidden = false;
					document.getElementById("npviewer").checked = true;
				}
			}else{
				document.getElementById("customurlpath").hidden = false;
				document.getElementById("customurlpath").disabled = false;
				document.getElementById("customurlpathtip").hidden = false;
				document.getElementById("customurlpathsearch").hidden = false;
				document.getElementById("customurlpathreset").hidden = false;
			}
		},

		cleanUpTempFiles: function() {//delete temporary files when the extension dialog is closed

			"use strict";

			//delete temporary script
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
		}
};
window.addEventListener("load", function(e) { flashaidAdvanced.flashaidOnLoad(); }, false);
window.addEventListener("unload", function(e) { flashaidAdvanced.cleanUpTempFiles(); }, false);