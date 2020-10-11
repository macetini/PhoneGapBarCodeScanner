$(document).on("pagechange", function(e, data) {

	if ($('.ui-page-active').attr('id') != "scannerPage")
		return;

	window.backPage = "scannerPage.html";
		
	window.langChanged = false;

	console.log("--- document: pagechange event handler ---");

	console.log("--- page id: " + $('.ui-page-active').attr('id'));
});