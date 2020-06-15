import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/**
 * @description Angular Service: Http Service
 */
@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }  

  getData = (baseURL) => {   
    return this.http.get<any>(baseURL);
  }

  postData = (baseURL, postData) => {
    return this.http.post(baseURL, postData);
  }

  deleteData = (baseURL) => {
    return this.http.delete(baseURL);
  }

  updateData = (baseURL, postData) => {
    return this.http.put(baseURL, postData);
  }
}
