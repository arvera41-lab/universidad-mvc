import { CrearUsuarioDTO, CrearMateriaDTO,AsignarProfesorDTO,AsignarAlumnoDTO } from "../dtos/universidad.dto";

export interface IUniversidadRepository {
    guardarAlumno(dto:CrearUsuarioDTO):number;
    guardarProfesor(dto:CrearUsuarioDTO):number;
    guardarMateria(dto:CrearMateriaDTO):number;
    guardarAsignacionProfesor(dto:AsignarProfesorDTO):void;
    guardarAsignacionAlumno(dto:AsignarAlumnoDTO):void;
    imprimirEstadoBaseDatos():void;
}