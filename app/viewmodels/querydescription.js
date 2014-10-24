define(['durandal/system', 'plugins/http', 'durandal/app', 'knockout', '../config/appstate'],
    function (system, http, app, ko, appstate) {
        return{
            querydescription: ko.observable(),
            bindingComplete: function () {
                this.querydescription(appstate.querydescription)
            }
        };
    });