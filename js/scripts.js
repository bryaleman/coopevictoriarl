//Sistema de monitoreo de cultivo en CoopeVictoria R.L.

// Mapa base
var map = L.map("mapid");

// Centro del mapa y nivel de acercamiento
var mapacoopevi = L.latLng([10.06773512, -84.2996532494]);  
var zoomLevel = 12;

// Definición de la vista del mapa
map.setView(mapacoopevi, zoomLevel);

//Control de escala 
L.control.scale({position:'topleft',imperial:false}).addTo(map);

// Adición de las capas base
esri = L.tileLayer.provider("Esri.WorldImagery").addTo(map);
osm = L.tileLayer.provider("OpenStreetMap.Mapnik").addTo(map);

// Indice de Vegetacion diciembre 2019
var ndvi = L.imageOverlay("ndvi.png", 
	[[10.1387257937176312, -84.3679128707571806], 
	[9.9967152737829750, -84.2313861376834154]], 
	{opacity:0.8}
).addTo(map);

function updateOpacity() {
	document.getElementById("span-opacity").innerHTML = document.getElementById("sld-opacity").value;
	ndvi.setOpacity(document.getElementById("sld-opacity").value);
}





// Conjunto de control de Capas Base
var baseMaps = {
	"ESRI World Imagery": esri,
	"OpenStreetMap": osm   
};

// Conjunto de capas overlay
var overlayMaps = {
	"NDVI Diciembre 2018": ndvi
};

// Fincas de CoopeVictoria
$.getJSON("lotes_coopevictoriarl.geojson", function(geodata) {
	var layer_geojson_lotes_coopevictoriarl = L.geoJson(geodata, {
		style: function(feature) {
			return {'color': "#c71d1a", 'weight': 1, 'fillOpacity': 0.0}
		},
		onEachFeature: function(feature, layer) {
			var popupText = "Finca: " + feature.properties.FINCA + "<br>" + "Lote: " + feature.properties.LOTE +
			"<br>" + "Variedad: " + feature.properties.VARIEDAD + "<br>" + "Área: " + feature.properties.AREA;
			layer.bindPopup(popupText);
		}			
	}).addTo(map);
	control_layers.addOverlay(layer_geojson_lotes_coopevictoriarl, 'Plantaciones de Caña CoopeVictoria R.L.');
});


// Mapa de Coropletas

// Paleta de colores capa producción 2018
function getColor(d) {
    return d > 102 ? '#2b83ba' :
           d > 95 ? '#5E610B' :
           d > 92 ? '#c7e9ad' :
           d > 84 ? '#ffffbf' :
           d > 72 ? '#fec980' :
		   d > 62 ? '#f17c4a' :
		   d > 44 ? '#d7191c' :
                    '#FFEDA0';
}

// LLamado y estilo de capa 
$.getJSON("rendimiento2018.geojson", function(geodata) {
	var layer_geojson_rendimiento2018 = L.geoJson(geodata, {
		style: function(feature) {
			return {
				fillColor: getColor(feature.properties.PROD_18),
				weight: 1,
				opacity: 1,
				color: '#7f8c8d',
				fillOpacity: 0.5
				}
		},
		onEachFeature: function(feature, layer) {
			var popupText = "Finca: " + feature.properties.FINCA + "<br>" + 
			"Rendimiento de Campo: " + feature.properties.PROD_18 + " Ton/Ha" + "<br>" + 
			"Rendimiento Industrial: " + feature.properties.RENDI_18 + " kg Azúcar/Ton";
			layer.bindPopup(popupText);
		}			
	}).addTo(map);
	control_layers.addOverlay(layer_geojson_rendimiento2018, 'Rendimiento 2018');
	layer_geojson_rendimiento2018.remove();
});


// Leyenda

var legend = L.control({position: 'bottomright'});
legend.title =
legend.onAdd = function (map) {
	var div = L.DomUtil.create('div', 'info legend'),
		grades = [44, 62, 72, 84, 92, 95, 102],
         labels = ['<strong> THE TITLE </strong>'],
        from, to;
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
};
legend.addTo(map);



// Selección de fincas segun interes 

var fincas_coope = L.layerGroup().addTo(map);


