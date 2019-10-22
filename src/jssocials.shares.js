(function(window, $, jsSocials, undefined) {

    "use strict";

    $.extend(jsSocials.shares, {

        email: {
            label: "E-mail",
            logo: "fa fa-at",
            inlineSvg: false,
            shareUrl: "mailto:{to}?subject={text}&body={url}",
            countUrl: "",
            shareIn: "top"
        },

        twitter: {
            label: "Tweet",
            logo: "fa fa-twitter",
            inlineSvg: false,
            shareUrl: "https://twitter.com/share?url={url}&text={text}&via={via}&hashtags={hashtags}",
            countUrl: ""
        },

        facebook: {
            label: "Like",
            logo: "fa fa-facebook",
            inlineSvg: false,
            shareUrl: "https://facebook.com/sharer/sharer.php?u={url}",
            countUrl: "https://graph.facebook.com/?id={url}",
            getCount: function(data) {
                return data.share && data.share.share_count || 0;
            }
        },

        googleplus: {
            label: "+1",
            logo: "fa fa-google",
            inlineSvg: false,
            shareUrl: "https://plus.google.com/share?url={url}",
            countUrl: ""
        },

        linkedin: {
            label: "Share",
            logo: "fa fa-linkedin",
            inlineSvg: false,
            shareUrl: "https://www.linkedin.com/shareArticle?mini=true&url={url}",
            countUrl: "https://www.linkedin.com/countserv/count/share?format=jsonp&url={url}&callback=?",
            getCount: function(data) {
                return data.count;
            }
        },

        pinterest: {
            label: "Pin it",
            logo: "fa fa-pinterest",
            inlineSvg: false,
            shareUrl: "https://pinterest.com/pin/create/bookmarklet/?media={media}&url={url}&description={text}",
            countUrl: "https://api.pinterest.com/v1/urls/count.json?&url={url}&callback=?",
            getCount: function(data) {
                return data.count;
            }
        },

        stumbleupon: {
            label: "Share",
            logo: "fa fa-stumbleupon",
            inlineSvg: false,
            shareUrl: "http://www.stumbleupon.com/submit?url={url}&title={title}",
            countUrl:  "https://cors-anywhere.herokuapp.com/https://www.stumbleupon.com/services/1.01/badge.getinfo?url={url}",
            getCount: function(data) {
                return data.result && data.result.views;
            }
        },

        pocket: {
            label: "Pocket",
            logo: "fa fa-get-pocket",
            inlineSvg: false,
            shareUrl: "https://getpocket.com/save?url={url}&title={title}",
            countUrl: ""
        },

        whatsapp: {
            label: "WhatsApp",
            logo: "fa fa-whatsapp",
            inlineSvg: false,
            shareUrl: "whatsapp://send?text={url} {text}",
            countUrl: "",
            shareIn: "top"
        },

        viber: {
            label: "Viber",
            logo: "fa fa-volume-control-phone",
            inlineSvg: false,
            shareUrl: "viber://forward?text={url} {text}",
            countUrl: "",
            shareIn: "top"
        },

        messenger: {
            label: "Share",
            logo: "fa fa-commenting",
            inlineSvg: false,
            shareUrl: "fb-messenger://share?link={url}",
            countUrl: "",
            shareIn: "top"
        },

        browser_messenger: {
            label: "Share",
            logo: "fa fa-commenting",
            inlineSvg: false,
            shareUrl: "https://www.facebook.com/dialog/send?app_id={appid}&link={url}&redirect_uri={redirect}",
            countUrl: "",
            shareIn: "top"
        },

        telegram: {
            label: "Telegram",
            logo: "fa fa-telegram",
            inlineSvg: false,
            shareUrl: "tg://msg?text={url} {text}",
            countUrl: "",
            shareIn: "top"
        },

        vkontakte: {
            label: "Like",
            logo: "fa fa-vk",
            inlineSvg: false,
            shareUrl: "https://vk.com/share.php?url={url}&title={title}&description={text}",
            countUrl: "https://vk.com/share.php?act=count&index=1&url={url}",
            getCount: function(data) {
                return parseInt(data.slice(15, -2).split(', ')[1]);
            }
        },

        line: {
            label: "LINE",
            logo: "fa fa-comment",
            inlineSvg: false,
            shareUrl: "http://line.me/R/msg/text/?{text} {url}",
            countUrl: ""
        },

        rss: {
            label: "RSS",
            logo: "fa fa-rss",
            inlineSvg: false,
            shareUrl: "/feeds/",
            countUrl: ""
        },

	sms: {
            label: "SMS",
            logo: "fa fa-comments-o",
            inlineSvg: false,
            shareUrl: "sms:{delimiter}body={text} {url}",
            delimiter: "?",
            countUrl: "",
            shareIn: "top"
        }

    });

}(window, jQuery, window.jsSocials));

