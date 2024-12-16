import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Viaje } from 'src/app/models/Viaje';
import * as L from 'leaflet';
import * as G from 'leaflet-control-geocoder';
import 'leaflet-routing-machine';
import { ViajeService } from 'src/app/services/viaje.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-editar-viaje',
  templateUrl: './editar-viaje.page.html',
  styleUrls: ['./editar-viaje.page.scss'],
})
export class EditarViajePage implements OnInit {

 
  idViaje: number = 0;

  viajes: Viaje[]| undefined;
  private defaultLat: number = -33.608552227594245; 
  private defaultLon: number = -70.58039819211703;
  
  // Variables para almacenar las coordenadas de origen
  private originLat: number | undefined;
  private originLon: number | undefined;

  private latDest:number | undefined;
  private longDest:number | undefined;

  // Variables para gestionar el mapa y el geocodificador
  private map: L.Map | undefined; // Instancia del mapa
  private geocoder: G.Geocoder | undefined; // Instancia del geocodificador
  latitud: number = 0; // Latitud actual
  longitud: number = 0; // Longitud actual
  direccion: string = ""; // Cadena de dirección
  distancia_metros: number = 0; // Distancia en metros
  tiempo_segundos: number = 0; // Tiempo en segundos
  descripcion:String="";
  horaSalida:Date | undefined;
  ultimaHorasalida:Date | undefined;
  ultimoDestino:String="";
  origen: string="";
  destino: string="";
  coste: number=0;
  duracion: number=0;
  capacidad:number=0;
  mapVisible = false;
  viaje:Viaje|undefined;
  private routingControl: L.Routing.Control | undefined;

  constructor(private activatedRoute: ActivatedRoute,private viajeServicee:ViajeService,private alertController: AlertController) { }

  async ngOnInit() {
    //console.log(this.activatedRoute.snapshot.paramMap.get("id"));
    

    this.idViaje = +(this.activatedRoute.snapshot.paramMap.get("id") || "");
    
    var viaje=await this.viajeServicee.getViaje(this.idViaje);


    if(viaje){
      this.inicializarViaje(viaje);
    }
  
    //ahora llamo al servicio de viaje, a un metodo llamado getViaje(this.id)
  }

  /**
   * inicializarViaje
   */
  public inicializarViaje(viaje:Viaje) {

    this.mapVisible = true;
    this.destino=viaje.getDestino();
    this.coste=viaje.getCoste();
    this.ultimaHorasalida=viaje.getHoraSalida();
    this.horaSalida=viaje.getHoraSalida();
    this.capacidad=viaje.getCapacidad();
    this.idViaje=viaje.getIdViaje();
    this.latDest=viaje.getLatDest();
    this.longDest=viaje.getLongDest();
    this.originLat=viaje.getLatOrg();
    this.originLon=viaje.getLongOrg();
    this.distancia_metros=viaje.getDistancia();
    this.tiempo_segundos=viaje.getDuracion();
    this.ultimoDestino=viaje.getDestino();

    this.viaje=viaje;
    if (this.map) {
      this.map.remove();
    }

    this.mapVisible = true; 

    if (this.originLat && this.originLon) {

        this.map = L.map("mapa").locate({ setView: true, maxZoom: 16 });
        
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(this.map);
  
          // Agrega un geocodificador (buscador de direcciones) al mapa
    this.geocoder = G.geocoder({
      placeholder: "Ingrese dirección a buscar",
      errorMessage: "Dirección no encontrada"
    }).addTo(this.map);


    this.geocoder.on('markgeocode', (e) => {
      this.latitud = e.geocode.properties['lat'];
      this.longitud = e.geocode.properties['lon'];
      this.destino = e.geocode.properties['display_name'];

      // Calcular la ruta con las coordenadas nuevas
      if (this.map && this.originLat && this.originLon) {
        this.latDest = this.latitud;
        this.longDest = this.longitud;

        // Eliminar la ruta anterior si existe
        if (this.routingControl) {
          this.map.removeControl(this.routingControl);
        }

        this.routingControl = L.Routing.control({
          waypoints: [
            L.latLng(this.originLat, this.originLon), // Punto de origen
            L.latLng(this.latitud, this.longitud) // Punto de destino
          ],
          fitSelectedRoutes: true,
        }).on('routesfound', (e) => {
          this.distancia_metros = e.routes[0].summary.totalDistance / 1000;
          this.tiempo_segundos = e.routes[0].summary.totalTime / 60;
          this.tiempo_segundos = Math.round(this.tiempo_segundos);
          this.coste = Math.round(1150 * this.distancia_metros * 1.2);
        }).addTo(this.map);
      }
    });
    
  
    this.routingControl = L.Routing.control({
      waypoints: [
        L.latLng(this.originLat, this.originLon),
        L.latLng(this.latDest, this.longDest)
      ],
      fitSelectedRoutes: true,
    }).on('routesfound', (e) => {
      // Puedes hacer algo con la ruta inicial aquí si es necesario
    }).addTo(this.map);

    
    // Configura la capa de teselas para la vista del mapa
  

    }else{
      console.log("no se permite el mapa")
    }
    //this.distancia_metros=viaje.get
  }

  async validarHoraSalida():Promise<Boolean>  {

    const fechaActual = new Date();

    if (this.horaSalida) {
      const horaSalidaDate = new Date(this.horaSalida);
      if (horaSalidaDate <= fechaActual) {
        if(this.horaSalida < fechaActual){
          return false;
        }
        return false; 
      }
      return true; 
    }
    
    return false; 
  
    /*if(this.horaSalida&&this.ultimaHorasalida){
      
       if (this.horaSalida < this.ultimaHorasalida) {
        if(this.horaSalida < fechaActual){
          return false;
        }
        return true;
      }
      return true;
    }return false;*/


  }


  async modificar(idViaje:number){

    const esValido = await this.validarHoraSalida();

    if (!esValido) {
      this.mostrarMensaje("La hora de salida debe ser posterior a la hora actual.");
      return;
    } else if (this.coste < 1) {
      this.mostrarMensaje("El coste no puede ser negativo ni cero.");
      return;
    } else if (this.capacidad < 1) {
      this.mostrarMensaje("Debe tener una capacidad de pasajeros.");
      return;
    }
    if(this.viaje){
      if(this.coste&&this.horaSalida){
        this.viaje.setHoraSalida(this.horaSalida);
        this.viaje.setCoste(this.coste);
        this.viaje.setCapacidad(this.capacidad);
        if(this.destino!=this.ultimoDestino){
          if(this.latDest&&this.longDest&&this.originLat&&this.originLon){
            this.viaje.setDestino(this.destino);
            this.viaje.setLatDest(this.latDest);
            this.viaje.setLongDest(this.longDest);
            this.viaje.setLatOrg(this.originLat);
            this.viaje.setLongOrg(this.originLon);
          }
    
        }

        this.viajeServicee.updateViaje(idViaje,this.viaje);
        this.mostrarMensaje("El Viaje fue modificado con exito");
      }

    }

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
}
