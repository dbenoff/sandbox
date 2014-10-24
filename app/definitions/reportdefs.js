define(
    function () {
        return {
            'Assets': {
                type: 'bar',
                headers: ['Jurisdiction', 'Functional Class', 'Miles', 'Lane Miles'],
                fields: ['Jurisdiction', 'FunctionalClass', 'Length', 'LaneMiles'],
                levels: ['Jurisdiction', 'FunctionalClass'],
                sums: ['Length', 'LaneMiles'],
                averages: [],
                tabs: ['Roads', 'Bridges'],
                dataKeys: ['RouteFeatureResults', 'BridgeFeatureResults'],
                graphMetrics: [
                    {name: "Miles", value: "Length"},
                    {name: 'Lane Miles', value: "LaneMiles"}
                ],
                levelOrders: [
                    {name: "By Jurisdiction, then by Class", value: ['Jurisdiction', 'FunctionalClass']},
                    {name: "By Class, then by Jurisdiction", value: ['FunctionalClass', 'Jurisdiction']}
                ]
            }
        };
    });
