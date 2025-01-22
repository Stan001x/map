import threading
import queue
import time

from django.http import HttpResponse
from rosreestr_api.clients.rosreestr import TileRosreestrAPIClient


tile_api_client = TileRosreestrAPIClient()

q = queue.Queue()

def worker():
    while True:
        search_params = q.get()
        print(f'Working on {search_params}')
        datatile = tile_api_client.get_tiles(**search_params)  # Do any processing here.
        print(f'Finished {search_params}')
        #q.task_done()
        return HttpResponse(datatile, content_type="image/png")

# Five threads are set up to parallelize the process.
for _ in range(50):
    threading.Thread(target=worker, daemon=True).start()

def add(search_params):
    q.put(search_params)