function colorFincas(d) { 
	return d == "TODOS" ? '#FFFF00' :
		d == "ALAMEDA" ? '#FF0000' : 
		d == "ALFAROS" ? '#00FF00' : 
		d == "ANA MARIA RIVERA HERRERO" ? '#FFFF00' : 
		d == "ARAYA" ? '#FFFF00' :
		d == "ASSMAN" ? '#FFFA0' :
		d == "CELINA" ? '#FFFF00' :
		d == "CLOTILDE" ? '#FFFF00' :
		d == "COYOL" ? '#FFFF00' :
		d == "DAVID" ? '#FFFF00' :
		d == "FINCA LA LUISA" ? '#FFFF00' :
		d == "FLORES" ? '#FFFF00' :
		d == "GENARO" ? '#FFFF00' :
		d == "GRUPO HERRERO LA ARGENTINA" ? '#FFFF00' :
		d == "GRUPO MATEO AGUALOTE" ? '#FFFF00' :
		d == "JOSE MIGUEL FERNANDEZ" ? '#FFFF00' :
		d == "KOOPER CENTRAL" ? '#FFFF00' :
		d == "MAQUINAS" ? '#FFFF00' :
		d == "MAURICIO PERALTA" ? '#FFFF00' :
		d == "MONTECRISTO" ? '#FFFF00' :
		d == "PINTO" ? '#FFFF00' :
		d == "POAS" ? '#FFFF00' :
		d == "ROSALES" ? '#FFFF00' :
		d == "SAN ROQUE" ? '#FFFF00' :
		d == "SANTA ELENA" ? '#FFFF00' :
		'#000000'; 
	};
	
	
function estilo_fincas (feature) {
	return{
		fillColor: colorFincas(feature.properties.FINCA),
	};
};

function myFunction() {
	$.getJSON("lotes_coopevictoriarl.geojson", function(geodata){
		var layer_geojson_lotes_coopevictoriarl = L.geoJson(geodata, {
			style: estilo_fincas,
			onEachFeature: function(feature, layer) {
				var popupText = "Finca: " + feature.properties.FINCA;
				layer.bindPopup(popupText);
			}
		});
	fincas_coope.addLayer(layer_geojson_lotes_coopevictoriarl);
	control_layers.addOverlay(layer_geojson_lotes_coopevictoriarl, 'Fincas');
	layer_geojson_lotes_coopevictoriarl.remove();
	});
};


function estiloSelect() {
	var miSelect = document.getElementById("estilo").value;
	
	$.getJSON("lotes_coopevictoriarl.geojson", function(geodata){
		var layer_geojson_lotes_coopevictoriarl = L.geoJson(geodata, {
			filter: function(feature, layer) {								
				if(miSelect != "TODOS")		
				return (feature.properties.FINCA == miSelect );
				else
				return true;
			},	
			style: estilo_fincas,
			onEachFeature: function(feature, layer) {
				var popupText = "Finca: " + feature.properties.FINCA;
				layer.bindPopup(popupText);
				map.fitBounds(layer.getBounds());
			}
		});
 		fincas_coope.clearLayers();
		fincas_coope.addLayer(layer_geojson_lotes_coopevictoriarl);
	});		
};
	

// Distritos de Influencia
$.getJSON("distritos_influencia.geojson", function(geodata) {
	var layer_geojson_distritos_influencia = L.geoJson(geodata, {
		style: function(feature) {
			return {'color': "#000000", 'weight': 1, 'fillOpacity': 0.0}
		},
		onEachFeature: function(feature, layer) {
			var popupText = "Provincia: "Alto: " + feature.properties.provincia + "Medio: " + feature.properties.provincia + "Bajo: " + feature.properties.provincia + "<br>" + "Cantón: " + feature.properties.canton +
			"<br>" + "Distrito: " + feature.properties.distrito + "<br>" + "Área: " + feature.properties.area;
			layer.bindPopup(popupText);
		}			
	}).addTo(map);
	control_layers.addOverlay(layer_geojson_distritos_influencia, 'Distritos');
});







// Ubicacion del control de capas
control_layers = L.control.layers(baseMaps, overlayMaps, {position:'topright', "autoZIndex": true, collapsed:true}).addTo(map);	





 

















