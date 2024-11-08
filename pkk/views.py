from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from rosreestr_api.clients.rosreestr import PKKRosreestrAPIClient, RosreestrAPIClient, AddressWrapper
import requests
import json
import ssl
from tests import pkk_client_fixtures
from django.views.generic import TemplateView

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
            data = {'badresponse': '1'}
            print('ошибка сервера')
            return JsonResponse(data, safe=False)
        else:
            print(data5)
            print(data1)
            if data5['feature'] is not None:
                if data5['feature']['type'] == 5:
                    print('ОКС')
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
                    return JsonResponse(data1, safe=False)
                else:
                    print('xren')

                return JsonResponse(data1, safe=False)

            data = {'badresponse': '1'}
            return JsonResponse(data, safe=False)

    return render(request, 'pkk/pkk.html')

def pk(request):
    return render(request,'pkk/pk.html')

def pks(request):
    return render(request,'pkk/pks.html')