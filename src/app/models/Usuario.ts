import { Vehiculo } from './Vehiculo';

export class Usuario {
    private fecha_nacimiento: string;
    private rut: string;
    private tipo_usuario: string;
    private usuario: string;
    private contrasena: string;
    private contrasena_conf: string;
    public email: string;
    private vehiculo?: Vehiculo; 



    /*constructor(
        fecha_nacimiento: string,
        rut: string,
        tipo_usuario: string,
        usuario: string,
        contrasena: string,
        contrasena_conf: string,
        email: string
    ) {
        this.fecha_nacimiento = fecha_nacimiento;
        this.rut = rut;
        this.tipo_usuario = tipo_usuario;
        this.usuario = usuario;
        this.contrasena = contrasena;
        this.contrasena_conf = contrasena_conf;
        this.email = email;

    }*/


    constructor(
        fecha_nacimiento: string,
        rut: string,
        tipo_usuario: string,
        usuario: string,
        contrasena: string,
        contrasena_conf: string,
        email: string,
        vehiculo?: Vehiculo // Parámetro opcional para el vehículo
    ) {
        this.fecha_nacimiento = fecha_nacimiento;
        this.rut = rut;
        this.tipo_usuario = tipo_usuario;
        this.usuario = usuario;
        this.contrasena = contrasena;
        this.contrasena_conf = contrasena_conf;
        this.email = email;
        this.vehiculo = vehiculo; // Asignación del vehículo, si se proporciona
    }



    // Getters
    public getFechaNacimiento(): string {
        return this.fecha_nacimiento;
    }

    public getRut(): string {
        return this.rut;
    }

    public getTipoUsuario(): string {
        return this.tipo_usuario;
    }

    public getUsuario(): string {
        return this.usuario;
    }

    public getContrasena(): string {
        return this.contrasena;
    }

    public getContrasenaConf(): string {
        return this.contrasena_conf;
    }

    public getEmail(): string {
        return this.email;
    }

    public getVehiculo(): Vehiculo | undefined {
        return this.vehiculo;
    }

    // Setters
    public setFechaNacimiento(fecha_nacimiento: string): void {
        this.fecha_nacimiento = fecha_nacimiento;
    }

    public setRut(rut: string): void {
        this.rut = rut;
    }

    public setTipoUsuario(tipo_usuario: string): void {
        this.tipo_usuario = tipo_usuario;
    }

    public setUsuario(usuario: string): void {
        this.usuario = usuario;
    }

    public setContrasena(contrasena: string): void {
        this.contrasena = contrasena;
    }

    public setContrasenaConf(contrasena_conf: string): void {
        this.contrasena_conf = contrasena_conf;
    }

    public setEmail(email: string): void {
        this.email = email;
    }

    public setVehiculo(vehiculo: Vehiculo): void {
        this.vehiculo = vehiculo;
    }

    public tieneVehiculo(): boolean {
        return this.vehiculo !== undefined;
    }
}
