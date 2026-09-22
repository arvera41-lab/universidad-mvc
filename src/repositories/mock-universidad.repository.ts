import * as fs from 'fs';
import * as path from 'path';
import { IUniversidadRepository } from '../../src/interfaces/universidad.interface';
import { CrearUsuarioDTO, CrearMateriaDTO, AsignarProfesorDTO, AsignarAlumnoDTO } from '../../src/dtos/universidad.dto';

export class MockUniversidadRepository implements IUniversidadRepository {
    private dbAlumnos: string[] = [];
    private dbProfesores: string[] = [];
    private dbMaterias: string[] = [];
    private dbAsignacionesProfesor: string[] = [];
    private dbAsignacionesAlumno: string[] = [];
    private jsonConfig: any;

    constructor(nombreArchivoJson: string) {
        const ruta = path.join(__dirname, '../../test/escenarios', nombreArchivoJson);
        const contenidoText = fs.readFileSync(ruta, 'utf-8');
        this.jsonConfig = JSON.parse(contenidoText);
    }

    public guardarAlumno(dto: CrearUsuarioDTO): number {
        if (this.jsonConfig.simularErrorConexion) {
            throw new Error("[MOCK SANGRIENTO] Error Crítico de Red Simulado desde el JSON.");
        }
        const nuevoId = this.dbAlumnos.length + 1;
        this.dbAlumnos.push(`ID: ${nuevoId} | Alumno: ${dto.nombre} (${dto.email})`);
        return nuevoId;
    }

    public guardarProfesor(dto: CrearUsuarioDTO): number {
        const nuevoId = this.dbProfesores.length + 1;
        this.dbProfesores.push(`ID: ${nuevoId} | Profesor: ${dto.nombre}`);
        return nuevoId;
    }

    public guardarMateria(dto: CrearMateriaDTO): number {
        const nuevoId = this.dbMaterias.length + 1;
        this.dbMaterias.push(`ID: ${nuevoId} | Curso: ${dto.nombreMateria}`);
        return nuevoId;
    }

    public guardarAsignacionProfesor(dto: AsignarProfesorDTO): void {
        this.dbAsignacionesProfesor.push(`ProfID: ${dto.profesorId} assigned to MatID: ${dto.materiaId}`);
    }

    public guardarAsignacionAlumno(dto: AsignarAlumnoDTO): void {
        if (this.jsonConfig.maxAlumnosPorMateria === 0) {
            throw new Error(`[MOCK RECHAZADO] Matrícula cancelada. Límite máximo de alumnos alcanzado (${this.jsonConfig.maxAlumnosPorMateria}).`);
        }
        this.dbAsignacionesAlumno.push(`AlumID: ${dto.alumnoId} enrolled in MatID: ${dto.materiaId}`);
    }

    public imprimirEstadoBaseDatos(): void {
        console.log("\n====== 📊 [MOCK VOLATILE STORE STATUS] ======");
        console.log("Alumnos Guardados:", this.dbAlumnos);
        console.log("Profesores Guardados:", this.dbProfesores);
        console.log("Materias Creadas:", this.dbMaterias);
        console.log("Relaciones Profesor -> Materia:", this.dbAsignacionesProfesor);
        console.log("Relaciones Alumno -> Materia:", this.dbAsignacionesAlumno);
        console.log("=============================================\n");
    }
}
