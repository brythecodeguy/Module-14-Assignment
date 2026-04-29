console.log("JavaScript loaded!");

document.addEventListener("DOMContentLoaded", () => {
    setupRegisterForm();
    setupLoginForm();
    setupDashboard();
});

function showMessage(errorId, successId, message, isError = true) {
    const errorBox = document.getElementById(errorId);
    const successBox = document.getElementById(successId);

    if (errorBox) {
        errorBox.textContent = "";
        errorBox.classList.add("hidden");
    }

    if (successBox) {
        successBox.textContent = "";
        successBox.classList.add("hidden");
    }

    if (isError && errorBox) {
        errorBox.textContent = message;
        errorBox.classList.remove("hidden");
    }

    if (!isError && successBox) {
        successBox.textContent = message;
        successBox.classList.remove("hidden");
    }
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPassword(password) {
    return password.length >= 8 &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /[0-9]/.test(password);
}

function setupRegisterForm() {
    const form = document.getElementById("registerForm");
    if (!form) return;

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = {
            username: document.getElementById("registerUsername").value.trim(),
            email: document.getElementById("registerEmail").value.trim(),
            first_name: document.getElementById("registerFirstName").value.trim(),
            last_name: document.getElementById("registerLastName").value.trim(),
            password: document.getElementById("registerPassword").value,
            confirm_password: document.getElementById("registerConfirmPassword").value
        };

        if (!formData.username || formData.username.length < 3) {
            showMessage("registerError", "registerSuccess", "Username must be at least 3 characters long.");
            return;
        }

        if (!isValidEmail(formData.email)) {
            showMessage("registerError", "registerSuccess", "Please enter a valid email address.");
            return;
        }

        if (!formData.first_name || !formData.last_name) {
            showMessage("registerError", "registerSuccess", "Please enter your first and last name.");
            return;
        }

        if (!isValidPassword(formData.password)) {
            showMessage(
                "registerError",
                "registerSuccess",
                "Password must be at least 8 characters and include uppercase, lowercase, and a number."
            );
            return;
        }

        if (formData.password !== formData.confirm_password) {
            showMessage("registerError", "registerSuccess", "Passwords do not match.");
            return;
        }

        try {
            const response = await fetch("/users/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                showMessage(
                    "registerError",
                    "registerSuccess",
                    data.detail || "Registration failed."
                );
                return;
            }

            showMessage(
                "registerError",
                "registerSuccess",
                "Registration successful. Redirecting to login...",
                false
            );

            setTimeout(() => {
                window.location.href = "/login";
            }, 1200);
        } catch (error) {
            showMessage(
                "registerError",
                "registerSuccess",
                "Could not connect to the server."
            );
        }
    });
}

function setupLoginForm() {
    const form = document.getElementById("loginForm");
    if (!form) return;

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = {
            username: document.getElementById("loginUsername").value.trim(),
            password: document.getElementById("loginPassword").value
        };

        if (!formData.username || !formData.password) {
            showMessage("loginError", "loginSuccess", "Please fill in all fields.");
            return;
        }

        try {
            const response = await fetch("/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                showMessage(
                    "loginError",
                    "loginSuccess",
                    data.detail || "Invalid username or password."
                );
                return;
            }

            localStorage.setItem("access_token", data.access_token || "");
            localStorage.setItem("refresh_token", data.refresh_token || "");
            localStorage.setItem("username", data.username || formData.username);
            localStorage.setItem("user_id", data.user_id || "");
            localStorage.setItem("token_type", data.token_type || "bearer");

            const rememberCheckbox = document.getElementById("remember");
            if (rememberCheckbox && rememberCheckbox.checked) {
                localStorage.setItem("remember_login", "true");
                localStorage.setItem("remembered_username", formData.username);
            } else {
                localStorage.removeItem("remember_login");
                localStorage.removeItem("remembered_username");
            }

            showMessage(
                "loginError",
                "loginSuccess",
                "Login successful. Redirecting...",
                false
            );

            setTimeout(() => {
                window.location.href = "/dashboard";
            }, 1000);
        } catch (error) {
            showMessage(
                "loginError",
                "loginSuccess",
                "Could not connect to the server."
            );
        }
    });

    const rememberLogin = localStorage.getItem("remember_login");
    const rememberedUsername = localStorage.getItem("remembered_username");
    const usernameInput = document.getElementById("loginUsername");
    const rememberCheckbox = document.getElementById("remember");

    if (rememberLogin === "true" && rememberedUsername && usernameInput) {
        usernameInput.value = rememberedUsername;
        if (rememberCheckbox) {
            rememberCheckbox.checked = true;
        }
    }
}

