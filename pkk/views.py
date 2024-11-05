from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from rosreestr_api.clients.rosreestr import PKKRosreestrAPIClient, RosreestrAPIClient, AddressWrapper
import requests
import json
import ssl
from tests import pkk_client_fixtures
from django.views.generic import TemplateView

api_client = PKKRosreestrAPIClient()


def home(request):
    return render(request,'pkk/home.html')


def pkk(request):
    if request.method == 'POST':
        api_client = PKKRosreestrAPIClient()
        cadastral_id = request.POST.get("build_kad_num")
        print(cadastral_id)
        search_params = {
            'cadastral_id': cadastral_id, 'limit': 1, 'tolerance': 170}
        url = api_client.SEARCH_BUILDING_BY_CADASTRAL_ID_URL.format(**search_params)
        CONTENT_TYPE_JSON = 'application/json'
        print(url)

        data = api_client.get_building_by_cadastral_id(**search_params)
        print(data)
        dd = {'name': 'name', 'email': 'email', 'subject': 'subject'}

       # print(f'{PKKRosreestrAPIClient.BASE_URL}/features/1/{cadastral_id}')
       # url = f'{PKKRosreestrAPIClient.BASE_URL}/features/1/?text={cadastral_id}&tolerance=1&limit=11'
       # print(url)
       # headers = {'accept': 'application/json, text/plain, */*'}
       # response = requests.request("GET", url, headers=headers, verify=False)
       # data = json.loads(response.text)
       # print(data['feature']['attrs']['address'])
        return JsonResponse(dd, safe=False)
    return render(request, 'pkk/pkk.html')

def pk(request):
    return render(request,'pkk/pk.html')

def pks(request):
    return render(request,'pkk/pks.html')
