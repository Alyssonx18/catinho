/* =========================================================
   NOSSO CANTINHO ♡
   Sistema em HTML + CSS + JavaScript
   Data oficial: 03/05/2026
========================================================= */


/* =========================================================
   CONFIGURAÇÕES INICIAIS
========================================================= */

const DEFAULT_DATE = "2026-05-03";

const STORAGE_KEY = "nossoCantinhoData";

let calendarDate = new Date();


/* =========================================================
   BANCO DE DADOS LOCAL
========================================================= */

const defaultData = {

    settings: {

        myName: "",
        herName: "",
        nickname: "Nós dois",
        relationshipDate: DEFAULT_DATE,

        phrase:
            "Nossa história começou em 03 de maio de 2026. O resto, a gente ainda está escrevendo. ♡",

        photo: "",

        theme: "light"

    },

    memories: [],

    events: [],

    timeline: [
        {
            id: crypto.randomUUID(),
            title: "O começo da nossa história",
            date: DEFAULT_DATE,
            description:
                "O dia em que começamos nosso namoro e iniciamos oficialmente a nossa história.",
            createdAt: new Date().toISOString()
        }
    ],

    letters: [],

    surprises: [],

    importantDates: [
        {
            id: crypto.randomUUID(),
            title: "Aniversário de namoro",
            date: DEFAULT_DATE,
            description: "O dia em que nossa história começou."
        }
    ],

    places: [],

    music: {

        title: "",
        artist: "",
        url: "",
        description: ""

    }

};


let data = loadData();


/* =========================================================
   LOCAL STORAGE
========================================================= */

function loadData() {

    try {

        const saved = localStorage.getItem(STORAGE_KEY);

        if (!saved) {

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(defaultData)
            );

            return structuredClone(defaultData);
        }

        const parsed = JSON.parse(saved);

        return {
            ...structuredClone(defaultData),
            ...parsed,

            settings: {
                ...structuredClone(defaultData.settings),
                ...(parsed.settings || {})
            }
        };

    } catch (error) {

        console.error(error);

        return structuredClone(defaultData);

    }

}


function saveData() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
    );

}


/* =========================================================
   UTILIDADES
========================================================= */

function escapeHTML(value) {

    if (value === undefined || value === null) {
        return "";
    }

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


function formatDate(dateString) {

    if (!dateString) {
        return "";
    }

    const date = new Date(`${dateString}T12:00:00`);

    return date.toLocaleDateString(
        "pt-BR",
        {
            day: "2-digit",
            month: "long",
            year: "numeric"
        }
    );

}


function formatShortDate(dateString) {

    const date = new Date(`${dateString}T12:00:00`);

    return date.toLocaleDateString(
        "pt-BR"
    );

}


function showToast(message) {

    const toast = document.getElementById("toast");

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);

}


/* =========================================================
   ENTRADA
========================================================= */

function enterApp() {

    document
        .getElementById("welcomeScreen")
        .classList.add("hidden");

    document
        .getElementById("app")
        .classList.remove("hidden");

    renderAll();

}


function logout() {

    document
        .getElementById("app")
        .classList.add("hidden");

    document
        .getElementById("welcomeScreen")
        .classList.remove("hidden");

}


/* =========================================================
   NAVEGAÇÃO
========================================================= */

function showPage(page) {

    document
        .querySelectorAll(".page")
        .forEach(element => {

            element.classList.remove("active-page");

        });


    const selectedPage =
        document.getElementById(`page-${page}`);


    if (selectedPage) {

        selectedPage.classList.add("active-page");

    }


    document
        .querySelectorAll(".nav-item")
        .forEach(button => {

            button.classList.remove("active");

        });


    document
        .querySelectorAll(".nav-item")
        .forEach(button => {

            if (
                button
                    .getAttribute("onclick")
                    ?.includes(`'${page}'`)
            ) {

                button.classList.add("active");

            }

        });


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    if (page === "calendar") {
        renderCalendar();
    }

    if (page === "timeline") {
        renderTimeline();
    }

    if (page === "memories") {
        renderMemories();
    }

    if (page === "letters") {
        renderLetters();
    }

    if (page === "surprises") {
        renderSurprises();
    }

    if (page === "dates") {
        renderImportantDates();
    }

    if (page === "places") {
        renderPlaces();
    }

    if (page === "retrospective") {
        renderYearSelector();
        renderRetrospective();
    }

}


/* =========================================================
   CONTADOR
========================================================= */

