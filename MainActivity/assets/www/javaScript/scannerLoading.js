/**
 * 
 * scannerLoading.js
 * 
 */

$(document).on( "pagechange", function( e, data ) {
	
	if( $('.ui-page-active').attr('id') != "scannerLoading")
		return;
	
	console.log("--- document: pagechange event handler ---");	
	
	console.log("--- page id: " + $('.ui-page-active').attr('id'));
	
	if(data.options.data == undefined)
		invokeBarcodeScanner();
	else{
		window.backPage = "scannerPage.html";
		callScanResultData(data.options.data.code, "getTicket");
	}
});

function invokeBarcodeScanner()
{
	console.log("--- invokeBarcodeScanner ---");
	
	window.langChanged = false;
	
	window.plugins.barcodeScanner.scan(function(result)
	{
		console.log("--- window.plugins.barcodeScanner.scan: result ---");
		
		console.log("--- cancelled: " + result.cancelled);
		console.log("--- format: " + result.format);
		console.log("--- text: " + result.text);
		
		var resultFormat = result.format;
		var resultText = result.text;
		var resultCancelled =  result.cancelled;
		
		if (resultCancelled == false) {
			
			if (resultFormat != "CODE_128")
			{
				console.log("--- window.plugins.barcodeScanner.scan: format error ---");
				
				$.mobile.changePage("errorPage.html", { data: {status: -1, errorMsg: resultFormat} });
				
			} else {
				console.log("--- window.plugins.barcodeScanner.scan: valid result ---");
				
				callScanResultData(resultText, "verify");
			}
		}else
			$.mobile.changePage(window.backPage);
		
	}, function(error) {

		console.log("--- window.plugins.barcodeScanner.scan: error ---");
			
		var scanError = error;
		
		$.mobile.changePage("errorPage.html",  { data: {status: -2, errorMsg: error} });	
	});
}

function returnLang()
{
	console.log("--- returnLang ---");
	
	var lang;
	
	switch(window.lang)
	{
		case "en_EN":
			lang = "eng";
			break;
		case "hr_HR":
			lang = "hrv";
			break;
		default:
			lang = "en_EN";
	}
	
	return lang;
}

function callScanResultData(resultText, urlEnd)
{
	console.log("--- callScanResultData ---");
	
	console.log("--- resultText: " + resultText);
	
	console.log("--- urlEnd: " + urlEnd);
	
	var lang = returnLang();
	
	console.log("--- lang: " + lang);

	var data = "<ticketVerification>" + "<rezKarta><idRezKarta>" + resultText + "</idRezKarta></rezKarta>" + "<lang>" + lang + "</lang>" + "</ticketVerification>";
	
	console.log("xml: " + data);
	
	//var url = "http://192.168.134.11:8400/dev-app/servlet/ws/ticketVerification/excursions/verify";
	var url = window.baseUrl + urlEnd;//"verify";
	//var url = "http://192.168.133.77:8400/dev-app/servlet/ws/ticketVerification/excursions/verify";
	
	console.log("--- ajax call - url: " + url);
		
	window.jqXHR = $.ajax({
		url : url,
		headers : {
			Accept : "text/xml; charset=utf-8"
		},
		type : "POST",
		dataType : "text",
		contentType : "text/xml",
		data : data,
		timeout : 25000,
		beforeSend : function(jqXHR, settings) {
			
			console.log("--- beforeSend - url: " + url);
			
			startObjectRotation("#loadingImg");
			
			jqXHR.setRequestHeader('Authorization', makeBaseAuth(window.username, window.password));
		},
		complete : function(jqXHR, textStatus) {
			
			console.log("--- ajax complete - url: " + url);
			
			stopObjectRotation();
		},
		success : function(data, textStatus, jqXHR) {
			
			console.log("--- ajax response - url: " + url);
			console.log("--- response data: " + data);
			
			$.mobile.changePage("scanResult.html", { data: {responseData: data, code: resultText} } );
		},
		error : function( jqXHR, textStatus, errorThrown) {
			
			console.log("--- ajax error - url: " + url);
			
			console.log("--- jqXHR.status: " + jqXHR.status);
			console.log("--- textStatus: " + textStatus);
			console.log("--- errorThrown: " + errorThrown);
			
			window.langChanged = false;
			
			if(textStatus == "abort")
				return;
			
			var msg;
			
			console.log("--- jqXHR.responseText: " + jqXHR.responseText);
			
			if(jqXHR.responseText != undefined)
				msg = returnFirstElemValueFromXML(jqXHR.responseText, "error");
			else
				msg = textStatus;
						
			$.mobile.changePage("errorPage.html", { data: {status: jqXHR.status, errorMsg: msg} });
		}
	});
}