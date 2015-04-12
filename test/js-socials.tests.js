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

        assert.strictEqual($element.text(), "", "content is removed");
        assert.ok(!$element.hasClass(instance.elementClass), "", "content is removed");
        assert.strictEqual($element.data(JSSOCIALS_DATA_KEY), undefined, "jQuery data removed");
    });


    QUnit.module("share rendering", {
        afterEach: function() {
            delete jsSocials.shares.testshare;
        }
    });

    QUnit.test("share markup", function(assert) {
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
        assert.ok($share.hasClass("jssocials-share-testshare"), "share class is attached");
        assert.ok($share.hasClass("custom-class"), "share custom class is attached");

        var $shareButton = $share.find("." + instance.shareButtonClass);
        assert.equal($shareButton.length, 1, "share button rendered");

        var $shareLink = $shareButton.find("." + instance.shareLinkClass);
        assert.equal($shareLink.length, 1, "share link rendered");
        assert.equal($shareLink.attr("href"), "http://test.com/share/?url=testurl&text=testtext", "share href is correct");

        var $shareLabel = $shareLink.find("." + instance.shareLabelClass);
        assert.equal($shareLabel.length, 1, "share label rendered");
        assert.equal($shareLabel.text(), "testLabel", "share label text rendered");

        var $shareLogo = $shareLink.find("." + instance.shareLogoClass);
        assert.equal($shareLogo.length, 1, "share logo rendered");
        assert.equal($shareLogo.attr("src"), "test.png", "share logo src set");
        assert.equal($shareLogo.height(), 36, "share logo height set");
        assert.equal($shareLogo.width(), 36, "share logo width set");
    });

    QUnit.test("share custom url params", function(assert) {
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

}(jQuery, window.jsSocials));
