$(function() {

    /***
     * when a modal opened clicked and has a data-load attribute,
     * load data into the body using the function specified in
     * the data-load attribute.
     */
    $(".modal").on("show.bs.modal", function(e) {
        if ($(this).data("load") != undefined) {
            var functionName = $(this).data("load");
            var target = $(this);
            helpers.executeFunctionByName(functionName, window, target);
        }
    });

    $("main").on("click", 'input[data-radio-toggle="tab"]', function(e) {
        $(this).tab("show");
    })
});