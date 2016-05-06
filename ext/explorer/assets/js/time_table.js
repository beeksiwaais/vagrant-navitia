function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("LatLon : " + e.latlng.lat + ", "+e.latlng.lng)
        .openOn(map);
}

function getNetworkSelect(){
    callNavitiaJS(ws_name, 'coverage/'+t["coverage"]+'/networks/?count=1000', '', function(response){
        first_id = "";
        selected_exists = false;
        var str="<select name='network_id' id='network_id' onchange='document.forms[0].submit()'>"
        for (var n in response.networks) {
            var network = response.networks[n];
            if (first_id == "") {first_id = network.id;}
            selected = "";
            if ((t["network_id"]) && (t["network_id"]==network.id)) {
                selected_exists = true;
                selected = " selected ";
            }
            str+= "<option " + selected+ " value='"+network.id+"'>" + network.name + "</option>";
        }
        str+="</select>";
        document.getElementById("network_div").innerHTML=str;
        if ( (!t["network_id"]) || (!selected_exists) ){
            //si aucun réseau selectionné : on prend le 1er et on relance la selection de la ligne
            t["network_id"] = first_id;
        }
        getLineSelect();
    });
}

function getLineSelect(){
    if (t["network_id"]) {
        first_id = "";
        selected_exists = false;
        callNavitiaJS(ws_name, 'coverage/'+t["coverage"]+'/networks/'+t["network_id"]+'/lines/?count=1000', '', 
            function(response){
                var str="<select name='line_id' id='line_id' onchange='document.forms[0].submit()'>"
                for (var n in response.lines) {
                    var line = response.lines[n];
                    if (first_id == "") {first_id = line.id;}
                    selected = "";
                    if ((t["line_id"]) && (t["line_id"]==line.id)) {
                        selected_exists = true;
                        selected = " selected ";
                    }
                    str+= "<option " + selected+ " value='"+line.id+"'>" + line.code + ' - ' + line.name + "</option>";
                }
                str+="</select>";
                document.getElementById("line_div").innerHTML=str;
                if ( (!t["line_id"]) || (!selected_exists) ){
                    t["line_id"] = first_id;
                }
                getRouteSelect();
            }
        );
    }
}

function getRouteSelect(){
    if (t["network_id"]) {
        first_id = "";
        selected_exists = false;
        callNavitiaJS(ws_name, 'coverage/'+t["coverage"]+'/networks/'+t["network_id"]+'/lines/'+t["line_id"]+'/routes/?count=1000', '', 
            function(response){
                var str="<select name='route_id' id='route_id' onchange='document.forms[0].submit()'>"
                for (var n in response.routes) {
                    var route = response.routes[n];
                    if (first_id == "") {first_id = route.id;}
                    selected = "";
                    if ((t["route_id"]) && (t["route_id"]==route.id)) {
                        selected_exists = true;
                        selected = " selected ";
                    }
                    str+= "<option " + selected+ " value='"+route.id+"'>" + route.name + "</option>";
                }
                str+="</select>";
                document.getElementById("route_div").innerHTML=str;
                if ( (!t["route_id"]) || (!selected_exists) ){
                    t["route_id"] = first_id;
                }
                getStopPointSelect();
            }
        );
    }
}

function getStopPointSelect(){
    first_id = "";
    selected_exists = false;
    callNavitiaJS(ws_name, 'coverage/'+t["coverage"]+'/networks/'+t["network_id"]+'/lines/'+t["line_id"]+'/routes/'+t["route_id"]+'/stop_points/?count=1000', '', 
        function(response){
            var str="<select name='stop_point_id' id='stop_point_id' onchange='document.forms[0].submit()'>"
            for (var n in response.stop_points) {
                var stop_point = response.stop_points[n];
                if (first_id == "") {first_id = stop_point.id;}
                selected = "";
                if ((t["stop_point_id"]) && (t["stop_point_id"]==stop_point.id)) {
                    selected_exists = true;
                    selected = " selected ";
                }
                str+= "<option " + selected+ " value='"+stop_point.id+"'>" + stop_point.name + "</option>";
            }
            str+="</select>";
            document.getElementById("stop_point_div").innerHTML=str;
            if ( (!t["stop_point_id"]) || (!selected_exists) ){
                t["stop_point_id"] = first_id;
            }
            getCalendarsSelect();
        }
    );
}

function getVehicleJourneySelect(){
    selected_exists = false;
    callNavitiaJS(ws_name, 'coverage/'+t["coverage"]+'/networks/'+t["network_id"]+'/lines/'+t["line_id"]+'/routes/'+t["route_id"]+'/stop_points/'+t["stop_point_id"]+'/vehicle_journeys/?count=1000', '', 
        function(response){
            var str="<select name='vehicle_journey_id' id='vehicle_journey_id' onchange='document.forms[0].submit()'>"
            str+= "<option value=''>--- choisir une circulation pour débugger ---</option>";
            for (var n in response.vehicle_journeys) {
                var vehicle_journey = response.vehicle_journeys[n];
                selected = "";
                if ((t["vehicle_journey_id"]) && (t["vehicle_journey_id"]==vehicle_journey.id)) {
                    selected_exists = true;
                    selected = " selected ";
                    selected_vehicle_journey = vehicle_journey;
                }
                str+= "<option " + selected+ " value='"+vehicle_journey.id+"'>" + "id : " + vehicle_journey.id + ' // name : ' + vehicle_journey.name + "</option>";
            }
            str+="</select>";
            document.getElementById("vehicle_journey_div").innerHTML=str;
            if (selected_vehicle_journey)
                showDebugInfos();
        }
    );
}

