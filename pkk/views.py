import random, datetime, asyncio
from lib2to3.fixes.fix_input import context
from random import random
from pkk.tile import add as tile_add


from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, get_object_or_404
from fake_useragent import UserAgent
from rosreestr_api.clients.rosreestr import PKKRosreestrAPIClient, RosreestrAPIClient, AddressWrapper, TileRosreestrAPIClient
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
import json, re
from django.views.generic import TemplateView
from .models import Regions
from asgiref.sync import sync_to_async


api_client = PKKRosreestrAPIClient()
tile_api_client = TileRosreestrAPIClient()


# @sync_to_async
# def get_building_tile(search_params):
#     buildingtile = tile_api_client.get_tiles(**search_params)
#     return HttpResponse(buildingtile, content_type="image/png")

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

def get_data(build_kad_num):
    api_client = PKKRosreestrAPIClient()
    if re.fullmatch(r'\d{1,2}:\d{1,2}:\d{1,7}:\d*', build_kad_num):
        search_params = {
            'cadastral_id': build_kad_num, }
        CONTENT_TYPE_JSON = 'application/json'

        try:
            data = api_client.get_object_by_cadastral_id(**search_params)
        except:
            data = {'badresponse': 'Объект не найден либо сервис Росреестра не доступен. Обновите страницу и повторите запрос.'}
            print('ошибка сервера')
            return JsonResponse(data, safe=False)
        else:
            print(data)
            if (data.get('code') is not None) and (data['code'] == 204):
                data = {'badresponse': 'Кадастровый номер не существует'}
                return JsonResponse(data, safe=False)
            elif data['data'] is not None:
                return JsonResponse(data['data']['features'][0], safe=False)

            data = {'badresponse': 'Объект не найден либо сервис Росреестра не доступен. Обновите страницу и повторите запрос.'}
            return JsonResponse(data, safe=False)
    elif re.fullmatch(r'\d{7,8}\.\d*,\d{7,8}\.\d*', build_kad_num):
        print(datetime.datetime.now().time())
        a = build_kad_num.split(",")
        if (float(a[1]) < 5039708) or (float(a[1]) > 16843470) or (float(a[0]) < 2186184) or (float(a[0]) > 21250294):
            data = {'badresponse': 'Данные по координатам не найдены.'}
            return JsonResponse(data, safe=False)
        lat = build_kad_num.split(",")[0]
        long = build_kad_num.split(",")[1]
        print(lat, long)
        b = random()
        bbox = str(float(lat) - 200) + ',' + str(float(long) - 200) + ',' + str(float(lat)+200) + ',' + str(float(long)+200)
        print(bbox)
        search_params_building = {
            'layer': '36049', 'random': b,
            'bbox': bbox}
        url1 = api_client.SEARCH_BUILDING_BY_COORDINATES_URL.format(**search_params_building)
        print(url1)
        search_params_parcel = {
            'layer': '36048', 'random': b,
            'bbox': bbox}

        try:
            data1 = api_client.get_building_by_coordinates(**search_params_building)
            data2 = api_client.get_parcel_by_coordinates(**search_params_parcel)
            data6 = 'api_client.get_terzone_by_coordinates(**search_params)'
            resultlist = []
            if type(data1) == dict:
                for i in data1['features']:
                    print(i)
                    i['realty_type'] = i['properties']['options']['build_record_type_value']
                    resultlist.append(i)
            if type(data2) == dict:
                for i in data2['features']:
                    print(i)
                    i['realty_type'] = i['properties']['options']['land_record_type']
                    resultlist.append(i)
            if type(data6) == dict:
                for i in data6['features']:
                    print(i)
                    resultlist.append(i)
            if len(resultlist) > 0:

                data = {'resultlist': len(resultlist), 'rent': resultlist, 'properties': {'category': 'list',}, 'lat': lat, 'lng': long}
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
        print(datetime.datetime.now().time())
        api_client = PKKRosreestrAPIClient()
        build_kad_num = json.loads(request.body)['new_kadnum']
        if re.fullmatch(r'\d{1,2}:\d{1,2}:\d{1,7}:\d*', build_kad_num):
            print(build_kad_num)
            search_params = {
                'cadastral_id': build_kad_num, }
            CONTENT_TYPE_JSON = 'application/json'

            try:
                data = api_client.get_object_by_cadastral_id(**search_params)
            except:
                data = {'badresponse': 'Объект не найден либо сервис Росреестра не доступен. Обновите страницу и повторите запрос.'}
                print('ошибка сервера')
                return JsonResponse(data, safe=False)
            else:
                print(data)
                if (data.get('code') is not None) and (data['code'] == 204):
                    data = {'badresponse': 'Кадастровый номер не существует'}
                    return JsonResponse(data, safe=False)
                elif data['data'] is not None:
                    return JsonResponse(data['data']['features'][0], safe=False)
                #     if data['feature']['type'] == 5:
                #         if data['feature']['attrs']['statecd'] in statusdict:
                #             a = data['feature']['attrs']['statecd']
                #             data['feature']['attrs']['statecd'] = statusdict[a]
                #             print(data['feature']['attrs']['statecd'])
                #         if data['feature']['attrs']['fp'] in rightsdict:
                #             a = data['feature']['attrs']['fp']
                #             data['feature']['attrs']['fp'] = rightsdict[a]
                #             print(data['feature']['attrs']['fp'])
                #         if data['feature']['attrs']['oks_type'] in okstypedict:
                #             a = data['feature']['attrs']['oks_type']
                #             data['feature']['attrs']['oks_type'] = okstypedict[a]
                #             print(data['feature']['attrs']['oks_type'])
                #         return JsonResponse(data, safe=False)
                # elif data1['feature'] is not None:
                #     if data1['feature']['type'] == 1:
                #         if data1['feature']['attrs']['category_type'] in zudict:
                #             a = data1['feature']['attrs']['category_type']
                #             data1['feature']['attrs']['category_type'] = zudict[a]
                #         if data1['feature']['attrs']['statecd'] in statusdict:
                #             a = data1['feature']['attrs']['statecd']
                #             data1['feature']['attrs']['statecd'] = statusdict[a]
                #             print(data1['feature']['attrs']['statecd'])
                #         if data1['feature']['attrs']['fp'] in rightsdict:
                #             a = data1['feature']['attrs']['fp']
                #             data1['feature']['attrs']['fp'] = rightsdict[a]
                #             print(data1['feature']['attrs']['fp'])
                #         if data1['feature']['attrs']['parcel_type'] in parceltypedict:
                #             a = data1['feature']['attrs']['parcel_type']
                #             data1['feature']['attrs']['parcel_type'] = parceltypedict[a]
                #             print(data1['feature']['attrs']['parcel_type'])
                #         if data1['feature']['attrs']['area_type'] in areatypedict:
                #             a = data1['feature']['attrs']['area_type']
                #             data1['feature']['attrs']['area_type'] = areatypedict[a]
                #             print(data1['feature']['attrs']['area_type'])
                #         return JsonResponse(data1, safe=False)
                #     else:
                #         print('xren')

                #    return JsonResponse(data1, safe=False)

                data = {'badresponse': 'Объект не найден либо сервис Росреестра не доступен. Обновите страницу и повторите запрос.'}
                return JsonResponse(data, safe=False)
        elif re.fullmatch(r'\d{7,8}\.\d*,\d{7,8}\.\d*', build_kad_num):
            print(datetime.datetime.now().time())
            a = build_kad_num.split(",")
            if (float(a[0]) < 5039708) or (float(a[0]) > 16843470) or (float(a[1]) < 2186184) or (float(a[1]) > 21250294):
                data = {'badresponse': 'Данные по координатам не найдены.'}
                return JsonResponse(data, safe=False)
            lat = build_kad_num.split(",")[0]
            long = build_kad_num.split(",")[1]
            print(lat, long)
            b = random()
            bbox = str(float(lat) - 200) + ',' + str(float(long) - 200) + ',' + str(float(lat)+200) + ',' + str(float(long)+200)
            print(bbox)
            search_params_building = {
                'layer': '36049', 'random': b,
                'bbox': bbox}
            url1 = api_client.SEARCH_BUILDING_BY_COORDINATES_URL.format(**search_params_building)
            print(url1)
            search_params_parcel = {
                'layer': '36048', 'random': b,
                'bbox': bbox}
            #url6 = 'api_client.SEARCH_TERZONE_BY_COORDINATES_URL.format(**search_params)'

            try:
                data1 = api_client.get_building_by_coordinates(**search_params_building)
                data2 = api_client.get_parcel_by_coordinates(**search_params_parcel)
                data6 = 'api_client.get_terzone_by_coordinates(**search_params)'
                resultlist = []
                if type(data1) == dict:
                    for i in data1['features']:
                        print(i)
                        i['realty_type'] = i['properties']['options']['build_record_type_value']
                        resultlist.append(i)
                if type(data2) == dict:
                    for i in data2['features']:
                        print(i)
                        i['realty_type'] = i['properties']['options']['land_record_type']
                        resultlist.append(i)
                if type(data6) == dict:
                    for i in data6['features']:
                        print(i)
                        resultlist.append(i)
                if len(resultlist) > 0:
                #     for i in resultlist:
                #         if i['type'] in typedict:
                #             a = i['type']
                #             i['type'] = typedict[a]

                    data = {'resultlist': len(resultlist), 'rent': resultlist, 'properties': {'category': 'list',}, 'lat': lat, 'lng': long}
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

