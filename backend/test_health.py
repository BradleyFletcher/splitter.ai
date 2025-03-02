import requests
import sys

def check_health():
    try:
        response = requests.get('http://localhost:8000/health')
        if response.status_code == 200:
            print('✅ Backend service is healthy')
            data = response.json()
            print(f'Status: {data["status"]}')
            return True
        else:
            print('❌ Backend service returned an error')
            print(f'Status code: {response.status_code}')
            return False
    except requests.exceptions.ConnectionError:
        print('❌ Could not connect to backend service')
        print('Make sure the service is running on http://localhost:8000')
        return False

if __name__ == '__main__':
    success = check_health()
 