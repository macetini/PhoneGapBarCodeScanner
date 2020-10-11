/**
 * 
 * loginPage.js
 * 
 */

$(document).on( "pagechange", function( e, data ) {
	
	if( $('.ui-page-active').attr('id') != "loginPage")
		return;
	
	console.log("--- document: pagechange event handler ---");	
	
	console.log("--- page id: " + $('.ui-page-active').attr('id'));
	
	var placeholder = jQuery.i18n.prop("usernamePlaceholder");
	
	$("#username").attr("placeholder", placeholder);
	
	placeholder = jQuery.i18n.prop("passwordPlaceholder");
	
	$("#password").attr("placeholder", placeholder);
	
	if(window.lastUserName != null)
		$("#username").val(window.lastUserName);
});

function openAuthPopUp(textStatus, errorThrown, status) {
	
	console.log("--- openAuthPopUp ---");
	
	var msg;
	
	switch(status)
	{
		case -1:
			msg = jQuery.i18n.prop("noUserName");
			break;
		case -2:
			msg = jQuery.i18n.prop("noPass");
			break;
		case 0:
		case 404:
			msg = jQuery.i18n.prop("serverCommError");
			break;
		case 500:
			msg = jQuery.i18n.prop("authentError");
			break;
		default:
			msg = jQuery.i18n.prop("unknowError", status);
			break;
	}
	
	console.log("--- msg: " + msg);
	
	$("#authFailPopUpText").html(msg);
	$("#authFailPopUp").popup("open");
}

function checkIfLoginDataValid()
{
	console.log("--- checkLoginData ---");
	
	window.username = $("#username").val();
	
	var msg;
	
	if(window.username == '')
	{
		openAuthPopUp(null, null, -1);
		return false;
	}
	
	window.password = $("#password").val();
	
	if(window.password == '')
	{
		openAuthPopUp(null, null, -2);
		return false;
	}
	
	return true;
}

$( "#username" ).live( "keyup", function(event, ui) {
	
	$(this).val($(this).val().toUpperCase());
});

$(document).keypress(function(e) {
	
    if(e.which == 13)
    {
    	e.preventDefault();
    	return;
    }
});

$("#submitBtn").live("click", function(event, ui) {
	
	login();
});
	
function login(){

	console.log("--- submitBtn click handler ---");
	
	if(!hasInternetConnection())
		return;
	
	if(!checkIfLoginDataValid())
		return;

	var url = window.baseUrl + "login";
	//var url = "http://192.168.134.11:8400/dev-app/servlet/ws/ticketVerification/excursions/login";
	
	console.log("--- ajax request - url: " + url);
		
	window.jqXHR = $.ajax
	({
		type : "POST",
	    url : url,
	    dataType : "text",
		contentType : "text/xml",
	    timeout : 25000,
	    beforeSend : function (jqXHR, settings) {
	    	
	    	console.log("--- ajax request - beforeSend");
	    	
	    	startObjectRotation("#loginLogoImg");
	    	
	    	var btnLoadingLabel = jQuery.i18n.prop("btnLoadingLabel");
	    	
	        $("#submitBtn .ui-btn-text").html(btnLoadingLabel);
	        
	        $('input, a').addClass("ui-disabled");

	    	jqXHR.setRequestHeader('Authorization', makeBaseAuth(window.username, window.password));
	    },
	    complete : function(jqXHR, textStatus) {
			
			console.log("--- ajax complete - url: " + url);
			
			$("#submitBtn .ui-btn-text").html("Submit");
			
			$('input, a').removeClass("ui-disabled");
			
			stopObjectRotation();
		},
	    success : function (data, textStatus, jqXHR) {
	    	
	    	console.log("--- ajax request - success");
	    	
	    	window.localStorage.setItem("userName", window.username);

	    	$.mobile.changePage("scannerPage.html");
	    },
	    error : function( jqXHR, textStatus, errorThrown) {
	    	
			console.log("--- ajax error - url: " + url);
			
			console.log("--- jqXHR.status: " + jqXHR.status);
			console.log("--- textStatus: " + textStatus);
			console.log("--- errorThrown: " + errorThrown);
			
			if(textStatus == "abort")
				return;
			
			var errorMsg = "Authentication " + textStatus + "! " + errorThrown;
			
			openAuthPopUp(textStatus, errorThrown, jqXHR.status);
		}
	});
}