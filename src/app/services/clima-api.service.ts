import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClimaApiService {

  

  private apiUrl = 'https://api.gael.cloud/general/public/clima/SCQN';

  constructor(private http: HttpClient) {}

  // Método para obtener datos de la API
  getData(): Observable<any> {
    return this.http.get(`${this.apiUrl}`); // Reemplaza con tu endpoint
  }


}
