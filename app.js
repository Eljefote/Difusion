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
        mensaje: 'Para conocer más detalles acerca de la carrera de Ing. Informática te comparto la siguiente imagen 😎',
        media: 'https://i.ibb.co/BGxBRRw/info.jpg'
    },
    'informática': {
        mensaje: 'Para conocer más detalles acerca de la carrera de Ing. Informática te comparto la siguiente imagen 😎' ,
        media: 'https://i.ibb.co/BGxBRRw/info.jpg'
    },

    // Mensaje de agronomía
    'agronomia': {
        mensaje: 'Para conocer más detalles acerca de la carrera de Ing. En Agronomía te comparto la siguiente imagen 😎',
        media: 'https://i.ibb.co/3prSNNM/Agro.jpg'
    },
    'agronomía': {
        mensaje: 'Para conocer más detalles acerca de la carrera de Ing. En Agronomía te comparto la siguiente imagen 😎',
        media: 'https://i.ibb.co/3prSNNM/Agro.jpg'
    },

    // Mensaje de industrial
    'industrial': {
        mensaje: 'Para conocer más detalles acerca de la carrera de Ing. Industrial te comparto la siguiente imagen 😎',
        media: 'https://i.ibb.co/CPdWcH0/Industrial.jpg'
    },

    // Mensaje de energías renovables
    'energias renovables': {
        mensaje: 'Para conocer más detalles acerca de la carrera de Ing. en Energías Renovables te comparto la siguiente imagen 😎',
        media: 'https://i.ibb.co/mSB6Ntk/Erenovables.jpg'
    },
    'energías renovables': {
        mensaje: 'Para conocer más detalles acerca de la carrera de Ing. en Energías Renovables te comparto la siguiente imagen ',
        media: 'https://i.ibb.co/mSB6Ntk/Erenovables.jpg'
    },

    // Mensaje de bioquímica
    'bioquimica': {
        mensaje: 'Para conocer más detalles acerca de la carrera en Ing. Bioquímica te comparto la siguiente imagen 😎',
        media: 'https://i.ibb.co/ZXjN1b0/Bioq.jpg'
    },
    'bioquímica': {
        mensaje: 'Para conocer más detalles acerca de la carrera en Ing. Bioquímica te comparto la siguiente imagen 😎',
        media: 'https://i.ibb.co/ZXjN1b0/Bioq.jpg'
    },

    // Mensaje de electromecánica
    'electromecanica': {
        mensaje: 'Para conocer más detalles acerca de la carrera de Ing. Electromecánica te comparto la siguiente imagen 😎',
        media: 'https://i.ibb.co/GMp0WgY/Electro.jpg'
    },
    'electromecánica': {
        mensaje: 'Para conocer más detalles acerca de la carrera de Ing. Electromecánica te comparto la siguiente imagen 😎',
        media: 'https://i.ibb.co/GMp0WgY/Electro.jpg'
    },

    // Mensaje de administración
    'administracion': {
        mensaje: 'Para conocer más detalles acerca de la carrera de Ing. En Administración de Empresas te comparto la siguiente imagen 😎',
        media: 'https://i.ibb.co/S0jRht0/Admin.jpg'
    },
    'administración': {
        mensaje: 'Para conocer más detalles acerca de la carrera de Ing. En Administración de Empresas te comparto la siguiente imagen 😎',
        media: 'https://i.ibb.co/S0jRht0/Admin.jpg'
    }
};

// Flujos para talleres
// const respuestasTalleres = {
//     'ajedrez': 'Mensaje personalizado para el taller de ajedrez.',
//     'basquet': 'Mensaje personalizado para el taller de basquet.',
//     'futbol': 'Mensaje personalizado para el taller de futbol.',
//     'fútbol': 'Mensaje personalizado para el taller de futbol.',
//     'taekwondo': 'Mensaje personalizado para el taller de taekwondo.'
// };

// Flujo para preguntar sobre la carrera deseada
const flowInformacionCarreras = addKeyword(['1', 'Informacion', 'Información'])
    .addAnswer('Contamos con 7 carreras:\n*- Administración* \n*- Agronomía* \n*- Bioquímica*\n*- Electromecánica*\n*- Energías renovables*\n*- Industrial* \n*- Informática* \n¿De qué carrera te gustaría información?')
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

// Flujo para informacion de la institucion
const flowInstitucion = addKeyword(['2', 'Institución', 'Institucion'])
    .addAnswer('INFORMACION DEL ITSS', {
        delay: 10000
    });

// Flujo de ubicación
const flowUbicacion = addKeyword(['4', 'Ubicacion', 'Ubicación'])
    .addAnswer('https://maps.app.goo.gl/uz1Rfp3XVdDrJriB9 \n Nos encontramos ubicados en📍: \nCarret. Teapa-Tacotalpa Km 4.5 Ej. Fco Javier Mina 86801 Teapa, Tabasco, Mexico ',{
        delay: 10000,
        media: "https://i.ibb.co/7KJGhQJ/Captura-de-pantalla-2024-06-26-135915.png",
    });

// Flujo de inscripciones
const flowInscripciones = addKeyword(['3', 'Inscripciones', 'inscripciones'])
    .addAnswer('Para conocer mas informacion acerca ' +
    'del proceso de inscripcion te comparto la siguiente imagen☝🏻',{
        delay: 10000 ,    
        media: "https://i.postimg.cc/Jh1BfzrY/408993623-862056865853751-2546998439695152438-n.jpg"
    });


const flowContacto = addKeyword(['5', 'Contacto', 'Contactanos', 'contactanos'])
    .addAnswer('📱 Para contactarnos puedes visitarnos en nuestras redes sociales como: \n*@TecNMRegionS*',{
        delay: 10000,
        media: "https://i.ibb.co/SJyvfr6/imagentec.jpg",
    });


// Flujo para informacion de la institucion
const flowAsesor = addKeyword(['6', 'Asesor', 'asesor'])
    .addAnswer('Para tener una atención personalizada por llamada porfavor comunicarse al: \n☎️ *932-324-0640 ext - 135*', {
            delay: 10000
    });

// Flujos adicionales
// Flujo de bienvenida
const flowBienvenida = addKeyword(['Hola', 'hola', '.', 'buenos dias', 'Buenos dias', 'buenas tardes', 'Buenas tardes', 'buenas noches', 'Buenas noches'])
    .addAnswer(`${getSaludo()}. Hola, soy el chat-bot del ITSS 🤖 Bienvenido al menú principal. Por favor elige una opción:
    \n1. Información sobre nuestras ingenierías
    \n2. Información sobre nuestra institución
    \n3. Proceso de admisión
    \n4. Ubicación
    \n5. Contacto
    \n6. Hablar con un asesor
    \nEscribe el número de la opción deseada.`,{
        delay: 10000
    });

const flowAdios = addKeyword(['Adios', 'adios', 'adiós', 'Adiós', 'Ok', 'ok', 'Gracias', 'gracias'])
    .addAnswer('Hasta luego, que tengas un buen día. #TeamITSS 😎📚');

const mainFlow = createFlow([
    flowInformacionCarreras,
    flowInstitucion,
    flowContacto,
    flowUbicacion,
    flowInscripciones,
    flowAsesor,
    flowAdios,
    flowBienvenida
    
]);

// Función principal para inicializar el bot
const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowInformacionCarreras,
    flowInstitucion,
    flowContacto,
    flowUbicacion,
    flowInscripciones,
    flowAsesor,
    flowAdios,
    flowBienvenida
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