document.addEventListener('DOMContentLoaded', () => {

    /* ==================================== */
    /* LÓGICA 1: Contador de Descargas      */
    /* ==================================== */
    if (document.getElementById('contador-numero')) {
        const contadorNumero = document.getElementById('contador-numero');
        const downloadButton = document.getElementById('download-button');
        
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
            text: 'Nivel de Empleabilidad de Inicio: Requieres formación y experiencia para mejorar tu posición en el mercado laboral.',
            image: '../images/baja.png'
        },
        'hotspot-media': {
            text: 'Nivel de Empleabilidad Moderado: Tienes un buen punto de partida, pero necesitas desarrollar habilidades específicas.',
            image: '../images/media.png'
        },
        'hotspot-alta': {
            text: 'Nivel de Empleabilidad Muy Alto: Tienes las competencias clave y experiencia en sectores de alta demanda.',
            image: '../images/alta.png'
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
            <p>${itemData.text}</p>
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
            
            // Opcional: limpiar el contenido después de ocultar
            // infoBox.innerHTML = '';
        });
    });

});