function calculateRelationship(startDate) {

    const start = new Date(`${startDate}T00:00:00`);
    const now = new Date();

    let years =
        now.getFullYear() -
        start.getFullYear();

    let months =
        now.getMonth() -
        start.getMonth();

    let days =
        now.getDate() -
        start.getDate();


    if (days < 0) {

        months--;

        const previousMonth =
            new Date(
                now.getFullYear(),
                now.getMonth(),
                0
            );

        days += previousMonth.getDate();

    }


    if (months < 0) {

        years--;
        months += 12;

    }


    const difference =
        now.getTime() -
        start.getTime();


    const totalDays =
        Math.floor(
            difference /
            (1000 * 60 * 60 * 24)
        );


    const totalSeconds =
        Math.floor(
            difference / 1000
        );


    const hours =
        Math.floor(
            (totalSeconds / 3600) % 24
        );


    const minutes =
        Math.floor(
            (totalSeconds / 60) % 60
        );


    const seconds =
        totalSeconds % 60;


    return {
        years,
        months,
        days,
        totalDays,
        hours,
        minutes,
        seconds
    };

}


function updateCounter() {

    const result =
        calculateRelationship(
            data.settings.relationshipDate
        );


    document.getElementById("years")
        .textContent = result.years;

    document.getElementById("months")
        .textContent = result.months;

    document.getElementById("days")
        .textContent = result.days;

    document.getElementById("totalDays")
        .textContent =
        Math.max(0, result.totalDays);

    document.getElementById("hours")
        .textContent =
        String(result.hours).padStart(2, "0");

    document.getElementById("minutes")
        .textContent =
        String(result.minutes).padStart(2, "0");

    document.getElementById("seconds")
        .textContent =
        String(result.seconds).padStart(2, "0");

}


setInterval(updateCounter, 1000);


/* =========================================================
   PRÓXIMO ANIVERSÁRIO
========================================================= */

function updateAnniversary() {

    const start =
        new Date(
            `${data.settings.relationshipDate}T00:00:00`
        );

    const now = new Date();

    let next = new Date(
        now.getFullYear(),
        start.getMonth(),
        start.getDate()
    );


    if (next <= now) {

        next = new Date(
            now.getFullYear() + 1,
            start.getMonth(),
            start.getDate()
        );

    }


    const difference =
        next.getTime() -
        now.getTime();


    const days =
        Math.floor(
            difference /
            (1000 * 60 * 60 * 24)
        );


    const hours =
        Math.floor(
            (difference /
                (1000 * 60 * 60)) %
            24
        );


    const minutes =
        Math.floor(
            (difference /
                (1000 * 60)) %
            60
        );


    const seconds =
        Math.floor(
            (difference / 1000) %
            60
        );


    const anniversaryText =
        document.getElementById(
            "anniversaryText"
        );


    const countdown =
        document.getElementById(
            "anniversaryCountdown"
        );


    const isToday =
        now.getMonth() === start.getMonth() &&
        now.getDate() === start.getDate();


    if (isToday) {

        anniversaryText.textContent =
            "Feliz aniversário para nós! ❤️";

        countdown.textContent =
            "Hoje é o nosso dia.";

        return;

    }


    anniversaryText.textContent =
        `${days} dias para o nosso próximo aniversário ♡`;


    countdown.textContent =
        `${days} dias • ${hours} horas • ${minutes} minutos • ${seconds} segundos`;

}


setInterval(updateAnniversary, 1000);


/* =========================================================
   HOME
========================================================= */

function renderHome() {

    const settings = data.settings;


    document.getElementById("coupleNameHome")
        .textContent =
        settings.nickname ||
        "Nossa História ♡";


    document.getElementById("couplePhraseHome")
        .textContent =
        settings.phrase;


    const image =
        document.getElementById(
            "couplePhotoHome"
        );


    const placeholder =
        document.getElementById(
            "defaultCouplePhoto"
        );


    if (settings.photo) {

        image.src = settings.photo;

        image.classList.remove("hidden");

        placeholder.classList.add("hidden");

    } else {

        image.classList.add("hidden");

        placeholder.classList.remove("hidden");

    }


    renderLatestMemory();

    renderStats();

    renderThisDay();

}


/* =========================================================
   ÚLTIMA MEMÓRIA
========================================================= */

