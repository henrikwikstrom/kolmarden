'use strict';

var mongoose = require('mongoose');

var TimeReport = mongoose.model('TimeReport');

module.exports = {
    getPage: function (collection, page, pageSize) {
        page = (page !== undefined || page == 0) ? page : 1;
        let pageCount = Math.ceil((collection.length+1)/pageSize);

        let response = {
            entries: collection.slice((page-1)*pageSize, ((page-1)*pageSize)+pageSize),
            pagination: {
                page: page,
                pageCount: pageCount,
                pageSize:pageSize,
                totalSize:collection.length,
                enabled: (pageCount > 1)
            }
        }

        return response;
    },
    
    getTimeReportsFromProject: function* (projectid, page) {
        //var timereports = yield TimeReport.find({project:projectid});

        var timereports = [
            {
                person: {
                    firstname:"Hans",
                    lastname:"Agné"
                },
                start: "2017-01-14 08:06",
                end: "2017-01-14 11:53"
            },
            {
                person: {
                    firstname:"Hans",
                    lastname:"Agné"
                },
                start: "2017-01-14 13:27",
                end: "2017-01-14 16:47"
            },
            {
                person: {
                    firstname:"Hans",
                    lastname:"Agné"
                },
                start: "2017-01-15 08:31",
                end: "2017-01-15 12:09"
            },
            {
                person: {
                    firstname:"Hans",
                    lastname:"Agné"
                },
                start: "2017-01-16 13:17",
                end: "2017-01-16 17:11"
            },
            {
                person: {
                    firstname:"Hans",
                    lastname:"Agné"
                },
                start: "2017-01-17 07:58",
                end: "2017-01-17 16:55"
            }
        ];

        /*for (var report of timereports) {
            report = yield report.populate("person").execPopulate();
        }*/

        var resultPage = this.getPage(timereports, page, 10);
        
        return resultPage;
        
    },

    getTimeReportsFromPerson: function* (personid) {

    },
    
    formatTimeReportContext: function (paginatedCollection, isProject) {
        
    }
};