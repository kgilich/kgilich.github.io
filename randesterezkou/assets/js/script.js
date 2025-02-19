// Seznam nápadů
const repeatableIdeas = [
    "Večeře při svíčkách doma",
    "Procházka v parku a zmrzlina",
    "Kino a popcorn",
    "Večerní piknik u řeky",
    "Společné vaření nového receptu",
    "Hra deskových her",
    "Projížďka na kole"
];

const oneTimeIdeas = [
    "Nocleh pod širákem",
    "Návštěva muzea",
    "Karaoke večer",
    "Výlet do zoo",
    "Návštěva aquaparku"
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
    const savedData = JSON.parse(localStorage.getItem("dailyIdea"));

    if (savedData && savedData.date === today) {
        ideaElement.textContent = savedData.idea;
    } else {
        let idea;
        if (oneTimeIdeas.length > 0 && Math.random() < 0.5) {
            const randomIndex = Math.floor(Math.random() * oneTimeIdeas.length);
            idea = oneTimeIdeas.splice(randomIndex, 1)[0];
        } else {
            idea = repeatableIdeas[Math.floor(Math.random() * repeatableIdeas.length)];
        }

        localStorage.setItem("dailyIdea", JSON.stringify({ date: today, idea }));

        ideaElement.textContent = idea;
    }

    dateElement.textContent = `${today}`;
    
    // Zobraz tlačítka pro odpověď
    buttonsElement.classList.remove('hidden');

    // Nastavení událostí pro tlačítka
    document.getElementById('yesButton').addEventListener('click', () => {
        sendEmail(idea);
        buttonsElement.classList.add('hidden'); // Skrytí tlačítek po kliknutí
    });
    document.getElementById('noButton').addEventListener('click', () => {
        buttonsElement.classList.add('hidden'); // Skrytí tlačítek po kliknutí
    });
}

function sendEmail(idea) {
    const emailContent = `
        Dobrý den,

        Tady je dnešní tip na rande:

        ${idea}
    `;
    emailjs.init("AQjPK0xnpjX2YjDyO");
    emailjs.send("service_3ajmdvq", "template_c8gro55", {
        subject: 'Tip na rande',
        content: emailContent,
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
