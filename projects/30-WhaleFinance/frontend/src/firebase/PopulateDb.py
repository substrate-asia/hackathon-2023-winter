import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
import requests
from dotenv import load_dotenv
import os
from datetime import date

load_dotenv()

# Initialize the app with a service account, granting admin privileges
cred = credentials.Certificate('whale-finance-firebase-admin.json')
firebase_admin.initialize_app(cred, {
    'databaseURL': os.getenv('VITE_DATABASE_URL')
})

def get_bitcoin_price(date, key):
    try:
        response = requests.get('https://api.coingecko.com/api/v3/coins/bitcoin/history', params={'date': date, 'localization': False})
        response.raise_for_status()
        
        price_data = response.json()['market_data']['current_price']['usd']
        formatted_date = '-'.join(date.split('-')[::-1])

        data_to_write = {
            "bmId": 300001,
            "value": price_data,
            "date": formatted_date
        }

        # Push data to Firebase
        ref = db.reference(f'BenchmarkValue/{key}')
        ref.set(data_to_write)
        
        print(f"Bitcoin price on {date}: ${price_data}")
    except requests.exceptions.RequestException as e:
        print(f"An error occurred while fetching data: {e}")
    except Exception as e:
        print(f"An error occurred: {e}")

def get_last_query():
    try:
        # Get a reference to the BenchmarkValue table
        ref = db.reference('BenchmarkValue')

        # Get the last entry (assuming entries are ordered by 'date')
        snapshot = ref.order_by_child('date').limit_to_last(1).get()

        items_list = list(snapshot.items())
        if items_list:
            key, value = items_list[0]
        else:
            raise ValueError("No items found")

    except Exception as e:
        print(f"An error occurred while fetching the last query: {e}")
        return None, None

    return key, value

# Get Bitcoin price at the end of a specific day (format: dd-mm-yyyy)

key, value = get_last_query()
str(int(key)+1)

# date_value = value.get('date')
# formatted_date = '-'.join(date.split('-')[::-1])
# print(f"Formatted date: {formatted_date}")

today_date = date.today()
today_str = today_date.strftime('%d-%m-%Y')

get_bitcoin_price(today_str, key)