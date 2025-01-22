 document.getElementById("form").addEventListener("submit", (e) => {
 e.preventDefault();
 document.getElementById('backtolist').classList.add('d-none');
 var form = document.getElementById("form");
var data = {kadnum: form.querySelector("[name='build_kad_num']").value.replaceAll(' ', '')};
console.log(data.kadnum)
var coordinates = /\d{2}[.]\d*[,]\d{2}[.]\d*/;
if (coordinates.test(data.kadnum))
{
var lg = new L.latLng(data.kadnum.split(",")[0], data.kadnum.split(",")[1]);
    var point = L.Projection.SphericalMercator.project(lg);
    form = point.x + ',' + point.y;
    data = {kadnum: form.replaceAll(' ', '')};
}
 searchObj(data);
 });

/*переменная - группа слоев*/
var borders = L.layerGroup().addTo(map);

function polygonShow(data)
{
                var coordinates = structuredClone(data);
                for (var i = 0; i < coordinates.geometry.coordinates.length; i++) {
                    coordinates.geometry.coordinates[i].pop();
                    for (var j = 0; j < coordinates.geometry.coordinates[i].length; j++) {
                         var coordinates_point = new L.Point(coordinates.geometry.coordinates[i][j][0], coordinates.geometry.coordinates[i][j][1]);
                         var coordinates_latlng = L.Projection.SphericalMercator.unproject(coordinates_point);
                         coordinates.geometry.coordinates[i][j][0] = coordinates_latlng.lat;
                         coordinates.geometry.coordinates[i][j][1] = coordinates_latlng.lng;
                        }

                };
                var polygon = L.polygon(coordinates.geometry.coordinates, {color: 'red'});
                borders.clearLayers();
                borders.addLayer(polygon);
                map.fitBounds(polygon.getBounds());
};

function multiPolygonShow(data)
{
                var coordinates = structuredClone(data);
                for (var k = 0; k < coordinates.geometry.coordinates.length; k++)
                    {
                    for (var i = 0; i < coordinates.geometry.coordinates[k].length; i++) {
                        coordinates.geometry.coordinates[k][i].pop();
                        for (var j = 0; j < coordinates.geometry.coordinates[k][i].length; j++) {
                             var coordinates_point = new L.Point(coordinates.geometry.coordinates[k][i][j][0], coordinates.geometry.coordinates[k][i][j][1]);
                             var coordinates_latlng = L.Projection.SphericalMercator.unproject(coordinates_point);
                             coordinates.geometry.coordinates[k][i][j][0] = coordinates_latlng.lat;
                             coordinates.geometry.coordinates[k][i][j][1] = coordinates_latlng.lng;
                            }
                    }
                    };
                var polygon = L.polygon(coordinates.geometry.coordinates, {color: 'red'});
                borders.clearLayers();
                borders.addLayer(polygon);
                map.fitBounds(polygon.getBounds());
};


function getCookie(name) {
   var cookieValue = null;
   if (document.cookie && document.cookie !== '') {
       var cookies = document.cookie.split(';');
       for (var i = 0; i < cookies.length; i++) {
           var cookie = cookies[i].trim();
           if (cookie.substring(0, name.length + 1) === (name + '=')) {
               cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
               break;
           }
       }
   }
   return cookieValue;
}
var csrftoken = getCookie('csrftoken');




function searchObj(data) {

cleanResults();
document.getElementById('result').innerHTML = '<progress id="js-progressbar" class="uk-progress" value="1" max="100"></progress>';
progressBar();


const response = fetch(window.location.href, {
method: 'POST',
headers: {
'Content-type': 'application/json; charset=UTF-8',
"X-CSRFToken": csrftoken,
},
body: JSON.stringify({new_kadnum: data.kadnum}),
}).then(response => {return response.json()}).then((data) => serverResponse(data)).then((data) =>closeBtn(data));



};

