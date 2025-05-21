from flask import Flask, request, redirect, render_template, Response
import webbrowser
import threading
import cv2
from playsound import playsound

app = Flask(__name__)

# Initialize camera
camera = cv2.VideoCapture(1)

# Set FHD resolution
camera.set(cv2.CAP_PROP_FRAME_WIDTH, 1920)
camera.set(cv2.CAP_PROP_FRAME_HEIGHT, 1080)

# Enable auto exposure
camera.set(cv2.CAP_PROP_AUTO_EXPOSURE, 0.75)  # 0.25 = manual, 0.75 = auto

# Enable auto focus (if supported)
camera.set(cv2.CAP_PROP_AUTOFOCUS, 1)  # 1 = auto, 0 = manual

# Flag to track if alert was received
alert_received = False
alert_name = "Unknown"

# Streaming function
def generate_frames():
    while True:
        success, frame = camera.read()
        if not success:
            break
        else:
            encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 95]
            ret, buffer = cv2.imencode('.jpg', frame, encode_param)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

# Home page
@app.route('/')
def index():
    global alert_received
    # If alert was received, redirect to welcome page

    return render_template('index.html')

# Video feed endpoint
@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

# Welcome page - renders index1.html
@app.route('/welcome')
def welcome():
    playsound(r"alarm_audio_path") # Declare alarm file path ------------------------------------------------------------------
    return render_template('index1.html',link=alert_name,location=loc)

from flask import send_from_directory

@app.route('/static/video/<path:filename>')
def custom_static_video(filename):
    return send_from_directory('static/video', filename)


# Violence alert endpoint
@app.route('/alert', methods=['POST'])
def alert():
    global alert_received, alert_name ,loc
    data = request.get_json()
    alert_name = data.get("name", "Unknown")
    loc = data.get("loc","Unknown")
    print(f"🚨 ALERT: Violence Detected by {alert_name}")
    print(f"🚨 ALERT: Violence Detected by {loc}")
    # Set the flag that an alert was received
    alert_received = True
    
    # Return success response with redirect URL to be used by JavaScript
    return {"status": "success", "redirect": "/welcome"}, 200

# Add a new endpoint to check alert status
@app.route('/check_alert')
def check_alert():
    global alert_received
    if alert_received:
        alert_received = False  # Reset the flag after checking
        return {"redirect": True, "url": "/welcome"}, 200
    return {"redirect": False}, 200

if __name__ == '__main__':
    app.run(host='your_ip', port=5000, debug=False) # change your_ip to device ip address ----------------------------------------