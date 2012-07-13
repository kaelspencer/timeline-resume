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

        timeline.draggable.animate({ left: '-=300' }, 50, timeline.draw);
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
        $('#timeline .bubble-container').remove();
        var bubble_container = $('<div class="bubble-container" />');
        timeline.container.prepend(bubble_container);

        timeline.create_bubble(bubble_container, 150);
        timeline.create_bubble(bubble_container, 400);
        timeline.create_bubble(bubble_container, 700);
    },
    create_bubble: function(bubble_container, left_offset) {
        var bubble = $('<div>')
            .addClass('bubble')
            .appendTo(bubble_container)
            .height(150) // This needs to be in sync with the CSS class.
            .width(200) // This needs to be in sync with the CSS class.
            .css({
                'left': left_offset + 'px'
            });

        var left = {
            x: left_offset + 8,
            y: bubble.height() + 41
        }

        var right = {
            x: left_offset + bubble.width() + 12,
            y: left.y
        }

        var target = {
            x: Math.round(left.x + bubble.width() * 0.5),
            y: timeline.line.position().top
        }

        console.log('(' + left.x + ', ' + left.y + ')');
        console.log('(' + right.x + ', ' + right.y + ')');
        console.log('target: (' + target.x + ', ' + target.y + ')');

        bubble_container.append(timeline.draw_line(left, target));
        bubble_container.append(timeline.draw_line(right, target));
    },
    draw_line: function(source, destination) {
        var dx = destination.x - source.x;
        var dy = destination.y - source.y;
        var length = Math.round(Math.sqrt(dx * dx + dy * dy));
        var angle = Math.atan2(dy, dx);

        var line = $('<div>')
            .addClass('bubble-line')
            .width(length)
            .css({
                'transform-origin': '0% 0%',
                'transform': 'rotate(' + angle + 'rad)',
                '-webkit-transform-origin': '0% 0%',
                '-webkit-transform': 'rotate(' + angle + 'rad)',
                '-moz-transform-origin': '0% 0%',
                '-moz-transform': 'rotate(' + angle + 'rad)',
                '-o-transform-origin': '0% 0%',
                '-o-transform': 'rotate(' + angle + 'rad)',
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
