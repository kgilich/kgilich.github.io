const repeatableIdeas = [
    "Večeře a deskovky u mě",
    "Procházka s Candy a zmrzlina",
    "Netflix a masáž",
    "Večerní procházka",
    "Společné vaření nového receptu",
    "Hra deskových her",
    "Projížďka na rekolech podél Vltavy",
    "Brusle a běh na Ladronce",
    "Lezení/procházka a mekáč",
    "Sauna / Bazén",
    "Výlet po okolí Prahy",
    "Přespávačka",
    "Společný čas jentak",
    "Masáž, čaj a pokec",
    "Procházka a čaj"
];

let oneTimeIdeas = [
    "Veřejné bruslení",
    "Návštěva památky",
    "Hospoda a pokec",
    "Výlet do zoo",
    "Zajdeme si na masáž",
    "Pipča a chill",
    "Něco nového v Banh-Mi-Ba",
    "Jízda na koni",
    "Společné sledování západu slunce",
    "Úniková hra pro dva",
    "Kreativní večer - výroba vlastního šperku",
    "Dobrovolničení"
];

// Uložený hash hesla (SHA-256)
const storedPasswordHash = "7d46392f594b19f98efb79f0a3d9cddd4be1fbc79f51f98e1f58f62dd0cddcdd";

// Funkce pro hashování hesla
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
}

// Ověření hesla
async function checkPassword() {
    const password = document.getElementById('password').value;
    const hashedPassword = await hashPassword(password);

    if (hashedPassword === storedPasswordHash) {
        document.getElementById('password-screen').classList.add('hidden');
        document.getElementById('content').classList.remove('hidden');
        showIdea();
    } else {
        document.getElementById('error-message').classList.remove('hidden');
    }
}

function showIdea() {
    const dateElement = document.getElementById('date');
    const ideaElement = document.getElementById('idea');
    const buttonsElement = document.getElementById('buttons');
    
    const today = new Date().toISOString().split("T")[0];
    let savedData = JSON.parse(localStorage.getItem("dailyIdea"));

    // Reset pro nový den
    if (!savedData || savedData.date !== today) {
        savedData = { date: today, shownIdeas: [], accepted: false };
        localStorage.setItem("dailyIdea", JSON.stringify(savedData));
    }

    // Pokud byl nápad již přijat, zobrazíme hlášku
    if (savedData.accepted) {
        ideaElement.textContent = "Dnes už máš nápad vybraný! 🥰";
        buttonsElement.classList.add('hidden');
        return;
    }

    // Vytvoříme pole dostupných nápadů (bez těch, které již byly zobrazeny)
    let availableIdeas = [...repeatableIdeas, ...oneTimeIdeas];
    availableIdeas = availableIdeas.filter(idea => !savedData.shownIdeas.includes(idea));

    // Pokud už nejsou žádné nápady, zobrazíme hlášku
    if (availableIdeas.length === 0) {
        ideaElement.textContent = "Dnes už nemáme žádné další nápady. Zkus to zítra!";
        buttonsElement.classList.add('hidden');
        return;
    }

    // Vybereme náhodný nápad z dostupných
    const randomIndex = Math.floor(Math.random() * availableIdeas.length);
    const idea = availableIdeas[randomIndex];

    // Přidáme nápad do seznamu již zobrazených nápadů
    savedData.shownIdeas.push(idea);
    localStorage.setItem("dailyIdea", JSON.stringify(savedData));

    // Zobrazíme nápad
    ideaElement.textContent = idea;
    dateElement.textContent = `${today}`;
    
    // Zobrazíme tlačítka pro odpověď
    buttonsElement.classList.remove('hidden');

    // Odstraníme staré event listenery (pokud existují)
    const yesButton = document.getElementById('yesButton');
    const noButton = document.getElementById('noButton');
    yesButton.replaceWith(yesButton.cloneNode(true)); // "Reset" tlačítka
    noButton.replaceWith(noButton.cloneNode(true)); // "Reset" tlačítka

    document.getElementById('yesButton').addEventListener('click', () => {
        savedData.accepted = true;
        localStorage.setItem("dailyIdea", JSON.stringify(savedData));

        if (oneTimeIdeas.includes(idea)) {
            oneTimeIdeas = oneTimeIdeas.filter(item => item !== idea);
        }

        sendEmail(idea);
        buttonsElement.classList.add('hidden'); 
    });

    document.getElementById('noButton').addEventListener('click', () => {
        // Zobrazíme další nápad
        showIdea();
    });
}

function sendEmail(idea) {
    emailjs.send("service_3ajmdvq", "template_c8gro55", {
        subject: 'Tip na rande',
        content: idea, // Zde posíláme text
    })
    .then(response => {
        // Zobrazení hlášky při úspěchu
        alert("A Tofin už o tvém zájmu ví! 🥰");
    }, error => {
        console.log('EmailJS error:', error);
        // Zobrazení hlášky při chybě
        alert("Nastala chyba, musíš Tofinovi sama říct, že se ti tenhle tip líbí 😔");
    });
}
