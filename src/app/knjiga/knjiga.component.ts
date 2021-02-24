import { Component, OnInit } from '@angular/core';
import { Knjiga } from '../models/knjiga';
import { KnjigeService } from '../knjige.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { KorisnickiService } from '../korisnicki.service';
import { Korisnik } from '../models/korisnik';
import { ListaKnjiga } from '../models/listaknjiga';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { StarRatingComponent } from 'ng-starrating';

@Component({
  selector: 'app-knjiga',
  templateUrl: './knjiga.component.html',
  styleUrls: ['./knjiga.component.css']
})
export class KnjigaComponent implements OnInit {

  isLoadingKnjiga:boolean = false;
  isLoadingListe:boolean = false;

  idKnjige:string;
  knjiga:Knjiga;
  ocenaKnjiga:number;

  userLogged:boolean;
  listeKnjiga:ListaKnjiga;
  korisnickoIme:string;

  proc:boolean = false;;
  tren:boolean = false;
  kasn:boolean = false;
  disable:boolean = false;

  trenStigao:number;
  trenUkupno:number;
  procitanoPola:boolean = false;

  message:string = "";

  komentarForma:FormGroup;
  messageKomentar:string = "";
  ocenaKomentar:number = 5;
  editKomentar:boolean = true;

  constructor(private knjigaServis: KnjigeService, private authServis: AuthService, private korisnikServis: KorisnickiService, private route: ActivatedRoute, private ruter: Router) { }

  ngOnInit(): void {
    this.isLoadingKnjiga= true;
    this.isLoadingListe = true;
    this.korisnickoIme = "";
    this.idKnjige = this.route.snapshot.paramMap.get('id');
    this.knjigaServis.knjigaPrikaz(this.idKnjige).subscribe(knjiga=>{
      this.knjiga = knjiga;
      if(Math.round(Math.round(Number(this.knjiga.ocena)))-Math.floor((Number(this.knjiga.ocena)))>0){
        this.ocenaKnjiga = Math.floor(Number(this.knjiga.ocena))+0.5;
      }else{
        this.ocenaKnjiga = Math.floor((Number(this.knjiga.ocena)));
      }
      this.isLoadingKnjiga = false;
    });
    this.userLogged = this.authServis.isLogged();
    if(this.userLogged){
      this.komentarForma = new FormGroup({
        ocena: new FormControl(5),
        komentar: new FormControl("")
      },this.brojReci);
      this.knjigaServis.dohvatiKomentarKnjige(this.idKnjige).subscribe(res =>{
        if(res['knjigaId']==this.idKnjige){
          this.ocenaKomentar = res['ocena'];
          this.komentarForma.patchValue({ocena:this.ocenaKomentar});
          this.komentarForma.patchValue({komentar:res['komentar']});
          this.editKomentar = false;
        }
      });
      this.korisnikServis.listeKnjiga().subscribe(liste =>{
        this.listeKnjiga = liste;
        this.korisnickoIme = liste.korisnickoIme;
        console.log(this.listeKnjiga);
        if(this.listeKnjiga.listaProcitane.includes(this.idKnjige)){
          this.proc = true;
        }
        if(this.listeKnjiga.listaTrenutno.includes(this.idKnjige)){
          this.tren = true;
          let index = this.listeKnjiga.listaTrenutno.indexOf(this.idKnjige);
          if(index>-1){
            this.trenStigao = Number(this.listeKnjiga.trenutnoPozicija[index].split(':')[0]);
            this.trenUkupno = Number(this.listeKnjiga.trenutnoPozicija[index].split(':')[1]);
            if(this.trenStigao/this.trenUkupno >= 0.5){
              this.procitanoPola = true;
            }
          }
        }
        if(this.listeKnjiga.listaKasnije.includes(this.idKnjige)){
          this.kasn = true;
        }
        if(this.proc || this.tren){
          this.disable = true;
        }
        this.isLoadingListe = false;
      });
    }else{
      this.listeKnjiga = null;
      this.isLoadingListe = false;
    }
  }

