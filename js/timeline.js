var timeline = {
    container: null,
    line: null,
    draggable: null,
    width: 0,
    bubble_base: null,
    bubble_top: null,
    bubble_bottom: null,
    year: null,
    events: null,

    /* Constants */
    bubble_width: 200,

    init: function(element, years, events) {
        timeline.container = $('#' + element);
        timeline.line = $('<div>').addClass('line');
        timeline.draggable = $('<div>', { id: 'line-draggable'});
        timeline.bubble_base = $('<div>')
            .addClass('bubble')
            .height(150) // This needs to be in sync with the CSS class.
            .width(timeline.bubble_width); // This needs to be in sync with the CSS class.

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
            },
            bottom: ''
        };

        timeline.bubble_bottom = {
            target_y: function() { return -1; },
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
            },
            bottom: '0px'
        };

        timeline.container.addClass('timeline');
        timeline.container.append(timeline.line);
        timeline.line.append(timeline.draggable);

        timeline.draggable.draggable({
            axis: 'x',
            stop: timeline.horizontal_scroll_stop
        });

        timeline.year = years;
        timeline.events = events

        for (var i = timeline.year.start; i <= timeline.year.end; i++) {
            $('<div>').text(i).appendTo(timeline.draggable);
        };

        // The draggable line has a width calculated by:
        // element_size = width of text + margin left + margin right = 100 + 20 + 80
        // Subtract the right marging from the last div.
        // width = (number of years) * (100 + 20 + 80) - 60
        timeline.width = (timeline.year.end - timeline.year.start + 1) * timeline.bubble_width - 60;

        $('#line-draggable div').last().addClass('last');
        timeline.line.css('width', '100%');

        timeline.draggable.animate({ left: '-=300' }, 0, timeline.draw);
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
            }, 200, timeline.draw);
        } else {
            timeline.draw();
        }
    },
    draw: function() {
        $('#timeline .bubble-container').remove();
        var container_bottom = $('<div>').addClass('bubble-container');
        var container_top = container_bottom.clone();
        var on_screen_events = [];
        var top = true;

        timeline.container.prepend(container_top);
        timeline.container.append(container_bottom);

        // Find the events that are on the viewable timeline.
        $.each(timeline.events, function() {
            var date_position = timeline.determine_date_position(this.date);

            if (date_position > 0) {
                on_screen_events.push({
                    'event': this,
                    'date_position': date_position
                });
            }
        });

        on_screen_events.sort(function(a, b) {
            return (a.date_position == b.date_position ? 0 : (a.date_position > b.date_position ? 1 : -1));
        });

        // Create the events that are viewable.
        $.each(on_screen_events, function() {
            var container = (top ? container_top : container_bottom);
            var bubble = (!(top = !top) ? timeline.bubble_top : timeline.bubble_bottom);

            timeline.create_bubble(this.event, bubble, container, this.date_position);
        });
    },
    create_bubble: function(event, data, container, date_position) {
        var left = date_position - 100;
        var bubble = timeline.bubble_base.clone()
            .appendTo(container)
            .css({
                'left': left + 'px',
                'bottom': data.bottom
            })
            .text(event.text);
        $('<h1>')
            .html('<a href="#' + event.slug + '">' + event.title + '</a>')
            .prependTo(bubble);
        var top = bubble.position().top;

        var target = {
            x: date_position,
            y: data.target_y()
        }

        container.append(timeline.draw_line(data.left(left, top), target));
        container.append(timeline.draw_line(data.right(left, top), target));
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
    },
    determine_date_position: function(date) {
        // The first part of a year starts on the center of the displayed year.
        // A value of 2012.0 passed in would be in the center of "2012".
        var start = 70;
        var end = timeline.width - 70;
        var pos = start + (date - timeline.year.start) * 200 + timeline.draggable.position().left;

        return pos;
    }
}

$(function() {
    var years = {
        start: 2003,
        end: 2012
    }
    var events = [
        { date: 2005, title: 'Event A', slug: 'event_a', text: 'This is sample text for the event bubble.' },
        { date: 2006, title: 'Event B', slug: 'event_b', text: 'This is sample text for the event bubble.' },
        { date: 2007, title: 'Event C', slug: 'event_c', text: 'This is sample text for the event bubble.' },
        { date: 2008, title: 'Event D', slug: 'event_d', text: 'This is sample text for the event bubble.' },
    ];

    timeline.init('timeline', years, events);
    create_pages(events);
});
