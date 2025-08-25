import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PropertyPage } from '../../models/property.model';

const BASE_URL=environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class PropertyService {

  constructor(private http: HttpClient) {}

  /**
   * Gets a page of properties
   * @param page page number (starts from 0)
   * @param size how many properties per page
   */

   getProperties(page: number = 0, size: number = 5): Observable<PropertyPage> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<PropertyPage>(BASE_URL+'auth/getAllProperties', { params });
  }

  getPropertyById(id:string | number): Observable<any>{
    return this.http.get<any>(BASE_URL+`property/${id}`);
  }

  createProperty(formData:FormData):Observable<HttpResponse<any>>{
    return this.http.post<any>(BASE_URL+"property/add", formData, { observe: 'response' });
  }
}
