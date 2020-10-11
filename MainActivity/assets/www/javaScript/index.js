/**
 * 
 * index.js
 * 
 */

window.lang;

window.backPage;

window.intervalId;

window.jqXHR;

window.currCode;
window.langChanged;

window.lastUserName;

window.currentTheme;

window.username;
window.password;

window.baseUrl = "https://fiskas-app.sintesys.hr/";

$(document).bind("mobileinit", function() {

	console.log("--- mobileinit ---");

	$.mobile.defaultPageTransition = 'none';
	$.mobile.defaultDialogTransition = 'none';
	$.mobile.useFastClick = true;
	
	$("[data-role=header]").fixedtoolbar({ tapToggle: false });
	
	$.mobile.phonegapNavigationEnabled = true;	
});

$(document).on( "pagechange popupbeforeposition", function(event, ui) { 

	if( $('.ui-page-active').attr('id') == undefined)
		return;
	
	console.log("--- document pagechange event ---");
	
	stopObjectRotation();
	
	loadBundles(window.lang);
});

function loadBundles(lang) {
	
	console.log("--- loadBundles ---");
	
	console.log("--- lang: " + lang);

    jQuery.i18n.properties({
            name : 'locales',
            path : '../bundle/',
            mode : 'both',
            language : lang,
            callback : function() {
            	updatePage();
            }
    });
}

function updatePage() {
	
	console.log("--- updatePage ---");

	$("span, a, h1, h2").each(function() { 
   	
		if(this.id != '')
		{
			var id = this.id;
			var idStr = "#" + id;
			
			var str = jQuery.i18n.prop(id);
			
			var tagName = $(idStr).get(0).tagName;
			
			//console.log("tagName: " + tagName);
			//console.log("str: " + str);
			
			switch(tagName)
			{
				case "A":
				case "LABEL":
					$(idStr + " .ui-btn-text").text(str);
					break;
				default:
					$(idStr).text(str);
					break;
			}
		}		
   });
}

document.addEventListener("deviceready", onDeviceReady, false);

function setDefaultTheme(defTheme)
{
    $.mobile.page.prototype.options.theme = defTheme;
	$.mobile.page.prototype.options.headerTheme = defTheme;
	$.mobile.dialog.prototype.options.theme = defTheme;

	$.mobile.selectmenu.prototype.options.menuPageTheme = defTheme;
	$.mobile.selectmenu.prototype.options.overlayTheme = defTheme;
}

function onDeviceReady() {
	
	console.log("--- onDeviceReady ---");
	
    document.addEventListener("backbutton", customBackButtonBehavior, false);
    
    window.lang = window.localStorage.getItem("lang");
        
    if(window.lang == null)
    {
    	window.lang = "en_EN";
    	window.localStorage.setItem("lang", window.lang);
    }
    
    window.lastUserName = window.localStorage.getItem("userName");
     
    window.currentTheme = window.localStorage.getItem("theme");
    
    if(window.currentTheme == null)
    {
    	window.currentTheme = "a";
    	window.localStorage.setItem("theme", window.currentTheme);
    }
    
    setDefaultTheme(window.currentTheme);
    
    $.mobile.changePage("data/loginPage.html");
}


function exitApp()
{
	console.log("--- exitApp ---");
	
	stopObjectRotation();
	navigator.app.exitApp();
}

function killXMLHttpRequest()
{
	console.log("--- killXMLHttpRequest ---");
	
	var jqXHRType = typeof window.jqXHR;
	
	console.log("--- type of window.jqXHR: " + jqXHRType);
	
	if(jqXHRType === "object")
	{
		window.jqXHR.abort();
		window.jqXHR = undefined;
	}
}

function customBackButtonBehavior() {
	
	console.log("--- customBackButtonBehavior ---");
	
	var currActivePage = $('.ui-page-active').attr('id');
	
	console.log("--- currActivePage: " + currActivePage);
	
	killXMLHttpRequest();
	
	switch(currActivePage)
	{
		case "loginPage":
			exitApp();
			break;
		case "scannerPage":
			$.mobile.changePage("loginPage.html");
			break;
		case "scannerLoading":
		case "errorPage":
			$.mobile.changePage(window.backPage);
			break;
		case "scanResult":
			$.mobile.changePage("scannerPage.html");
			break;
		case "detailsPage":
			$.mobile.changePage("scanResult.html", { data: {origin: "detail"} });
			break;
		case "optionsDialog":
			$('.ui-dialog').dialog('close');
			break;
		default:
			exitApp();
			break;
	}
}

$("#authFailPopUp").live("click", function(event, ui) {

	console.log("--- authFailPopUp click event handler ---");
	
	$("#authFailPopUp").popup("close");

});

function makeBaseAuth(user, password) {
	
	console.log("--- makeBaseAuth ---");
	
	var tok = user + ':' + password;
	var hash = $.base64Encode(tok);

	return "Basic " + hash;
}

function hasInternetConnection()
{
	console.log("--- hasInternetConnection ---");
	
	var networkState = navigator.network.connection.type;
	
	console.log("--- networkState: " + networkState);
	
	return true;
	
	//find better solution - for now use ajax error response
	
//	if (networkState == Connection.NONE) {
//		$("#noConnectionPopUp").popup("open");
//			return false;
//	} else
//			return true;
}

$("#noConnectionPopUp").live("click", function(event, ui) {
	
	console.log("--- noConnectionPopUp click event handler ---");
	
	$("#noConnectionPopUp").popup("close");
});

function returnFirstElemValueFromXML(xml, elem)
{
	console.log("--- returnFirstElemValueFromXML ---");

	console.log("--- elem key: " + elem);

	var retVal = $(xml).find(elem).first().text();

	console.log("--- elem val: " + retVal);

	return retVal;
}

function returnLastElemValueFromXML(xml, elem)
{
	console.log("--- returnLastElemValueFromXML ---");

	console.log("--- elem key: " + elem);

	var retVal = $(xml).find(elem).last().text();

	console.log("--- elem val: " + retVal);

	return retVal;
}

function startScanning()
{
	console.log("--- startScanning ---");
	
	var networkState = navigator.network.connection.type;

	if(!hasInternetConnection())
		return;
	
	
	
	$.mobile.changePage("scannerLoading.html");
}

$("#scanCodeBtn").live("click", function(event, ui) {

	console.log("--- scanCodeBtn: click handler ---");
	
	startScanning();
});

function rotateObject(objectId, deg)
{
	//console.log("--- rotateObject ---");
	
	//console.log("--- object id: " + objectId);
	//console.log("--- deg: ", deg);
	
	var rotate = "rotate(" + deg.toString() + "deg)";
		
	$(objectId).css("transform", rotate);
	$(objectId).css("-ms-transform", rotate);
	$(objectId).css("-moz-transform", rotate);
	$(objectId).css("-webkit-transform", rotate);
	$(objectId).css("-o-transform", rotate);
}

function stopObjectRotation()
{
	console.log("--- stopObjectRotation ---");
	
	clearInterval(window.intervalId);
}

function startObjectRotation(objectId)
{
	console.log("--- startObjectRotation ---");
	
	var angle = 0;
	window.intervalId = self.setInterval(function(){ angle+=3; rotateObject(objectId, angle); }, 50);	
}