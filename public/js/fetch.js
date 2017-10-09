
jQuery(document).ready(function registerTimeReportPagination($) {
    $("main").off('click', '.table-timereport ul.pagination li').on('click', '.table-timereport ul.pagination li', function(e) {
        e.preventDefault();
        if(!$(this).hasClass("disabled")) {
            var type = $(this).closest('table').data('type');
            alert("timereportPagination | type: "+ type);
            /*fetch('/ajax/projects/filter?page='+page+'&field=status&value='+filter+'', {
                method: 'get'
            }).then(function(response) {
                return response.json();
            }).then(function(data) {
                filter = (filter == "") ? "all" : filter;
                var result = Handlebars.templates['project.listing.table'](data);
                $("#"+filter+"").html(result);
            }).catch(function(err) {
                // Error :(
            });*/
        }
    });
});

/*function fetchProjects(filter, page) {
 fetch('/projects/table?filter='+filter+'&page='+page+'', {
 method: 'get'
 }).then(function(response) {
 return response.text();
 }).then(function(text) {
 $("#"+filter+"").html(text);
 }).catch(function(err) {
 // Error :(
 });
 }
 function apiFetch(url, options, statushandler, contenthandler) {
 fetch(url, options)
 .then(statushandler)
 .then(contenthandler)
 .catch();
 }*/

/*function fetchProjects(filter, page) {
    fetch('/ajax/projects/filter?page='+page+'&field=status&value='+filter+'', {
        method: 'get'
    }).then(function(response) {
        return response.json();
    }).then(function(data) {
        filter = (filter == "") ? "all" : filter;
        var result = Handlebars.templates['project.listing.table'](data);
        $("#"+filter+"").html(result);
    }).catch(function(err) {
        // Error :(
    });
}*/