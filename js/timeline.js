var Timeline = {};

Timeline.horizontal_scroll_stop = function(event, ui) {
    var line = $('#line-draggable');
    var right = line.width();
    var visible = right + ui.position.left;

    if(ui.position.left > 0) {
        line.animate({
            left: '-=' + ui.position.left
        }, 500, Timeline.draw_bubbles);
    } else if(visible < $(window).width()) {
        move_right = $(window).width() - visible;

        line.animate({
            left: '+=' + move_right
        }, 500, Timeline.draw_bubbles);
    } else {
        Timeline.draw_bubbles();
    }
};

Timeline.draw_bubbles = function() {
    console.log("draw bubbles");
};

$(document).ready(function() {
    $('#line-draggable').draggable({
        axis: 'x',
        stop: Timeline.horizontal_scroll_stop
    });
});
