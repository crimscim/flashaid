var flashaidOverlay = {

		showHideMenus: function () {//show and hide context menus

			//access preferences interface
			this.prefs = Components.classes["@mozilla.org/preferences-service;1"]
			.getService(Components.interfaces.nsIPrefService)
			.getBranch("extensions.flashaid.");

			//get prefs
			var sudo = this.prefs.getBoolPref("sudo");
			var apt = this.prefs.getBoolPref("apt");
			var wget = this.prefs.getBoolPref("wget");
			var md5sum = this.prefs.getBoolPref("md5sum");
			var terminal = this.prefs.getCharPref("terminal");
			var terminalalert = this.prefs.getBoolPref("terminalalert");
			var depoverride = this.prefs.getBoolPref("depoverride");
			var depalert = this.prefs.getBoolPref("depalert");

			//fetch localization from strbundle
			var strbundle = document.getElementById("flashaidstrings");

			//hide menus
			document.getElementById("flashaid-advanced").hidden = true;
			document.getElementById("flashaid-quick").hidden = true;
			document.getElementById("flashaid-quick-popup-chrome").hidden = true;
			document.getElementById("flashaid-wizard").hidden = true;
			document.getElementById("flashaid-helper-separator").hidden = true;

			//check chrome
			var googlechrome = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
			googlechrome.initWithPath("/opt/google/chrome/libgcflashplayer.so");
			if(googlechrome.exists()){
				googlechrome = true;
			}else{
				googlechrome = false;
			}

			if(sudo === false || apt === false || wget === false || md5sum === false){

				if(depoverride === true ){

					//toggle menus
					document.getElementById("flashaid-advanced").hidden = false;
					document.getElementById("flashaid-helper-separator").hidden = false;

				}else{

					if(depalert == false){
						//reset alert
						this.prefs.setBoolPref("depalert", true);

						//alert user
						var message = strbundle.getString("dependencyerror");
						var messagetitle = strbundle.getString("flashaidalert");
						var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
						.getService(Components.interfaces.nsIPromptService);
						prompts.alert(window, messagetitle, message);
					}
				}

			}else{

				if(terminal == ""){

					if(terminalalert === false){
						//reset alert
						this.prefs.setBoolPref("terminalalert", true);

						var message = strbundle.getString("terminalpath");
						var messagetitle = strbundle.getString("flashaidalert");
						var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
						.getService(Components.interfaces.nsIPromptService);
						prompts.alert(window, messagetitle, message);
					}					
				}else{
					//toggle menus
					document.getElementById("flashaid-advanced").hidden = false;
					document.getElementById("flashaid-quick").hidden = false;
					if(googlechrome === true){
						document.getElementById("flashaid-quick-popup-chrome").hidden = false;
					}
					document.getElementById("flashaid-wizard").hidden = false;
					document.getElementById("flashaid-helper-separator").hidden = false;
				}
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
		}
};