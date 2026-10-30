(() => {
    const EMAIL = 'krystof@gilich.cz';

    const year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();

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
