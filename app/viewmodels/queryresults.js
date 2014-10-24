define(['plugins/http', 'durandal/app', 'knockout', 'jquery-ui', 'datatables', '../config/appstate', 'plugins/router', '../definitions/tabledefs', '../config/config', './querydescription'],
    function (http, app, ko, jqueryui, datatables, appstate, router, tabledefs, config, querydescription) {

        return {

            querydescription: querydescription,
            displayName: 'Query Results',
            configuredTables: ko.observableArray([]),

            activate: function () {
                var data = appstate.queryResults;
                var queryName = appstate.queryName;
                var configuredTables = [];
                if (data && queryName) {
                    var tabledef = tabledefs[queryName];
                    $(tabledef.tabs).each(function (index, tabname) {
                        var dataKey = tabledef.dataKeys[index];
                        if (data[dataKey] && data[dataKey].length > 0) {
                            var table = {};
                            table.title = tabname;
                            table.data = data[dataKey];
                            table.columnDefs = tabledefs[dataKey];
                            table.id = index;
                            configuredTables.push(table);
                        }
                    });
                }
                if (configuredTables.length < 1) {
                    app.showMessage(config.noResultsMessage.message, config.noResultsMessage.title).then(function (dialogResult) {
                        router.navigate('queryconfig');
                    });
                    return;
                }
                this.configuredTables(configuredTables);

            },

            bindingComplete: function () {
                $("#tabs").show();

                $("#tabs").tabs({
                    "activate": function (event, ui) {
                        var table = $.fn.dataTable.fnTables(true);
                        if (table.length > 0) {
                            $(table).dataTable().fnAdjustColumnSizing();
                        }
                    }
                });

                $(this.configuredTables()).each(function (index, table) {

                    $('#' + table.id + '_table').dataTable({
                        "sScrollY": "600px",
                        "aoColumnDefs": [
                            { "sWidth": "10%", "aTargets": [ -1 ] }
                        ],
                        "data": table.data,
                        "columns": table.columnDefs
                    });
                });


                $("#tabs").tabs({ active: 0 });

            },

            showWarning: function (message) {
                $("#div-dialog-warning-message").html(message)
                $("#div-dialog-warning").dialog({
                    buttons: {
                        "Ok": function () {
                            $(this).dialog("close");
                        }
                    },
                    dialogClass: "error",
                    modal: true,
                    resizable: false,
                    title: 'Error'
                });
            },
        };
    });