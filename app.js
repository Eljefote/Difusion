const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot')
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
        media: 'https://i.ibb.co/nCt04VZ/a3.jpg'
    },
    'informática': {
        mensaje: 'Para conocer más detalles acerca de la carrera de Ing. Informática te comparto la siguiente imagen 😎',
        media: 'https://i.ibb.co/nCt04VZ/a3.jpg'
    },
    'Informática': {
        mensaje: 'Para conocer más detalles acerca de la carrera de Ing. Informática te comparto la siguiente imagen 😎',
        media: 'https://i.ibb.co/nCt04VZ/a3.jpg'
    },
    'Informatica': {
        mensaje: 'Para conocer más detalles acerca de la carrera de Ing. Informática te comparto la siguiente imagen 😎',
        media: 'https://i.ibb.co/nCt04VZ/a3.jpg'
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
    'Agronomia': {
        mensaje: 'Para conocer más detalles acerca de la carrera de Ing. En Agronomía te comparto la siguiente imagen 😎',
        media: 'https://i.ibb.co/3prSNNM/Agro.jpg'
    },
    'Agronomía': {
        mensaje: 'Para conocer más detalles acerca de la carrera de Ing. En Agronomía te comparto la siguiente imagen 😎',
        media: 'https://i.ibb.co/3prSNNM/Agro.jpg'
    },

    // Mensaje de industrial
    'industrial': {
        mensaje: 'Para conocer más detalles acerca de la carrera de Ing. Industrial te comparto la siguiente imagen 😎',
        media: 'https://i.ibb.co/CPdWcH0/Industrial.jpg'
    },
    'Industrial': {
        mensaje: 'Para conocer más detalles acerca de la carrera de Ing. Industrial te comparto la siguiente imagen 😎',
        media: 'https://i.ibb.co/CPdWcH0/Industrial.jpg'
    },

    // Mensaje de energías renovables
    'energias renovables': {
        mensaje: 'Para conocer más detalles acerca de la carrera de Ing. en Energías Renovables te comparto la siguiente imagen 😎',
        media: 'https://i.ibb.co/mSB6Ntk/Erenovables.jpg'
    },
    'energías renovables': {
        mensaje: 'Para conocer más detalles acerca de la carrera de Ing. en Energías Renovables te comparto la siguiente imagen 😎 ',
        media: 'https://i.ibb.co/mSB6Ntk/Erenovables.jpg'
    },

    'Energias renovables': {
        mensaje: 'Para conocer más detalles acerca de la carrera de Ing. en Energías Renovables te comparto la siguiente imagen 😎',
        media: 'https://i.ibb.co/mSB6Ntk/Erenovables.jpg'
    },
    'Energías renovables': {
        mensaje: 'Para conocer más detalles acerca de la carrera de Ing. en Energías Renovables te comparto la siguiente imagen  ',
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
    'Bioquimica': {
        mensaje: 'Para conocer más detalles acerca de la carrera en Ing. Bioquímica te comparto la siguiente imagen 😎',
        media: 'https://i.ibb.co/ZXjN1b0/Bioq.jpg'
    },
    'Bioquímica': {
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
    'Electromecanica': {
        mensaje: 'Para conocer más detalles acerca de la carrera de Ing. Electromecánica te comparto la siguiente imagen 😎',
        media: 'https://i.ibb.co/GMp0WgY/Electro.jpg'
    },
    'Electromecánica': {
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
    },
    'Administracion': {
        mensaje: 'Para conocer más detalles acerca de la carrera de Ing. En Administración de Empresas te comparto la siguiente imagen 😎',
        media: 'https://i.ibb.co/S0jRht0/Admin.jpg'
    },
    'Administración': {
        mensaje: 'Para conocer más detalles acerca de la carrera de Ing. En Administración de Empresas te comparto la siguiente imagen 😎',
        media: 'https://i.ibb.co/S0jRht0/Admin.jpg'
    }

};

const flowInformacionCarreras = addKeyword([ '1', 'Informacion', 'Información'])
    .addAnswer('Contamos con 7 carreras:\n*- Administración* \n*- Agronomía* \n*- Bioquímica*\n*- Electromecánica*\n*- Energías renovables*\n*- Industrial* \n*- Informática* \n¿De qué carrera te gustaría información?', {
        delay: 3000 
    })
    .addAnswer('Por favor, escribe el nombre de la carrera.', {
        capture: true,
        // delay: 5000 
    }, async (ctx, { provider }) => {
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
    
const flowInstitucion = addKeyword(['2', 'Institución', 'Institucion'])
    .addAnswer('INFORMACION DEL ITSS', {
        delay: 3000
    });
const flowInscripciones = addKeyword(['3', 'Inscripciones', 'inscripciones'])
    .addAnswer('Para conocer mas información acerca ' +
        'del proceso de inscripción te comparto la siguiente imagen☝🏻', {
        delay: 3000,
        media: "https://i.postimg.cc/Jh1BfzrY/408993623-862056865853751-2546998439695152438-n.jpg"
    });
const flowUbicacion = addKeyword(['4', 'Ubicacion', 'Ubicación'])
    .addAnswer('https://maps.app.goo.gl/uz1Rfp3XVdDrJriB9 \n Nos encontramos ubicados en📍: \nCarret. Teapa-Tacotalpa Km 4.5 Ej. Fco Javier Mina 86801 Teapa, Tabasco, Mexico ', {
        delay: 3000,
        media: "https://i.ibb.co/hRn0KJB/a1.jpg",
    });

const flowContacto = addKeyword(['5', 'Contacto', 'Contactanos', 'contactanos'])
    .addAnswer('📱 Para contactarnos puedes visitarnos en nuestras redes sociales como: \n*@TecNMRegionS*', {
        delay: 3000,
        media: "https://i.ibb.co/SxmM2pw/a2.jpg",
    });

const flowAsesor = addKeyword(['6', 'Asesor', 'asesor'])
    .addAnswer('Para tener una atención personalizada por llamada porfavor comunicarse al: \n☎ 932-324-0640 ext - 135', {
        delay: 3000
    });

const flowBienvenida = addKeyword([ 'Hola', 'hola', '.', 'buenos dias', 'Buenos dias', 'buenas tardes', 'Buenas tardes', 'buenas noches', 'Buenas noches'])
    .addAnswer('Este bot son para preguntas frecuentes e información sobre nuestra institución, si no encuentra la información que necesita dentro del siguiente menu o requiere de ayuda más especifica, por favor comuniquese con un asesor', {
        delay: 3000
    })
    .addAnswer(` Hola, ${getSaludo()}. Soy el chat-bot del ITSS 🤖 Bienvenido al menú principal. Por favor elige una opción:
    \n*1.* Información sobre nuestras ingenierías
    \n*2.* Información sobre nuestra institución
    \n*3.* Proceso de admisión
    \n*4.* Ubicación
    \n*5.* Contacto
    \n*6.* Hablar con un asesor
    \n*Escribe el número de la opción deseada.*`, {
        delay: 3000
    });

const flowAdios = addKeyword(['Adios', 'adios', 'adiós', 'Adiós', 'Gracias', 'gracias'])
    .addAnswer('Hasta luego, que tengas un buen día. #TeamITSS 😎📚', {
        delay: 3000
    });

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
main();