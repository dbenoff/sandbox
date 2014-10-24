define(['plugins/http', 'durandal/app', 'knockout', 'jstree', 'bootstrap', 'jquery-ui', '../config/config', '../config/appstate', 'plugins/router', '../definitions/tabledefs'],
    function (http, app, ko, jstree, bootstrap, jqueryui, config, appstate, router, tabledefs) {

        return {
            displayName: 'Query Configuration',
            geographicTypes: [
                {name: "Regions", value: "Region"},
                {name: 'Assembly Districts', value: "HouseDistrict"}
            ],
            queries: [
                {name: "Assets", value: "Assets"},
            ],
            geoTreeNodes: null,
            selectedQuery: ko.observable(),
            selectedGeographicType: ko.observable(),
            selectedGeographicTypeDisplay: ko.observable(),
            useGeographicFilter: ko.observable(),
            geoFilters: ko.observableArray([]),
            assetTypes: ko.observableArray([]),
            useAssetFilter: ko.observable(),
            assetFilters: ko.observableArray([]),
            assetTreeNodes: ko.observableArray([]),

            resetObservables: function () {
                this.selectedQuery(null);
                this.selectedGeographicType(null);
                this.useGeographicFilter(null);
                this.geoFilters([]);
                this.useAssetFilter(null);
                this.assetFilters([]);
            },


            activate: function () {

                if(this.assetTreeNodes().length > 0){
                    this.resetObservables();
                    return;
                }

                this.areaTree = {};
                this.assetTree = {};

                var that = this;

                //returning a promise, rendering pauses until promise completes
                return $.when(
                    $.ajax({
                        url: config.districtQueryUrl,
                        jsonp: "callback",
                        dataType: "jsonp",
                        success: function (response) {
                            that.areaTree['Assembly Districts'] = response.AreaList;
                        }
                    }),

                    $.ajax({
                        url: config.regionQueryUrl,
                        jsonp: "callback",
                        dataType: "jsonp",
                        success: function (response) {
                            that.areaTree['Regions'] = response.AreaList;
                        }
                    }),

                    $.ajax({
                        url: config.functionalClassQueryUrl,
                        jsonp: "callback",
                        dataType: "jsonp",
                        success: function (response) {
                            var bridges = {};
                            var roads = {};
                            roads['types'] = response.FilterList;
                            bridges['types'] = response.FilterList;
                            that.assetTree['Road Assets'] = roads;
                            that.assetTree['Bridge Assets'] = bridges;
                        }
                    })
                ).then(function () {
                        var geoTreeNodes = [];
                        $(Object.getOwnPropertyNames(that.areaTree)).each(function () {
                            var geoTypeName = this;
                            var geoTreeNode = {};
                            geoTreeNode.children = [];
                            geoTreeNode.text = 'All ' + geoTypeName;
                            geoTreeNode.a_attr = {'selectionId': geoTypeName},
                            geoTreeNode.state = { 'opened': true, 'selected': false };
                            geoTreeNode.selectionId = geoTypeName,
                                that.geoTreeNode = geoTreeNode;
                            $(that.areaTree[this]).each(function (index, childElement) {
                                var child = {};
                                child.text = childElement.Name;
                                geoTreeNode.selectionId = childElement.Value,
                                child.a_attr = {'selectionId': childElement.Value},
                                child.state = { 'opened': false, 'selected': false };
                                child.parentId = that.geoTreeNode.text;
                                child.selectionId = childElement.Value;
                                that.geoTreeNode.children.push(child);
                            });
                            geoTreeNodes.push(geoTreeNode);
                        });
                        that.geoTreeNodes = geoTreeNodes;

                        var assetTreeNodes = [];
                        $(Object.getOwnPropertyNames(that.assetTree)).each(function () {
                            var assetTypeName = this;
                            var assetTreeNode = that.assetTree[this];
                            assetTreeNode.children = [];
                            assetTreeNode.text = assetTypeName;
                            assetTreeNode.a_attr = {'selectionId': assetTypeName},
                            assetTreeNode.selectionId = assetTypeName,
                            assetTreeNode.state = { 'opened': false, 'selected': false };
                            that.assetTreeNode = assetTreeNode;
                            $(assetTreeNode.types).each(function (index, childElement) {
                                var child = {};
                                child.text = childElement.Name;
                                child.a_attr = {'selectionId': childElement.Value},
                                child.state = { 'opened': false, 'selected': false };
                                child.parentId = that.assetTreeNode.selectionId;
                                child.selectionId = childElement.Value;
                                that.assetTreeNode.children.push(child);
                            });
                            assetTreeNodes.push(assetTreeNode);
                        });
                        that.assetTreeNodes(assetTreeNodes);
                    });
            },

            bindingComplete: function () {

                var that = this;

                $('#assetTree').jstree({'plugins': ["checkbox"], 'core': {
                    'data': that.assetTreeNodes()
                }}).on('changed.jstree', function (e, data) {
                    that.updateAssetSelection(e, data)
                });

                this.selectedQuery.subscribe(function (newValue) {
                    that.selectedGeographicType(null);
                    that.useGeographicFilter(null);
                    that.geoFilters([]);
                    that.useAssetFilter(null);
                    that.assetFilters([]);
                });

                this.selectedGeographicType.subscribe(function (newValue) {
                    that.populateGeoTree(newValue);
                });

                this.useGeographicFilter.subscribe(function (newValue) {
                    if (newValue) {
                        $("#geoTree").jstree("uncheck_all", true);
                    }
                });

                this.useAssetFilter.subscribe(function (newValue) {
                    var oldValue = that.useAssetFilter();
                    if (oldValue) {
                        $("#assetTree").jstree("uncheck_all", true);
                    }
                }, null, "beforeChange");
            },

            populateGeoTree: function(newValue){
                $('#geoTree').jstree("destroy");

                if(newValue == undefined){
                    this.selectedGeographicTypeDisplay(null);
                }else{
                    var geoTypeName;
                    $(this.geographicTypes).each(function (index, type) {
                        if (type.value == newValue) {
                            geoTypeName = type.name;
                        }
                    });

                    this.selectedGeographicTypeDisplay(geoTypeName);

                    var geoTreeData = [];
                    $(this.geoTreeNodes).each(function (index, node) {
                        if (node.text.indexOf(geoTypeName) > -1) {
                            geoTreeData.push(node);
                        }
                    });

                    var that = this;
                    $('#geoTree').jstree({'plugins': ["checkbox"], 'core': {
                        'data': geoTreeData
                    }}).on('changed.jstree', function (e, data) {
                        that.updateGeoSelection(e, data)
                    });
                }
            },

            updateGeoSelection: function (e, data) {
                this.values = $("#geoTree").jstree("get_checked", {full: true}, true);
                if (this.values.length > 0) {
                    var that = this;
                    $(this.values).each(function (index, node) {
                        if (!node.original.parentId) {
                            that.values.length = 0;
                            that.values.push(node);
                            return true;
                        }
                    });
                    this.geoFilters(this.values);
                } else {
                    this.geoFilters([]);
                }
            },

            updateAssetSelection: function (e, data) {
                this.values = $("#assetTree").jstree("get_checked", {full: true}, true);
                //if a root node is checked, the child nodes are all included in the values array along with the parent
                if (this.values.length > 0) {
                    this.parentNodeIds = [];
                    this.filteredValues = [];
                    var that = this;
                    $(this.values).each(function (index, node) {
                        if (!node.original.parentId) {
                            that.parentNodeIds.push(node.original.text);
                            that.filteredValues.push(node); //this is a root, it has no parent id
                        }
                    });

                    $(this.values).each(function (index, node) {
                        if (node.original.parentId) {
                            if (that.parentNodeIds.indexOf(node.original.parentId) == -1) {
                                that.filteredValues.push(node); //this is a child, and the root wasn't selected, so include it
                            }
                        }
                    });
                    this.assetFilters(this.filteredValues);
                } else {
                    this.assetFilters([]);
                }
            },

            executeQuery: function () {


                var selectedGeographicType = this.selectedGeographicType();
                var useGeographicFilter = this.useGeographicFilter();
                var geoFilters = this.geoFilters();
                var useAssetFilter = this.useAssetFilter();
                var assetFilters = this.assetFilters();

                var geoParameter = {};
                geoParameter.Name = 'Jurisdictions';
                geoParameter.Selected = true;
                geoParameter.AreaParameter = {};
                geoParameter.AreaParameter.Type = selectedGeographicType;
                geoParameter.FilterParameters = [];

                //only filter by geography if the user selected to use a filter AND the geo selection is not the 'All' option
                var geoValuesToSubmit = [];
                if (useGeographicFilter == "true" && (geoFilters.length > 1 || geoFilters[0].original.parentId)) {
                    //user selected to filter by geo AND didn't select the 'All' option
                    geoValuesToSubmit = $.map(geoFilters, function (geoFilter, index) {
                        return {Value: geoFilter.original.selectionId, Name: geoFilter.original.text};
                    });
                } else {
                    //send all the child IDs of whatever Geo Type was selected;
                    geoValuesToSubmit = $.map(this.geoTreeNode.children, function (child, index) {
                        return {Value: child.selectionId, Name: child.text};
                    });
                }

                geoParameter.AreaParameter.Areas = geoValuesToSubmit;

                var bridgeAssetValuesToSubmit = [];
                var roadAssetValuesToSubmit = [];
                if (useAssetFilter == "true") {
                    var that = this;
                    $(assetFilters).each(function (index, node) {
                        if (node.original.parentId) {
                            var assetFilterNode = {Value: node.original.selectionId, Name: node.original.text};
                            if (node.original.parentId.indexOf('Road') > -1) {
                                roadAssetValuesToSubmit.push(assetFilterNode);  //node is a child of All Roads
                            } else {
                                bridgeAssetValuesToSubmit.push(assetFilterNode);  //node is a child of All Bridges
                            }
                        } else {
                            if (node.text.indexOf('Road') > -1) {
                                //All Roads, include all discrete values
                                roadAssetValuesToSubmit = node.original.types;
                            }
                            if (node.text.indexOf('Bridge') > -1) {
                                //All Bridges, include all discrete values
                                bridgeAssetValuesToSubmit = node.original.types;
                            }
                        }
                    });
                } else {
                    //not using any filter, include all discrete values for all asset types
                    $(this.assetTreeNodes()).each(function (index, node) {
                        if (node.text.indexOf('Road') > -1) {
                            roadAssetValuesToSubmit = $.map(node.children, function (child, index) {
                                return {Value: child.selectionId, Name: child.text};
                            });
                        }
                        if (node.text.indexOf('Bridge') > -1) {
                            bridgeAssetValuesToSubmit = $.map(node.children, function (child, index) {
                                return {Value: child.selectionId, Name: child.text};
                            });
                        }
                    });
                }

                var query = $.parseJSON('{"Query":{"DisplayParameters":[],"Selection":1}}');
                query.Query.DisplayParameters = [];
                query.Query.DisplayParameters.push(geoParameter);

                if (bridgeAssetValuesToSubmit.length > 0) {
                    var bridgeParameter = {};
                    bridgeParameter.Name = 'Bridges';
                    bridgeParameter.Selected = true;
                    bridgeParameter.AreaParameter = null;
                    bridgeParameter.FilterParameters = [];
                    bridgeParameter.FilterParameters.push({Type: "FunctionalClass", Description: "Class", Filters: bridgeAssetValuesToSubmit});
                    query.Query.DisplayParameters.push(bridgeParameter);
                }

                if (roadAssetValuesToSubmit.length > 0) {
                    var roadParameter = {};
                    roadParameter.Name = 'Roads';
                    roadParameter.Selected = true;
                    roadParameter.AreaParameter = null;
                    roadParameter.FilterParameters = [];
                    roadParameter.FilterParameters.push({Type: "FunctionalClass", Description: "Class", Filters: roadAssetValuesToSubmit});
                    query.Query.DisplayParameters.push(roadParameter);
                }

                var postBody = {};
                postBody.serializedQueryParameters = JSON.stringify(query);
                var that = this;
                appstate.querydescription = this.createQueryDescription();
               /* $.ajax({
                    type: "POST",
                    crossDomain: true,
                    url: config.runQueryUrl,
                    data: postBody,
                    beforeSend: function () {
                        $('#modal').show();
                    },
                    complete: function () {
                        $('#modal').hide();
                    },
                    success: function (data) {
                        that.validateResponse();
                        appstate.queryName = 'Assets';
                        appstate.queryResults = $.parseJSON(data);
                    },
                    error: function (data) {
                        console.log('error');
                    }

                });*/

            },

            validateResponse: function () {
                var tabledef = tabledefs[appstate.queryName];
                var hasResults = false;
                $(tabledef.dataKeys).each(function () {
                    if (appstate.queryResults[this] && appstate.queryResults[this].length > 0) {
                        hasResults = true;
                        return false; //break
                    }
                })
                if (hasResults == false) {
                    this.showWarning('Your query returned no data.  Modify your query parameters and try again.');
                } else {
                    router.navigate('queryresults');
                }
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

            createQueryDescription: function(){
                var queryDescription = {};
                queryDescription.queryName = this.selectedQuery();
                queryDescription.criteria = [];
                queryDescription.criteria.push({name: "Geographic Definition", value: this.selectedGeographicTypeDisplay()});
                queryDescription.criteria.push({name: "Geographic Filter",
                    value: this.useGeographicFilter() == 'false' ? "None" :
                        $.map(this.geoFilters(), function (filter) {
                            return filter.text;
                        }).join(", ")
                });
                queryDescription.criteria.push({name: "Asset Filter",
                    value: this.useAssetFilter() == 'false' ? "None" :
                        $.map(this.assetFilters(), function (filter) {
                            return filter.text;
                        }).join(", ")
                });
            }
        };
    });