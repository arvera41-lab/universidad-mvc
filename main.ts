import * as dotenv from 'dotenv';
import express from 'express'
import { IUniversidadRepository } from './src/interfaces/universidad.interface';
import { MockUniversidadRepository } from './src/repositories/mock-universidad.repository';
import { PostgresUniversidadRepository } from './src/repositories/postgres-universidad.repository';
import { UniversidadService } from './src/services/universidad.service';
import { UniversidadController } from './src/controllers/universidad.controller';
import { arch } from 'os';
import { JsonFileUniversidadRepository } from './src/repositories/json-file-universidad.repository';
//  1. Cargamos las variables de configuración del archivo .env a la memoria
dotenv.config();
// 2. Inicializamos nuestra aplicación express (El Servidor Web)
const app = express();
// 3. Middleware obligatorio para que express pueda leer los objetos json del body
app.use(express.json());

// Leer la variable NODE_ENV para identificar como se trabajará
const entorno = process.env.NODE_ENV || 'json-db';
let repo:IUniversidadRepository;

console.log(`Inicializando ServidoR WEB con entorno: ${entorno}`);

switch(entorno){
    case 'test':
            const archivoEscenario = process.env.SCENARIO_FILE || 'exitoso.json';
            repo = new MockUniversidadRepository(archivoEscenario);
        break;
    case 'local':
            repo = new PostgresUniversidadRepository();
        break;
    case 'json-db':
            repo = new JsonFileUniversidadRepository();
        break;
    default:
            throw new Error(`[BOOT ERROR]: Entorno ${entorno} no válido`);  
    }

// Enlazamiento de capa
const servicio = new UniversidadService(repo);
const controlador = new UniversidadController(servicio);

// Obtener ruta
app.use('/api/universidad',controlador.obtenerRouter());

// Conexión global de endpoints
const PORT = process.env.PORT || 3001;

    // 🛡️ Este escudo atrapa errores sueltos en otras capas que Node.js no sabe cómo manejar.
    //     Se registra el detalle y se termina el proceso con código de error explícito,
    //     para no dejar el servidor en un estado inconsistente ni ocultar el fallo.
    process.on('uncaughtException', (err) => {
        console.error(`\n🚨 [EXCEPCIÓN NO ATRAPADA EN EL PROYECTO]: El sistema colapsó debido a un error no manejado.`);
        console.error(`Detalle:`, err.stack);
        process.exit(1);
    });

const server = app.listen(PORT, () => {
    console.log(`Servidor corriendo en:`);
    console.log(`http://localhost:${PORT}`);
    console.log(`Enpoint:`);
    console.log(`POST: http://localhost:${PORT}/api/universidad/registro-completo`);
});

// Los errores de arranque del servidor (ej. puerto ocupado) llegan como EVENTO,
// no como excepción, por eso un try/catch alrededor de app.listen no los atrapa.
server.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`\n💥 [ERROR AL ARRANCAR]: El puerto ${PORT} ya está en uso por otra aplicación.`);
        console.error(`   Cierra la app que ocupa ese puerto o define otro con la variable PORT en el .env`);
        console.error(`   (ej. PORT=3002).`);
    } else {
        console.error(`\n💥 [ERROR CRÍTICO AL ARRANCAR]: El servidor colapsó antes de escuchar el puerto.`);
        console.error(`Detalle técnico:`, err);
    }
    process.exit(1);
});