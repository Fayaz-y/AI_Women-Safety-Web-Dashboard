document.addEventListener('DOMContentLoaded', function() {
    const menuButtons = document.querySelectorAll('.menu-btn');
    const heatmaps = [];
    
    // Initialize heatmaps
    function initializeHeatmaps() {
        const heatmapAreas = document.querySelectorAll('.heatmap-area');
        heatmapAreas.forEach((area, index) => {
            const heatmap = h337.create({
                container: area,
                radius: 20,
                maxOpacity: 0.6,
                minOpacity: 0,
                blur: 0.75,
                gradient: {
                    0.4: 'blue',
                    0.6: 'yellow',
                    0.8: 'red'
                }
            });
            heatmaps[index] = heatmap;
            generateHeatmapData(heatmap, area);
        });
    }

    function generateHeatmapData(heatmap, container) {
        const width = container.offsetWidth;
        const height = container.offsetHeight;
        const points = [];
        
        for (let i = 0; i < 30; i++) {
            points.push({
                x: Math.floor(Math.random() * width),
                y: Math.floor(Math.random() * height),
                value: Math.floor(Math.random() * 100)
            });
        }

        heatmap.setData({
            max: 100,
            data: points
        });
    }

    // Menu button functionality
    menuButtons.forEach(button => {
        button.addEventListener('click', function() {
            menuButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            updateView(this.textContent.trim());
        });
    });

    function updateView(viewType) {
        const views = {
            cameraView: document.getElementById('cameraView'),
            heatmapView: document.getElementById('heatmapView'),
            historyView: document.getElementById('historyView'),
            statusTable: document.querySelector('.status-table')
        };

        Object.values(views).forEach(view => {
            if (view) view.style.display = 'none';
        });

        switch(viewType) {
            case 'Camera View':
                views.cameraView.style.display = 'grid';
                views.statusTable.style.display = 'block';
                break;
            case 'Heat Map':
                views.heatmapView.style.display = 'block';
                initializeHeatmaps();
                break;
            case 'Recent History':
                views.historyView.style.display = 'block';
                loadHistoryData();
                break;
        }
    }

    // History data handling
    function loadHistoryData() {
        const sampleData = [
            {
                camera: 'Camera 1',
                event: 'Motion Detected',
                timestamp: new Date(),
                location: 'Main Entrance',
                filename: 'CAM1_REC_001.mp4'
            },
            {
                camera: 'Camera 2',
                event: 'Alert Triggered',
                timestamp: new Date(Date.now() - 3600000),
                location: 'Parking Area',
                filename: 'CAM2_REC_002.mp4'
            },
            // Add more sample data as needed
        ];

        updateHistoryTable(sampleData);
    }

    function updateHistoryTable(data) {
        const tbody = document.querySelector('#historyTable tbody');
        tbody.innerHTML = data.map(record => `
            <tr>
                <td>${record.camera}</td>
                <td>${record.event}</td>
                <td>${record.timestamp.toLocaleString()}</td>
                <td>${record.location}</td>
                <td>
                    <button class="download-btn" onclick="alert('Downloading ${record.filename}')">
                        <i class="fas fa-download"></i> Download
                    </button>
                </td>
            </tr>
        `).join('');
    }

    // Camera status updates


    // Initialize
    setInterval(updateCameraStatus, 5000);
    
    // Filter functionality for history
    document.getElementById('cameraFilter')?.addEventListener('change', function() {
        loadHistoryData(); // Reload with filter
    });

    document.getElementById('dateFilter')?.addEventListener('change', function() {
        loadHistoryData(); // Reload with filter
    });
});