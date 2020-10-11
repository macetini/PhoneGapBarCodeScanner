window.lastResponse;
window.lastResponseStatus;

$(document).on("pagechange", function( e, data ) {

	if( $('.ui-page-active').attr('id') != "scanResult")
		return;
	
	window.backPage = "scanResult.html"
	
	console.log("--- document: pagechange event handler ---");
	
	console.log("--- page id: " + $('.ui-page-active').attr('id'));
	
	if(data.options.data != undefined)
	{	
		if( data.options.data.origin != undefined)
		{
			displayResponse(window.lastResponse, true);
			return;
		}
		
		window.currCode = data.options.data.code;
		
		var newResponse = data.options.data.responseData;
			
		window.lastResponse = newResponse;
		
		displayResponse(newResponse, window.langChanged);
		
	} else
		if(window.langChanged)
			$.mobile.changePage("scannerLoading.html", { data: {code: window.currCode} });
		else
			displayResponse(window.lastResponse, true);
});

$("#detailsBtn").live("click", function(event, ui) {
	
	console.log("--- dialogBtn: click event handler ---");
	
	var detailsText = returnFirstElemValueFromXML(window.lastResponse, "napomena");
	
	console.log("--- detailsText: " + detailsText);
		
	$.mobile.changePage("detailsPage.html", { data: {detailsData: detailsText} } );
});

function returnTimeStr(date)
{
	console.log("--- returnTimeStr ---")
	
	var hours = date.getHours();
	var hoursStr;
	
	if(hours < 10)
		hoursStr = "0" + hours.toString();
	else
		hoursStr = hours.toString();
	
	var minutes = date.getMinutes();
	var minutesStr;
	
	if(minutes < 10)
		minutesStr = "0" + minutes.toString();
	else
		minutesStr = minutes.toString();
	
	return hoursStr + ":" + minutesStr;
}

function returnDateStr(date)
{
	console.log("--- returnDateStr ---");
	
	var yearStr = date.getFullYear().toString();
	
	var month = date.getMonth() + 1;
	var monthStr;
	
	if(month < 10)
		monthStr = "0" + month.toString();
	else
		monthStr = month.toString();
	
	var day = date.getDate();
	var dayStr;
	
	if(day < 10)
		dayStr = "0" + day.toString();
	else
		dayStr = day.toString();
	
	return dayStr + "/" + monthStr + "/" + yearStr;
}

function parseISO8601DateStr(ISO8601DateStr)
{
	console.log("--- parseISO8601DateStr ---");
	
	var parts = ISO8601DateStr.split("T");
	
	var dateParts = parts[0].split("-");
	
	var timesParts = parts[1].split("+");
	
	var timeParts = timesParts[0].split(":");
	
	var gmtParts =  timesParts[1].split(":");
	
	var date = new Date();
	
	date.setFullYear(Number(dateParts[0]));
	date.setMonth(Number(dateParts[1])-1);
	date.setDate(Number(dateParts[2]));
	
	date.setHours(Number(timeParts[0]));
	date.setMinutes(Number(timeParts[1]));
	date.setSeconds(Number(timeParts[2]));
	
	return date;
}

function setResponseStatus(responseStatus, response)
{
	var msg;
	
	if(responseStatus == "false")
	{	
		var errorMsg = returnFirstElemValueFromXML(response, "error");
		
		var msg;
		
		switch(errorMsg)
		{
			case "msgKartaUsed":
				msg = jQuery.i18n.prop("msgKartaUsed");
				break;
			case "msgPozKartaExc2":
				msg = jQuery.i18n.prop("msgPozKartaExc2");
				break;
			case "msgPozKartaExc5":
				msg = jQuery.i18n.prop("msgPozKartaExc5");
				break;
			default :
				if(errorMsg == '' || errorMsg == null || errorMsg == undefined )
					errorMsg = jQuery.i18n.prop("unknownError", errorMsg);
				msg = jQuery.i18n.prop("resultDefaultError", errorMsg);
				break;
		}
	
		$('#resultStatus').html(msg);
		$('#resultStatus').css("color", "red");
		$('.tableData').css("color", "red");
	} else {
	
		msg = jQuery.i18n.prop("resultStatusOK"); 
	
		$('#resultStatus').html(msg);
		$('#resultStatus').css("color", "green");
	}
}

function displayResponse(response, useOldStatus) {
	
	console.log("--- displayResponse ---");
		
	var responseStatus = returnFirstElemValueFromXML(response, "success");
	
	if(!useOldStatus)
		window.lastResponseStatus = responseStatus;
	else
		window.langChanged = false;
	
	setResponseStatus(window.lastResponseStatus, response);
	
	$('#purchasePlaceCell').html(returnFirstElemValueFromXML(response, "nProdmj"));
	var datUnosISO8601Str = returnFirstElemValueFromXML(response, "datUnos");
	
	var datUnosDate = parseISO8601DateStr(datUnosISO8601Str);
	$('#purchaseDateCell').html(returnDateStr(datUnosDate));
	
	var datBookISO8601Str = returnFirstElemValueFromXML(response, "datBook");
	var datBookDate = parseISO8601DateStr(datBookISO8601Str);
	var excursion = returnDateStr(datBookDate) + " " + returnFirstElemValueFromXML(response, "nIzlet");				
	$('#excursionCell').html(excursion);
	
	var vriPolISO8601Str = returnLastElemValueFromXML(response, "vriPol");	
	var vriPolDate = parseISO8601DateStr(vriPolISO8601Str);
	var timeOfBoarding = returnTimeStr(vriPolDate) + " " + returnLastElemValueFromXML(response, "nMjesto");
	
	$('#boardingLocationCell').html(timeOfBoarding);
	
	$('#guideLanguageCell').html(returnFirstElemValueFromXML(response, "nJezik"));
	
	var adlNumStr = returnFirstElemValueFromXML(response, "kAdl");
	var adlCijStr = returnFirstElemValueFromXML(response, "cij");
	
	$('#adlNumCell').html(adlNumStr);
	
	krtVal = returnFirstElemValueFromXML(response, "krtVal");
	$('#pricePerAdultCell').html(adlCijStr + " " + krtVal);
	
	var chdNumStr = returnFirstElemValueFromXML(response, "kChd");
	var chdCijStr = returnFirstElemValueFromXML(response, "cijChd");
	
	$('#chlNumCell').html(chdNumStr);
	$('#pricePerChildCell').html(chdCijStr + " " + krtVal);
	
	$('#infNumCell').html(returnFirstElemValueFromXML(response, "kInf"));
	
	$('#buyerCell').html(returnFirstElemValueFromXML(response, "nositelj"));

	var total = returnFirstElemValueFromXML(response, "iznos");
	
	$('#totalCell').html(total+ " " + krtVal);
}