import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as globalVar from '../global';
import { Question, Answer } from '../model';

@Injectable({
  providedIn: 'root'
})
export class XhrserviceService {
  private url = globalVar.global_api;  // URL to web api
  private _headers = new HttpHeaders().set('Content-Type', 'application/json');
  private token: any;
  constructor(private httpClient: HttpClient) {
  }

  getAllQuestions(companyCode:string):Observable<Question[]> {
    this.token = localStorage.getItem('currentUser');
    //const headers = this._headers.append('x-access-token', this.token.token);
    const headers = this._headers.append('x-access-token', this.token);
    let url=globalVar.global_api + "/qs/cr/";
    return this.httpClient.post<Question[]>(url,{CompanyCode:companyCode}, { headers: headers }).pipe(map(res =>{return res;}));
  }

  getQuestion(qCode:string):Observable<Question[]> {
    this.token = localStorage.getItem('currentUser');
    //const headers = this._headers.append('x-access-token', this.token.token);
    const headers = this._headers.append('x-access-token', this.token);
    let url=globalVar.global_api + "/qs/cr/";
    return this.httpClient.post<Question[]>(url,{ QCode:qCode }, { headers: headers }).pipe(map(res =>{return res;}));
  }

  getQuestionChild(ParentQCode:string):Observable<Question[]> {
    this.token = localStorage.getItem('currentUser');
    //const headers = this._headers.append('x-access-token', this.token.token);
    const headers = this._headers.append('x-access-token', this.token);
    let url=globalVar.global_api + "/qs/cr/";
    return this.httpClient.post<Question[]>(url,{ParentQCode:ParentQCode}, { headers: headers }).pipe(map(res =>{return res;}));
  }

  getAnswer(qCode:string, username:string):Observable<Answer> {
    this.token = localStorage.getItem('currentUser');
    //const headers = this._headers.append('x-access-token', this.token.token);
    const headers = this._headers.append('x-access-token', this.token);
    let url=globalVar.global_api + "/an/cr/";
    return this.httpClient.post<Answer>(url,{ QCode:qCode, Username:username }, { headers: headers }).pipe(map(res =>{return res[0];}));
  }

  getUserAnswers(username:string):Observable<Answer[]> {
    this.token = localStorage.getItem('currentUser');
    //const headers = this._headers.append('x-access-token', this.token.token);
    const headers = this._headers.append('x-access-token', this.token);
    let url=globalVar.global_api + "/an/cr/";
    return this.httpClient.post<Answer[]>(url,{ Username:username }, { headers: headers }).pipe(map(res =>{return res;}));
  }


  postAnswer(answer:Answer){
    this.token = localStorage.getItem('currentUser');
    //const headers = this._headers.append('x-access-token', this.token.token);
    const headers = this._headers.append('x-access-token', this.token);
    let url=globalVar.global_api + "/an";
    return this.httpClient.post<Answer[]>(url, answer, { headers: headers }).pipe(map(res =>{return res;}));
  }

  putAnswer(answer:Answer){
    this.token = localStorage.getItem('currentUser');
    //const headers = this._headers.append('x-access-token', this.token.token);
    const headers = this._headers.append('x-access-token', this.token);
    let url=globalVar.global_api + "/an";
    return this.httpClient.put<Answer[]>(url+"/"+answer.Username+"/"+answer.QCode, answer, { headers: headers }).pipe(map(res =>{return res;}));
  }
}
