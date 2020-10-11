window.lastStatus;
window.lastErrorMsg;

$(document).on( "pagechange", function( e, data ) {
	
	if( $('.ui-page-active').attr('id') != "errorPage")
		return;

	console.log("--- document: pagechange event handler ---");
	
	console.log("--- page id: " + $('.ui-page-active').attr('id'));
	
	var status;
	var errorMsg;
	
	if(data.options.data != undefined)
	{
		status = data.options.data.status;
		window.lastStatus = status;
	
		errorMsg = data.options.data.errorMsg;
		window.lastErrorMsg = errorMsg;
	} else {
		
		status = window.lastStatus;
		errorMsg = window.lastErrorMsg;
	}
	
	console.log("--- status: " + status);
	
	console.log("--- errorMsg: " + errorMsg);
	
	var msg;
	
	switch(status)
	{
		case -1:
			msg = jQuery.i18n.prop("wrongCodeFormat", errorMsg);
			break;
		case -2:
			msg = jQuery.i18n.prop("scannerError", errorMsg);
			break;
		case 0:
		case 404:
			msg = jQuery.i18n.prop("serverCommError");
			break;
		case 500:
			msg = customError(errorMsg);
		break;
		default:
				msg = jQuery.i18n.prop("unknowError", status);
			break;
			}
	
	console.log("--- msg: " + msg);
	$('#errorString').html(msg);
});

function customError(errorMsg)
{
	var retMsg;
	
	switch(errorMsg)
	{
		case "msgNoTicket":
			retMsg = jQuery.i18n.prop("msgNoTicket");
		break;
		case "error":
		default:
			if(errorMsg == '' || errorMsg == null || errorMsg == undefined )
				errorMsg = jQuery.i18n.prop("unknownError", errorMsg);
			retMsg = jQuery.i18n.prop("authentErrorOnErrorPage", errorMsg);
			break;
	}
	
	return retMsg;
}
