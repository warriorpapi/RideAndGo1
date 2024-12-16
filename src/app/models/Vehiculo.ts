export class Vehiculo {
    public patente: string;
    public marca: string;
    public modelo: string;
    public color: string;
    public plazas: number; // Número de asientos
    public rutDueno: string;

    constructor(patente: string, marca: string, modelo: string, color: string, plazas: number, rutDueno: string) {
        this.patente = patente;
        this.marca = marca;
        this.modelo = modelo;
        this.color = color;
        this.plazas = plazas;
        this.rutDueno = rutDueno;
    }

    // Métodos de acceso (getters)
    public getPatente(): string {
        return this.patente;
    }

    public getMarca(): string {
        return this.marca;
    }

    public getModelo(): string {
        return this.modelo;
    }

    public getColor(): string {
        return this.color;
    }

    public getPlazas(): number {
        return this.plazas;
    }
    // Métodos de modificación (setters)
    public setPatente(patente: string): void {
        this.patente = patente;
    }

    public setMarca(marca: string): void {
        this.marca = marca;
    }

    public setModelo(modelo: string): void {
        this.modelo = modelo;
    }

    public setColor(color: string): void {
        this.color = color;
    }

    public setPlazas(plazas: number): void {
        this.plazas = plazas;
    }

    public setRutDueno(rutDueno: string): void {
        this.rutDueno = rutDueno;
    }

    toPlainObject() {
        return {
          patente: this.patente,
          marca: this.marca,
          modelo: this.modelo,
          color: this.color,
          plazas: this.plazas,
          rutDueno:this.rutDueno
        };
    }
}
