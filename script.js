const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyAEW4-W2VXfj1qSzn9cxMs8Cg23sC7GdHUN5L9PVPNjuQdJbZvFM8hBVS6iR_8VViKzg/exec'; // <--- ¡Tu URL de despliegue de Apps Script!

let currentGuestName = '';
let currentAssignedPases = 0;

function getUuidFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('t') ? params.get('t').trim() : '';
}

async function getGuestInfoByToken(token) {
    const requestUrl = `${WEB_APP_URL}?t=${encodeURIComponent(token)}`;
    try {
        const response = await fetch(requestUrl);
        const result = await response.json();
        if (result.success) {
            return {
                nombre: result.nombre,
                pases: result.pases,
                estado: result.estado
            };
        } else {
            console.error('Error al obtener info del invitado:', result.message);
            return null;
        }
    } catch (error) {
        console.error('Error de red al obtener info del invitado:', error);
        return null;
    }
}

async function initializeInvitationPage() {
    const token = getUuidFromUrl();

    const mensajeBienvenida = document.querySelector(".mensaje-invitado");
    const whatsappButton = document.getElementById('whatsappButton');
    const acceptLessButton = document.getElementById('acceptLessButton');
    const declineButton = document.getElementById('declineButton');
    const lessPassesContainer = document.getElementById('lessPassesContainer');
    const numPasesInput = document.getElementById('numPasesInput');
    const confirmLessPassesButton = document.getElementById('confirmLessPassesButton');

    // Función auxiliar para gestionar la visibilidad y estado de los botones de acción
    function manageActionButtons(actionType, message = "", newColor = '') {
        // Oculta el contenedor de pases por defecto en la mayoría de los casos
        if (lessPassesContainer) lessPassesContainer.style.display = 'none';

        // Oculta todos los botones al principio para luego mostrar solo los relevantes
        const allMainButtons = [whatsappButton, acceptLessButton, declineButton];
        allMainButtons.forEach(btn => {
            if (btn) btn.style.display = 'none';
        });
        if (confirmLessPassesButton) confirmLessPassesButton.style.display = 'none'; // También ocultamos este por defecto

        // Reiniciar estilos y estado de deshabilitado
        [whatsappButton, acceptLessButton, declineButton, confirmLessPassesButton].forEach(btn => {
            if (btn) {
                btn.disabled = false;
                btn.style.cursor = 'pointer';
                btn.style.backgroundColor = ''; // Restablecer color
                // Restablecer texto original si no se proporciona un mensaje específico
                if (!message) {
                    if (btn.id === 'whatsappButton') btn.textContent = "Confirmar Asistencia";
                    if (btn.id === 'acceptLessButton') btn.textContent = "Aceptar menos invitaciones";
                    if (btn.id === 'declineButton') btn.textContent = "No podré asistir";
                    if (btn.id === 'confirmLessPassesButton') btn.textContent = "Confirmar pases seleccionados";
                }
            }
        });


        switch (actionType) {
            case 'initialLoad':
                // Muestra solo los botones principales al cargar la página por primera vez
                allMainButtons.forEach(btn => {
                    if (btn) btn.style.display = 'inline-block';
                });
                // Limpiar mensaje cordial previo
                if (mensajeBienvenida) mensajeBienvenida.nextElementSibling.innerHTML = "";
                break;

            case 'processing':
                // Deshabilita todos los botones principales y muestra el mensaje de carga
                allMainButtons.forEach(btn => {
                    if (btn) {
                        btn.disabled = true;
                        btn.style.cursor = 'not-allowed';
                        btn.style.backgroundColor = newColor;
                        if (btn.id === 'whatsappButton' || btn.id === 'acceptLessButton' || btn.id === 'declineButton') {
                            btn.style.display = 'inline-block'; // Mantener visible el botón que se está procesando o el general
                            if (btn.id === 'whatsappButton' || btn.id === 'acceptLessButton' || btn.id === 'declineButton') { // Solo actualiza el texto del botón presionado
                                btn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> ${message}`;
                            }
                        }
                    }
                });
                if (confirmLessPassesButton) confirmLessPassesButton.style.display = 'none'; // Asegurarse que esté oculto si no es el proceso de menos pases
                if (mensajeBienvenida) mensajeBienvenida.nextElementSibling.innerHTML = ""; // Limpiar mensaje cordial
                break;

            case 'showLessPassesInput':
                // Oculta los botones principales y muestra el input de pases
                allMainButtons.forEach(btn => {
                    if (btn) btn.style.display = 'none';
                });
                if (lessPassesContainer) lessPassesContainer.style.display = 'block';
                if (confirmLessPassesButton) confirmLessPassesButton.style.display = 'inline-block';
                if (mensajeBienvenida) mensajeBienvenida.nextElementSibling.innerHTML = ""; // Limpiar mensaje cordial
                break;

            case 'processingLessPasses':
                 // Deshabilita el botón de confirmar pases seleccionados
                if (confirmLessPassesButton) {
                    confirmLessPassesButton.disabled = true;
                    confirmLessPassesButton.style.cursor = 'not-allowed';
                    confirmLessPassesButton.style.backgroundColor = newColor;
                    confirmLessPassesButton.textContent = message;
                    confirmLessPassesButton.style.display = 'inline-block'; // Asegurarse de que el botón siga visible
                }
                if (lessPassesContainer) lessPassesContainer.style.display = 'block'; // Asegurarse que el contenedor siga visible
                if (mensajeBienvenida) mensajeBienvenida.nextElementSibling.innerHTML = ""; // Limpiar mensaje cordial
                break;

            case 'finalStateConfirmed':
                // Muestra solo el botón de WhatsApp con el estado final
                if (whatsappButton) {
                    whatsappButton.disabled = true;
                    whatsappButton.style.cursor = 'not-allowed';
                    whatsappButton.style.backgroundColor = newColor;
                    whatsappButton.textContent = message;
                    whatsappButton.style.display = 'inline-block';
                }
                // Mostrar mensaje cordial de confirmación
                if (mensajeBienvenida) {
                    //mensajeBienvenida.nextElementSibling.innerHTML = `<p style="color: green; font-weight: bold;">¡Excelente! Nos vemos en la fiesta.</p>`;
                }
                break;

            case 'finalStateDeclined':
                // Muestra solo el botón de declinación con el estado final
                if (declineButton) {
                    declineButton.disabled = true;
                    declineButton.style.cursor = 'not-allowed';
                    declineButton.style.backgroundColor = newColor;
                    declineButton.textContent = message;
                    declineButton.style.display = 'inline-block';
                }
                // Mostrar mensaje cordial de declinación
                if (mensajeBienvenida) {
                    mensajeBienvenida.innerHTML = `Lamentamos mucho su ausencia. <br> ¡Gracias por avisar!`;
                }
                break;

            case 'errorState':
                // Si hay un error, restaurar los botones principales a su estado original
                allMainButtons.forEach(btn => {
                    if (btn) btn.style.display = 'inline-block';
                });
                // Restaurar texto original de los botones
                if (whatsappButton) whatsappButton.textContent = "Confirmar Asistencia";
                if (acceptLessButton) acceptLessButton.textContent = "Aceptar menos invitaciones";
                if (declineButton) declineButton.textContent = "No podré asistir";
                if (mensajeBienvenida) mensajeBienvenida.nextElementSibling.innerHTML = ""; // Limpiar mensaje cordial
                break;

            case 'invalidLink':
                // Ocultar todos los botones y mostrar solo un mensaje si el link es inválido
                [whatsappButton, acceptLessButton, declineButton, confirmLessPassesButton].forEach(btn => {
                    if (btn) {
                        btn.disabled = true;
                        btn.style.cursor = 'not-allowed';
                        btn.style.backgroundColor = newColor;
                        btn.style.display = 'none'; // Ocultar todos los botones
                    }
                });
                if (mensajeBienvenida) mensajeBienvenida.nextElementSibling.innerHTML = ""; // Limpiar mensaje cordial
                // El mensaje principal ya se maneja en el if (!token) o !guestInfo
                break;
        }
    }


    if (!token) {
        if (mensajeBienvenida) {
            mensajeBienvenida.innerHTML = `¡Hola!<br>El enlace de invitación es incorrecto o está incompleto.`;
        }
        manageActionButtons('invalidLink', "Enlace inválido", '#999');
        return;
    }

    const guestInfo = await getGuestInfoByToken(token);

    if (!guestInfo) {
        if (mensajeBienvenida) {
            mensajeBienvenida.innerHTML = `¡Hola!<br>No pudimos encontrar tu invitación. Por favor, verifica el enlace.`;
        }
        manageActionButtons('invalidLink', "Invitación no encontrada", '#999');
        return;
    }

    const { nombre, pases, estado } = guestInfo;
    currentGuestName = nombre;
    currentAssignedPases = pases;

    // Mostrar nombre y pases en elementos visibles del HTML
    const nombreSpan1 = document.getElementById("nombreInvitado");
    if (nombreSpan1) nombreSpan1.textContent = nombre;

    const nombreSpan2 = document.getElementById("nombreConfirmacion");
    if (nombreSpan2) nombreSpan2.textContent = nombre;

    const pasesSpan = document.getElementById("pases");
    if (pasesSpan) pasesSpan.textContent = pases;


    if (mensajeBienvenida) {
        mensajeBienvenida.innerHTML = `¡Hola, <strong>${nombre}</strong>!<br>Tu invitación es para <strong>${pases}</strong> adulto(s).`;
    }

    // Añado un div o span vacío justo después de mensajeBienvenida para el mensaje cordial
    // Si ya existe, lo usamos, si no, lo creamos.
    let cordialMessageContainer = mensajeBienvenida.nextElementSibling;
    if (!cordialMessageContainer || !cordialMessageContainer.classList.contains('cordial-message')) {
        cordialMessageContainer = document.createElement('div');
        cordialMessageContainer.classList.add('cordial-message');
        mensajeBienvenida.parentNode.insertBefore(cordialMessageContainer, mensajeBienvenida.nextSibling);
    }
    cordialMessageContainer.innerHTML = ""; // Limpiar en cada carga

    // Actualizar el valor máximo en el input y mostrarlo en el span
    if (numPasesInput) {
        numPasesInput.max = pases;
        numPasesInput.value = pases;
    }
    const maxPasesDisplay = document.getElementById('maxPasesDisplay');
    if (maxPasesDisplay) {
        maxPasesDisplay.textContent = pases;
    }

    // Si ya está CONFIRMADO o RECHAZADA, ajusta los botones al estado final y muestra el mensaje cordial
    if (estado === 'CONFIRMADO') {
        manageActionButtons('finalStateConfirmed', "ASISTENCIA CONFIRMADA", '#4CAF50'); // Verde
        if (cordialMessageContainer) {
            mensajeBienvenida.innerHTML = `¡Gracias, <strong>${nombre}</strong>!<br>Has confirmado <strong>${pases}</strong> pase(s).<br>¡Nos vemos en la fiesta! 🎉`;
        }
        return;
    } else if (estado === 'RECHAZADA') {
        manageActionButtons('finalStateDeclined', "ASISTENCIA RECHAZADA", '#8B0000'); // Rojo
        if (cordialMessageContainer) {
             mensajeBienvenida.innerHTML = `Lamentamos mucho su ausencia. <br> ¡Gracias por avisar!`;
        }
        return;
    }

    // Si no ha respondido aún, inicializa los botones principales
    manageActionButtons('initialLoad');


    // Configurar el botón de Confirmar Asistencia (todos los pases)
    if (whatsappButton) {
    const mensajeWhatsAppFull = `Confirmo mi asistencia a los XV de Sofia. Soy ${nombre} y tengo ${pases} pases.`;
    const whatsappLinkFull = `https://wa.me/?text=${encodeURIComponent(mensajeWhatsAppFull)}`;

    whatsappButton.onclick = async () => {
        manageActionButtons('processing', "Confirmando...", '#f7f1e6'); // Naranja temporal
        try {
            const requestUrl = `${WEB_APP_URL}?t=${encodeURIComponent(token)}&confirm=true`;

            const response = await fetch(requestUrl, { method: 'GET' });
            const result = await response.json();

            if (result.success) {
                showToast('¡Confirmación exitosa! ' + result.message);
                window.open(whatsappLinkFull, '_blank');

                manageActionButtons('finalStateConfirmed', "ASISTENCIA CONFIRMADA", '#4CAF50');

                // ✅ Cambiar texto del botón con agradecimiento personalizado
                if (whatsappButton) {
                    whatsappButton.textContent = `¡Confirmados ${pases} pase(s)! 🎉`;
                }

                // ✅ También podrías cambiar el mensaje cordial si quieres
                if (mensajeBienvenida) {
                    mensajeBienvenida.innerHTML = `¡Gracias, <strong>${nombre}</strong>!<br>Has confirmado <strong>${pases}</strong> pase(s).<br>¡Nos vemos en la fiesta! 🎉`;
                }

            } else {
                showToast('Error en la confirmación: ' + result.message, false);
                console.error('Error del Apps Script:', result.message);
                manageActionButtons('errorState'); // Restaurar botones a estado original
            }
        } catch (error) {
            console.error('Error al enviar el registro o procesar la respuesta:', error);
            showToast('Error inesperado al confirmar.', false);
            manageActionButtons('errorState'); // Restaurar botones a estado original
        }
    };
}

    // Configurar el botón "Aceptar menos invitaciones"
    if (acceptLessButton) {
        acceptLessButton.onclick = () => {
            manageActionButtons('showLessPassesInput'); // Nueva acción para mostrar el input de pases
            if (numPasesInput) {
                numPasesInput.value = currentAssignedPases;
                numPasesInput.min = 1;
                numPasesInput.max = currentAssignedPases;
            }
        };
    }

    // Configurar el botón "Confirmar pases seleccionados"
    if (confirmLessPassesButton) {
        confirmLessPassesButton.onclick = async () => {
            const confirmedPases = parseInt(numPasesInput.value, 10);

            if (isNaN(confirmedPases) || confirmedPases < 1 || confirmedPases > currentAssignedPases) {
                alert(`Por favor, ingresa un número válido de pases entre 1 y ${currentAssignedPases}.`);
                return;
            }

            manageActionButtons('processingLessPasses', "Confirmando...", '#f7f1e6'); // Naranja temporal

            try {
                const requestUrl = `${WEB_APP_URL}?t=${encodeURIComponent(token)}&confirm_less=true&pases_confirmados=${confirmedPases}`;

                const response = await fetch(requestUrl, { method: 'GET' });
                const result = await response.json();

                if (result.success) {
                    showToast('¡Confirmación exitosa! ' + result.message);
                    const mensajeWhatsAppLess = `Confirmo mi asistencia a los XV de Sofia. Soy ${currentGuestName} y confirmo ${confirmedPases} pases.`;
                    window.open(`https://wa.me/?text=${encodeURIComponent(mensajeWhatsAppLess)}`, '_blank');
                    manageActionButtons('finalStateConfirmed', "ASISTENCIA CONFIRMADA", '#4CAF50'); // Verde
                    if (mensajeBienvenida) {
                        mensajeBienvenida.innerHTML = `!Gracias, <strong> ${currentGuestName} </strong> !<br>Has confirmado <strong> ${confirmedPases} </strong> pase(s).<br>!Nos vemos en la fiesta! 🎉`;
                    }
                    if (cordialMessageContainer){
                        //cordialMessageContainer.innerHTML = `<p style="color: green; font-weight: bold;">¡Tu asistencia está registrada con menos pases!</p>`;
                    }
                } else {
                    showToast('Error en la confirmación: ' + result.message, false);
                    console.error('Error del Apps Script:', result.message);
                    manageActionButtons('errorState'); // Restaurar botones a estado original
                }
            } catch (error) {
                console.error('Error al enviar el registro o procesar la respuesta:', error);
                showToast('Error inesperado al confirmar.', false);
                manageActionButtons('errorState'); // Restaurar botones a estado original
            }
        };
    }

    // Configurar el botón "No podré asistir"
    if (declineButton) {
        declineButton.onclick = async () => {
            manageActionButtons('processing', "Registrando declinación...", '#f7f1e6'); // Amarillo temporal
            try {
                const requestUrl = `${WEB_APP_URL}?t=${encodeURIComponent(token)}&decline=true`;

                const response = await fetch(requestUrl, { method: 'GET' });
                const result = await response.json();

                if (result.success) {
                    showToast('Tu declinación ha sido registrada.');
                    manageActionButtons('finalStateDeclined', "ASISTENCIA RECHAZADA", '#8B0000'); // Rojo
                    if (mensajeBienvenida) {
                        mensajeBienvenida.innerHTML = `Lamentamos mucho su ausencia. <br> ¡Gracias por avisar!`;
                    }
                } else {
                    showToast('Error al registrar la declinación.', false);
                    console.error('Error del Apps Script:', result.message);
                    manageActionButtons('errorState'); // Restaurar botones a estado original
                }
            } catch (error) {
                console.error('Error de red al registrar la declinación:', error);
                showToast('Error inesperado al registrar declinación.', false);
                manageActionButtons('errorState'); // Restaurar botones a estado original
            }
        };
    }
}


function showToast(message, success = true) {
  const toastElement = document.getElementById('liveToast');
  const toastBody = document.getElementById('toastMessage');
  toastBody.textContent = message;
  toastElement.classList.remove('bg-success', 'bg-danger');
  toastElement.classList.add(success ? 'bg-success' : 'bg-danger');
  const toast = new bootstrap.Toast(toastElement);
  toast.show();
}

document.addEventListener("DOMContentLoaded", function () {
    initializeInvitationPage();

    const reveals = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1 }
    );
    reveals.forEach(section => {
        observer.observe(section);
    });
});// El script.js se mantiene sin cambios desde Versión 3 a Versión 8
