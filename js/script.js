document.addEventListener('DOMContentLoaded', () => {

    /* ==================================== */
    /* LÓGICA 1: Contador de Descargas      */
    /* ==================================== */
    if (document.getElementById('contador-numero')) {
        const contadorNumero = document.getElementById('contador-numero');
        const downloadButton = document.getElementById('download-button');
        
        // Asumiendo que esta API está disponible en el HTML que se carga
        const API_URL = 'https://api-contador-zenr.onrender.com';

        async function getCount() {
            try {
                const response = await fetch(`${API_URL}/api/contador`);
                const data = await response.json();
                contadorNumero.textContent = data.count;
            } catch (error) {
                console.error('Error al obtener el contador:', error);
                contadorNumero.textContent = '--';
            }
        }
        
        async function registerDownload(event) {
            event.preventDefault();

            try {
                await fetch(`${API_URL}/api/incrementar`);
                window.open(downloadButton.href, '_blank');
                getCount();
            } catch (error) {
                console.error('Error al registrar la descarga:', error);
            }
        }

        getCount();
        downloadButton.addEventListener('click', registerDownload);
    }
    
    /* ==================================== */
    /* LÓGICA 2: Termómetro Interactivo     */
    /* ==================================== */

    // 1. Seleccionar los elementos clave del DOM
    const infoBox = document.querySelector('.termometer-info-box');
    const hotspots = document.querySelectorAll('.hotspot');

    // 2. Definir los datos para cada nivel del termómetro
    const termometerData = {
        'hotspot-baja': {
            image: '/images/baja.png'
        },
        'hotspot-media': {
            image: '/images/intermedia.png'
        },
        'hotspot-alta': {
            image: '/images/alta.png'
        }
    };

    /**
     * Función para actualizar el contenido de la caja de información y mostrarla.
     * @param {Object} itemData - Objeto con las propiedades 'text' e 'image'.
     */
    function updateInfoBox(itemData) {
        // Construye el HTML con la imagen y el texto
        infoBox.innerHTML = `
            <img src="${itemData.image}" alt="Indicador de Nivel" class="info-content-image">
        `;
        // Muestra la caja añadiendo la clase 'active' definida en CSS
        infoBox.classList.add('active');
    }

    // 3. Agregar los Listeners de Eventos a cada Hotspot
    hotspots.forEach(hotspot => {
        const hotspotId = hotspot.id;

        // Evento: MOUSEOVER (Cuando el ratón entra)
        hotspot.addEventListener('mouseover', () => {
            if (termometerData[hotspotId]) {
                updateInfoBox(termometerData[hotspotId]);
            }
        });

        // Evento: MOUSEOUT (Cuando el ratón sale)
        hotspot.addEventListener('mouseout', () => {
            // Oculta la caja quitando la clase 'active'
            infoBox.classList.remove('active');
        });
    });


    /* ==================================== */
    /* LÓGICA 3: Carruseles (Auto y Manual) */
    /* ==================================== */
    
    /**
     * Función genérica para inicializar un carrusel con auto-avance.
     * @param {string} containerSelector - Selector CSS del contenedor principal del carrusel.
     * @param {number} interval - Intervalo de tiempo en milisegundos para el avance automático.
     */
    function initializeCarousel(containerSelector, interval = 5000) {
        const carouselContainer = document.querySelector(containerSelector);
        if (!carouselContainer) return;

        const track = carouselContainer.querySelector('.carousel-track');
        const slides = Array.from(track.children);
        const nextButton = carouselContainer.querySelector('.next-btn');
        const prevButton = carouselContainer.querySelector('.prev-btn');
        let currentIndex = 0;
        let slideWidth = slides.length > 0 ? slides[0].offsetWidth : 0;
        let autoAdvanceInterval;

        // Función para mover el carrusel al índice actual
        const updateCarousel = () => {
            if (slideWidth > 0) {
                track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
            }
        };

        // Función para ir al siguiente slide (Manual o Automático)
        const nextSlide = () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        };

        // Función para ir al slide anterior (Manual)
        const prevSlide = () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        };
        
        // 🔴 Lógica de Auto-avance 🔴
        const startAutoAdvance = () => {
            stopAutoAdvance(); // Detiene si ya está corriendo
            autoAdvanceInterval = setInterval(nextSlide, interval);
        };

        const stopAutoAdvance = () => {
            if (autoAdvanceInterval) {
                clearInterval(autoAdvanceInterval);
            }
        };

        // 🔴 Control Manual y Reanudación 🔴
        if (nextButton) nextButton.addEventListener('click', () => { 
            nextSlide();
            // Reinicia el temporizador al interactuar manualmente
            startAutoAdvance(); 
        });
        
        if (prevButton) prevButton.addEventListener('click', () => { 
            prevSlide();
            // Reinicia el temporizador al interactuar manualmente
            startAutoAdvance(); 
        });

        // Pausa al pasar el ratón por encima del contenedor
        carouselContainer.addEventListener('mouseenter', stopAutoAdvance);
        carouselContainer.addEventListener('mouseleave', startAutoAdvance);

        // Ajuste de ancho al redimensionar la ventana (MUY IMPORTANTE)
        window.addEventListener('resize', () => {
            if (slides.length > 0) {
                 slideWidth = slides[0].offsetWidth;
            }
            updateCarousel(); 
        });
        
        // Inicialización
        if (slides.length > 0) {
            slideWidth = slides[0].offsetWidth;
            startAutoAdvance();
        }
    }

    // 1. Inicializar el Carrusel de Experiencias (Intervalo: 6000ms = 6 segundos)
    initializeCarousel('.experiences-carousel', 6000);

    // 2. Inicializar el Carrusel de Usuarios (Intervalo: 5000ms = 5 segundos)
    initializeCarousel('.users-carousel', 5000);

});