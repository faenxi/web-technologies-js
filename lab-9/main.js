
const CITIES = {
    ukraine:   ['Kyiv', 'Lviv', 'Odesa', 'Kharkiv', 'Dnipro', 'Zaporizhzhia', 'Chernivtsi', 'Vinnytsia'],
    germany:   ['Berlin', 'Munich', 'Hamburg', 'Cologne', 'Frankfurt', 'Stuttgart', 'Düsseldorf'],
    france:    ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Nantes', 'Bordeaux'],
    usa:       ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'San Francisco', 'Miami'],
    poland:    ['Warsaw', 'Kraków', 'Gdańsk', 'Wrocław', 'Poznań', 'Łódź', 'Katowice'],
    uk:        ['London', 'Manchester', 'Birmingham', 'Glasgow', 'Liverpool', 'Leeds', 'Edinburgh'],
    canada:    ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Ottawa', 'Quebec City'],
    australia: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Canberra'],
};


document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        const target = tab.dataset.tab;

        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.form-panel').forEach(p => p.classList.remove('active'));

        tab.classList.add('active');
        const panel = document.getElementById('panel-' + target);
        panel.classList.add('active');

        panel.style.animation = 'none';
        void panel.offsetWidth;
        panel.style.animation = '';
    });
});

document.querySelectorAll('.eye-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const input = document.getElementById(btn.dataset.target);
        const isPass = input.type === 'password';
        input.type = isPass ? 'text' : 'password';
        btn.querySelector('.eye-icon').classList.toggle('hidden', isPass);
        btn.querySelector('.eye-off-icon').classList.toggle('hidden', !isPass);
    });
});

const countrySelect = document.getElementById('signup-country');
const citySelect    = document.getElementById('signup-city');

countrySelect.addEventListener('change', () => {
    const country = countrySelect.value;
    citySelect.disabled = !country;
    citySelect.innerHTML = '<option value="">— Choose city —</option>';

    if (country && CITIES[country]) {
        CITIES[country].forEach(city => {
            const opt = document.createElement('option');
            opt.value = city.toLowerCase().replace(/\s+/g, '-');
            opt.textContent = city;
            citySelect.appendChild(opt);
        });
    }

    triggerValidate(countrySelect, 'country');
    clearFieldState(citySelect, getMsgEl(citySelect));
});

function getMsgEl(inputEl) {
    return inputEl.closest('.field-group')?.querySelector('.field-msg') || null;
}

function triggerValidate(inputEl, fieldName, extraData = {}) {
    const result = validateField(fieldName, inputEl.value, extraData);
    applyFieldState(inputEl, getMsgEl(inputEl), result);
    return result.valid;
}

const signupForm = document.getElementById('form-signup');

signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateSignup()) {
        simulateSend(() => showModal('Account Created!', 'You have been successfully registered. Welcome aboard!'));
        signupForm.reset();
        resetFormStyles(signupForm);
        citySelect.disabled = true;
        citySelect.innerHTML = '<option value="">— Choose country —</option>';
    }
});

function validateSignup() {
    let allValid = true;
    const fd = { password: document.getElementById('signup-password').value };

    const fields = [
        { el: document.getElementById('signup-username'),  name: 'username' },
        { el: document.getElementById('signup-firstname'), name: 'firstName' },
        { el: document.getElementById('signup-lastname'),  name: 'lastName' },
        { el: document.getElementById('signup-email'),     name: 'email' },
        { el: document.getElementById('signup-password'),  name: 'password' },
        { el: document.getElementById('signup-confirm'),   name: 'confirmPassword', extra: fd },
        { el: document.getElementById('signup-phone'),     name: 'phone' },
        { el: document.getElementById('signup-dob'),       name: 'dob' },
        { el: countrySelect,                               name: 'country' },
        { el: citySelect,                                  name: 'city' },
    ];

    fields.forEach(({ el, name, extra }) => {
        if (!triggerValidate(el, name, extra || {})) allValid = false;
    });

    const sexMsg = document.getElementById('sex-msg');
    if (!signupForm.querySelector('input[name="sex"]:checked')) {
        sexMsg.textContent = 'Please select your sex.';
        sexMsg.className = 'field-msg invalid';
        allValid = false;
    } else {
        sexMsg.textContent = '';
        sexMsg.className = 'field-msg';
    }

    return allValid;
}

const loginForm = document.getElementById('form-login');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateLogin()) {
        const remember = document.getElementById('login-remember').checked;
        simulateSend(() => showModal(
            'Welcome back!',
            `You have successfully logged in.${remember ? ' Your session will be remembered.' : ''}`
        ));
        loginForm.reset();
        resetFormStyles(loginForm);
    }
});

function validateLogin() {
    let allValid = true;
    const fields = [
        { el: document.getElementById('login-username'), name: 'username' },
        { el: document.getElementById('login-password'), name: 'loginPassword' },
    ];
    fields.forEach(({ el, name }) => {
        if (!triggerValidate(el, name)) allValid = false;
    });
    return allValid;
}

function simulateSend(onSuccess) {
    const btn = document.querySelector('.form-panel.active .btn-primary');
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Sending…';
    setTimeout(() => {
        btn.disabled = false;
        btn.textContent = originalText;
        onSuccess();
    }, 900);
}

function resetFormStyles(formEl) {
    formEl.querySelectorAll('.input').forEach(el => el.classList.remove('valid', 'invalid'));
    formEl.querySelectorAll('.field-msg').forEach(el => {
        el.textContent = '';
        el.className = 'field-msg';
    });
}

const modal      = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalMsg   = document.getElementById('modal-msg');

function showModal(title, message) {
    modalTitle.textContent = title;
    modalMsg.textContent   = message;
    modal.classList.remove('hidden');
}

document.getElementById('modal-close').addEventListener('click', () => modal.classList.add('hidden'));
modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.add('hidden'); });
