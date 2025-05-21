import requests
import webbrowser

def send_alert_to_server(name="Fayaz"):
    try:
        # Make sure this IP address matches your Flask app's host
        server_url = "http://your_ip:5000/alert:5000" # change your_ip to device ip address -------------
        
        # Send the alert to the server
        response = requests.post(f"{server_url}/alert", json={"name": name}, allow_redirects=False)
        
        if response.status_code == 302:  # HTTP redirect status code
            # Get the redirect location
            redirect_location = response.headers.get('Location')
            redirect_url = f"{server_url}{redirect_location}"
            
            print(f"✅ Alert sent with name: {name}")
            print(f"Opening redirect URL: {redirect_url}")
            
            # Open the redirect URL in a web browser
            webbrowser.open(redirect_url)
        else:
            print(f"✅ Alert sent with name: {name}")
            print(f"Response status: {response.status_code}")
    except Exception as e:
        print(f"❌ Error: {e}")

# Execute the function
send_alert_to_server("Fayaz")  # <- your name here