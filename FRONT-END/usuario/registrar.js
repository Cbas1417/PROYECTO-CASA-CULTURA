const form = document.querySelector("form.carta");

const name = document.getElementById("name");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const documentNumber = document.getElementById("document-number");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirm-password");

const errors = {
name: document.getElementById("name-error"),
email: document.getElementById("email-error"),
phone: document.getElementById("phone-error"),
document: document.getElementById("document-type-error"),
password: document.getElementById("password-error"),
confirm: document.getElementById("confirm-password-error")
};

// pa cada cuadro y tinis
function validateName() {
const value = name.value.trim();
if (!value) return (errors.name.textContent = "", false);
if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(value)) {
    errors.name.textContent = "El nombre solo puede contener letras y espacios.";
    return false;
}
errors.name.textContent = "";
return true;
}

function validateEmail() {
const value = email.value.trim();
if (!value) return (errors.email.textContent = "", false);
if (!/^[^\s@]+@[^\s@]+\.com$/i.test(value)) {
    errors.email.textContent = "Ingresa un correo válido que termine en .com";
    return false;
}
errors.email.textContent = "";
return true;
}

function validatePhone() {
phone.value = phone.value.replace(/\D/g, "");
const value = phone.value.trim();
if (!value) return (errors.phone.textContent = "", false);
if (!/^\d{10}$/.test(value)) {
    errors.phone.textContent = "El teléfono debe contener exactamente 10 números.";
    return false;
}
errors.phone.textContent = "";
return true;
}

function validateDocument() {
documentNumber.value = documentNumber.value.replace(/\D/g, "");
const value = documentNumber.value.trim();
if (!value) return (errors.document.textContent = "", false);
if (!/^\d+$/.test(value)) {
    errors.document.textContent = "El documento solo puede contener números.";
    return false;
}
errors.document.textContent = "";
return true;
}

function validatePassword() {
const value = password.value;
if (!value) return (errors.password.textContent = "", false);
if (value.length < 6) {
    errors.password.textContent = "La contraseña debe tener al menos 6 caracteres.";
    return false;
}
errors.password.textContent = "";
return true;
}

function validateConfirmPassword() {
const value = confirmPassword.value;
if (!value) return (errors.confirm.textContent = "", false);
if (value !== password.value) {
    errors.confirm.textContent = "Las contraseñas no coinciden.";
    return false;
}
errors.confirm.textContent = "";
return true;
}

// pa que aparezca de una
name.addEventListener("input", validateName);
email.addEventListener("input", validateEmail);
phone.addEventListener("input", validatePhone);
documentNumber.addEventListener("input", validateDocument);
password.addEventListener("input", () => {
validatePassword();
validateConfirmPassword();
});
confirmPassword.addEventListener("input", validateConfirmPassword);

// cuando se envia el registro y esa monda
// form.addEventListener("submit", function (e) {
// e.preventDefault();

// const isNameValid = validateName();
// const isEmailValid = validateEmail();
// const isPhoneValid = validatePhone();
// const isDocumentValid = validateDocument();
// const isPasswordValid = validatePassword();
// const isConfirmPasswordValid = validateConfirmPassword();

// //esto pa el menu en el celcho
// if (isNameValid && isEmailValid && isPhoneValid && isDocumentValid && isPasswordValid && isConfirmPasswordValid) {
//     const modal = document.getElementById("modal-success");
//     modal.style.display = "flex";

//     setTimeout(() => {
//     window.location.href = "iniciar.html";
//     }, 3000);
// }
// });


//ojito pa la contra
document.querySelectorAll(".toggle-password").forEach(icon => {
    icon.addEventListener("click", () => {
        const targetId = icon.getAttribute("data-target");
        const input = document.getElementById(targetId);
        const type = input.getAttribute("type") === "password" ? "text" : "password";
        input.setAttribute("type", type);
        icon.classList.toggle("fa-eye");
        icon.classList.toggle("fa-eye-slash");
    });
});


//conexion backend con fronend por axios
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("register-form");

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const tipo_documento = document.getElementById("document-type").value;
        const numero_documento = document.getElementById("document-number").value;
        const nombre = document.getElementById("name").value;
        const fecha_nacimiento = document.getElementById("birthdate").value;
        const correo = document.getElementById("email").value;
        const telefono = document.getElementById("phone").value;
        const password = document.getElementById("password").value;
        const password_confirm = document.getElementById("confirm-password").value;

        const data = {
            tipo_documento,
            numero_documento,
            nombre,
            fecha_nacimiento,
            correo,
            telefono,
            password,
            password_confirm
        };

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/v1/seguridad/registro", data);

            if (response.data.estado === "ok") {
                const modal = document.getElementById("modal-success");
                modal.style.display = "flex";

                setTimeout(() => {
                    window.location.href = "iniciar.html";
                }, 3000);
            } else {
                alert("Error: " + response.data.mensaje);
            }
        } catch (error) {
            console.error("Error completo:", error);

            if (error.response) {
                const mensaje = error.response.data?.mensaje ||
                                error.response.data?.detail ||
                                "Error no especificado desde el servidor";

                alert("Error: " + mensaje);
            } else {
                alert("Error: no hay respuesta del servidor");
            }
        }
    });
});