  brojReci(form: FormGroup){
    return form.get("komentar").value.split(' ').length < 1000 ? null : { brReci: true };
  }

  procitana(){
    this.listeKnjiga.listaProcitane.push(this.idKnjige);
    if(this.tren){
      let index = this.listeKnjiga.listaTrenutno.indexOf(this.idKnjige);
      this.listeKnjiga.listaTrenutno = this.listeKnjiga.listaTrenutno.filter(id=>id!==this.idKnjige);
      if(index>-1){
        this.listeKnjiga.trenutnoPozicija.splice(index,1);
      }
    }
    if(this.kasn){
      this.listeKnjiga.listaKasnije = this.listeKnjiga.listaKasnije.filter(id=>id!==this.idKnjige);
    }
    this.korisnikServis.promeniListeKnjiga(this.listeKnjiga).subscribe(res=>{
      if(res['liste']=='ok'){
        this.proc = true;
        this.disable = true;
        this.kasn = false;
        this.tren = false;
      }
    });
  }

  trenutno(){
    this.listeKnjiga.listaTrenutno.push(this.idKnjige);
    this.listeKnjiga.trenutnoPozicija.push('0:100');
    this.procitanoPola = false;
    this.trenStigao = 0;
    this.trenUkupno = 100;
    this.listeKnjiga.listaKasnije = this.listeKnjiga.listaKasnije.filter(id=>id!==this.idKnjige);
    this.korisnikServis.promeniListeKnjiga(this.listeKnjiga).subscribe(res=>{
      if(res['liste']=='ok'){
        this.tren = true;
        this.kasn = false;
        this.disable = true;
      }
    });
  }

  kasnije(){
    this.listeKnjiga.listaKasnije.push(this.idKnjige);
    this.korisnikServis.promeniListeKnjiga(this.listeKnjiga).subscribe(res=>{
      if(res['liste']=='ok'){
        this.kasn = true;
      }
    });
  }

  kasnijeUkloni(){
    this.listeKnjiga.listaKasnije = this.listeKnjiga.listaKasnije.filter(id=>id!==this.idKnjige);
    this.korisnikServis.promeniListeKnjiga(this.listeKnjiga).subscribe(res=>{
      if(res['liste']=='ok'){
        this.kasn = false;
      }
    });
  }

  sacuvajTrenunto(){
    this.message = "";
    if(this.trenStigao/this.trenUkupno >= 0.5){
      this.procitanoPola = true;
    }
    let index = this.listeKnjiga.listaTrenutno.indexOf(this.idKnjige);
    if(index>-1){
      this.listeKnjiga.trenutnoPozicija[index] = "" + this.trenStigao + ":" + this.trenUkupno;
      this.korisnikServis.promeniListeKnjiga(this.listeKnjiga).subscribe(res=>{
        if(res['liste']=='ok'){
          this.message = "Uspešno sačuvano";
        }else{
          this.message = "Greška pri čuvanju";
        }
      });
    }else{
      this.message = "Greška pri čuvanju";
    }
  }

  edit(){
    this.editKomentar = true;
    this.messageKomentar = "";
  }

  onRate($event:{oldValue:number, newValue:number, starRating:StarRatingComponent}) {
    this.komentarForma.patchValue({ocena: $event.newValue});
  }

  sacuvajKomentar(){
    if(this.komentarForma.valid){
      this.knjigaServis.sacuvajKomentar(this.komentarForma,this.idKnjige).subscribe(res=>{
        if(res['success']==true){
          this.messageKomentar = "Uspesno sacuvan komentar";
          this.editKomentar = false;
        }else{
          this.messageKomentar = "Greska pri cuvanju komentara";
        }
        console.log(this.messageKomentar);
      });
    }else{
      this.messageKomentar = "Komentar ima više od 1000 reči";
    }
  }

  isAdmin(){
    return this.authServis.isAdmin();
  }

  izmeniKnjigu(){
    this.ruter.navigate([`profil/izmenaknjige/${this.idKnjige}`]);
  }

}
