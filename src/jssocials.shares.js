(function(window, $, jsSocials, undefined) {

    $.extend(jsSocials.shares, {

        twitter: {
            label: "Tweet",
            logo: "fa fa-twitter",
            shareUrl: "https://twitter.com/share?url={url}&text={text}&via={via}&hashtags={hashtags}",
            countUrl: "https://cdn.api.twitter.com/1/urls/count.json?url={url}&callback=?",
            getCount: function(data) {
                return data.count;
            }
        },

        facebook: {
            label: "Like",
            logo: "fa fa-facebook",
            shareUrl: "https://facebook.com/sharer/sharer.php?u={url}",
            countUrl: "https://graph.facebook.com/?id={url}&callback=?",
            getCount: function(data) {
                return data.shares;
            }
        },

        googleplus: {
            label: "+1",
            logo: "fa fa-google-plus",
            shareUrl: "https://plus.google.com/share?url={url}",
            countUrl: function() {
                return "http://anyorigin.com/get?url=" + window.encodeURIComponent("https://plusone.google.com/_/+1/fastbutton?url=" + this.url) + "&callback=?";
            },
            getCount: function(data) {
                return parseFloat(data.contents.match(/\{c: ([.0-9E]+)/)[1]);
            }
        },

        linkedin: {
            label: "Share",
            logo: "fa fa-linkedin",
            shareUrl: "https://www.linkedin.com/shareArticle?url={url}",
            countUrl: "https://www.linkedin.com/countserv/count/share?format=jsonp&url={url}&callback=?",
            getCount: function(data) {
                return data.count;
            }
        },

        pinterest: {
            label: "Pin it",
            logo: "fa fa-pinterest",
            shareUrl: "https://pinterest.com/pin/create/bookmarklet/?media={media}&url={url}&description={text}",
            countUrl: "https://api.pinterest.com/v1/urls/count.json?&url={url}&callback=?",
            getCount: function(data) {
                return data.count;
            }
        }

    });

}(window, jQuery, window.jsSocials));
