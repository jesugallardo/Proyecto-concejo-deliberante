/* ==========================================================================
   ⚙️ JAVASCRIPT DE FUNCIONALIDADES (Lógica Interactiva y Accesibilidad)
   ========================================================================== */

// 1. MENÚ DE NAVEGACIÓN EN MÓVILES
const menuBtn = document.getElementById('menu-btn');
const mainMenu = document.getElementById('main-menu');

if (menuBtn && mainMenu) {
    menuBtn.addEventListener('click', () => {
        mainMenu.classList.toggle('active');
    });
}

// 2. ACCESIBILIDAD: ALTO CONTRASTE
window.cambiarContraste = function() {
    document.body.classList.toggle('high-contrast');
};

// 3. ACCESIBILIDAD: AJUSTE DE TAMAÑO DE FUENTE
let tamañoActual = 15;

window.cambiarTexto = function(accion) {
    const root = document.documentElement;
    if (accion === 1 && tamañoActual < 21) {
        tamañoActual += 2;
    } else if (accion === -1 && tamañoActual > 11) {
        tamañoActual -= 2;
    }
    root.style.setProperty('--font-size-base', tamañoActual + 'px');
};

// 4. SLIDER PRINCIPAL DEL HERO BANNER
function concejoInitSlider(rootId, opts) {
    var root = document.getElementById(rootId);
    if (!root) return null;
    var slides = root.querySelectorAll(opts.slideSel);
    var dots = root.querySelectorAll(opts.dotSel);
    if (slides.length === 0) return null;
    var i = 0, timer;
    
    function show(n) {
        slides[i].classList.remove('is-active');
        if (dots[i]) dots[i].classList.remove('is-active');
        i = (n + slides.length) % slides.length;
        slides[i].classList.add('is-active');
        if (dots[i]) dots[i].classList.add('is-active');
    }
    
    var reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    function reset() { 
        clearInterval(timer); 
        if (slides.length > 1 && !reduceMotion) {
            timer = setInterval(function () { show(i + 1); }, opts.interval); 
        }
    }
    
    reset();
    return {
        move: function (d) { show(i + d); reset(); },
        go: function (n) { show(n); reset(); },
    };
}

var heroCtl = concejoInitSlider('heroSlider', { slideSel: '.slide', dotSel: '.dot', interval: 5000 });
window.concejoSlide = function (d) { if (heroCtl) heroCtl.move(d); };
window.concejoGo = function (n) { if (heroCtl) heroCtl.go(n); };

// 5. CARRUSEL DE CONCEJALES (EFECTO COVERFLOW 3D)
function ccInitCoverflow() {
    var root = document.getElementById('ccSlider');
    if (!root) return null;
    var slides = [].slice.call(root.querySelectorAll('.cc-slide'));
    var dots = [].slice.call(root.querySelectorAll('#ccDots .dot'));
    if (slides.length === 0) return null;
    var i = 0, timer;
    var reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    function render() {
        var n = slides.length;
        slides.forEach(function (s, k) {
            s.classList.remove('is-center', 'is-prev', 'is-next');
            if (k === i) s.classList.add('is-center');
            else if (k === (i - 1 + n) % n) s.classList.add('is-prev');
            else if (k === (i + 1) % n) s.classList.add('is-next');
        });
        dots.forEach(function (d, k) { d.classList.toggle('is-active', k === i); });
    }
    
    function show(n2) { i = (n2 + slides.length) % slides.length; render(); }
    function reset() { clearInterval(timer); if (slides.length > 1 && !reduceMotion) timer = setInterval(function () { show(i + 1); }, 3500); }
    
    slides.forEach(function (s, k) {
        s.addEventListener('click', function (e) {
            if (!s.classList.contains('is-center')) { e.preventDefault(); show(k); reset(); }
        });
    });
    
    render();
    reset();
    return {
        move: function (d) { show(i + d); reset(); },
        go: function (n2) { show(n2); reset(); },
    };
}

var ccCtl = ccInitCoverflow();
window.ccGo = function (d) { if (ccCtl) ccCtl.move(d); };
window.ccGo2 = function (n) { if (ccCtl) ccCtl.go(n); };

// 6. VALIDACIÓN DEL FORMULARIO DE SUSCRIPCIÓN AL BOLETÍN
const boletinForm = document.getElementById('boletinForm');
if (boletinForm) {
    boletinForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const emailInput = document.getElementById('boletinEmail');
        const msg = document.getElementById('boletinMsg');
        const email = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (emailRegex.test(email)) {
            msg.textContent = '¡Listo! Te suscribiste correctamente al boletín informativo.';
            msg.className = 'boletin-msg success';
            emailInput.value = '';
        } else {
            msg.textContent = 'Por favor, ingresá un correo electrónico válido.';
            msg.className = 'boletin-msg error';
        }
    });
}