import { Injectable } from '@angular/core';
import { Viaje } from '../models/Viaje';
import { ViajeRepository } from './ViajeRepository';
import { Storage } from '@ionic/storage-angular';
import { EstadoViaje } from '../models/EstadoViaje';

@Injectable({
  providedIn: 'root'
})
export class ViajeRepositoryImplStorage implements ViajeRepository {
  private viajes: Viaje[] = [];

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    await this.storage.create();
    const viajesRaw: any[] = await this.storage.get('viajes') || [];

 
    const ahora = new Date();
    var ahora2 = new Date();
    ahora.setHours(ahora.getHours() + 1); // Añadir una hora a la fecha actual
    ahora2.setHours(ahora.getHours() + 2); // Añadir una hora a la fecha actual
    
    const viajes = [
        { nombre: "Parque Mahuida", costo: 6000, duracion: 30, capacidad: 4, latDestino: -33.4641, longDestino: -70.5650, rutCreador: "23432139-8", horaSalida: new Date(ahora), distancia: 8 },
        { nombre: "Plaza de Puente Alto", costo: 4000, duracion: 25, capacidad: 4, latDestino: -33.6052, longDestino: -70.5788, rutCreador: "98765432-1", horaSalida: new Date(ahora), distancia: 5 },
        { nombre: "Mall Plaza Vespucio", costo: 7000, duracion: 40, capacidad: 4, latDestino: -33.4660, longDestino: -70.5896, rutCreador: "65432109-8", horaSalida: new Date(ahora), distancia: 10 },
        { nombre: "Cerro San Luis", costo: 8000, duracion: 35, capacidad: 4, latDestino: -33.4932, longDestino: -70.5700, rutCreador: "98765432-1", horaSalida: new Date(ahora2), distancia: 15 },
        { nombre: "Parque O'Higgins", costo: 5000, duracion: 30, capacidad: 4, latDestino: -33.4660, longDestino: -70.6214, rutCreador: "23432139-8", horaSalida: new Date(ahora2), distancia: 7 }
    ];
    
    // Genera un ID único para cada viaje
    let idCounter = 1;
    
    for (const viaje of viajes) {
        const { nombre, costo, duracion, capacidad, latDestino, longDestino, rutCreador, horaSalida, distancia } = viaje;
        
        await this.createViaje(new Viaje(
            nombre,
            costo,
            duracion,
            EstadoViaje.Pendiente,
            capacidad,
            latDestino,
            longDestino,
            -33.59826878740974, // Latitud de origen
            -70.57921390763516, // Longitud de origen
            rutCreador,
            horaSalida,
            idCounter++, // Incrementar el ID único
            distancia // Distancia única
        ));
    }
    

    this.viajes = this.mapToViajes(viajesRaw);
  }

  private mapToViajes(viajesRaw: any[]): Viaje[] {
    var viaje:Viaje;
    return viajesRaw.map(v => {
      const viaje = new Viaje(
          v.destino,
          v.coste,
          v.duracion,
          v.estado,
          v.capacidad,
          v.latDest,
          v.longDest,
          v.latOrg,
          v.longOrg,
          v.rutCreador,
          v.horaSalida,
          v.idViaje,
          v.distancia
      );
      viaje.setPasajeros( v.pasajeros || []) ; 
      return viaje;
  });
  }

  public async createViaje(viaje: Viaje): Promise<boolean> {
    const viajes: Viaje[] = await this.getAllViajes();

    if (viajes.find(v => v.getIdViaje() === viaje.getIdViaje()) !== undefined) {
      return false; // Viaje ya existe
    }

    viajes.push(viaje);
    await this.storage.set('viajes', viajes);
    return true; // Indica que la operación fue exitosa
  }

  public async getViaje(id: number): Promise<Viaje | null> {
    const viajes: Viaje[] = await this.getAllViajes();
    return viajes.find(v => v.getIdViaje() === id) || null;
  }

  public async getAllViajes(): Promise<Viaje[]> {
    const viajesRaw: any[] = await this.storage.get('viajes') || [];
    return this.mapToViajes(viajesRaw);
  }
  public async updateViaje(id: number, viaje: Viaje): Promise<boolean> {

    const viajes: Viaje[] = await this.getAllViajes();
    console.log(viajes);
    const index = viajes.findIndex(v => v.getIdViaje() == id);

    if (index === -1) {
      console.log("viaje no actualizado");
      return false; // Viaje no encontrado
    }

    viajes[index] = viaje;
    console.log("viaje  actualizado");
    await this.storage.set('viajes', viajes);
    return true; // Indica que la operación fue exitosa
  }

  public async deleteViaje(id: number): Promise<boolean> {
    const viajes: Viaje[] = await this.getAllViajes();
    const index = viajes.findIndex(v => v.getIdViaje() === id);

    if (index === -1) {
      return false; // Viaje no encontrado
    }

    viajes.splice(index, 1);
    await this.storage.set('viajes', viajes);
    return true; // Indica que la operación fue exitosa
  }

 

  public async agregarPasajero(rut:string,viaje:Viaje):Promise<void>{

    const viajes: Viaje[] = await this.getAllViajes();
    const index = viajes.findIndex(v => v==viaje);
    viaje.agregarPasajero(rut);    

    viajes[index] = viaje;
    await this.storage.set('viajes', viajes);

  }
}
