(function(window, $, jsSocials, undefined) {

    "use strict";

    $.extend(jsSocials.shares, {

        email: {
            label: "E-mail",
            logo: "fas fa-at",
            shareUrl: "mailto:{to}?subject={text}&body={url}",
            countUrl: "",
            shareIn: "top"
        },

        twitter: {
            label: "Tweet",
            logo: "fab fa-twitter",
            shareUrl: "https://twitter.com/share?url={url}&text={text}&via={via}&hashtags={hashtags}",
            countUrl: ""
        },

        facebook: {
            label: "Like",
            logo: "fab fa-facebook",
            shareUrl: "https://facebook.com/sharer/sharer.php?u={url}",
            countUrl: "https://graph.facebook.com/?id={url}",
            getCount: function(data) {
                return data.share && data.share.share_count || 0;
            }
        },

        googleplus: {
            label: "+1",
            logo: "fab fa-google-plus-g",
            shareUrl: "https://plus.google.com/share?url={url}",
            countUrl: ""
        },

        linkedin: {
            label: "Share",
            logo: "fab fa-linkedin",
            shareUrl: "https://www.linkedin.com/shareArticle?mini=true&url={url}",
            countUrl: "https://www.linkedin.com/countserv/count/share?format=jsonp&url={url}&callback=?",
            getCount: function(data) {
                return data.count;
            }
        },

        pinterest: {
            label: "Pin it",
            logo: "fab fa-pinterest",
            shareUrl: "https://pinterest.com/pin/create/bookmarklet/?media={media}&url={url}&description={text}",
            countUrl: "https://api.pinterest.com/v1/urls/count.json?&url={url}&callback=?",
            getCount: function(data) {
                return data.count;
            }
        },

        stumbleupon: {
            label: "Share",
            logo: "fab fa-stumbleupon",
            shareUrl: "http://www.stumbleupon.com/submit?url={url}&title={title}",
            countUrl:  "https://cors-anywhere.herokuapp.com/https://www.stumbleupon.com/services/1.01/badge.getinfo?url={url}",
            getCount: function(data) {
                return data.result && data.result.views;
            }
        },

        pocket: {
            label: "Pocket",
            logo: "fab fa-get-pocket",
            shareUrl: "https://getpocket.com/save?url={url}&title={title}",
            countUrl: ""
        },

        whatsapp: {
            label: "WhatsApp",
            logo: "fab fa-whatsapp",
            shareUrl: "whatsapp://send?text={url} {text}",
            countUrl: "",
            shareIn: "top"
        },

        viber: {
            label: "Viber",
            logo: "fab fa-viber",
            shareUrl: "viber://forward?text={url} {text}",
            countUrl: "",
            shareIn: "top"
        },

        messenger: {
            label: "Share",
            logo: "fab fa-facebook-messenger",
            shareUrl: "fb-messenger://share?link={url}",
            countUrl: "",
            shareIn: "top"
        },

        browser_messenger: {
            label: "Share",
            logo: "fab fa-facebook-messenger",
            shareUrl: "https://www.facebook.com/dialog/send?app_id={appid}&link={url}&redirect_uri={redirect}",
            countUrl: "",
            shareIn: "top"
        },

        telegram: {
            label: "Telegram",
            logo: "fab fa-telegram",
            shareUrl: "tg://msg?text={url} {text}",
            countUrl: "",
            shareIn: "top"
        },

        vkontakte: {
            label: "Like",
            logo: "fab fa-vk",
            shareUrl: "https://vk.com/share.php?url={url}&title={title}&description={text}",
            countUrl: "https://vk.com/share.php?act=count&index=1&url={url}",
            getCount: function(data) {
                return parseInt(data.slice(15, -2).split(', ')[1]);
            }
        },

        line: {
            label: "LINE",
            logo: "fab fa-line",
            shareUrl: "http://line.me/R/msg/text/?{text} {url}",
            countUrl: ""
        },

        rss: {
            label: "RSS",
            logo: "fas fa-rss",
            shareUrl: "/feeds/",
            countUrl: ""
        },

        sms: {
            label: "SMS",
            logo: "far fa-comment-alt",
            shareUrl: "sms:{delimiter}body={text} {url}",
            delimiter: "?",
            countUrl: "",
            shareIn: "top"
        }

    });

}(window, jQuery, window.jsSocials));

