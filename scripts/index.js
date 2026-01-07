var intentos = 0;
var correct_button_index = 0;
var idiom_of_the_day ="";
var idiom_definition = "";
var dias_transcurridos = 0;
// Iniciar el quiz
function start_quiz() {
    // Averiguar si se puede hacer el quiz o no
    let done_quiz = JSON.parse(getCookie('done_quiz') || false);
    done_quiz = false; // PARA PRUEBAS, LUEGO QUITAR.
    // Si ha consentido las cookies, mostrar la tarjeta del quiz.
    if (hasConsented() && !done_quiz) {
        console.info("Usuario ha aceptado cookies.");
        document.querySelectorAll('.card')[1].style.display = 'none';
        document.querySelectorAll('.card')[2].style.display = 'block';
        document.querySelectorAll('.card')[3].style.display = 'none';
        document.querySelectorAll('.card')[4].style.display = 'none';
        document.querySelectorAll('.card')[5].style.display = 'none';
    // Si no ha consentido, informar.
    } else if (!done_quiz) {
        alert("¡No has aceptado las cookies! No se guardan tus progresos.");
        console.info("Usuario no ha aceptado cookies.");
        const banner = document.getElementById('cookieBanner');
        banner.style.display = 'block';
    } else if(done_quiz){
        alert("¡Ya has completado el quiz de hoy! Vuelve mañana.");
    }

}

// Volver a empezar el quiz, es decir, al inicio del todo. Un reset.
function reload() {
    intentos = 0;
    document.querySelectorAll('.card')[0].style.display = 'block';
    document.querySelectorAll('.card')[1].style.display = 'none';
    document.querySelectorAll('.card')[2].style.display = 'block';
    document.querySelectorAll('.card')[3].style.display = 'none';
    document.querySelectorAll('.card')[4].style.display = 'none';
    document.querySelectorAll('.card')[5].style.display = 'none';
    incrementAndRender();
}
function next_question() {
    document.querySelectorAll('.card')[0].style.display = 'block';
    document.querySelectorAll('.card')[1].style.display = 'none';
    document.querySelectorAll('.card')[2].style.display = 'block';
    document.querySelectorAll('.card')[3].style.display = 'none';
    document.querySelectorAll('.card')[4].style.display = 'none';
    document.querySelectorAll('.card')[5].style.display = 'none';
    incrementAndRender();
}