function renderLatestMemory() {

    const container =
        document.getElementById(
            "latestMemory"
        );


    if (data.memories.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                <span>♡</span>
                <p>
                    Nossa primeira memória ainda está
                    esperando para ser registrada.
                </p>
                <button
                    class="primary-btn"
                    onclick="openMemoryModal()"
                >
                    Criar primeira memória
                </button>
            </div>
        `;

        return;

    }


    const memory =
        [...data.memories]
            .sort(
                (a, b) =>
                    new Date(b.date) -
                    new Date(a.date)
            )[0];


    container.innerHTML =
        memoryCardHTML(memory);

}


function memoryCardHTML(memory) {

    const imageHTML =
        memory.image
            ? `
                <img
                    class="memory-image"
                    src="${memory.image}"
                    alt="${escapeHTML(memory.title)}"
                >
            `
            : `
                <div class="memory-placeholder">
                    ♡
                </div>
            `;


    return `
        <article class="memory-card">

            ${imageHTML}

            <div class="memory-content">

                <span class="eyebrow">
                    ${escapeHTML(memory.category)}
                </span>

                <h3>
                    ${escapeHTML(memory.title)}
                </h3>

                <small>
                    ${formatDate(memory.date)}
                </small>

                <p>
                    ${escapeHTML(
                        memory.description ||
                        "Um momento especial da nossa história."
                    )}
                </p>

                <div class="card-actions">

                    <button
                        class="small-btn"
                        onclick="editMemory('${memory.id}')"
                    >
                        Editar
                    </button>

                    <button
                        class="small-btn delete-btn"
                        onclick="deleteMemory('${memory.id}')"
                    >
                        Excluir
                    </button>

                </div>

            </div>

        </article>
    `;

}


/* =========================================================
   MEMÓRIAS
========================================================= */

function renderMemories() {

    const container =
        document.getElementById(
            "memoriesGrid"
        );


    if (data.memories.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                <span>📸</span>
                <p>
                    Nossa primeira memória ainda está
                    esperando para ser registrada. ♡
                </p>
            </div>
        `;

        return;

    }


    const memories =
        [...data.memories]
            .sort(
                (a, b) =>
                    new Date(b.date) -
                    new Date(a.date)
            );


    container.innerHTML =
        memories
            .map(memoryCardHTML)
            .join("");

}


function openMemoryModal() {

    document
        .getElementById("memoryForm")
        .reset();


    document
        .getElementById("memoryId")
        .value = "";


    document
        .getElementById("memoryDate")
        .value =
        new Date()
            .toISOString()
            .split("T")[0];


    openModal("memoryModal");

}


function editMemory(id) {

    const memory =
        data.memories.find(
            item => item.id === id
        );


    if (!memory) {
        return;
    }


    document.getElementById("memoryId")
        .value = memory.id;

    document.getElementById("memoryTitle")
        .value = memory.title;

    document.getElementById("memoryDate")
        .value = memory.date;

    document.getElementById("memoryLocation")
        .value = memory.location || "";

    document.getElementById("memoryCategory")
        .value = memory.category || "Momento especial";

    document.getElementById("memoryDescription")
        .value = memory.description || "";

    document.getElementById("memorySpecial")
        .value = memory.special || "";


    openModal("memoryModal");

}


document
    .getElementById("memoryForm")
    .addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const id =
                document.getElementById(
                    "memoryId"
                ).value;


            const file =
                document.getElementById(
                    "memoryImage"
                ).files[0];


            let image = "";


            if (id) {

                const existing =
                    data.memories.find(
                        item => item.id === id
                    );

                image =
                    existing?.image || "";

            }


            if (file) {

                image =
                    await readImage(file);

            }


            const memory = {

                id:
                    id ||
                    crypto.randomUUID(),

                title:
                    document.getElementById(
                        "memoryTitle"
                    ).value,

                date:
                    document.getElementById(
                        "memoryDate"
                    ).value,

                location:
                    document.getElementById(
                        "memoryLocation"
                    ).value,

                category:
                    document.getElementById(
                        "memoryCategory"
                    ).value,

                description:
                    document.getElementById(
                        "memoryDescription"
                    ).value,

                special:
                    document.getElementById(
                        "memorySpecial"
                    ).value,

                image,

                createdAt:
                    new Date().toISOString()

            };


            if (id) {

                const index =
                    data.memories.findIndex(
                        item => item.id === id
                    );

                data.memories[index] =
                    memory;

                showToast(
                    "Memória atualizada. ❤️"
                );

            } else {

                data.memories.push(memory);

                showToast(
                    "Memória guardada na nossa história. ❤️"
                );

            }


            saveData();

            closeModal("memoryModal");

            renderAll();

        }
    );


function deleteMemory(id) {

    if (
        !confirm(
            "Tem certeza que deseja apagar esta memória?"
        )
    ) {

        return;

    }


    data.memories =
        data.memories.filter(
            item => item.id !== id
        );


    saveData();

    renderAll();

    showToast(
        "Memória removida."
    );

}


/* =========================================================
   IMAGEM
========================================================= */

