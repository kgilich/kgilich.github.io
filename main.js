(() => {
    const EMAIL = 'krystof@gilich.cz';

    const year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();

    // Rozbalovací menu: zavřít klikem mimo nebo klávesou Esc
    const menu = document.querySelector('.menu');
    if (menu) {
        document.addEventListener('click', (e) => {
            if (menu.open && !menu.contains(e.target)) menu.open = false;
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menu.open) {
                menu.open = false;
                menu.querySelector('summary').focus();
            }
        });
    }

    // Seznamy s data-limit: ukázat jen prvních N položek, zbytek pod tlačítkem
    document.querySelectorAll('[data-limit]').forEach((list) => {
        const limit = Number(list.dataset.limit);
        const extra = [...list.children]
            .filter((li) => !li.classList.contains('card-placeholder'))
            .slice(limit);
        if (!extra.length) return;

        extra.forEach((li) => { li.hidden = true; });

        const more = document.createElement('button');
        more.type = 'button';
        more.className = 'btn btn-ghost more';
        more.textContent = `Zobrazit další (${extra.length})`;
        more.addEventListener('click', () => {
            extra.forEach((li) => { li.hidden = false; });
            more.remove();
            extra[0].querySelector('a')?.focus({ preventScroll: true });
        });
        list.after(more);
    });

    const btn = document.getElementById('copy');
    const label = document.getElementById('copy-label');
    const icon = document.getElementById('copy-icon');
    const status = document.getElementById('copy-status');
    if (!btn) return;

    let timer;

    const feedback = (ok) => {
        label.textContent = ok ? 'Zkopírováno' : 'Zkopírujte ručně';
        status.textContent = ok ? `E-mail ${EMAIL} byl zkopírován.` : `Kopírování selhalo, e-mail je ${EMAIL}.`;
        btn.classList.toggle('done', ok);
        icon.setAttribute('href', ok ? '#i-check' : '#i-copy');
        clearTimeout(timer);
        timer = setTimeout(() => {
            label.textContent = 'Kopírovat';
            status.textContent = '';
            btn.classList.remove('done');
            icon.setAttribute('href', '#i-copy');
        }, 2500);
    };

    btn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(EMAIL);
            feedback(true);
        } catch {
            feedback(false);
        }
    });
})();
