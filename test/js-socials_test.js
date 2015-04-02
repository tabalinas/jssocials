(function($) {
    module("jQuery#jsSocials", {
        setup: function() {
            this.elems = $("#qunit-fixture").children();
        }
    });

    test("is chainable", function() {
        expect(1);
        strictEqual(this.elems.jsSocials(), this.elems, "should be chainable");
    });

    test("is jsSocials", function() {
        expect(1);
        strictEqual(this.elems.jsSocials().text(), "jsSocials0jsSocials1jsSocials2", "should be jsSocials");
    });

}(jQuery));
