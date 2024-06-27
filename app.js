const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')
const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock');
const { delay } = require('@whiskeysockets/baileys');

// Función para determinar si es de día o de tarde
function getSaludo() {
    const horaActual = new Date().getHours();
    if (horaActual >= 6 && horaActual < 12) {
        return 'Buenos días';
    } else if (horaActual >= 12 && horaActual < 18) {
        return 'Buenas tardes';
    } else {
        return 'Buenas noches';
    }
}

// Flujos para cada carrera
const respuestasCarreras = {
    // Mensaje de informática
    'informatica': {
        mensaje: 'Para conocer más detalles acerca de la carrera de Ing. Informática te comparto la siguiente imagen',
        media: 'https://i.ibb.co/BGxBRRw/info.jpg'
    },
    'informática': {
        mensaje: 'Para conocer más detalles acerca de la carrera de Ing. Informática te comparto la siguiente imagen',
        media: 'https://i.ibb.co/BGxBRRw/info.jpg'
    },

    // Mensaje de agronomía
    'agronomia': {
        mensaje: 'Para conocer más detalles acerca de la carrera de Ing. En Agronomía te comparto la siguiente imagen',
        media: 'https://i.ibb.co/3prSNNM/Agro.jpg'
    },
    'agronomía': {
        mensaje: 'Para conocer más detalles acerca de la carrera de Ing. En Agronomía te comparto la siguiente imagen',
        media: 'https://i.ibb.co/3prSNNM/Agro.jpg'
    },

    // Mensaje de industrial
    'industrial': {
        mensaje: 'Para conocer más detalles acerca de la carrera de Ing. Industrial te comparto la siguiente imagen',
        media: 'https://i.ibb.co/CPdWcH0/Industrial.jpg'
    },

    // Mensaje de energías renovables
    'energias renovables': {
        mensaje: 'Para conocer más detalles acerca de la carrera de Ing. en Energías Renovables te comparto la siguiente imagen',
        media: 'https://i.ibb.co/mSB6Ntk/Erenovables.jpg'
    },
    'energías renovables': {
        mensaje: 'Para conocer más detalles acerca de la carrera de Ing. en Energías Renovables te comparto la siguiente imagen',
        media: 'https://i.ibb.co/mSB6Ntk/Erenovables.jpg'
    },

    // Mensaje de bioquímica
    'bioquimica': {
        mensaje: 'Para conocer más detalles acerca de la carrera en Ing. Bioquímica te comparto la siguiente imagen',
        media: 'https://i.ibb.co/ZXjN1b0/Bioq.jpg'
    },
    'bioquímica': {
        mensaje: 'Para conocer más detalles acerca de la carrera en Ing. Bioquímica te comparto la siguiente imagen',
        media: 'https://i.ibb.co/ZXjN1b0/Bioq.jpg'
    },

    // Mensaje de electromecánica
    'electromecanica': {
        mensaje: 'Para conocer más detalles acerca de la carrera de Ing. Electromecánica te comparto la siguiente imagen',
        media: 'https://i.ibb.co/GMp0WgY/Electro.jpg'
    },
    'electromecánica': {
        mensaje: 'Para conocer más detalles acerca de la carrera de Ing. Electromecánica te comparto la siguiente imagen',
        media: 'https://i.ibb.co/GMp0WgY/Electro.jpg'
    },

    // Mensaje de administración
    'administracion': {
        mensaje: 'Para conocer más detalles acerca de la carrera de Ing. En Administración de Empresas te comparto la siguiente imagen',
        media: 'https://i.ibb.co/S0jRht0/Admin.jpg'
    },
    'administración': {
        mensaje: 'Para conocer más detalles acerca de la carrera de Ing. En Administración de Empresas te comparto la siguiente imagen',
        media: 'https://i.ibb.co/S0jRht0/Admin.jpg'
    }
};

// Flujos para talleres
const respuestasTalleres = {
    'ajedrez': 'Mensaje personalizado para el taller de ajedrez.',
    'basquet': 'Mensaje personalizado para el taller de basquet.',
    'futbol': 'Mensaje personalizado para el taller de futbol.',
    'fútbol': 'Mensaje personalizado para el taller de futbol.',
    'taekwondo': 'Mensaje personalizado para el taller de taekwondo.'
};

