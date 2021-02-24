import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { KorisnickiService } from '../korisnicki.service';
import { Korisnik } from '../models/korisnik';

@Component({
  selector: 'app-pretragakorisnika',
  templateUrl: './pretragakorisnika.component.html',
  styleUrls: ['./pretragakorisnika.component.css']
})
export class PretragakorisnikaComponent implements OnInit {

  isLoading :boolean = false;
  forma = new FormControl();
  korisnici: Korisnik[] = [];

  pretraga :boolean = false;
  korisniciPretraga: Korisnik[] = [];

  kolonaNaziv: string[] = ['Slika','Ime','Prezime','Korisničko ime','Email'];

  constructor(private korisnikServis: KorisnickiService, private ruter:Router) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.korisnikServis.dohvatiKorisnike().subscribe(korisnici=>{
      this.korisnici = korisnici.filter(korisnik => korisnik.odobren == true);
      console.log(this.korisnici);
      this.isLoading = false;
    });
  }


  pretrazi(){
    this.pretraga = true;
    console.log("pretraga");
    this.korisniciPretraga = [];
    if(this.forma.value !='' && this.forma.value != null){
      const value = this.forma.value.toLowerCase();
      this.korisniciPretraga = this.korisniciPretraga.concat(this.korisnici.filter(korisnik=>korisnik.ime.toLowerCase().indexOf(value) === 0));
      this.korisniciPretraga = this.korisniciPretraga.concat(this.korisnici.filter(korisnik=>korisnik.prezime.toLowerCase().indexOf(value) === 0));
      this.korisniciPretraga = this.korisniciPretraga.concat(this.korisnici.filter(korisnik=>korisnik.korisnickoIme.toLowerCase().indexOf(value) === 0));
      this.korisniciPretraga = this.korisniciPretraga.concat(this.korisnici.filter(korisnik=>korisnik.email.toLowerCase().indexOf(value) === 0));
      let korisnici:Korisnik[] = [];
      for(let k of this.korisniciPretraga){
        if(!korisnici.includes(k)){
          korisnici.push(k);
        }
      }
      this.korisniciPretraga = korisnici;
    }else{
      this.korisniciPretraga = this.korisnici;
    }
    console.log(this.korisniciPretraga);
  }

  nazad(){
    this.pretraga = false;
  }

  korisnikPrikaz(korisnickoIme:string){
    this.ruter.navigate([`profil/pregled/${korisnickoIme}`]);
  }




}
