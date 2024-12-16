import { EstadoViaje } from './EstadoViaje';

export class Viaje {
    private destino: string;
    private static contador: number = 0; // Contador estático para los IDs
    private latDest: number;
    private longDest: number;
    private latOrg: number;
    private longOrg: number;
    private rutCreador: string;
    private idViaje: number;
    private coste: number;
    private duracion: number;
    private estado: EstadoViaje;
    private capacidad: number; // Capacidad del viaje (número de plazas disponibles)
    private horaSalida: Date;
    private pasajeros: string[];
    private distancia:number;

    constructor(
        destino: string,
        coste: number,
        duracion: number,
        estado: EstadoViaje,
        capacidad: number,
        latDest: number,
        longDest: number,
        latOrg: number,
        longOrg: number,
        rutCreador: string,
        horaSalida: Date,
        idViaje: number,
        distancia:number
    ) {
        this.destino = destino;
        this.coste = coste;
        this.duracion = duracion;
        this.estado = estado;
        this.capacidad = capacidad;
        this.latDest = latDest;
        this.longDest = longDest;
        this.latOrg = latOrg;
        this.longOrg = longOrg;
        this.rutCreador = rutCreador;
        this.idViaje = idViaje;
        this.horaSalida = horaSalida;
        this.pasajeros = [];
        this.distancia=distancia;
    }

    // Método para verificar si la capacidad es adecuada
    public esCapacidadAdecuada(numPasajeros: number): boolean {
        return numPasajeros <= this.getCapacidad();
    }

    public agregarPasajero(rut: string): void {
        this.pasajeros.push(rut);

    }

    // Métodos de acceso (getters)
    public getDestino(): string {
        return this.destino;
    }

    public getLatDest(): number {
        return this.latDest;
    }

    public getLongDest(): number {
        return this.longDest;
    }

    public getLatOrg(): number {
        return this.latOrg;
    }

    public getLongOrg(): number {
        return this.longOrg;
    }

    public getRutCreador(): string {
        return this.rutCreador;
    }

    public getIdViaje(): number {
        return this.idViaje;
    }

    public getCoste(): number {
        return this.coste;
    }

    public getDuracion(): number {
        return this.duracion;
    }

    public getEstado(): EstadoViaje {
        return this.estado;
    }

    public getCapacidad(): number {
        return this.capacidad; 
    }

    public getCupos(): number{
        return this.capacidad - this.pasajeros.length; 
    }

    public getHoraSalida(): Date {
        return this.horaSalida;
    }

    public getPasajeros(): String[] {
        return this.pasajeros;
    }

    public getDistancia():number {
        return this.distancia;
    }

    /**
     * tienePajaro
     */
    public tienePasejo(rut: String):boolean {
        
       //var respuesta=this.pasajeros.filter((psj)=>psj==rut&&this.estado==EstadoViaje.Pendiente);

        for (let index = 0; index < this.pasajeros.length; index++) {
            if(this.pasajeros[index]==rut){
                return true;
            }
            
        }

        return false;
    }

    /**
     * eliminarPasajero
     */
    public eliminarPasajero(rut: String) {
    
       var idx= this.pasajeros.findIndex((psj)=>psj==rut);

        /*for (let index = 0; index < this.pasajeros.length; index++) {
            if(this.pasajeros[index]==rut){
                this.pasajeros[index]==null;
            } 
        }*/
       
        this.pasajeros.splice(idx, 1);
    }

    // Métodos de modificación (setters)
    public setDestino(destino: string): void {
        this.destino = destino;
    }

    public setLatDest(latDest: number): void {
        this.latDest = latDest;
    }

    public setLongDest(longDest: number): void {
        this.longDest = longDest;
    }

    public setLatOrg(latOrg: number): void {
        this.latOrg = latOrg;
    }

    public setLongOrg(longOrg: number): void {
        this.longOrg = longOrg;
    }

    public setRutCreador(rutCreador: string): void {
        this.rutCreador = rutCreador;
    }

    public setIdViaje(idViaje: number): void {
        this.idViaje = idViaje;
    }

    public setCoste(coste: number): void {
        this.coste = coste;
    }

    public setDuracion(duracion: number): void {
        this.duracion = duracion;
    }

    public setEstado(estado: EstadoViaje): void {
        this.estado = estado;
    }

    public setCapacidad(capacidad: number): void {
        this.capacidad = capacidad;
    }

    public setHoraSalida(horaSalida: Date): void {
        this.horaSalida = horaSalida;
    }
    public setPasajeros(pasajeros:string[]) {
        this.pasajeros=pasajeros;
    }

    // Método toString para depuración
    public toString(): string {
        return `Viaje { 
            ID: ${this.idViaje}, 
            Destino: ${this.destino}, 
            Creador: ${this.rutCreador}, 
            Coste: ${this.coste}, 
            Duración: ${this.duracion} min, 
            Estado: ${this.estado}, 
            Capacidad: ${this.capacidad},
            horaSalida: ${this.horaSalida},
            pasajeros: ${this.pasajeros.join(', ')} 
        }`;
    }
}
