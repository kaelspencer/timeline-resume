var timeline = {
    container: null,
    line: null,
    draggable: null,
    width: 0,

    init: function(element, years) {
        timeline.container = $('#' + element);
        timeline.line = $('<div class="line"/>');
        timeline.draggable = $('<div id="line-draggable">');

        timeline.container.addClass('timeline');
        timeline.container.append(timeline.line);
        timeline.line.append(timeline.draggable);

        timeline.draggable.draggable({
            axis: 'x',
            stop: timeline.horizontal_scroll_stop
        });

        years.forEach(function(element, index, array) {
            var el = $('<div>' + element + '</div>');
            timeline.draggable.append(el);
        }, timeline);

        // The draggable line has a width calculated by:
        // element_size = width of text + margin left + margin right = 100 + 20 + 80
        // Subtract the right marging from the last div.
        // width = (number of years) * (100 + 20 + 80) - 60
        timeline.width = years.length * 200 - 60;

        $('#line-draggable div').last().addClass('last');
        timeline.line.css('width', '100%');
    },
    horizontal_scroll_stop: function(event, ui) {
        var window_width = $(window).width();
        var visible = timeline.width + ui.position.left;
        var move = 0;

        if(ui.position.left > 0 || timeline.width < window_width) {
            // The left side is to the right of the left edge of the screen.
            move = -1 * ui.position.left;
        } else if(visible < window_width) {
            // The right side is to the left of the right edge of the screen.
            move = $(window).width() - visible;
        }

        if(move) {
            timeline.draggable.animate({
                left: '+=' + move
            }, 500, timeline.draw);
        } else {
            timeline.draw();
        }
    },
    draw: function() {
        console.log('draw');
    }
}

$(document).ready(function() {
    var years = ["2003","2004","2005","2006","2007","2008","2009","2010","2011","2012"];
    timeline.init('timeline', years);
});
