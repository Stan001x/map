
      // Создаем карту
      var map = L.map('map').setView([55.0302, 82.9205], 15); // Новосибирск

      // Добавляем базовые тайлы (Яндекс Карты)
      /*L.tileLayer('https://tiles.api-maps.yandex.ru/v1/tiles/?x=9902&y=5137&z=14&lang=ru_RU&l=map&apikey=5d79c54c-d4f6-44a5-92f5-de2250c24722', {
        attribution: '&copy; <a href="https://yandex.ru/maps/">Яндекс Карты</a>',
        maxZoom: 17
      }).addTo(map);*/


    var BING_KEY = 'AuhiCJHlGzhg93IqUH_oCpl_-ZUrIE6SPftlyGYUvr9Amx5nzA-WqGcPquyFZl4L'

    var bingLayer = L.tileLayer.bing(BING_KEY)


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

      var baseLayers = {
    "Bing": bingLayer,
    "OpenStreetMap": osm
};

var overlays = {
    "Росреестр": wmsLayer,
    "Территориальные зоны": wmsLayertz
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





/*const provider = new window.GeoSearch.OpenStreetMapProvider();
const search = new GeoSearch.GeoSearchControl({ provider: provider, style: 'bar', updateMap: true, autoClose: true,});
// Include the search box with usefull params. Autoclose and updateMap in my case. Provider is a compulsory parameter.*/

/*L.marker([51.0, -0.09]).addTo(map).bindPopup('A pretty CSS3 popup.<br> Easily customizable.');
//Creates a marker at [latitude, longitude] coordinates.*/



