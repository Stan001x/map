from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from fake_useragent import UserAgent
from rosreestr_api.clients.rosreestr import PKKRosreestrAPIClient, RosreestrAPIClient, AddressWrapper
import requests
import json, re
from tests import pkk_client_fixtures
from django.views.generic import TemplateView
from bs4 import BeautifulSoup
from PIL import Image
from io import BytesIO


api_client = PKKRosreestrAPIClient()

zudict = {'003001000000': 'Земли сельскохозяйственного назначения',
          '003002000000': 'Земли населенных пунктов',
          '003003000000': 'Земли промышленности, энергетики, транспорта, связи, радиовещания, телевидения, информатики, земли для обеспечения космической деятельности, земли обороны, безопасности и земли иного специального назначения',
          '003004000000': 'Земли особо охраняемых территорий и объектов',
          '003005000000': 'Земли лесного фонда',
          '003006000000': 'Земли водного фонда',
          '003007000000': 'Земли запаса',
          '003008000000': 'Категория не установлена'}

statusdict = {'01': 'Ранее учтенный',
          '06': 'Учтенный',
              }

rightsdict = {100: 'Частная собственность',
              200: 'Собственность публично-правовых образований'}

parceltypedict = {'parcel': '',
                  'parcel_mzu': 'Контуры МКЗУ',
                  'parcel_ez': 'Земельные участки ЕЗП'}

okstypedict = {'construction': 'Сооружение',
               'incomplete': 'Объект незавершенного строительства',
                  'building': 'Здание'}

typedict = {1: 'Земельный участок',
            5: 'Объект капитального строительства',
            6: 'Территориальная зона'}

areatypedict = {"009": 'уточненная',
            "008": 'декларированная',}

def _strip_cadastral_id(cadastral_id):
    stripped_cadastral_id = []
    cadastral_id = cadastral_id.split(':')
    for part in cadastral_id:
        if part:
            stripped_cadastral_id.append(part[:-1].lstrip('0') + part[-1])
    return ':'.join(stripped_cadastral_id)

def home(request):
    return render(request,'pkk/home.html')


