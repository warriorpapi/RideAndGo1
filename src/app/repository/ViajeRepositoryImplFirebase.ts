import { Injectable } from '@angular/core';
import { Viaje } from '../models/Viaje';
import { ViajeRepository } from './ViajeRepository';
import { EstadoViaje } from '../models/EstadoViaje';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ViajeRepositoryImplFirebase implements ViajeRepository {
  constructor(private firestore: AngularFirestore) {}

  // Método de utilidad para convertir un string de estado a un valor del enum
  private mapEstadoViaje(estado: string): EstadoViaje {
    switch (estado) {
      case 'En Curso':
        return EstadoViaje.EnCurso;
      case 'Completado':
        return EstadoViaje.Completado;
      case 'Cancelado':
        return EstadoViaje.Cancelado;
      case 'Pendiente':
        return EstadoViaje.Pendiente;
      default:
        throw new Error(`Estado de viaje no reconocido: ${estado}`);
    }
  }

  // Mapeo genérico de documentos de Firestore a objetos Viaje
  private mapToViaje(data: any): Viaje {
    const estado = this.mapEstadoViaje(data.estado);
  
    // Si 'horaSalida' es un Timestamp de Firebase, lo convertimos a un objeto Date
    let horaSalida: Date;
    if (data.horaSalida && data.horaSalida.toDate) {
      horaSalida = data.horaSalida.toDate(); // Convierte el Timestamp de Firebase a un objeto Date
    } else if (typeof data.horaSalida === 'string') {
      horaSalida = new Date(data.horaSalida); // Si es un string, lo convertimos a Date
    } else {
      horaSalida = data.horaSalida; // Si ya es un Date, lo dejamos tal cual
    }
  
    var viaje = new Viaje(
      data.destino,
      data.coste,
      data.duracion,
      estado,
      data.capacidad,
      data.latDest,
      data.longDest,
      data.latOrg,
      data.longOrg,
      data.rutCreador,
      horaSalida,
      data.idViaje,
      data.distancia
    );
  
    viaje.setPasajeros(data.pasajeros || []);
  
    return viaje;
  }
  

  // Obtener todos los viajes desde Firestore
  public async getAllViajes(): Promise<Viaje[]> {
    try {
      const viajesSnapshot = await this.firestore.collection('viajes').get().toPromise();
      if (!viajesSnapshot?.docs) {
        return []; // Retornar un arreglo vacío si no se encuentran documentos
      }

      // Mapeamos los documentos y los convertimos a objetos Viaje
      var viajes=viajesSnapshot.docs.map(doc => this.mapToViaje(doc.data()));
    
      return viajes;
    } catch (error) {
      console.error("Error al obtener los viajes:", error);
      throw new Error("No se pudieron obtener los viajes.");
    }
  }

  // Obtener un viaje por ID desde Firestore
  public async getViaje(id: number): Promise<Viaje | null> {
    try {
      const viajeRef = this.firestore.collection('viajes').doc(id.toString());
      const doc = await viajeRef.get().toPromise();

      if (!doc?.exists) {
        return null; // Viaje no encontrado
      }

      return this.mapToViaje(doc.data());
    } catch (error) {
      console.error("Error al obtener el viaje:", error);
      throw new Error("No se pudo obtener el viaje.");
    }
  }

  // Crear un viaje en Firestore
  public async createViaje(viaje: Viaje): Promise<boolean> {
    try {
      const viajeRef = this.firestore.collection('viajes').doc(viaje.getIdViaje().toString());
      const snapshot = await viajeRef.get().toPromise();

      if (snapshot?.exists) {
        return false; // Viaje ya existe
      }

      await viajeRef.set(this.mapViajeToFirestore(viaje));
      return true;
    } catch (error) {
      console.error("Error al crear el viaje:", error);
      throw new Error("No se pudo crear el viaje.");
    }
  }

  // Actualizar un viaje en Firestore
  public async updateViaje(id: number, viaje: Viaje): Promise<boolean> {
    try {
      const viajeRef = this.firestore.collection('viajes').doc(id.toString());
      const snapshot = await viajeRef.get().toPromise();


      if (!snapshot?.exists) {
        return false; // Viaje no encontrado
      }

      await viajeRef.update(this.mapViajeToFirestore(viaje));


      return true;
    } catch (error) {
      console.error("Error al actualizar el viaje:", error);
      throw new Error("No se pudo actualizar el viaje.");
    }
  }

  // Eliminar un viaje de Firestore
  public async deleteViaje(id: number): Promise<boolean> {
    try {
      const viajeRef = this.firestore.collection('viajes').doc(id.toString());
      const snapshot = await viajeRef.get().toPromise();

      if (!snapshot?.exists) {
        return false; // Viaje no encontrado
      }

      await viajeRef.delete();
      return true;
    } catch (error) {
      console.error("Error al eliminar el viaje:", error);
      throw new Error("No se pudo eliminar el viaje.");
    }
  }

  // Agregar un pasajero a un viaje
  public async agregarPasajero(rut: string, viaje: Viaje): Promise<void> {
    try {
      const viajeRef = this.firestore.collection('viajes').doc(viaje.getIdViaje().toString());
      await viajeRef.update({
        pasajeros: [...viaje.getPasajeros(), rut]
      });
    } catch (error) {
      console.error("Error al agregar el pasajero:", error);
      throw new Error("No se pudo agregar el pasajero.");
    }
  }

  // Mapeo de un viaje a un formato Firestore para almacenar
  private mapViajeToFirestore(viaje: Viaje): any {
    console.log(viaje);
    return {
      destino: viaje.getDestino(),
      coste: viaje.getCoste(),
      duracion: viaje.getDuracion(),
      estado: viaje.getEstado(),
      capacidad: viaje.getCapacidad(),
      latDest: viaje.getLatDest(),
      longDest: viaje.getLongDest(),
      latOrg: viaje.getLatOrg(),
      longOrg: viaje.getLongOrg(),
      rutCreador: viaje.getRutCreador(),
      horaSalida: viaje.getHoraSalida(), // Aseguramos que la fecha se guarde en un formato correcto
      idViaje: viaje.getIdViaje(),
      distancia: viaje.getDistancia(),
      pasajeros: viaje.getPasajeros() || []
    };
  }
}
