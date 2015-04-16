(function(window, $, jsSocials, undefined) {

    $.extend(jsSocials.shares, {

        twitter: {
            label: "Tweet",
            logo: "fa fa-twitter",
            shareUrl: "https://twitter.com/share?url={url}&text={text}&via={via}&hashtags={hashtags}",
            countUrl: "http://cdn.api.twitter.com/1/urls/count.json?url={url}&callback=?",
            getCount: function(data) {
                return data.count;
            }
        },

        facebook: {
            label: "Share",
            logo: "fa fa-facebook",
            shareUrl: "https://facebook.com/sharer/sharer.php?u={url}",
            countUrl: "https://api.facebook.com/method/links.getStats?format=json&urls={url}&callback=?",
            getCount: function(data) {
                return data[0].share_count;
            }
        },

        googleplus: {
            label: "Share",
            logo: "fa fa-google-plus",
            shareUrl: "https://plus.google.com/share?url={url}",
            countUrl: function() {
                return "http://anyorigin.com/get?url=" + window.encodeURIComponent("https://plusone.google.com/_/+1/fastbutton?url=" + this.url) + "&callback=?";
            },
            getCount: function(data) {
                return 0; // TODO: implement count data extraction
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
        }

    });

}(window, jQuery, jsSocials));
