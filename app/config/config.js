define(
    function () {
        return {
            regionQueryUrl: 'http://swdev34/ArcGIS/rest/services/AKDOT/test/MapServer/exts/RouteEventOverlaySOE/GetGeogAreaValues?AreaType=Region&f=pjson',
            districtQueryUrl: 'http://swdev34/ArcGIS/rest/services/AKDOT/test/MapServer/exts/RouteEventOverlaySOE/GetGeogAreaValues?AreaType=HouseDistrict&f=pjson',
            functionalClassQueryUrl: 'http://swdev34/ArcGIS/rest/services/AKDOT/test/MapServer/exts/RouteEventOverlaySOE/GetFilterValues?FilterType=FunctionalClass&f=pjson',
            runQueryUrl: 'http://swdev14.camsys.com/tamisPilotQA/web/Query.aspx/RunQuery',
            noResultsMessage:{title: "Whoops!", message: "No data is available for display yet, run a query first."}
        };
    });
