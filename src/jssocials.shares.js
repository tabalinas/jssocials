(function(window, $, jsSocials, undefined) {

    $.extend(jsSocials.shares, {

        whatsapp: {
            label: "WhatsApp",
            logo: "fa fa-whatsapp",
            shareUrl: "whatsapp://send?text={url} {text}",
            countUrl: ""
        },

        email: {
            label: "E-mail",
            logo: "fa fa-at",
            shareUrl: "mailto:?subject={text}&body={url}",
            countUrl: ""
        },

        twitter: {
            label: "Tweet",
            logo: "fa fa-twitter",
            shareUrl: "https://twitter.com/share?url={url}&text={text}&via={via}&hashtags={hashtags}",
            countUrl: ""
        },

        facebook: {
            label: "Like",
            logo: "fa fa-facebook",
            shareUrl: "https://facebook.com/sharer/sharer.php?u={url}",
            countUrl: function() {
                return "https://graph.facebook.com/fql?q=SELECT total_count FROM link_stat WHERE url='" + window.encodeURIComponent(this.url) + "'";
            },
            getCount: function(data) {
                return (data.data.length && data.data[0].total_count) || 0;
            }
        },

        googleplus: {
            label: "+1",
            logo: "fa fa-google-plus",
            shareUrl: "https://plus.google.com/share?url={url}",
            countUrl: function() {
                return "https://cors-anywhere.herokuapp.com/https://plusone.google.com/_/+1/fastbutton?url="+ window.encodeURIComponent(this.url);
            },
            getCount: function(data) {
                return parseFloat((data.match(/\{c: ([.0-9E]+)/) || [])[1]);
            }
        },

        linkedin: {
            label: "Share",
            logo: "fa fa-linkedin",
            shareUrl: "https://www.linkedin.com/shareArticle?mini=true&url={url}",
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
