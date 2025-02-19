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

// Hash hesla (vygenerovaný bcryptem)
const hashedPassword = "$2y$10$r1MNJVRAPwgpJHWew1.EcOZgasvCSg9p6GvMv0kfItb/pB8dCep1S";

async function checkPassword() {
    const password = document.getElementById('password').value;
    
    const match = await bcrypt.compare(password, hashedPassword);
    if (match) {
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

    const today = new Date().toISOString().split("T")[0]; // Formát YYYY-MM-DD
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
