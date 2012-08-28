var g_scroll_time_ms = 500;

function set_page_heights() {
    // Minimum height of 750px;
    var min_height = 750;
    var window_height = $(window).height();

    $('.page_segment').height(window_height > min_height ? window_height : min_height);
}

function set_scroll_links() {
    $('a[href*=#]').click(function() {
        console.log('Scrolling to ' + $(this).attr('href'));
        $.scrollTo($(this).attr('href'), g_scroll_time_ms);
        return false;
    });

    // Scrolling to the top with scrollTo leaves some space at the top.
    $('a[href*=#top]')
        .unbind('click')
        .click(function(){
            console.log('Scrolling to the top');
            $("html, body").animate({ scrollTop: 0 }, g_scroll_time_ms);
            return false;
        });
}

function create_pages(events) {
    var body = $('body');
    var clearer = $('<div>').addClass('clear');

    $.each(events, function() {
        $('<div>')
            .addClass('page_segment')
            .addClass('page')
            .attr('id', this.slug)
            .html('<h1>' + this.slug + ' (<a href="#top">back to timeline</a>)</h1>')
            .appendTo(body);
        body.append(clearer);
    });

    set_page_heights();
    set_scroll_links();
}