function serverResponse(data) {

if (data.badresponse)

    {let result = document.getElementById('result');
    result.innerHTML = '<div class="p-3"><div class="text-bg-warning p-2 rounded-4">' + data.badresponse + '</div></div>';
    document.getElementById('resulthead').classList.remove('d-none');
    document.getElementById('resulthead').classList.add('d-flex');
    document.getElementById('takeorder').classList.remove('d-none');
    if (data.lat)
        {var point = new L.Point(data.lat, data.lng);
        var latlng = L.Projection.SphericalMercator.unproject(point);
        map.panTo([latlng.lat, latlng.lng], 18);
        marker = L.marker([latlng.lat, latlng.lng]).addTo(map);
        }
    }

else if (data.properties.category == 'list')
    {var point = new L.Point(data.lat, data.lng);
     var latlng = L.Projection.SphericalMercator.unproject(point);
     map.panTo([latlng.lat, latlng.lng], 18);
     L.marker([latlng.lat, latlng.lng]).addTo(map);
     listResult(data);
     document.getElementById('listcoordinates').innerHTML = latlng.lat.toFixed(6) + ', ' + latlng.lng.toFixed(6) + '    <a target="_blank" href="https://yandex.ru/maps/?pt=' + latlng.lng.toFixed(6) + ',' + latlng.lat.toFixed(6) +  '"style="border: none; background: none;"><i class="fa-solid fa-route"></i></a>';
     document.getElementById('orderbutton').innerHTML = '<span></span><span></span><span></span><span></span>Заказать кадастровые работы';}


else if (data.properties.category == 36369)

    {cleanResults();
    oksResult(data).then(data => oksCommonResult(data));
    if (data.geometry.type == 'Point')
        {document.getElementById('resulthead').classList.remove('d-none');
        document.getElementById('resulthead').classList.add('d-flex');
        document.getElementById('takeorder').classList.remove('d-none');
        document.getElementById('noborders').innerHTML = '<span class="badge text-bg-warning">Без координат границ</span>';
        document.getElementById('orderbutton').innerHTML = '<span></span><span></span><span></span><span></span>Заказать привязку объекта к земельному участку';}

    else if (data.geometry.type == 'Polygon')
        {document.getElementById('resulthead').classList.remove('d-none');
        document.getElementById('resulthead').classList.add('d-flex');
        document.getElementById('takeorder').classList.remove('d-none');
            if (data.type != 'Feature')
            {var point = new L.Point(data.type.lat, data.type.lng); // Lon/Lat
            var latlng = L.Projection.SphericalMercator.unproject(point);
            document.getElementById('coordinates').innerHTML = latlng.lat.toFixed(6) + ', ' + latlng.lng.toFixed(6) + '    <a target="_blank" href="https://yandex.ru/maps/?pt=' + latlng.lng.toFixed(6) + ',' + latlng.lat.toFixed(6) +  '"style="border: none; background: none;"><i class="fa-solid fa-route"></i></a>';
            polygonShow(data);
            }
            else
            {
            polygonShow(data);
            }
            }}

else if (data.properties.category == 36368)

    {cleanResults();
    zuResult(data).then(data => zuCommonResult(data));
    console.log(data)
    if (data.geometry.type == 'Point')
        {document.getElementById('resulthead').classList.remove('d-none');
        document.getElementById('resulthead').classList.add('d-flex');
        document.getElementById('takeorder').classList.remove('d-none');
        document.getElementById('noborders').innerHTML = '<span class="badge text-bg-warning">Без координат границ</span>';
        document.getElementById('orderbutton').innerHTML = '<span></span><span></span><span></span><span></span>Заказать межевание';}
    else if (data.geometry.type == 'Polygon')
        {document.getElementById('resulthead').classList.remove('d-none');
        document.getElementById('resulthead').classList.add('d-flex');
        document.getElementById('takeorder').classList.remove('d-none');
        document.getElementById('orderbutton').innerHTML = '<span></span><span></span><span></span><span></span>Заказать проверку границ на местности';
            if (data.type != 'Feature')
                {var point = new L.Point(data.type.lat, data.type.lng); // Lon/Lat
                var latlng = L.Projection.SphericalMercator.unproject(point);
                document.getElementById('coordinates').innerHTML = latlng.lat.toFixed(6) + ', ' + latlng.lng.toFixed(6) + '    <a target="_blank" href="https://yandex.ru/maps/?pt=' + latlng.lng.toFixed(6) + ',' + latlng.lat.toFixed(6) +  '"style="border: none; background: none;"><i class="fa-solid fa-route"></i></a>';
                polygonShow(data);
                }
            else
                {
                polygonShow(data);
                }

                }
    else if (data.geometry.type == 'MultiPolygon')
        {document.getElementById('resulthead').classList.remove('d-none');
        document.getElementById('resulthead').classList.add('d-flex');
        document.getElementById('takeorder').classList.remove('d-none');
        document.getElementById('orderbutton').innerHTML = '<span></span><span></span><span></span><span></span>Заказать проверку границ на местности';
            if (data.type != 'Feature')
                {var point = new L.Point(data.type.lat, data.type.lng); // Lon/Lat
                var latlng = L.Projection.SphericalMercator.unproject(point);
                document.getElementById('coordinates').innerHTML = latlng.lat.toFixed(6) + ', ' + latlng.lng.toFixed(6) + '    <a target="_blank" href="https://yandex.ru/maps/?pt=' + latlng.lng.toFixed(6) + ',' + latlng.lat.toFixed(6) +  '"style="border: none; background: none;"><i class="fa-solid fa-route"></i></a>';
                multiPolygonShow(data);
                }
            else
                {
                multiPolygonShow(data);
                }
                }
    };}

