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
); //.addTo(map); se eliminó esta parte para que no aparesca en la vista

//function updateOpacity() {
//	document.getElementById("span-opacity").innerHTML = document.getElementById("sld-opacity").value;
//	ndvi.setOpacity(document.getElementById("sld-opacity").value);
//}

///////////////////////////////////////////////////////////////////////////////////////////////////////////

// Conjunto de control de Capas Base
var baseMaps = {
	"OpenStreetMap": osm,
	"ESRI World Imagery": esri
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////

// Conjunto de capas overlay
var overlayMaps = {
	
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////



// Fincas de CoopeVictoria
$.getJSON("lotes_coopevictoriarl.geojson", function(geodata) {
	var layer_geojson_lotes_coopevictoriarl = L.geoJson(geodata, {
		style: function(feature) {
			return {'color': "black", 'weight': 1, 'fillOpacity': 0.0}
		},
		onEachFeature: function(feature, layer) {
			var popupText = "Finca: " + feature.properties.FINCA + "<br>" + "Lote: " + feature.properties.LOTE +
			"<br>" + "Variedad: " + feature.properties.VARIEDAD + "<br>" + "Área: " + feature.properties.AREA;
			layer.bindPopup(popupText);
		}			
	}).addTo(map);
	control_layers.addOverlay(layer_geojson_lotes_coopevictoriarl, 'Áreas de Producción');
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Mapa de Coropletas

// Paleta de colores capa NDVI en base a 100
function getColor(d) {
    return d > 90 ? '#2b83ba' :
           d > 80 ? '#74b6ad' :
           d > 70 ? '#b7e2a8' :
           d > 60 ? '#e7f5b7' :
           d > 50 ? '#cab985' :
		   d > 40 ? '#c9965c' :
		   d > 30 ? '#bd5c3b' :
		   d > 20 ? '#d7191c' :
                    '#FFEDA0';
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// LLamado y estilo de capa para el mapa de rendimiento
$.getJSON("ndvi.geojson", function(geodata) {
	var layer_geojson_ndvi = L.geoJson(geodata, {
		style: function(feature) {
			return {
				fillColor: getColor(feature.properties.NDVI),
				weight: 0.1,
				opacity: 1,
				color: '#7f8c8d',
				fillOpacity: 0.8
				}
		},
		onEachFeature: function(feature, layer) {
			var popupText = "Valor de NDVI: " + feature.properties.NDVI + "<br>";
			layer.bindPopup(popupText);
		}			
	}).addTo(map);
	control_layers.addOverlay(layer_geojson_ndvi, 'NDVI Calculado con el Sensor Sentinel 2');
	
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Leyenda del NDVI

var legend = L.control({position: 'bottomright'});
legend.title = 
legend.onAdd = function (map) {
	var div = L.DomUtil.create('div', 'info legend'),
		grades = [20, 30, 40, 50, 60, 70, 80, 90],
         labels = ['Categories'],
        from, to;
	for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
};
legend.addTo(map);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
			var popupText = "Provincia: " + feature.properties.provincia + "<br>" + "Cantón: " + feature.properties.canton +
			"<br>" + "Distrito: " + feature.properties.distrito + "<br>" + "Área: " + feature.properties.area;
			layer.bindPopup(popupText);
		}			
	}).addTo(map);
	control_layers.addOverlay(layer_geojson_distritos_influencia, 'Distritos de Influencia');
	layer_geojson_ndvi.remove();
});


// Fincas de CoopeVictoria
$.getJSON("rendimientohistorico.geojson", function(geodata) {
	var layer_geojson_historial = L.geoJson(geodata, {
		style: function(feature) {
			return {'color': "black", 'weight': 1, 'fillOpacity': 0.0}
		},
		onEachFeature: function(feature, layer) {
			var popupText = "Zafra 2016-2017: " + feature.properties.PROD_16 +  " Ton/ha" + "<br>" + "Zafra 2017-2018: " + feature.properties.PROD_17 + " Ton/ha" +"<br>" + "Zafra 2018-2019: " + feature.properties.PROD_18 + " Ton/ha" +"<br>" + "Zafra 2019-2020: " + feature.properties.PROD_19+" Ton/ha" ;
			layer.bindPopup(popupText);
		}			
	}).addTo(map);
	control_layers.addOverlay(layer_geojson_historial, 'Historial de Cosecha por Finca');
});







// Ubicacion del control de capas
control_layers = L.control.layers(baseMaps, overlayMaps, {position:'topright', "autoZIndex": true, collapsed:true}).addTo(map);	





 

















