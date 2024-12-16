import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DolarApiService {

  private apiUrl = 'https://cl.dolarapi.com/v1/cotizaciones/usd'; // URL de la API

  constructor(private http: HttpClient) {}

  // Método para obtener datos de la API
  getData(): Observable<any> {
    return this.http.get(`${this.apiUrl}`); // Reemplaza con tu endpoint
  }


}
