
var menu={
    page_list:[
        {
            name:"coverage",
            title:"Coverage"
        },
        {
            name:"tyr",
            title:"Tyr"
        },
        {
            name:"places",
            title:"Places"
        },
        {
            name:"journey",
            title:"itinéraire"
        },
        {
            name:"ptref",
            title:"Exploration"
        },
        {
            name:"route_schedules",
            title:"Horaires de ligne"
        },
        {
            name:"stop_schedules",
            title:"Horaires à l'arrêt"
        },
        {
            name:"places_nearby",
            title:"Nearby"
        },
        {
            name:"time_table",
            title:"TT - Arrêt"
        }
    ]
};


menu.show_menu = function(container) {    
    t=extractUrlParams();
    ws_name = (t["ws_name"])?t["ws_name"]:"";
    coverage = (t["coverage"])?t["coverage"]:"";
    token = (t["token"])?t["token"]:"";
    if ( (ws_name=="") || (coverage=="")) {
        $.getJSON('./params.json', function(params) {
            ws_name = (ws_name == "") ? params.default.environnement : ws_name;
            coverage = (coverage == "") ? params.default.coverage : coverage;                
            str = "<input type='hidden' name='ws_name' id='ws_name' value='"+ws_name+"' />";
            str += "<input type='hidden' name='coverage' id='coverage' value='"+coverage+"' />";
            document.getElementById(container).innerHTML = str;
            document.forms[0].submit();
        });
    } else {
        //on affiche les pages
        //on commence par renseigner les ws_name et coverage pour les pages les utilisant tout de suite
        str="<div id='ws_list'><select id='ws_name' name='ws_name'><option>"+ws_name+"</option></select></div>";
        str+="<div id='coverage_list'><select id='coverage' name='coverage'><option>"+coverage+"</option></select></div>";
        //on construit ensuite la liste des pages
        document.getElementById(container).innerHTML=str;
        $.getJSON('./params.json', function(params) {
            str="";
            token = (token == "") ? params.environnements[ws_name].key : token;                
            str += "<input type='hidden' name='token' id='token' value='"+token+"' />";
            str += "<input type='hidden' name='navitia_api' id='navitia_api' value='"+params.environnements[ws_name].url+"' />";
            document.getElementById("params_div").innerHTML = str;
            str = "";
            str+="<ul  class='title nav navbar-nav'>";
            for (var i in menu.page_list){
                url=menu.page_list[i].name+".html?ws_name="+ws_name+"&coverage="+coverage;
                str+="<li class='title'>"+"<a class='title' href='"+url+"'>" +menu.page_list[i].title + "</a>";
            }
            str+="</ul>";
            //on affiche la liste des environnements
            str+="\n<select name='ws_name' id='ws_name' onchange='document.forms[0].submit();'>";
            for (var i in params.environnements){
                selected = "";
                if (i == ws_name) {
                    selected = " selected "
                }
                str+="<option "+selected+" value='"+i+"'>" +i + "</option>";
            }
            str+="</select>";
            document.getElementById(container).innerHTML=str;
            //on affiche la liste des coverage
            str+="<div id='coverage_list'><select id='coverage'><option>"+coverage+"</option></select></div>";
            document.getElementById(container).innerHTML=str;
            callNavitiaJS(ws_name, 'coverage', '', function(response){
                response.regions.sort(sort_compare_coverage);
                var str="<select name='coverage' id='coverage' onchange='document.forms[0].submit();'>"
                for (var i in response.regions) {
                    var region = response.regions[i];
                    selected= (coverage==region.id)?" selected" : "";
                    str+= "<option " + selected+ " value='"+region.id+"'>" + region.id + "</option>";
                }
                str+="</select>";
                document.getElementById('coverage_list').innerHTML=str;
            });
        });
    }
}

var ws_name;
var coverage;
