/**
 * 
 */

window.lastDetails;

$(document).on( "pagechange", function( e, data ) {

	if( $('.ui-page-active').attr('id') != "detailsPage")
		return;
	
	console.log("--- document: pagechange event handler ---");
	
	console.log("--- page id: " + $('.ui-page-active').attr('id'));
	
	if(window.langChanged)
		$.mobile.changePage("scannerLoading.html", { data: {code: window.currCode} });
	else
		if(data.options.data != undefined)
		{
			var newDetailsData = data.options.data.detailsData;
			
			window.lastDetails = newDetailsData;
			
			$("#detailsContent").html(newDetailsData);
		}else
			$("#detailsContent").html(window.lastDetails);
});

$("#detailsBackBtn").live("click", function(event, ui) {
	
	console.log("--- dialogBtn: click event handler ---");
	
	$.mobile.changePage("scanResult.html", { data: {origin: "detail"} });
});