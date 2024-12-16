import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.page.html',
  styleUrls: ['./reservas.page.scss'],
})
export class ReservasPage implements OnInit {
  viajes: any[] = [];
  comunas = ['La Florida', 'Puente Alto', 'Pirque', 'Otros'];
  filteredViajes: any[] = [];

  constructor(private alertController: AlertController) { } // Asegúrate de inyectar AlertController

  ngOnInit() {
    // Asignamos comunas manualmente a cada viaje
    this.viajes = [
      { nombre: 'Torcazas de Pirque', foto: '../../assets/imgs/Torcazas.jpg', comuna: 'Pirque' },
      { nombre: 'Recorrido por la Viña Concha y Toro', foto: '../../assets/imgs/conchaYtoro.jpg', comuna: 'Puente Alto' },
      { nombre: 'Parque Santa Amalia', foto: '../../assets/imgs/SantaAmalia.jpg', comuna: 'La Florida' },
      { nombre: 'Tobalaba', foto: '../../assets/imgs/Tobalaba.jpg', comuna: 'Puente Alto' },
      { nombre: 'Plaza La Reina', foto: '../../assets/imgs/Plaza.jpeg', comuna: 'Otros' }
    ];
    
    // Inicialmente mostramos todos los viajes
    this.filteredViajes = this.viajes;
  }

  // Función para filtrar los viajes por comuna
  filtrarPorComuna(comuna: any) {
    // Convertimos cualquier valor recibido en una cadena
    const comunaStr = String(comuna);
  
    if (comunaStr === 'all') {
      this.filteredViajes = this.viajes;
    } else {
      this.filteredViajes = this.viajes.filter(viaje => viaje.comuna === comunaStr);
    }
  }

  async tomarViaje(viaje: any) {
    const alert = await this.alertController.create({
      header: 'Viaje reservado',
      message: `Has tomado el viaje: ${viaje.nombre}`,
      buttons: ['OK']
    });
    await alert.present();
  }
}
