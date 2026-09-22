import * as fs from 'fs';
import * as path from 'path'
import { IUniversidadRepository } from '../interfaces/universidad.interface';
import {CrearMateriaDTO,CrearUsuarioDTO,AsignarAlumnoDTO,AsignarProfesorDTO} from '../dtos//universidad.dto';


export class JsonFileUniversidadRepository implements IUniversidadRepository{
    private rutaDB:string;

    constructor(){
        // Apuntar directo al archivo de persistencia física en disco
        this.rutaDB = path.join(__dirname,'../../db-json/001_db.json');
        console.log('[JSON DB]: Inicializando almacenamiento físico en: 001_db.json');
    }
    // Función auxiliar privada oara guardar cambios en el archivo 001_db.json
    private guardarArchivoCompleto(datos:any):void{
        fs.writeFileSync(this.rutaDB,JSON.stringify(datos,null,2),'utf-8');
    }
    private leerArchivoCompleto():any{
        const contenidoText = fs.readFileSync(this.rutaDB,'utf-8');
        return JSON.parse(contenidoText);
    }

    public guardarAlumno(dto: CrearUsuarioDTO): number {
        const db = this.leerArchivoCompleto();
        const nuevoId = db.alumnos.length +1;

        db.alumnos.push({id:nuevoId,nombre:dto.nombre,email:dto.email});
        this.guardarArchivoCompleto(db);
        const alumnoEncontrado = db.alumnos.find((alumno:any) => alumno.id === nuevoId);
        console.log(`[JSON DB]: Alumno: ${alumnoEncontrado?.nombre}`);
        return nuevoId;
    }
    public guardarProfesor(dto: CrearUsuarioDTO): number {
        const db = this.leerArchivoCompleto();
        const nuevoId = db.profesores.length +1;

        db.profesores.push({id:nuevoId,nombre:dto.nombre,email:dto.email});
        this.guardarArchivoCompleto(db);

        const profesorEncontrado = db.profesores.find((profesor:any) => profesor.id === nuevoId);
        console.log(`Nuevo profesor insertado: ${profesorEncontrado?.nombre}`);
        return nuevoId;
    }
    public guardarMateria(dto: CrearMateriaDTO): number {
        const db = this.leerArchivoCompleto();
        const nuevoId = db.materias.length +1;
        db.materias.push({id:nuevoId,materia:dto.nombreMateria});
        const materiafound = db.materias.find((materia:any)=>materia.id === nuevoId);
        console.log(`Materia insertada: ${materiafound?.materia}`);
        this.guardarArchivoCompleto(db);
        return nuevoId;
    }
    public guardarAsignacionAlumno(dto: AsignarAlumnoDTO): void {
        const db = this.leerArchivoCompleto();
        const existAsignacion = db.asignacionesAlumno.some((asignacion:any) =>
            asignacion.alumnoId === dto.alumnoId &&
            asignacion.materiaId === dto.materiaId
        );

        if(existAsignacion) {
            throw new Error(`[RECHAZADO]: Alumno con ID ${dto.alumnoId} ya está asignado a la materia con ID: ${dto.materiaId}`);
        }
        const nuevoId = db.asignacionesAlumno.length + 1;
        db.asignacionesAlumno.push({id:nuevoId,alumnoId:dto.alumnoId,materiaId:dto.materiaId});
        this.guardarArchivoCompleto(db);
    }
    public guardarAsignacionProfesor(dto: AsignarProfesorDTO): void {
        const db = this.leerArchivoCompleto();
        const existeAsignacion = db.asignacionesProfesor.some((asignacion:any) =>
            asignacion.profesorId === dto.profesorId &&
            asignacion.materiaId === dto.materiaId
        );
        if(existeAsignacion){
            throw new Error(`[RECHAZADO]: El profesor con ID:${dto.profesorId} tiene asignado la materia con ID:${dto.materiaId}`);
        }
        const nuevoId = db.asignacionesProfesor.length + 1;
        db.asignacionesProfesor.push({id:nuevoId,profesorId:dto.profesorId,materiaId:dto.materiaId});
        this.guardarArchivoCompleto(db);
    }
    public imprimirEstadoBaseDatos(): void {
        console.log('[JSON DB]: Sincronización de archivo exitosa');
    }

}