// game.js

const URL = "https://teachablemachine.withgoogle.com/models/LeLgkH6wF/";
let model, webcam, ctx, labelContainer, maxPredictions;
let health = 100;
let isGameRunning = false;

async function startGame() {
    if (!isGameRunning) {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        model = await tmPose.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        const size = 200;
        const flip = true;
        webcam = new tmPose.Webcam(size, size, flip);
        await webcam.setup();
        await webcam.play();
        window.requestAnimationFrame(gameLoop);

        const canvas = document.getElementById("canvas");
        canvas.width = size;
        canvas.height = size;
        ctx = canvas.getContext("2d");
        labelContainer = document.getElementById("label-container");
        for (let i = 0; i < maxPredictions; i++) {
            labelContainer.appendChild(document.createElement("div"));
        }

        isGameRunning = true;
    }
}

async function gameLoop(timestamp) {
    if (isGameRunning) {
        webcam.update();
        await predict();
        window.requestAnimationFrame(gameLoop);
    }
}

async function predict() {
    if (isGameRunning) {
        const { pose, posenetOutput } = await model.estimatePose(webcam.canvas);
        const prediction = await model.predict(posenetOutput);

        for (let i = 0; i < maxPredictions; i++) {
            const classPrediction =
                prediction[i].className + ": " + prediction[i].probability.toFixed(2);
            labelContainer.childNodes[i].innerHTML = classPrediction;
        }

        // 동작을 판단하여 체력 조절 로직 추가
        // 예를 들어, 특정 동작을 감지하면 체력을 감소시키고, 다른 동작을 감지하면 체력을 증가시킬 수 있습니다.

        // 체력 업데이트
        document.getElementById("health").textContent = health.toFixed(2);

        // 게임 종료 조건 추가 (예: 체력이 0 이하로 떨어졌을 때)
        if (health <= 0) {
            isGameRunning = false;
            alert("Game Over!");
        }
    }
}
