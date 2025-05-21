let alertActive = false;

function showAlert(location, cameraId, cameraFeed) {
    document.getElementById('alertLocation').textContent = location;
    document.getElementById('cameraInfo').textContent = `Camera ID: ${cameraId}`;
    document.getElementById('alertTime').textContent = `Time: ${new Date().toLocaleString()}`;
    document.getElementById('alertFeed').src = cameraFeed;
    alertActive = true;
    playAlertSound();
}

function dismissAlert() {
    if (confirm('Are you sure you want to dismiss this alert?')) {
        stopAlertSound();
        alertActive = false;
        window.close();
    }
}

function showDispatchDialog() {
    document.getElementById('dispatchDialog').style.display = 'flex';
    document.getElementById('dispatchPassword').focus();
    document.getElementById('passwordError').textContent = '';
}

function closeDispatchDialog() {
    document.getElementById('dispatchDialog').style.display = 'none';
    document.getElementById('dispatchPassword').value = '';
    document.getElementById('passwordError').textContent = '';
}

function verifyAndDispatch() {
    const password = document.getElementById('dispatchPassword').value;
    const errorElement = document.getElementById('passwordError');
    
    if (!password) {
        errorElement.textContent = 'Please enter the authorization code';
        return;
    }

    // Replace with your actual authentication logic
    if (password === '123456') {
        const location = document.getElementById('alertLocation').textContent;
        const cameraId = document.getElementById('cameraInfo').textContent;
        const timestamp = document.getElementById('alertTime').textContent;
        
        logDispatchEvent(location, cameraId, timestamp);
        
        alert('Emergency response team has been dispatched');
        stopAlertSound();
        closeDispatchDialog();
        window.close();
    } else {
        errorElement.textContent = 'Invalid authorization code';
        document.getElementById('dispatchPassword').value = '';
    }
}

function playAlertSound() {
    const audio = document.getElementById('alertSound');
    audio.loop = true;
    audio.play().catch(error => {
        console.log('Audio playback failed:', error);
    });
}

function stopAlertSound() {
    const audio = document.getElementById('alertSound');
    audio.pause();
    audio.currentTime = 0;
}

function logDispatchEvent(location, cameraId, timestamp) {
    const dispatchData = {
        location,
        cameraId,
        timestamp,
        dispatchTime: new Date().toLocaleString()
    };
    
    console.log('Dispatch Event:', dispatchData);
    
    // Add your server logging logic here
    // Example:
    // fetch('/api/dispatch-log', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(dispatchData)
    // });
}

// Initialize alert with parameters from URL
window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const location = urlParams.get('location');
    const cameraId = urlParams.get('camera');
    const cameraFeed = `/video_feed?camera=${cameraId}`;
    
    if (location && cameraId) {
        showAlert(location, cameraId, cameraFeed);
    }
};

// Handle Enter key in password input
document.getElementById('dispatchPassword').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        verifyAndDispatch();
    }
});

// Prevent accidental window closing
window.addEventListener('beforeunload', function(e) {
    if (alertActive) {
        e.preventDefault();
        e.returnValue = '';
    }
});