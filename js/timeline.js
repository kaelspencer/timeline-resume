var Timeline = {};

Timeline.horizontal_scroll_stop = function(event, ui) {
    var line = $('#line-draggable');
    var width = line.width();
    var window_width = $(window).width();
    var visible = width + ui.position.left;
    var move = 0;

    console.log('width: ' + width);
    console.log('visible: ' + visible);

    if(ui.position.left > 0 || width < window_width) {
        // The left side is to the right of the left edge of the screen.
        move = -1 * ui.position.left;
    } else if(visible < window_width) {
        move = $(window).width() - visible;
    }

    if(move) {
        line.animate({
            left: '+=' + move
        }, 500, Timeline.draw_bubbles);
    } else {
        Timeline.draw_bubbles();
    }
};

Timeline.draw_bubbles = function() {

};

$(document).ready(function() {
    $('#line-draggable').draggable({
        axis: 'x',
        stop: Timeline.horizontal_scroll_stop
    });
});
