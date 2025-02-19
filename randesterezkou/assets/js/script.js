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
    "Procházka a čaj",
    "Procházka po západu slunce",
    "Společné malování nebo kreslení",
    "Hraní her na xboxu",
    "Procházka po městě a hledání skrytých zákoutí",
    "Společné čtení knihy",
    "Večer s hudbou a drinkem",
    "Procházka po lese",
    "Společné pečení sušenek",
    "Večer s karetními hrami",
    "Společné plánování výletu",
    "Procházka po nábřeží",
    "Večer s DIY projekty",
    "Mazlení při svíčkách a podcastu",
    "Společné poslouchání podcastů a relax na gauči"
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
    "Kreativní večer - výroba vlastního šperku navzájem",
    "Dobrovolničení",
    "Společné cvičení jógy",
    "Společně zajdeme na kruháč",
    "Večer s deskovými hrami v kavárně",
    "Projížďka lodí po řece",
    "Společné sledování hvězd",
    "Návštěva místního festivalu nebo akce",
    "Společné pečení pizzy",
    "Procházka po pražském hradě a zahrádách",
    "Společné tvoření scrapbooku",
    "Návštěva planetária na Výstavišti",
    "Společné tvoření svíček",
    "Návštěva místního blešího trhu",
    "Projížďka historickou tramvají",
    "Urbex po Bulovce",
    "Návštěva wellness",
    "Roleplay rande - ty rozhodně hraješ sestřičku :D",
    "Zajdeme na minigolf",
    "Hra na pravdu nebo úkol",
    "Společné vaření ve spodním prádle"
];

const storedPasswordHash = "7d46392f594b19f98efb79f0a3d9cddd4be1fbc79f51f98e1f58f62dd0cddcdd";

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
}

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
    console.log("showIdea spuštěno");
    const dateElement = document.getElementById('date');
    const ideaElement = document.getElementById('idea');
    const buttonsElement = document.getElementById('buttons');
    const today = new Date().toISOString().split("T")[0];
    let savedData = JSON.parse(localStorage.getItem("dailyIdea"));

    if (!savedData || savedData.date !== today) {
        savedData = { date: today, shownIdeas: [], accepted: false };
        localStorage.setItem("dailyIdea", JSON.stringify(savedData));
    }

    if (savedData.accepted) {
        ideaElement.textContent = "Dnes už máš nápad vybraný! 🥰";
        buttonsElement.classList.add('hidden');
        return;
    }

    let availableIdeas = [...repeatableIdeas, ...oneTimeIdeas].filter(idea => !savedData.shownIdeas.includes(idea));
    
    if (availableIdeas.length === 0) {
        ideaElement.textContent = "Dnes už žádné další nápady. Zkus to zítra!";
        buttonsElement.classList.add('hidden');
        return;
    }

    const randomIndex = Math.floor(Math.random() * availableIdeas.length);
    const idea = availableIdeas[randomIndex];

    savedData.shownIdeas.push(idea);
    localStorage.setItem("dailyIdea", JSON.stringify(savedData));

    ideaElement.textContent = idea;

    buttonsElement.classList.remove('hidden');
    console.log("Tlačítka by měla být viditelná");

    const yesButton = document.getElementById('yesButton');
    const noButton = document.getElementById('noButton');
    
    yesButton.replaceWith(yesButton.cloneNode(true));
    noButton.replaceWith(noButton.cloneNode(true));
    
    document.getElementById('yesButton').addEventListener('click', () => {
        console.log("Kliknuto na ANO");
        savedData.accepted = true;
        localStorage.setItem("dailyIdea", JSON.stringify(savedData));

        if (oneTimeIdeas.includes(idea)) {
            oneTimeIdeas = oneTimeIdeas.filter(item => item !== idea);
        }

        sendEmail(idea);
        buttonsElement.classList.add('hidden');
        showIdea();
    });

    document.getElementById('noButton').addEventListener('click', () => {
        console.log("Kliknuto na NE");
        showIdea();
    });
}

function sendEmail(idea) {
    emailjs.send("service_3ajmdvq", "template_c8gro55", {
        subject: 'Tip na rande',
        content: idea,
    })
    .then(response => {
        alert("A Tofin už o tvém zájmu ví! 🥰");
    }, error => {
        console.log('EmailJS error:', error);
        alert("Nastala chyba, musíš Tofinovi sama říct, že se ti tenhle tip líbí 😔");
    });
}
