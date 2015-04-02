(function($) {
    $.fn.jsSocials = function() {
        return this.each(function(i) {
            // Do something to each selected element.
            $(this).html("jsSocials" + i);
        });
    };
}(jQuery));
