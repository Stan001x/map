//import L from 'leaflet';

const leafletMap = (mapContainer, center) => {
  const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'
  });

  const googleSatellite = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    attribution: '<a http="https://google.com" target="_blank">Google</a>'
  });

  const googleStreets = L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    attribution: '<a http="https://google.com" target="_blank">Google</a>'
  });

  const googleHybrid = L.tileLayer('https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    attribution: '<a http="https://google.com" target="_blank">Google</a>'
  });

  const googleTerrain = L.tileLayer('https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    attribution: '<a http="https://google.com" target="_blank">Google</a>'
  });

  const yandexMap = L.tileLayer('https://core-renderer-tiles.maps.yandex.net/tiles?l=map&x={x}&y={y}&z={z}&scale=1&lang=ru_RU', {
    attribution: '<a http="https://yandex.ru" target="_blank">Yandex</a>'
  });

  const yandexSatellite = L.tileLayer('https://core-sat.maps.yandex.net/tiles?l=sat&x={x}&y={y}&z={z}&scale=1&lang=ru_RU', {
    attribution: '<a http="https://yandex.ru" target="_blank">Yandex</a>'
  });

  const yandexHybrid = new L.LayerGroup([
    yandexSatellite,
    L.tileLayer('https://core-renderer-tiles.maps.yandex.net/tiles?l=skl&x={x}&y={y}&z={z}&scale=1&lang=ru_RU'),
  ]);
  
  const gis = L.tileLayer('https://{s}.maps.2gis.com/tiles?x={x}&y={y}&z={z}&v=1', {
    subdomains: ['tile0', 'tile1', 'tile2', 'tile3'],
    attribution: '<a href="https://2gis.com" target="_blank">2GIS</a>'
  });

  const map = L.map(mapContainer, {
    center: center,
    zoom: 16,
    layers: [osm]
  });

  // Google and OpenStreetMap use EPSG3857 projection, but Yandex use EPSG3395, so we need toggle it when toggle Yandex layer
  map.on('baselayerchange', layer => {
    const center = map.getCenter();
    if (layer.name.includes('Yandex')) {
      map.options.crs = L.CRS.EPSG3395;
    } else {
      map.options.crs = L.CRS.EPSG3857;
    }
    map.setView(center);
    map._resetView(map.getCenter(), map.getZoom(), true);
  });

  var baseLayers = {
    'OpenStreetMap': osm,
    'Google Спутник': googleSatellite,
    'Google hybrid': googleHybrid,
    'Yandex': yandexMap,
    'Yandex satellite': yandexSatellite,
    'Yandex hybrid': yandexHybrid,
    '2GIS': gis,
  };

       var wmsLayer = L.tileLayer.Rosreestr('https://pkk.rosreestr.ru/arcgis/rest/services/PKK6/CadastreObjects/MapServer/export?layers=show%3A30%2C27%2C24%2C23%2C22&dpi=96&format=PNG32&bboxSR=102100&imageSR=102100&size=1024%2C1024&transparent=true&f=image&bbox={bbox}', {

        tileSize: 1024,
        attribution: 'Публичная кадастровая карта'
       }).addTo(map);

       var wmsLayertz = L.tileLayer.Rosreestr('https://pkk.rosreestr.ru/arcgis/rest/services/PKK6/ZONES/MapServer/export?layers=show%3A5&dpi=96&format=PNG32&bbox={bbox}&bboxSR=102100&imageSR=102100&size=1024%2C1024&transparent=true&f=image&_ts=false', {

        tileSize: 1024,
        attribution: 'Публичная кадастровая карта'
       });


var overlays = {
    "Росреестр": wmsLayer,
    "Территориальные зоны": wmsLayertz
};

  var layerControl = L.control.layers(baseLayers, overlays).addTo(map)

}

//export default leafletMap;