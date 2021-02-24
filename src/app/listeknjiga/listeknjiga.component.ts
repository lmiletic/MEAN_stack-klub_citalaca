import { Component, OnInit } from '@angular/core';
import { KorisnickiService } from '../korisnicki.service';
import { ListaKnjiga } from '../models/listaknjiga';
import { Knjiga } from '../models/knjiga';
import { KnjigeService } from '../knjige.service';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-listeknjiga',
  templateUrl: './listeknjiga.component.html',
  styleUrls: ['./listeknjiga.component.css']
})
export class ListeknjigaComponent implements OnInit {

  constructor(private korisnikServis:KorisnickiService, private knjigeServis:KnjigeService, private ruter:Router) { }

  isLoading:boolean = false;
  prikazKolona: string[] = ['naziv', 'autori','zanrovi','datumIzdavanja','ocena'];
  prikazKolonaKasnije: string[] = ['naziv', 'autori','zanrovi','datumIzdavanja','ocena','izbaci'];

  listeKnjiga: ListaKnjiga;
  knjige: Knjiga[] = [];

  knjigeProcitane: Knjiga[] = [];
  knjigeTrenutno: Knjiga[] = [];
  knjigeKasnije: Knjiga[] = [];

  pieChartLabels:string[] = [];
  pieChartData:number[] = [];

  biranjePregleda: number[] = [1, 2, 5, 10];
  poStrani:number[] = [5, 5, 5];
  pregledProcitane: Knjiga[] = [];
  pregledTrenutno: Knjiga[] = [];
  pregledKasnije: Knjiga[] = [];
  indexKasnije:number = 0;


  ngOnInit(): void {
    this.isLoading = true;
    this.korisnikServis.listeKnjiga().subscribe(liste=>{
      this.listeKnjiga = liste;
      this.knjigeServis.dohvatiKnjige().subscribe(knjige=>{
        this.knjige = knjige;
        this.knjigeProcitane = this.knjige.filter(knjiga=> this.listeKnjiga.listaProcitane.includes(knjiga._id));
        this.knjigeTrenutno = this.knjige.filter(knjiga=> this.listeKnjiga.listaTrenutno.includes(knjiga._id));
        this.knjigeKasnije = this.knjige.filter(knjiga=> this.listeKnjiga.listaKasnije.includes(knjiga._id));
        for(let knjiga of this.knjigeProcitane){
          for(let zanr of knjiga.zanrovi){
            if(!this.pieChartLabels.includes(zanr)){
              this.pieChartLabels.push(zanr);
              this.pieChartData.push(1);
            }else{
              let index = this.pieChartLabels.indexOf(zanr);
              if(index >-1){
                this.pieChartData[index]++;
              }
            }
          }
        }
        let n = 5;
        if(this.knjigeProcitane.length<n){
          n = this.knjigeProcitane.length;
        }
        for(var i=0;i<n;i++){
          this.pregledProcitane.push(this.knjigeProcitane[i]);
        }
        n = 5;
        if(this.knjigeTrenutno.length<n){
          n = this.knjigeTrenutno.length;
        }
        for(var i=0;i<n;i++){
          this.pregledTrenutno.push(this.knjigeTrenutno[i]);
        }
        n = 5;
        if(this.knjigeKasnije.length<n){
          n = this.knjigeKasnije.length;
        }
        for(var i=0;i<n;i++){
          this.pregledKasnije.push(this.knjigeKasnije[i]);
        }
        this.isLoading = false;
      });
    });

  }

  izbaciIzKasnije(knjiga: Knjiga){
    this.listeKnjiga.listaKasnije = this.listeKnjiga.listaKasnije.filter(id=>id!==knjiga._id);
    this.korisnikServis.promeniListeKnjiga(this.listeKnjiga).subscribe(res=>{
      if(res['liste']=='ok'){
        this.knjigeKasnije = this.knjigeKasnije.filter(k => k._id!==knjiga._id);
        this.pregledKasnije = [];
        let n = this.poStrani[2];
        if(this.knjigeKasnije.length<n){
          n = this.knjigeKasnije.length;
        }
        console.log(this.knjigeKasnije.length);
        let max = n*(this.indexKasnije+1)<this.knjigeKasnije.length ? n*(this.indexKasnije+1): this.knjigeKasnije.length;
        for(var i=this.indexKasnije*n;i<max;i++){
          this.pregledKasnije.push(this.knjigeKasnije[i]);
        }
      }
    });
  }

  knjigaPrikaz(event:Event,knjiga:Knjiga){
    this.ruter.navigate([`profil/knjiga/${knjiga._id}`]);
  }

  promenaStrane(pageData: PageEvent,num:number){
    this.poStrani[num] = pageData.pageSize;
    if(num===0){
      this.pregledProcitane = [];
      let n = this.poStrani[num];
      if(this.knjigeProcitane.length<n){
        n = this.knjigeProcitane.length;
      }
      let max = n*(pageData.pageIndex+1)<this.knjigeProcitane.length ? n*(pageData.pageIndex+1): this.knjigeProcitane.length;
      for(var i=pageData.pageIndex*n;i<max;i++){
        this.pregledProcitane.push(this.knjigeProcitane[i]);
      }
    }
    if(num===1){
      this.pregledTrenutno = [];
      let n = this.poStrani[num];
      if(this.knjigeTrenutno.length<n){
        n = this.knjigeTrenutno.length;
      }
      let max = n*(pageData.pageIndex+1)<this.knjigeTrenutno.length ? n*(pageData.pageIndex+1): this.knjigeTrenutno.length;
      for(var i=pageData.pageIndex*n;i<max;i++){
        this.pregledTrenutno.push(this.knjigeTrenutno[i]);
      }
    }
    if(num===2){
      this.pregledKasnije = [];
      this.indexKasnije = pageData.pageIndex;
      let n = this.poStrani[num];
      if(this.knjigeKasnije.length<n){
        n = this.knjigeKasnije.length;
      }
      let max = n*(pageData.pageIndex+1)<this.knjigeKasnije.length ? n*(pageData.pageIndex+1): this.knjigeKasnije.length;
      for(var i=pageData.pageIndex*n;i<max;i++){
        this.pregledKasnije.push(this.knjigeKasnije[i]);
      }
    }
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
