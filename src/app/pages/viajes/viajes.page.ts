import { Component, OnInit } from '@angular/core';
import { Viaje } from 'src/app/models/Viaje';
import { ViajeService } from 'src/app/services/viaje.service';
import * as L from 'leaflet';
import * as G from 'leaflet-control-geocoder';
import 'leaflet-routing-machine';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AlertController, ModalController, Platform } from '@ionic/angular';
import { EstadoViaje } from 'src/app/models/EstadoViaje';
import { Route, Router } from '@angular/router';
import { BarcodeScanningModalComponentV1 } from './barcode-scanning-modal.component';

import {
  Barcode,
  BarcodeFormat,
  BarcodeScanner,
  LensFacing,
} from '@capacitor-mlkit/barcode-scanning';

import { DialogService } from 'src/app/services/dialog/dialog.service';
import { DolarApiService } from 'src/app/services/dolar-api.service';
import { ClimaApiService } from 'src/app/services/clima-api.service';

@Component({
  selector: 'app-viajes',
  templateUrl: './viajes.page.html',
  styleUrls: ['./viajes.page.scss'],
})
export class ViajesPage implements OnInit {

  mostrarListaViajesDisponibles: boolean = true; 
  mostrarListaViajesTomados: boolean = false;
  viajes: Viaje[]| undefined;
  viajesTomados: Viaje[]| undefined;
  viajesCreados: Viaje[]| undefined;

  private originLat: number | undefined;
  private originLon: number | undefined;

  private latDest:number | undefined;
  private longDest:number | undefined;
  mapVisible = false;

  dolar: any; // Variable para almacenar los datos
  clima:any;

  qrText='prueba';
  
  scanResult=''

  isSupported = false;


  public readonly barcodeFormat = BarcodeFormat;
  public readonly lensFacing = LensFacing;
  public barcodes: Barcode[] = [];
  public isPermissionGranted = false;
  //barcodes: Barcode[] = [];

  // Variables para gestionar el mapa y el geocodificador
  private map: L.Map | undefined; // Instancia del mapa
  private geocoder: G.Geocoder | undefined; // Instancia del geocodificador
  constructor(private viajeService:ViajeService,private usuarioService:UsuarioService,private alertController: AlertController,private router: Router
    ,private modalController:ModalController,
    private plataform:Platform,private readonly dialogService: DialogService,
    private dolarSerice:DolarApiService,private climaService:ClimaApiService
  ) {
    
   }


  async scanQRCode(){
    const modal=await this.modalController.create({
      component:BarcodeScanningModalComponentV1,
      cssClass:'barcode-scanning-modal',
      showBackdrop:false,
      componentProps:{
        formats:[],
        LensFacing:LensFacing.Back
      }
    });

    await modal.present();

    const {data}=await modal.onWillDismiss();

    if(data){
      this.scanResult =data?.barcode?.displayValue;

    }
  } 

  /*public async scanQRCode(): Promise<void> {
    //const formats = this.formGroup.get('formats')?.value || [];
    const lensFacing =
    LensFacing.Back;
    const element = await this.dialogService.showModal({
      component: BarcodeScanningModalComponentV1,
      // Set `visibility` to `visible` to show the modal (see `src/theme/variables.scss`)
      cssClass: 'barcode-scanning-modal',
      showBackdrop: false,
      componentProps: {
        formats: [],
        lensFacing: lensFacing,
      },
    });
    element.onDidDismiss().then((result) => {
      const barcode: Barcode | undefined = result.data?.barcode;
      if (barcode) {
        this.barcodes = [barcode];
      }
    });
  }*/


  /*async scan(): Promise<void> {
    const granted = await this.requestPermissions();
    if (!granted) {
      this.presentAlert();
      return;
    }
    const { barcodes } = await BarcodeScanner.scan();
    this.barcodes.push(...barcodes);
  }

  async requestPermissions(): Promise<boolean> {
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera === 'granted' || camera === 'limited';
  }

  async presentAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Permission denied',
      message: 'Please grant camera permission to use the barcode scanner.',
      buttons: ['OK'],
    });
    await alert.present();
  }*/


