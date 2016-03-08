var smoothScroll = (function() {
    var header_height = 0;
    var delta = 0;
    var interval_id = null;
    var scrollunits = 0;
    var direction = 0;
    var vh, bh;
    function smoothScroll() {
        if (scrollunits === 0) {
            clearInterval(interval_id);
        } else {
            delta = scrollunits > 10 ? 10 : scrollunits;
            window.scrollTo(window.scrollX, window.scrollY + direction *delta);
            scrollunits = scrollunits - delta;
        }
    }
    function onInPageLinkClicked(e) {
        e.preventDefault();
        var a_el = this;
        var target_id = a_el.getAttribute('href').substr(1);
        var target_el = document.getElementById(target_id);
        //.getBoundingClientRect().top gives you current position on the layout. 
        // adding window.scrollY would give you absolute from top of your html.
        var desty = target_el.getBoundingClientRect().top + window.scrollY;
        var curry = window.scrollY;
        if (desty < curry) {
            scrollunits = curry - desty + header_height;
            direction = -1;
        } else {
            direction = +1;
            if (desty > bh - vh) {
                scrollunits = bh - vh -curry;
            } else {
                scrollunits = desty - curry - header_height;
            }
        }

        interval_id = setInterval(smoothScroll, 10);
    }
    function init(config) {
        if (config && 'fixed_head_id' in config) {
            var header_el = document.getElementById(config['fixed_head_id']);
            if (header_el === null) {
                throw new Error('Invalid id provided!');
            }
            header_height = header_el.offsetHeight;
        }
        var a_list = document.querySelectorAll("a[href^='#']");
        for (var i = 0; i < a_list.length; i++) {
            var href_value = a_list[i].getAttribute('href');
            if (href_value !== "#") {
                a_list[i].addEventListener('click', onInPageLinkClicked);
            }
        }
        var body = document.body;
        var html = document.documentElement;
        vh = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        bh = Math.max(
            body.scrollHeight, 
            body.offsetHeight, 
            html.clientHeight, 
            html.scrollHeight, 
            html.offsetHeight
        );
    }
    return {
        init : init
    };
})();
