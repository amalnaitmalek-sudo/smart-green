document.addEventListener('DOMContentLoaded', () => {

    const form        = document.getElementById('registerForm');
    const alertBox    = document.getElementById('formAlert');
    const alertMsg    = document.getElementById('alertMessage');
    const successBox  = document.getElementById('formSuccess');
    const submitBtn   = document.getElementById('submitBtn');
    const btnText     = document.getElementById('btnText');
    const btnIcon     = document.getElementById('btnIcon');
    const loginBox    = document.querySelector('.login-box');

    const pwdInput    = document.getElementById('regPassword');
    const pwdConfirm  = document.getElementById('regPasswordConfirm');
    const pwdFill     = document.getElementById('pwdFill');
    const pwdHint     = document.getElementById('pwdHint');

    // ── Eye toggles ───────────────────────────────────────
    function toggleEye(btnId, iconId, inputId) {
        document.getElementById(btnId).addEventListener('click', () => {
            const input = document.getElementById(inputId);
            const icon  = document.getElementById(iconId);
            const show  = input.type === 'password';
            input.type  = show ? 'text' : 'password';
            icon.classList.toggle('fa-eye-slash', !show);
            icon.classList.toggle('fa-eye', show);
        });
    }
    toggleEye('eyeToggle1', 'eyeIcon1', 'regPassword');
    toggleEye('eyeToggle2', 'eyeIcon2', 'regPasswordConfirm');

    // ── Password strength ─────────────────────────────────
    pwdInput.addEventListener('input', () => {
        const v = pwdInput.value;
        let score = 0;
        if (v.length >= 8)           score++;
        if (v.length >= 12)          score++;
        if (/[A-Z]/.test(v))         score++;
        if (/[0-9]/.test(v))         score++;
        if (/[^A-Za-z0-9]/.test(v))  score++;

        const pct   = (score / 5) * 100;
        const color = score <= 1 ? '#ef4444'
                    : score <= 2 ? '#f59e0b'
                    : score <= 3 ? '#1a6dff'
                    :              '#00d68f';
        const label = score <= 1 ? 'Très faible'
                    : score <= 2 ? 'Faible'
                    : score <= 3 ? 'Correct'
                    : score <= 4 ? 'Fort'
                    :              'Très fort';

        pwdFill.style.width      = pct + '%';
        pwdFill.style.background = color;
        pwdHint.textContent      = `Force du mot de passe : ${label}`;
        pwdHint.style.color      = color;
    });

    // ── Alert helpers ─────────────────────────────────────
    function showAlert(msg) {
        alertMsg.textContent = msg;
        alertBox.style.display = 'flex';
        successBox.style.display = 'none';
    }

    function clearAlert() { alertBox.style.display = 'none'; }

    function shakeBox() {
        loginBox.classList.remove('shake');
        void loginBox.offsetWidth;
        loginBox.classList.add('shake');
        loginBox.addEventListener('animationend', () => {
            loginBox.classList.remove('shake');
        }, { once: true });
    }

    // ── Clear alert on any input ──────────────────────────
    form.querySelectorAll('input, select').forEach(el => {
        el.addEventListener('input', clearAlert);
        el.addEventListener('change', clearAlert);
    });

    // ── Form submit ───────────────────────────────────────
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const firstName = document.getElementById('firstName').value.trim();
        const lastName  = document.getElementById('lastName').value.trim();
        const email     = document.getElementById('regEmail').value.trim();
        const dept      = document.getElementById('department').value;
        const role      = document.getElementById('role').value;
        const pwd       = pwdInput.value;
        const pwdC      = pwdConfirm.value;
        const terms     = document.getElementById('terms').checked;

        if (!firstName)            return showAlert('Le prénom est requis.'),       shakeBox();
        if (!lastName)             return showAlert('Le nom est requis.'),           shakeBox();
        if (!email || !email.includes('@')) return showAlert('Email institutionnel invalide.'), shakeBox();
        if (!dept)                 return showAlert('Veuillez sélectionner un département.'), shakeBox();
        if (!role)                 return showAlert('Veuillez sélectionner un rôle.'), shakeBox();
        if (pwd.length < 8)        return showAlert('Le mot de passe doit contenir au moins 8 caractères.'), shakeBox();
        if (pwd !== pwdC)          return showAlert('Les mots de passe ne correspondent pas.'), shakeBox();
        if (!terms)                return showAlert('Veuillez accepter les conditions d\'utilisation.'), shakeBox();

        clearAlert();

        // Loading state
        submitBtn.disabled = true;
        btnText.textContent = 'Envoi en cours...';
        btnIcon.className   = 'fa-solid fa-spinner fa-spin';

        // Simulate API
        setTimeout(() => {
            btnText.textContent    = 'Demande envoyée';
            btnIcon.className      = 'fa-solid fa-check';
            submitBtn.style.background = 'var(--accent-teal)';
            submitBtn.style.color      = 'var(--bg-deep)';

            alertBox.style.display = 'none';
            successBox.style.display = 'flex';
            form.style.opacity = '0.5';
            form.style.pointerEvents = 'none';
        }, 1600);
    });

});
