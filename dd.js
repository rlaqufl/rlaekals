
    // Teachable Machine에서 생성된 모델 경로
    const URL = "my_model/";

    let model, labelContainer, maxPredictions;

    // 모델을 초기화하고 예측 레이블 컨테이너를 설정하는 함수
    async function init() {
        const modelURL = URL + "model.json"; // 모델 정의 파일 경로
        const metadataURL = URL + "metadata.json"; // 메타데이터 파일 경로
        
        try {
            // 모델과 메타데이터를 비동기로 로드
            model = await tmImage.load(modelURL, metadataURL);
            
            maxPredictions = model.getTotalClasses(); // 모델 클래스 개수 가져오기
            console.log(maxPredictions);
            // 예측 결과를 표시할 레이블 컨테이너 초기화
            labelContainer = document.getElementById("label-container");
            for (let i = 0; i < maxPredictions; i++) {
                labelContainer.appendChild(document.createElement("div")); // 결과를 표시할 div 추가
            }
        } catch (error) {
            console.error("Model loading failed:", error); // 모델 로드 실패 시 오류 출력
        }
    }

    // 사용자가 이미지를 업로드했을 때 처리하는 함수
    function handleImageUpload(event) {
        const file = event.target.files[0]; // 업로드된 파일 가져오기
        console.log(file); // 파일 객체가 제대로 전달되는지 확인
        if (!file) return; // 파일이 없으면 아무 작업도 하지 않음

        const imgElement = document.getElementById("uploadedImage");
        //사용자가 로컬 컴퓨터에서 업로드한 파일을 임시 URL로 변환하여 브라우저가 이를 사용할 수 있도록 하는 방식입니다. 
        //imgElement.src = URL.createObjectURL(file); // 파일을 이미지 경로로 변환 후 표시
        const reader = new FileReader(); // FileReader 객체 생성
        //console.log(imgElement.src); // URL이 제대로 생성되었는지 확인
        // 이미지 로드 완료 후 예측 수행
        reader.onload = function (e) {
            console.log("File successfully read!");
            imgElement.src = e.target.result; // 이미지 데이터를 img src에 설정
            imgElement.onload = function () {
                console.log("Image successfully loaded!");
                predict(imgElement); // 모델 예측 실행
            };
        };
        // 파일 읽기 시작 (data URL 형식으로 읽기)
    reader.readAsDataURL(file);
    }

 // 모델에 이미지를 입력하고 예측 결과를 화면에 표시하는 함수
async function predict(imageElement) {
    // 모델을 통해 이미지를 예측
    const prediction = await model.predict(imageElement);

    // 예측된 클래스 중 가장 확률이 높은 클래스만 가져오기
    const topPrediction = prediction.reduce((max, current) => {
        return current.probability > max.probability ? current : max;
    });

    // 예측된 클래스 이름
    const className = topPrediction.className;

    // 결과를 표시할 텍스트 색상 설정
    let textColor = "";

    // 클래스 이름에 맞춰 색상 설정
    if (className === "겨울") {
        textColor = "skyblue"; // 하늘색
    } else if (className === "봄") {
        textColor = "#fec9de"; // 핑크색
    } else if (className === "여름") {
        textColor = "green"; // 초록색
    } else if (className === "가을") {
        textColor = "#93010f"; // 버건디색 (조금 더 부드러운 색)
    }

    // 색상을 적용하여 결과 텍스트를 표시
    labelContainer.innerHTML = className; // 예측된 클래스 이름만 출력
    labelContainer.style.color = textColor; // 색상 변경
}

    // 스크립트가 로드될 때 모델을 초기화
    init();

    // 파일 입력 필드에 이벤트 리스너 추가 (이미지 업로드 처리)
    document.getElementById("imageInput").addEventListener("change", handleImageUpload);