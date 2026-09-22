import { IUniversidadRepository } from "../interfaces/universidad.interface";
import { CrearUsuarioDTO,CrearMateriaDTO,AsignarProfesorDTO,AsignarAlumnoDTO } from "../dtos/universidad.dto";

export class PostgresUniversidadRepository implements IUniversidadRepository{
    constructor(){
        const host = process.env.DB_HOST;
        const puerto = process.env.DB_PORT;
        const baseDatos = process.env.DB_NAME;
        const usuario = process.env.DB_USER;

        console.log('\n POSTGRES REAL:  INCIANDO CONEXIÓN...');
        console.log(`   -> Servidor de Datos: ${host}:${puerto}`);
        console.log(`   -> Database Name: ${baseDatos}`);
        console.log(`   -> User: ${usuario}`);
    }

    guardarAlumno(dto: CrearUsuarioDTO): number {
        const idGenerado = Math.floor(Math.random()*1000)+1;
        return idGenerado;
    }
    guardarProfesor(dto: CrearUsuarioDTO): number {
        const idGenerado = Math.floor(Math.random()*1000)+1;
        return idGenerado;
    }
    guardarMateria(dto: CrearMateriaDTO): number {
        const idGenerado = Math.floor(Math.random()*1000)+1;
        return idGenerado;
    }
    guardarAsignacionProfesor(dto: AsignarProfesorDTO): void {
        console.log('Profesor asignado');
    }
    guardarAsignacionAlumno(dto: AsignarAlumnoDTO): void {
        console.log('Alumno Asignado');
    }
    imprimirEstadoBaseDatos(): void {
        console.log('Base de datos impresa');
    }
}