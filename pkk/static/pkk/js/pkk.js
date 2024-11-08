
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
}).then(response => {return response.json()}).then((data) => serverResponse(data)).then(closeBtn());

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

    {let result = document.getElementById('result');
    result.innerHTML = '<div class="text-end p-3"><button type="button" class="btn-close" id="btn-close" aria-label="Close"></button></div><ul class="uk-list uk-list-striped" ><li><div class="row px-2"><div class="col-4 fw-bold px-0">Вид</div><div class="col-8 px-0">Земельный участок</div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Кадастровый номер</div><div class="col-8 px-0">' + data.feature.attrs.cn + '</div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Адрес:</div><div class="col-8 px-0">' +  data.feature.attrs.address + '</div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Площадь:</div><div class="col-8 px-0">' +  data.feature.attrs.area_value + '</div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Статус:</div><div class="col-8 px-0">' +  data.feature.attrs.statecd + '</div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Категория земель</div><div class="col-8 px-0">' + data.feature.attrs.category_type + '</div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Разрешенное использование</div><div class="col-8 px-0">' + data.feature.attrs.util_by_doc + '</div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Форма собственности</div><div class="col-8 px-0">' + data.feature.attrs.fp + '</div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Кадастровая стоимость</div><div class="col-8 px-0">' + data.feature.attrs.cad_cost + '</div></div></li><li><div class="row px-2"><div class="col-4 fw-bold px-0">Дата применения кадастровой стоимости</div><div class="col-8 px-0">' + data.feature.attrs.application_date + '</div></div></li></ul>';
    var point = new L.Point(data.feature.center.x, data.feature.center.y); // Lon/Lat
    var latlng = L.Projection.SphericalMercator.unproject(point);
    console.log(latlng);
    map.panTo([latlng.lat, latlng.lng], 18);
    L.marker([latlng.lat, latlng.lng]).addTo(map);}

else
    {let result = document.getElementById('result');
    result.innerHTML = '<div class="text-end p-3"><button type="button" class="btn-close" id="btn-close" aria-label="Close"></button></div><div class="p-3">Объект не найден либо сервис Росреестра не доступен. Обновите страницу и повторите запрос.</div>';
    }
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