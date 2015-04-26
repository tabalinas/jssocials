var app = (function(document, $) {

  'use strict';
  var docElem = document.documentElement,

    _userAgentInit = function() {
      docElem.setAttribute('data-useragent', navigator.userAgent);
    },
    _init = function() {
      $(document).foundation();
      _userAgentInit();
    };

  return {
    init: _init
  };

})(document, jQuery);

(function() {

  'use strict';
  app.init();

})();
