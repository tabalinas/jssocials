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
    var URL_PARAMS_REGEX = /(&?[a-zA-Z0-9]+=)\{([a-zA-Z0-9]+)\}/g;

    var MEASURES = {
        "G": 1000000000,
        "M": 1000000,
        "K": 1000
    };

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
        showCount: true,
        showLabel: true,
        logoSize: 24,

        theme: "default",

        themeClassPrefix: "jssocials-theme-",
        elementClass: "jssocials",
        sharesClass: "jssocials-shares",
        shareClass: "jssocials-share",
        shareButtonClass: "jssocials-share-button",
        shareLinkClass: "jssocials-share-link",
        shareLogoClass: "jssocials-share-logo",
        shareLabelClass: "jssocials-share-label",
        shareCountBoxClass: "jssocials-share-count-box",
        shareCountClass: "jssocials-share-count",

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

            this._$element.addClass(this.elementClass)
                .addClass(this._themeClass());

            this._$shares = $("<div>").addClass(this.sharesClass)
                .appendTo(this._$element);

            this._renderShares();
        },

        _themeClass: function() {
            return this.themeClassPrefix + this.theme;
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
            var $result = $("<a>").addClass(this.shareLinkClass)
                .attr({ href: this._getShareUrl(share), target: "_blank" })
                .append(this._createShareLogo(share));

            if(this.showLabel) {
                $result.append(this._createShareLabel(share));
            }

            if(this.showCount) {
                $result.append(this._createShareCount(share));
            }

            return $result;
        },

        _getShareUrl: function(share) {
            var shareUrl = getOrApply(share.shareUrl, share);
            return this._formatShareUrl(shareUrl, share);
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

        _createShareCount: function(share) {
            var $result = $("<div>").addClass(this.shareCountBoxClass);
            var $count = $("<span>").addClass(this.shareCountClass);
            $result.append($count);

            this._loadCount(share).done($.proxy(function(count) {
                $count.text(count);

                if(!count) {
                    $result.hide();
                }
            }, this));

            return $result;
        },

        _loadCount: function(share) {
            var deferred = $.Deferred();

            $.getJSON(this._getCountUrl(share)).done($.proxy(function(response) {
                deferred.resolve(this._getCountValue(response, share));
            }, this)).fail(function() {
                deferred.resolve(null);
            });

            return deferred.promise();
        },

        _getCountUrl: function(share) {
            var countUrl = getOrApply(share.countUrl, share);
            return this._formatShareUrl(countUrl, share);
        },

        _getCountValue: function(response, share) {
            var count = $.isFunction(share.getCount) ? share.getCount(response) : response;
            return (typeof(count) === "string") ? count : this._formatNumber(count);
        },

        _formatNumber: function(number) {
            $.each(MEASURES, function(letter, value) {
                if(number >= value) {
                    number = parseFloat((number / value).toFixed(2)) + letter;
                    return false;
                }
            });

            return number;
        },

        _formatShareUrl: function(url, share) {
            return url.replace(URL_PARAMS_REGEX, function(match, key, field) {
                var value = share[field] || "";
                return value ? (key + window.encodeURIComponent(value)) : "";
            });
        },

        _clear: function() {
            var themeClassPrefix = this.themeClassPrefix;

            this._$element.empty()
                .removeClass(function(_, cls) {
                    return (cls.match(new RegExp("(?:^|\\s)" + themeClassPrefix + "\\S+")) || [""])[0];
                });
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
