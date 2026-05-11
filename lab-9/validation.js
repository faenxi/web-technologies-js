
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+380\d{9}$/;


function validateField(name, value, formData = {}) {
    switch (name) {
        case 'firstName':
        case 'lastName': {
            const label = name === 'firstName' ? 'First name' : 'Last name';
            if (!value.trim()) return err(`${label} is required.`);
            if (value.trim().length < 3) return err(`${label} must be at least 3 characters.`);
            if (value.trim().length > 15) return err(`${label} must be 15 characters or fewer.`);
            return ok('Looks good!');
        }

        case 'email':
            if (!value.trim()) return err('Email is required.');
            if (!EMAIL_RE.test(value.trim())) return err('Please enter a valid email (e.g. user@mail.com).');
            return ok('Looks good!');

        case 'password':
            if (!value) return err('Password is required.');
            if (value.length < 6) return err('Password must be at least 6 characters.');
            return ok('Strong password!');

        case 'confirmPassword':
            if (!value) return err('Please confirm your password.');
            if (value !== formData.password) return err('Passwords do not match.');
            return ok('Passwords match!');

        case 'phone':
            if (!value.trim()) return err('Phone number is required.');
            if (!PHONE_RE.test(value.trim())) return err('Use format +380XXXXXXXXX (Ukrainian number).');
            return ok('Looks good!');

        case 'dob': {
            if (!value) return err('Date of birth is required.');
            const dob = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (dob > today) return err('Date of birth cannot be in the future.');
            const age = calcAge(dob);
            if (age < 12) return err('You must be at least 12 years old to register.');
            return ok('Looks good!');
        }

        case 'sex':
            if (!value) return err('Please select your sex.');
            return ok('');

        case 'country':
            if (!value) return err('Please select a country.');
            return ok('Looks good!');

        case 'city':
            if (!value) return err('Please select a city.');
            return ok('Looks good!');

        case 'username':
            if (!value.trim()) return err('Username is required.');
            if (value.trim().length < 3) return err('Username must be at least 4 characters.');
            return ok('Looks good!');
            

        case 'loginPassword':
            if (!value) return err('Password is required.');
            if (value.length < 6) return err('Password must be at least 6 characters.');
            return ok('');

        default:
            return ok('');
    }
}

function ok(message)  { return { valid: true,  message }; }
function err(message) { return { valid: false, message }; }

function calcAge(dob) {
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
    return age;
}

function applyFieldState(inputEl, msgEl, { valid, message }) {
    inputEl.classList.toggle('valid', valid);
    inputEl.classList.toggle('invalid', !valid);

    if (msgEl) {
        msgEl.textContent = message;
        msgEl.className = 'field-msg ' + (valid ? 'valid' : 'invalid');
    }
}

function clearFieldState(inputEl, msgEl) {
    inputEl.classList.remove('valid', 'invalid');
    if (msgEl) { msgEl.textContent = ''; msgEl.className = 'field-msg'; }
}
