import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const IRIS_API = '/oauth2/';

let httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/fhir+json',
        'Access-Control-Allow-Origin': '*'
  })
};

@Injectable({
  providedIn: 'root'
})
export class IrisService {

  constructor(private http: HttpClient) {}

  savePatient(patient: any): Observable<any> {
    return this.http.post<Response>(
      IRIS_API + 'Patient', patient, httpOptions
    )
  }

  saveObservation(observation: any): Observable<any> {
    return this.http.post<Response>(
      IRIS_API + 'Observation', observation, httpOptions
    )
  }

  getPatient(email: string): Observable<any> {
    return this.http.get<Response>(
      IRIS_API + 'Patient?email='+email, httpOptions
    )
  }

  getObservations(reference: string): Observable<any> {
    return this.http.get<Response>(
      IRIS_API + 'Observation?patient=Patient/'+reference, httpOptions
    )
  }
}
