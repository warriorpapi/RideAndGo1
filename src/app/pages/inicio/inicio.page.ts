import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import * as L from 'leaflet';
import * as G from 'leaflet-control-geocoder';
import 'leaflet-routing-machine';
import { EstadoViaje } from 'src/app/models/EstadoViaje';
import { Viaje } from 'src/app/models/Viaje';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ViajeService } from 'src/app/services/viaje.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
 


  // Coordenadas predeterminadas (latitud y longitud) para centrar el mapa
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
  origen: string="";
  destino: string="";
  coste: number=0;
  duracion: number=0;
  capacidad:number=0;
  private routingControl: L.Routing.Control | undefined;
  




  constructor(private viajeServicio:ViajeService,private alertController: AlertController,private usuarioService:UsuarioService) { }

  ngOnInit() {
    this.initMap(); // Inicializa el mapa al cargar el componente
    this.setLocation(); // Establece la ubicación actual del usuario
  }

  initMap() {
    // Inicializa el mapa con la ubicación predeterminada
    this.map = L.map("map_html").locate({ setView: true, maxZoom: 16 });

    // Configura la capa de teselas para la vista del mapa
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    // Escucha el evento cuando se encuentra la ubicación
    this.map.on('locationfound', (e) => {
      console.log(e.latlng.lat); // Imprime la latitud
      console.log(e.latlng.lng); // Imprime la longitud
      
    });

    // Agrega un geocodificador (buscador de direcciones) al mapa
    this.geocoder = G.geocoder({
      placeholder: "Ingrese dirección a buscar",
      errorMessage: "Dirección no encontrada"
    }).addTo(this.map);

    // Escucha el evento cuando se marca una dirección en el mapa
    this.geocoder.on('markgeocode', (e) => {
      this.latitud = e.geocode.properties['lat']; // Establece la latitud del resultado geocodificado
      this.longitud = e.geocode.properties['lon']; // Establece la longitud del resultado geocodificado
      this.destino = e.geocode.properties['display_name']; // Establece el nombre de la dirección



      // Verifica si el mapa y las coordenadas de origen están definidas antes de calcular la ruta
      if (this.map && this.originLat && this.originLon) {


        if (this.routingControl) {
          this.map.removeControl(this.routingControl);
        }

        this.latDest=this.latitud;
        this.longDest=this.longitud;
        L.Routing.control({
          waypoints: [
            L.latLng(this.originLat, this.originLon), // Punto de origen
            L.latLng(this.latitud, this.longitud) // Punto de destino
          ],
          fitSelectedRoutes: true, // Ajusta el mapa para mostrar la ruta
        }).on('routesfound', (e) => {
          this.distancia_metros = e.routes[0].summary.totalDistance/1000; 
          
          this.tiempo_segundos = e.routes[0].summary.totalTime; // Obtiene el tiempo
          
          this.tiempo_segundos=this.tiempo_segundos/60;

          this.tiempo_segundos=Math.round(this.tiempo_segundos);

           this.coste=1150*this.distancia_metros*1.2;

           this.coste=Math.round(this.coste);

        }).addTo(this.map);
      }
    });
  }

  private setLocation(): void {
    if (navigator.geolocation) {
      // Obtiene la posición actual del usuario
      console.log(navigator.geolocation.getCurrentPosition.toString());
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude; // Latitud actual
          const lon = position.coords.longitude; // Longitud actual
          
          // Establece las coordenadas de origen
          this.originLat = position.coords.latitude;
          this.originLon = position.coords.longitude;

          if (this.map) {
            this.map.setView([lat, lon], 13); // Centra el mapa en la ubicación actual

            // Agrega un marcador en la ubicación actual
            L.marker([lat, lon]).addTo(this.map).bindPopup('Estás aquí').openPopup();
          }
        },
        (error) => {
          console.error('Error al obtener la ubicación:', error);
          // Si falla la obtención de la ubicación, centra el mapa en las coordenadas predeterminadas
          /*if (this.map) {
            this.map.setView([this.defaultLat, this.defaultLon], 13);
          }*/
        }
      );
    } else {
      console.error('La geolocalización no es soportada en este navegador.');
      // Si la geolocalización no es soportada, centra el mapa en las coordenadas predeterminadas
      if (this.map) {
        this.map.setView([this.defaultLat, this.defaultLon], 13);
      }
    }
  }
  

  // Función para obtener la dirección a partir de las coordenadas
private obtenerDireccion(lat: number, lon: number): void {
  /*const geocoder = G.geocoder();

  geocoder.reve([lat, lon], (error, result) => {
    if (error) {
      console.error('Error al obtener la dirección:', error);
      return;
    }

    if (result && result.length > 0) {
      const direccion = result[0].display_name; // Obtiene la dirección en formato de cadena
      console.log('Dirección:', direccion);
      // Aquí puedes almacenar la dirección en una variable o hacer lo que necesites con ella
      this.direccion = direccion; // Suponiendo que tienes una propiedad 'direccion' en tu componente
    } else {
      console.log('No se encontró dirección.');
    }
  });*/
}

  async guardarViaje() {
    /*const viaje = {
      destino: this.destino,
      latitud: this.latitud,
      longitud: this.longitud,
      direccion: this.direccion,
      distancia_metros: this.distancia_metros,
      tiempo_segundos: this.tiempo_segundos
    };*/

  
    var rutCokie = localStorage.getItem('idUsuario');
    if(rutCokie){

      var usuario= await this.usuarioService.getUsuario(rutCokie);
      if(!usuario?.tieneVehiculo()){
         
      this.mostrarMensaje("No tiene vehiculo, no puede crear un viaje");
        return;
      }

    }

    const esValido = await this.validarHoraSalida();
     
    if (!esValido) {
      this.mostrarMensaje("La hora de salida debe ser posterior a la hora actual.");
    } else if (this.coste < 1) {
      this.mostrarMensaje("El coste no puede ser negativo ni cero.");
    } else if (this.capacidad < 1) {
      this.mostrarMensaje("Debe tener una capacidad de pasajeros.");
    } 
    else if(!this.destino){
      this.mostrarMensaje("Ingresar un destino");
    }
    else{

    if(this.latDest && this.longDest && this.originLat && this.originLon && rutCokie &&this.horaSalida)
    {
      var randomInt =
        Math.floor(Math.random() * (2000000 - 1 + 1)) + 1;

      var viaje=new Viaje(this.destino,this.coste,this.tiempo_segundos,EstadoViaje.Pendiente,this.capacidad,this.latDest,this.longDest,this.originLat,this.originLon,rutCokie,this.horaSalida,randomInt,this.distancia_metros);

      console.log('Viaje guardado:', viaje);
      console.log(this.horaSalida);
      
      this.viajeServicio.createViaje(viaje);
      this.mostrarMensaje('Viaje creado con exito');
      //this.mostrarMensaje('felicidades creaste un viaje '+viaje.toString());
    }
  }

  }

  async validarHoraSalida(): Promise<boolean> {
    const fechaActual = new Date();

    if (this.horaSalida) {
      const horaSalidaDate = new Date(this.horaSalida);
      if (horaSalidaDate <= fechaActual) {
        return false; 
      }
      return true; 
    }
    
    return false; 
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
