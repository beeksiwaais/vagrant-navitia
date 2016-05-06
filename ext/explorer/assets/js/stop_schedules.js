function stop_schedules(){
    this.stop_area_id="",
    this.stop_point_id="",
    this.from_date_time="20141014T110000",
    this.line_geojson=false,
    this.schedules=false,
    this.show_schedule_on_map=function(schedule, map){
        for (var i in schedule.table.headers){
            item=schedule.table.headers[i];
        }
    }
}


function getStopSchedules(){
    forbidden_id=["physical_mode:RapidTransit", "physical_mode:LocalTrain", "physical_mode:LongDistanceTrain", "physical_mode:Train"]
    if (t["stop_area_id"] || t["stop_point_id"]) {
        if (this.stop_area_id != "") {
            url="coverage/"+coverage+"/stop_areas/"+t["stop_area_id"]+"/stop_schedules/";
        } else {
            url="coverage/"+coverage+"/stop_points/"+t["stop_point_id"]+"/stop_schedules/";
        }
        url += "?from_date_time=" + natural_str_to_iso(
            document.getElementById("date").value, 
            document.getElementById("heure").value);
        //url += "&count="+"10";
        for (forbid in forbidden_id) {
            url += "&forbidden_id[]=" + forbidden_id[forbid];
        }
        callNavitiaJS(ws_name, url, '', function(response){
            if (response.stop_schedules) {
                schedules = response.stop_schedules; 
                show_schedules_html();
            }
        });
    }
}

function show_schedules_html(){
    str = "";
    str+= "<table>";
    str+="<tr><th>Ligne</th>";
    for (var i in schedules){
        item=schedules[i];
        str+="<td>";
        str+=item.route.line.network.name;
        str+= " " + "<span tooltip='tooltip"+i+"' class='icon-ligne' style='background-color: #"+item.route.line.color+";'>"+item.route.line.code + "</span>";
        //on ajoute un div qui contient les infos complémentaires
        str+= "<div id='tooltip"+i+"' style='display:none;'>";
        str+= "stop_point : " + item.stop_point.id + " " + item.stop_point.name ;
        str+= "<br>";
        str+= "route : " + item.route.id + " " + item.route.name ;
        str+= "<br>";
        str+= "direction : " + eval("item.route.direction." + item.route.direction.embedded_type +".id") + " " + eval("item.route.direction." + item.route.direction.embedded_type +".name") ;
        str+= "<br>";
        str+= "commercial_mode : " + item.route.line.commercial_mode.id + " " + item.route.line.commercial_mode.name ;
        str+= "<br>";
        str+= "</div>";
        str+="</td>";
    }
    str+="</tr>";
    str+="<tr><th valign='top'>horaires</th>";
    for (var i in schedules){
        item=schedules[i];
        horaires=""
        for (j in item.date_times){
            d=item.date_times[j].date_time;
            //console.log(d);
            d=IsoToJsDate(d);
            horaires += formatDate(d, "hh:nn") + "<br>";
        }
        str+="<td  valign='top'>"+horaires+"</td>";
    }
    str+="</tr>";

    str+="</table>";
    document.getElementById("stop_schedules_div").innerHTML=str;
}

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("LatLon : " + e.latlng.lat + ", "+e.latlng.lng)
        .openOn(map);
}



function getStopSchedule(){
    if (t["stop_point_id"]){
        url="coverage/"+coverage+"/stop_points/"+t["stop_point_id"]+"/stop_schedules/";
    } else {
        url="coverage/"+coverage+"/stop_areas/"+t["stop_area_id"]+"/stop_schedules/";
    }
    url+="?from_datetime=" + natural_str_to_iso(
        document.getElementById("date").value, 
        document.getElementById("heure").value);
    callNavitia(ws_name, url, function(response){
        if (response.route_schedules) {
            schedules = response.stop_schedules; 
            show_schedules_html();
        }
    });
}


function stop_schedules_onLoad(){
    menu.show_menu("menu_div");
    t=extractUrlParams();
    init_date();
    
    document.getElementById("stop_area_name").value = (t["stop_area_name"])?t["stop_area_name"]:"";
    document.getElementById("stop_area_id").value = (t["stop_area_id"])?t["stop_area_id"]:"";
    document.getElementById("stop_point_name").value = (t["stop_point_name"])?t["stop_point_name"]:"";
    document.getElementById("stop_point_id").value = (t["stop_point_id"])?t["stop_point_id"]:"";
    if (t["date"]) { document.getElementById("date").value=decodeURIComponent(t["date"]);}
    if (t["heure"]) { document.getElementById("heure").value=decodeURIComponent(t["heure"]);}
    getStopSchedules();

    // add an OpenStreetMap tile layer
    map = L.map('map-canvas').setView([48.837212, 2.413], 8);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    map.on('click', onMapClick);
}
 
function init_date(sdate, sheure){
    r_date=""
    d= new Date()
    if (!sdate || sdate==""){
        if (d.getDate()<10) { r_date+= "0"}
        r_date+= d.getDate()+"/";
        if (d.getMonth()<9) { r_date+= "0"}
        r_date+= (d.getMonth()+1)+"/";
        r_date+= d.getFullYear()
    } else {r_date=sdate;}
    document.getElementById("date").value=r_date;

    r_heure=""
    if (!sheure || sheure==""){
        h=d.getHours();
        m=d.getMinutes();
        r_heure+= (h<10)?"0"+h:h;
        r_heure+= "h";
        r_heure+= (m<10)?"0"+m:m;
        //r_heure+= "00";
    } else {r_heure=sheure;}
    document.getElementById("heure").value=r_heure;
}


$(document).ready(function(){
    $( "#stop_area_name" ).autocomplete({
        source: getAutoComplete_StopArea,
        minLength: 3,
        select: function(event, ui){
            document.getElementById("stop_area_id").value = ui.item.id;
        }
   });
   
    $( document ).tooltip({
        items: "span",
        content: function() {
            var element = $( this );
            if ( element.is( "[tooltip]" ) ) {
                var tooltip = element.attr( "tooltip" );
                return $( "#"+tooltip ).html();
            }
        }
    });   
});


var selected = null;
var map;
var popup = L.popup();
var schedules;
