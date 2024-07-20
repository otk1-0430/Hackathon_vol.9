import requests
import os

# 環境変数からAPIキーを取得
api_key = os.getenv('PLACES_API_KEY')
print(api_key)
placename = input('場所の名前を入力してください: ')
def get_coordinates(api_key, placename):
    url = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json'
    params = {
        'input': placename,
        'inputtype': 'textquery',
        'key': api_key
    }
    response = requests.get(url, params=params)
    print(response.json())
    if response.status_code == 200:
        results = response.json()
        print(results)
        if len(results) > 0:
            location = results[0].get('geometry').get('location')
            return location.get('lat'), location.get('lng')
    return None, None


lat, lng = get_coordinates(api_key, placename)
print(f'INSERT INTO places (placename, latitude, longitude) VALUES {placename, lat, lng};')