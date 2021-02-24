import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {  Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;
  private tokenTimer:any;
  private tip:string;
  private adminStatusListener = new Subject<boolean>();
  private modStatusListener = new Subject<boolean>();

  uri='http://localhost:3000';

  constructor(private router: Router,private http: HttpClient){}

  boot() {
    const token = localStorage.getItem('token');
    if (token) {
      this.token = token;
      this.http.post(`${this.uri}/checktoken`,{token:token}).subscribe(res=>{
        console.log(res);
        if(res['logged']==false){
          this.forgetAuto();
        }
        if(res['tip']){
         this.tip = res['tip'];
          if(this.tip == 'admin'){
            this.adminStatusListener.next(true);
          }else{
            if(this.tip == 'moderator'){
              this.modStatusListener.next(true);
            }else{
              this.modStatusListener.next(false);
              this.adminStatusListener.next(false);
            }
          }
        }
      });
    }
  }

  setTip(tip){
    console.log(tip);
    this.tip = tip;
    if(tip == 'admin'){
      this.adminStatusListener.next(true);
    }else{
      if(tip == 'moderator'){
        this.modStatusListener.next(true);
      }else{
        this.modStatusListener.next(false);
        this.adminStatusListener.next(false);
      }
    }
  }


  remember(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  isAdminListener(){
    return this.adminStatusListener.asObservable();
  }

  isModListener(){
    return this.modStatusListener.asObservable();
  }

  isAdmin(){
    return this.tip == 'admin';
  }

  isMod(){
    return this.tip == 'moderator';
  }

  setTimeOut(expiresIn:number){
    this.tokenTimer = setTimeout(() =>{
      this.forgetAuto();
    },expiresIn);
  }

  forgetAuto() {
    this.tip = null;
    this.token = null;
    clearTimeout(this.tokenTimer);
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }

  checkToken(){
    const token = this.token? this.token : localStorage.getItem('token');
    return this.http.post(`${this.uri}/checktoken`,{token:token});
  }

  forget() {
    this.http.post(`${this.uri}/logout`,null,{
      headers: new HttpHeaders({'Authorization': `Bearer ${this.token}`})
    }).subscribe(res=>{
      this.tip = null;
    });
    this.token = null;
    clearTimeout(this.tokenTimer);
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }

  isLogged() {
    return this.token!=null;
  }


  getToken() {
    return this.token;
  }
}