function setupDashboard() {
    const tableBody = document.getElementById("calculationsTable");
    if (!tableBody) return;

    const token = localStorage.getItem("access_token");
    if (!token) {
        window.location.href = "/login";
        return;
    }

    const welcomeMessage = document.getElementById("welcomeMessage");
    const storedUsername = localStorage.getItem("username");
    if (welcomeMessage && storedUsername) {
        welcomeMessage.textContent = `Welcome, ${storedUsername}!`;
    }

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.clear();
            window.location.href = "/login";
        });
    }

    const operationButtons = document.querySelectorAll(".operation-btn");
    const calcTypeInput = document.getElementById("calcType");

    operationButtons.forEach((button) => {
        button.addEventListener("click", () => {
            operationButtons.forEach((btn) => {
                btn.classList.remove(
                    "border-emerald-500",
                    "text-emerald-600",
                    "bg-emerald-50"
                );
                btn.classList.add(
                    "border-gray-300",
                    "text-gray-700",
                    "bg-white"
                );
            });

            button.classList.remove(
                "border-gray-300",
                "text-gray-700",
                "bg-white"
            );
            button.classList.add(
                "border-emerald-500",
                "text-emerald-600",
                "bg-emerald-50"
            );

            calcTypeInput.value = button.dataset.value;
        });
    });

    const calculationForm = document.getElementById("calculationForm");
    if (calculationForm) {
        calculationForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const calcType = document.getElementById("calcType").value;
            const a = parseFloat(document.getElementById("calcA").value);
            const b = parseFloat(document.getElementById("calcB").value);

            if (Number.isNaN(a) || Number.isNaN(b)) {
                showMessage("dashboardError", "dashboardSuccess", "Please enter two valid numbers.");
                return;
            }

            try {
                const response = await fetch("/calculations", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        a: a,
                        b: b,
                        type: calcType
                    })
                });

                const data = await response.json();

                if (!response.ok) {
                    showMessage(
                        "dashboardError",
                        "dashboardSuccess",
                        data.detail || "Failed to create calculation."
                    );
                    return;
                }

                calculationForm.reset();
                showMessage("dashboardError", "dashboardSuccess", "Calculation created successfully.", false);
                loadCalculations();
            } catch (error) {
                showMessage("dashboardError", "dashboardSuccess", "Could not connect to the server.");
            }
        });
    }

    async function loadCalculations() {
        try {
            const response = await fetch("/calculations", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.status === 401) {
                localStorage.clear();
                window.location.href = "/login";
                return;
            }

            const data = await response.json();

            if (!response.ok) {
                showMessage(
                    "dashboardError",
                    "dashboardSuccess",
                    data.detail || "Failed to load calculations."
                );
                return;
            }

            tableBody.innerHTML = "";

            if (!Array.isArray(data) || data.length === 0) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="5" class="px-4 py-4 text-center text-gray-500">No calculations found yet.</td>
                    </tr>
                `;
                return;
            }

            data.forEach((calc) => {
                const row = document.createElement("tr");

                const inputsText = `${calc.a ?? ""}, ${calc.b ?? ""}`;

                const dateText = calc.created_at
                    ? new Date(calc.created_at).toLocaleString()
                    : "";

                row.innerHTML = `
                    <td class="px-4 py-3 border-b">${calc.type ?? ""}</td>
                    <td class="px-4 py-3 border-b">${inputsText}</td>
                    <td class="px-4 py-3 border-b">${calc.result ?? ""}</td>
                    <td class="px-4 py-3 border-b">${dateText}</td>
                    <td class="px-4 py-3 border-b">
                        <button
                            type="button"
                            class="delete-btn rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
                            data-id="${calc.id}"
                        >
                            Delete
                        </button>
                    </td>
                `;

                tableBody.appendChild(row);
            });

            document.querySelectorAll(".delete-btn").forEach((button) => {
                button.addEventListener("click", async () => {
                    const calcId = button.dataset.id;
                    if (!calcId) return;

                    const confirmed = window.confirm("Delete this calculation?");
                    if (!confirmed) return;

                    try {
                        const response = await fetch(`/calculations/${calcId}`, {
                            method: "DELETE",
                            headers: {
                                "Authorization": `Bearer ${token}`
                            }
                        });

                        if (response.status === 401) {
                            localStorage.clear();
                            window.location.href = "/login";
                            return;
                        }

                        let data = {};
                        try {
                            data = await response.json();
                        } catch {
                            data = {};
                        }

                        if (!response.ok) {
                            showMessage(
                                "dashboardError",
                                "dashboardSuccess",
                                data.detail || "Failed to delete calculation."
                            );
                            return;
                        }

                        showMessage("dashboardError", "dashboardSuccess", "Calculation deleted successfully.", false);
                        loadCalculations();
                    } catch (error) {
                        showMessage("dashboardError", "dashboardSuccess", "Could not connect to the server.");
                    }
                });
            });
        } catch (error) {
            showMessage("dashboardError", "dashboardSuccess", "Could not connect to the server.");
        }
    }

    loadCalculations();
}