def pkk_regions_by_slug(request, regions_slug):
    region = get_object_or_404(Regions, slug=regions_slug)
    context = {'region': region}
    if request.method == 'POST':
        build_kad_num = json.loads(request.body)['new_kadnum']
        return get_data(build_kad_num)

    return render(request, 'pkk/region.html', context=context)

async def tiles(request):
        if request.method == 'GET':
            a = request.GET['bbox']
            b = random()
            layer = 36048
            search_params = {'layer': layer, 'random': b,'bbox': a}
            #print("получаю тайл")
            #urltile = tile_api_client.SEARCH_TILES_URL.format(**search_params)
            #datatile  = tile_add(search_params)
            #print(f'"тип объекта: " + {type(datatile)}')
            datatile = await asyncio.create_task(tile_api_client.get_tiles(**search_params))
            #context = ssl._create_unverified_context()
            #context.set_ciphers('ALL:@SECLEVEL=1')
            #print('start')
            #async with httpx.AsyncClient(verify=context) as client:
             #   response = await client.get(url, headers=headers)
            return HttpResponse(datatile, content_type="image/png")


async def parceltext(request):
    if request.method == 'GET':
        a = request.GET['bbox']
        b = random()
        layer = 36327
        search_params = {'layer': layer, 'random': b, 'bbox': a}
        parceltexttile = await asyncio.create_task(tile_api_client.get_tiles(**search_params))
        return HttpResponse(parceltexttile, content_type="image/png")

async def building(request):
    if request.method == 'GET':
        a = request.GET['bbox']
        b = random()
        layer = 36049
        search_params = {'layer': layer, 'random': b, 'bbox': a}
        buildingtile = await asyncio.create_task(tile_api_client.get_tiles(**search_params))
        return HttpResponse(buildingtile, content_type="image/png")


async def construction(request):
    if request.method == 'GET':
        a = request.GET['bbox']
        b = random()
        layer = 36328
        search_params = {'layer': layer, 'random': b, 'bbox': a}
        tile = await asyncio.create_task(tile_api_client.get_tiles(**search_params))
        return HttpResponse(tile, content_type="image/png")


async def uncomplite(request):
    if request.method == 'GET':
        a = request.GET['bbox']
        b = random()
        layer = 36329
        search_params = {'layer': layer, 'random': b, 'bbox': a}
        tile = await asyncio.create_task(tile_api_client.get_tiles(**search_params))
        return HttpResponse(tile, content_type="image/png")