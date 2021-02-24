import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatVerticalStepper } from '@angular/material/stepper';
import { AppDateAdapter, APP_DATE_FORMATS } from '../format-datepicker';
import { KorisnickiService } from '../korisnicki.service';
import { Desavanje } from '../models/desavanje';

@Component({
  selector: 'app-dodajdesavanje',
  templateUrl: './dodajdesavanje.component.html',
  styleUrls: ['./dodajdesavanje.component.css'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
})
export class DodajdesavanjeComponent implements OnInit {

  isLoading: boolean = false;
  tipovi: string[] = [];

  pocetak: boolean = false;
  kraj: boolean = false;

  nazivFormGroup: FormGroup;
  tipFormGroup: FormGroup;
  pocetakFormGroup: FormGroup;
  krajFormGroup: FormGroup;
  opisFormGroup: FormGroup;

  message: string ="";



  constructor(private _formBuilder: FormBuilder, private korisnikServis: KorisnickiService) {}

  ngOnInit() {
    this.isLoading = true;
    this.nazivFormGroup = this._formBuilder.group({
      nazivCtrl: ['', Validators.required]
    });
    this.tipFormGroup = this._formBuilder.group({
      tipCtrl: ['', Validators.required]
    });
    this.pocetakFormGroup = this._formBuilder.group({
      pocetakCtrl: ['', Validators.required]
    });
    this.krajFormGroup = this._formBuilder.group({
      krajCtrl: ['', Validators.required]
    });
    this.opisFormGroup = this._formBuilder.group({
      opisCtrl: ['', Validators.required]
    });
    this.korisnikServis.korisnickiPodaci().subscribe(korisnik =>{
      if(korisnik.tip == "admin" || korisnik.tip == "moderator"){
        this.tipovi.push("javno");
      }
      this.tipovi.push("privatno");
      this.isLoading = false;
    });
  }

  disablePocetak(value: boolean){
    this.pocetak = value;
    if(value){
      this.pocetakFormGroup.disable();
    }else{
      this.pocetakFormGroup.enable();
    }
  }

  disableKraj(value: boolean){
    this.kraj = value;
    if(value){
      this.krajFormGroup.disable();
    }else{
      this.krajFormGroup.enable();
    }
  }

  napravi(stepper: MatVerticalStepper){
    if(this.opisFormGroup.valid){
      let poc = '';
      let kr = '';
      if(!this.pocetak){
        poc = this.pocetakFormGroup.get('pocetakCtrl').value;
      }
      if(!this.kraj){
        kr = this.krajFormGroup.get('krajCtrl').value;
      }
      const desavanje:Desavanje = {
        naziv: this.nazivFormGroup.get('nazivCtrl').value,
        tip: this.tipFormGroup.get('tipCtrl').value,
        datumPocetka: poc,
        datumKraja: kr,
        opis: this.opisFormGroup.get('opisCtrl').value,
        korisnickoIme: ''
      }
      this.korisnikServis.dodajDesavanje(desavanje).subscribe(res=>{
        if(res["message"]=="ok"){
          this.message = "Uspešno napravljeno dešavanje";
          stepper.reset();
        }else{
          this.message = "Neuspešno napravljeno dešavanje";
        }
      });
    }
  }

}
