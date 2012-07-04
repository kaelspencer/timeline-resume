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

        timeline.draw();
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
        var bubble_container = $('<div class="bubble-container" />');
        timeline.container.prepend(bubble_container);

        timeline.create_bubble(bubble_container);
    },
    create_bubble: function(bubble_container) {
        var bubble = $('<div class="bubble">content</div>');
        var bubble_left = 300;

        bubble.css('left', bubble_left + 'px');
        bubble_container.append(bubble);

        var width = bubble.width();
        width = 218;
        var left = {
            x: Math.round(bubble.position().left),
            y: Math.round(bubble.position().top + bubble.height())
        }
        left.y = 189;
        left.x = bubble_left + 3;

        var right = {
            x: Math.round(bubble.position().left + width),
            y: left.y
        }
        right.x = bubble_left + width;

        console.log('(' + left.x + ', ' + left.y + ')');
        console.log('(' + right.x + ', ' + right.y + ')');

        var target = {
            x: Math.round(left.x + width * 0.1),
            y: Math.round(timeline.line.position().top - 30)
        }

        console.log('target: (' + target.x + ', ' + target.y + ')');

        bubble_container.append(timeline.draw_line(left, target));
        bubble_container.append(timeline.draw_line(right, target));
    },
    draw_line: function(source, destination) {
        var dx = destination.x - source.x;
        var dy = destination.y - source.y;
        var length = Math.round(Math.sqrt(dx * dx + dy * dy));
        var angle = Math.atan2(dy, dx);

        console.log('dx: ' + dx);
        console.log('dy: ' + dy);
        console.log('length: ' + length);
        console.log('angle: ' + angle);

        var line = $('<div />')
            .addClass('bubble-line')
            .width(length)
            .css({
                '-webkit-transform-origin': '0% 0%',
                '-webkit-transform': 'rotate(' + angle + 'rad)',
                'top': source.y + 'px',
                'left': source.x + 'px'
            });
        return line;
    }
}

$(document).ready(function() {
    var years = ["2003","2004","2005","2006","2007","2008","2009","2010","2011","2012"];
    timeline.init('timeline', years);
});
