import requests
import json
import time

# API Endpoint
url = "https://api.myscheme.gov.in/search/v4/schemes"

# Headers
headers = {
    'accept': 'application/json, text/plain, */*',
    'accept-language': 'en-US,en;q=0.9,hi;q=0.8,th;q=0.7',
    'origin': 'https://www.myscheme.gov.in',
    'priority': 'u=1, i',
    'sec-ch-ua': '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Linux"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-site',
    'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
    'x-api-key': 'tYTy5eEhlu9rFjyxuCr7ra7ACp4dv1RH8gWuHTDc',
}

# Pagination Variables
all_schemes = []
current_offset = 0
page_size = 10

while True:
    # Parameters for the request
    params = {
        'lang': 'en',
        'q': '[{"identifier":"disability","value":"Yes"},{"identifier":"schemeCategory","value":"Social welfare & Empowerment"}]',
        'keyword': '',
        'sort': '',
        'from': str(current_offset),
        'size': str(page_size),
    }

    # Make the API Request
    response = requests.get(url, params=params, headers=headers)

    # Check for successful response
    if response.status_code != 200:
        print(f"Error: Received status code {response.status_code}")
        break

    # Parse JSON response
    data = response.json()

    # Print request parameters
    print(f"\nFetching schemes with parameters:")
    print(f"Offset: {current_offset}")
    print(f"Page size: {page_size}")
    # print(f"URL params: {params}")

    # Extract schemes
    schemes = data.get("data", {}).get("hits", {}).get("items", [])

    # Print number of schemes fetched
    print(f"Fetched {len(schemes)} schemes in this request")
    print(f"Total schemes collected so far: {len(all_schemes)}")

    # If no more records, stop fetching
    if not schemes:
        break

    # Append the results
    all_schemes.extend(schemes)

    # If the returned data is less than page_size, stop fetching
    if len(schemes) < page_size:
        break

    # Move to the next batch
    current_offset += page_size

    # Sleep to avoid excessive API requests
    time.sleep(1)

# Save results to JSON file
with open("myscheme_schemes.json", "w", encoding="utf-8") as file:
    json.dump(all_schemes, file, indent=4, ensure_ascii=False)

print(f"Saved {len(all_schemes)} records to myscheme_schemes.json")
