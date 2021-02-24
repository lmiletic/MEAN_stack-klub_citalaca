import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { Router } from '@angular/router';
import { AppDateAdapter, APP_DATE_FORMATS } from '../format-datepicker';
import { KorisnickiService } from '../korisnicki.service';

@Component({
  selector: 'app-dodajkorisnika',
  templateUrl: './dodajkorisnika.component.html',
  styleUrls: ['./dodajkorisnika.component.css'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
})
export class DodajkorisnikaComponent implements OnInit {

  hide:boolean = true;
  message:string;
  form: FormGroup;
  slikaPregled: string;



  constructor(private ruter: Router, private servis: KorisnickiService) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      ime: new FormControl(null,
        {validators:[
          Validators.required
         ]
        }
      ),
      prezime: new FormControl(null,
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
      email: new FormControl(null,
        {validators:[
          Validators.required,
          Validators.email
         ]
        }
      ),
      korisnickoIme: new FormControl(null,
        {validators:[
          Validators.required
         ]
        }
      ),
      lozinka: new FormControl(null,
        {validators:[
          Validators.required,
          Validators.pattern('^(?=[A-Za-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[^A-Za-z0-9]).{7,}$')
         ]
        }
      ),
      ponovljenaLozinka: new FormControl(null,
        {validators:[
          Validators.required,
          Validators.pattern('^(?=[A-Za-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[^A-Za-z0-9]).{7,}$')
         ]
        }
      ),
      datumRodjenja: new FormControl(null,
        {validators:[
          Validators.required
         ]
        }
      ),
      drzava: new FormControl(null,
        {validators:[
          Validators.required
         ]
        }
      ),
      grad: new FormControl(null,
        {validators:[
          Validators.required
         ]
        }
      )
    }, this.checkPasswords);
  }


  checkPasswords(group: FormGroup) {
  let lozinka = group.get('lozinka').value;
  let ponovljenaLozinka = group.get('ponovljenaLozinka').value;

  return lozinka === ponovljenaLozinka ? null : { nisuIste: true }
  }

  register(): void {
    if(this.form.valid){
      this.servis.register(this.form, true).subscribe(korisnik=>{
        if(korisnik['korisnik']=='ok'){
          this.message='Uspešno dodat novi korisnik';
        }
        else{
          this.message = "Neuspešno dodavanje novog korisnika";
          if(korisnik["korisnickoIme"]==true){
            this.form.controls['korisnickoIme'].setErrors({'usedUser': true});
          }
          if(korisnik["email"]==true){
            this.form.controls['email'].setErrors({'usedEmail': true});
          }
        }
      });
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

}
