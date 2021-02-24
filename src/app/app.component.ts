import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'ljubitelji-knjiga';

  constructor(private ruter:Router, private location: Location, private auth: AuthService){
  }

  ngOnInit(): void {
    this.auth.boot();
    if(this.auth.isLogged()){
      if(this.location.path()===''){
        this.ruter.navigate(['/profil']);
      }
    }
  }

  prijaviSe(){
    this.ruter.navigate(['/']);
  }

  isLogged():boolean{
    return this.auth.isLogged();
  }

  logout(){
    this.auth.forget();
  }


  registrujSe(){
    this.ruter.navigate(['/register']);
  }
}
