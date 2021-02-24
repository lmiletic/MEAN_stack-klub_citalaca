import { Component, OnInit } from '@angular/core';
import { KorisnickiService } from '../korisnicki.service';
import { Korisnik } from '../models/korisnik';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-odobravanjekorisnika',
  templateUrl: './odobravanjekorisnika.component.html',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  styleUrls: ['./odobravanjekorisnika.component.css']
})
export class OdobravanjekorisnikaComponent implements OnInit {

  isLoading:boolean = false;
  neodobreniKorisnici: Korisnik[] = [];
  kolonePrikaz: string[] = ["ime","prezime","korisnickoIme","email","odobravanje"];
  expandedKorisnik: Korisnik | null;

  constructor(private korisnikServis: KorisnickiService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.korisnikServis.neodobreniKorisnici().subscribe(korisnici=>{
      this.neodobreniKorisnici = korisnici;
      console.log(this.neodobreniKorisnici);
      this.isLoading = false;
    });
  }

  odobri(korisnickoIme:string){
    console.log("odobri");
    this.korisnikServis.odobriKorisnika(korisnickoIme).subscribe(res=>{
      if(res["message"]=="ok"){
        this.neodobreniKorisnici = this.neodobreniKorisnici.filter(korisnik=>korisnik.korisnickoIme != korisnickoIme);
      }
    });
  }

  izbrisi(korisnickoIme:string){
    console.log("izbrisi");
    this.korisnikServis.izbrisiKorisnika(korisnickoIme).subscribe(res=>{
      if(res["message"]=="1"){
        this.neodobreniKorisnici = this.neodobreniKorisnici.filter(korisnik=>korisnik.korisnickoIme != korisnickoIme);
      }
    });
  }

}