    /*async startScan() {
      try {
        // Primero, pedir permisos de cámara (esto es opcional en la mayoría de dispositivos Android)
        const hasPermission = await BarcodeScanner.checkPermission({ force: true });
  
        if (!hasPermission.granted) {
          this.scanResult = 'No se concedieron permisos para la cámara.';
          console.log('Permiso de cámara no concedido');
          return;
        }
  
        // Iniciar el escaneo
        const result = await BarcodeScanner.startScan();
  
        if (result.hasContent) {
          // Si se escaneó correctamente, guarda el contenido del QR
          this.scanResult = result.content;
          console.log('Contenido del QR:', result.content);
        } else {
          // Si no se escaneó nada
          this.scanResult = 'No se detectó ningún código QR';
          console.log('No se detectó ningún código QR');
        }
      } catch (error: any) {
        // Manejo de errores
        console.error('Error al escanear:', error.stack);
        this.scanResult = 'Error al intentar escanear el QR. Intenta de nuevo.';
      }
    }
  
    // Función para mostrar la cámara
    async showCamera() {
      await BarcodeScanner.hideBackground();  // Ocultar el fondo para centrarse en la cámara
      this.startScan();  // Iniciar el escaneo
    }
  
    // Función para detener el escaneo y restaurar la UI
    stopScan() {
      BarcodeScanner.stopScan();  // Detener el escaneo
    }
  
    // Función para ocultar la cámara
    async hideCamera() {
      await BarcodeScanner.showBackground();  // Mostrar el fondo
      this.stopScan();  // Detener el escaneo
    }*/

 // Función para escanear el código QR
 
 /*async scanQRCode() {
  try {
    // Iniciar el escaneo
    await BarcodeScanner.prepare(); // Prepara la cámara

    // Mostrar la cámara en pantalla
    const result = await BarcodeScanner.startScan(); 

    if (result.hasContent) {
      // Si se escaneó correctamente, mostrar el contenido
      console.log('Código escaneado: ', result.content);
      alert('Código QR escaneado: ' + result.content);
    } else {
      console.log('Escaneo cancelado');
    }

  } catch (error) {
    console.error('Error al escanear el código QR', error);
    alert('Error al escanear el código QR');
  }
}*/

// Cerrar la cámara después del escaneo


