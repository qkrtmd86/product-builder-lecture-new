document.getElementById('generate-btn').addEventListener('click', () => {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';
    const numbers = new Set();

    while (numbers.size < 6) {
        const randomNumber = Math.floor(Math.random() * 45) + 1;
        numbers.add(randomNumber);
    }

    const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);

    sortedNumbers.forEach(number => {
        const ball = document.createElement('div');
        ball.classList.add('ball');
        ball.textContent = number;
        
        let color;
        if (number <= 10) {
            color = '#fbc400'; // Yellow
        } else if (number <= 20) {
            color = '#69c8f2'; // Blue
        } else if (number <= 30) {
            color = '#ff7272'; // Red
        } else if (number <= 40) {
            color = '#aaa'; // Gray
        } else {
            color = '#b0d840'; // Green
        }
        ball.style.backgroundColor = color;

        resultDiv.appendChild(ball);
    });
});