function closeBtn() {
document.getElementById("btn-close").addEventListener("click", (e) => {
cleanResults();
});
};

function backtolist() {
document.getElementById("btn-back").addEventListener("click", (e) => {
document.getElementById("backtolist").classList.add('d-none');
document.getElementById('result').innerHTML = '';
document.getElementById('list').classList.remove('d-none');
});
};

/*Оставить заявку*/
document.getElementsByClassName("animated-button8")[0].addEventListener("click", (e) => {
document.getElementById("wabuttons").classList.toggle('d-none');
});


function cleanResults() {
let result = document.getElementById('result');
result.innerHTML = '';
document.getElementById('resulthead').classList.remove('d-flex');
document.getElementById('resulthead').classList.add('d-none');
document.getElementById('noborders').innerHTML = '';
document.getElementById('takeorder').classList.add('d-none');
document.getElementById('orderbutton').innerHTML = '<span></span><span></span><span></span><span></span>Заказать кадастровые работы';
document.getElementById('list').classList.add('d-none');
document.getElementById('backtolist').classList.add('d-none');
document.getElementById('wabuttons').classList.add('d-none');
}

function zuResult(data) {let result = document.getElementById('result');
    if (data.properties.options.declared_area)
    {area_type = 'декларированная'}
    else
    {area_type = 'уточненная'}
    result.innerHTML = '<ul class="uk-list uk-list-striped" ><li><div class="row px-2"><div class="col-4 fw-bold px-0">Вид</div><div class="col-8 px-0">Земельный участок</div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Вид земельного участка</div><div class="col-8 px-0" id="subtype"></div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Координаты</div><div class="col-8 px-0" id="coordinates"></div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Кадастровый номер</div><div class="col-8 px-0" id="zucn"></div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Кадастровый квартал</div><div class="col-8 px-0" id="zukvartalcn"></div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Адрес:</div><div class="col-8 px-0" id="zuaddress"></div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Площадь ' + area_type + ':</div><div class="col-8 px-0" id="zuarea"></div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Статус:</div><div class="col-8 px-0" id="zustatecd"></div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Категория земель</div><div class="col-8 px-0" id="zucategory_type"></div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Разрешенное использование</div><div class="col-8 px-0" id="zuutil_by_doc"></div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Форма собственности</div><div class="col-8 px-0" id="zufp"></div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Вид собственности</div><div class="col-8 px-0" id="right_type"></div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Кадастровая стоимость</div><div class="col-8 px-0" id="zucad_cost"></div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Дата применения кадастровой стоимости</div><div class="col-8 px-0" id="zuapplication_date"></div></div></li>'
    return Promise.resolve(data);
};