// Flujo para preguntar sobre la carrera deseada
const flowInformacionCarreras = addKeyword(['1', 'Informacion', 'Información'])
    .addAnswer('Contamos con 7 carreras:\n*- Informática* \n*- Agronomía* \n*- Industrial*\n*- Energías renovables*\n*- Bioquímica*\n*- Electromecánica* \n*- Administración de empresas* \n¿De qué carrera te gustaría información?')
    .addAnswer('Por favor, escribe el nombre de la carrera.', { capture: true }, async (ctx, { provider }) => {
        const respuesta = ctx.body.toLowerCase().trim();
        const respuestaCarrera = respuestasCarreras[respuesta];

        if (respuestaCarrera) {
            await provider.sendText(ctx.from + '@s.whatsapp.net', respuestaCarrera.mensaje);
            if (respuestaCarrera.media) {
                await provider.sendMedia(ctx.from + '@s.whatsapp.net', respuestaCarrera.media);
            }
        } else {
            await provider.sendText(ctx.from + '@s.whatsapp.net', 'Lo siento, no entendí tu respuesta. Por favor, elige una de las opciones proporcionadas.');
        }
    });

// Flujo para talleres
const flowInformacionTalleres = addKeyword(['2', 'Talleres', 'talleres'])
    .addAnswer('El ITSS ofrece los siguientes talleres:\n1. Ajedrez\n2. Basquet\n3. Futbol\n4. Taekwondo\n¿De qué taller te gustaría más información? Por favor, escribe el nombre del taller.', { capture: true }, async (ctx, { provider }) => {
        const respuesta = ctx.body.toLowerCase().trim();
        const respuestaTaller = respuestasTalleres[respuesta];

        if (respuestaTaller) {
            await provider.sendText(ctx.from + '@s.whatsapp.net', respuestaTaller);
        } else {
            await provider.sendText(ctx.from + '@s.whatsapp.net', 'Lo siento, no entendí tu respuesta. Por favor, elige uno de los talleres proporcionados.');
        }
    });

// Flujo de ubicación
const flowUbicacion = addKeyword(['4', 'Ubicacion', 'Ubicación'])
    .addAnswer('abrir Mapa: https://maps.app.goo.gl/uz1Rfp3XVdDrJriB9 \n Nos encontramos ubicados en📍: \nCarret. Teapa-Tacotalpa Km 4.5 Ej. Fco Javier Mina 86801 Teapa, Tabasco, Mexico, con horario de 8 a.m a 4 p.m de lunes a jueves',{
        delay: 10000,
        media: "https://i.ibb.co/7KJGhQJ/Captura-de-pantalla-2024-06-26-135915.png",
    });

// Flujo de inscripciones
const flowInscripciones = addKeyword(['5', 'Inscripciones', 'inscripciones'])
    .addAnswer('Para conocer mas informacion acerca ' +
    'del proceso de inscripcion te comparto la siguiente imagen☝🏻',{
        delay: 10000 ,    
        media: "https://i.postimg.cc/Jh1BfzrY/408993623-862056865853751-2546998439695152438-n.jpg"
    });

// Flujos para las otras opciones del menú
const flowContacto = addKeyword(['3', 'Contacto', 'Contactanos', 'contactanos'])
    .addAnswer('Para contactarnos puedes visitarnos en nuestras redes sociales📱 \nFacebook: \nInstagram: \nX: \nTECNM- Región Sierra',{
        delay: 10000,
    });

// Flujos adicionales
const flowBienvenida = addKeyword(['Hola', 'hola', '.', 'buenos dias', 'Buenos dias', 'buenas tardes', 'Buenas tardes', 'buenas noches', 'Buenas noches'])
    .addAnswer(`${getSaludo()}, Hola, soy el chat-bot del ITSS 🤖 Bienvenido al menú principal. Por favor elige una opción:\n1. Información sobre nuestras ingenierias\n2. Talleres\n3. Contáctanos\n4. Ubicación\n5. Proceso de inscripción\nEscribe el número de la opción deseada.`,{
        delay: 10000
    });

const flowAdios = addKeyword(['Adios', 'adios', 'adiós', 'Adiós'])
    .addAnswer('Hasta luego, que tengas un buen día.');

const mainFlow = createFlow([
    flowInformacionCarreras,
    flowInformacionTalleres,
    flowContacto,
    flowUbicacion,
    flowInscripciones,
    flowBienvenida,
    flowAdios
]);

// Función principal para inicializar el bot
const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowInformacionCarreras,
    flowInformacionTalleres,
    flowContacto,
    flowUbicacion,
    flowInscripciones,
    flowBienvenida,
    flowAdios
    ])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
};

// Ejecutar la función principal
main();
