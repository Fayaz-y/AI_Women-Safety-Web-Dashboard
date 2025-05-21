import cv2
import dropbox
import time
import serial
from datetime import datetime
import keys
from twilio.rest import Client
import requests
import os

def send_alert_to_server(name):
    try:
        # Make sure this IP matches your server IP
        response = requests.post("http://your_ip:5000/alert", json={"name": name}) # change your_ip to device ip address -------------
        if response.status_code == 200:
            print(f"✅ Alert sent with name: {name}")
            print("The server will redirect any open browser sessions to index1.html")
        else:
            print("❌ Failed to alert server.")
    except Exception as e:
        print(f"❌ Error: {e}")


# Load secure Dropbox token
dbx = dropbox.Dropbox(keys.dropbox_access_token)

# Generate filename with timestamp
timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
video_filename = f"captured_video_{timestamp}.mp4"
video_path = os.path.join("D:/web_dashboard/static/video", video_filename) # declare proper path to save video -----------------------

dropbox_path = f"/videos/{video_filename}"

# OpenCV Video Capture
cap = cv2.VideoCapture(0)
if not cap.isOpened():
    print("Error: Could not open camera.")
    exit()

fourcc = cv2.VideoWriter_fourcc(*'mp4v')
fps = 20.0
frame_size = (640, 480)  # Set fixed frame size

out = cv2.VideoWriter(video_path, fourcc, fps, frame_size)

start_time = time.time()
while int(time.time() - start_time) < 10:  # Record for 10 seconds
    ret, frame = cap.read()
    if not ret:
        break
    out.write(frame)
    

cap.release()
out.release()

print("🎥 Video Captured Successfully!")

# Upload File to Dropbox
with open(video_path, "rb") as file:
    dbx.files_upload(file.read(), dropbox_path, mode=dropbox.files.WriteMode("overwrite"))

print("✅ File uploaded to Dropbox!")

# Create a Shareable Link
shared_link_metadata = dbx.sharing_create_shared_link_with_settings(dropbox_path)
dropbox_link = shared_link_metadata.url

print("🔗 Dropbox File Link:", dropbox_link)

# Send SMS using Twilio
client = Client(keys.account_sid, keys.account_token)

message = client.messages.create(
    from_=keys.twilio_number,
    body=f"""Emergency alert
    Location link: https://www.google.com/maps?q=lat,long
    Video link: {dropbox_link}""",
    to=keys.my_phone_number
)
send_alert_to_server(video_filename)
print(f"📩 SMS sent! Message SID: {message.sid}")



