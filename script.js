// Текущее состояние открытки
let cardState = {
    text: "",
    from: "",
    to: "",
    paper: "craft",
    font: "handwriting",
    stamp: "🌿"
};

// Функции настройки в редакторе
function setPaper(type) {
    cardState.paper = type;
    const preview = document.getElementById("postcard-preview");
    preview.className = `postcard paper-${type} font-${cardState.font}`;
    updateActiveButton('paper', type);
}

function setFont(fontType) {
    cardState.font = fontType;
    const preview = document.getElementById("postcard-preview");
    preview.className = `postcard paper-${cardState.paper} font-${fontType}`;
    updateActiveButton('font', fontType);
}

function setStamp(stampSymbol) {
    cardState.stamp = stampSymbol;
    document.querySelector(".right-side .stamp").innerText = stampSymbol;
    updateActiveButton('stamp', stampSymbol);
}

function updateActiveButton(group, value) {
    // Вспомогательная подсветка активных кнопок
    event.target.parentElement.querySelectorAll("button").forEach(btn => btn.classList.remove("active"));
    event.target.classList.add("active");
}

// Генерация ссылки
function generateLink() {
    cardState.text = document.getElementById("card-text").value;
    cardState.from = document.getElementById("card-from").value;
    cardState.to = document.getElementById("card-to").value;

    // Упаковываем объект в JSON и кодируем в Base64 (с поддержкой кириллицы)
    const jsonString = JSON.stringify(cardState);
    const encodedData = encodeURIComponent(btoa(encodeURIComponent(jsonString)));

    const shareUrl = `${window.location.origin}${window.location.pathname}?card=${encodedData}`;

    // Копируем в буфер обмена
    navigator.clipboard.writeText(shareUrl).then(() => {
        alert("Ссылка скопирована в буфер обмена!\nОтправьте её другу.");
    });
}

// Открытие конверта получателем
function openEnvelope() {
    const envelope = document.getElementById("envelope");
    envelope.classList.add("open");

    setTimeout(() => {
        document.getElementById("envelope").style.display = "none";
        const unpackedCard = document.getElementById("unpacked-card");
        unpackedCard.classList.remove("hidden");
        document.getElementById("create-own-btn").classList.remove("hidden");
    }, 700);
}

function resetToCreator() {
    window.location.href = window.location.pathname;
}

// Проверка при загрузке страницы: открыта ли ссылка с открыткой?
window.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const cardParam = urlParams.get("card");

    if (cardParam) {
        try {
            // Расшифровываем данные из URL
            const jsonString = decodeURIComponent(atob(decodeURIComponent(cardParam)));
            const data = JSON.parse(jsonString);

            // Переключаем интерфейс в режим конверта
            document.getElementById("creator-view").classList.add("hidden");
            document.getElementById("receiver-view").classList.remove("hidden");

            // Заполняем открытку данными
            const unpackedCard = document.getElementById("unpacked-card");
            unpackedCard.className = `postcard paper-${data.paper} font-${data.font}`;
            unpackedCard.innerHTML = `
                <div class="postcard-content">
                    <div class="left-side">
                        <p style="white-space: pre-wrap; font-size: 1.1rem;">${escapeHtml(data.text)}</p>
                        <div class="signature-line">
                            <span>От: <b>${escapeHtml(data.from)}</b></span>
                            <span>Кому: <b>${escapeHtml(data.to)}</b></span>
                        </div>
                    </div>
                    <div class="right-side">
                        <div class="stamp">${data.stamp}</div>
                        <div class="postmark">Почта Ателье</div>
                    </div>
                </div>
            `;
        } catch (e) {
            console.error("Ошибка чтения открытки", e);
        }
    }
});

function escapeHtml(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}