import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RegistroPage } from './registro.page'; 
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';

// Crear un mock de UsuarioService
class MockUsuarioService {
  getUser() {
    return { nombre: "administrador" }; 
  }
}

describe('Página Registro', () => { 
  let component: RegistroPage;
  let fixture: ComponentFixture<RegistroPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistroPage], // 
      imports: [IonicModule.forRoot(), RouterTestingModule],
      providers: [
        { provide: UsuarioService, useClass: MockUsuarioService } 
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA] 
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroPage); 
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('1. Verificar si la página de registro se abre', () => { 
    expect(component).toBeTruthy();
  });
  it('2. Verificar que el campo "RUT" está presente', () => {
    const rutField: HTMLElement = fixture.debugElement.nativeElement.querySelector('ion-input[formControlName="rut"]');
    expect(rutField).toBeTruthy();
  });

  it('3. Verificar que el campo "Usuario" está presente', () => {
    const usuarioField: HTMLElement = fixture.debugElement.nativeElement.querySelector('ion-input[formControlName="usuario"]');
    expect(usuarioField).toBeTruthy();
  });

  it('4. Verificar que el campo "Email" está presente', () => {
    const emailField: HTMLElement = fixture.debugElement.nativeElement.querySelector('ion-input[formControlName="email"]');
    expect(emailField).toBeTruthy();
  });

  it('5. Verificar que el campo "Contraseña" está presente', () => {
    const passwordField: HTMLElement = fixture.debugElement.nativeElement.querySelector('ion-input[formControlName="contrasena"]');
    expect(passwordField).toBeTruthy();
  });

  it('6. Verificar que el campo "Repetir contraseña" está presente', () => {
    const confirmPasswordField: HTMLElement = fixture.debugElement.nativeElement.querySelector('ion-input[formControlName="contrasena_conf"]');
    expect(confirmPasswordField).toBeTruthy();
  });

  it('7. Verificar que el campo "Fecha de nacimiento" está presente', () => {
    const dobField: HTMLElement = fixture.debugElement.nativeElement.querySelector('ion-input[formControlName="fecha_nacimiento"]');
    expect(dobField).toBeTruthy();
  });

  it('8. Verificar que el checkbox "¿Tiene vehículo?" está presente', () => {
    const vehicleCheckbox: HTMLElement = fixture.debugElement.nativeElement.querySelector('ion-checkbox[formControlName="tieneVehiculo"]');
    expect(vehicleCheckbox).toBeTruthy();
  });

  it('9. Verificar que el botón "REGISTRAR" está presente cuando no se tiene vehículo', () => {
    component.personaForm.get('tieneVehiculo')?.setValue(false);
    fixture.detectChanges();

    const registerButton: HTMLElement = fixture.debugElement.nativeElement.querySelector('ion-button[type="submit"]');
    expect(registerButton).toBeTruthy();
  });

  it('10. Verificar que el botón "REGISTRAR CON VEHÍCULO" está presente cuando se tiene vehículo', () => {
    component.personaForm.get('tieneVehiculo')?.setValue(true);
    fixture.detectChanges();

    const registerWithVehicleButton: HTMLElement = fixture.debugElement.nativeElement.querySelector('ion-button[type="submit"]');
    expect(registerWithVehicleButton).toBeTruthy();
  });

  it('11. Verificar que el campo "Patente" aparece cuando "¿Tiene vehículo?" está marcado', () => {
    component.personaForm.get('tieneVehiculo')?.setValue(true);
    fixture.detectChanges();

    const patenteField: HTMLElement = fixture.debugElement.nativeElement.querySelector('ion-input[formControlName="patente"]');
    expect(patenteField).toBeTruthy();
  });

  it('12. Verificar que el campo "Marca del auto" aparece cuando "¿Tiene vehículo?" está marcado', () => {
    component.personaForm.get('tieneVehiculo')?.setValue(true);
    fixture.detectChanges();

    const marcaField: HTMLElement = fixture.debugElement.nativeElement.querySelector('ion-input[formControlName="marca"]');
    expect(marcaField).toBeTruthy();
  });

  it('13. Verificar que el campo "Modelo del auto" aparece cuando "¿Tiene vehículo?" está marcado', () => {
    component.personaForm.get('tieneVehiculo')?.setValue(true);
    fixture.detectChanges();

    const modeloField: HTMLElement = fixture.debugElement.nativeElement.querySelector('ion-input[formControlName="modelo"]');
    expect(modeloField).toBeTruthy();
  });

  it('14. Verificar que el campo "Color del auto" aparece cuando "¿Tiene vehículo?" está marcado', () => {
    component.personaForm.get('tieneVehiculo')?.setValue(true);
    fixture.detectChanges();

    const colorField: HTMLElement = fixture.debugElement.nativeElement.querySelector('ion-input[formControlName="color"]');
    expect(colorField).toBeTruthy();
  });

  it('15. Verificar que el campo "Capacidad (plazas)" aparece cuando "¿Tiene vehículo?" está marcado', () => {
    component.personaForm.get('tieneVehiculo')?.setValue(true);
    fixture.detectChanges();

    const plazasField: HTMLElement = fixture.debugElement.nativeElement.querySelector('ion-select[formControlName="plazas"]');
    expect(plazasField).toBeTruthy();
  });

  it('16. Verificar que el botón "Aceptar" cambia a "Aceptado" cuando se marca la política', () => {
    const aceptarButton: HTMLElement = fixture.debugElement.nativeElement.querySelector('ion-button');
    component.personaForm.get('aceptarPoliticas')?.setValue(true);
    fixture.detectChanges();

    expect(aceptarButton.textContent).toContain('Aceptado');
  });
});
