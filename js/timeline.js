var timeline = {
    container: null,
    line: null,
    draggable: null,
    width: 0,
    bubble_base: null,
    bubble_top: null,
    bubble_bottom: null,

    init: function(element, years) {
        timeline.container = $('#' + element);
        timeline.line = $('<div>').addClass('line');
        timeline.draggable = $('<div>', { id: 'line-draggable'});
        timeline.bubble_base = $('<div>')
            .addClass('bubble')
            .height(150) // This needs to be in sync with the CSS class.
            .width(200); // This needs to be in sync with the CSS class.

        timeline.bubble_top = {
            target_y: function() { return timeline.line.position().top - 24 },
            left: function(offset) {
                return {
                    x: offset + 7,
                    y: timeline.bubble_base.height() + 15
                }
            },
            right: function(offset) {
                return {
                    x: offset + timeline.bubble_base.width() + 13,
                    y: timeline.bubble_base.height() + 15
                }
            }
        };

        timeline.bubble_bottom = {
            target_y: -1,
            left: function(offset_x, offset_y) {
                return {
                    x: offset_x + 7,
                    y: offset_y + 3
                }
            },
            right: function(offset_x, offset_y) {
                return {
                    x: offset_x + timeline.bubble_base.width() + 11,
                    y: timeline.bubble_bottom.left(offset_x, offset_y).y
                }
            }
        };

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
        var bubble_container_bottom = $('<div>').addClass('bubble-container');
        var bubble_container_top = bubble_container_bottom.clone();

        timeline.container.prepend(bubble_container_top);
        timeline.container.append(bubble_container_bottom);

        timeline.create_bubble_top(bubble_container_top, 150);
        timeline.create_bubble_top(bubble_container_top, 800);
        timeline.create_bubble_bottom(bubble_container_bottom, 300);
    },
    create_bubble_top: function(bubble_container, left_offset) {
        var bubble = timeline.bubble_base.clone()
            .appendTo(bubble_container)
            .css({
                'left': left_offset + 'px'
            });

        var left = timeline.bubble_top.left(left_offset);
        var right = timeline.bubble_top.right(left_offset);

        var target = {
            x: Math.round(left.x + bubble.width() * 0.5),
            y: timeline.bubble_top.target_y()
        }

        bubble_container.append(timeline.draw_line(left, target));
        bubble_container.append(timeline.draw_line(right, target));
    },
    create_bubble_bottom: function(bubble_container, left_offset) {
        var bubble = timeline.bubble_base.clone()
            .appendTo(bubble_container)
            .css({
                'left': left_offset + 'px',
                'bottom': '0px'
            });

        var left = timeline.bubble_bottom.left(left_offset, bubble.position().top);
        var right = timeline.bubble_bottom.right(left_offset, bubble.position().top);

        var target = {
            x: Math.round(left.x + bubble.width() * 0.5),
            y: timeline.bubble_bottom.target_y
        }

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

$(function() {
    var years = ["2003","2004","2005","2006","2007","2008","2009","2010","2011","2012"];
    timeline.init('timeline', years);
});
