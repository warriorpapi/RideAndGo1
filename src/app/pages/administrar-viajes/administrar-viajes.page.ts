import { Component, OnInit } from '@angular/core';
import { EstadoViaje } from 'src/app/models/EstadoViaje';
import { Viaje } from 'src/app/models/Viaje';
import { ViajeService } from 'src/app/services/viaje.service';
import * as L from 'leaflet';
import * as G from 'leaflet-control-geocoder';
import 'leaflet-routing-machine';
import {AlertController, NavController } from '@ionic/angular';
import { Usuario } from 'src/app/models/Usuario';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-administrar-viajes',
  templateUrl: './administrar-viajes.page.html',
  styleUrls: ['./administrar-viajes.page.scss'],
})
export class AdministrarViajesPage implements OnInit {
  
  idViaje: number = 0;

  viajes: Viaje[]| undefined;

  conductores:Usuario[]|undefined;

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
  editarViaje:boolean=false;

  clientes = [
    { nombre: 'Juan Pérez', rut: '12345678-9' },
    { nombre: 'María González', rut: '98765432-1' },
    // Agrega más clientes según sea necesario
  ];

 

  constructor(private viajeService:ViajeService, private navCtrl: NavController,private alertController: AlertController,
    private usuarioService:UsuarioService
  ) { }

  async ngOnInit() {
    this.initMap(); // Inicializa el mapa al cargar el componente
    this.setLocation(); // Establece la ubicación actual del usuario
    this.conductores=(await this.usuarioService.getUsuarios())
    .filter((us)=>us.tieneVehiculo()==true);
    
    this.viajes=(await this.viajeService.getAllViajes());
  }

  volver() {
    this.navCtrl.navigateBack('/home/menu-admin'); 
  }

  async crearViaje() {
    
    const alert = await this.alertController.create({
      header: 'Seleccionar Conductor',
      inputs: this.conductores?.map(conductor => ({
        name: 'conductor',
        type: 'radio', // Usamos radio para que solo se pueda seleccionar uno
        label: `${conductor.getUsuario()} (${conductor.getRut()})`,
        value: conductor.getRut(),
        handler: (value) => {
          console.log('Conductor seleccionado:', value);
        }
      })),
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Selección cancelada');
          }
        },
        {
          text: 'Seleccionar',
          handler: (data) => {
            if (data) {
              this.procederCrearViaje(data);
            } else {
              console.log('No se seleccionó conductor');
            }
          }
        }
      ]
    });

    await alert.present();

  }

  async procederCrearViaje(rut: string) {
 
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

    if(this.latDest && this.longDest && this.originLat && this.originLon && rut &&this.horaSalida)
    {
      var randomInt =
        Math.floor(Math.random() * (2000000 - 1 + 1)) + 1;

      var viaje=new Viaje(this.destino,this.coste,this.tiempo_segundos,EstadoViaje.Pendiente,this.capacidad,this.latDest,this.longDest,this.originLat,this.originLon,rut,this.horaSalida,randomInt,this.distancia_metros);

      console.log('Viaje guardado:', viaje);
      console.log(this.horaSalida);
      
      this.viajeService.createViaje(viaje);
      this.mostrarMensaje('Viaje creado con exito');
      //this.mostrarMensaje('felicidades creaste un viaje '+viaje.toString());
    }
  }
  }

  async actualizarViajes(){
    this.viajes=(await this.viajeService.getAllViajes());
  }

  async actualizarViaje(idViaje: number){

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

        this.viajeService.updateViaje(idViaje,this.viaje);
        this.editarViaje=false;
        this.mostrarMensaje("El Viaje fue modificado con exito");
       
      }

    }

  }
  

  async eliminarViaje(idViaje: number) {
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: '¿Estás seguro de que deseas eliminar este viaje?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Eliminación cancelada');
          }
        },
        {
          text: 'Eliminar',
          handler: async () => {
            const eliminado = await this.viajeService.deleteViaje(idViaje);
            if (eliminado) {
              this.viajes = await this.viajeService.getAllViajes(); 
              this.mostrarMensaje('Viaje eliminado con éxito');
            } else {
              this.mostrarMensaje('Error al eliminar el viaje');
            }
          }
        }
      ]
    });
  
    await alert.present();
  }
  

  async modificar(idViaje:number){

    var viaje= await this.viajeService.getViaje(idViaje);

    if(viaje){
       this.editarViaje=true;
        this.inicializarViaje(viaje);
      //this.viajeService.updateViaje(idViaje,this.viaje)
    }

  }

  
 
  initMap() {
    // Inicializa el mapa con la ubicación predeterminada
    this.map = L.map("mapa").locate({ setView: true, maxZoom: 16 });

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


}
