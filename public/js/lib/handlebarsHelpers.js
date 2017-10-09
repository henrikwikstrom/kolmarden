

var register = function(Handlebars) {

    var helpers = {
        // put all of your helpers inside this object

        if_eq: function(a, b, opts) {
            if(a == b || a === b || a.equals(b))
                return opts.fn(this);
            else
                return opts.inverse(this);
        },

        /**
         * @return {string}
         */
        FormatDate(datestring) {
            var mdate = moment(datestring, "YYYY-MM-DD HH:mm");
            return mdate.format("YYYY-MM-DD");
        },

        GetInterval(start, end) {
            var sdate = moment(start, "YYYY-MM-DD HH:mm");
            var edate = moment(end, "YYYY-MM-DD HH:mm");
            return sdate.format("HH:mm") + " - " + edate.format("HH:mm");
        },

        /**
         * @return {string}
         */
        HoursBetween(start, end) {
            var sdate = moment(start, "YYYY-MM-DD HH:mm");
            var edate = moment(end, "YYYY-MM-DD HH:mm");
            var duration = moment.duration(edate.diff(sdate));
            var hours = duration.asHours();
            return Math.round(hours*100)/100;
        },

        /***
         * Encode json for attribute storage
         * @param obj
         * @returns {string}
         */
        jsonStringify: function ( obj ){
            return JSON.stringify(obj);
        },

        /***
         * Get actual index instead of page-specific index
         * @param index
         * @param pagination
         * @returns {number}
         */
        tableIndex: function (index, options) {
            pagination = (options.hash.pagination === undefined) ? {page:1, pageSize:0} : options.hash.pagination;
            return ((pagination.page-1)*pagination.pageSize)+(index+1);
        },

        /***
         * Insert block content into the specified section
         * @param name
         * @param options
         * @returns {null}
         */
        section: function(name, options){
            if(!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        },

        /***
         * @author [Oli Lalonde]{@link https://github.com/olalonde}
         * @license MIT License
         * {@link https://github.com/olalonde/handlebars-paginate}
         *
         * @description Build proper pagination context
         * @param pagination
         * @param options
         * @returns {string}
         */
        paginate: function(pagination, options) {
            var type = options.hash.type || 'middle';
            var ret = '';
            var pageCount = Number(pagination.pageCount);
            var page = Number(pagination.page);
            var limit;
            if (options.hash.limit) limit = +options.hash.limit;

            //page pageCount
            var newContext = {};
            switch (type) {
                case 'middle':
                    if (typeof limit === 'number') {
                        var i = 0;
                        var leftCount = Math.ceil(limit / 2) - 1;
                        var rightCount = limit - leftCount - 1;
                        if (page + rightCount > pageCount)
                            leftCount = limit - (pageCount - page) - 1;
                        if (page - leftCount < 1)
                            leftCount = page - 1;
                        var start = page - leftCount;

                        while (i < limit && i < pageCount) {
                            newContext = { n: start };
                            if (start === page) { newContext.active = true; newContext.disabled = true;}
                            ret = ret + options.fn(newContext);
                            start++;
                            i++;
                        }
                    }
                    else {
                        for (var i = 1; i <= pageCount; i++) {
                            newContext = { n: i };
                            if (i === page) { newContext.active = true; newContext.disabled = true;}
                            ret = ret + options.fn(newContext);
                        }
                    }
                    break;
                case 'previous':
                    if (page === 1) {
                        newContext = { disabled: true, n: 1 }
                    }
                    else {
                        newContext = { n: page - 1 }
                    }
                    ret = ret + options.fn(newContext);
                    break;
                case 'next':
                    newContext = {};
                    if (page === pageCount) {
                        newContext = { disabled: true, n: pageCount }
                    }
                    else {
                        newContext = { n: page + 1 }
                    }
                    ret = ret + options.fn(newContext);
                    break;
                case 'first':
                    if (page === 1) {
                        newContext = { disabled: true, n: 1 }
                    }
                    else {
                        newContext = { n: 1 }
                    }
                    ret = ret + options.fn(newContext);
                    break;
                case 'last':
                    if (page === pageCount) {
                        newContext = { disabled: true, n: pageCount }
                    }
                    else {
                        newContext = { n: pageCount }
                    }
                    ret = ret + options.fn(newContext);
                    break;
            }

            return ret;
        }
    };

    if (Handlebars && typeof Handlebars.registerHelper === "function") {
        // register helpers
        for (var prop in helpers) {
            Handlebars.registerHelper(prop, helpers[prop]);
        }
    } else {
        // just return helpers object if we can't register helpers here
        return helpers;
    }

};

// client
if (typeof window !== "undefined") {
    register(Handlebars);
}
// server
else {
    var moment = require('moment');
    module.exports.register = register;
    module.exports.helpers = register(null);
}