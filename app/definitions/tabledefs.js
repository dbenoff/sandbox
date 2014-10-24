define(
    function () {
        return {
            'Assets': {
                tabs: ['Roads', 'Bridges'],
                dataKeys: ['RouteFeatureResults', 'BridgeFeatureResults'],
            },


            BridgeFeatureResults: [
                { title: 'Bridge Name', data: 'BridgeName'},
                { title: 'CDS', data: 'RouteId'},
                { title: 'Name', data: 'RouteName'},
                { title: 'Class', data: 'FunctionalClass'},
                { title: 'Lanes', data: 'NumberOfLanes'},
                { title: 'Jurisdiction', data: 'Jurisdiction'},
                { title: 'Begin Mile', data: 'FromMP', format: '0,000.0000'},
                { title: 'End Mile', data: 'ToMP', format: '0,000.0000'},
                { title: 'Length', data: 'Length', format: '0,000.0000'}
                /* TODO: May add these back for later queries.
                 { title: 'Owner (Maintenance)', data: 'MaintenanceResponsibility'},
                 { title: 'AADT', data: 'AADT'},
                 { title: 'Year Built', data: 'YearBuilt'}*/
            ],

            RouteFeatureResults: [
                { title: 'CDS', data: 'RouteId'},
                { title: 'Name', data: 'RouteName'},
                { title: 'Class', data: 'FunctionalClass'},
                { title: 'Lanes', data: 'NumberOfLanes'},
                { title: 'Jurisdiction', data: 'Jurisdiction'},
                { title: 'Begin Mile', data: 'FromMP', format: '0,000.0000'},
                { title: 'End Mile', data: 'ToMP', format: '0,000.0000'},
                { title: 'Length', data: 'Length', format: '0,000.0000'}
                /* TODO: May add these back for later queries.
                 { title: 'Pavement Condition', data: 'PavementCondition'},
                 { title: 'Owner (Maintenance)', data: 'MaintenanceResponsibility'},
                 { title: 'Owner (Management)', data: 'ManagementResponsibility'},
                 { title: 'Traffic Direction', data: 'TrafficDirection'},
                 { title: 'Speed', data: 'Speed'},
                 { title: 'AADT', data: 'AADT'},
                 { title: 'Facility Type', data: 'FacilityType'}*/
            ],

        };
    });
