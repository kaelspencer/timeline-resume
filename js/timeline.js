// Having problems with storing variables in the object.
var g_line_width = 0;

function timeline_init(element, years) {
    this.container = $('#' + element);
    this.line = $('<div class="line"/>');
    this.draggable = $('<div id="line-draggable">');

    this.container.addClass('timeline');
    this.container.append(this.line);
    this.line.append(this.draggable);

    this.draggable.draggable({
        axis: 'x',
        stop: Timeline.horizontal_scroll_stop
    });

    years.forEach(function(element, index, array) {
        var el = $('<div>' + element + '</div>');
        this.draggable.append(el);
    }, this);

    // The draggable line has a width calculated by:
    // element_size = width of text + margin left + margin right = 100 + 20 + 80
    // Subtract the right marging from the last div.
    // width = (number of years) * (100 + 20 + 80) - 60
    g_line_width = years.length * 200 - 60;
    console.log(g_line_width);
    console.log(this.line.width());

    $('#line-draggable div').last().addClass('last');
    this.line.css('width', '100%');
}

function timeline_horizontal_scroll_stop(event, ui) {
    var line = $('#line-draggable');
    var width = g_line_width;
    var window_width = $(window).width();
    var visible = width + ui.position.left;
    var move = 0;

    if(ui.position.left > 0 || width < window_width) {
        // The left side is to the right of the left edge of the screen.
        move = -1 * ui.position.left;
    } else if(visible < window_width) {
        // The right side is to the left of the right edge of the screen.
        move = $(window).width() - visible;
    }

    if(move) {
        line.animate({
            left: '+=' + move
        }, 500, Timeline.draw);
    } else {
        Timeline.draw();
    }
}

function timeline_draw() {
}

function timeline() {
    this.init = timeline_init;
    this.horizontal_scroll_stop = timeline_horizontal_scroll_stop;
    this.draw = timeline_draw;

    this.line = Object;
    this.width = 0;
}

var Timeline = new timeline();

$(document).ready(function() {
    var years = ["2003","2004","2005","2006","2007","2008","2009","2010","2011","2012"];
    Timeline.init('timeline', years);
});
