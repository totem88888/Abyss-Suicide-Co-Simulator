// 1. 파일 이름 리스트 (특정 폴더 내의 파일들을 미리 정의해야 합니다)
const fileList = ['file1.txt', 'file2.txt', 'file3.txt'];

async function loadAndTypeRandomFile() {
    // 2. 랜덤으로 파일 하나 선택
    const randomIndex = Math.floor(Math.random() * fileList.length);
    const selectedFile = `./data/${fileList[randomIndex]}`; // 폴더 경로에 맞춰 수정

    try {
        // 3. 파일 내용 읽어오기
        const response = await fetch(selectedFile);
        if (!response.ok) throw new Error("파일을 찾을 수 없습니다.");
        const text = await response.text();

        // 4. 타이핑 효과 실행
        startTypingEffect(text, document.getElementById('output'));
    } catch (error) {
        console.error("에러 발생:", error);
    }
}

function startTypingEffect(text, element) {
    let index = 0;
    element.textContent = ""; // 기존 내용 초기화

    const timer = setInterval(() => {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
        } else {
            clearInterval(timer); // 타이핑 종료
        }
    }, 50); // 50ms 간격 (숫자가 낮을수록 빨라집니다)
}