import {Router,Request, Response} from 'express';
import { UniversidadService } from '../services/universidad.service';
import { CrearUsuarioDTO, CrearMateriaDTO } from '../dtos/universidad.dto';

export class UniversidadController {
    private service: UniversidadService;
    private router:Router;

    constructor(servicioInyectado: UniversidadService) {
        this.service = servicioInyectado;
        this.router = Router();

        // Inicializamos las rutas del endpoint en el momento en que nace el controlador
        this.configurarRutas();
    }

    private configurarRutas():void{
        //El endpoint ahora vive aquí
        // Vinculamos la ruta HTTP directamente con la lógica que procesa la petición
        this.router.post('/registro-completo',this.registrarCicloEscolarCompleto.bind(this));
    };

    public registrarCicloEscolarCompleto(req:Request,res:Response): void {
        console.log("[Controller] 📥 POST request interceptado desde Postman.");
        try {
            // 1. Extraemos los datos del JSON enviado por Postman
            const {nomAlumno,mailAlumno,nomProfesor,mailProfesor,materia} = req.body;

            // 1.1 Validación de entrada: si falta algún campo, es un error del cliente (400)
            if(!nomAlumno || !mailAlumno || !nomProfesor || !mailProfesor || !materia){
                res.status(400).json({
                     status:"error"
                    ,message:"Faltan campos obligatorios: nomAlumno, mailAlumno, nomProfesor, mailProfesor, materia."
                });
                return;
            }

            // 2. Empaquetamos en los DTOs oficiales usando los datos extraídos
            const alumnoDto = new CrearUsuarioDTO(nomAlumno, mailAlumno);
            const profesorDto = new CrearUsuarioDTO(nomProfesor, mailProfesor);
            const materiaDto = new CrearMateriaDTO(materia);
            // 3. Enviamos los DTOs al servicio
            this.service.ejecutarFlujoCompletoUniversidad(alumnoDto, profesorDto, materiaDto);
            // 4. Respondemos exitosamente a Postman
            res.status(201).json({
                 status:"success"
                ,message:"Información procesada"
                ,bdy:req.body
            });
        } catch (error:any){
            // Errores de negocio (validaciones del repositorio) => 400.
            // Cualquier otro error inesperado => 500. Siempre respondemos JSON.
            const mensaje = error?.message ?? "Error desconocido";
            const esErrorDeNegocio = mensaje.includes("[RECHAZADO]") || mensaje.includes("[MOCK");
            const codigo = esErrorDeNegocio ? 400 : 500;

            console.error(`[Controller] ❌ Error (${codigo}): ${mensaje}`);
            res.status(codigo).json({
                 status:"error"
                ,message:mensaje
                ,body:req.body
            });
        }
    }
    public obtenerRouter():Router{
        return this.router;
    }
}
