var flashaidRunner = {

		flashaidOnLoad: function(){

			//get os architecture
			var osString = Components.classes["@mozilla.org/network/protocol;1?name=http"]
			.getService(Components.interfaces.nsIHttpProtocolHandler).oscpu;

			//access preferences interface
			this.prefs = Components.classes["@mozilla.org/preferences-service;1"]
			.getService(Components.interfaces.nsIPrefService)
			.getBranch("extensions.flashaid.");

			//get preferences
			var checkupdates = this.prefs.getBoolPref("updatealert");
			var needrestart = this.prefs.getBoolPref("needrestart");
			var terminalpath = this.prefs.getCharPref("terminal");
			var hidetips = this.prefs.getBoolPref("hidetips");
			var osversion = this.prefs.getCharPref("osversion");
			var oscodename = this.prefs.getCharPref("oscodename");

			//fetch localization from strbundle
			var strbundle = document.getElementById("flashaidstrings");
			var messagetitle = strbundle.getString("flashaidalert");
			var message = strbundle.getString("needrestart");

			//set terminal path
			document.getElementById("terminal").value = terminalpath;

			if(needrestart === true){//check if user restarted the browser after running the script

				//alert user
				var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
				.getService(Components.interfaces.nsIPromptService);
				prompts.alert(window, messagetitle, message);
				window.close();
			}

			//toggle update check
			if(checkupdates === false){
				document.getElementById("checkupdates").checked = false;
			}else{
				document.getElementById("checkupdates").checked = true;
			}

			//toggle lightspark installation option
			if(osversion === "10.10" || osversion === "11.04" || oscodename === "maverick" || oscodename === "natty"){

				//hide swfdec install
				document.getElementById("reposwfdec").hidden = true;

				//initiate file
				var sources = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
				sources.initWithPath("/etc/apt/sources.list.d/sssup-sssup-ppa-maverick.list");
				if(sources.exists()){
					document.getElementById("repolightspark").hidden = false;
				}else{
					document.getElementById("repolightspark").hidden = true;
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
				document.getElementById("flversion").disabled = true;
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
				document.getElementById("flversion").disabled = true;
				try{
					document.getElementById("flversion").value = "beta";
				}catch(e){
					//do nothing
				}
				//initiate file
				var googlechrome = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
				googlechrome.initWithPath("/opt/google/chrome/libgcflashplayer.so");
				if(googlechrome.exists()){
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
			var lightspark, swfdec, gnash, adobeinstaller, adobenonfree, adobepartner, systemplugin, systempluginf, mozilla, opt, firefox, wine, istream, pluginreg, gpu, OverrideGPUValidation, EnableLinuxHWVideoDecode, vdpauso, npviewer, GDK_NATIVE_WINDOWS;

			//**************************check plugins********************************************

			//initiate file
			lightspark = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
			lightspark.initWithPath("/usr/lib/lightspark/liblightspark.so");
			if(lightspark.exists()){
				lightspark = true;
				document.getElementById("lightspark").checked = true;
				document.getElementById("lightspark").hidden = false;
				document.getElementById("lightspark").disabled = true;
			}
			//initiate file
			swfdec = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
			swfdec.initWithPath("/usr/lib/swfdec-mozilla/libswfdecmozilla.so");
			if(swfdec.exists()){
				swfdec = true;
				document.getElementById("swfdec").checked = true;
				document.getElementById("swfdec").hidden = false;
				document.getElementById("swfdec").disabled = true;
			}
			//initiate file
			gnash = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
			gnash.initWithPath("/usr/lib/gnash/libgnashplugin.so");
			if(gnash.exists()){
				gnash = true;
				document.getElementById("gnash").checked = true;
				document.getElementById("gnash").hidden = false;
				document.getElementById("gnash").disabled = true;
			}
			//initiate file
			adobenonfree = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
			adobenonfree.initWithPath("/usr/lib/flashplugin-nonfree/libflashplayer.so");
			if(adobenonfree.exists()){
				adobenonfree = true;
				document.getElementById("adobenonfree").checked = true;
				document.getElementById("adobenonfree").hidden = false;
				document.getElementById("adobenonfree").disabled = true;
			}
			//initiate file
			adobeinstaller = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
			adobeinstaller.initWithPath("/usr/lib/flashplugin-installer/libflashplayer.so");
			if(adobeinstaller.exists()){
				adobeinstaller = true;
				document.getElementById("adobeinstaller").checked = true;
				document.getElementById("adobeinstaller").hidden = false;
				document.getElementById("adobeinstaller").disabled = true;
			}
			//initiate file
			adobepartner = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
			adobepartner.initWithPath("/usr/lib/adobe-flashplugin/libflashplayer.so");
			if(adobepartner.exists()){
				adobepartner = true;
				document.getElementById("adobepartner").checked = true;
				document.getElementById("adobepartner").hidden = false;
				document.getElementById("adobepartner").disabled = true;
			}
			//initiate file
			systemplugin = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
			systemplugin.initWithPath("/usr/lib/mozilla/plugins/libflashplayer.so");
			if(systemplugin.exists() && lightspark !== true && gnash !== true && swfdec !== true && adobepartner !== true && adobeinstaller !== true && adobenonfree !== true){
				document.getElementById("systemplugin").checked = true;
				document.getElementById("systemplugin").hidden = false;
				document.getElementById("systemplugin").disabled = true;
			}
			//initiate file
			systempluginf = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
			systempluginf.initWithPath("/usr/lib/firefox-addons/plugins/libflashplayer.so");
			if(systempluginf.exists() && lightspark !== true && gnash !== true && swfdec !== true && adobepartner !== true && adobeinstaller !== true && adobenonfree !== true){
				document.getElementById("systempluginf").checked = true;
				document.getElementById("systempluginf").hidden = false;
				document.getElementById("systempluginf").disabled = true;
			}
			//initiate file
			mozilla = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
			mozilla.initWithPath("~/.mozilla/plugins/libflashplayer.so");
			if(mozilla.exists()){
				document.getElementById("mozilla").checked = true;
				document.getElementById("mozilla").hidden = false;
				document.getElementById("mozilla").disabled = true;
			}
			//initiate file
			opt = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
			opt.initWithPath("/opt/firefox/plugins/libflashplayer.so");
			if(opt.exists()){
				document.getElementById("opt").checked = true;
				document.getElementById("opt").hidden = false;
				document.getElementById("opt").disabled = true;
			}
			//initiate file
			firefox = Components.classes["@mozilla.org/file/directory_service;1"]
			.getService(Components.interfaces.nsIProperties)
			.get("ProfD", Components.interfaces.nsIFile);
			firefox.append("plugins");
			firefox.append("libflashplayer.so");
			if(firefox.exists()){
				document.getElementById("firefox").checked = true;
				document.getElementById("firefox").hidden = false;
				document.getElementById("firefox").disabled = true;
			}
			//initiate file
			wine = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
			wine.initWithPath("~/.wine/dosdevices/c:/windows/system32/Macromed/Flash");
			if(wine.exists()){
				document.getElementById("wine").checked = true;
				document.getElementById("wine").hidden = false;
				document.getElementById("wine").disabled = true;
			}

			//gpu validation
			document.getElementById("overridegpuvalidation").hidden = false;
			document.getElementById("overridegpuvalidation").checked = true;
			document.getElementById("overridegpuvalidation").disabled = true;

			//initiate file
			vdpauso = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
			vdpauso.initWithPath("/usr/lib/vdpau/libvdpau_nvidia.so.1");
			if(vdpauso.exists()){
				document.getElementById("enablelinuxhwvideodecode").hidden = false;
				document.getElementById("enablelinuxhwvideodecode").checked = true;
				document.getElementById("enablelinuxhwvideodecode").disabled = true;
			}

			if(osString.match(/x86_64/)){
				document.getElementById("npviewer").hidden = false;
				document.getElementById("npviewer").checked = true;
				document.getElementById("npviewer").disabled = true;
			}else{
				document.getElementById("npviewer").hidden = true;
				document.getElementById("npviewer").checked = false;
				document.getElementById("npviewer").disabled = false;
			}

			//toggle tips
			if(hidetips === true){
				document.getElementById("hidetips").checked = true;
				document.getElementById("tipscript").hidden = true;
				if(osString.match(/x86_64/)){
					document.getElementById("installtip64").hidden = true;
				}else{
					document.getElementById("installtip32").hidden = true;
				}
				document.getElementById("tipremoval").hidden = true;
				document.getElementById("tiptweaks").hidden = true;
				document.getElementById("tipcheckupdates").hidden = true;
				document.getElementById("tipterminalpath").hidden = true;
			}else{
				document.getElementById("hidetips").checked = false;
				document.getElementById("tipscript").hidden = false;
				if(osString.match(/x86_64/)){
					document.getElementById("installtip64").hidden = false;
				}else{
					document.getElementById("installtip32").hidden = false;
				}
				document.getElementById("tipremoval").hidden = false;
				document.getElementById("tiptweaks").hidden = false;
				document.getElementById("tipcheckupdates").hidden = false;
				document.getElementById("tipterminalpath").hidden = false;
			}

			//update the script preview
			flashaidRunner.scriptManager("preview");
		},

		scriptManager: function(aAction){

			//hide script action buttons after executing
			if(aAction === "execute"){
				document.getElementById("executebutton").hidden = true;
				document.getElementById("exportbutton").hidden = true;
				document.getElementById("testbutton").hidden = true;
				document.getElementById("refreshbutton").hidden = true;
			}
			//get os architecture
			var osString = Components.classes["@mozilla.org/network/protocol;1?name=http"]
			.getService(Components.interfaces.nsIHttpProtocolHandler).oscpu; 

			//access preferences interface
			this.prefs = Components.classes["@mozilla.org/preferences-service;1"]
			.getService(Components.interfaces.nsIPrefService)
			.getBranch("extensions.flashaid.");

			//declare terminal path
			var terminal_path = this.prefs.getCharPref("terminal");
			var terminalok;
			//declare basic shell script lines
			var bashline = "#!/bin/bash";
			var newline = "\n";
			var command;
			//fetch localization from strbundle
			var strbundle = document.getElementById("flashaidstrings");
			var noterminal = strbundle.getString("noterminal");
			var pleasewaitmessage = strbundle.getString("pleasewait");
			var pleasewait = "echo \""+pleasewaitmessage+"\"";
			var endlinemessage = strbundle.getString("done");
			var endline = "echo -n \""+endlinemessage+"\" && read";
			var removecommands = strbundle.getString("removecommands");
			var updatecommands = strbundle.getString("updatecommands");
			var installcommands = strbundle.getString("installcommands");
			var tweakcommands = strbundle.getString("tweakcommands");
			var exported = strbundle.getString("exported");
			var messagetitle = strbundle.getString("flashaidmessage");

			//check terminal binary existance
			try{
				//initialize terminal with path
				var terminal = Components.classes["@mozilla.org/file/local;1"]
				.createInstance(Components.interfaces.nsILocalFile);
				terminal.initWithPath(terminal_path);

				if(terminal.exists()){
					terminalok = true;
				}
			}catch(e){
				terminalok = false;
			}

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
			//declare variables
			var simulate, runscript, tarball;

			if(terminalok === true){//match if terminal binary exist, generates and run the script

				document.getElementById("testbutton").disabled = false;
				document.getElementById("executebutton").disabled = false;
				document.getElementById("exportbutton").disabled = false;

				//declare temp folder
				var tempfolder = Components.classes["@mozilla.org/file/directory_service;1"]
				.getService(Components.interfaces.nsIProperties)
				.get("ProfD", Components.interfaces.nsIFile);
				tempfolder.append("extensions");
				tempfolder.append("flashaid@lovinglinux.megabyet.net");
				tempfolder.append("chrome");
				tempfolder.append("content");
				tempfolder.append("tmp");
				//delete and recreate temp folder
				tempfolder.remove(true);
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

				//switch modes
				if(aAction === "preview"){
					simulate = " ";
					runscript = false;
				}else{
					if(aAction === "test"){
						simulate = " --dry-run ";
					}
					if(aAction === "execute" || aAction === "export"){
						simulate = " ";
					}
					runscript = true;
				}

				//declare commands
				if(aAction === "preview"){
					command = bashline+newline;
				}else{
					command = bashline+newline+pleasewait+newline+"sudo -k";
				}
				if(aAction !== "preview"){
					command = command+newline+"echo '"+removecommands+"'";
				}
				if(lightspark === true){
					command = command+newline+"sudo apt-get --yes"+simulate+"purge lightspark-common";
				}
				if(gnash === true){
					command = command+newline+"sudo apt-get --yes"+simulate+"purge mozilla-plugin-gnash"+newline+"sudo apt-get --yes"+simulate+"purge browser-plugin-gnash";
				}
				if(swfdec === true){
					command = command+newline+"sudo apt-get --yes"+simulate+"purge swfdec-mozilla";
				}
				if(adobeinstaller === true){
					command = command+newline+"sudo apt-get --yes"+simulate+"purge flashplugin-installer";
				}
				if(adobepartner === true){
					command = command+newline+"sudo apt-get --yes"+simulate+"purge adobe-flashplugin";
				}
				if(adobenonfree === true){
					command = command+newline+"sudo apt-get --yes"+simulate+"purge flashplugin-nonfree";
				}
				if(aAction !== "test"){

					if(mozilla === true){
						command = command+newline+"sudo rm -f ~/.mozilla/plugins/*flash*so";
					}
					if(opt === true){
						command = command+newline+"sudo rm -f /opt/firefox/plugins/*flash*so";
					}
					if(firefox === true){
						command = command+newline+"sudo rm -f ~/.mozilla/firefox/**/plugins/*flash*so";
					}
					if(wine === true){
						command = command+newline+"sudo rm -rf ~/.wine/dosdevices/c:/windows/system32/Macromed/Flash";
					}
					if(systemplugin === true){
						command = command+newline+"sudo rm -f /usr/lib/mozilla/plugins/libflashplayer.so";
					}
					if(systempluginf === true){
						command = command+newline+"sudo rm -f /usr/lib/firefox-addons/plugins/libflashplayer.so";
					}
				}
				if(aAction !== "preview"){
					command = command+newline+"echo '"+updatecommands+"'";
				}

				if(flversion.match(/repo/)){
					command = command+newline+"sudo apt-get"+simulate+"update";
				}
				if(aAction !== "preview"){
					command = command+newline+"echo '"+installcommands+"'";
				}
				if(flversion !== "donotinstall"){

					if(flversion === "repognash"){
						command = command+newline+"sudo apt-get --yes"+simulate+"install mozilla-plugin-gnash";
						if(opt === true){
							if(aAction !== "test"){
								command = command+newline+"sudo ln -s /usr/lib/gnash/libgnashplugin.so /opt/firefox/plugins/libflashplayer.so";
							}
						}
					}
					if(flversion === "reposwfdec"){
						command = command+newline+"sudo apt-get --yes"+simulate+"install swfdec-mozilla";
						if(opt === true){
							if(aAction !== "test"){
								command = command+newline+"sudo ln -s /usr/lib/swfdec-mozilla/libswfdecmozilla.so /opt/firefox/plugins/libflashplayer.so";
							}
						}
					}
					if(flversion === "repolightspark"){
						command = command+newline+"sudo apt-get --yes"+simulate+"install lightspark";
						if(opt === true){
							if(aAction !== "test"){
								command = command+newline+"sudo ln -s /usr/lib/lightspark/lightspark.so /opt/firefox/plugins/libflashplayer.so";
							}
						}
					}
					if(flversion === "repo32" || flversion === "repo64"){
						command = command+newline+"sudo apt-get --yes"+simulate+"install flashplugin-nonfree";
						if(opt === true){
							if(aAction !== "test"){
								command = command+newline+"sudo ln -s /usr/lib/mozilla/plugins/flashplugin-alternative.so /opt/firefox/plugins/libflashplayer.so";
							}
						}
					}
					if(flversion === "beta"){
						if(osString.match(/x86_64/)){

							if(osString.match(/i686/)){
								if(aAction === "test"){
									command = command+newline+"cd \""+tempfolder.path+"\" && rm -f flashplayer64* && wget http://www.webgapps.org/downloads/flash/beta/flashplayer64 && tar xvf flashplayer64 && rm -f libflashplayer.so && rm -f flashplayer64*";
									command = command+newline+"cd \""+tempfolder.path+"\" && rm -f flashplayer32* && wget http://www.webgapps.org/downloads/flash/beta/flashplayer32 && tar xvf flashplayer32 && rm -f libflashplayer.so && rm -f flashplayer32*";
								}else{
									command = command+newline+"cd \""+tempfolder.path+"\" && rm -f flashplayer64* && wget http://www.webgapps.org/downloads/flash/beta/flashplayer64 && tar xvf flashplayer64 && sudo chown root:root libflashplayer.so && sudo chmod 0644 libflashplayer.so && sudo mv libflashplayer.so /usr/lib/mozilla/plugins/ && rm -f flashplayer64* && mkdir ~/.mozilla/plugins/ && sudo ln -s /usr/lib/mozilla/plugins/libflashplayer.so /usr/lib/firefox-addons/plugins/libflashplayer.so";
									command = command+newline+"cd \""+tempfolder.path+"\" && rm -f flashplayer32* && wget http://www.webgapps.org/downloads/flash/beta/flashplayer32 && tar xvf flashplayer32 && mv libflashplayer.so ~/.mozilla/plugins/ && rm -f flashplayer32*";
								}
							}else{
								if(aAction === "test"){
									command = command+newline+"cd \""+tempfolder.path+"\" && rm -f flashplayer64* && wget http://www.webgapps.org/downloads/flash/beta/flashplayer64 && tar xvf flashplayer64 && rm -f libflashplayer.so && rm -f flashplayer64*";
								}else{
									command = command+newline+"cd \""+tempfolder.path+"\" && rm -f flashplayer64* && wget http://www.webgapps.org/downloads/flash/beta/flashplayer64 && tar xvf flashplayer64 && sudo chown root:root libflashplayer.so && sudo chmod 0644 libflashplayer.so && sudo mv libflashplayer.so /usr/lib/mozilla/plugins/ && rm -f flashplayer64* && sudo ln -s /usr/lib/mozilla/plugins/libflashplayer.so /usr/lib/firefox-addons/plugins/libflashplayer.so";
								}
							}
						}else{
							if(aAction === "test"){
								command = command+newline+"cd \""+tempfolder.path+"\" && rm -f flashplayer32* && wget http://www.webgapps.org/downloads/flash/beta/flashplayer32 && tar xvf flashplayer32 && rm -f libflashplayer.so && rm -f flashplayer32*";
							}else{
								command = command+newline+"cd \""+tempfolder.path+"\" && rm -f flashplayer32* && wget http://www.webgapps.org/downloads/flash/beta/flashplayer32 && tar xvf flashplayer32 && sudo chown root:root libflashplayer.so && sudo chmod 0644 libflashplayer.so && sudo mv libflashplayer.so /usr/lib/mozilla/plugins/ && rm -f flashplayer32* && sudo ln -s /usr/lib/mozilla/plugins/libflashplayer.so /usr/lib/firefox-addons/plugins/libflashplayer.so";
							}
						}
						if(opt === true){
							if(aAction !== "test"){
								command = command+newline+"sudo ln -s /usr/lib/mozilla/plugins/libflashplayer.so /opt/firefox/plugins/libflashplayer.so";
							}
						}
					}
					if(flversion === "googlechrome"){
						if(aAction !== "test"){
							command = command+newline+"sudo ln -s /opt/google/chrome/libgcflashplayer.so /usr/lib/mozilla/plugins/libflashplayer.so";
						}
					}
					if(flversion === "customurl"){

						if(customurl.match(/flashplayer.*\.tar\.gz/)){

							tarball = customurl.replace(/.*\//g,"");

							if(customurl.match(/http:\/\/.*/) || customurl.match(/ftp:\/\/.*/)){

								if(aAction === "test"){
									command = command+newline+"cd \""+tempfolder.path+"\" && rm -f *.tar.gz* && wget "+customurl+" && tar xvf "+tarball+" && sudo chown root:root libflashplayer.so && sudo chmod 0644 libflashplayer.so && rm -f libflashplayer.so && rm -f *.tar.gz*";
								}else{
									command = command+newline+"cd \""+tempfolder.path+"\" && rm -f *.tar.gz* && wget "+customurl+" && tar xvf "+tarball+" && sudo chown root:root libflashplayer.so && sudo chmod 0644 libflashplayer.so && sudo mv libflashplayer.so /usr/lib/mozilla/plugins/ && rm -f *.tar.gz* && sudo ln -s /usr/lib/mozilla/plugins/libflashplayer.so /usr/lib/firefox-addons/plugins/libflashplayer.so";
								}
								if(opt === true){
									if(aAction !== "test"){
										command = command+newline+"sudo ln -s /usr/lib/mozilla/plugins/libflashplayer.so /opt/firefox/plugins/libflashplayer.so";
									}
								}
							}
							if(customurl.match(/\/home\/.*/) && !customurl.match(/http:\/\/.*/) && !customurl.match(/ftp:\/\/.*/)){

								//initialize terminal with path
								customfile = Components.classes["@mozilla.org/file/local;1"]
								.createInstance(Components.interfaces.nsILocalFile);
								customfile.initWithPath(customurl);

								if(customfile.exists() && !customfile.isDirectory()){

									if(aAction === "test"){
										command = command+newline+"cd \""+tempfolder.path+"\" && rm -f *.tar.gz* && cp "+customurl+" . && tar xvf "+tarball+" && sudo chown root:root libflashplayer.so && sudo chmod 0644 libflashplayer.so && rm -f libflashplayer.so && rm -f *.tar.gz*";
									}else{
										command = command+newline+"cd \""+tempfolder.path+"\" && rm -f *.tar.gz* && cp "+customurl+" . && tar xvf "+tarball+" && sudo chown root:root libflashplayer.so && sudo chmod 0644 libflashplayer.so && sudo mv libflashplayer.so /usr/lib/mozilla/plugins/ && rm -f *.tar.gz* && sudo ln -s /usr/lib/mozilla/plugins/libflashplayer.so /usr/lib/firefox-addons/plugins/libflashplayer.so";
									}
									if(opt === true){
										if(aAction !== "test"){
											command = command+newline+"sudo ln -s /usr/lib/mozilla/plugins/libflashplayer.so /opt/firefox/plugins/libflashplayer.so";
										}
									}
								}
							}
						}
					}
				}
				if(aAction !== "preview"){
					command = command+newline+"echo '"+tweakcommands+"'";
				}
				//***********************************generate tweak commands***************************************

				//initiate folder
				var etcadobe = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
				etcadobe.initWithPath("/etc/adobe");
				if(!etcadobe.exists() || !etcadobe.isDirectory()){
					command = command+newline+"sudo mkdir /etc/adobe";
				}
				//initiate file
				var mmscfg = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
				mmscfg.initWithPath("/etc/adobe/mms.cfg");
				if(!mmscfg.exists() || mmscfg.isDirectory()){
					command = command+newline+"sudo touch /etc/adobe/mms.cfg";
				}
				if(overridegpuvalidation === true){

					if(aAction !== "test"){
						command = command+newline+"TWEAK=$(cat /etc/adobe/mms.cfg | grep 'OverrideGPUValidation')";
						command = command+newline+"if test -z \"${TWEAK}\";then";
						command = command+newline+"echo 'OverrideGPUValidation=true' | sudo tee -a /etc/adobe/mms.cfg";
						command = command+newline+"fi";
					}
				}else{
					if(aAction !== "test"){
						command = command+newline+"cat /etc/adobe/mms.cfg | sed '/OverrideGPUValidation=true/d' | sudo tee /etc/adobe/mms.cfg";
					}
				}

				if(enablelinuxhwvideodecode === true){

					if(aAction !== "test"){
						command = command+newline+"TWEAK=$(cat /etc/adobe/mms.cfg | grep 'EnableLinuxHWVideoDecode')";
						command = command+newline+"if test -z \"${TWEAK}\";then";
						command = command+newline+"echo 'EnableLinuxHWVideoDecode=1' | sudo tee -a /etc/adobe/mms.cfg";
						command = command+newline+"fi";
					}
				}else{
					if(aAction !== "test"){
						command = command+newline+"cat /etc/adobe/mms.cfg | sed '/EnableLinuxHWVideoDecode=1/d' | sudo tee /etc/adobe/mms.cfg";
					}
				}

				if(npviewer === true){

					if(aAction !== "test"){
						command = command+newline+"NPVIEWER=/usr/lib/nspluginwrapper/i386/linux/npviewer";
						command = command+newline+"if test -f \"${NPVIEWER}\";then";
						command = command+newline+"TWEAK=$(cat /usr/lib/nspluginwrapper/i386/linux/npviewer | grep  'GDK_NATIVE_WINDOWS=1')";
						command = command+newline+"if test -z \"${TWEAK}\";then";
						command = command+newline+"echo '#!/bin/sh' | sudo tee /usr/lib/nspluginwrapper/i386/linux/npviewer";
						command = command+newline+"echo 'TARGET_OS=linux' | sudo tee -a /usr/lib/nspluginwrapper/i386/linux/npviewer";
						command = command+newline+"echo 'TARGET_ARCH=i386' | sudo tee -a /usr/lib/nspluginwrapper/i386/linux/npviewer";
						command = command+newline+"echo 'case \"$*\" in' | sudo tee -a /usr/lib/nspluginwrapper/i386/linux/npviewer";
						command = command+newline+"echo '*libflashplayer*)' | sudo tee -a /usr/lib/nspluginwrapper/i386/linux/npviewer";
						command = command+newline+"echo '	export GDK_NATIVE_WINDOWS=1' | sudo tee -a /usr/lib/nspluginwrapper/i386/linux/npviewer";
						command = command+newline+"echo '	;;' | sudo tee -a /usr/lib/nspluginwrapper/i386/linux/npviewer";
						command = command+newline+"echo 'esac' | sudo tee -a /usr/lib/nspluginwrapper/i386/linux/npviewer";
						command = command+newline+"echo '. /usr/lib/nspluginwrapper/noarch/npviewer' | sudo tee -a /usr/lib/nspluginwrapper/i386/linux/npviewer";
						command = command+newline+"fi";
						command = command+newline+"fi";
					}
				}else{
					if(aAction !== "test"){

						//initiate file
						var npviewer = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
						npviewer.initWithPath("/usr/lib/nspluginwrapper/i386/linux/npviewer");
						if(npviewer.exists()){
							command = command+newline+"cat /usr/lib/nspluginwrapper/i386/linux/npviewer | sed '/export GDK_NATIVE_WINDOWS=1/d' | sudo tee /usr/lib/nspluginwrapper/i386/linux/npviewer";
						}
					}
				}

				//write and launch the script
				if(runscript === true){

					//write command lines to temporary script
					var foStream = Components.classes["@mozilla.org/network/file-output-stream;1"]
					.createInstance(Components.interfaces.nsIFileOutputStream);
					foStream.init(tempscript, 0x02 | 0x10 , 0777, 0);

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
						var arguments = ["-e","'"+tempscript.path+"'"];
						process.run(false, arguments, arguments.length);
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
						alertsService = Components.classes["@mozilla.org/alerts-service;1"]
						.getService(Components.interfaces.nsIAlertsService);
						alertsService.showAlertNotification("chrome://flashaid/skin/icon48.png",
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

		generateReport: function(){

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

			//declare basic shell script lines
			var bashline = "#!/bin/bash";
			var newline = "\n";
			var command;
			//declare commands
			command = "echo 'Ubuntu Architecture' > ~/Desktop/firefox-report.txt";
			command = command+newline+"echo '' >> ~/Desktop/firefox-report.txt";
			command = command+newline+"uname -a >> ~/Desktop/firefox-report.txt";
			command = command+newline+"echo '' >> ~/Desktop/firefox-report.txt";
			command = command+newline+"echo 'Ubuntu Version' >> ~/Desktop/firefox-report.txt";
			command = command+newline+"echo '' >> ~/Desktop/firefox-report.txt";
			command = command+newline+"cat /etc/lsb-release >> ~/Desktop/firefox-report.txt";
			command = command+newline+"echo '' >> ~/Desktop/firefox-report.txt";
			command = command+newline+"echo 'Firefox Packages' >> ~/Desktop/firefox-report.txt";
			command = command+newline+"echo '' >> ~/Desktop/firefox-report.txt";
			command = command+newline+"dpkg --get-selections | grep 'firefox*' >> ~/Desktop/firefox-report.txt";
			command = command+newline+"echo '' >> ~/Desktop/firefox-report.txt";
			command = command+newline+"echo 'Firefox binaries' >> ~/Desktop/firefox-report.txt";
			command = command+newline+"echo '' >> ~/Desktop/firefox-report.txt";
			command = command+newline+"which firefox >> ~/Desktop/firefox-report.txt";
			command = command+newline+"file /usr/bin/firefox >> ~/Desktop/firefox-report.txt";
			command = command+newline+"file /usr/local/bin/firefox >> ~/Desktop/firefox-report.txt";
			command = command+newline+"file /opt/firefox/firefox >> ~/Desktop/firefox-report.txt";
			command = command+newline+"echo '' >> ~/Desktop/firefox-report.txt";
			command = command+newline+"echo 'Firefox divertion' >> ~/Desktop/firefox-report.txt";
			command = command+newline+"echo '' >> ~/Desktop/firefox-report.txt";
			command = command+newline+"file /usr/bin/firefox.ubuntu >> ~/Desktop/firefox-report.txt";
			command = command+newline+"echo '' >> ~/Desktop/firefox-report.txt";
			command = command+newline+"echo 'Sources' >> ~/Desktop/firefox-report.txt";
			command = command+newline+"echo '' >> ~/Desktop/firefox-report.txt";
			command = command+newline+"ls /etc/apt/sources.list.d >> ~/Desktop/firefox-report.txt";
			command = command+newline+"echo '' >> ~/Desktop/firefox-report.txt";

			command = command+newline+"echo 'Flash packages' >> ~/Desktop/firefox-report.txt";
			command = command+newline+"echo '' >> ~/Desktop/firefox-report.txt";
			command = command+newline+"dpkg --get-selections | grep 'flash*' >> ~/Desktop/firefox-report.txt";
			command = command+newline+"echo 'Plugin locations' >> ~/Desktop/firefox-report.txt";
			command = command+newline+"echo '' >> ~/Desktop/firefox-report.txt";
			command = command+newline+"locate libflashplayer.so  >> ~/Desktop/firefox-report.txt";
			command = command+newline+"echo '' >> ~/Desktop/firefox-report.txt";
			command = command+newline+"locate flashplugin-alternative.so  >> ~/Desktop/firefox-report.txt";
			command = command+newline+"echo '' >> ~/Desktop/firefox-report.txt";
			command = command+newline+"echo 'Flash symlinks' >> ~/Desktop/firefox-report.txt";
			command = command+newline+"echo '' >> ~/Desktop/firefox-report.txt";
			command = command+newline+"echo '' >> ~/Desktop/firefox-report.txt";

			command = command+newline+"file /usr/lib/mozilla/plugins/libflashplayer.so >> ~/Desktop/firefox-report.txt";
			command = command+newline+"file /usr/lib/mozilla/plugins/flashplugin-alternative.so >> ~/Desktop/firefox-report.txt";
			command = command+newline+"file /etc/alternatives/mozilla-flashplugin >> ~/Desktop/firefox-report.txt";
			command = command+newline+"file /usr/lib/flashplugin-installer/libflashplayer.so >> ~/Desktop/firefox-report.txt";
			command = command+newline+"file /usr/lib/flashplugin-nonfree/libflashplayer.so >> ~/Desktop/firefox-report.txt";
			command = command+newline+"file /usr/lib/adobe-flashplugin/libflashplayer.so >> ~/Desktop/firefox-report.txt";
			command = command+newline+"file /usr/lib/lightspark/lightspark.so >> ~/Desktop/firefox-report.txt";
			command = command+newline+"file /usr/lib/swfdec-mozilla/libswfdecmozilla.so >> ~/Desktop/firefox-report.txt";
			command = command+newline+"file /usr/lib/gnash/libgnashplugin.so >> ~/Desktop/firefox-report.txt";
			command = command+newline+"file /var/lib/flashplugin-installer/npwrapper.libflashplayer.so >> ~/Desktop/firefox-report.txt";
			command = command+newline+"file /var/lib/flashplugin-nonfree/npwrapper.libflashplayer.so >> ~/Desktop/firefox-report.txt";

			command = command+newline+"echo '' >> ~/Desktop/firefox-report.txt";
			command = command+newline+"echo 'pluginreg.dat' >> ~/Desktop/firefox-report.txt";
			command = command+newline+"echo '' >> ~/Desktop/firefox-report.txt";
			command = command+newline+"cat ~/.mozilla/firefox/**/pluginreg.dat >> ~/Desktop/firefox-report.txt";
			command = command+newline+"firefox ~/Desktop/firefox-report.txt";

			//write command lines to temporary script
			var foStream = Components.classes["@mozilla.org/network/file-output-stream;1"]
			.createInstance(Components.interfaces.nsIFileOutputStream);
			foStream.init(tempscript, 0x02 | 0x10 , 0777, 0);

			var converter = Components.classes["@mozilla.org/intl/converter-output-stream;1"]
			.createInstance(Components.interfaces.nsIConverterOutputStream);
			converter.init(foStream, "UTF-8", 0, 0);
			converter.writeString(bashline);
			converter.writeString(newline);
			converter.writeString(command);
			converter.writeString(newline);
			converter.writeString("exit");
			converter.close(); 

			//execute the script
			var process = Components.classes['@mozilla.org/process/util;1']
			.createInstance(Components.interfaces.nsIProcess);
			process.init(tempscript);
			var arguments = [];
			process.run(false, arguments, arguments.length);
		},

		optionsToggleTips: function(){

			//get os architecture
			var osString = Components.classes["@mozilla.org/network/protocol;1?name=http"]
			.getService(Components.interfaces.nsIHttpProtocolHandler).oscpu;

			//access preferences interface
			this.prefs = Components.classes["@mozilla.org/preferences-service;1"]
			.getService(Components.interfaces.nsIPrefService)
			.getBranch("extensions.flashaid.");

			//get pref
			var hidetips = this.prefs.getBoolPref("hidetips");

			//toggle tips display
			if(hidetips === false){
				this.prefs.setBoolPref("hidetips", true);
				document.getElementById("tipscript").hidden = true;
				if(osString.match(/x86_64/)){
					document.getElementById("installtip64").hidden = true;
				}else{
					document.getElementById("installtip32").hidden = true;
				}
				document.getElementById("tipremoval").hidden = true;
				document.getElementById("tiptweaks").hidden = true;
				document.getElementById("tipcheckupdates").hidden = true;
				document.getElementById("tipterminalpath").hidden = true;
				document.getElementById("tipreport").hidden = true;
			}else{
				this.prefs.setBoolPref("hidetips", false);
				document.getElementById("tipscript").hidden = false;
				if(osString.match(/x86_64/)){
					document.getElementById("installtip64").hidden = false;
				}else{
					document.getElementById("installtip32").hidden = false;
				}
				document.getElementById("tipremoval").hidden = false;
				document.getElementById("tiptweaks").hidden = false;
				document.getElementById("tipcheckupdates").hidden = false;
				document.getElementById("tipterminalpath").hidden = false;
				document.getElementById("tipreport").hidden = false;
			}
		},

		optionsAdvanced: function(){

			//get os architecture
			var osString = Components.classes["@mozilla.org/network/protocol;1?name=http"]
			.getService(Components.interfaces.nsIHttpProtocolHandler).oscpu; 

			//get status
			var advanced = document.getElementById("advanced").checked;
			var flversion = document.getElementById("flversion").value;

			//toggle display
			if(advanced === false){
				document.getElementById("lightspark").hidden = false;
				document.getElementById("lightspark").disabled = false;
				document.getElementById("gnash").hidden = false;
				document.getElementById("gnash").disabled = false;
				document.getElementById("swfdec").hidden = false;
				document.getElementById("swfdec").disabled = false;
				document.getElementById("adobeinstaller").hidden = false;
				document.getElementById("adobeinstaller").disabled = false;
				document.getElementById("adobenonfree").hidden = false;
				document.getElementById("adobenonfree").disabled = false;
				document.getElementById("adobepartner").hidden = false;
				document.getElementById("adobepartner").disabled = false;
				document.getElementById("systemplugin").hidden = false;
				document.getElementById("systemplugin").disabled = false;
				document.getElementById("systempluginf").hidden = false;
				document.getElementById("systempluginf").disabled = false;
				document.getElementById("mozilla").hidden = false;
				document.getElementById("mozilla").disabled = false;
				document.getElementById("opt").hidden = false;
				document.getElementById("opt").disabled = false;
				document.getElementById("firefox").hidden = false;
				document.getElementById("firefox").disabled = false;
				document.getElementById("wine").hidden = false;
				document.getElementById("wine").disabled = false;
				document.getElementById("overridegpuvalidation").hidden = false;
				document.getElementById("overridegpuvalidation").disabled = false;
				document.getElementById("enablelinuxhwvideodecode").hidden = false;
				document.getElementById("enablelinuxhwvideodecode").disabled = false;
				if(osString.match(/x86_64/)){
					document.getElementById("npviewer").hidden = false;
					document.getElementById("npviewer").disabled = false;
				}
				document.getElementById("flversion").disabled = false;
				flashaidRunner.optionsInstall();
			}else{
				document.getElementById("flversion").disabled = true;
				document.getElementById("customurlpath").hidden = true;
				document.getElementById("customurlpath").disabled = true;
				document.getElementById("customurlpathtip").hidden = true;
				document.getElementById("customurlpathsearch").hidden = true;
				document.getElementById("customurlpathreset").hidden = true;
				flashaidRunner.flashaidOnLoad();
			}
		},

		prefUpdater: function(aType){

			//access preferences interface
			this.prefs = Components.classes["@mozilla.org/preferences-service;1"]
			.getService(Components.interfaces.nsIPrefService)
			.getBranch("extensions.flashaid.");

			if(aType === "updatecheck"){

				//get checked value
				var checkupdates = document.getElementById("checkupdates").checked;

				//update pref
				if(checkupdates === false){
					this.prefs.setBoolPref("updatealert",true);
				}else{
					this.prefs.setBoolPref("updatealert",false);
				}
			}
		},

		optionsInstall: function(){

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

		openFile : function(aPref,aText) {

			//access preferences interface
			this.prefs = Components.classes["@mozilla.org/preferences-service;1"]
			.getService(Components.interfaces.nsIPrefService)
			.getBranch("extensions.flashaid.");

			//open file picker
			var nsIFilePicker = Components.interfaces.nsIFilePicker;
			var fp = Components.classes["@mozilla.org/filepicker;1"]
			.createInstance(nsIFilePicker);
			fp.init(window, aText, nsIFilePicker.modeOpen);
			var rv = fp.show();
			if (rv == nsIFilePicker.returnOK) {
				var file = fp.file;
				if(aPref === "terminal"){
					//update pref and element
					this.prefs.setCharPref("terminal", file.path);
					document.getElementById("terminal").value = file.path;
				}
				if(aPref === "customurlpath"){
					//update element
					document.getElementById("customurlpath").value = file.path;
				}
			}
		},

		resetPath : function(aPref) {

			//access preferences interface
			this.prefs = Components.classes["@mozilla.org/preferences-service;1"]
			.getService(Components.interfaces.nsIPrefService)
			.getBranch("extensions.flashaid.");

			//reset field
			if(aPref === "terminal"){

				//initiate file
				var gnometerminal = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
				gnometerminal.initWithPath("/usr/bin/gnome-terminal");
				//initiate file
				var konsole = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
				konsole.initWithPath("/usr/bin/konsole");
				//initiate file					
				var xfce4 = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
				xfce4.initWithPath("/usr/bin/xfce4-terminal");

				if(gnometerminal.exists()){
					document.getElementById("terminal").value = gnometerminal.path;
					this.prefs.setCharPref("terminal",gnometerminal.path);
				}else{
					if(konsole.exists()){
						document.getElementById("terminal").value = konsole.path;
						this.prefs.setCharPref("terminal",konsole.pat);
					}else{
						if(xfce4.exists()){
							document.getElementById("terminal").value = xfce4.path;
							this.prefs.setCharPref("terminal",xfce4.path);
						}else{
							document.getElementById("terminal").value = "/usr/bin/x-terminal-emulator";
							this.prefs.setCharPref("terminal", "/usr/bin/x-terminal-emulator");
						}
					}
				}
			}
			if(aPref === "customurlpath"){
				document.getElementById("customurlpath").value = "";
			}
		},

		openLink : function(aLink) {
			window.opener.gBrowser.selectedTab = window.opener.gBrowser.addTab(aLink);
		},

		cleanUpTempFiles: function () {//delete temporary files when the extension dialog is closed

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
window.addEventListener("load", function(e) { flashaidRunner.flashaidOnLoad(); }, false);
window.addEventListener("unload", function(e) { flashaidRunner.cleanUpTempFiles(); }, false);