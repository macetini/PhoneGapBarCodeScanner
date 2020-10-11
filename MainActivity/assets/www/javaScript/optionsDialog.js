/**
 * 
 * Options Dialog
 * 
 */

$(document).on("pagechange", function( e, data ) {
	
	if( $('.ui-page-active').attr('id') != "optionsDialog")
		return;
	
	console.log("--- document: pagechange event handler ---");	
	
	console.log("--- page id: " + $('.ui-page-active').attr('id'));
	
	switch(window.lang) {
	
		case "en_EN":
			$('#engLangBtn').attr("checked",true).checkboxradio("refresh");
			break;
		case "hr_HR":
			$('#hrvLangBtn').attr("checked",true).checkboxradio("refresh");
			break;
	}
	
	$('#theme' + window.currentTheme).attr("checked",true).checkboxradio("refresh");
	
	$('.jqm-page').trigger('refresh', window.currentTheme);
});

$(".langRb").live( "change", function(event, ui) {
	  
	console.log("--- langRb change event handler ---");
	
	window.lang = this.value;
	
	window.langChanged = true;
	
	window.localStorage.setItem("lang", window.lang);
	
	loadBundles(window.lang);
});

$(".themeRb").live( "change", function(event, ui) {
	  
	console.log("--- themeRb change event handler ---");
	
	window.currentTheme = this.value;
	
	window.localStorage.setItem("theme", window.currentTheme);
	
	setDefaultTheme(window.currentTheme);
		
	$('.jqm-page').trigger('refresh', window.currentTheme);
});

function element_theme_refresh( element, oldTheme, newTheme ) {

	/* Update the page's new data theme. */
	if( $(element).attr('data-theme') ) {
		$(element).attr('data-theme', newTheme);
	}

	if( $(element).attr('class') ) {
		/* Theme classes end in "-[a-z]$", so match that */
		var classPattern = new RegExp('-' + oldTheme + '$');
		newTheme = '-' + newTheme;

		var classes =  $(element).attr('class').split(' ');

		for( var key in classes ) {
			if( classPattern.test( classes[key] ) ) {
				classes[key] = classes[key].replace( classPattern, newTheme );
			}
		}

		$(element).attr('class', classes.join(' '));
	}
}
	
$('.jqm-page').live('refresh', function(e, newTheme) {

	var oldTheme = $(this).attr('data-theme') || 'b';
	newTheme = newTheme || 'b';
		
	element_theme_refresh( $(this), oldTheme, newTheme );

	$(this).find('*').each(function() {
		element_theme_refresh( $(this), oldTheme, newTheme );
	});
});

$("#dialogCloseBtn").live("click", function() {
	
	console.log("--- dialogCloseBtn event click handler ---");
	
	$('.ui-dialog').dialog('close');
});