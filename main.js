const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const uploadArea = document.getElementById('upload-area');
const imageInput = document.getElementById('image-input');
const loading = document.getElementById('loading');
const resultArea = document.getElementById('result-area');
const previewImage = document.getElementById('preview-image');
const labelContainer = document.getElementById('label-container');
const retryBtn = document.getElementById('retry-btn');

// Teachable Machine Model URL
const URL = "https://teachablemachine.withgoogle.com/models/k3twHqHoI/";

let model, maxPredictions;

// Load the model
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    try {
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
        console.log("Model loaded successfully");
    } catch (error) {
        console.error("Failed to load model:", error);
        alert("모델을 불러오는 데 실패했습니다.");
    }
}

// Initialize theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    body.classList.add('light-mode');
    themeToggle.textContent = '다크 모드';
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    const isLight = body.classList.contains('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    themeToggle.textContent = isLight ? '다크 모드' : '라이트 모드';
});

// Upload area click
uploadArea.addEventListener('click', () => imageInput.click());

// Drag and drop events
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = 'var(--accent-color)';
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = 'var(--border-color)';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = 'var(--border-color)';
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        handleImage(file);
    }
});

// File input change
imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        handleImage(file);
    }
});

function handleImage(file) {
    const reader = new FileReader();
    reader.onload = async (e) => {
        previewImage.src = e.target.result;
        uploadArea.style.display = 'none';
        loading.style.display = 'block';
        
        // Wait for image to load to ensure prediction works
        previewImage.onload = async () => {
            await predict();
        };
    };
    reader.readAsDataURL(file);
}

async function predict() {
    if (!model) {
        await init();
    }

    const prediction = await model.predict(previewImage);
    loading.style.display = 'none';
    resultArea.style.display = 'flex';
    
    labelContainer.innerHTML = '';
    
    // Sort prediction to show highest first (optional, but good for UX)
    prediction.sort((a, b) => b.probability - a.probability);

    for (let i = 0; i < maxPredictions; i++) {
        const classTitle = prediction[i].className;
        const probability = (prediction[i].probability * 100).toFixed(0);
        
        const barWrapper = document.createElement('div');
        barWrapper.classList.add('result-bar-wrapper');
        
        barWrapper.innerHTML = `
            <div class="result-label">
                <span>${classTitle}</span>
                <span>${probability}%</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: 0%"></div>
            </div>
        `;
        
        labelContainer.appendChild(barWrapper);
        
        // Trigger animation
        setTimeout(() => {
            barWrapper.querySelector('.progress-fill').style.width = `${probability}%`;
        }, 100);
    }
}

retryBtn.addEventListener('click', () => {
    resultArea.style.display = 'none';
    uploadArea.style.display = 'block';
    imageInput.value = '';
});

// Initialize model on load
init();

// Disqus configuration
(function() {
    var d = document, s = d.createElement('script');
    s.src = 'https://productbuilder-osdnifmges.disqus.com/embed.js';
    s.setAttribute('data-timestamp', +new Date());
    (d.head || d.body).appendChild(s);
})();
