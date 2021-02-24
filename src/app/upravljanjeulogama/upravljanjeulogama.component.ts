import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KorisnickiService } from '../korisnicki.service';
import { Korisnik } from '../models/korisnik';

@Component({
  selector: 'app-upravljanjeulogama',
  templateUrl: './upravljanjeulogama.component.html',
  styleUrls: ['./upravljanjeulogama.component.css']
})
export class UpravljanjeulogamaComponent implements OnInit {

  constructor(private korisnikServis: KorisnickiService, private ruter: Router) { }

  korisnici: Korisnik[] = [];
  isLoading: boolean = false;

  kolonaNaziv: string[] = ['Slika','Ime','Prezime','Korisničko ime','Email','Uloga'];

  ngOnInit(): void {
    this.isLoading = true;
    this.korisnikServis.dohvatiKorisnike().subscribe(korisnici =>{
      this.korisnici = korisnici;
      this.korisnici= this.korisnici.filter(korisnik => korisnik.odobren == true);
      this.korisnikServis.korisnickiPodaci().subscribe(korisnik=>{
        let k:Korisnik = korisnik;
        this.korisnici = this.korisnici.filter(korisnik => korisnik.korisnickoIme != k.korisnickoIme);
        this.isLoading = false;
      });
    });
  }

  odaberi(tip:string, korisnickoIme:string){
    this.isLoading = true;
    this.korisnikServis.promeniTip(korisnickoIme,tip).subscribe(res=>{
      if(res["message"]=="ok"){
        this.isLoading = false;
      }
    });
  }

  korisnikPrikaz(korisnickoIme:string){
    this.ruter.navigate([`profil/pregled/${korisnickoIme}`]);
  }


}
