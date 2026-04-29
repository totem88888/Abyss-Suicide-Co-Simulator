const ABYSS_LIST_PATH = "./Data/Abyssborn/list.json";
const ABYSS_DATA_FOLDER = "./Data/Abyssborn/";

// [핵심] 탐사를 시작하는 메인 함수
async function startRandomEncounter() {
    const displayElement = document.getElementById('encounter-display');
    const optionContainer = document.getElementById('options-container');
    
    // 초기화
    displayElement.textContent = "심연을 탐색 중입니다...";
    optionContainer.innerHTML = "";

    try {
        // 1. 리스트 가져오기
        const listResponse = await fetch(ABYSS_LIST_PATH);
        if (!listResponse.ok) throw new Error("리스트 파일 없음");
        const fileNames = await listResponse.json();

        // 2. 랜덤 파일 선택
        const randomFileName = fileNames[Math.floor(Math.random() * fileNames.length)];
        
        // 3. 데이터 가져오기 (확장자 중복 체크)
        // 만약 list.json에 "Shadow.json"이라고 적혀있다면 아래에서 .json을 빼야 합니다.
        const finalPath = randomFileName.endsWith('.json') 
                          ? `${ABYSS_DATA_FOLDER}${randomFileName}` 
                          : `${ABYSS_DATA_FOLDER}${randomFileName}.json`;

        const dataResponse = await fetch(finalPath);
        if (!dataResponse.ok) throw new Error("데이터 파일 없음");
        const data = await dataResponse.json();

        // 4. 조우 지문 출력 (타이핑)
        await typeText('encounter-display', data.encounterText);

        // 5. 선택지 생성
        data.options.forEach(option => {
            const btn = document.createElement('button');
            btn.className = "choice-btn"; // CSS용 클래스
            btn.textContent = option.text;
            btn.onclick = () => handleChoice(option);
            optionContainer.appendChild(btn);
        });

    } catch (error) {
        console.error("오류:", error);
        displayElement.textContent = "어둠이 너무 깊어 아무것도 찾지 못했습니다. (파일 경로 확인 필요)";
    }
}

// 선택지 클릭 처리
async function handleChoice(option) {
    document.getElementById('options-container').innerHTML = ""; // 버튼 제거
    
    // 결과 지문 출력
    await typeText('encounter-display', option.resultText);
    
    // 보상 로직 (콘솔 확인용)
    console.log(`결과 유형: ${option.outcome}, 보상: ${option.reward}`);
    
    // 여기에 전리품 추가 함수 등을 연결하세요.
}

// 타이핑 효과 (Promise 버전)
function typeText(elementId, text) {
    return new Promise((resolve) => {
        let index = 0;
        const el = document.getElementById(elementId);
        if (!el) return;
        
        el.textContent = "";
        if (el.typingTimer) clearInterval(el.typingTimer);

        el.typingTimer = setInterval(() => {
            if (index < text.length) {
                el.textContent += text.charAt(index);
                index++;
            } else {
                clearInterval(el.typingTimer);
                resolve();
            }
        }, 40); // 속도 약간 조절
    });
}