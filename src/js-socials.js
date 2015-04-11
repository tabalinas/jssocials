(function(window, $, undefined) {

    var JSSOCIALS = "JSSocials",
        JSSOCIALS_DATA_KEY = JSSOCIALS;

    var shares = [];

    function Socials(element, config) {
        var $element = $(element);

        $element.data(JSSOCIALS_DATA_KEY, this);

        this._$element = $element;

        this.shares = [];

        this._init(config);
        this._render();
    }

    Socials.prototype = {

        elementClass: "jssocials",

        _init: function(config) {
            $.extend(this, config);
            this._initShares();
        },

        _initShares: function() {
            var self = this;
            self.shares = $.map(self.shares, function(share) {
                if(typeof(share) === "string") {
                    share = { name: share };
                }

                var ShareClass = (share.name && shares[share.name]);

                if(!ShareClass) {
                    throw Error("Share '" + share.name + "' is not found");
                }

                return new ShareClass(share);
            });
        },

        _render: function() {
            this._clear();
            this._$element.addClass(this.elementClass);
        },

        _clear: function() {
            this._$element.empty();
        },

        refresh: function() {
            this._clear();
            this._render();
        },

        destroy: function() {
            this._clear();

            this._$element
                .removeClass(this.elementClass)
                .removeData(JSSOCIALS_DATA_KEY);
        },

        option: function(key, value) {
            if(arguments.length === 1) {
                return this[key];
            }

            this[key] = value;
            this.refresh();
        }

    };


    $.fn.jsSocials = function(config) {
        var args = $.makeArray(arguments),
            methodArgs = args.slice(1),
            result = this;

        this.each(function() {
            var $element = $(this),
                instance = $element.data(JSSOCIALS_DATA_KEY),
                methodResult;

            if(instance) {
                if(typeof config === "string") {
                    methodResult = instance[config].apply(instance, methodArgs);
                    if(methodResult !== undefined && methodResult !== instance) {
                        result = methodResult;
                        return false;
                    }
                } else {
                    instance._init(config);
                    instance._render();
                }
            } else {
                new Socials($element, config);
            }
        });

        return result;
    };

    window.jsSocials = {
        Socials: Socials,
        shares: shares
    };

}(window, jQuery));
