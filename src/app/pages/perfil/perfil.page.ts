import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { AlertController,NavController  } from '@ionic/angular';
import { Usuario } from 'src/app/models/Usuario';
import { Vehiculo } from 'src/app/models/Vehiculo';
import { UsuarioService } from 'src/app/services/usuario.service';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  usuario: Usuario | null = null; // Inicialmente nulo
  public mensajeBienuti:String | undefined;

  rut:string="";


  editar:boolean=false;

  personaForm =new FormGroup({
    fecha_nacimiento: new FormControl( '', [Validators.required, edadValidacion(18)]),
    rut: new FormControl('',[Validators.required,Validators.pattern("[0-9]{7,8}-[0-9kK]{1}")]),
    usuario:new FormControl( '', [Validators.required, Validators.minLength(3)]),
    contrasena:new FormControl( '', [Validators.required, Validators.pattern("^(?=.*[-!#$%&/()?¡_.])(?=.*[A-Za-z])(?=.*[a-z]).{8,}$")]),
    contrasena_conf:new FormControl( '', [Validators.required,Validators.pattern("^(?=.*[-!#$%&/()?¡_.])(?=.*[A-Za-z])(?=.*[a-z]).{8,}$")]),
    email: new FormControl('', [Validators.required,Validators.email, Validators.pattern("[a-zA-Z0-9.]+(@duocuc.cl)")]),
    patente:new FormControl('', [Validators.pattern(/^[A-Z]{2} \d{2} [A-Z]{2}$/)]),  
    marca: new FormControl('',[]),
    modelo:new FormControl('', []),
    color:new FormControl('', []),
    tieneVehiculo: new FormControl(false),
    plazas:new FormControl( '', [])

  }, { validators: passwordMatchValidator() }); 

    /*personaForm =new FormGroup({
      fecha_nacimiento: new FormControl( '', [Validators.required, edadValidacion(18)]),
      rut: new FormControl('',[]),
      usuario:new FormControl( '', [Validators.required]),
      contrasena:new FormControl( '', [Validators.required]),
      contrasena_conf:new FormControl( '', [Validators.required]),
      email: new FormControl('', [Validators.required,Validators.email]),
      patente:new FormControl('', []),
      marca: new FormControl('',[]),
      modelo:new FormControl('', []),
      color:new FormControl('', []),
      tieneVehiculo: new FormControl(false),
      plazas:new FormControl( '', [])

    }, { validators: passwordMatchValidator() }); */


  usuarios:Usuario[] = [];


  constructor(private usuarioService: UsuarioService,
              private alertController: AlertController,
              private navController: NavController 
  ) { }

  
  async ngOnInit() {
    const rutCokie = localStorage.getItem('idUsuario');
    if (rutCokie) {
      this.rut = rutCokie; 
      const datosUsuario = await this.usuarioService.getUsuario(rutCokie);
      
      if (datosUsuario) {
        this.usuario = datosUsuario; 
        this.buscar();
      } else {
        console.log('Usuario no encontrado');
      }
   
    }

  }

  
  logout() {
    localStorage.removeItem('rol');
    localStorage.removeItem('idUsuario');
    this.navController.navigateRoot('/login'); // Navegación al login
  }

  toggleFormulario() {
    const mostrarFormulario = this.personaForm.get('tieneVehiculo')?.value;

    if (mostrarFormulario) {
      this.personaForm.get('patente')?.setValidators([Validators.required,Validators.pattern(/^[A-Z]{2} \d{2} [A-Z]{2}$/)]);
      this.personaForm.get('marca')?.setValidators([Validators.required]);
      this.personaForm.get('modelo')?.setValidators([Validators.required]);
      this.personaForm.get('color')?.setValidators([Validators.required]);
    } else{
      this.personaForm.get('patente')?.clearValidators();
      this.personaForm.get('marca')?.clearValidators();
      this.personaForm.get('modelo')?.clearValidators();
      this.personaForm.get('color')?.clearValidators();
    }

    this.personaForm.get('patente')?.updateValueAndValidity();
    this.personaForm.get('marca')?.updateValueAndValidity();
    this.personaForm.get('modelo')?.updateValueAndValidity();
    this.personaForm.get('color')?.updateValueAndValidity();
  }

  async modificar(){
    var rut_buscar: string = this.personaForm.controls.rut.value || "";
    console.log(this.personaForm.valid);

    if (this.personaForm.valid) {


      const nuevoUsuario = new Usuario(
        this.personaForm.value.fecha_nacimiento ?? '',
        this.personaForm.value.rut ?? '',
        'Usuario', // tipo_usuario
        this.personaForm.value.usuario ?? '',
        this.personaForm.value.contrasena ?? '',
        this.personaForm.value.contrasena_conf ?? '',
        this.personaForm.value.email ?? ''
      );

      var tieneVehiculo = this.personaForm.get('tieneVehiculo')?.value;const mostrarFormulario = this.personaForm.get('tieneVehiculo')?.value;
      
      if(tieneVehiculo){
        const vehiculo =  new Vehiculo(
          this.personaForm.value.patente ?? '',
          this.personaForm.value.marca ?? '',
          this.personaForm.value.modelo ?? '',
          this.personaForm.value.color ?? '',
          Number(this.personaForm.value.plazas??'0'),
          this.personaForm.value.rut??''
        );
        if(vehiculo){
          nuevoUsuario.setVehiculo(vehiculo);
        }
      }

    if(await this.usuarioService.updateUsuario( rut_buscar , nuevoUsuario)){
      this.editar=false;
      this.showAlert("USUARIO MODIFICADO CON ÉXITO!")
    }

    }else{
      this.showAlert("ERROR! USUARIO NO MODIFICADO!")
    }
  }

  async buscar(){
    
    //this.personaForm.setValue(await this.usuarioService.getUsuario(rut_buscar) );
    //this.cargarUsuario(await this.usuarioService.getUsuario(rut_buscar));
    //const usuario=await this.usuarioService.getUsuario(rut_buscar);
    
    if(this.usuario){
      this.cargarUsuario(this.usuario);
      this.editar=true;
    }
  }

  public cargarUsuario(usuario: Usuario): void {

    this.personaForm.patchValue({
      fecha_nacimiento: usuario.getFechaNacimiento(),
      rut: usuario.getRut(),
      usuario: usuario.getUsuario(),
      contrasena: usuario.getContrasena(),
      contrasena_conf: usuario.getContrasena(),
      email: usuario.getEmail()
    });

    if(usuario.tieneVehiculo()){

      this.personaForm.get('tieneVehiculo')?.setValue(true);

      this.personaForm.patchValue({
        fecha_nacimiento: usuario.getFechaNacimiento(),
        rut: usuario.getRut(),
        usuario: usuario.getUsuario(),
        contrasena: usuario.getContrasena(),
        contrasena_conf: usuario.getContrasena(),
        email: usuario.getEmail(),
        patente: usuario.getVehiculo()?.patente,
        marca: usuario.getVehiculo()?.marca,
        modelo: usuario.getVehiculo()?.modelo,
        color: usuario.getVehiculo()?.color
      });
    };
  }

  async showAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Alerta',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  

}


export function passwordMatchValidator(): ValidatorFn {
  return (formGroup: AbstractControl): { [key: string]: boolean } | null => {
    const password = formGroup.get('contrasena');
    const confirmPassword = formGroup.get('contrasena_conf');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { 'passwordMismatch': true };
    }
    return null;
  };
  }

  export function edadValidacion(edadMinima: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const birthDate = new Date(control.value);
      if (!birthDate.getTime()) {
        return null; // Si no es una fecha válida
      }
      
      const age = new Date().getFullYear() - birthDate.getFullYear();
      const monthDifference = new Date().getMonth() - birthDate.getMonth();
      
      // Si no ha cumplido años este año, resta uno
      if (monthDifference < 0 || (monthDifference === 0 && new Date() < birthDate)) {
        return age < edadMinima ? { 'edadInvalida': true } : null;
      }
  
      return age < edadMinima ? { 'edadInvalida': true } : null;
    };
    
}
