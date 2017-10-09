(function(exports){

    /***
     * Executes a function based on its name.
     * @param functionName
     * @param context
     * @returns {*}
     */
    exports.executeFunctionByName = function(functionName, context /*, args */) {
        var args = [].slice.call(arguments).splice(2);
        var namespaces = functionName.split(".");
        var func = namespaces.pop();
        for(var i = 0; i < namespaces.length; i++) {
            context = context[namespaces[i]];
        }
        return context[func].apply(context, args);
    };

    /***
     * Returns a formatted date string from a Date object
     * @param date
     * @returns {string}
     */
    exports.getDateString = function(date) {
        var dd = date.getDate();
        var mm = date.getMonth()+1; //January is 0!

        var yyyy = date.getFullYear();
        if(dd<10){
            dd='0'+dd;
        }
        if(mm<10){
            mm='0'+mm;
        }
        return yyyy+'-'+mm+'-'+dd;
    }

    /***
     * Returns a JSON string of a JavaScript Object escaped for use in html attributes.
     * @param obj
     * @returns {string|void|XML|*}
     */
    exports.escapeAttributeObject = function(obj) {
        return JSON.stringify(obj).replace(/"/g, "&quot;");
    }

    exports.generateQR = function(element, options) {
        var qrcode = new QRCode(element, options);
    }

}(typeof exports === 'undefined' ? this.helpers = {} : exports));