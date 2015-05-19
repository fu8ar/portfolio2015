(function($) {

	// sticky footer tablet upwards
	function stickyFooter(){
	
		var HeaderAndFooter = 60;
		var windowHeight = $(window).height();
		var setMainSectionHeight = windowHeight - HeaderAndFooter;

		$("#main").css("min-height", setMainSectionHeight);
	}

    /* set the main height
    of the main section */
	stickyFooter();

	$(window).resize(function(){
		stickyFooter();		
	});


})(jQuery);