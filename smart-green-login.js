document.addEventListener('DOMContentLoaded', () => {

    const loginForm   = document.getElementById('loginForm');
    const emailInput  = document.getElementById('email');
    const passInput   = document.getElementById('password');
    const eyeToggle   = document.getElementById('eyeToggle');
    const eyeIcon     = document.getElementById('eyeIcon');
    const submitBtn   = document.getElementById('submitBtn');
    const btnText     = document.getElementById('btnText');
    const btnIcon     = document.getElementById('btnIcon');
    const formAlert   = document.getElementById('formAlert');
    const alertMsg    = document.getElementById('alertMessage');
    const loginBox    = document.querySelector('.login-box');

    // ── Password visibility toggle ────────────────────────
    eyeToggle.addEventListener('click', () => {
        const isHidden = passInput.type === 'password';
        passInput.type = isHidden ? 'text' : 'password';
        eyeIcon.classList.toggle('fa-eye-slash', !isHidden);
        eyeIcon.classList.toggle('fa-eye', isHidden);
    });

    // ── Helper: show alert ────────────────────────────────
    function showAlert(message) {
        alertMsg.textContent = message;
        formAlert.style.display = 'flex';
    }

    function hideAlert() {
        formAlert.style.display = 'none';
    }

    // ── Helper: shake card ────────────────────────────────
    function shakeCard() {
        loginBox.classList.remove('shake');
        void loginBox.offsetWidth; // reflow to restart animation
        loginBox.classList.add('shake');
        loginBox.addEventListener('animationend', () => {
            loginBox.classList.remove('shake');
        }, { once: true });
    }

    // ── Clear alert on input ──────────────────────────────
    emailInput.addEventListener('input', hideAlert);
    passInput.addEventListener('input', hideAlert);

    // ── Form submission ───────────────────────────────────
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email    = emailInput.value.trim();
        const password = passInput.value;

        // Basic validation
        if (!email) {
            showAlert('Veuillez saisir votre adresse email.');
            shakeCard();
            emailInput.focus();
            return;
        }

        if (!email.includes('@')) {
            showAlert('Adresse email invalide.');
            shakeCard();
            emailInput.focus();
            return;
        }

        if (!password) {
            showAlert('Veuillez saisir votre mot de passe.');
            shakeCard();
            passInput.focus();
            return;
        }

        if (password.length < 4) {
            showAlert('Mot de passe trop court.');
            shakeCard();
            passInput.focus();
            return;
        }

        hideAlert();

        // ── Loading state ─────────────────────────────────
        submitBtn.disabled = true;
        btnText.textContent = 'Connexion en cours...';
        btnIcon.className = 'fa-solid fa-spinner fa-spin';

        // Simulate API call (replace with real auth)
        setTimeout(() => {

            // ── Success state ─────────────────────────────
            loginBox.classList.add('success');
            btnText.textContent = 'Accès autorisé';
            btnIcon.className = 'fa-solid fa-check';
            submitBtn.style.background = 'var(--accent-teal)';
            submitBtn.style.color      = 'var(--bg-deep)';

            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 700);

        }, 1500);
    });

    // ── Tilt effect on the login card (desktop only) ──────
    if (window.innerWidth > 960 && loginBox) {
        loginBox.addEventListener('mousemove', (e) => {
            const rect = loginBox.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cx = rect.width / 2;
            const cy = rect.height / 2;
            const rotX = ((y - cy) / cy) * -4;
            const rotY = ((x - cx) / cx) * 4;
            loginBox.style.transform =
                `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
            loginBox.style.transition = 'none';
        });

        loginBox.addEventListener('mouseleave', () => {
            loginBox.style.transform = '';
            loginBox.style.transition = 'transform 0.6s ease, box-shadow 0.6s ease';
        });
    }

});
