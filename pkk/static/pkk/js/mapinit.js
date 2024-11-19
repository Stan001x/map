
      // Создаем карту
      var map = L.map('map').setView([55.0302, 82.9205], 15); // Новосибирск

      // Добавляем базовые тайлы (Яндекс Карты)
      /*L.tileLayer('https://tiles.api-maps.yandex.ru/v1/tiles/?x=9902&y=5137&z=14&lang=ru_RU&l=map&apikey=5d79c54c-d4f6-44a5-92f5-de2250c24722', {
        attribution: '&copy; <a href="https://yandex.ru/maps/">Яндекс Карты</a>',
        maxZoom: 17
      }).addTo(map);*/


    var BING_KEY = 'AuhiCJHlGzhg93IqUH_oCpl_-ZUrIE6SPftlyGYUvr9Amx5nzA-WqGcPquyFZl4L'
    var bingLayer = L.tileLayer.bing(BING_KEY)

  const googleSatellite = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    attribution: '<a http="https://google.com" target="_blank">Google</a>'
  });



     var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> '
}).addTo(map);

       var wmsLayer = L.tileLayer.Rosreestr('https://pkk.rosreestr.ru/arcgis/rest/services/PKK6/CadastreObjects/MapServer/export?layers=show%3A30%2C27%2C24%2C23%2C22&dpi=96&format=PNG32&bboxSR=102100&imageSR=102100&size=1024%2C1024&transparent=true&f=image&bbox={bbox}', {

        tileSize: 1024,
        attribution: 'Публичная кадастровая карта'
       }).addTo(map);

       var wmsLayertz = L.tileLayer.Rosreestr('https://pkk.rosreestr.ru/arcgis/rest/services/PKK6/ZONES/MapServer/export?layers=show%3A5&dpi=96&format=PNG32&bbox={bbox}&bboxSR=102100&imageSR=102100&size=1024%2C1024&transparent=true&f=image&_ts=false', {

        tileSize: 1024,
        attribution: 'Публичная кадастровая карта'
       });

        var wmsLayercc = L.tileLayer.Rosreestr('https://pkk.rosreestr.ru/arcgis/rest/services/PKK6/ZONES/MapServer/export?layers=show%3A8&dpi=96&format=PNG32&bbox={bbox}&bboxSR=102100&imageSR=102100&size=1024%2C1024&transparent=true&f=image&_ts=false', {
        tileSize: 1024,
        attribution: 'Публичная кадастровая карта'
       });

        var wmsLayerzouit = L.tileLayer.Rosreestr('https://pkk.rosreestr.ru/arcgis/rest/services/PKK6/ZONES/MapServer/export?layers=show%3A4%2C3%2C2%2C1&dpi=96&format=PNG32&bbox={bbox}&bboxSR=102100&imageSR=102100&size=1024%2C1024&transparent=true&f=image&_ts=false', {
        tileSize: 1024,
        attribution: 'Публичная кадастровая карта'
       });

       var mapboxUrl = "https://pkk.rosreestr.ru/arcgis/rest/services/Hosted/caddivsion/VectorTileServer/tile/{z}/{y}/{x}.pbf";

       var mapboxVectorTileOptions = {
    vectorTileLayerStyles: {
        "Кадастровые округа": {
            stroke: !0,
            color: "#D20404",
            opacity: 0.5,
            weight: 1
        },
        "Кадастровые округа/label": {
            stroke: !1,
            color: "#D20404",
            opacity: 0.5,
            weight: 1
        },
        "Кадастровые округа:1": {
            stroke: !0,
            color: "#D20404",
            opacity: 0.5,
            weight: 1
        },
        "Кадастровые округа:1/label": {
            stroke: !1,
            color: "#D20404",
            opacity: 0.5,
            weight: 1
        },
        "Кадастровые округа:2": {
            stroke: !0,
            color: "#D20404",
            opacity: 0.5,
            weight: 1
        },
        "Кадастровые округа:2/label": {
            stroke: !1,
            color: "#D20404",
            opacity: 0.5,
            weight: 1
        },
        "Кадастровые районы": {
            stroke: !0,
            color: "#D20404",
            opacity: 0.5,
            weight: 1
        },
        "Кадастровые районы/label": {
            stroke: !1,
            color: "#D20404",
            opacity: 0.5,
            weight: 1
        },
        "Кадастровые районы:1": {
            stroke: !0,
            color: "#D20404",
            opacity: 0.5,
            weight: 1
        },
        "Кадастровые районы:1/label": {
            stroke: !1,
            color: "#D20404",
            opacity: 0.5,
            weight: 1
        },
        "Кадастровые районы:2": {
            stroke: !0,
            color: "#D20404",
            opacity: 0.5,
            weight: 1
        },
        "Кадастровые районы:2/label": {
            stroke: !1,
            color: "#D20404",
            opacity: 0.5,
            weight: 1
        },
        "Кадастровые кварталы": {
            stroke: !0,
            color: "#D20404",
            opacity: 0.5,
            weight: 0.05,
                    },
        "Кадастровые кварталы/label": {
            stroke: !1,
            color: "#D20404",
            opacity: 0.5,
            weight: 1,
        },
        "Здания_area": {
            stroke: !0,
            color: "#D20404",
            opacity: 0.5,
            weight: 1
        },
        "Здания": {
            stroke: !0,
            color: "#D20404",
            opacity: 0.50,
            weight: 1
        },
        "Кварталы_all": {
            stroke: !0,
            color: "#D20404",
            opacity: 0.50,
            weight: 1
        },
        "Дороги": {
            stroke: !1,
            color: "#D20404",
            opacity: 0.50,
            weight: 1
        },
        "Дороги_1m": {
            stroke: !1,
            color: "#D20404",
            opacity: 0.50,
            weight: 1
        },
        "Жд станции": {
            stroke: !0,
            color: "#D20404",
            opacity: 0.50,
            weight: 1
        },
        "Железные дороги": {
            stroke: !0,
            color: "#D20404",
            opacity: 0.50,
            weight: 1
        },
        "Парки": {
            stroke: !1,
            color: "#D20404",
            opacity: 0.50,
            weight: 1
        },
        "Реки (полигоны)": {
            stroke: !0,
            color: "#D20404",
            opacity: 0.50,
            weight: 1
        },
        "Озера (полигоны)_all": {
            stroke: !1,
            color: "#D20404",
            opacity: 0.50,
            weight: 1
        },
        "Озера (полигоны)_area": {
            stroke: !0,
            color: "#D20404",
            opacity: 0.50,
            weight: 1
        },
        "Острова": {
            stroke: !0,
            color: "#D20404",
            opacity: 0.50,
            weight: 1
        },
        "Растительность_1mln ": {
            stroke: !1,
            color: "#D20404",
            opacity: 0.50,
            weight: 1
        },
        "Гидрография линии:2": {
            stroke: !0,
            color: "#D20404",
            opacity: 0.50,
            weight: 1
        },
        "Гидрография линии:1": {
            stroke: !0,
            color: "#D20404",
            opacity: 0.50,
            weight: 1
        },
        "Здания_3d": {
            stroke: !0,
            color: "#D20404",
            opacity: 0.50,
            weight: 1
        },
        "Населенные пункты (полигоны)": {
            stroke: !0,
            color: "#D20404",
            opacity: 0.5,
            weight: 1
        },
        "Кварталы_AREA_100": {
            stroke: !0,
            color: "#D20404",
            opacity: 0.50,
            weight: 1
        },
        "Кварталы_AREA_500": {
            stroke: !0,
            color: "#D20404",
            opacity: 0.50,
            weight: 1
        },
    },
    minNativeZoom: 4,
    maxNativeZoom: 11,
    // rendererFactory: L.canvas.tile,
    rendererFactory: L.svg.tile,
    //                         interactive: true


};

       var mapboxPbfLayer = L.vectorGrid.protobuf(mapboxUrl, mapboxVectorTileOptions);

      var baseLayers = {
      "OpenStreetMap": osm,
      'Google Спутник': googleSatellite,
      "Bing Спутник": bingLayer,


};

