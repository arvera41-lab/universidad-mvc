import { IUniversidadRepository } from '../interfaces/universidad.interface';
import { CrearUsuarioDTO, CrearMateriaDTO, AsignarProfesorDTO, AsignarAlumnoDTO } from '../dtos/universidad.dto';

export class UniversidadService {
    private repo: IUniversidadRepository;

    constructor(repositorioInyectado: IUniversidadRepository) {
        this.repo = repositorioInyectado;
    }

    public ejecutarFlujoCompletoUniversidad(
        alumnoData: CrearUsuarioDTO, 
        profesorData: CrearUsuarioDTO, 
        materiaData: CrearMateriaDTO
    ): void {
        console.log("[Servicio] Orquestando la creación e interconexión de entidades...");

        const alumnoId = this.repo.guardarAlumno(alumnoData);
        const profesorId = this.repo.guardarProfesor(profesorData);
        const materiaId = this.repo.guardarMateria(materiaData);

        const dtoProfesorMateria = new AsignarProfesorDTO(profesorId, materiaId);
        this.repo.guardarAsignacionProfesor(dtoProfesorMateria);

        const dtoAlumnoMateria = new AsignarAlumnoDTO(alumnoId, materiaId);
        this.repo.guardarAsignacionAlumno(dtoAlumnoMateria);

        console.log("[Servicio] Flujos procesados. Solicitando reporte final...");
        this.repo.imprimirEstadoBaseDatos();
    }
}
