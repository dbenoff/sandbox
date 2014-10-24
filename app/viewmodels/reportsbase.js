define(['plugins/http', 'durandal/app', 'knockout'],
    function (http, app, ko) {
        return {
            buildHierarchy: function (records, reportRequest) {
                records = this.processTree(records, 0, reportRequest.levels, reportRequest.sums, reportRequest.averages);
                return records;
            },


            processTree: function (records, depth, levels, sums, averages) {
                var field = levels[depth];
                var keys = {};
                $.each(records, function (key, rec) {
                    key = rec[field];
                    keys[key] = key;
                });
                var aggs = [];
                var keys = Object.keys(keys);
                keys.sort();

                $.each(keys, function (index, key) {
                    var node = [];
                    node.level = field;
                    node.text = key;
                    node.children = [];
                    $.each(records, function (index, rec) {
                        if (rec[field] == key) {
                            $.each(sums, function (index, sum) {
                                if (!node[sum]) {
                                    node[sum] = 0;
                                }
                                node[sum] = node[sum] + rec[sum];
                            });
                            $.each(averages, function (index, average) {
                                if (!node[average]) {
                                    node[average] = 0;
                                }
                                if (rec[average]) {
                                    node[average] = node[average] + rec[average];
                                }
                            });
                            node.children.push(rec);
                        }
                    });
                    aggs.push(node);
                });
                $.each(aggs, function (index, agg) {
                    for (var fieldName in agg) {
                        if (averages.indexOf(fieldName) > -1) {
                            agg[fieldName] = agg[fieldName] / agg.children.length;
                        }
                    }
                });

                var that = this;
                $.each(aggs, function (index, agg) {
                    if (levels.length > depth + 1) {
                        agg.children = that.processTree(agg.children, depth + 1, levels, sums, averages);
                        $.each(agg.children, function (index, child) {
                            child.parent = agg;
                        });
                    }
                });

                return aggs;

            }
        }
    });
