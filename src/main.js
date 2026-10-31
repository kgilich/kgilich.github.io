(() => {
    const year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();

    // Rozbalovací menu: zavřít klikem mimo nebo klávesou Esc.
    // Upozorňující tečka na tlačítku zmizí, jakmile návštěvník menu jednou otevře.
    const menu = document.querySelector('.menu');
    if (menu) {
        const SEEN = 'services-seen';
        try {
            if (localStorage.getItem(SEEN)) menu.classList.add('seen');
        } catch {}

        menu.addEventListener('toggle', () => {
            if (!menu.open) return;
            menu.classList.add('seen');
            try { localStorage.setItem(SEEN, '1'); } catch {}
        });
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
        more.textContent = (list.dataset.more || 'Zobrazit další ({n})').replace('{n}', extra.length);
        more.addEventListener('click', () => {
            extra.forEach((li) => { li.hidden = false; });
            more.remove();
            extra[0].querySelector('a')?.focus({ preventScroll: true });
        });
        list.after(more);
    });

    // Kopírování e-mailu; texty v jazyce stránky jsou v data-* atributech tlačítka
    const btn = document.getElementById('copy');
    if (!btn) return;
    const label = document.getElementById('copy-label');
    const icon = document.getElementById('copy-icon');
    const status = document.getElementById('copy-status');
    const { email, ...text } = btn.dataset;

    let timer;

    const feedback = (ok) => {
        label.textContent = ok ? text.copied : text.failed;
        status.textContent = (ok ? text.status : text.statusFailed).replace('{email}', email);
        btn.classList.toggle('done', ok);
        icon.setAttribute('href', ok ? '#i-check' : '#i-copy');
        clearTimeout(timer);
        timer = setTimeout(() => {
            label.textContent = text.label;
            status.textContent = '';
            btn.classList.remove('done');
            icon.setAttribute('href', '#i-copy');
        }, 2500);
    };

    btn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(email);
            feedback(true);
        } catch {
            feedback(false);
        }
    });
})();
