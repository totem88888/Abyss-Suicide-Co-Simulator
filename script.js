/* =========================================================
    DOM 요소 참조/선언
========================================================= */

const header = document.getElementById("header");
const intro = document.getElementById("intro")
const introGuideEl = document.getElementById("intro-guide")
const sidebar = document.getElementById("sidebar");
const content = document.getElementById("content");

/* =========================================================
    인트로
========================================================= */

window.addEventListener("load", () => {
  const closeIntro = () => {
    introGuideEl.classList.remove("blink");
    intro.classList.remove("fade-in");
    intro.classList.add("fade-out");
    setTimeout(() => intro.remove(), 1200);
  };

  // 클릭 종료
  intro.addEventListener("click", closeIntro);
});

/* =========================================================
    기본 튜토리얼
========================================================= */

/* =========================================================
    대사
========================================================= */

let NAME_DATA = {};

/* name 정보 로드 */
async function loadNameData() {
    const res = await fetch("./data/dialogs/name.json");
    NAME_DATA = await res.json();
}

/* 타이핑 효과 */
function typeText(el, text, speed) {
    return new Promise(resolve => {
        let i = 0;
        const timer = setInterval(() => {
            el.textContent += text[i++];
            if (i >= text.length) {
                clearInterval(timer);
                resolve();
            }
        }, speed / text.length);
    });
}

/* 대사 출력 */
async function playDialog(category, filename) {
    if (!Object.keys(NAME_DATA).length) {
        await loadNameData();
    }

    const res = await fetch(`./data/dialogs/${category}/${filename}.json`);
    const dialog = await res.json();

    for (const key of Object.keys(dialog)) {
        const speakerKey = key.split("_")[0];
        const speaker = NAME_DATA[speakerKey] || NAME_DATA["N"];

        const line = document.createElement("div");
        line.className = "dialog-line";
        line.style.color = speaker.color;

        if (speaker.name) {
            const nameTag = document.createElement("span");
            nameTag.className = "dialog-name";
            nameTag.textContent = speaker.name + " ";
            line.appendChild(nameTag);
        }

        const textSpan = document.createElement("span");
        line.appendChild(textSpan);

        sidebar.appendChild(line);

        await typeText(
            textSpan,
            dialog[key],
            speaker.speed || 600
        );

        await new Promise(r => setTimeout(r, 300));
    }
}