function readImage(file) {

    return new Promise(
        (resolve, reject) => {

            if (!file.type.startsWith("image/")) {

                alert(
                    "Selecione uma imagem válida."
                );

                reject(
                    new Error(
                        "Arquivo inválido"
                    )
                );

                return;

            }


            if (
                file.size >
                5 * 1024 * 1024
            ) {

                alert(
                    "A imagem deve ter no máximo 5 MB."
                );

                reject(
                    new Error(
                        "Imagem muito grande"
                    )
                );

                return;

            }


            const reader =
                new FileReader();


            reader.onload =
                () =>
                    resolve(
                        reader.result
                    );


            reader.onerror =
                reject;


            reader.readAsDataURL(file);

        }
    );

}


/* =========================================================
   CALENDÁRIO
========================================================= */

function changeMonth(amount) {

    calendarDate.setMonth(
        calendarDate.getMonth() +
        amount
    );

    renderCalendar();

}


function renderCalendar() {

    const year =
        calendarDate.getFullYear();

    const month =
        calendarDate.getMonth();


    document.getElementById(
        "calendarTitle"
    ).textContent =
        new Date(
            year,
            month,
            1
        ).toLocaleDateString(
            "pt-BR",
            {
                month: "long",
                year: "numeric"
            }
        );


    const firstDay =
        new Date(
            year,
            month,
            1
        ).getDay();


    const totalDays =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    const container =
        document.getElementById(
            "calendarDays"
        );


    container.innerHTML = "";


    for (
        let i = 0;
        i < firstDay;
        i++
    ) {

        container.innerHTML +=
            `<div></div>`;

    }


    for (
        let day = 1;
        day <= totalDays;
        day++
    ) {

        const dateString =
            `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;


        const today =
            new Date();


        const isToday =
            today.getFullYear() === year &&
            today.getMonth() === month &&
            today.getDate() === day;


        const hasEvent =
            data.events.some(
                event =>
                    event.date ===
                    dateString
            );


        container.innerHTML += `
            <div
                class="calendar-day
                ${isToday ? "today" : ""}
                ${hasEvent ? "has-event" : ""}"
                onclick="selectCalendarDate('${dateString}')"
            >
                ${day}
            </div>
        `;

    }


    renderEventsList();

}


function selectCalendarDate(date) {

    document.getElementById(
        "eventDate"
    ).value = date;

    openEventModal();

}


function renderEventsList() {

    const container =
        document.getElementById(
            "eventsList"
        );


    const events =
        [...data.events]
            .sort(
                (a, b) =>
                    new Date(a.date) -
                    new Date(b.date)
            );


    if (!events.length) {

        container.innerHTML = `
            <div class="empty-state">
                <span>📅</span>
                <p>
                    Ainda não temos nada marcado.
                    Que tal criar uma nova lembrança?
                </p>
            </div>
        `;

        return;

    }


    container.innerHTML =
        events.map(event => `
            <div class="event-item">

                <span class="eyebrow">
                    ${escapeHTML(event.category)}
                </span>

                <h3>
                    ${escapeHTML(event.title)}
                </h3>

                <p>
                    ${formatDate(event.date)}
                    ${event.time ? ` • ${event.time}` : ""}
                </p>

                <p>
                    ${escapeHTML(event.description || "")}
                </p>

                <div class="card-actions">

                    <button
                        class="small-btn delete-btn"
                        onclick="deleteEvent('${event.id}')"
                    >
                        Excluir
                    </button>

                </div>

            </div>
        `).join("");

}


function openEventModal() {

    document
        .getElementById("eventForm")
        .reset();


    document
        .getElementById("eventDate")
        .value =
        new Date()
            .toISOString()
            .split("T")[0];


    openModal("eventModal");

}


document
    .getElementById("eventForm")
    .addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const newEvent = {

                id:
                    crypto.randomUUID(),

                title:
                    document.getElementById(
                        "eventTitle"
                    ).value,

                date:
                    document.getElementById(
                        "eventDate"
                    ).value,

                time:
                    document.getElementById(
                        "eventTime"
                    ).value,

                category:
                    document.getElementById(
                        "eventCategory"
                    ).value,

                description:
                    document.getElementById(
                        "eventDescription"
                    ).value

            };


            data.events.push(
                newEvent
            );


            saveData();

            closeModal("eventModal");

            renderCalendar();

            showToast(
                "Evento adicionado ao nosso calendário. ❤️"
            );

        }
    );


function deleteEvent(id) {

    if (!confirm("Excluir este evento?")) {
        return;
    }


    data.events =
        data.events.filter(
            event =>
                event.id !== id
        );


    saveData();

    renderCalendar();

    showToast(
        "Evento removido."
    );

}


/* =========================================================
   TIMELINE
========================================================= */

function renderTimeline() {

    const container =
        document.getElementById(
            "timeline"
        );


    const items =
        [...data.timeline]
            .sort(
                (a, b) =>
                    new Date(a.date) -
                    new Date(b.date)
            );


    container.innerHTML =
        items.map(item => `
            <div class="timeline-item">

                <div class="timeline-dot">
                    ♥
                </div>

                <div class="timeline-content">

                    <span class="eyebrow">
                        ${formatDate(item.date)}
                    </span>

                    <h2>
                        ${escapeHTML(item.title)}
                    </h2>

                    <p>
                        ${escapeHTML(item.description)}
                    </p>

                </div>

            </div>
        `).join("");

}


function openTimelineModal() {

    document
        .getElementById("timelineForm")
        .reset();


    document
        .getElementById("timelineDate")
        .value =
        new Date()
            .toISOString()
            .split("T")[0];


    openModal("timelineModal");

}


document
    .getElementById("timelineForm")
    .addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            data.timeline.push({

                id:
                    crypto.randomUUID(),

                title:
                    document.getElementById(
                        "timelineTitle"
                    ).value,

                date:
                    document.getElementById(
                        "timelineDate"
                    ).value,

                description:
                    document.getElementById(
                        "timelineDescription"
                    ).value

            });


            saveData();

            closeModal(
                "timelineModal"
            );

            renderTimeline();

            showToast(
                "Novo capítulo adicionado à nossa história. ♡"
            );

        }
    );


/* =========================================================
   CARTAS
========================================================= */

function openLetterModal() {

    document
        .getElementById("letterForm")
        .reset();

    openModal("letterModal");

}


document
    .getElementById("letterForm")
    .addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            data.letters.push({

                id:
                    crypto.randomUUID(),

                title:
                    document.getElementById(
                        "letterTitle"
                    ).value,

                recipient:
                    document.getElementById(
                        "letterRecipient"
                    ).value,

                openDate:
                    document.getElementById(
                        "letterOpenDate"
                    ).value,

                message:
                    document.getElementById(
                        "letterMessage"
                    ).value,

                createdAt:
                    new Date().toISOString()

            });


            saveData();

            closeModal("letterModal");

            renderLetters();

            showToast(
                "Cartinha guardada com carinho. 💌"
            );

        }
    );


function renderLetters() {

    const container =
        document.getElementById(
            "lettersGrid"
        );


    if (!data.letters.length) {

        container.innerHTML = `
            <div class="empty-state">
                <span>💌</span>
                <p>
                    Talvez seja hora de escrever
                    nossa primeira cartinha.
                </p>
            </div>
        `;

        return;

    }


    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    container.innerHTML =
        data.letters.map(letter => {

            const locked =
                letter.openDate &&
                letter.openDate >
                today;


            return `
                <article
                    class="letter-card
                    ${locked ? "locked" : ""}"
                >

                    <div class="letter-envelope">
                        💌
                    </div>

                    <span class="eyebrow">
                        ${letter.recipient
                            ? `Para ${escapeHTML(letter.recipient)}`
                            : "Para nós"}
                    </span>

                    <h2>
                        ${escapeHTML(letter.title)}
                    </h2>

                    ${
                        locked
                            ? `
                                <p>
                                    🔒 Esta cartinha
                                    poderá ser aberta em
                                    ${formatDate(letter.openDate)}.
                                </p>
                            `
                            : `
                                <p class="letter-message">
                                    ${escapeHTML(letter.message)}
                                </p>
                            `
                    }

                </article>
            `;

        }).join("");

}


/* =========================================================
   SURPRESAS
========================================================= */

function openSurpriseModal() {

    document
        .getElementById("surpriseForm")
        .reset();

    openModal("surpriseModal");

}


document
    .getElementById("surpriseForm")
    .addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            data.surprises.push({

                id:
                    crypto.randomUUID(),

                title:
                    document.getElementById(
                        "surpriseTitle"
                    ).value,

                date:
                    document.getElementById(
                        "surpriseDate"
                    ).value,

                message:
                    document.getElementById(
                        "surpriseMessage"
                    ).value

            });


            saveData();

            closeModal(
                "surpriseModal"
            );

            renderSurprises();

            showToast(
                "Surpresa programada. 🎁"
            );

        }
    );


function renderSurprises() {

    const container =
        document.getElementById(
            "surprisesGrid"
        );


    if (!data.surprises.length) {

        container.innerHTML = `
            <div class="empty-state">
                <span>🎁</span>
                <p>
                    Ainda não existem surpresas.
                </p>
            </div>
        `;

        return;

    }


    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    container.innerHTML =
        data.surprises.map(
            surprise => {

                const unlocked =
                    today >= surprise.date;


                return `
                    <article class="surprise-card">

                        <div class="letter-envelope">
                            ${unlocked ? "🎉" : "🎁"}
                        </div>

                        <span class="eyebrow">
                            ${formatDate(surprise.date)}
                        </span>

                        <h2>
                            ${
                                unlocked
                                    ? escapeHTML(
                                        surprise.title
                                    )
                                    : "Ainda não chegou a hora..."
                            }
                        </h2>

                        <p>
                            ${
                                unlocked
                                    ? escapeHTML(
                                        surprise.message
                                    )
                                    : "Volte quando chegar a data. ♡"
                            }
                        </p>

                    </article>
                `;

            }
        ).join("");

}


/* =========================================================
   DATAS IMPORTANTES
========================================================= */

function openDateModal() {

    document
        .getElementById("dateForm")
        .reset();

    openModal("dateModal");

}


document
    .getElementById("dateForm")
    .addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            data.importantDates.push({

                id:
                    crypto.randomUUID(),

                title:
                    document.getElementById(
                        "importantDateTitle"
                    ).value,

                date:
                    document.getElementById(
                        "importantDate"
                    ).value,

                description:
                    document.getElementById(
                        "importantDateDescription"
                    ).value

            });


            saveData();

            closeModal("dateModal");

            renderImportantDates();

            showToast(
                "Data importante adicionada. ❤️"
            );

        }
    );


function renderImportantDates() {

    const container =
        document.getElementById(
            "datesGrid"
        );


    container.innerHTML =
        data.importantDates.map(
            date => `

                <article class="date-card">

                    <div class="letter-envelope">
                        ❤️
                    </div>

                    <span class="eyebrow">
                        ${formatDate(date.date)}
                    </span>

                    <h2>
                        ${escapeHTML(date.title)}
                    </h2>

                    <p>
                        ${escapeHTML(
                            date.description || ""
                        )}
                    </p>

                </article>

            `
        ).join("");

}


/* =========================================================
   MÚSICA
========================================================= */

function openMusicModal() {

    document.getElementById(
        "musicTitleInput"
    ).value =
        data.music.title || "";


    document.getElementById(
        "musicArtistInput"
    ).value =
        data.music.artist || "";


    document.getElementById(
        "musicUrlInput"
    ).value =
        data.music.url || "";


    document.getElementById(
        "musicDescriptionInput"
    ).value =
        data.music.description || "";


    openModal("musicModal");

}


document
    .getElementById("musicForm")
    .addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            data.music = {

                title:
                    document.getElementById(
                        "musicTitleInput"
                    ).value,

                artist:
                    document.getElementById(
                        "musicArtistInput"
                    ).value,

                url:
                    document.getElementById(
                        "musicUrlInput"
                    ).value,

                description:
                    document.getElementById(
                        "musicDescriptionInput"
                    ).value

            };


            saveData();

            closeModal("musicModal");

            renderMusic();

            showToast(
                "Nossa música foi atualizada. 🎵"
            );

        }
    );


function renderMusic() {

    document.getElementById(
        "musicName"
    ).textContent =
        data.music.title ||
        "Nossa música ainda não foi cadastrada.";


    document.getElementById(
        "musicArtist"
    ).textContent =
        data.music.artist ||
        "Adicione uma música especial para vocês.";


    const link =
        document.getElementById(
            "musicLink"
        );


    if (data.music.url) {

        link.href =
            data.music.url;

        link.classList.remove(
            "hidden"
        );

    } else {

        link.classList.add(
            "hidden"
        );

    }

}


/* =========================================================
   LUGARES
========================================================= */

function openPlaceModal() {

    document
        .getElementById("placeForm")
        .reset();

    openModal("placeModal");

}


document
    .getElementById("placeForm")
    .addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            data.places.push({

                id:
                    crypto.randomUUID(),

                title:
                    document.getElementById(
                        "placeTitle"
                    ).value,

                date:
                    document.getElementById(
                        "placeDate"
                    ).value,

                address:
                    document.getElementById(
                        "placeAddress"
                    ).value,

                description:
                    document.getElementById(
                        "placeDescription"
                    ).value

            });


            saveData();

            closeModal(
                "placeModal"
            );

            renderPlaces();

            showToast(
                "Lugar guardado na nossa história. 📍"
            );

        }
    );


function renderPlaces() {

    const container =
        document.getElementById(
            "placesGrid"
        );


    if (!data.places.length) {

        container.innerHTML = `
            <div class="empty-state">
                <span>📍</span>
                <p>
                    Ainda não cadastramos lugares
                    especiais.
                </p>
            </div>
        `;

        return;

    }


    container.innerHTML =
        data.places.map(
            place => `

                <article class="place-card">

                    <div class="letter-envelope">
                        📍
                    </div>

                    <h2>
                        ${escapeHTML(place.title)}
                    </h2>

                    ${
                        place.date
                            ? `
                                <span class="eyebrow">
                                    ${formatDate(place.date)}
                                </span>
                            `
                            : ""
                    }

                    ${
                        place.address
                            ? `
                                <p>
                                    ${escapeHTML(place.address)}
                                </p>
                            `
                            : ""
                    }

                    <p>
                        ${escapeHTML(
                            place.description || ""
                        )}
                    </p>

                </article>

            `
        ).join("");

}


/* =========================================================
   NESTE DIA
========================================================= */

function renderThisDay() {

    const section =
        document.getElementById(
            "thisDaySection"
        );


    const content =
        document.getElementById(
            "thisDayContent"
        );


    const today =
        new Date();


    const month =
        String(
            today.getMonth() + 1
        ).padStart(2, "0");


    const day =
        String(
            today.getDate()
        ).padStart(2, "0");


    const memories =
        data.memories.filter(
            memory => {

                const parts =
                    memory.date.split("-");

                return (
                    parts[1] === month &&
                    parts[2] === day &&
                    parts[0] !==
                    String(today.getFullYear())
                );

            }
        );


    if (!memories.length) {

        section.classList.add(
            "hidden"
        );

        return;

    }


    section.classList.remove(
        "hidden"
    );


    content.innerHTML =
        memories.map(
            memory => `

                <div class="memory-card">

                    ${
                        memory.image
                            ? `
                                <img
                                    class="memory-image"
                                    src="${memory.image}"
                                >
                            `
                            : ""
                    }

                    <div class="memory-content">

                        <span class="eyebrow">
                            ${formatDate(memory.date)}
                        </span>

                        <h3>
                            ${escapeHTML(memory.title)}
                        </h3>

                        <p>
                            ${escapeHTML(
                                memory.description || ""
                            )}
                        </p>

                    </div>

                </div>

            `
        ).join("");

}


/* =========================================================
   ESTATÍSTICAS
========================================================= */

function renderStats() {

    document.getElementById(
        "memoriesCount"
    ).textContent =
        data.memories.length;


    document.getElementById(
        "photosCount"
    ).textContent =
        data.memories.filter(
            memory => memory.image
        ).length;


    document.getElementById(
        "lettersCount"
    ).textContent =
        data.letters.length;


    document.getElementById(
        "datesCount"
    ).textContent =
        data.importantDates.length;

}


/* =========================================================
   RETROSPECTIVA
========================================================= */

function renderYearSelector() {

    const selector =
        document.getElementById(
            "yearSelector"
        );


    const years =
        new Set();


    years.add(
        new Date(
            data.settings.relationshipDate
        ).getFullYear()
    );


    data.memories.forEach(
        memory =>
            years.add(
                new Date(memory.date)
                    .getFullYear()
            )
    );


    data.events.forEach(
        event =>
            years.add(
                new Date(event.date)
                    .getFullYear()
            )
    );


    const currentYear =
        new Date().getFullYear();


    years.add(currentYear);


    selector.innerHTML =
        [...years]
            .sort((a, b) => b - a)
            .map(
                year =>
                    `<option value="${year}">
                        ${year}
                    </option>`
            )
            .join("");

}


function renderRetrospective() {

    const year =
        Number(
            document.getElementById(
                "yearSelector"
            ).value
        );


    if (!year) {
        return;
    }


    const memories =
        data.memories.filter(
            memory =>
                new Date(memory.date)
                    .getFullYear() === year
        );


    const events =
        data.events.filter(
            event =>
                new Date(event.date)
                    .getFullYear() === year
        );


    const letters =
        data.letters.filter(
            letter =>
                new Date(letter.createdAt)
                    .getFullYear() === year
        );


    const container =
        document.getElementById(
            "retrospectiveContent"
        );


    container.innerHTML = `

        <div class="stats-grid">

            <div class="stat-card">
                <span>❤️</span>
                <strong>${memories.length}</strong>
                <p>momentos</p>
            </div>

            <div class="stat-card">
                <span>📸</span>
                <strong>
                    ${memories.filter(
                        item => item.image
                    ).length}
                </strong>
                <p>fotos</p>
            </div>

            <div class="stat-card">
                <span>📅</span>
                <strong>${events.length}</strong>
                <p>eventos</p>
            </div>

            <div class="stat-card">
                <span>💌</span>
                <strong>${letters.length}</strong>
                <p>cartas</p>
            </div>

        </div>


        <div class="message-card">

            <span>♡</span>

            <p>
                ${
                    year === 2026
                        ? "Foi em 2026 que a nossa história começou."
                        : `Um capítulo especial da nossa história em ${year}.`
                }
            </p>

        </div>

    `;

}


/* =========================================================
   CONFIGURAÇÕES
========================================================= */

function loadSettingsForm() {

    document.getElementById(
        "myName"
    ).value =
        data.settings.myName;


    document.getElementById(
        "herName"
    ).value =
        data.settings.herName;


    document.getElementById(
        "coupleNickname"
    ).value =
        data.settings.nickname;


    document.getElementById(
        "relationshipDate"
    ).value =
        data.settings.relationshipDate;


    document.getElementById(
        "couplePhrase"
    ).value =
        data.settings.phrase;

}


document
    .getElementById("settingsForm")
    .addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            data.settings.myName =
                document.getElementById(
                    "myName"
                ).value;


            data.settings.herName =
                document.getElementById(
                    "herName"
                ).value;


            data.settings.nickname =
                document.getElementById(
                    "coupleNickname"
                ).value;


            data.settings.relationshipDate =
                document.getElementById(
                    "relationshipDate"
                ).value ||
                DEFAULT_DATE;


            data.settings.phrase =
                document.getElementById(
                    "couplePhrase"
                ).value;


            const photo =
                document.getElementById(
                    "couplePhoto"
                ).files[0];


            if (photo) {

                data.settings.photo =
                    await readImage(photo);

            }


            saveData();

            renderAll();

            showToast(
                "Configurações salvas. ♡"
            );

        }
    );


/* =========================================================
   TEMAS
========================================================= */

function setTheme(theme) {

    document.body.classList.remove(
        "dark",
        "romantic"
    );


    if (theme === "dark") {

        document.body.classList.add(
            "dark"
        );

    }


    if (theme === "romantic") {

        document.body.classList.add(
            "romantic"
        );

    }


    data.settings.theme =
        theme;


    saveData();

}


function toggleTheme() {

    if (
        data.settings.theme ===
        "light"
    ) {

        setTheme("dark");

    } else {

        setTheme("light");

    }

}


/* =========================================================
   BACKUP
========================================================= */

function exportData() {

    const backup = {

        application:
            "Nosso Cantinho",

        version:
            "1.0",

        exportedAt:
            new Date().toISOString(),

        data

    };


    const blob =
        new Blob(
            [
                JSON.stringify(
                    backup,
                    null,
                    2
                )
            ],
            {
                type:
                    "application/json"
            }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement(
            "a"
        );


    link.href = url;

    link.download =
        `nosso-cantinho-backup-${new Date()
            .toISOString()
            .split("T")[0]}.json`;


    link.click();


    URL.revokeObjectURL(url);


    showToast(
        "Backup criado com sucesso. 💾"
    );

}


function importData(event) {

    const file =
        event.target.files[0];


    if (!file) {
        return;
    }


    const reader =
        new FileReader();


    reader.onload =
        function () {

            try {

                const backup =
                    JSON.parse(
                        reader.result
                    );


                if (!backup.data) {

                    throw new Error(
                        "Backup inválido."
                    );

                }


                data =
                    backup.data;


                saveData();

                renderAll();

                showToast(
                    "Backup restaurado. ♡"
                );

            } catch (error) {

                alert(
                    "Não foi possível restaurar este backup."
                );

                console.error(error);

            }

        };


    reader.readAsText(file);

}


/* =========================================================
   MODAIS
========================================================= */

function openModal(id) {

    document
        .getElementById(id)
        .classList.add("open");

}


function closeModal(id) {

    document
        .getElementById(id)
        .classList.remove("open");

}


document.addEventListener(
    "click",
    function (event) {

        if (
            event.target.classList.contains(
                "modal"
            )
        ) {

            event.target.classList.remove(
                "open"
            );

        }

    }
);


/* =========================================================
   RENDERIZAÇÃO GERAL
========================================================= */

function renderAll() {

    renderHome();

    renderMemories();

    renderCalendar();

    renderTimeline();

    renderLetters();

    renderSurprises();

    renderImportantDates();

    renderMusic();

    renderPlaces();

    renderYearSelector();

    renderRetrospective();

    loadSettingsForm();

    updateCounter();

    updateAnniversary();


    setTheme(
        data.settings.theme ||
        "light"
    );

}


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        renderAll();

    }
);