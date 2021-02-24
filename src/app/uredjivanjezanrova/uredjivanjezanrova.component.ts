import { Component, OnInit } from '@angular/core';
import { KnjigeService } from '../knjige.service';
import { Knjiga } from '../models/knjiga';

@Component({
  selector: 'app-uredjivanjezanrova',
  templateUrl: './uredjivanjezanrova.component.html',
  styleUrls: ['./uredjivanjezanrova.component.css']
})
export class UredjivanjezanrovaComponent implements OnInit {

  constructor(private knjigeServis:KnjigeService) { }

  isLoading: boolean = false;
  sviZanrovi: string[] = [];
  zanroviBrisanje: string[] = [];
  knjige: Knjiga[] = [];

  zaBrisanje: string;
  noviZanr: string;

  message: string;

  ngOnInit(): void {
    this.isLoading = true;
    this.knjigeServis.dohvatiKnjige().subscribe(knjige=>{
      this.knjige = knjige;
      let zanroviKoriste :string[] = [];
      for(let knjiga of this.knjige){
        for(let zanr of knjiga.zanrovi){
          if(!zanroviKoriste.includes(zanr)){
            zanroviKoriste.push(zanr);
          }
        }
      }
      this.knjigeServis.dohvatiZanrove().subscribe(zanrovi=>{
        this.sviZanrovi = zanrovi;
        this.zanroviBrisanje = this.sviZanrovi.filter(zanr=> !zanroviKoriste.includes(zanr));
        this.isLoading = false;
      });
    });
  }

  obrisi(){
    if(this.zaBrisanje == null || this.zaBrisanje == ""){
      this.message = "Niste odabrali žanr za brisanje";
      return;
    }
    this.knjigeServis.izmeniZanrove(this.sviZanrovi.filter(zanr=>zanr != this.zaBrisanje)).subscribe(res=>{
      if(res["message"]=="ok"){
        this.message = "Uspešno obrisan žanr";
        this.sviZanrovi = this.sviZanrovi.filter(zanr=>zanr != this.zaBrisanje);
        this.zanroviBrisanje = this.zanroviBrisanje.filter(zanr=>zanr != this.zaBrisanje);
      }else{
        this.message = "Greška pri brisanju žanra";
      }
    });
  }

  dodajNovi(){
    if(this.noviZanr == null || this.noviZanr == ""){
      this.message = "Niste uneli vrednost";
      return;
    }
    if(this.sviZanrovi.includes(this.noviZanr)){
      this.message = "Već postoji uneti žanr";
      return;
    }
    this.sviZanrovi.push(this.noviZanr);
    this.knjigeServis.izmeniZanrove(this.sviZanrovi).subscribe(res=>{
      if(res["message"]=="ok"){
        this.message = "Uspešno dodat žanr";
        this.zanroviBrisanje.push(this.noviZanr);
      }else{
        this.message = "Greška pri dodavanju žanra";
        this.sviZanrovi.pop();
      }
    });
  }

}
