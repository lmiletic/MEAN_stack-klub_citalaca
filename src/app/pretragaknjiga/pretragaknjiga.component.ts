import { Component, OnInit } from '@angular/core';
import { KnjigeService } from '../knjige.service';
import { Knjiga } from '../models/knjiga';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-pretragaknjiga',
  templateUrl: './pretragaknjiga.component.html',
  styleUrls: ['./pretragaknjiga.component.css']
})
export class PretragaknjigaComponent implements OnInit {

  isLoading: boolean = false;
  pretraga: boolean = false;
  prikazKolona: string[] = ['naziv', 'autori','zanrovi','datumIzdavanja','ocena'];
  knjige:Knjiga[] =[];
  knjigePretraga:Knjiga[] =[];
  knjigePoStrani:Knjiga[] = [];
  autori:string[] =[];
  zanrovi:string[] = [];
  trenutnaStrana: number = 0;
  brojKnjiga: number;
  poStrani: number = 5;
  biranjePregleda: number[] = [1, 2, 5, 10];
  formGroup: FormGroup = new FormGroup({
    naziv: new FormControl(null),
    autor: new FormControl(null),
    zanrovi: new FormControl(null)
  });
  filteredNaziv: Observable<Knjiga[]>;
  filteredAutor: Observable<string[]>;

  constructor(private servis:KnjigeService, private auth: AuthService , private ruter:Router) { }

  ngOnInit(): void {
    this.servis.dohvatiZanrove().subscribe(zanrovi =>{
      this.zanrovi = zanrovi;
    });
    this.servis.dohvatiKnjige().subscribe(knjige =>{
      this.knjige = knjige;
      this.brojKnjiga = this.knjige.length;
      for(let knjiga of this.knjige){
        for(let autor of knjiga.autori){
          if(!this.autori.includes(autor)){
            this.autori.push(autor);
          }
        }
      }
      console.log(this.autori);
      console.log(this.knjige);
      this.filteredNaziv = this.formGroup.get('naziv').valueChanges.pipe(
        startWith(''),
        map(value => this._filterNaziv(value))
      );
      this.filteredAutor = this.formGroup.get('autor').valueChanges.pipe(
        startWith(''),
        map(value => this._filterAutor(value))
      );
    });
  }

  private _filterNaziv(value: string): Knjiga[] {
    const filterValue = value.toLowerCase();

    return this.knjige.filter(knjiga => knjiga.naziv.toLowerCase().indexOf(filterValue) === 0);
  }

  private _filterAutor(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.autori.filter(autor => autor.toLowerCase().indexOf(filterValue) === 0);
  }

  nazad(){
    this.pretraga = false;
  }

  knjigaPrikaz(event:Event,knjiga:Knjiga){
    if(knjiga.odobrena){
      this.ruter.navigate([`profil/knjiga/${knjiga._id}`]);
    }
  }

  isLogged(){
    return this.auth.isLogged();
  }

  pretrazi(){
    console.log("PRETERAZI");
    this.pretraga = true;
    this.isLoading = true;
    this.knjigePretraga = this.knjige;
    if(this.formGroup.value.naziv !='' && this.formGroup.value.naziv != null){
      const value = this.formGroup.value.naziv.toLowerCase();
      this.knjigePretraga = this.knjigePretraga.filter(knjiga => knjiga.naziv.toLowerCase().indexOf(value) === 0);
    }
    if(this.formGroup.value.autor !='' && this.formGroup.value.autor !=null){
      const value = this.formGroup.value.autor.toLowerCase();
      this.knjigePretraga = this.knjigePretraga.filter(knjiga => {
        for(let autor of knjiga.autori){
          if(autor.toLowerCase().includes(value,0)){
            return true;
          }
        }
        return false;
      });
    }
    if(this.formGroup.value.zanrovi !='' && this.formGroup.value.zanrovi!=null){
      const value = this.formGroup.value.zanrovi.toLowerCase();
      this.knjigePretraga = this.knjigePretraga.filter(knjiga => {
        for(let zanr of knjiga.zanrovi){
          if(zanr.toLowerCase().includes(value,0)){
            return true;
          }
        }
        return false;
      });
    }
    this.brojKnjiga = this.knjigePretraga.length;
    let n = this.poStrani;
    this.knjigePoStrani = [];
    if(this.brojKnjiga<n){
      n = this.brojKnjiga;
    }
    for(var i=0;i<n;i++){
      this.knjigePoStrani.push(this.knjigePretraga[i]);
    }
    console.log(this.knjigePoStrani);
    this.isLoading = false;
  }

  promenaStrane(pageData: PageEvent){
    this.isLoading = true;
    this.poStrani = pageData.pageSize;
    this.trenutnaStrana = pageData.pageIndex;
    this.knjigePoStrani = [];
    let n = this.poStrani;
    if(this.brojKnjiga<n){
      n = this.brojKnjiga;
    }
    let max = n*(this.trenutnaStrana+1)<this.brojKnjiga ? n*(this.trenutnaStrana+1): this.brojKnjiga;
    for(var i=this.trenutnaStrana*n;i<max;i++){
      this.knjigePoStrani.push(this.knjigePretraga[i]);
    }
    console.log(this.knjigePoStrani);
    this.isLoading = false;
  }

  zaokruziOcenu(ocena:number){
    let ocenaPrikaz = 0;
    if(Math.round(Math.round(Number(ocena)))-Math.floor((Number(ocena)))>0){
      ocenaPrikaz = Math.floor(Number(ocena))+0.5;
    }else{
      ocenaPrikaz = Math.floor((Number(ocena)));
    }
    return ocenaPrikaz;
  }




}
