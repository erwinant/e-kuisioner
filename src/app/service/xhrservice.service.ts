import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as globalVar from '../global';
import { Question, Answer, User, Company } from '../model';

@Injectable({
  providedIn: 'root'
})
export class XhrserviceService {
  private url = globalVar.global_api;  // URL to web api
  private _headers = new HttpHeaders().set('Content-Type', 'application/json');
  private token: any;
  constructor(private httpClient: HttpClient) {
  }

  getAllQuestions(companyCode: string): Observable<Question[]> {
    this.token = localStorage.getItem('currentUser');
    //const headers = this._headers.append('x-access-token', this.token.token);
    const headers = this._headers.append('x-access-token', this.token);
    let url = globalVar.global_api + "/qs/cr/";
    return this.httpClient.post<Question[]>(url, { CompanyCode: companyCode }, { headers: headers }).pipe(map(res => { return res; }));
  }

  getCheckPerson(projectCode: string,username:string) :any{
    this.token = localStorage.getItem('currentUser');
    //const headers = this._headers.append('x-access-token', this.token.token);
    const headers = this._headers.append('x-access-token', this.token);
    let url = globalVar.global_api + "/rpt2/"+projectCode+"/"+username;
    return this.httpClient.get(url,  { headers: headers }).pipe(map(res => { return res; }));
  }
  getCheckAll(projectCode: string) {
    this.token = localStorage.getItem('currentUser');
    //const headers = this._headers.append('x-access-token', this.token.token);
    const headers = this._headers.append('x-access-token', this.token);
    let url = globalVar.global_api + "/rpt1/"+projectCode;
    return this.httpClient.get(url,  { headers: headers }).pipe(map(res => { return res; }));
  }


  getReport(projectCode: string, email:string) {
    this.token = localStorage.getItem('currentUser');
    //const headers = this._headers.append('x-access-token', this.token.token);
    const headers = this._headers.append('x-access-token', this.token);
    let url = globalVar.global_api + "/reports/"+projectCode+"/"+email;
    return this.httpClient.get(url,  { headers: headers }).pipe(map(res => { return res; }));
  }

  getReportUser(projectCode: string, email:string, username:string) {
    this.token = localStorage.getItem('currentUser');
    //const headers = this._headers.append('x-access-token', this.token.token);
    const headers = this._headers.append('x-access-token', this.token);
    let url = globalVar.global_api + "/reportperson/"+projectCode+"/"+email+"/"+username;
    return this.httpClient.get(url,  { headers: headers }).pipe(map(res => { return res; }));
  }

  getQuestion(qCode: string): Observable<Question[]> {
    this.token = localStorage.getItem('currentUser');
    //const headers = this._headers.append('x-access-token', this.token.token);
    const headers = this._headers.append('x-access-token', this.token);
    let url = globalVar.global_api + "/qs/cr/";
    return this.httpClient.post<Question[]>(url, { QCode: qCode }, { headers: headers }).pipe(map(res => { return res; }));
  }

  getQuestionChild(ParentQCode: string): Observable<Question[]> {
    this.token = localStorage.getItem('currentUser');
    //const headers = this._headers.append('x-access-token', this.token.token);
    const headers = this._headers.append('x-access-token', this.token);
    let url = globalVar.global_api + "/qs/cr/";
    return this.httpClient.post<Question[]>(url, { ParentQCode: ParentQCode }, { headers: headers }).pipe(map(res => { return res; }));
  }

  getAnswer(qCode: string, username: string): Observable<Answer> {
    this.token = localStorage.getItem('currentUser');
    //const headers = this._headers.append('x-access-token', this.token.token);
    const headers = this._headers.append('x-access-token', this.token);
    let url = globalVar.global_api + "/an/cr/";
    return this.httpClient.post<Answer>(url, { QCode: qCode, Username: username }, { headers: headers }).pipe(map(res => { return res[0]; }));
  }

  getUserAnswers(username: string): Observable<Answer[]> {
    this.token = localStorage.getItem('currentUser');
    //const headers = this._headers.append('x-access-token', this.token.token);
    const headers = this._headers.append('x-access-token', this.token);
    let url = globalVar.global_api + "/an/cr/";
    return this.httpClient.post<Answer[]>(url, { Username: username }, { headers: headers }).pipe(map(res => { return res; }));
  }


  postAnswer(answer: Answer) {
    this.token = answer.Username;
    //const headers = this._headers.append('x-access-token', this.token.token);
    const headers = this._headers.append('x-access-token', this.token);
    let url = globalVar.global_api + "/an";
    return this.httpClient.post<Answer[]>(url, answer, { headers: headers }).pipe(map(res => { return res; }));
  }

  putAnswer(answer: Answer) {
    this.token = localStorage.getItem('currentUser');
    //const headers = this._headers.append('x-access-token', this.token.token);
    const headers = this._headers.append('x-access-token', this.token);
    let url = globalVar.global_api + "/an";
    return this.httpClient.put<Answer[]>(url + "/" + answer.Username + "/" + answer.QCode, answer, { headers: headers }).pipe(map(res => { return res; }));
  }

  getUser(username: string): Observable<User> {
    this.token = localStorage.getItem('currentUser');
    //const headers = this._headers.append('x-access-token', this.token.token);
    const headers = this._headers.append('x-access-token', this.token);
    let url = globalVar.global_api + "/us/cr/";
    return this.httpClient.post<User>(url, { Username: username }, { headers: headers }).pipe(map(res => { return res[0]; }));
  }

  getAllCompany(): Observable<Company[]> {
    this.token = localStorage.getItem('currentUser');
    //const headers = this._headers.append('x-access-token', this.token.token);
    const headers = this._headers.append('x-access-token', this.token);
    let url = globalVar.global_api + "/cp";
    return this.httpClient.get<Company[]>(url, { headers: headers }).pipe(map(res => { return res; }));
  }

  postQuestion(qs: Question) {
    this.token = localStorage.getItem('currentUser');
    //const headers = this._headers.append('x-access-token', this.token.token);
    const headers = this._headers.append('x-access-token', this.token);
    let url = globalVar.global_api + "/qs";
    return this.httpClient.post<Question>(url, qs, { headers: headers }).pipe(map(res => { return res[0]; }));
  }

  putQuestion(qs: Question) {
    this.token = localStorage.getItem('currentUser');
    //const headers = this._headers.append('x-access-token', this.token.token);
    const headers = this._headers.append('x-access-token', this.token);
    let url = globalVar.global_api + "/qs";
    return this.httpClient.put<Question>(url + "/" + qs.QCode , qs, { headers: headers }).pipe(map(res => { return res; }));
  }

  delQuestion(qs: Question) {
    this.token = localStorage.getItem('currentUser');
    //const headers = this._headers.append('x-access-token', this.token.token);
    const headers = this._headers.append('x-access-token', this.token);
    let url = globalVar.global_api + "/qs";
    return this.httpClient.delete<Question>(url + "/" + qs.QCode, { headers: headers }).pipe(map(res => { return res; }));
  }

  delAllQuestion(companyCode: string) {
    this.token = localStorage.getItem('currentUser');
    //const headers = this._headers.append('x-access-token', this.token.token);
    const headers = this._headers.append('x-access-token', this.token);
    let url = globalVar.global_api + "/qsall";
    return this.httpClient.delete<Question>(url + "/" + companyCode, { headers: headers }).pipe(map(res => { return res; }));
  }
}
