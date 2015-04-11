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

}(jQuery, window.jsSocials));