function oksResult(data) {let result = document.getElementById('result');
    result.innerHTML = '<ul class="uk-list uk-list-striped" ><li><div class="row px-2"><div class="col-4 fw-bold px-0">Тип</div><div class="col-8 px-0">Объект недвижимости</div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Координаты</div><div class="col-8 px-0" id="coordinates"></div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Вид</div><div class="col-8 px-0" id="oks_type"></div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Кадастровый номер</div><div class="col-8 px-0" id="okscn"></div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Кадастровый квартал</div><div class="col-8 px-0" id="okskvartalcn"></div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Адрес:</div><div class="col-8 px-0" id="oksaddress"></div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Наименование:</div><div class="col-8 px-0" id="oksname"></div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Назначение:</div><div class="col-8 px-0" id="okspurpose_name"></div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Площадь общая:</div><div class="col-8 px-0" id="oksarea_value"></div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Статус:</div><div class="col-8 px-0" id="oksstatecd"></div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Форма собственности</div><div class="col-8 px-0" id="oksfp"></div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Кадастровая стоимость</div><div class="col-8 px-0" id="okscad_cost"></div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Дата применения кадастровой стоимости</div><div class="col-8 px-0" id="oksapplication_date"></div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Основные характеристики:</div><div class="col-8 px-0" id=""></div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Количество этажей (в том числе подземных):</div><div class="col-8 px-0" id="oksfloors"></div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Количество подземных этажей:</div><div class="col-8 px-0" id="oksunderground_floors"></div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Материал стен:</div><div class="col-8 px-0" id="okselements_construct"></div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Включение в реестр культурного наследия:</div><div class="col-8 px-0" id="okscultural"></div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Кадастровый номер ЕНК:</div><div class="col-8 px-0" id="united_cad_numbers"></div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Завершение строительства:</div><div class="col-8 px-0" id="oksyear_built"></div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Ввод в эксплуатацию:</div><div class="col-8 px-0" id="oksyear_used"></div></div></li></ul>';
    return Promise.resolve(data);
};

function listResult(data) {
        document.getElementById('resulthead').classList.remove('d-none');
        document.getElementById('resulthead').classList.add('d-flex');
        document.getElementById('takeorder').classList.remove('d-none');
        document.getElementById('list').classList.remove('d-none');
        document.getElementById('list').innerHTML = '';
        document.getElementById('result').innerHTML = '';
var mylist = document.getElementById("list");
mylist.innerHTML = '<li><div><span class="p-2 fw-bolder">Координаты: </span><span class="" id="listcoordinates"></span></div></li>'
for (var i = 0; i < data.resultlist; i++) {
    if (data.rent[i].properties.options.readable_address)
        {mylist.innerHTML = mylist.innerHTML + '<li class="listresult"><div><span class="p-2">' + [i+1] + '</span><span class="fw-bolder">' + data.rent[i].properties.options.cad_num + '</span></div><div class="p-2"><span class="py-2">' + data.rent[i].realty_type + '</span></div><div class="p-2">' + data.rent[i].properties.options.readable_address + '</div></li>';}
    else if (data.rent[i].attrs.number_zone)
        {mylist.innerHTML = mylist.innerHTML + '<li><div><span class="p-2">' + [i+1] + '</span><span class="fw-bolder">' + data.rent[i].attrs.number_zone + '</span></div><div class="p-2"><span class="py-2">' + data.rent[i].type + '</span></div><div class="p-2">' + data.rent[i].attrs.desc + '</div></li>';}
};
const liList = document.querySelectorAll('li.listresult');
console.log(liList);
console.log(data);
liList.forEach(function(li){
li.addEventListener('click', function(){
  liList.forEach(function(el, i) {
    el.classList.remove('active')
  })
  this.classList.toggle('active');
  const rent = parseInt(document.querySelector("#list > li.listresult.active > div:nth-child(1) > span.p-2").innerHTML);
  data1 = data.rent[rent - 1]
  data1.type = {'lat': data.lat, 'lng': data.lng}
  console.log(data1)
  serverResponse(data1)
/*let data = {
kadnum: form.replaceAll(' ', ''),
};
  searchObj(data);*/
  document.getElementById('backtolist').classList.remove('d-none');
  backtolist();
})
});
}