var overlays = {
    "Росреестр": wmsLayer,
    "Территориальные зоны": wmsLayertz,
    "Красные линии": wmsLayercc,
    "Кадастровые квартала": mapboxPbfLayer,
    "ЗОУИТ": wmsLayerzouit,
};

var layerControl = L.control.layers(baseLayers, overlays).addTo(map);

L.control.attribution( {prefix: false, });



map.on('click', function(ev) {
   b =ev.latlng;
   lat = b.lat.toFixed(6);
   lng = b.lng.toFixed(6);
   var tooltip = L.tooltip(b, {content: lat + ', ' + lng,}).addTo(map);
    const form = lat + ',' + lng;
    let data = {kadnum: form.replaceAll(' ', '')};
    searchObj(data);
       // ev is an event object (MouseEvent in this case)
});


/*  var measureControl = new L.Control.Measure({
    position: 'bottomleft',
    primaryLengthUnit: 'meters',
    secondaryLengthUnit: 'meters',
    primaryAreaUnit: 'sqmeters',
    secondaryAreaUnit: 'sqmeters',
    activeColor: '#008B8B',
    completedColor: '#006400',
    units: 'meters',
    localization: 'ru',
    decPoint: '.',
    thousandsSep: ' '
  });
  measureControl.addTo(map);*/




/*const provider = new window.GeoSearch.OpenStreetMapProvider();
const search = new GeoSearch.GeoSearchControl({ provider: provider, style: 'bar', updateMap: true, autoClose: true,});
// Include the search box with usefull params. Autoclose and updateMap in my case. Provider is a compulsory parameter.*/

/*L.marker([51.0, -0.09]).addTo(map).bindPopup('A pretty CSS3 popup.<br> Easily customizable.');
//Creates a marker at [latitude, longitude] coordinates.*/



