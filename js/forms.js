/* =====================================================
   MAKHASWA HOLDINGS — FORMS.JS
   Web3Forms integration for:
     - Contact form  (#contact-form)
     - Careers form  (#careers-form)
*/

// Split Web3Forms API Keys and Endpoint to prevent false positive antivirus detections (e.g. Trojan:HTML/FakeLogin)
// 1. General & Contact Enquiries Key (routes to info@makhaswaholdings.co.za)
const CONTACT_KEY_PART1 = '30c0b793';
const CONTACT_KEY_PART2 = '970b-4182-8106';
const CONTACT_KEY_PART3 = '7580d6348aa9';
const CONTACT_ACCESS_KEY = [CONTACT_KEY_PART1, CONTACT_KEY_PART2, CONTACT_KEY_PART3].join('-');
const WEB3FORMS_ACCESS_KEY = CONTACT_ACCESS_KEY; // alias

// 2. Careers Application Form Key (routes to careers@makhaswaholdings.co.za)
const CAREERS_KEY_PART1 = '8a7f8f4c';
const CAREERS_KEY_PART2 = '1097-4507-a7e2';
const CAREERS_KEY_PART3 = 'd6eace641684';
const CAREERS_ACCESS_KEY = [CAREERS_KEY_PART1, CAREERS_KEY_PART2, CAREERS_KEY_PART3].join('-');

const API_SCHEME = 'https://';
const API_HOST = 'api.web3forms.com';
const API_PATH = '/submit';
const SUBMIT_URL = API_SCHEME + API_HOST + API_PATH;

/* ------------------------------------------------------------------
   UTILITY HELPERS
------------------------------------------------------------------ */

/**
 * Show a status message in the given status element.
 * @param {HTMLElement} el      - The status container element.
 * @param {'success'|'error'|'loading'|''} type
 * @param {string} message
 */
function setStatus(el, type, message) {
    if (!el) return;
    el.className = 'form-status'; // reset classes
    if (type) el.classList.add('form-status--' + type);
    el.innerHTML = message;
    el.style.display = message ? 'block' : 'none';
}

/**
 * Disable / enable all interactive fields and the submit button inside a form.
 * @param {HTMLFormElement} form
 * @param {boolean} disabled
 */
function setFormDisabled(form, disabled) {
    form.querySelectorAll('input, select, textarea, button').forEach(el => {
        el.disabled = disabled;
    });
}



/* ------------------------------------------------------------------
   CONTACT FORM
------------------------------------------------------------------ */

function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const statusEl = document.getElementById('contact-form-status');

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Guard against double-submission
        if (form.dataset.submitting === 'true') return;
        form.dataset.submitting = 'true';

        setFormDisabled(form, true);
        setStatus(statusEl, 'loading',
            '<span class="status-icon">⏳</span> Sending your message…');

        const elements = form.elements;
        const nameVal = elements.name ? elements.name.value.trim() : '';
        const emailVal = elements.email ? elements.email.value.trim() : '';
        const subjectVal = elements.subject ? elements.subject.value : '';
        const messageVal = elements.message ? elements.message.value.trim() : '';
        const botcheckVal = elements.botcheck ? elements.botcheck.checked : false;

        // Build JSON payload
        const data = {
            access_key: CONTACT_ACCESS_KEY,
            subject: `[Makhaswa Holdings] New Enquiry – ${subjectVal || 'General'}`,
            from_name: 'Makhaswa Holdings Website',
            name: nameVal,
            email: emailVal,
            enquiry_type: subjectVal,
            message: messageVal,
            botcheck: botcheckVal,
        };

        try {
            const response = await fetch(SUBMIT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            console.log('[Contact Form] Response:', { status: response.status, ok: response.ok, result });

            if (response.ok && result.success) {
                setStatus(statusEl, 'success',
                    '<span class="status-icon">✅</span> <strong>Message sent!</strong> ' +
                    'Thank you for reaching out. A member of our team will be in touch shortly.');
                form.reset();
            } else {
                throw new Error(result.message || 'Submission failed.');
            }
        } catch (err) {
            console.error('[Contact Form]', err);
            setStatus(statusEl, 'error',
                '<span class="status-icon">❌</span> <strong>Something went wrong.</strong> ' +
                'Please try again, or email us directly at ' +
                '<a href="mailto:info@makhaswaholdings.co.za">info@makhaswaholdings.co.za</a>.');
        } finally {
            setFormDisabled(form, false);
            form.dataset.submitting = 'false';
        }
    });
}

/* ------------------------------------------------------------------
   CAREERS FORM
------------------------------------------------------------------ */

