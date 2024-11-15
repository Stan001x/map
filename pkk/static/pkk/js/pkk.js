 document.getElementById("form").addEventListener("submit", (e) => {
 e.preventDefault();
 const form = document.getElementById("form");
let data = {kadnum: form.querySelector("[name='build_kad_num']").value.replaceAll(' ', '')};
 searchObj(data);
 });

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


document.getElementById('result').innerHTML = '<progress id="js-progressbar" class="uk-progress" value="1" max="100"></progress>';
progressBar();


fetch("http://127.0.0.1:8000/pkk/", {
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
    result.innerHTML = '<div class="text-end p-3"><button type="button" class="btn-close" id="btn-close" aria-label="Close"></button></div><div class="p-3"><div class="text-bg-warning p-2 rounded-4">' + data.badresponse + '</div></div>';
    if (data.lat)
        {var point = new L.Point(data.lat, data.lng);
        map.panTo([data.lat, data.lng], 18);
        L.marker([data.lat, data.lng]).addTo(map);}
    }

else if (data.feature.type == 5)

    {oksResult(data).then(data => oksCommonResult(data));
    if (data.feature.center == null)
        {document.getElementById('oksnoborders').innerHTML = '<span class="badge text-bg-warning">Без координат границ</span>';
        document.getElementById('takeorder').innerHTML = '<button type="button" class="btn btn-primary">Заказать привязку объекта к земельному участку</button>';}

    else if (data.feature.center != null)
        {document.getElementById('takeorder').innerHTML = '<button type="button" class="btn btn-primary">Заказать кадастровые работы</button>';
        var point = new L.Point(data.feature.center.x, data.feature.center.y); // Lon/Lat
        var latlng = L.Projection.SphericalMercator.unproject(point);
        map.panTo([latlng.lat, latlng.lng], 18);
        L.marker([latlng.lat, latlng.lng]).addTo(map);} }

else if (data.feature.type == 1)

    {zuResult(data).then(data => zuCommonResult(data));
    if (data.feature.center == null)
        {document.getElementById('zunoborders').innerHTML = '<span class="badge text-bg-warning">Без координат границ</span>';
        document.getElementById('takeorder').innerHTML = '<button type="button" class="btn btn-primary">Заказать межевание</button>';}
    else if (data.feature.center != null)
        {document.getElementById('takeorder').innerHTML = '<button type="button" class="btn btn-primary">Заказать проверку границ на местности</button>';
        var point = new L.Point(data.feature.center.x, data.feature.center.y); // Lon/Lat
        var latlng = L.Projection.SphericalMercator.unproject(point);
        map.panTo([latlng.lat, latlng.lng], 18);
        L.marker([latlng.lat, latlng.lng]).addTo(map);}}

else if (data.feature.type == 'list')
    {var point = new L.Point(data.lat, data.lng);
     map.panTo([data.lat, data.lng], 18);
     L.marker([data.lat, data.lng]).addTo(map);
     listResult(data);
     document.getElementById('takeorder').innerHTML = '<button type="button" class="btn btn-primary">Заказать кадастровые работы</button>';}
    };

function closeBtn() {
setTimeout(() => {
document.getElementById("btn-close").addEventListener("click", (e) => {
let result = document.getElementById('result');
result.innerHTML = '';
 });
}, "5000");
};

function zuResult(data) {let result = document.getElementById('result');
    result.innerHTML = '<div class="d-flex p-3"><div class="flex-grow-1" id="zunoborders"></div><div><button type="button" class="btn-close" id="btn-close" aria-label="Close"></button></div></div><div id="takeorder" class="text-center p-2"></div><ul class="uk-list uk-list-striped" ><li><div class="row px-2"><div class="col-4 fw-bold px-0">Вид</div><div class="col-8 px-0">Земельный участок</div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Кадастровый номер</div><div class="col-8 px-0" id="zucn"></div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Кадастровый квартал</div><div class="col-8 px-0" id="zukvartalcn"></div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Кадастровый номер ЕЗП:</div><div class="col-8 px-0" id="zuparent_cn"></div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Адрес:</div><div class="col-8 px-0" id="zuaddress"></div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Площадь:</div><div class="col-8 px-0" id="zuarea"></div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Статус:</div><div class="col-8 px-0" id="zustatecd"></div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Категория земель</div><div class="col-8 px-0" id="zucategory_type"></div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Разрешенное использование</div><div class="col-8 px-0" id="zuutil_by_doc"></div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Форма собственности</div><div class="col-8 px-0" id="zufp"></div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Кадастровая стоимость</div><div class="col-8 px-0" id="zucad_cost"></div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Дата применения кадастровой стоимости</div><div class="col-8 px-0" id="zuapplication_date"></div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Состав</div><div class="col-8 px-0" id="zuparcel_type"></div></div></li></ul>';
    return Promise.resolve(data);
};