  async ngOnInit() {
 
  this.setearViaje();

  const rutCokie = localStorage.getItem('idUsuario');

  /*BarcodeScanner.isSupported().then((result) => {
    this.isSupported = result.supported;
  });*/

  if (rutCokie) {
    this.qrText=rutCokie;
  }

    if(this.plataform.is("capacitor")){
      
      BarcodeScanner.isSupported().then();
      BarcodeScanner.checkPermissions().then();
      BarcodeScanner.removeAllListeners();
    }
    this.fetchData(); // Llamar al método de obtener datos cuando el componente se inicializa

    //this.viajes=(await this.viajeService.getAllViajes()).filter((v)=>v.getCapacidad()>0);
    
    this.map = L.map("mapaVista").locate({ setView: true, maxZoom: 16 });

    // Configura la capa de teselas para la vista del mapa
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);
  }

  fetchData() {
    this.dolarSerice.getData().subscribe(
      (response) => {
        this.dolar = response; // Asigna los datos recibidos
       
      },
      (error) => {
        console.error('Error fetching data:', error); // Manejo de errores
      }
    );

    this.climaService.getData().subscribe(
      (response) => {
        this.clima = response; // Asigna los datos recibidos
       
      },
      (error) => {
        console.error('Error fetching data:', error); // Manejo de errores
      }
    );
  }

  /**
   * setearViaje
   */
  public async setearViaje() {
    const rutCokie = localStorage.getItem('idUsuario');

    if (rutCokie) {
    this.viajes=this.viajesCreados=(await this.viajeService.getAllViajes())
    .filter((viaje)=>viaje.getRutCreador()!=rutCokie
    &&viaje.getCapacidad()>0&&viaje.getEstado()==EstadoViaje.Pendiente);

  
    this.viajesTomados=(await this.viajeService.getAllViajes())
    .filter((viaje)=>{
      var respuesta= viaje.tienePasejo(rutCokie)
      return respuesta;
    });

    
    this.viajesCreados=(await this.viajeService.getAllViajes())
    .filter((viaje)=>viaje.getRutCreador()==rutCokie);

    }



  }



  public formatFechaHora(fecha: Date): string {
    return fecha.toLocaleString('es-ES', {
      weekday: 'long',    // Día de la semana en formato largo (Ej: "lunes")
      year: 'numeric',    // Año en formato numérico
      month: 'long',      // Mes en formato largo (Ej: "noviembre")
      day: 'numeric',     // Día del mes en formato numérico
      hour: '2-digit',    // Hora en formato de 2 dígitos
      minute: '2-digit',  // Minutos en formato de 2 dígitos
    });
  }


  verDetalle(viaje: Viaje) {
    this.latDest = viaje.getLatDest();
    this.longDest = viaje.getLongDest();
    this.originLat = viaje.getLatOrg();
    this.originLon = viaje.getLongOrg();
  
    console.log(`${this.latDest} ${this.longDest} ${this.originLat} ${this.originLon}`);
  
    // Destruir el mapa existente si ya está creado
    if (this.map) {
      this.map.remove(); // Elimina el mapa
      this.map = undefined; // Limpia la referencia
    }
    
  
    // Hacer visible el contenedor del mapa
    this.mapVisible = true;
  
    // Esperar un pequeño retraso para asegurarse de que el contenedor se haya renderizado completamente
    setTimeout(() => {
      if (this.originLat !== undefined && this.originLon !== undefined && this.latDest !== undefined && this.longDest !== undefined) {
        // Crear el nuevo mapa si las coordenadas están definidas
        this.map = L.map('mapaVista').setView([this.originLat, this.originLon], 16);
      
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(this.map);
      
        L.Routing.control({
          waypoints: [
            L.latLng(this.originLat, this.originLon), // Punto de origen
            L.latLng(this.latDest, this.longDest) // Punto de destino
          ],
          fitSelectedRoutes: true // Ajusta el mapa para mostrar la ruta
        }).on('routesfound', (e) => {
          // Manejar eventos de rutas encontradas si es necesario
        }).addTo(this.map);
      } else {
        console.log('Coordenadas no definidas, no se permite el mapa');
      }
      
    }, 100); // Retraso de 100ms para asegurar la renderización del contenedor
  }
  

  async tomarViaje(viaje: Viaje) {

    const rutCokie = localStorage.getItem('idUsuario');
    if (rutCokie) {  
        if(!viaje.tienePasejo(rutCokie)){
          if(viaje.esCapacidadAdecuada(1)){
            viaje.agregarPasajero(rutCokie);
            this.viajeService.updateViaje(viaje.getIdViaje(),viaje);
          }
        }else{
          this.mostrarMensaje("Ya ha tomado este viaje");
        }
      
        this.setearViaje();
    }
    // Aquí podrías agregar lógica para reservar el viaje
  }


  async cambiarEstado(viaje: Viaje) {
    const alert = await this.alertController.create({
      header: 'Confirmar Cambio de Estado',
      message: '¿Qué estado deseas asignar al viaje?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Cambio de estado cancelado');
          },
        },
        {
          text: 'Iniciar',
          handler: async () => {
            viaje.setEstado(EstadoViaje.EnCurso);
            console.log("Cambio de estado a En Curso, pasajeros: " + viaje.getPasajeros());
            await this.viajeService.updateViaje(viaje.getIdViaje(), viaje);
            this.setearViaje();
            this.mostrarMensaje('Viaje Iniciado con éxito.');
          },
        },
        {
          text: 'Completar',
          handler: async () => {
            viaje.setEstado(EstadoViaje.Completado);
            console.log("Cambio de estado a Completado, pasajeros: " + viaje.getPasajeros());
            await this.viajeService.updateViaje(viaje.getIdViaje(), viaje);
            this.setearViaje();
            this.mostrarMensaje('Viaje Completado con éxito.');
          },
        },
        {
          text: 'Cancelar Viaje',
          handler: async () => {
            viaje.setEstado(EstadoViaje.Cancelado);
            console.log("Cambio de estado a Cancelado, pasajeros: " + viaje.getPasajeros());
            await this.viajeService.updateViaje(viaje.getIdViaje(), viaje);
            this.setearViaje();
            this.mostrarMensaje('Viaje Cancelado con éxito.');
          },
        },
      ],
    });
  
    await alert.present();
  }


  async llegarADestino(viaje: Viaje) {
    const alert = await this.alertController.create({
      header: 'Confirmar Llegada',
      message: '¿Estás seguro de que deseas marcar este viaje como completado?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Llegada cancelada');
          },
        },
        {
          text: 'Confirmar',
          handler: async () => {
            // Cambiar el estado del viaje a "Completado"

            const rutCokie = localStorage.getItem('idUsuario');
            if (rutCokie) {  
              viaje.eliminarPasajero(rutCokie);

            }
            //viaje.setEstado(EstadoViaje.Completado);
            //console.log("Cambio de estado a Completado: " + viaje.getPasajeros());
            
            // Actualizar el viaje en la base de datos
            await this.viajeService.updateViaje(viaje.getIdViaje(), viaje);
            
            // Realizar otras acciones necesarias después de completar el viaje
            this.setearViaje();
            
            // Mostrar mensaje de éxito
            this.mostrarMensaje('Viaje completado exitosamente.');
          },
        },
      ],
    });
  
    await alert.present();
  }
  

  
  /**
   * eliminarViaje
viaje:Viaje   */
public async eliminarViaje(viaje: Viaje) {
  const alert = await this.alertController.create({
    header: 'Confirmar Eliminación',
    message: '¿Estás seguro de que deseas eliminar este viaje?',
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
          console.log('Eliminación cancelada');
        },
      },
      {
        text: 'Eliminar',
        handler: async () => {
          await this.viajeService.deleteViaje(viaje.getIdViaje());
          this.setearViaje();
          this.mostrarMensaje('Viaje eliminado con éxito.');
        },
      },
    ],
  });

  await alert.present();
}

  /**
   * bajarseViaje
   */
  public async bajarseViaje(viaje:Viaje) {

    const rutCokie = localStorage.getItem('idUsuario');
    if (rutCokie) {
        viaje?.eliminarPasajero(rutCokie);
      await this.viajeService.updateViaje(viaje.getIdViaje(),viaje);
      this.setearViaje();
    }
  }

  /**
   * editar
   */
  public async editar(viaje:Viaje) {

    const rutCokie = localStorage.getItem('idUsuario');
    if (rutCokie) {
        
      this.router.navigate(['home/editar-viaje/',viaje.getIdViaje()]);//con esto dejamos al usuario en la opcion Inicio del tab

      await this.viajeService.updateViaje(viaje.getIdViaje(),viaje);
      this.setearViaje();
    }
  }

  /**
   * verCreador
   */
  public async verCreador(rut:string) {
    var usuario=await this.usuarioService.getUsuario(rut);

    return usuario?.getUsuario;
  }

  refrescarViajes(){
    this.setearViaje();
  }


  async mostrarMensaje(mensaje:String) {
    const alert = await this.alertController.create({
      animated: true,
      backdropDismiss: true,
      message: mensaje+'',
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel',
        },
      ],
    });
    await alert.present();

  }

  mostrarViajesDisponibles() {
    this.mostrarListaViajesDisponibles = true;
    this.mostrarListaViajesTomados = false;
  }

  mostrarViajesTomados() {
    this.mostrarListaViajesDisponibles = false;
    this.mostrarListaViajesTomados = true;
  }
}
