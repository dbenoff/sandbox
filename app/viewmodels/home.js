define(['durandal/system', 'plugins/http', 'durandal/app', 'knockout', 'bootstrap', 'jquery-ui', '../config/appstate', './customModal', 'cookie', 'validator', 'plugins/router'],
    function (system, http, app, ko, bootstrap, jqueryui, appstate, customModal, cookie, validator, router) {


        return{

            hasCookie: ko.observable(false),
            username: ko.observable(),

            activate: function () {

                var appCookie = $.cookie('app');
                if(appCookie){
                    this.hasCookie(true);
                    appstate.username = $.cookie('name');
                    this.username(appstate.username);
                }



                //uncomment for testing
                $.get("assets/json/results.json",
                    function (queryData) {

                        var data = {};
                        data.BridgeFeatureResults = queryData.BridgeFeatureResults;
                        appstate.queryResults = queryData;
                        appstate.queryName = 'Assets';
                    }
                );
            },

            showLoginModal: function () {
                customModal.show().then(function (response) {
                    router.navigate('queryconfig');
                });
            }

        };


    });