function oksResult(data) {let result = document.getElementById('result');
    result.innerHTML = '<div class="d-flex p-3"><div class="flex-grow-1" id="oksnoborders"></div><div><button type="button" class="btn-close" id="btn-close" aria-label="Close"></button></div></div><div id="takeorder" class="text-center p-2"></div><ul class="uk-list uk-list-striped" ><li><div class="row px-2"><div class="col-4 fw-bold px-0">Тип</div><div class="col-8 px-0">Объект недвижимости</div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Вид</div><div class="col-8 px-0" id="oks_type"></div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Кадастровый номер</div><div class="col-8 px-0" id="okscn"></div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Кадастровый квартал</div><div class="col-8 px-0" id="okskvartalcn"></div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Адрес:</div><div class="col-8 px-0" id="oksaddress"></div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Наименование:</div><div class="col-8 px-0" id="oksname"></div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Назначение:</div><div class="col-8 px-0" id="okspurpose_name"></div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Площадь общая:</div><div class="col-8 px-0" id="oksarea_value"></div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Статус:</div><div class="col-8 px-0" id="oksstatecd"></div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Разрешенное использование:</div><div class="col-8 px-0" id=""></div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">По документу:</div><div class="col-8 px-0" id=""></div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Форма собственности</div><div class="col-8 px-0" id="oksfp"></div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Кадастровая стоимость</div><div class="col-8 px-0" id="okscad_cost"></div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Дата применения кадастровой стоимости</div><div class="col-8 px-0" id="oksapplication_date"></div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Основные характеристики:</div><div class="col-8 px-0" id=""></div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Количество этажей (в том числе подземных):</div><div class="col-8 px-0" id="oksfloors"></div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Количество подземных этажей:</div><div class="col-8 px-0" id="oksunderground_floors"></div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Материал стен:</div><div class="col-8 px-0" id="okselements_construct"></div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Высота:</div><div class="col-8 px-0" id="oksheight"></div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Глубина:</div><div class="col-8 px-0" id="oksdepth"></div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Протяженность:</div><div class="col-8 px-0" id="oksspread"></div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Объем:</div><div class="col-8 px-0" id="oksvolume"></div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Площадь застройки:</div><div class="col-8 px-0" id="oksarea_dev"></div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Завершение строительства:</div><div class="col-8 px-0" id="oksyear_built"></div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Ввод в эксплуатацию:</div><div class="col-8 px-0" id="oksyear_used"></div></div></li></ul>';
    return Promise.resolve(data);
};