def pkk(request):


    if request.method == 'POST':
        api_client = PKKRosreestrAPIClient()
        #cadastral_id = request.POST.get("build_kad_num")
        build_kad_num = _strip_cadastral_id(json.loads(request.body)['new_kadnum'])
        if re.fullmatch(r'\d{1,2}:\d{1,2}:\d{1,7}:\d*', build_kad_num):
            print(build_kad_num)
            search_params = {
                'cadastral_id': build_kad_num, }
            url = api_client.SEARCH_INFO_BUILDING_BY_CADASTRAL_ID_URL.format(**search_params)
            url1 = api_client.SEARCH_INFO_PARCEL_BY_CADASTRAL_ID_URL.format(**search_params)
            CONTENT_TYPE_JSON = 'application/json'

            print(url)
            print(url1)

            try:
                data5 = api_client.get_info_building_by_cadastral_id(**search_params)
                data1 = api_client.get_info_parcel_by_cadastral_id(**search_params)
            except:
                data = {'badresponse': 'Объект не найден либо сервис Росреестра не доступен. Обновите страницу и повторите запрос.'}
                print('ошибка сервера')
                return JsonResponse(data, safe=False)
            else:
                print(data5)
                print(data1)
                if (data5['feature'] is None) and (data1['feature'] is None):
                    data = {'badresponse': 'Кадастровый номер не существует'}
                    return JsonResponse(data, safe=False)
                elif data5['feature'] is not None:
                    if data5['feature']['type'] == 5:
                        if data5['feature']['attrs']['statecd'] in statusdict:
                            a = data5['feature']['attrs']['statecd']
                            data5['feature']['attrs']['statecd'] = statusdict[a]
                            print(data5['feature']['attrs']['statecd'])
                        if data5['feature']['attrs']['fp'] in rightsdict:
                            a = data5['feature']['attrs']['fp']
                            data5['feature']['attrs']['fp'] = rightsdict[a]
                            print(data5['feature']['attrs']['fp'])
                        if data5['feature']['attrs']['oks_type'] in okstypedict:
                            a = data5['feature']['attrs']['oks_type']
                            data5['feature']['attrs']['oks_type'] = okstypedict[a]
                            print(data5['feature']['attrs']['oks_type'])
                        return JsonResponse(data5, safe=False)
                elif data1['feature'] is not None:
                    if data1['feature']['type'] == 1:
                        if data1['feature']['attrs']['category_type'] in zudict:
                            a = data1['feature']['attrs']['category_type']
                            data1['feature']['attrs']['category_type'] = zudict[a]
                        if data1['feature']['attrs']['statecd'] in statusdict:
                            a = data1['feature']['attrs']['statecd']
                            data1['feature']['attrs']['statecd'] = statusdict[a]
                            print(data1['feature']['attrs']['statecd'])
                        if data1['feature']['attrs']['fp'] in rightsdict:
                            a = data1['feature']['attrs']['fp']
                            data1['feature']['attrs']['fp'] = rightsdict[a]
                            print(data1['feature']['attrs']['fp'])
                        if data1['feature']['attrs']['parcel_type'] in parceltypedict:
                            a = data1['feature']['attrs']['parcel_type']
                            data1['feature']['attrs']['parcel_type'] = parceltypedict[a]
                            print(data1['feature']['attrs']['parcel_type'])
                        if data1['feature']['attrs']['area_type'] in areatypedict:
                            a = data1['feature']['attrs']['area_type']
                            data1['feature']['attrs']['area_type'] = areatypedict[a]
                            print(data1['feature']['attrs']['area_type'])
                        return JsonResponse(data1, safe=False)
                    else:
                        print('xren')

                    return JsonResponse(data1, safe=False)

                data = {'badresponse': 'Объект не найден либо сервис Росреестра не доступен. Обновите страницу и повторите запрос.'}
                return JsonResponse(data, safe=False)
        elif re.fullmatch(r'\d\d\.\d*,[1]?\d{2}\.\d*', build_kad_num):
            a = build_kad_num.split(",")
            if (float(a[0]) < 41.185) or (float(a[0]) > 81.843) or (float(a[1]) < 19.638) or (float(a[1]) > 180):
                data = {'badresponse': 'Данные по координатам не найдены.'}
                return JsonResponse(data, safe=False)
            lat = build_kad_num.split(",")[0]
            long = build_kad_num.split(",")[1]
            search_params = {
                'lat': lat, 'long': long,
                'limit': 20, 'tolerance': 4}
            url1 = api_client.SEARCH_PARCEL_BY_COORDINATES_URL.format(**search_params)
            url5 = api_client.SEARCH_BUILDING_BY_COORDINATES_URL.format(**search_params)
            url6 = api_client.SEARCH_TERZONE_BY_COORDINATES_URL.format(**search_params)

            print(url1)
            print(url5)
            print(url6)
            try:
                data1 = api_client.get_parcel_by_coordinates(**search_params)
                data5 = api_client.get_building_by_coordinates(**search_params)
                data6 = api_client.get_terzone_by_coordinates(**search_params)
                resultlist = []
                for i in data1['features']:
                    print(i)
                    resultlist.append(i)
                for i in data5['features']:
                    print(i)
                    resultlist.append(i)
                for i in data6['features']:
                    print(i)
                    resultlist.append(i)
                if len(resultlist) > 0:
                    for i in resultlist:
                        if i['type'] in typedict:
                            a = i['type']
                            i['type'] = typedict[a]

                    data = {'resultlist': len(resultlist), 'rent': resultlist, 'feature': {'type': 'list',}, 'lat': lat, 'lng': long}
                    return JsonResponse(data, safe=False)
                else:
                    data = {'badresponse': 'Объект не найден либо сервис Росреестра не доступен. Обновите страницу и повторите запрос.', 'lat': lat, 'lng': long}
                    print('объекты не найдены')
                    return JsonResponse(data, safe=False)

            except:
                data = {'badresponse': 'Объект не найден либо сервис Росреестра не доступен. Обновите страницу и повторите запрос.', 'lat': lat, 'lng': long}
                print('ошибка сервера')
                return JsonResponse(data, safe=False)

            data = {'badresponse': 'Получены координаты.'}
            return JsonResponse(data, safe=False)

        data = {'badresponse': 'Кадастровый номер не существует.'}
        return JsonResponse(data, safe=False)
    return render(request, 'pkk/pkk.html')

def pk(request):
    return render(request,'pkk/pk.html')

def pks(request):
    return render(request,'pkk/pks.html')

async def tiles(request):
        if request.method == 'GET':
            a = request.GET['bbox']
            search_params = {'bboxsr': 102100,'bbox': a}
            urltile = api_client.SEARCH_TILES_URL.format(**search_params)
            datatile = api_client.get_tiles(**search_params)
            #context = ssl._create_unverified_context()
            #context.set_ciphers('ALL:@SECLEVEL=1')
            #print('start')
            #async with httpx.AsyncClient(verify=context) as client:
             #   response = await client.get(url, headers=headers)
            return HttpResponse(datatile)


