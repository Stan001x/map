from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from rosreestr_api.clients.rosreestr import PKKRosreestrAPIClient, RosreestrAPIClient, AddressWrapper
import requests
import json
import ssl
from tests import pkk_client_fixtures
from django.views.generic import TemplateView

api_client = PKKRosreestrAPIClient()


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
        cadastral_id = request.POST.get("build_kad_num")
        build_kad_num = json.loads(request.body)
        print(build_kad_num)
        search_params = {
            'cadastral_id': build_kad_num['new_kadnum'], 'limit': 10, 'tolerance': 170}
        url = api_client.SEARCH_BUILDING_BY_CADASTRAL_ID_URL.format(**search_params)
        url1 = api_client.SEARCH_PARCEL_BY_CADASTRAL_ID_URL.format(**search_params)
        CONTENT_TYPE_JSON = 'application/json'

        print(url)
        a = _strip_cadastral_id(build_kad_num['new_kadnum'])
        print(a)

        data = api_client.get_building_by_cadastral_id(**search_params)
        data1 = api_client.get_parcel_by_cadastral_id(**search_params)
        print(data['total'])
        print(data1['total'])
        print(data1)
        if data['total'] == 1:
            return JsonResponse(data, safe=False)
        return JsonResponse(data1, safe=False)

       # print(f'{PKKRosreestrAPIClient.BASE_URL}/features/1/{cadastral_id}')
       # url = f'{PKKRosreestrAPIClient.BASE_URL}/features/1/?text={cadastral_id}&tolerance=1&limit=11'
       # print(url)
       # headers = {'accept': 'application/json, text/plain, */*'}
       # response = requests.request("GET", url, headers=headers, verify=False)
       # data = json.loads(response.text)
       # print(data['feature']['attrs']['address'])

    return render(request, 'pkk/pkk.html')

def pk(request):
    return render(request,'pkk/pk.html')

def pks(request):
    return render(request,'pkk/pks.html')
