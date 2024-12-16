import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Usuario } from 'src/app/models/Usuario';
import { Vehiculo } from 'src/app/models/Vehiculo';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  mostrarFormulario=false;

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
    aceptarPoliticas: new FormControl(false, Validators.requiredTrue)

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
    plazas:new FormControl( '', []),
    aceptarPoliticas: new FormControl(false, Validators.requiredTrue)

  }, { validators: passwordMatchValidator() }); */



  public alertButtons = [
    {
      text: 'Cancel',
      role: 'cancel',
      handler: () => {
        console.log('Alert canceled');
      },
    },
    {
      text: 'OK',
      role: 'confirm',
      handler: () => {
        console.log('Alert confirmed');
      },
    },
  ];

  usuarios:any[] = [];

  constructor(private fb: FormBuilder, private router: Router,private alertController: AlertController,private usuarioService: UsuarioService) {
    //this.personaForm.get("rut")?.setValidators([Validators.required,Validators.pattern("[0-9]{7,8}-[0-9kK]{1}"),this.validarRut()]);
  
  }
  
  ngOnInit() {
    //this.usuarios = this.usuarioService.getUsuarios();
  }

  toggleFormulario() {
    const mostrarFormulario = this.personaForm.get('tieneVehiculo')?.value;

    if (mostrarFormulario) {
      this.personaForm.get('patente')?.setValidators([Validators.required,Validators.pattern(/^[A-Z]{2} \d{2} [A-Z]{2}$/)]);
      this.personaForm.get('patente')?.setValidators([Validators.required]);
      this.personaForm.get('marca')?.setValidators([Validators.required,Validators.minLength(3)]);
      this.personaForm.get('modelo')?.setValidators([Validators.required,Validators.minLength(3)]);
      this.personaForm.get('color')?.setValidators([Validators.required,Validators.minLength(3)]);
      this.personaForm.get('plazas')?.setValidators([Validators.required]);
    } else {
      this.personaForm.get('patente')?.clearValidators();
      this.personaForm.get('marca')?.clearValidators();
      this.personaForm.get('modelo')?.clearValidators();
      this.personaForm.get('color')?.clearValidators();
      this.personaForm.get('plazas')?.clearValidators();
    }

    this.personaForm.get('patente')?.updateValueAndValidity();
    this.personaForm.get('marca')?.updateValueAndValidity();
    this.personaForm.get('modelo')?.updateValueAndValidity();
    this.personaForm.get('color')?.updateValueAndValidity();
    this.personaForm.get('plazas')?.updateValueAndValidity();
  }

  async registrar(): Promise<void> {
   var mostrarFormulario = this.personaForm.get('tieneVehiculo')?.value;
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

      if(mostrarFormulario){
        const vehiculo =  new Vehiculo(
          this.personaForm.value.patente ?? '',
          this.personaForm.value.marca ?? '',
          this.personaForm.value.modelo ?? '',
          this.personaForm.value.color ?? '',
          5,
          this.personaForm.value.rut??''
        );
        if(vehiculo){
          nuevoUsuario.setVehiculo(vehiculo);
        }
      }

      //this.usuarioService.createUsuario(this.personaForm.value);
      const result = await this.usuarioService.createUsuario(nuevoUsuario);

      if (result) {
        this.showAlert("Registro Exitoso");
        this.personaForm.reset();
        this.router.navigate(['/login']);
      } else {
        this.showAlert("Correo o rut existente");
      }
    } else {
      console.log('Formulario no válido');
    }
  }

  setResult(ev: any) {
    console.log(`Dismissed with role: ${ev.detail.role}`);
  }

  async showAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Mensaje',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  toggleAceptarPoliticas() {
    const currentValue = this.personaForm.get('aceptarPoliticas')?.value;
    this.personaForm.get('aceptarPoliticas')?.setValue(!currentValue);
  }
  

  async mostrarPoliticas() {
    const alert = await this.alertController.create({
      header: 'Políticas de Uso',
      message: `
        <p>Al utilizar esta aplicación, aceptas las siguientes políticas:</p>
        <ul>
          <li>Los Datos de edicicion del viaje permitidos son coste, hora de salida y capacidad.</li>
          <li>No podra cambiar su correo ni rut una vez registrado.</li>
          <li>Debe ser conciente que el creador de un viaje puede eliminar un viaje, sin previo aviso aun si este esta pendiente.</li>
          <li>DuocUc no se hace cargo de hurto ni de  ningun daño material, ocasionado durante el trayecto del viaje.</li>
          <li>Nos reservamos el derecho de modificar estas políticas en cualquier momento.</li>
          <li>Para más información, por favor consulta nuestras políticas de privacidad.</li>
        </ul>
      `,
      buttons: ['Aceptar']
    });
  
    await alert.present();
  }
  

  validarRut():ValidatorFn{
    return () => {
      const rut = this.personaForm.controls.rut.value;
      const dv_validar = rut?.replace("-","").split("").splice(-1).reverse()[0];
      let rut_limpio = [];
      if(rut?.length==10){
        rut_limpio = rut?.replace("-","").split("").splice(0,8).reverse();
      }else{
        rut_limpio = rut?.replace("-","").split("").splice(0,7).reverse() || [];
      }
      let factor = 2;
      let total = 0;
      for(let num of rut_limpio){
        total = total + ((+num)*factor);
        factor = factor + 1;
        if(factor==8){
          factor = 2;
        }
      }
      var dv = (11-(total%11)).toString();
      if(+dv>=10){
        dv = "k";
      }
      if(dv_validar!=dv.toString()) return {isValid: false};
      return null;
    };
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
