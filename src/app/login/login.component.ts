import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { KorisnickiService } from '../korisnicki.service';
import { Korisnik } from '../models/korisnik';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  hide:boolean = true;
  message:string;

  constructor(private ruter: Router, private servis: KorisnickiService) {

  }

  ngOnInit(): void {
    this.message="";
  }

  gostLogin():void{
    this.ruter.navigate(["/profil/pretragaknjiga"]);
  }

  login(loginForm: NgForm):void{
    if(loginForm.value.korisnickoIme=="" || loginForm.value.lozinka==""){
      this.message = "Niste popunili sva polja!";
    }else{
      this.servis.login(loginForm.value.korisnickoIme,loginForm.value.lozinka).subscribe(korisnik =>{
        //console.log(korisnik);
        if(korisnik["token"]!=null){
          this.ruter.navigate(['/profil/']);
        }else{
          console.log(korisnik);
          if(korisnik["message"]=="Auth failed"){
            this.message = "Pogrešni kredencijali!";
          }else{
            this.message = "Nalog nije odobren";
          }
        }
      });
    }
  }

}
