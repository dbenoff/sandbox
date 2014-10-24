requirejs.config({
    paths: {
        'text': '../bower_components/requirejs-text/text',
        'durandal': '../bower_components/durandal/js',
        'plugins': '../bower_components/durandal/js/plugins',
        'transitions': '../bower_components/durandal/js/transitions',
        'knockout': '../bower_components/knockout.js/knockout.debug',
        'jquery': '../bower_components/jquery/jquery',
        'bootstrap': '../bower_components/bootstrap/dist/js/bootstrap',
        'modernizr': '../bower_components/modernizr/modernizr',
        'jquery-ui': '../bower_components/jqueryui/jquery-ui',
        'jstree': '../bower_components/jstree/dist/jstree',
        'datatables': '../bower_components/datatables/media/js/jquery.dataTables',
        'highcharts': '../bower_components/highcharts/highcharts',
        'cookie': '../assets/js/jquery-cookie',
        'validator': '../bower_components/bootstrapvalidator/dist/js/bootstrapValidator',
    },
    shim: {
        bootstrap: {
            deps: ['jquery'],
            exports: 'jQuery'
        },
        modernizr: {
            exports: 'Modernizr'
        }
    }
});

define(['durandal/system', 'durandal/app', 'durandal/viewLocator', 'bootstrap', 'knockout'], function (system, app, viewLocator, bootstrap, ko) {
    //>>excludeStart("build", true);
    system.debug(true);
    //>>excludeEnd("build");

    app.title = "";

    app.configurePlugins({
        router: true,
        dialog: true,
        widget: true
    });

    app.start().then(function () {
        // Replace 'viewmodels' in the moduleId with 'views' to locate the view.
        // Look for partial views in a 'views' folder in the root.
        viewLocator.useConvention();

        // Show the app by setting the root view model for our application with a transition.
        app.setRoot('viewmodels/shell');

        ko.bindingHandlers.fadeVisible = {
            init: function (element, valueAccessor) {
                // Initially set the element to be instantly visible/hidden depending on the value
                var value = valueAccessor();
                $(element).toggle(ko.unwrap(value)); // Use "unwrapObservable" so we can handle values that may or may not be observable
            },
            update: function (element, valueAccessor) {
                // Whenever the value subsequently changes, slowly fade the element in or out
                var value = valueAccessor();
                if (ko.unwrap(value)) {
                    $(element).fadeIn();
                    $("html, body").animate({ scrollTop: $(element).offset().top }, 1000);
                } else {
                    $(element).fadeOut();
                }
            }
        };

        ko.bindingHandlers.modal = {
            init: function (element, valueAccessor) {
                $(element).modal({
                    show: false
                });

                var value = valueAccessor();
                if (typeof value === 'function') {
                    $(element).on('hide.bs.modal', function () {
                        value(false);
                    });
                }
                ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                    $(element).modal("destroy");
                });

            },
            update: function (element, valueAccessor) {
                var value = valueAccessor();
                if (ko.utils.unwrapObservable(value)) {
                    $(element).modal('show');
                } else {
                    $(element).modal('hide');
                }
            }
        }

        $body = $("body");

        $(document).on({
            ajaxStart: function () {
                $body.addClass("loading");
            },
            ajaxStop: function () {
                $body.removeClass("loading");
            }
        });
    });
});
