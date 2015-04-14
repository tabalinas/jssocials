(function(window, $, undefined) {

    var JSSOCIALS = "JSSocials",
        JSSOCIALS_DATA_KEY = JSSOCIALS;

    var getOrApply = function(value, context) {
        if($.isFunction(value)) {
            return value.apply(context, $.makeArray(arguments).slice(2));
        }
        return value;
    };

    var IMG_SRC_REGEX = /(\.(jpeg|png|gif|bmp)$|^data:image\/(jpeg|png|gif|bmp);base64)/i;

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

        url: "",
        text: "",
        logoSize: 24,

        elementClass: "jssocials",
        sharesClass: "jssocials-shares",
        shareClass: "jssocials-share",
        shareButtonClass: "jssocials-share-button",
        shareLinkClass: "jssocials-share-link",
        shareLogoClass: "jssocials-share-logo",
        shareLabelClass: "jssocials-share-label",

        _init: function(config) {
            this._initDefaults();
            $.extend(this, config);
            this._initShares();
        },

        _initDefaults: function() {
            this.url = window.location.href;
            this.text = $("meta[name=description]").attr("content") || $("title").text();
        },

        _initShares: function() {
            this.shares = $.map(this.shares, $.proxy(function(shareConfig) {
                if(typeof(shareConfig) === "string") {
                    shareConfig = { share: shareConfig };
                }

                var share = (shareConfig.share && shares[shareConfig.share]);

                if(!share) {
                    throw Error("Share '" + shareConfig.share + "' is not found");
                }

                return $.extend({ url: this.url, text: this.text }, share, shareConfig);
            }, this));
        },

        _render: function() {
            this._clear();

            this._$element.addClass(this.elementClass);

            this._$shares = $("<div>").addClass(this.sharesClass)
                .appendTo(this._$element);

            this._renderShares();
        },

        _renderShares: function() {
            $.each(this.shares, $.proxy(function(_, share) {
                this._renderShare(share);
            }, this));
        },

        _renderShare: function(share) {
            var $share;

            if($.isFunction(share.renderer)) {
                $share = $(share.renderer());
            } else {
                $share = this._createShare(share);
            }

            $share.addClass(this.shareClass)
                .addClass("jssocials-share-" + share.share)
                .addClass(share.css)
                .appendTo(this._$shares);
        },

        _createShare: function(share) {
            var $result = $("<div>");

            var $shareLink = this._createShareLink(share);

            var $shareButton = $("<div>").addClass(this.shareButtonClass)
                .append($shareLink);

            $result.append($shareButton);

            return $result;
        },

        _createShareLink: function(share) {
            return $("<a>").addClass(this.shareLinkClass)
                .attr({
                    href: this._getShareUrl(share),
                    target: "_blank"
                })
                .append(this._createShareLogo(share))
                .append(this._createShareLabel(share));
        },

        _getShareUrl: function(share) {
            var shareUrl = getOrApply(share.shareUrl, share);

            return shareUrl.replace(/(&?[a-zA-Z0-9]+=)\{([a-zA-Z0-9]+)\}/g, function(match, key, field) {
                var value = share[field] || "";
                return value ? (key + window.encodeURIComponent(value)) : "";
            });
        },

        _createShareLogo: function(share) {
            var logoSize = share.logoSize || this.logoSize;
            var logo = share.logo;

            var $result = IMG_SRC_REGEX.test(logo)
                ? $("<img>").css({ height: logoSize, width: logoSize }).attr("src", share.logo)
                : $("<i>").addClass(logo).css("font-size", logoSize + "px");

            $result.addClass(this.shareLogoClass);

            return $result;
        },

        _createShareLabel: function(share) {
            return $("<span>").addClass(this.shareLabelClass)
                .text(share.label);
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
