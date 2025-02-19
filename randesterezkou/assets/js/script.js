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

const usedOneTimeIdeas = new Set();

// Heslo (pro jednoduchost zatím v kódu, ale můžeš ho přesunout do zabezpečeného prostředí)
const correctPassword = "tajneheslo"; // Nahraď skutečným heslem

function checkPassword() {
    const password = document.getElementById('password').value;

    if (password === correctPassword) {
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

    const today = new Date();
    dateElement.textContent = `Dnes je: ${today.toLocaleDateString()}`;

    let idea;
    if (oneTimeIdeas.length > 0 && Math.random() < 0.5) {
        // Vyber jednorázový nápad
        const randomIndex = Math.floor(Math.random() * oneTimeIdeas.length);
        idea = oneTimeIdeas.splice(randomIndex, 1)[0]; // Odstraní nápad ze seznamu
        usedOneTimeIdeas.add(idea);
    } else {
        // Vyber opakovatelný nápad
        idea = repeatableIdeas[Math.floor(Math.random() * repeatableIdeas.length)];
    }

    ideaElement.textContent = idea;
}