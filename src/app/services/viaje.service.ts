import { Injectable } from '@angular/core';

import { Viaje } from '../models/Viaje';
import { ViajeRepository } from '../repository/ViajeRepository';
import { ViajeRepositoryImplStorage } from '../repository/ViajeRepositoryImplStorage';
import { ViajeRepositoryImplFirebase } from '../repository/ViajeRepositoryImplFirebase';

@Injectable({
  providedIn: 'root'
})
export class ViajeService {

  constructor(private viajeRepository:ViajeRepositoryImplFirebase) {

  }

  async createViaje(viaje: Viaje): Promise<boolean> {
    return await this.viajeRepository.createViaje(viaje);
  }

  async getViaje(id: number): Promise<Viaje | null> {
    return await this.viajeRepository.getViaje(id);
  }

  async updateViaje(id: number, viaje: Viaje): Promise<boolean> {
    return await this.viajeRepository.updateViaje(id, viaje);
  }

  async deleteViaje(id: number): Promise<boolean> {
    return await this.viajeRepository.deleteViaje(id);
  }

  async getAllViajes(): Promise<Viaje[]> {
    return await this.viajeRepository.getAllViajes();
  }
  public async agregarPasajero(rut:string,viaje:Viaje):Promise<void>{
    this.viajeRepository.agregarPasajero(rut,viaje);
  }
}
