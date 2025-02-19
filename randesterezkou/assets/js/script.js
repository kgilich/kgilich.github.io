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

const storedPasswordHash = "1df0d19f5d4b6f0c0a4d9b0abca8cddaa8eb6698fe7b55a6112ce7959c50908d"; 

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
    const dateElement = document.getElementById('date');
    const ideaElement = document.getElementById('idea');

    const today = new Date().toISOString().split("T")[0]; 
    const savedData = JSON.parse(localStorage.getItem("dailyIdea"));

    if (savedData && savedData.date === today) {
        // Pokud už je dnes uložený nápad, použij ho
        ideaElement.textContent = savedData.idea;
    } else {
        // Vyber nový nápad
        let idea;
        if (oneTimeIdeas.length > 0 && Math.random() < 0.5) {
            // Vyber jednorázový nápad
            const randomIndex = Math.floor(Math.random() * oneTimeIdeas.length);
            idea = oneTimeIdeas.splice(randomIndex, 1)[0]; // Odstraní nápad ze seznamu
        } else {
            // Vyber opakovatelný nápad
            idea = repeatableIdeas[Math.floor(Math.random() * repeatableIdeas.length)];
        }

        // Ulož nový nápad do localStorage
        localStorage.setItem("dailyIdea", JSON.stringify({ date: today, idea }));

        ideaElement.textContent = idea;
    }

    dateElement.textContent = `Dnes je: ${today}`;
}
