// Login page for the auth gate (netlify/edge-functions/auth-gate.js).
// Plain JS on purpose: it must load without the app bundle, which is gated.
(function () {
    var usernameForm = document.getElementById('username-form');
    var otpForm = document.getElementById('otp-form');
    var usernameInput = document.getElementById('username');
    var otpInput = document.getElementById('otp');
    var resendButton = document.getElementById('resend-button');
    var backButton = document.getElementById('back-button');
    var message = document.getElementById('message');
    var cooldownTimer = null;
    var cooldownRemaining = 0;

    var showMessage = function (text, isError) {
        message.textContent = text || '';
        message.classList.toggle('is-error', Boolean(isError));
    };

    var setBusy = function (form, isBusy) {
        Array.prototype.forEach.call(form.querySelectorAll('button, input'), function (el) {
            el.disabled = isBusy;
        });
    };

    var postJson = function (url, body) {
        return fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'same-origin',
            body: JSON.stringify(body),
        }).then(function (res) {
            return res.json().catch(function () { return {}; }).then(function (data) {
                return { status: res.status, data: data };
            });
        });
    };

    var renderResendButton = function () {
        resendButton.disabled = cooldownRemaining > 0;
        resendButton.textContent = cooldownRemaining > 0
            ? 'Resend code (' + cooldownRemaining + 's)'
            : 'Resend code';
    };

    var startCooldown = function (seconds) {
        clearInterval(cooldownTimer);
        cooldownRemaining = seconds;
        renderResendButton();
        cooldownTimer = setInterval(function () {
            cooldownRemaining -= 1;
            if (cooldownRemaining <= 0) clearInterval(cooldownTimer);
            renderResendButton();
        }, 1000);
    };

    var showOtpStep = function () {
        usernameForm.hidden = true;
        otpForm.hidden = false;
        otpInput.value = '';
    };

    var requestOtp = function (form) {
        var username = usernameInput.value.trim();
        if (!username) {
            showMessage('Enter your username.', true);
            usernameInput.focus();
            return;
        }
        setBusy(form, true);
        showMessage('Sending code…');
        postJson('/api/request-otp', { username: username })
            .then(function (result) {
                if (result.status === 429) {
                    showOtpStep();
                    showMessage('A code was sent recently. Check your inbox or wait before resending.', true);
                    startCooldown(result.data.retryAfter || 60);
                    return;
                }
                if (!result.data.ok) {
                    showMessage('Could not send the code. Try again later.', true);
                    return;
                }
                showOtpStep();
                showMessage('');
                startCooldown(60);
            })
            .catch(function () {
                showMessage('Network error. Try again.', true);
            })
            .finally(function () {
                setBusy(form, false);
                // setBusy re-enables every button, so re-apply an active cooldown.
                renderResendButton();
                // Focus only after re-enabling: disabled inputs can't take focus.
                if (!otpForm.hidden) otpInput.focus();
            });
    };

    usernameForm.addEventListener('submit', function (e) {
        e.preventDefault();
        requestOtp(usernameForm);
    });

    resendButton.addEventListener('click', function () {
        requestOtp(otpForm);
    });

    backButton.addEventListener('click', function () {
        otpForm.hidden = true;
        usernameForm.hidden = false;
        showMessage('');
        usernameInput.focus();
    });

    otpForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var otp = otpInput.value.trim();
        if (!/^\d{6}$/.test(otp)) {
            showMessage('Enter the 6-digit code.', true);
            otpInput.focus();
            return;
        }
        setBusy(otpForm, true);
        showMessage('Verifying…');
        postJson('/api/verify-otp', { username: usernameInput.value.trim(), otp: otp })
            .then(function (result) {
                if (result.data.ok) {
                    showMessage('Signed in. Redirecting…');
                    window.location.replace('/');
                    return;
                }
                if (result.data.error === 'expired') {
                    showMessage('This code expired or had too many wrong attempts. Request a new one.', true);
                } else if (result.data.attemptsLeft) {
                    showMessage('Wrong code. ' + result.data.attemptsLeft + ' attempt(s) left.', true);
                } else {
                    showMessage('Wrong code.', true);
                }
                otpInput.select();
            })
            .catch(function () {
                showMessage('Network error. Try again.', true);
            })
            .finally(function () {
                setBusy(otpForm, false);
                renderResendButton();
            });
    });
})();
