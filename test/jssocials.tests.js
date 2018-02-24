(function($, QUnit, jsSocials) {

    "use strict";

    var Socials = jsSocials.Socials,

        JSSOCIALS = "JSSocials",
        JSSOCIALS_DATA_KEY = JSSOCIALS;


    QUnit.module("basic");

    QUnit.test("constructor", function(assert) {
        var config = {
            simpleOption: "test",
            complexOption: {
                a: "subtest",
                b: 1,
                c: {}
            }
        };

        var socials = new Socials("#share", config);

        assert.equal(socials._$element.get(0), $("#share").get(0), "element saved");
        assert.equal(socials.simpleOption, "test", "primitive option extended");
        assert.equal(socials.complexOption, config.complexOption, "non-primitive option extended");
    });

    QUnit.test("jQuery.fn.jsSocials", function(assert) {
        var $element = $("#share");
        var $result = $element.jsSocials({
                option: "test"
            });

        var instance = $element.data(JSSOCIALS_DATA_KEY);

        assert.equal($result, $element, "jquery fn returned source jQuery element");
        assert.ok(instance instanceof Socials, "jsSocials saved to jQuery data");
        assert.equal(instance.option, "test", "options provided");
    });

    QUnit.test("jQuery.fn.jsSocials second call changes option value", function(assert) {
        var $element = $("#share");

        $element.jsSocials({ option: "test" });
        var instance = $element.data(JSSOCIALS_DATA_KEY);

        $element.jsSocials({ option: "new test" });

        assert.equal(instance, $element.data(JSSOCIALS_DATA_KEY), "instance is preserved");
        assert.equal(instance.option, "new test", "option changed");
    });

    QUnit.test("jQuery.fn.jsSocials invokes method", function(assert) {
        var $element = $("#share");
        $element.jsSocials({
            method: function(str) {
                return "test_" + str;
            }
        });

        assert.equal($element.jsSocials("method", "invoke"), "test_invoke", "method invoked");
    });

    QUnit.test("option method", function(assert) {
        var $element = $("#share").jsSocials({ test: "value" });
        assert.equal($element.jsSocials("option", "test"), "value", "read option value");

        $element.jsSocials("option", "test", "new_value");
        assert.equal($element.jsSocials("option", "test"), "new_value", "set option value");
    });

    QUnit.test("rendering", function(assert) {
        var $element = $("#share");
        var instance = new Socials($element, {});

        assert.ok($element.hasClass(instance.elementClass), "element class attached");
    });

    QUnit.test("destroy", function(assert) {
        var $element = $("#share").jsSocials({});
        var instance = $element.data(JSSOCIALS_DATA_KEY);

        instance.destroy();

        assert.strictEqual($element.text(), "", "content removed");
        assert.ok(!$element.hasClass(instance.elementClass), "css class removed");
        assert.strictEqual($element.data(JSSOCIALS_DATA_KEY), undefined, "jQuery data removed");
    });

    QUnit.test("set default options with setDefaults", function(assert) {
        jsSocials.setDefaults({
            defaultOption: "test"
        });

        var $element = $("#share").jsSocials({});

        assert.equal($element.jsSocials("option", "defaultOption"), "test", "default option set");
    });

    QUnit.test("set default share options with setDefaults", function(assert) {
        jsSocials.shares.testshare = {
            shareUrl: "http://test.com"
        };

        try {
            jsSocials.setDefaults("testshare", {
                shareUrl: "http://another.test.com/"
            });

            var $element = $("#share").jsSocials({
                showCount: false,
                showLabel: true,
                shares: ["testshare"]
            });

            var instance = $element.data(JSSOCIALS_DATA_KEY);

            var $shareLink = $element.find("." + instance.shareLinkClass);
            assert.equal($shareLink.attr("href"), "http://another.test.com/", "default options is passed");

        } finally {
            delete jsSocials.shares.testshare;
        }
    });


    QUnit.module("share rendering", {
        setup: function() {
            this.originalShowCount = jsSocials.Socials.prototype.showCount;
            this.originalShowLabel = jsSocials.Socials.prototype.showLabel;
            jsSocials.Socials.prototype.showCount = false;
            jsSocials.Socials.prototype.showLabel = true;
        },
        teardown: function() {
            jsSocials.Socials.prototype.showCount = this.originalShowCount;
            jsSocials.Socials.prototype.showLabel = this.originalShowLabel;
            delete jsSocials.shares.testshare;
        }
    });

    QUnit.test("throw error on unknown share", function(assert) {
        assert.throws(
            function() {
                $("#share").jsSocials({
                    shares: ["unknown"]
                });
            },
            "Share 'unknown' is not found"
        );
    });

    QUnit.test("throw error on unknown share", function(assert) {
        var $element = $("#share").jsSocials({
            shares: [{
                renderer: function() {
                    return $("<div>").text("test");
                }
            }]
        });

        var instance = $element.data(JSSOCIALS_DATA_KEY);

        var $share = $element.find("." + instance.shareClass);
        assert.ok(!$share.hasClass("jssocials-share-undefined"), "empty share css class is not attached");
        assert.equal($element.text(), "test", "custom renderer called");
    });

    QUnit.test("share structure", function(assert) {
        jsSocials.shares.testshare = {
            logo: "test.png",
            label: "testLabel",
            shareUrl: "http://test.com/share/?url={url}&text={text}"
        };

        var $element = $("#share").jsSocials({
            shares: [{ share: "testshare", css: "custom-class", url: "testurl", text: "testtext" }]
        });

        var instance = $element.data(JSSOCIALS_DATA_KEY);

        var $shares = $element.find("." + instance.sharesClass);
        assert.equal($shares.length, 1, "shares block rendered");

        var $share = $shares.find("." + instance.shareClass);
        assert.equal($share.length, 1, "share block rendered");
        assert.ok($share.hasClass("jssocials-share-testshare"), "share class attached");
        assert.ok($share.hasClass("custom-class"), "share custom class attached");

        var $shareLink = $share.find("." + instance.shareLinkClass);
        assert.equal($shareLink.length, 1, "share link rendered");
        assert.equal($shareLink.attr("href"), "http://test.com/share/?url=testurl&text=testtext", "share href correct");

        var $shareLabel = $shareLink.find("." + instance.shareLabelClass);
        assert.equal($shareLabel.length, 1, "share label rendered");
        assert.equal($shareLabel.text(), "testLabel", "share label text rendered");

        var $shareLogo = $shareLink.find("." + instance.shareLogoClass);
        assert.equal($shareLogo.length, 1, "share logo rendered");
        assert.equal($shareLogo.attr("src"), "test.png", "share logo src set");
    });

    QUnit.test("showLabel=false should prevent label rendering", function(assert) {
        jsSocials.shares.testshare = {
            label: "testLabel",
            shareUrl: "http://test.com/share/?url={url}&text={text}"
        };

        var $element = $("#share").jsSocials({
            showLabel: false,
            shares: ["testshare"]
        });

        var instance = $element.data(JSSOCIALS_DATA_KEY);

        var $shareLabel = $element.find("." + instance.shareLabelClass);
        assert.equal($shareLabel.length, 0, "share label is not rendered");
    });

    QUnit.test("custom url param", function(assert) {
        jsSocials.shares.testshare = {
            custom: "testcustom",
            shareUrl: "http://test.com/share/?custom={custom}"
        };

        var $element = $("#share").jsSocials({
            shares: ["testshare"]
        });

        var $shareLink = $element.find(".jssocials-share-link");
        assert.equal($shareLink.attr("href"), "http://test.com/share/?custom=testcustom", "share link href has custom params");
    });

    QUnit.test("custom url params without key", function(assert) {
        jsSocials.shares.testshare = {
            custom: "testcustom",
            shareUrl: "http://test.com/share/?{custom}"
        };

        var $element = $("#share").jsSocials({
            shares: ["testshare"]
        });

        var $shareLink = $element.find(".jssocials-share-link");
        assert.equal($shareLink.attr("href"), "http://test.com/share/?testcustom", "share link href has custom params without key");
    });

    QUnit.test("logo as icon class", function(assert) {
        jsSocials.shares.testshare = {
            logo: "fa fa-user",
            shareUrl: "http://test.com/share"
        };

        var $element = $("#share").jsSocials({
            shares: ["testshare"]
        });

        var $shareLogo = $element.find(".jssocials-share-logo");
        assert.equal($shareLogo.get(0).tagName, "I", "<i> used instead of <img>");
        assert.ok($shareLogo.hasClass("fa"), "fa css class attached");
        assert.ok($shareLogo.hasClass("fa-user"), "fa css class attached");
    });

    QUnit.test("logo as base64 image", function(assert) {
        var imgBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAGDklEQVRoQ+1Za2yTZRQ+53wdiGw46YWBYiQIQRBBUYMiKBdRuQzZpV2EYSBGjBq5iEFM1IUfJipiRKMRgyhyWVu6BYUYCBBiNDEEjQjjEgYEEYS1xcGku/C955gP6Bhzbd9vlxIS+qvp+5znOc97f08RrvMPXuf5ww0D13oEr9kITFl3ordhZDxCQncCYCdBiZhK7d5w0LMTStDU7Zi0G8j3V00AMN4kA0e0lKQwR0FgeSRW8/6OmX2qW8JMWf33QEcG9Q75emy+ykBeoMpX5vX4dd3bwRUGKjIZc1YQolcnjkVOsci0cq9r+0V8iTieGRB+wmHQbAGYcKGOB35X7KlsNDA1EBnjINpmmjKrvMi5UkdEFzNixYGsHt3cWw3Eh3RjLBwLX0CGJULYF0DGEVL3y78vCxW65ljfGw0UBKNfIuLzLKxEZEaZ173WjlgybF4gssEgym0PPhHeFanYM3JHyei6qw0EovuRcMBlhwwCr4S8rs/bKjq1NFzkcBjr2spjxSuRnWdjtRPU0UPnnXcPfkpEXI0jkB+M1hLiTU2FWHiZ84xzwfLZeKG1CeQFovsMwrtbGx+PUyzHEWE9gtwLgg8L8unqWP2DV6ZQIMJI9L9diZX8cqFBFVsLxm4ShYHqYUC8y25cKry1UyluGFle1Gt/Y8J5wXDYQMPV8tYmMRBZ3L3audTOaOT7w/PIMJamSshOuzBXIfCTQa/n92aLOLIVkcYmI1OsDgPA2wa4/EEvqlTC+cHIp4T0ciqcbjsr2VtnGlM2Tcs+Eo+5sgYC4flExoc6ZMLqCCN8VltjrvphVs9wopiCYOQrRJqpw6mF4bM9g94+p5piGw2M/eYvZ/bNXY4RYlctMgAQZhMQt4vI98zmjnJfjwpAlHh8gT/8ERrGXF2+VLh/z9V7mnfY1SdxMLLIQHo3FVGidhY5Bwx7gKQSGY4DwWBEmtJavuZxZ48ez9zy+pDzLY6A9WNhQAzB6OZUa6G9ErLDw8IcKnA6mo5w4yK2jnpPlnOBUrVfRGOxmpxM1wYyaLQdgY7GKpaTZV7nbc11Lk2hEnHkD4rWoQAJym4EOiAAkwgxs6MT0+VnpX4M+dyPtWwAAAqC0b2IOEiXMN04xbK8zOucndiAP7oEDXwt3Ylp6zHPDHpdXyc0MHntyQGdMjpVEBJpk6YRWFtv9t84zXMooQGrIX6lTmNeWlIsXBkqdPVrCXzVOWDtRj2z3Dvj12ot9jSAWPi9UKHrjZQGLMClx/ZNWw3C/mnITU+Czfvil7ekUyje+PjKo9nOzMxPCI3pegodh2IlP4d8zkcTKSStSuSVhu8HopcQYSIh5nRcmomZWZm+kM8TsGVgamlkBiH6BKUeUNwkeA8SZafbAAvvCRU6hwIg2zKQu+7PXhmOroebPzHTbUCxmlTmdW9KpptwChX4wyVoGO+kO+m4nmK1qczrnpRKP/EaKBFH3sDoZoNoTCqSdm8XOFsbOz9o43O9T6TiTrqIrWqaYE4IEcenImrPdtNU08uL3Gt0OFPWRq03AkNkPgK9hYRZOqRtwZjMH5d7XdqvuJQG4sk8u6b61nqHWYyEE1lgCFq7Uzvfm0Tkh/UV3XM7vDqd568aBWisNgh7t6W3m8aykq3R/X9MjpcMdXm1R8AiHL/qlKdbl4zFIPJCS0UwXdHmOBG18eiZY75fZz8Qs8uhZeCZ0tN9DcNh1XdesFO10EmGRZaECrsvTHZY2T4Hnl52qFuXHrcMBaJRADiBRIa3Z49bCbGoMCt8sbzIVaZjNOFJnO8/PQ7AsRCJnSDUBUDcSORsC2myWGEWQSyN1TTMSVYU09W/OIWsd0BOlnseoMwlpFt1g+3iRGQLK15UVuT+zW5swhFo2jD+g91ds+7oVUyEzwPSsPYQEeZqBlitGszlG6bn7GkPzqYcCRdx7rdVd2V0xlwQGgskw+N/76RKgEXqgGUfI24TJZv3hv/5qfLVfvWp4lrbrrULWeTWS42Mzv2A4XZCcQpdrKEqFKhhhnNIEjXr5eB3xe4jrd1RWmNC20BryNMRc8NAOnrZ9kF2rZOyo/8f5f1gcy5zTBAAAAAASUVORK5CYII=";

        jsSocials.shares.testshare = {
            logo: imgBase64,
            shareUrl: "http://test.com/share"
        };

        var $element = $("#share").jsSocials({
            shares: ["testshare"]
        });

        var $shareLogo = $element.find(".jssocials-share-logo");
        assert.equal($shareLogo.get(0).tagName, "IMG", "<img> tag is rendered");
        assert.equal($shareLogo.attr("src"), imgBase64, "img has base64 src");
    });

    QUnit.test("logo as svg image", function(assert) {
        jsSocials.shares.testshare = {
            shareUrl: "http://test.com/share"
        };

        var $element = $("#share").jsSocials({
            shares: [{
                share: "testshare",
                logo: "test.svg"
            }]
        });

        var $shareLogo = $element.find(".jssocials-share-logo");
        assert.equal($shareLogo.get(0).tagName, "IMG", "<img> tag is rendered");
        assert.equal($shareLogo.attr("src"), "test.svg", "img has svg image path");
    });

    QUnit.test("share should get sharing url and text", function(assert) {
        jsSocials.shares.testshare = {
            shareUrl: "http://test.com/share/?url={url}&text={text}"
        };

        var $element = $("#share").jsSocials({
            url: "testurl",
            text: "testtext",
            shares: ["testshare"]
        });

        var $shareLink = $element.find(".jssocials-share-link");
        assert.equal($shareLink.attr("href"), "http://test.com/share/?url=testurl&text=testtext", "share link href contains sharing url and text");
    });

    QUnit.test("unused sharing params should be removed", function(assert) {
        jsSocials.shares.testshare = {
            shareUrl: "http://test.com/share/?url={url}&text={text}&custom={custom}"
        };

        var $element = $("#share").jsSocials({
            url: "testurl",
            text: "testtext",
            shares: ["testshare"]
        });

        var $shareLink = $element.find(".jssocials-share-link");
        assert.equal($shareLink.attr("href"), "http://test.com/share/?url=testurl&text=testtext", "custom param removed from shareUrl");
    });

    QUnit.test("set custom handlers with 'on' config option", function(assert) {
        jsSocials.shares.testshare = {
            shareUrl: "http://test.com/share/"
        };

        var linkClicked = 0;
        var handlerContext = null;

        var $element = $("#share").jsSocials({
            url: "testurl",
            text: "testtext",
            shares: ["testshare"],
            on: {
                click: function() {
                    linkClicked++;
                    handlerContext = this;
                }
            }
        });

        var $shareLink = $element.find(".jssocials-share-link");
        $shareLink.click();

        var expectedContext = {
            share: "testshare",
            shareUrl: "http://test.com/share/",
            url: "testurl",
            text: "testtext"
        };

        assert.equal(linkClicked, 1, "click handler called once");
        assert.deepEqual(handlerContext, expectedContext, "share is a context for handler call");
    });


    QUnit.module("share option");

    QUnit.test("option url and text should be passed to shares", function(assert) {
        jsSocials.shares.testshare = {
            label: "testLabel",
            shareUrl: "http://test.com/share/?url={url}&text={text}"
        };

        var $element = $("#share").jsSocials({
            url: "url",
            text: "text",
            showCount: false,
            shares: ["testshare"]
        });

        var instance = $element.data(JSSOCIALS_DATA_KEY);

        instance.option("url", "newurl");
        instance.option("text", "newtext");
        assert.equal(instance.shares[0].url, "newurl", "url is passed to share");
        assert.equal(instance.shares[0].text, "newtext", "text is passed to share");
    });

    QUnit.test("change share option with shareOption method", function(assert) {
        jsSocials.shares.testshare = {
            label: "testLabel",
            shareUrl: "http://test.com/share/?url={url}&text={text}"
        };

        var $element = $("#share").jsSocials({
            url: "testurl",
            text: "testtext",
            showCount: false,
            showLabel: true,
            shares: ["testshare"]
        });

        var shareOptionValue = $element.jsSocials("shareOption", "testshare", "text");
        assert.equal(shareOptionValue, "testtext", "read share option");

        $element.jsSocials("shareOption", "testshare", "label", "testLabel1");
        assert.equal($element.text(), "testLabel1", "set share option by share name");

        $element.jsSocials("shareOption", 0, "label", "testLabel2");
        assert.equal($element.text(), "testLabel2", "set share option by share index");
    });


    QUnit.module("share counter", {
        setup: function() {
            this.originalJQueryGetJSON = $.getJSON;
            this.originalJQueryGet = $.get;

            var self = this;
            $.get = $.getJSON = function(url) {
                if(url === "http://test.com/count?url=" + self.countUrl) {
                    return $.Deferred().resolve(self.countResult).promise();
                } else {
                    return $.Deferred().reject().promise();
                }
            };
        },
        teardown: function() {
            $.getJSON = this.originalJQueryGetJSON;
            $.get = this.originalJQueryGet;
            delete jsSocials.shares.testshare;
        }
    });

    QUnit.test("share inside count structure", function(assert) {
        jsSocials.shares.testshare = {
            shareUrl: "http://test.com/share/",
            countUrl: "http://test.com/count?url={url}"
        };

        this.countUrl = "testurl";
        this.countResult = 10;

        var $element = $("#share").jsSocials({
            url: "testurl",
            showCount: "inside",
            shares: ["testshare"]
        });

        var instance = $element.data(JSSOCIALS_DATA_KEY);

        var $shareLink = $element.find("." + instance.shareLinkClass);
        assert.ok($shareLink.hasClass(instance.shareLinkCountClass), "link count class attached");

        var $shareCount = $shareLink.find("." + instance.shareCountClass);
        assert.equal($shareCount.length, 1, "share count rendered");
        assert.equal($shareCount.text(), "10", "share count value rendered");
    });

    QUnit.test("should not request empty countUrl", 0, function(assert) {
        jsSocials.shares.testshare = {
            shareUrl: "http://test.com/share/",
            countUrl: ""
        };

        $.getJSON = function() {
            assert.ok("false", "empty countUrl is requested");
        };

        $("#share").jsSocials({
            url: "testurl",
            showCount: true,
            shares: ["testshare"]
        });
    });

    QUnit.test("count outside share link", function(assert) {
        jsSocials.shares.testshare = {
            shareUrl: "http://test.com/share/",
            countUrl: "http://test.com/count?url={url}"
        };

        this.countUrl = "testurl";
        this.countResult = 10;

        var $element = $("#share").jsSocials({
            url: "testurl",
            showCount: true,
            shares: ["testshare"]
        });

        var instance = $element.data(JSSOCIALS_DATA_KEY);

        var $share = $element.find("." + instance.shareClass);

        var $shareLink = $element.find("." + instance.shareLinkClass);
        assert.ok(!$shareLink.hasClass(instance.shareLinkCountClass), "link count class not attached");

        var $shareCountBox = $share.find("." + instance.shareCountBoxClass);
        assert.equal($shareCountBox.length, 1, "share count box rendered");

        var $shareCount = $shareCountBox.find("." + instance.shareCountClass);
        assert.equal($shareCount.length, 1, "share count rendered");
        assert.equal($shareCount.text(), "10", "share count value rendered");
    });

    QUnit.test("getCount should be called to retrieve count from response", function(assert) {
        jsSocials.shares.testshare = {
            shareUrl: "http://test.com/share/",
            countUrl: "http://test.com/count?url={url}",
            getCount: function(data) {
                return data.count;
            }
        };

        this.countUrl = "testurl";
        this.countResult = { count: 10 };

        var $element = $("#share").jsSocials({
            url: "testurl",
            showCount: true,
            shares: ["testshare"]
        });

        var instance = $element.data(JSSOCIALS_DATA_KEY);

        var $shareCount = $element.find("." + instance.shareCountClass);
        assert.equal($shareCount.text(), "10", "share count value retrieved");
    });

    QUnit.test("countUrl should be requested as non-json source after fail with $.getJSON", function(assert) {
        $.getJSON = function() {
            return $.Deferred().reject().promise();
        };

        jsSocials.shares.testshare = {
            shareUrl: "http://test.com/share/",
            countUrl: "http://test.com/count?url={url}"
        };

        this.countUrl = "testurl";
        this.countResult = 10;

        var $element = $("#share").jsSocials({
            url: "testurl",
            showCount: true,
            shares: ["testshare"]
        });

        var instance = $element.data(JSSOCIALS_DATA_KEY);

        var $shareCount = $element.find("." + instance.shareCountClass);
        assert.equal($shareCount.text(), "10", "share count value retrieved");
    });

    QUnit.test("zero count class should be attached when count is zero", function(assert) {
        jsSocials.shares.testshare = {
            shareUrl: "http://test.com/share/",
            countUrl: "http://test.com/count?url={url}"
        };

        this.countUrl = "testurl";
        this.countResult = 0;

        var $element = $("#share").jsSocials({
            url: "testurl",
            showCount: true,
            shares: ["testshare"]
        });

        var instance = $element.data(JSSOCIALS_DATA_KEY);

        var $shareCountBox = $element.find("." + instance.shareCountBoxClass);
        assert.ok($shareCountBox.hasClass(instance.shareZeroCountClass), "zero count class attached");
    });

    QUnit.test("zero count class should be attached to link when count is zero and showCount is inside", function(assert) {
        jsSocials.shares.testshare = {
            shareUrl: "http://test.com/share/",
            countUrl: "http://test.com/count?url={url}"
        };

        this.countUrl = "testurl";
        this.countResult = 0;

        var $element = $("#share").jsSocials({
            url: "testurl",
            showCount: "inside",
            shares: ["testshare"]
        });

        var instance = $element.data(JSSOCIALS_DATA_KEY);

        var $shareLink = $element.find("." + instance.shareLinkCountClass);
        assert.ok($shareLink.hasClass(instance.shareZeroCountClass), "zero count class attached");
    });

    QUnit.test("zero count class should be attached when fail loading", function(assert) {
        jsSocials.shares.testshare = {
            shareUrl: "http://test.com/share/",
            countUrl: "http://test.com/count?url={url}"
        };

        $.get = $.getJSON = function() {
            return $.Deferred().reject().promise();
        };

        var $element = $("#share").jsSocials({
            url: "testurl",
            showCount: true,
            shares: ["testshare"]
        });

        var instance = $element.data(JSSOCIALS_DATA_KEY);

        var $shareCountBox = $element.find("." + instance.shareCountBoxClass);
        assert.ok($shareCountBox.hasClass(instance.shareZeroCountClass), "zero count class attached");
    });

    QUnit.test("zero count class should be attached before count loading is complete", function(assert) {
        jsSocials.shares.testshare = {
            shareUrl: "http://test.com/share/",
            countUrl: "http://test.com/count?url={url}"
        };

        var deferred = $.Deferred();

        $.getJSON = function() {
            return deferred.promise();
        };

        var $element = $("#share").jsSocials({
            url: "testurl",
            showCount: true,
            shares: ["testshare"]
        });

        var instance = $element.data(JSSOCIALS_DATA_KEY);

        var $shareCountBox = $element.find("." + instance.shareCountBoxClass);
        assert.ok($shareCountBox.hasClass(instance.shareZeroCountClass), "zero count class attached");

        deferred.resolve(10);

        assert.ok(!$shareCountBox.hasClass(instance.shareZeroCountClass), "zero count class detached");
    });

    var testCountFormatting = function(count, result, message) {
        QUnit.test(message, function(assert) {
            jsSocials.shares.testshare = {
                shareUrl: "http://test.com/share/",
                countUrl: "http://test.com/count?url={url}"
            };

            this.countUrl = "testurl";
            this.countResult = count;

            var $element = $("#share").jsSocials({
                url: "testurl",
                showCount: true,
                shares: ["testshare"]
            });

            var instance = $element.data(JSSOCIALS_DATA_KEY);

            var $shareCount = $element.find("." + instance.shareCountClass);
            assert.equal($shareCount.text(), result);
        });
    };

    testCountFormatting(999, "999", "less than 1K");
    testCountFormatting(1169, "1.17K", "more than 1K");
    testCountFormatting(999000, "999K", "less than 1M");
    testCountFormatting(1169000, "1.17M", "more than 1M");
    testCountFormatting(999000000, "999M", "less than 1G");
    testCountFormatting(1169000000, "1.17G", "more than 1G");
    testCountFormatting("1169000000", "1169000000", "string value is not formatted");


    QUnit.module("adaptive", {
        setup: function() {
            var self = this;
            self.originalJQueryWidth = $.fn.width;
            self.windowWidth = 0;

            $.fn.width = function() {
                if(this[0] === window) {
                    return self.windowWidth;
                }
                self.originalJQueryWidth.apply(this, arguments);
            };
        },
        teardown: function() {
            $.fn.width = this.originalJQueryWidth;
        }
    });

    QUnit.test("change config according to current screen size", function(assert) {
        var $element = $("#share").jsSocials({});

        var instance = $element.data(JSSOCIALS_DATA_KEY);

        // small screen
        this.windowWidth = 639;
        instance.refresh();
        assert.equal(instance._showCount, "inside", "showCount='inside' on small screen");
        assert.equal(instance._showLabel, false, "showLabel=false on small screen");

        // medium screen
        this.windowWidth = 1000;
        instance.refresh();
        assert.equal(instance._showCount, true, "showCount=true on medium screen");
        assert.equal(instance._showLabel, false, "showLabel=false on medium screen");

        // large screen
        this.windowWidth = 1025;
        instance.refresh();
        assert.equal(instance._showCount, true, "showCount=true on large screen");
        assert.equal(instance._showLabel, true, "showLabel=true on large screen");
    });

    QUnit.test("adaptive config when showCount=false", function(assert) {
        var $element = $("#share").jsSocials({
            showCount: false
        });

        var instance = $element.data(JSSOCIALS_DATA_KEY);

        // small screen
        this.windowWidth = 639;
        instance.refresh();
        assert.equal(instance._showLabel, false, "showLabel=false on small screen");

        // medium screen
        this.windowWidth = 1000;
        instance.refresh();
        assert.equal(instance._showLabel, true, "showLabel=true on medium screen");

        // large screen
        this.windowWidth = 1025;
        instance.refresh();
        assert.equal(instance._showLabel, true, "showLabel=true on large screen");
    });


    QUnit.module("share strategies", {
        setup: function() {
            jsSocials.shares.testshare = {
                shareUrl: "http://test.com/share",
                countUrl: ""
            };
        },
        teardown: function() {
            delete jsSocials.shares.testshare;
        }
    });

    QUnit.test("custom share strategy", function(assert) {
        var strategyContext;

        jsSocials.shareStrategies.custom = function(args) {
            strategyContext = this;
            return $("<button>").attr("share-url", args.shareUrl);
        };

        try {
            var $element = $("#share").jsSocials({
                shareIn: "custom",
                shares: ["testshare"]
            });

            var $shareLink = $element.find(".jssocials-share-link");
            assert.equal($shareLink.attr("share-url"), "http://test.com/share");
            assert.equal(strategyContext, $element.jsSocials("option", "shares")[0], "strategy context is a share");
        } finally {
            delete jsSocials.shareStrategies.custom;
        }
    });

    QUnit.test("shareIn can be redefined by share", 1, function(assert) {
        var customShareStrategyCalled = false;

        jsSocials.shareStrategies.custom = function() {
            customShareStrategyCalled = true;
            return $("<button>");
        };

        jsSocials.shares.testshare.shareIn = "custom";

        try {
            $("#share").jsSocials({
                shares: ["testshare"]
            });

            assert.ok(customShareStrategyCalled, "custom share strategy called");
        } finally {
            delete jsSocials.shareStrategies.custom;
        }
    });

    QUnit.test("throw error on unknown share strategy", function(assert) {
        assert.throws(
            function() {
                $("#share").jsSocials({
                    shareIn: "unknown",
                    shares: ["testshare"]
                });
            },
            "Share strategy 'unknown' is not found"
        );
    });

    QUnit.test("blank share strategy", function(assert) {
        var $result = jsSocials.shareStrategies.blank({ shareUrl: "share.url" });
        assert.equal($result.attr("href"), "share.url");
        assert.equal($result.attr("target"), "_blank");
    });

    QUnit.test("self share strategy", function(assert) {
        var $result = jsSocials.shareStrategies.self({ shareUrl: "share.url" });
        assert.equal($result.attr("href"), "share.url");
        assert.equal($result.attr("target"), "_self");
    });

    QUnit.test("blank share strategy", 1, function(assert) {
        var originalWindowOpen = window.open;
        window.open = function(url) {
            assert.equal(url, "share.url");
        };

        try {
            var $result = jsSocials.shareStrategies.popup({ shareUrl: "share.url" });
            $result.click();
        } finally {
            window.open = originalWindowOpen;
        }
    });

}(window.jQuery, window.QUnit, window.jsSocials));
