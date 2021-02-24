import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { KnjigeService } from '../knjige.service';
import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/format-datepicker';
import { ActivatedRoute } from '@angular/router';
import { Knjiga } from '../models/knjiga';


@Component({
  selector: 'app-izmenaknjige',
  templateUrl: './izmenaknjige.component.html',
  styleUrls: ['./izmenaknjige.component.css'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
})
export class IzmenaknjigeComponent implements OnInit {


  isLoading: boolean;
  form: FormGroup;
  slikaPregled: string;
  message: string;
  selektovaniZanrovi:string[];
  zanrovi:string[] = [];
  autori:string[] = [];
  brojAutora:number;

  idKnjige:string;
  knjiga: Knjiga;
  izmenaSlike: boolean;

  constructor(private servis: KnjigeService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.idKnjige = this.route.snapshot.paramMap.get('id');
    this.izmenaSlike = false;
    this.form = new FormGroup({
      naziv: new FormControl(null,
        {validators:[
          Validators.required
         ]
        }
      ),
      autori: new FormControl(null,
        {validators:[
          Validators.required
         ]
        }
      ),
      slika: new FormControl(null,
        {validators:[
         ]
        }
      ),
      zanrovi: new FormControl(null,
        {validators:[
          Validators.required
         ]
        }
      ),
      opis: new FormControl(null,
        {validators:[
          Validators.required
         ]
        }
      ),
      datumIzdavanja: new FormControl(null,
        {validators:[
          Validators.required
         ]
        }
      )
    });
    this.servis.dohvatiZanrove().subscribe(zanrovi=>{
      this.zanrovi = zanrovi;
      this.servis.knjigaPrikaz(this.idKnjige).subscribe(knjiga=>{
        this.knjiga = knjiga;
        for(let i=1;i<this.knjiga.autori.length;i++){
          this.autori.push(this.knjiga.autori[i]);
        }
        this.brojAutora = this.knjiga.autori.length;
        this.slikaPregled = this.knjiga.slika;
        this.form.patchValue({naziv: knjiga.naziv});
        this.form.patchValue({autori: knjiga.autori[0]});
        this.form.patchValue({slika: knjiga.slika});
        this.form.patchValue({zanrovi: knjiga.zanrovi});
        this.form.patchValue({opis: knjiga.opis});
        this.form.patchValue({datumIzdavanja: knjiga.datumIzdavanja});
        this.isLoading = false;
      });
    });
  }

  trackByFn(index, item) {
    return index;
  }

  changed() {
    if (this.form.get('zanrovi').value.length <= 3) {
      this.selektovaniZanrovi = this.form.get('zanrovi').value;
    } else {
      this.form.patchValue({zanrovi: this.selektovaniZanrovi});
    }
  }


  josAutora(){
    if(this.brojAutora<3){
      this.brojAutora++;
      this.autori.push("");
    }
  }


  izaberiSliku(event: Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.izmenaSlike = true;
    this.form.patchValue({slika: file}); //dodaje file u formu
    this.form.get('slika').updateValueAndValidity();// informise Angular da je promenjana vrednost u formi, validuje
    //prikaz slike
    const reader = new FileReader();
    reader.onload = () =>{
      this.slikaPregled = reader.result.toString();
    }
    reader.readAsDataURL(file);
  }

  izmeniKnjigu(): void {
    console.log(this.form);
    if(this.form.valid){
      let sviautori: string[] = [];
      sviautori.push(this.form.value.autori);
      for(let autor of this.autori){
        if(autor!=''){
          sviautori.push(autor);
        }
      }
      this.form.patchValue({autori:sviautori});
      this.servis.izmeniKnjigu(this.idKnjige,this.form, this.izmenaSlike).subscribe(knjiga=>{
        if(knjiga['knjiga']=='ok'){
          this.message='Uspešno izmenjena knjiga';
        }
        else{
          this.message = "Neuspešno izmenjena knjiga";
        }
        this.form.patchValue({autori:sviautori[0]});
      });
    }
  }
}
