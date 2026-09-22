import { IAsignarAlumnoDTO, IAsignarProfesorDTO, ICrearMateriaDTO } from '../interfaces/dto.interface'

export class CrearUsuarioDTO implements CrearUsuarioDTO{
    public nombre:string;
    public  email:string;

    constructor(nombre:string,email:string){
        this.nombre = nombre;
        this.email = email;
    }
}

export class CrearMateriaDTO implements ICrearMateriaDTO{
    public nombreMateria: string;

    constructor(nombreMateria:string){
        this.nombreMateria = nombreMateria;
    }
}

export class AsignarProfesorDTO implements IAsignarProfesorDTO{
    public profesorId:number;
    public materiaId  :number;
    
    constructor(profesorId:number,materiaId:number){
        this.profesorId = profesorId;
        this.materiaId = materiaId;
    }
}

export class AsignarAlumnoDTO implements IAsignarAlumnoDTO{

    public alumnoId:number;
    public materiaId:number;

    constructor(alumnoId:number,materiaId:number){
        this.alumnoId = alumnoId;
        this.materiaId = materiaId;
    }
}