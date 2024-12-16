import { Viaje } from "../models/Viaje";

export interface ViajeRepository {
    createViaje(viaje: Viaje): Promise<boolean>;
    getViaje(id: number): Promise<Viaje | null>; // Método para obtener un viaje por ID
    updateViaje(id: number, viaje: Viaje): Promise<boolean>; // Método para actualizar un viaje
    deleteViaje(id: number): Promise<boolean>; // Método para eliminar un viaje
    getAllViajes(): Promise<Viaje[]>; // Método para obtener todos los viajes
    agregarPasajero(rut:String,viaje:Viaje):Promise<void>;
}
