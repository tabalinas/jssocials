(function($, jsSocials) {

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


    QUnit.module("share rendering", {
        afterEach: function() {
            delete jsSocials.shares.testshare;
        }
    });

    QUnit.test("share structure", function(assert) {
        jsSocials.shares.testshare = {
            logo: "test.png",
            logoSize: 36,
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

        var $shareButton = $share.find("." + instance.shareButtonClass);
        assert.equal($shareButton.length, 1, "share button rendered");

        var $shareLink = $shareButton.find("." + instance.shareLinkClass);
        assert.equal($shareLink.length, 1, "share link rendered");
        assert.equal($shareLink.attr("href"), "http://test.com/share/?url=testurl&text=testtext", "share href correct");

        var $shareLabel = $shareLink.find("." + instance.shareLabelClass);
        assert.equal($shareLabel.length, 1, "share label rendered");
        assert.equal($shareLabel.text(), "testLabel", "share label text rendered");

        var $shareLogo = $shareLink.find("." + instance.shareLogoClass);
        assert.equal($shareLogo.length, 1, "share logo rendered");
        assert.equal($shareLogo.attr("src"), "test.png", "share logo src set");
        assert.equal($shareLogo.height(), 36, "share logo height set");
        assert.equal($shareLogo.width(), 36, "share logo width set");
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

    QUnit.test("logo as icon class", function(assert) {
        jsSocials.shares.testshare = {
            logo: "fa fa-user",
            shareUrl: "http://test.com/share"
        };

        var $element = $("#share").jsSocials({
            logoSize: 24,
            shares: ["testshare"]
        });

        var $shareLogo = $element.find(".jssocials-share-logo");
        assert.equal($shareLogo.get(0).tagName, "I", "<i> used instead of <img>");
        assert.ok($shareLogo.hasClass("fa"), "fa css class attached");
        assert.ok($shareLogo.hasClass("fa-user"), "fa css class attached");
        assert.equal($shareLogo.css("font-size"), "24px", "logoSize ");
    });

    QUnit.test("logo as base64 image", function(assert) {
        var imgBase64 = "data:image/png;base64,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";

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

}(jQuery, window.jsSocials));