function listResult(data) {
let result = document.getElementById('result');
result.innerHTML = '<div class="d-flex p-3"><div class="flex-grow-1" id=""></div><div><button type="button" class="btn-close" id="btn-close" aria-label="Close"></button></div></div><div id="takeorder" class="text-center p-2"></div><ul class="uk-list uk-list-striped" id="list"></ul>';
var mylist = document.getElementById("list");
for (var i = 0; i < data.resultlist; i++) {
    if (data.rent[i].attrs.address)
        {mylist.innerHTML = mylist.innerHTML + '<li class="listresult"><div><span class="p-2">' + [i+1] + '</span><span class="fw-bolder">' + data.rent[i].attrs.cn + '</span></div><div class="p-2"><span class="py-2">' + data.rent[i].type + '</span></div><div class="p-2">' + data.rent[i].attrs.address + '</div></li>';}
    else if (data.rent[i].attrs.number_zone)
        {mylist.innerHTML = mylist.innerHTML + '<li><div><span class="p-2">' + [i+1] + '</span><span class="fw-bolder">' + data.rent[i].attrs.number_zone + '</span></div><div class="p-2"><span class="py-2">' + data.rent[i].type + '</span></div><div class="p-2">' + data.rent[i].attrs.desc + '</div></li>';}
};
const liList = document.querySelectorAll('li.listresult');
console.log(liList);
liList.forEach(function(li){
li.addEventListener('click', function(){
  liList.forEach(function(el, i) {
    el.classList.remove('active')
  })
  this.classList.toggle('active');
  const form = document.querySelector("#list > li.listresult.active > div:nth-child(1) > span.fw-bolder").innerHTML;
let data = {
kadnum: form.replaceAll(' ', ''),
};
  searchObj(data);
})
});
}

function zuCommonResult(data) {
    document.getElementById('zucn').innerHTML = data.feature.attrs.cn;
    document.getElementById('zukvartalcn').innerHTML = data.feature.attrs.kvartal_cn;
    if (data.feature.attrs.parent_cn)
        {document.getElementById('zuparent_cn').innerHTML = data.feature.attrs.parent_cn;}
    document.getElementById('zuaddress').innerHTML = data.feature.attrs.address;
    document.getElementById('zuarea').innerHTML = data.feature.attrs.area_value.toLocaleString() + ' кв.м.';
    document.getElementById('zustatecd').innerHTML = data.feature.attrs.statecd;
    document.getElementById('zucategory_type').innerHTML = data.feature.attrs.category_type;
    document.getElementById('zuutil_by_doc').innerHTML = data.feature.attrs.util_by_doc;
    document.getElementById('zufp').innerHTML = data.feature.attrs.fp;
    document.getElementById('zucad_cost').innerHTML = data.feature.attrs.cad_cost.toLocaleString() + ' руб.';
    document.getElementById('zuapplication_date').innerHTML = data.feature.attrs.application_date;
    document.getElementById('zuparcel_type').innerHTML = data.feature.attrs.parcel_type;
    return Promise.resolve(data);
};

function oksCommonResult(data) {
    document.getElementById('oks_type').innerHTML = data.feature.attrs.oks_type;
    document.getElementById('okscn').innerHTML = data.feature.attrs.cn;
    document.getElementById('okskvartalcn').innerHTML = data.feature.attrs.kvartal_cn;
    document.getElementById('oksaddress').innerHTML = data.feature.attrs.address;
    document.getElementById('oksname').innerHTML = data.feature.attrs.name;
    document.getElementById('okspurpose_name').innerHTML = data.feature.attrs.purpose_name;
    document.getElementById('oksarea_value').innerHTML = data.feature.attrs.area_value.toLocaleString() + ' кв.м.';
    document.getElementById('oksstatecd').innerHTML = data.feature.attrs.statecd;
    document.getElementById('oksfp').innerHTML = data.feature.attrs.fp;
    document.getElementById('okscad_cost').innerHTML = data.feature.attrs.cad_cost.toLocaleString() + ' руб.';
    document.getElementById('oksapplication_date').innerHTML = data.feature.attrs.application_date;
    document.getElementById('oksfloors').innerHTML = data.feature.attrs.floors;
    document.getElementById('oksunderground_floors').innerHTML = data.feature.attrs.underground_floors;
    document.getElementById('oksheight').innerHTML = data.feature.attrs.height;
    document.getElementById('oksdepth').innerHTML = data.feature.attrs.depth;
    document.getElementById('oksspread').innerHTML = data.feature.attrs.spread;
    document.getElementById('oksvolume').innerHTML = data.feature.attrs.volume;
    document.getElementById('oksarea_dev').innerHTML = data.feature.attrs.area_dev;
    document.getElementById('oksyear_built').innerHTML = data.feature.attrs.year_built;
    document.getElementById('oksyear_used').innerHTML = data.feature.attrs.year_used;
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
