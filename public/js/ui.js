$(function() {
    $(".navbar-toggle").click( function()
        {
            $(this).toggleClass("nav-open");
            $(this).blur();
        }
    );

    $("[data-hide]").on("click", function(){
        $(this).closest("." + $(this).attr("data-hide")).hide();
    });

    $("main").on('click', ".table-href tbody tr",function() {
        window.location = $(this).data("href");
    });

    $("main").on('click', ".table-selectable tbody tr",function() {
        $(this).addClass('active').siblings().removeClass('active');
        if ($(this).closest('table').data("load") != undefined) {
            var functionName = $(this).closest('table').data("load");
            var target = $(this).closest('table').data("target");
            var row = $(this);
            helpers.executeFunctionByName(functionName, window, target, row);
        }

    });
});

function setActionAlert(id, type, message) {
    $(id).removeClass("alert-success alert-info alert-warning alert-danger");
    $(id).addClass(type);
    $(id+' .alert-content').html(message);
    $(id).show();
    $("html, body").animate({ scrollTop: 0 }, "slow");

}