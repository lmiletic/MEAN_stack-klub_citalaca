import { Component, OnInit, Input, ViewChild} from '@angular/core';
import { StarRatingComponent } from 'ng-starrating';
import { Komentar } from '../models/komentar';
import { KnjigeService } from '../knjige.service';
import {MatAccordion} from '@angular/material/expansion';
import { Knjiga } from '../models/knjiga';
import { Router } from '@angular/router';


@Component({
  selector: 'app-komentari',
  templateUrl: './komentari.component.html',
  styleUrls: ['./komentari.component.css']
})
export class KomentariComponent implements OnInit {

  constructor(private knjigeServis: KnjigeService, private ruter: Router) { }

  @ViewChild(MatAccordion) accordion: MatAccordion;
  @Input() idKnjige: string;
  @Input() userLogged: boolean;
  @Input() korisnickoIme: string;
  komentari: Komentar[];
  isLoading: boolean = false;

  knjige: Knjiga[];
  idKnjiga: string[] = [];
  prikazKorisnik: boolean = false;

  ngOnInit(): void {
    this.isLoading = true;
    if(this.idKnjige!=null){
      this.prikazKorisnik = false;
      this.knjigeServis.sviKomentariNaKnjigu(this.idKnjige).subscribe(komentari=>{
        this.komentari = komentari;
        if(this.userLogged){
          this.komentari = this.komentari.filter(komentar => komentar.korisnickoIme!=this.korisnickoIme);
        }
        this.isLoading = false;
      });
    }else{
      this.prikazKorisnik = true;
      this.knjigeServis.sviKomentariKorisnika().subscribe(komentari=>{
        this.komentari = komentari;
        for(let komentar of komentari){
          this.idKnjiga.push(komentar.knjigaId);
        }
        this.knjigeServis.dohvatiKnjige().subscribe(knjige=>{
          this.knjige = knjige;
          this.knjige = this.knjige.filter(knjiga => this.idKnjiga.includes(knjiga._id));
          this.isLoading = false;
        });
      });
    }
  }

  knjigaNaziv(knjigaId:string):string{
    return this.knjige.filter(knjiga=>knjiga._id==knjigaId)[0].naziv;
  }

  knjigaAutori(knjigaId:string):string{
    return this.knjige.filter(knjiga=>knjiga._id==knjigaId)[0].autori.toString();
  }

  knjigaPrikaz(knjigaId:string){
    this.ruter.navigate([`profil/knjiga/${knjigaId}`]);
  }

  korisnikPrikaz(korisnickoIme:string){
    this.ruter.navigate([`profil/pregled/${korisnickoIme}`]);
  }

}
