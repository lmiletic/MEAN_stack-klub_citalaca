import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { KnjigeService } from '../knjige.service';
import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/format-datepicker';

@Component({
  selector: 'app-dodajknjigu',
  templateUrl: './dodajknjigu.component.html',
  styleUrls: ['./dodajknjigu.component.css'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
})
export class DodajknjiguComponent implements OnInit {

  isLoading: boolean;
  form: FormGroup;
  slikaPregled: string;
  message: string;
  selektovaniZanrovi:string[];
  zanrovi:string[] = [];
  autori:string[] = [];
  brojAutora:number = 1;

  constructor(private servis: KnjigeService) { }

  ngOnInit(): void {
    this.isLoading = true;
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
      console.log(this.zanrovi);
      this.isLoading = false;
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

  clear(form: FormGroup): void {
    form.reset();
    Object.keys(form.controls).forEach(key =>{
       form.controls[key].setErrors(null)
    });
    this.autori = [];
    this.brojAutora = 1;
  }

  josAutora(){
    if(this.brojAutora<3){
      this.brojAutora++;
      this.autori.push("");
    }
  }


  izaberiSliku(event: Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({slika: file}); //dodaje file u formu
    this.form.get('slika').updateValueAndValidity();// informise Angular da je promenjana vrednost u formi, validuje
    //prikaz slike
    const reader = new FileReader();
    reader.onload = () =>{
      this.slikaPregled = reader.result.toString();
    }
    reader.readAsDataURL(file);
  }

  dodajKnjigu(): void {
    if(this.form.valid){
      const sviautori: string[] = [];
      sviautori.push(this.form.value.autori);
      for(let autor of this.autori){
        if(autor!=''){
          sviautori.push(autor);
        }
      }
      this.form.patchValue({autori:sviautori});
      this.servis.dodajKnjigu(this.form).subscribe(knjiga=>{
        if(knjiga['knjiga']=='ok'){
          this.message='Uspešno dodata knjiga';
          this.clear(this.form);
          console.log(this.message);
        }
        else{
          this.message = "Neuspešno dodata knjiga";
          console.log(this.message);
        }
      });
    }
  }

}
