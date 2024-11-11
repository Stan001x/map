
 document.getElementById("form").addEventListener("submit", (e) => {
 e.preventDefault();
 searchObj();
 });


function searchObj() {

const form = document.getElementById("form");
let data = {
kadnum: form.querySelector("[name='build_kad_num']").value.replaceAll(' ', ''),
};
console.log(data);
document.getElementById('result').innerHTML = '<progress id="js-progressbar" class="uk-progress" value="1" max="100"></progress>';
progressBar();

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
console.log(data);

if (data.badresponse == 1)

    {let result = document.getElementById('result');
    result.innerHTML = '<div class="text-end p-3"><button type="button" class="btn-close" id="btn-close" aria-label="Close"></button></div><div class="p-3">Объект не найден либо сервис Росреестра не доступен. Обновите страницу и повторите запрос.</div>';
    }

else if (data.feature.type == 5)

    {let result = document.getElementById('result');
    result.innerHTML = '<div class="text-end p-3"><button type="button" class="btn-close" id="btn-close" aria-label="Close"></button></div><ul class="uk-list uk-list-striped "><li><div class="row px-2"><div class="col-4 fw-bold px-0">Вид</div><div class="col-8 px-0">' + data.features[0].attrs.oks_type + '</div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Адрес:</div><div class="col-8 px-0">' +  data.features[0].attrs.address + '</div></div></li></ul>';
    var point = new L.Point(data.features[0].center.x, data.features[0].center.y); // Lon/Lat
    var latlng = L.Projection.SphericalMercator.unproject(point);
    console.log(latlng);
    map.panTo([latlng.lat, latlng.lng], 18);
    L.marker([latlng.lat, latlng.lng]).addTo(map);}

else if (data.feature.type == 1)

    {zuResult(data).then(data => zuCommonResult(data));
    if (data.feature.center == null)
        {document.getElementById('zunoborders').innerHTML = '<span class="badge text-bg-warning">Без координат границ</span>';
        document.getElementById('takeorder').innerHTML = '<button type="button" class="btn btn-primary">Заказать межевание</button>';}
    else
        {document.getElementById('takeorder').innerHTML = '<button type="button" class="btn btn-primary">Заказать проверку границ на местности</button>';
        var point = new L.Point(data.feature.center.x, data.feature.center.y); // Lon/Lat
        var latlng = L.Projection.SphericalMercator.unproject(point);
        console.log(latlng);
        map.panTo([latlng.lat, latlng.lng], 18);
        L.marker([latlng.lat, latlng.lng]).addTo(map);}
    };
    };

function closeBtn() {
setTimeout(() => {
console.log('поехали')
document.getElementById("btn-close").addEventListener("click", (e) => {
let result = document.getElementById('result');
result.innerHTML = '';
 });
}, "5000");
};

function zuResult(data) {let result = document.getElementById('result');
    result.innerHTML = '<div class="d-flex p-3"><div class="flex-grow-1" id="zunoborders"></div><div><button type="button" class="btn-close" id="btn-close" aria-label="Close"></button></div></div><div id="takeorder" class="text-center p-2"></div><ul class="uk-list uk-list-striped" ><li><div class="row px-2"><div class="col-4 fw-bold px-0">Вид</div><div class="col-8 px-0">Земельный участок</div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Кадастровый номер</div><div class="col-8 px-0" id="zucn"></div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Кадастровый квартал</div><div class="col-8 px-0" id="zukvartalcn"></div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Адрес:</div><div class="col-8 px-0" id="zuaddress"></div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Площадь:</div><div class="col-8 px-0" id="zuarea"></div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Статус:</div><div class="col-8 px-0" id="zustatecd"></div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Категория земель</div><div class="col-8 px-0" id="zucategory_type"></div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Разрешенное использование</div><div class="col-8 px-0" id="zuutil_by_doc"></div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Форма собственности</div><div class="col-8 px-0" id="zufp"></div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Кадастровая стоимость</div><div class="col-8 px-0" id="zucad_cost"></div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Дата применения кадастровой стоимости</div><div class="col-8 px-0" id="zuapplication_date"></div></div></li></ul>';
    console.log('Функция zuResult выполнена')
    return Promise.resolve(data);
};

function zuCommonResult(data) {
    console.log('Данные');
    console.log(data);
    console.log(document.getElementById('result'))
    document.getElementById('zucn').innerHTML = data.feature.attrs.cn;
    document.getElementById('zukvartalcn').innerHTML = data.feature.attrs.kvartal_cn;
    document.getElementById('zuaddress').innerHTML = data.feature.attrs.address;
    document.getElementById('zuarea').innerHTML = data.feature.attrs.area_value;
    document.getElementById('zustatecd').innerHTML = data.feature.attrs.statecd;
    document.getElementById('zucategory_type').innerHTML = data.feature.attrs.category_type;
    document.getElementById('zuutil_by_doc').innerHTML = data.feature.attrs.util_by_doc;
    document.getElementById('zufp').innerHTML = data.feature.attrs.fp;
    document.getElementById('zucad_cost').innerHTML = data.feature.attrs.cad_cost;
    document.getElementById('zuapplication_date').innerHTML = data.feature.attrs.application_date;
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