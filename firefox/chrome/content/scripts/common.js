var flashaidCommon = {

		fileManager:function(aAction){
			
			if(aAction === "resettempscript"){
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
			}
		},
	
		dateManager:function(aType) {

			"use strict";

			//get selected date and time
			var currentDate = new Date();
			var cmonth = currentDate.getMonth();
			var month = cmonth+1;
			var MM = "0" + month;
			MM = MM.substring(MM.length-2, MM.length);
			var day = currentDate.getDate();
			var DD = "0" + day;
			DD = DD.substring(DD.length-2, DD.length);
			var hours = currentDate.getHours();
			var HH = "0" + hours;
			HH = HH.substring(HH.length-2, HH.length);
			var minutes = currentDate.getMinutes();
			var MI = "0" + minutes;
			MI = MI.substring(MI.length-2, MI.length);
			var seconds = currentDate.getSeconds();
			var SS = "0" + seconds;
			SS = SS.substring(SS.length-2, SS.length);
			var YYYY = currentDate.getFullYear();
	
			var currentdate = YYYY+"-"+MM+"-"+DD;
			var currenttime = HH+":"+MI+":"+SS;
			var currentdatestamp = YYYY+MM+DD;
			var currenttimestamp = HH+MI+SS;
			
			if(aType === "date"){
				return currentdate;
			}
			if(aType === "time"){
				return currenttime;
			}
			if(aType === "datestamp"){
				return currentdatestamp;
			}
			if(aType === "timestamp"){
				return currenttimestamp;
			}
		},

		checkItem: function(aItem){

			"use strict";

			var item, itempath;

			if(aItem === "firefox"){
				
				try{
					//initiate file
					item = Components.classes["@mozilla.org/file/directory_service;1"]
					.getService(Components.interfaces.nsIProperties)
					.get("ProfD", Components.interfaces.nsIFile);
					item.append("plugins");
					item.append("libflashplayer.so");
					if(item.exists()){
						return true;
					}else{
						return false;
					}
				}catch(e){
					return false;
				}
			}else{

				if(aItem === "lightspark"){
					itempath = "/usr/lib/lightspark/liblightspark.so";
				}
				if(aItem === "lightspark-oneiric"){
					itempath = "/usr/lib/lightspark/liblightsparkplugin.so";
				}
				if(aItem === "googlechrome"){
					itempath = "/opt/google/chrome/libgcflashplayer.so";
				}
				if(aItem === "swfdec"){
					itempath = "/usr/lib/swfdec-mozilla/libswfdecmozilla.so";
				}
				if(aItem === "gnash"){
					itempath = "/usr/lib/gnash/libgnashplugin.so";
				}
				if(aItem === "adobenonfree"){
					itempath = "/usr/lib/flashplugin-nonfree/libflashplayer.so";
				}
				if(aItem === "adobeinstaller"){
					itempath = "/usr/lib/flashplugin-installer/libflashplayer.so";
				}
				if(aItem === "adobepartner"){
					itempath = "/usr/lib/adobe-flashplugin/libflashplayer.so";
				}
				if(aItem === "systemplugin"){
					itempath = "/usr/lib/mozilla/plugins/libflashplayer.so";
				}
				if(aItem === "systempluginf"){
					itempath = "/usr/lib/firefox-addons/plugins/libflashplayer.so";
				}
				if(aItem === "mozilla"){
					itempath = "~/.mozilla/plugins/libflashplayer.so";
				}
				if(aItem === "opt"){
					itempath = "/opt/firefox/plugins/libflashplayer.so";
				}
				if(aItem === "wine"){
					itempath = "~/.wine/dosdevices/c:/windows/system32/Macromed/Flash";
				}
				if(aItem === "vdpauso"){
					itempath = "/usr/lib/vdpau/libvdpau_nvidia.so.1";
				}
				if(aItem === "npviewer"){
					itempath = "/usr/lib/nspluginwrapper/i386/linux/npviewer";
				}
				if(aItem === "mmscfg"){
					itempath = "/etc/adobe/mms.cfg";
				}
				if(aItem === "etcadobe"){
					itempath = "/etc/adobe";
				}

				try{
					//initiate file with path
					item = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
					item.initWithPath(itempath);
					if(item.exists()){
						return true;
					}else{
						return false;
					}					
				}catch(e){
					return false;
				}
			}
		},

		scriptManager: function(aAction,aCommand){

			"use strict";

			//fetch localization from strbundle
			var strbundle = document.getElementById("flashaidstrings");
			var hashnotmatch32 = strbundle.getString("hashnotmatch32");
			var hashnotmatch64 = strbundle.getString("hashnotmatch64");
			
			//access preferences interface
			this.prefs = Components.classes["@mozilla.org/preferences-service;1"]
			.getService(Components.interfaces.nsIPrefService)
			.getBranch("extensions.flashaid.");

			//get preferences
			var osstring = this.prefs.getCharPref("osstring");
			var osdistro = this.prefs.getCharPref("osdistro");
			var osversion = this.prefs.getCharPref("osversion");
			var oscodename = this.prefs.getCharPref("oscodename");

			if(aCommand.match("beta.*")){
				//parse json data
				var datawebgapps = this.prefs.getCharPref("datawebgapps");
				var jsonObjectLocal = JSON.parse(datawebgapps);
				var url64 = jsonObjectLocal.flashbeta64[0].url;
				var url32 = jsonObjectLocal.flashbeta32[0].url;
				var hash64 = jsonObjectLocal.flashbeta64[0].hash;
				var hash32 = jsonObjectLocal.flashbeta32[0].hash;
			}

			//declare temp folder
			var tempfolder = Components.classes["@mozilla.org/file/directory_service;1"]
			.getService(Components.interfaces.nsIProperties)
			.get("ProfD", Components.interfaces.nsIFile);
			tempfolder.append("extensions");
			tempfolder.append("flashaid@lovinglinux.megabyet.net");
			tempfolder.append("chrome");
			tempfolder.append("content");
			tempfolder.append("tmp");
			
			var tempfolderpath = tempfolder.path.replace(/[\\"$]/g, "\\$&").quote();

			var simulate,skipuser;
			var newline = "\n";
			var newcommand;

			if(aAction === "test"){
				simulate = " --dry-run ";
			}else{
				simulate = " ";
			}
			if(aAction === "stable" || aAction === "beta" || aAction === "chrome" || aAction === false){
				skipuser = "";
			}else{
				skipuser = " --yes";
			}
			//*****************************************removal********************************************
			if(aCommand === "lightspark-removal"){
				newcommand = "sudo apt-get"+skipuser+simulate+"purge browser-plugin-lightspark"+newline+"sudo apt-get"+skipuser+simulate+"purge lightspark-common";
			}
			if(aCommand === "gnash-removal"){
				newcommand = "sudo apt-get"+skipuser+simulate+"purge browser-plugin-gnash"+newline+"sudo apt-get"+skipuser+simulate+"purge mozilla-plugin-gnash";
			}
			if(aCommand === "swfdec-removal"){
				newcommand = "sudo apt-get"+skipuser+simulate+"purge swfdec-mozilla";
			}
			if(aCommand === "adobeinstaller-removal"){
				newcommand = "sudo apt-get"+skipuser+simulate+"purge flashplugin.*installer"+newline+"sudo apt-get"+skipuser+simulate+"purge flashplugin-downloader";
			}
			if(aCommand === "adobepartner-removal"){
				newcommand = "sudo apt-get"+skipuser+simulate+"purge adobe-flashplugin";
			}
			if(aCommand === "adobenonfree-removal"){
				newcommand = "sudo apt-get"+skipuser+simulate+"purge flashplugin-nonfree";
			}
			if(aCommand === "mozilla-removal"){
				newcommand = "sudo rm -f ~/.mozilla/plugins/*flash*so";
			}
			if(aCommand === "opt-removal"){
				newcommand = "sudo rm -f /opt/firefox/plugins/*flash*so";
			}
			if(aCommand === "firefox-removal"){
				newcommand = "sudo rm -f ~/.mozilla/firefox/**/plugins/*flash*so";
			}
			if(aCommand === "wine-removal"){
				newcommand = "sudo rm -rf ~/.wine/dosdevices/c:/windows/system32/Macromed/Flash";
			}
			if(aCommand === "systemplugin-removal"){
				newcommand = "sudo rm -f /usr/lib/mozilla/plugins/libflashplayer.so";
			}
			if(aCommand === "systempluginf-removal"){
				newcommand = "sudo rm -f /usr/lib/firefox-addons/plugins/libflashplayer.so";
			}
			//*****************************************update********************************************
			if(aCommand === "update"){
				newcommand = "sudo apt-get"+simulate+"update";
			}
			//*****************************************install********************************************
			if(aCommand === "gnash-install"){
				newcommand = "sudo apt-get"+skipuser+simulate+"install browser-plugin-gnash";
			}
			if(aCommand === "lightspark-install"){
				newcommand = "sudo apt-get"+skipuser+simulate+"install browser-plugin-lightspark";
			}
			if(aCommand === "flashplugin-adobe-install"){
				newcommand = "sudo apt-get"+skipuser+simulate+"install adobe-flashplugin";
			}
			if(aCommand === "flashplugin-installer-install"){
				newcommand = "sudo apt-get"+skipuser+simulate+"install flashplugin-installer";
			}
			if(aCommand === "flashplugin-downloader-install"){
				newcommand = "sudo apt-get"+skipuser+simulate+"install flashplugin-downloader";
			}
			if(aCommand === "flashplugin-nonfree-install"){
				newcommand = "sudo apt-get"+skipuser+simulate+"install flashplugin-nonfree";
			}
			if(aCommand === "googlechrome-install"){
				newcommand = "sudo ln -s /opt/google/chrome/libgcflashplayer.so /usr/lib/mozilla/plugins/libflashplayer.so";
			}
			if(aCommand === "beta64-install-test"){
				if(hash64 === "*"){
					newcommand = "cd "+tempfolderpath+" && rm -f *flash* && wget "+url64+"\ntar xvf *flash* libflashplayer.so && rm -f libflashplayer.so && rm -f *flash*";
				}else{
					newcommand = "cd "+tempfolderpath+" && rm -f *flash* && wget "+url64+"\nNEWHASH64=$(md5sum *flash* | sed 's/ .*//g')\nif [ \"${NEWHASH64}\" == '"+hash64+"' ];then\ntar xvf *flash* libflashplayer.so && rm -f libflashplayer.so && rm -f *flash*\nelse\necho '"+hashnotmatch64+"'\nrm -f *flash*\nfi";
				}
			}
			if(aCommand === "beta32-install-test"){
				if(hash32 === "*"){
					newcommand = "cd "+tempfolderpath+" && rm -f *flash* && wget "+url32+"\ntar xvf *flash* libflashplayer.so && rm -f libflashplayer.so && rm -f *flash*";
				}else{
					newcommand = "cd "+tempfolderpath+" && rm -f *flash* && wget "+url32+"\nNEWHASH32=$(md5sum *flash* | sed 's/ .*//g')\nif [ \"${NEWHASH32}\" == '"+hash32+"' ];then\ntar xvf *flash* libflashplayer.so && rm -f libflashplayer.so && rm -f *flash*\nelse\necho '"+hashnotmatch32+"'\nrm -f *flash*\nfi";
				}
			}
			if(aCommand === "beta64-install"){
				if(hash64 === "*"){
					newcommand = "cd "+tempfolderpath+" && rm -f *flash* && wget "+url64+"\ntar xvf *flash* libflashplayer.so && sudo chown root:root libflashplayer.so && sudo chmod 0644 libflashplayer.so && sudo mv libflashplayer.so /usr/lib/mozilla/plugins/ && sudo ln -s /usr/lib/mozilla/plugins/libflashplayer.so /usr/lib/firefox-addons/plugins/libflashplayer.so && rm -f *flash*";
				}else{
					newcommand = "cd "+tempfolderpath+" && rm -f *flash* && wget "+url64+"\nNEWHASH64=$(md5sum *flash* | sed 's/ .*//g')\nif [ \"${NEWHASH64}\" == '"+hash64+"' ];then\ntar xvf *flash* libflashplayer.so && sudo chown root:root libflashplayer.so && sudo chmod 0644 libflashplayer.so && sudo mv libflashplayer.so /usr/lib/mozilla/plugins/ && sudo ln -s /usr/lib/mozilla/plugins/libflashplayer.so /usr/lib/firefox-addons/plugins/libflashplayer.so && rm -f *flash*\nelse\necho '"+hashnotmatch64+"'\nrm -f *flash*\nfi";
				}
			}
			if(aCommand === "beta32-install"){
				if(hash32 === "*"){
					newcommand = "cd "+tempfolderpath+" && rm -f *flash* && wget "+url32+"\ntar xvf *flash* libflashplayer.so && sudo chown root:root libflashplayer.so && sudo chmod 0644 libflashplayer.so && sudo mv libflashplayer.so /usr/lib/mozilla/plugins/ && sudo ln -s /usr/lib/mozilla/plugins/libflashplayer.so /usr/lib/firefox-addons/plugins/libflashplayer.so && rm -f *flash*";
				}else{
					newcommand = "cd "+tempfolderpath+" && rm -f *flash* && wget "+url32+"\nNEWHASH32=$(md5sum *flash* | sed 's/ .*//g')\nif [ \"${NEWHASH32}\" == '"+hash32+"' ];then\ntar xvf *flash* libflashplayer.so && sudo chown root:root libflashplayer.so && sudo chmod 0644 libflashplayer.so && sudo mv libflashplayer.so /usr/lib/mozilla/plugins/ && sudo ln -s /usr/lib/mozilla/plugins/libflashplayer.so /usr/lib/firefox-addons/plugins/libflashplayer.so && rm -f *flash*\nelse\necho '"+hashnotmatch32+"'\nrm -f *flash*\nfi";
				}
			}
			if(aCommand === "beta64-install-x86_64-i686"){
				if(hash64 === "*"){
					newcommand = "cd "+tempfolderpath+" && rm -f *flash* && wget "+url64+"\ntar xvf *flash* libflashplayer.so && sudo chown root:root libflashplayer.so && sudo chmod 0644 libflashplayer.so && sudo mv libflashplayer.so /usr/lib/mozilla/plugins/ && sudo ln -s /usr/lib/mozilla/plugins/libflashplayer.so /usr/lib/firefox-addons/plugins/libflashplayer.so && rm -f *flash* && mkdir ~/.mozilla/plugins/";
				}else{
					newcommand = "cd "+tempfolderpath+" && rm -f *flash* && wget "+url64+"\nNEWHASH64=$(md5sum *flash* | sed 's/ .*//g')\nif [ \"${NEWHASH64}\" == '"+hash64+"' ];then\ntar xvf *flash* libflashplayer.so && sudo chown root:root libflashplayer.so && sudo chmod 0644 libflashplayer.so && sudo mv libflashplayer.so /usr/lib/mozilla/plugins/ && sudo ln -s /usr/lib/mozilla/plugins/libflashplayer.so /usr/lib/firefox-addons/plugins/libflashplayer.so && rm -f *flash* && mkdir ~/.mozilla/plugins/\nelse\necho '"+hashnotmatch64+"'\nrm -f *flash* && mkdir ~/.mozilla/plugins/\nfi";
				}
			}
			if(aCommand === "beta32-install-x86_64-i686"){
				if(hash32 === "*"){
					newcommand = "cd "+tempfolderpath+" && rm -f *flash* && wget "+url32+"\ntar xvf *flash* libflashplayer.so && mv libflashplayer.so ~/.mozilla/plugins/ && rm -f *flash*";
				}else{
					newcommand = "cd "+tempfolderpath+" && rm -f *flash* && wget "+url32+"\nNEWHASH32=$(md5sum *flash* | sed 's/ .*//g')\nif [ \"${NEWHASH32}\" == '"+hash32+"' ];then\ntar xvf *flash* libflashplayer.so && mv libflashplayer.so ~/.mozilla/plugins/ && rm -f *flash*\nelse\necho '"+hashnotmatch32+"'\nrm -f *flash*\nfi";
				}
			}
			//*****************************************symlinks********************************************
			if(aCommand === "gnash-symlink-opt"){
				newcommand = "sudo ln -s /usr/lib/gnash/libgnashplugin.so /opt/firefox/plugins/libflashplayer.so";
			}
			if(aCommand === "lightspark-symlink-opt"){
				newcommand = "sudo ln -s /usr/lib/lightspark/liblightsparkplugin.so /opt/firefox/plugins/libflashplayer.so";
			}
			if(aCommand === "googlechrome-symlink-opt"){
				newcommand = "sudo ln -s /usr/lib/mozilla/plugins/libflashplayer.so /opt/firefox/plugins/libflashplayer.so";
			}		
			if(aCommand === "flashplugin-symlink-opt"){
				newcommand = "sudo ln -s /usr/lib/mozilla/plugins/flashplugin-alternative.so /opt/firefox/plugins/libflashplayer.so";
			}
			if(aCommand === "beta-symlink-opt"){
				newcommand = "sudo ln -s /usr/lib/mozilla/plugins/libflashplayer.so /opt/firefox/plugins/libflashplayer.so";
			}
			//*****************************************tweaks********************************************

			//***********************npviewer tweak********************
			if(aCommand === "npviewer-tweak-add"){
				newcommand = "NPVIEWER=/usr/lib/nspluginwrapper/i386/linux/npviewer";
				newcommand = newcommand+newline+"if test -f \"${NPVIEWER}\";then";
				newcommand = newcommand+newline+"TWEAK=$(cat /usr/lib/nspluginwrapper/i386/linux/npviewer | grep 'GDK_NATIVE_WINDOWS=1')";
				newcommand = newcommand+newline+"if test -z \"${TWEAK}\";then";
				newcommand = newcommand+newline+"echo '#!/bin/sh' | sudo tee /usr/lib/nspluginwrapper/i386/linux/npviewer";
				newcommand = newcommand+newline+"echo 'TARGET_OS=linux' | sudo tee -a /usr/lib/nspluginwrapper/i386/linux/npviewer";
				newcommand = newcommand+newline+"echo 'TARGET_ARCH=i386' | sudo tee -a /usr/lib/nspluginwrapper/i386/linux/npviewer";
				newcommand = newcommand+newline+"echo 'case \"$*\" in' | sudo tee -a /usr/lib/nspluginwrapper/i386/linux/npviewer";
				newcommand = newcommand+newline+"echo '*libflashplayer*)' | sudo tee -a /usr/lib/nspluginwrapper/i386/linux/npviewer";
				newcommand = newcommand+newline+"echo '	export GDK_NATIVE_WINDOWS=1' | sudo tee -a /usr/lib/nspluginwrapper/i386/linux/npviewer";
				newcommand = newcommand+newline+"echo '	;;' | sudo tee -a /usr/lib/nspluginwrapper/i386/linux/npviewer";
				newcommand = newcommand+newline+"echo 'esac' | sudo tee -a /usr/lib/nspluginwrapper/i386/linux/npviewer";
				newcommand = newcommand+newline+"echo '. /usr/lib/nspluginwrapper/noarch/npviewer' | sudo tee -a /usr/lib/nspluginwrapper/i386/linux/npviewer";
				newcommand = newcommand+newline+"fi";
				newcommand = newcommand+newline+"fi";			
			}
			if(aCommand === "npviewer-tweak-remove"){
				newcommand = "NPVIEWER=/usr/lib/nspluginwrapper/i386/linux/npviewer";
				newcommand = newcommand+newline+"if test -f \"${NPVIEWER}\";then";
				newcommand = newcommand+newline+"cat /usr/lib/nspluginwrapper/i386/linux/npviewer | sed '/export GDK_NATIVE_WINDOWS=1/d' | sudo tee /usr/lib/nspluginwrapper/i386/linux/npviewer";
				newcommand = newcommand+newline+"fi";
			}
			//***********************vdpau tweak********************
			if(aCommand === "vdpau-tweak-add"){
				newcommand = "TWEAK=$(cat /etc/adobe/mms.cfg | grep 'EnableLinuxHWVideoDecode')";
				newcommand = newcommand+newline+"if test -z \"${TWEAK}\";then";
				newcommand = newcommand+newline+"echo 'EnableLinuxHWVideoDecode=1' | sudo tee -a /etc/adobe/mms.cfg";
				newcommand = newcommand+newline+"fi";			
			}
			if(aCommand === "vdpau-tweak-remove"){
				newcommand = "cat /etc/adobe/mms.cfg | sed '/EnableLinuxHWVideoDecode=1/d' | sudo tee /etc/adobe/mms.cfg";
			}
			//***********************gpu overrride tweak********************
			if(aCommand === "gpuoverride-tweak-add"){
				newcommand = "TWEAK=$(cat /etc/adobe/mms.cfg | grep 'OverrideGPUValidation')";
				newcommand = newcommand+newline+"if test -z \"${TWEAK}\";then";
				newcommand = newcommand+newline+"echo 'OverrideGPUValidation=true' | sudo tee -a /etc/adobe/mms.cfg";
				newcommand = newcommand+newline+"fi";
			}
			if(aCommand === "gpuoverride-tweak-remove"){
				newcommand = "cat /etc/adobe/mms.cfg | sed '/OverrideGPUValidation=true/d' | sudo tee /etc/adobe/mms.cfg";
			}
			return newcommand;
		},

		openLink : function(aSite) {

			"use strict";

			var url;

			if (aSite == "docs") {
				url = "https://github.com/webgapps/flashaid/wiki";
			}
			if (aSite == "support") {
				url = "https://github.com/webgapps/flashaid/issues";
			}
			if (aSite.match("file:") || aSite.match("http:")) {
				url = aSite;
			}

			// open site in new tab
			var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]
			.getService();
			var wmed = wm.QueryInterface(Components.interfaces.nsIWindowMediator);
			var win = wmed.getMostRecentWindow("navigator:browser");

			if (!win) {
				win = window.openDialog("chrome://browser/content/browser.xul",
						"_blank", "chrome,all,dialog=no", url, null, null);
			} else {
				var content = win.document.getElementById("content");
				content.selectedTab = content.addTab(url);
			}
		},

		openFile : function(aPref,aText) {

			"use strict";

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
					//document.getElementById("terminal").value = file.path;
				}
				if(aPref === "customurlpath"){
					//update element
					document.getElementById("customurlpath").value = file.path;
				}
			}
		},

		resetPath : function(aPref) {

			"use strict";

			//access preferences interface
			this.prefs = Components.classes["@mozilla.org/preferences-service;1"]
			.getService(Components.interfaces.nsIPrefService)
			.getBranch("extensions.flashaid.");

			//fetch localization from strbundle
			var strbundle = document.getElementById("flashaidstrings");

			//reset field
			if(aPref === "terminal"){

				var terminalpath = false;

				//get paths from environment variables
				var envpaths = Components.classes["@mozilla.org/process/environment;1"]
				.getService(Components.interfaces.nsIEnvironment)
				.get('PATH');

				if(envpaths){

					//split
					var newpath = envpaths.split(":");

					//find
					for(var i=0; i< newpath.length; i++){

						try{
							//initiate file
							var xterminal = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
							xterminal.initWithPath(newpath[i]+"/x-terminal-emulator");
							if(xterminal.exists()){
								document.getElementById("terminal").value = "/usr/bin/x-terminal-emulator";
								this.prefs.setCharPref("terminal",xterminal.path);
								terminalpath = true;
							}
						}catch(e){
							//do nothing
						}
						try{
							//initiate file
							var xfce4 = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
							xfce4.initWithPath(newpath[i]+"/xfce4-terminal");
							if(xfce4.exists()){
								document.getElementById("terminal").value = xfce4.path;
								this.prefs.setCharPref("terminal",xfce4.path);
								terminalpath = true;
							}
						}catch(e){
							//do nothing
						}
						try{
							//initiate file
							var konsole = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
							konsole.initWithPath(newpath[i]+"/konsole");
							if(konsole.exists()){
								document.getElementById("terminal").value = konsole.path;
								this.prefs.setCharPref("terminal",konsole.path);
								terminalpath = true;
							}
						}catch(e){
							//do nothing
						}
						try{
							//initiate file
							var gnometerminal = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
							gnometerminal.initWithPath(newpath[i]+"/gnome-terminal");
							if(gnometerminal.exists()){
								document.getElementById("terminal").value = gnometerminal.path;
								this.prefs.setCharPref("terminal",gnometerminal.path);
								terminalpath = true;
							}
						}catch(e){
							//do nothing
						}
					}
				}
				if(terminalpath === false){

					//reset terminal path
					this.prefs.setCharPref("terminal","");

					//alert user
					var message = strbundle.getString("noterminal");
					var messagetitle = strbundle.getString("flashaidalert");
					var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
					.getService(Components.interfaces.nsIPromptService);
					prompts.alert(window, messagetitle, message);
				}
			}
			if(aPref === "customurlpath"){
				document.getElementById("customurlpath").value = "";
			}
		}
};