function zuCommonResult(data) {
    if (data.properties.options.subtype)
        {document.getElementById('subtype').innerHTML = data.properties.options.subtype;}
    else
        {document.getElementById('subtype').innerHTML = data.properties.options.land_record_subtype;}

    document.getElementById('zucn').innerHTML = data.properties.options.cad_num;
    document.getElementById('zukvartalcn').innerHTML = data.properties.options.quarter_cad_number;
    document.getElementById('zuaddress').innerHTML = data.properties.options.readable_address;

    if (data.properties.options.land_record_area_verified)
        {document.getElementById('zuarea').innerHTML = data.properties.options.land_record_area_verified.toLocaleString() + ' кв.м.';}
    else if (data.properties.options.declared_area)
        {document.getElementById('zuarea').innerHTML = data.properties.options.declared_area.toLocaleString() + ' кв.м.';}
    else if (data.properties.options.specified_area)
        {document.getElementById('zuarea').innerHTML = data.properties.options.specified_area.toLocaleString() + ' кв.м.';}
    else
        {document.getElementById('zuarea').innerHTML = '-';}

    if (data.properties.options.status)
        {document.getElementById('zustatecd').innerHTML = data.properties.options.status;}

    document.getElementById('zucategory_type').innerHTML = data.properties.options.land_record_category_type;
    document.getElementById('zuutil_by_doc').innerHTML = data.properties.options.permitted_use_established_by_document;

     if (data.properties.options.ownership_type)
        {document.getElementById('zufp').innerHTML = data.properties.options.ownership_type;}

     if (data.properties.options.right_type)
        {document.getElementById('right_type').innerHTML = data.properties.options.right_type;}

    document.getElementById('zucad_cost').innerHTML = data.properties.options.cost_value.toLocaleString() + ' руб.';

     if (data.properties.options.cost_application_date)
        {document.getElementById('zuapplication_date').innerHTML = data.properties.options.cost_application_date;}

    return Promise.resolve(data);
};

function oksCommonResult(data) {
    document.getElementById('oks_type').innerHTML = data.properties.options.build_record_type_value;
    document.getElementById('okscn').innerHTML = data.properties.options.cad_num;
    document.getElementById('okskvartalcn').innerHTML = data.properties.options.quarter_cad_number;
    document.getElementById('oksaddress').innerHTML = data.properties.options.readable_address;
    document.getElementById('oksname').innerHTML = data.properties.options.building_name;
    document.getElementById('okspurpose_name').innerHTML = data.properties.options.purpose;
    if (data.properties.options.build_record_area)
        {document.getElementById('oksarea_value').innerHTML = data.properties.options.build_record_area.toLocaleString() + ' кв.м.';}
    document.getElementById('oksstatecd').innerHTML = data.properties.options.status;
    document.getElementById('oksfp').innerHTML = data.properties.options.ownership_type;
    document.getElementById('okscad_cost').innerHTML = data.properties.options.cost_value.toLocaleString() + ' руб.';
    document.getElementById('oksapplication_date').innerHTML = data.properties.options.cost_application_date;
    document.getElementById('oksfloors').innerHTML = data.properties.options.floors;
    document.getElementById('oksunderground_floors').innerHTML = data.properties.options.underground_floors;
    document.getElementById('okselements_construct').innerHTML = data.properties.options.materials;
    //document.getElementById('oksheight').innerHTML = data.feature.attrs.height;
    //document.getElementById('oksdepth').innerHTML = data.feature.attrs.depth;
    //if (data.feature.attrs.spread)
    //    {document.getElementById('oksspread').innerHTML = data.feature.attrs.spread + ' м';}
    //document.getElementById('oksvolume').innerHTML = data.feature.attrs.volume;
    //document.getElementById('oksarea_dev').innerHTML = data.feature.attrs.area_dev;
    document.getElementById('okscultural').innerHTML = data.properties.options.cultural_heritage_val;
    document.getElementById('united_cad_numbers').innerHTML = data.properties.options.united_cad_numbers;
    document.getElementById('oksyear_built').innerHTML = data.properties.options.year_built;
    document.getElementById('oksyear_used').innerHTML = data.properties.options.year_commisioning;
    return Promise.resolve(data);
};

function progressBar() {
    UIkit.util.ready(function () {
        var bar = document.getElementById('js-progressbar');
        var animate = setInterval(function () {
            bar.value += 1;
            if (bar.value >= bar.max) {
                clearInterval(animate);
            }
        }, 200);
    });
};