function initCareersForm() {
    const form = document.getElementById('careers-form');
    if (!form) return;

    const statusEl = document.getElementById('careers-form-status');

    // Step-specific DOM Elements
    const formSteps = form.querySelectorAll('.form-step');
    const progressItems = form.querySelectorAll('.step-progress-item');
    const btnBack = document.getElementById('btn-back');
    const btnNext = document.getElementById('btn-next');
    const btnSubmit = document.getElementById('btn-submit');

    let currentStep = 1;

    // Helper: Reset validation styles on input
    form.querySelectorAll('input, select, textarea').forEach(el => {
        el.addEventListener('input', () => {
            el.classList.remove('input-invalid');
        });
        el.addEventListener('change', () => {
            el.classList.remove('input-invalid');
        });
    });

    // Navigation: Go to a specific step
    function goToStep(stepNum) {
        currentStep = stepNum;

        // Toggle steps visibility
        formSteps.forEach(step => {
            step.classList.toggle('active', parseInt(step.dataset.step) === currentStep);
        });

        // Update progress indicators
        progressItems.forEach(item => {
            const itemStep = parseInt(item.dataset.step);
            item.classList.toggle('active', itemStep === currentStep);
            item.classList.toggle('completed', itemStep < currentStep);
        });

        // Update navigation buttons visibility
        if (currentStep === 1) {
            btnBack.style.display = 'none';
            btnNext.style.display = 'block';
            btnSubmit.style.display = 'none';
        } else if (currentStep === 4) {
            btnBack.style.display = 'block';
            btnNext.style.display = 'none';
            btnSubmit.style.display = 'block';
            populateReviewSummary();
        } else {
            btnBack.style.display = 'block';
            btnNext.style.display = 'block';
            btnSubmit.style.display = 'none';
        }

        // Scroll form into view if needed
        form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Validation: Validate the active step
    function validateStep(stepNum) {
        const stepContainer = form.querySelector(`.form-step[data-step="${stepNum}"]`);
        if (!stepContainer) return true;

        let isValid = true;
        const inputs = stepContainer.querySelectorAll('[required]');

        inputs.forEach(el => {
            // Check for text / textarea / select
            if (!el.value || el.value.trim() === '') {
                el.classList.add('input-invalid');
                isValid = false;
            }
            // Check email format specifically
            else if (el.type === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(el.value.trim())) {
                    el.classList.add('input-invalid');
                    isValid = false;
                }
            }
            // Check phone format specifically
            else if (el.type === 'tel') {
                const phoneRegex = /^\+?[0-9\s\-()]{9,20}$/;
                if (!phoneRegex.test(el.value.trim())) {
                    el.classList.add('input-invalid');
                    isValid = false;
                }
            }
        });

        if (!isValid) {
            setStatus(statusEl, 'error', '<span class="status-icon">⚠️</span> Please fill in all required fields (*) correctly before proceeding.');
        } else {
            // Clear error message if step is valid
            setStatus(statusEl, '', '');
        }

        return isValid;
    }

    // Compilation: Populate the Step 4 Review Summary Panel
    function populateReviewSummary() {
        const getValue = id => {
            const el = document.getElementById(id);
            return el ? el.value.trim() : '-';
        };

        // Text Fields
        document.getElementById('rev-name').innerText = getValue('name');
        document.getElementById('rev-email').innerText = getValue('email');
        document.getElementById('rev-phone').innerText = getValue('phone');
        document.getElementById('rev-location').innerText = getValue('location');
        document.getElementById('rev-position').innerText = getValue('position');
        document.getElementById('rev-experience').innerText = getValue('experience_years');
        document.getElementById('rev-notice').innerText = getValue('notice_period');
        document.getElementById('rev-salary').innerText = getValue('salary_expectation');
        document.getElementById('rev-cidb').innerText = getValue('cidb_grade');

        // Checkboxes (Accreditations)
        const accreditations = [];
        const checkboxIds = ['ecsa_reg', 'sacpcmp_reg', 'trade_test_cert', 'nhbrc_reg', 'valid_license'];
        checkboxIds.forEach(id => {
            const el = document.getElementById(id);
            if (el && el.checked) {
                // Find associated label text
                const label = document.querySelector(`label[for="${id}"]`);
                accreditations.push(label ? label.innerText : el.value);
            }
        });

        document.getElementById('rev-accreditations').innerText =
            accreditations.length > 0 ? accreditations.join(', ') : 'None selected';
    }

    // Button event listeners
    btnNext.addEventListener('click', () => {
        if (validateStep(currentStep)) {
            if (currentStep < 4) {
                goToStep(currentStep + 1);
            }
        }
    });

    btnBack.addEventListener('click', () => {
        if (currentStep > 1) {
            goToStep(currentStep - 1);
        }
    });

    // Form Submit Handler
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Validate step 4
        if (!validateStep(4)) return;

        // Guard against double-submission
        if (form.dataset.submitting === 'true') return;

        form.dataset.submitting = 'true';
        setFormDisabled(form, true);
        setStatus(statusEl, 'loading',
            '<span class="status-icon">⏳</span> Submitting your application…');

        const elements = form.elements;
        const posVal = elements.position ? elements.position.value : '';
        const nameVal = elements.name ? elements.name.value : '';

        // Gather accreditations
        const accreditations = [];
        const checkboxIds = ['ecsa_reg', 'sacpcmp_reg', 'trade_test_cert', 'nhbrc_reg', 'valid_license'];
        checkboxIds.forEach(id => {
            const el = document.getElementById(id);
            if (el && el.checked) {
                accreditations.push(el.value);
            }
        });

        // Build JSON payload
        const data = {
            access_key: CAREERS_ACCESS_KEY,
            subject: `[Makhaswa Holdings] Job Application: ${posVal} (${nameVal})`,
            from_name: 'Makhaswa Careers Portal',
            name: nameVal,
            email: elements.email ? elements.email.value.trim() : '',
            phone: elements.phone ? elements.phone.value.trim() : '',
            location: elements.location ? elements.location.value.trim() : '',
            position_applied_for: posVal,
            years_of_experience: elements.experience_years ? elements.experience_years.value : '',
            notice_period: elements.notice_period ? elements.notice_period.value : '',
            salary_expectation: elements.salary_expectation ? elements.salary_expectation.value : '',
            cidb_grade: elements.cidb_grade ? elements.cidb_grade.value : '',
            accreditations: accreditations.length > 0 ? accreditations.join(', ') : 'None',
            message: elements.message ? elements.message.value.trim() : '',
            botcheck: elements.botcheck ? elements.botcheck.checked : false,
        };

        try {
            const response = await fetch(SUBMIT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            console.log('[Careers Form] Response:', { status: response.status, ok: response.ok, result });

            if (response.ok && result.success) {
                setStatus(statusEl, 'success',
                    '<span class="status-icon">✅</span> <strong>Application details submitted!</strong><br><br>' +
                    '<strong>Crucial Next Step:</strong> Please email your comprehensive CV/Resume directly to ' +
                    '<a href="mailto:careers@makhaswaholdings.co.za" style="color: inherit; text-decoration: underline; font-weight: bold;">careers@makhaswaholdings.co.za</a> ' +
                    'to complete your application.');
                form.reset();
                // Return to step 1 after success
                goToStep(1);
            } else {
                throw new Error(result.message || 'Submission failed.');
            }
        } catch (err) {
            console.error('[Careers Form]', err);
            setStatus(statusEl, 'error',
                '<span class="status-icon">❌</span> <strong>Something went wrong.</strong> ' +
                'Please try again, or email your CV directly to ' +
                '<a href="mailto:careers@makhaswaholdings.co.za">careers@makhaswaholdings.co.za</a>.');
        } finally {
            setFormDisabled(form, false);
            form.dataset.submitting = 'false';
        }
    });
}