function showDebugInfos(){
    str = "";
    str += "<H4>Debug</H4>";
    str += "<table>";
    str += "<tr>";
    str += "<th>TT Calendar</th>";
    str += "<th>VJ Calendar</th>";
    str += "</tr>";
    str += "<tr>";
    str += "<td>" + calendar_to_str(selected_calendar) + "</td>";
    str += "<td>" + calendar_to_str(selected_vehicle_journey.calendars[0]) + "</td>";
    str += "</tr>";
    document.getElementById("debug_div").innerHTML=str;
}

function getCalendarsSelect(){
    if (t["network_id"]) {
        first_id = "";
        selected_exists = false;
        callNavitiaJS(ws_name, 'coverage/'+t["coverage"]+'/networks/'+t["network_id"]+'/lines/'+t["line_id"]+'/routes/'+t["route_id"]+'/stop_points/'+t["stop_point_id"]+'/calendars/?count=1000', '', 
            function(response){
                var str="";
                if (response.error) {
                    str = "<input type='text' value='" + response.error.message + "' disabled>" 
                } else {
                    str="<select name='calendar_id' id='calendar_id' onchange='document.forms[0].submit()'>"
                    for (var n in response.calendars) {
                        var calendar = response.calendars[n];
                        if (first_id == "") {
                            first_id = calendar.id;
                            selected_calendar = calendar;
                        }
                        selected = "";
                        if ((t["calendar_id"]) && (t["calendar_id"] == calendar.id)) {
                            selected_exists = true;
                            selected = " selected ";
                            selected_calendar = calendar;
                        }
                        str+= "<option " + selected+ " value='"+calendar.id+"'>" + calendar.name + "</option>";
                    }
                    str+="</select>";
                }
                if ( (!t["calendar_id"]) || (!selected_exists) ){
                    t["calendar_id"] = first_id;
                }
                document.getElementById("calendar_div").innerHTML=str;
                getVehicleJourneySelect();
                getCalendarsHtml()
            }
        );
    }
}

function getCalendarsHtml(){
    if (t["calendar_id"]) {
        duration = 24*3600;
        //dans le from_date_time, seule l'heure est utilisée et fixée à 4h du matin. A voir s'il y a besoin de le rendre paramétrable  plus tard 
        callNavitiaJS(ws_name, 'coverage/'+t["coverage"]+'/networks/'+t["network_id"]+'/lines/'+t["line_id"]+'/routes/'+t["route_id"]+'/stop_points/'+t["stop_point_id"]+'/stop_schedules/?from_datetime=20160122T040000&duration='+ duration + '&calendar='+t["calendar_id"]+'&show_codes=true', '', 
            function(response){
                if (response.stop_schedules) {
                    schedules = response.stop_schedules; //1 seule grille sur un point d'arrêt
                    show_schedules_html();
                }
            }
        );
    }
}


function show_schedules_html(){
    hour_tab = [];
    for (var i in schedules){
        item=schedules[i];
        horaires=""
        for (j in item.date_times){
            d=item.date_times[j].date_time;
            h_str = d.substring(0,2);
            h_int = parseInt(h_str)
            if (!hour_tab[h_int]) {
                 hour_tab[h_int] = [];
                 hour_tab[h_int]["hour"] = h_str;
                 hour_tab[h_int]["minutes"] = [];
            }
            hour_tab[h_int]["minutes"].push(d.substring(2,4));
        }
    }
    hour_tab.sort();

    str = "";
    str += "<H4>horaires</H4>";
    str += "<table>";
    str += "<tr>";
    str += "<td>Heure</td><td>minutes</td>";
    str += "</tr>";
    for (var i in hour_tab){
        str += "<tr>";
        h = hour_tab[i];
        str+="<td  valign='top'>"+h["hour"]+"</td>";
        str+="<td  valign='top'>";
        for (j in h["minutes"]){
            m = h["minutes"][j];
            str+= m + "&nbsp;";
        }
        str+="</td>";
        str+="</tr>";
    }

    str+="</table>";
    document.getElementById("stop_schedules_div").innerHTML=str;
}

function time_table_onLoad(){
    menu.show_menu("menu_div");
    t=extractUrlParams();

    getNetworkSelect(); 

    map = L.map('map-canvas').setView([48.837212, 2.413], 8);
    // add an OpenStreetMap tile layer
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    map.on('click', onMapClick);

}

var schedules = null;
var selected = null;
var selected_calendar = null;
var selected_vehicle_journey = null;
var map;
var popup = L.popup();
var t;
var schedule;

