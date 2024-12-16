import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { HomePage } from './home.page';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';

// Crear un mock de UsuarioService
class MockUsuarioService {
  getUser() {
    return { nombre: "administrador" }; // Ejemplo de un usuario ficticio
  }
}

describe('Página Home', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomePage],
      imports: [IonicModule.forRoot(), RouterTestingModule],
      providers: [
        { provide: UsuarioService, useClass: MockUsuarioService } // Usar el mock del servicio
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA] // Esto evita los errores de los componentes de Ion
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('1. Verificar si la página se abre', () => {
    expect(component).toBeTruthy();
  });

  it('2. Verificar que el tab "Inicio" está presente', () => {
    const inicioTab: HTMLElement = fixture.debugElement.nativeElement.querySelector('ion-tab-button[tab="inicio"]');
    expect(inicioTab).toBeTruthy();
  });

  it('3. Verificar que el tab "Viajes" está presente', () => {
    const viajesTab: HTMLElement = fixture.debugElement.nativeElement.querySelector('ion-tab-button[tab="viajes"]');
    expect(viajesTab).toBeTruthy();
  });

  it('4. Verificar que el tab "Perfil" está presente', () => {
    const perfilTab: HTMLElement = fixture.debugElement.nativeElement.querySelector('ion-tab-button[tab="perfil"]');
    expect(perfilTab).toBeTruthy();
  });

  it('5. Simular cambio de tab a "Viajes"', () => {
    const viajesTab: HTMLElement = fixture.debugElement.nativeElement.querySelector('ion-tab-button[tab="viajes"]');
    viajesTab.click(); 
    fixture.detectChanges();

    const content = fixture.debugElement.nativeElement.querySelector('ion-content');
    expect(content).toBeTruthy(); 
  });

  it('6. Simular cambio de tab a "Perfil"', () => {
    const perfilTab: HTMLElement = fixture.debugElement.nativeElement.querySelector('ion-tab-button[tab="perfil"]');
    perfilTab.click(); 
    fixture.detectChanges(); 

    const content = fixture.debugElement.nativeElement.querySelector('ion-content');
    expect(content).toBeTruthy(); 
  });
});
