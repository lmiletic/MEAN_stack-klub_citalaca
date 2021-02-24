import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { KorisnickiService } from '../korisnicki.service';
import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/format-datepicker';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
})
export class RegisterComponent implements OnInit {

  hide:boolean = true;
  message:string;
  form: FormGroup;
  slikaPregled: string;
  captchaPassed:boolean = false;



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

  resolved(token: string) {
    this.servis.captcha(token).subscribe(apiRes =>{
      //console.log(apiRes);
      if(apiRes["success"]==true){
        this.captchaPassed=true;
      }else{
        this.captchaPassed=false;
      }
    });
  }

  checkPasswords(group: FormGroup) {
  let lozinka = group.get('lozinka').value;
  let ponovljenaLozinka = group.get('ponovljenaLozinka').value;

  return lozinka === ponovljenaLozinka ? null : { nisuIste: true }
  }

  register(): void {
    if(this.form.valid){
      this.servis.register(this.form, false).subscribe(korisnik=>{
        if(korisnik['korisnik']=='ok'){
          this.message='Uspešna registracija';
          console.log(this.message);
          this.ruter.navigate(['/']);
        }
        else{
          this.message = "Neuspešna registracija";
          console.log(this.message);
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


