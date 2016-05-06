function show_places_html(){
    str='<table style="font-size:11px"><tr>';
    str+='<th>Distance</th>';
    str+='<th>Type</th>';
    str+='<th>Objet</th>';
    str+='</tr>';
    for (var i in places_nearby){
        n=places_nearby[i];
        s_str="<tr>";
        s_str+='<td>'+n.distance + "</td>";
        if (n.embedded_type=="poi") {
            s_str+='<td>'+n.poi.poi_type.name + "</td>";
        } else {
            s_str+='<td>'+n.embedded_type + "</td>";
        }
        s_str+='<td>'+n.name + "</td>";
        s_str+="</tr>\n";
        str+=s_str;
    }
    str+="</table>";
    document.getElementById("places_div").innerHTML=str;
}

function show_places_on_map(){
    newBounds=[];
    for (var i in places_nearby){
        n=places_nearby[i];
        coord=eval("n."+n.embedded_type+".coord");
        n.marker = L.marker([coord.lat, coord.lon]).addTo(map);
        lamb=WGS_ED50(coord.lon, coord.lat);
        n.marker.bindPopup("<b>"+n.name+"</b>"+
            "<br />Id: "+n.id+
            "<br />LatLon wgs84: "+coord.lat + ", "+ coord.lon+
            "<br />LatLon l2E: "+lamb[0] + ", "+ lamb[1]
        );
        map.addLayer(n.marker);
        if (i==0) { map.setView([coord.lat, coord.lon]);}

        newBounds.push([coord.lat, coord.lon]);
    }
    if (newBounds) {map.fitBounds(newBounds)};
}

function getPlacesNearby(uri, distance){
        url="coverage/"+coverage+"/"+this.uri.split(":")[0]+"s/"+this.uri+"/places_nearby/";
        url += "?distance="+this.distance;
        url += "&count=1000";
        for (obj in this.object_types) {
            url += "&type[]=" + this.object_types[obj];
        }
        callNavitiaJS(ws_name, url, '', function(response){
            if (response.places_nearby) {
                places_nearby = response.places_nearby;
                show_places_html();
                show_places_on_map();
            }
        });

}

function places_nearby_onLoad(){
    menu.show_menu("menu_div");
    t = extractUrlParams();

    document.getElementById("point_name").value = (t["point_name"])?t["point_name"]:"";
    document.getElementById("point_id").value = (t["point_id"])?t["point_id"]:"";
    uri = document.getElementById("point_id").value;
    distance = (t["distance"])?t["distance"]:"500";
    if (uri) {
        getPlacesNearby(uri, distance);
    }
    // add an OpenStreetMap tile layer
     map = L.map('map-canvas').setView([48.837212, 2.413], 8);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    L.control.scale().addTo(map);
 }

$(document).ready(function(){
    $( "#point_name" ).autocomplete({
        source: getAutoComplete,
        minLength: 3,
        select: function(event, ui){
            document.getElementById("point_id").value = ui.item.id;
        }
   });
});

var selected = null;
var map;
var popup = L.popup();
var places_nearby = null;