// Ejemplo: obtener JSON público desde raw.githubusercontent.com
function fetchJsonFromRaw() {
    const url = 'https://raw.githubusercontent.com/VocabularyMoMe/VocabularyMoMe.github.io/refs/heads/main/vocabulary.json';
    return fetch(url)
    .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
    })
    .then(data => {
        arrays = Object.entries(data[0]);
        data = arrays;
        return data;
    })
    .catch(err => {
        console.error('Error al cargar JSON (raw):', err);
        return null;
    });
}
// ===== Utilidades de cookies =====
function setCookie(name, value, days, options = {}) {
    const d = new Date();
    d.setTime(d.getTime() + (days*24*60*60*1000));
    let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)};expires=${d.toUTCString()};path=/;SameSite=Lax`;
    // GitHub Pages sirve por HTTPS, añadimos Secure automáticamente cuando toque
    if (location.protocol === 'https:') cookie += ';Secure';
    if (options.domain) cookie += `;Domain=${options.domain}`;
    document.cookie = cookie;
}

function getCookie(name) {
    const decoded = decodeURIComponent(document.cookie || '');
    const parts = decoded.split(';').map(c => c.trim());
    for (const part of parts) {
    if (part.startsWith(name + '=')) {
        return part.substring(name.length + 1);
    }
    }
    return null;
}

function deleteCookie(name) {
    let cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
    if (location.protocol === 'https:') cookie += ';Secure';
    document.cookie = cookie;
}

// ===== Preferencia de consentimiento (simple) =====
const CONSENT_KEY = 'cookie_consent_functional';

// Si hay consentimiento, entonces la CONSENT_KEY será cierta, si no, falso y no funcionará.
const hasConsented = () => getCookie(CONSENT_KEY) === 'yes';
const hasRejected  = () => getCookie(CONSENT_KEY) === 'no';

function showBannerIfNeeded() {
// Si es la primera vez, es necesario aceptar las cookies primero puesto que si no, no se guardarán los resultados.
    const banner = document.getElementById('cookieBanner');
    // Comprobamos que hay consentimiento en relación a las Cookies.
    if (!hasConsented() && !hasRejected()) {
    banner.style.display = 'block';
    }
}

document.getElementById('acceptCookies').addEventListener('click', () => {
    setCookie(CONSENT_KEY, 'yes', 365);
    document.getElementById('cookieBanner').style.display = 'none';
    incrementAndRender();
});
document.getElementById('rejectCookies').addEventListener('click', () => {
    setCookie(CONSENT_KEY, 'no', 365);
    document.getElementById('cookieBanner').style.display = 'none';
    renderCount(0);
    deleteCookie('visit_count');
});


function diferenciaEnDias(fecha1, fecha2) {
    // Convertir a objeto Date
    const f1 = new Date(fecha1);
    const f2 = new Date(fecha2);

    // Normalizar (poner hora en 00:00:00)
    f1.setHours(0, 0, 0, 0);
    f2.setHours(0, 0, 0, 0);

    // Calcular diferencia en milisegundos
    const diferenciaMs = Math.abs(f2 - f1);

    // Convertir a días
    const dias = diferenciaMs / (1000 * 60 * 60 * 24);

    return dias;
}

function check_response(reply_selected_index) {
    if (reply_selected_index !== correct_button_index) {
    console.info("Incorrecto. La definición correcta es: " + idiom_definition + ". Te toca volver a empezar :)"+idiom_of_the_day);
    intentos = 0;
    setCookie('done_quiz', false, 365);
    document.querySelectorAll('.card')[2].style.display = 'none';
    document.querySelectorAll('.card')[3].style.display = 'none';
    document.querySelectorAll('.card')[4].style.display = 'block';
    return;
    }else{
    console.info("¡Correcto! Has acertado la definición.",idiom_of_the_day + ": " + idiom_definition);
    intentos++;
    document.querySelectorAll('.card')[2].style.display = 'none';
    document.querySelectorAll('.card')[3].style.display = 'block';
    document.querySelectorAll('.card')[4].style.display = 'none';
    }

    if (intentos >= dias_transcurridos) {
    intentos = 0;
    document.querySelectorAll('.card')[5].style.display = 'block';
    document.querySelectorAll('.card')[2].style.display = 'none';
    document.querySelectorAll('.card')[3].style.display = 'none';
    setCookie('done_quiz', true, 365);
    }else{
    setCookie('done_quiz', false, 365);
    }

}

function set_words_in_quiz(first_access,fecha_hoy) {
    fetchJsonFromRaw().then(data => {
            // usar los datos cuando lleguen; p. ej. guardarlos para usar en incrementAndRender()
            dias_transcurridos = diferenciaEnDias(first_access,fecha_hoy);
            console.info("Dias transcurridos: "+ dias_transcurridos, "Intentos: "+intentos);
            // Si ya se han hecho todos los idioms del día, marcar como hecho.
            if (intentos >= dias_transcurridos) {
            intentos = 0;
            setCookie('done_quiz', true, 365);
            }
            // Sacamos el Idiom y su definición.
            idiom_of_the_day = data[intentos % data.length][0];
            idiom_definition = data[intentos % data.length][1];
            console.info("Palabra: ",idiom_of_the_day,"Definición: ",idiom_definition);
            // Mostramos el idiom en la página.
            document.getElementById('idiom').textContent = idiom_of_the_day;
            // Pillamos un número aleatorio entre 0 y 2 para poner la definición correcta en un botón aleatorio.
            correct_button_index = Math.floor(Math.random() * 3);
            // Pillamos otras definiciones aleatorias.
            let other_definitions = data.filter(item => item[0] !== idiom_of_the_day);
            // Mezclamos con las otras definiciones.
            other_definitions.sort(() => Math.random() - 0.5);
            // Ponemos las definiciones en los botones.
            document.getElementById('first_reply').textContent = correct_button_index === 0 ? idiom_definition : other_definitions[0][1];
            document.getElementById('second_reply').textContent = correct_button_index === 1 ? idiom_definition : other_definitions[1][1];
            document.getElementById('third_reply').textContent = correct_button_index === 2 ? idiom_definition : other_definitions[2][1];
            // Poner el número de palabra y total.
            document.getElementById('idiom_number').textContent = intentos + 1;
            document.getElementById('total_idioms_today').textContent = dias_transcurridos + 1;
        } );
}



function incrementAndRender() {
    // Si por casualidad entra aquí y no se ha consentido el asunto de las cookies, salir.
    if (!hasConsented())  return;
    //  Obtenemos la fecha de hoy
    const fecha_hoy = new Date();
    fecha_hoy.setTime(fecha_hoy.getTime())
    fecha_hoy_string = fecha_hoy.toUTCString();
    //  Pedir cookie de primer acceso. En caso de ser reportada en un formato no válido, usar la fecha del día de hoy. Esta nos marca la cantidad de palabras de hoy
    let first_access = new Date(getCookie('first_access') || fecha_hoy)
    // ¿ Se ha hecho el Quiz de hoy? En caso de no saber, se considerará que NO.
    let done_quiz = JSON.parse(getCookie('done_quiz') || false);
    //   Es fecha? Si lo es, hacer la comparación, si no, NO.
    if (!isNaN(first_access.getTime()) && !done_quiz){
    console.info(diferenciaEnDias(first_access,fecha_hoy))
    // Refrescamos la cookie del primer acceso.
    setCookie('first_access', String(first_access), 365);
    // Ponemos en la página la palabra que toca.
    set_words_in_quiz(first_access,fecha_hoy);
    // Pasamos a la siguiente palabra.

    }else if (done_quiz){
    console.info("Ya has completado el quiz de hoy. Vuelve mañana.");

    }
}

    // MAIN
// Mostrar banner si no se ha acepatdo las cookies.
showBannerIfNeeded();
if (hasConsented()){

    // Asegurarse de que la cookie 'done_quiz' existe. Es para pruebas, luego se borra.
    console.info(getCookie('done_quiz'));
    incrementAndRender();
}