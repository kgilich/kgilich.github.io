import { existsSync } from 'node:fs';

// Tlačítko „Stáhnout CV" se zobrazí jen tehdy, když soubor opravdu existuje.
// Anglická verze bez vlastního souboru použije české CV.
const file = (name) => (existsSync(`src/files/${name}`) ? `/files/${name}` : null);

const cs = file('cv.pdf');

export default {
    cs,
    en: file('cv-en.pdf') ?? cs,
};
