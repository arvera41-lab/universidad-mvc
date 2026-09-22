
export interface ICrearUsuarioDTO {
    nombre:string;
    email:string;
}
export interface ICrearMateriaDTO {
    nombreMateria:string;
}
export interface IAsignarProfesorDTO{
    profesorId:number;
    materiaId:number;
}
export interface IAsignarAlumnoDTO{
    alumnoId:number;
    materiaId:number;
}