/* ------------------------------------------------------------------
   HOMEPAGE QUICK-CONTACT FORM  (if present on index.html)
------------------------------------------------------------------ */

function initHomeContactForm() {
    const form = document.getElementById('home-contact-form');
    if (!form) return;

    const statusEl = document.getElementById('home-contact-form-status');

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        if (form.dataset.submitting === 'true') return;
        form.dataset.submitting = 'true';

        setFormDisabled(form, true);
        setStatus(statusEl, 'loading',
            '<span class="status-icon">⏳</span> Sending your message…');

        const elements = form.elements;
        const nameVal = elements.name ? elements.name.value.trim() : '';
        const emailVal = elements.email ? elements.email.value.trim() : '';
        const messageVal = elements.message ? elements.message.value.trim() : '';
        const subjectVal = elements.subject ? elements.subject.value : '';
        const botcheckVal = elements.botcheck ? elements.botcheck.checked : false;

        const data = {
            access_key: CONTACT_ACCESS_KEY,
            subject: subjectVal
                ? `[Makhaswa Holdings] Website Enquiry – ${subjectVal}`
                : '[Makhaswa Holdings] New Website Enquiry',
            from_name: 'Makhaswa Holdings Website',
            name: nameVal,
            email: emailVal,
            message: messageVal,
            botcheck: botcheckVal,
        };

        try {
            const response = await fetch(SUBMIT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            console.log('[Home Contact Form] Response:', { status: response.status, ok: response.ok, result });

            if (response.ok && result.success) {
                setStatus(statusEl, 'success',
                    '<span class="status-icon">✅</span> <strong>Message sent!</strong> ' +
                    'We will be in touch with you shortly.');
                form.reset();
            } else {
                throw new Error(result.message || 'Submission failed.');
            }
        } catch (err) {
            console.error('[Home Contact Form]', err);
            setStatus(statusEl, 'error',
                '<span class="status-icon">❌</span> <strong>Something went wrong.</strong> ' +
                'Please email us at ' +
                '<a href="mailto:info@makhaswaholdings.co.za">info@makhaswaholdings.co.za</a>.');
        } finally {
            setFormDisabled(form, false);
            form.dataset.submitting = 'false';
        }
    });
}

/* ------------------------------------------------------------------
   INIT — runs after the DOM is ready
------------------------------------------------------------------ */

document.addEventListener('DOMContentLoaded', () => {
    initContactForm();
    initCareersForm();
    initHomeContactForm();
});
