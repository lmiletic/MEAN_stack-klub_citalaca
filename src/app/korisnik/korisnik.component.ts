import { Component, OnInit } from '@angular/core';
import { Korisnik } from '../models/korisnik';
import { ActivatedRoute, Router } from '@angular/router';
import { KorisnickiService } from '../korisnicki.service';
import { FormControl, Validators, FormGroup, AbstractControl, ValidatorFn } from '@angular/forms';
import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/format-datepicker';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-korisnik',
  templateUrl: './korisnik.component.html',
  styleUrls: ['./korisnik.component.css'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
})
export class KorisnikComponent implements OnInit {

  hide:boolean = true;
  izmena:boolean = false;
  lozinka:boolean = false;
  isLoading:boolean = false;
  korisnik: Korisnik;
  formProfil: FormGroup;
  formLozinka: FormGroup;
  message: string;

  profilPregled:boolean = false;
  pregledId:string;
  pratim:boolean = false;
  loginStatus: string;
  lastTime: Date = null;

  constructor(private servis: KorisnickiService,private auth: AuthService,private router: Router,private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.isLoading = true;
    if(this.route.snapshot.paramMap.get('id')!=null){
      this.profilPregled = true;
      this.pregledId = this.route.snapshot.paramMap.get('id');
      console.log(this.pregledId);
      this.servis.loginInfo(this.pregledId).subscribe((res)=>{
        if(res["message"]){
          this.loginStatus = res["message"];
        }else{
          console.log(res);
          const lastLogin:Date = new Date(res["lastLogin"]);
          if(res["lastLogout"]==null){
            if(Date.now()-60*60*1000>lastLogin.getTime()){
              this.loginStatus="Poslednji put aktivan";
              this.lastTime = lastLogin;
            }else{
              this.loginStatus = "Aktivan";
            }
          }else{
            const lastLogout:Date = new Date(res["lastLogout"]);
            if(lastLogout>=lastLogin){
              this.loginStatus="Poslednji put aktivan";
              this.lastTime = lastLogout;
            }else{
              if(Date.now()-60*60*1000>lastLogin.getTime()){
                this.loginStatus="Poslednji put aktivan";
                this.lastTime = lastLogin;
              }else{
                this.loginStatus = "Aktivan";
              }
            }
          }
        }
        console.log(this.loginStatus);
      });
      this.servis.korisnikPregled(this.pregledId).subscribe((res) => {
        if(res["message"]==null){
          const korisnik :Korisnik ={
            ime: res['ime'],
            prezime: res['prezime'],
            korisnickoIme: res['korisnickoIme'],
            datumRodjenja: res['datumRodjenja'],
            drzava: res['drzava'],
            grad: res['grad'],
            email: res['email'],
            slika: res['slika'],
            tip: res['tip'],
            odobren: res['odobren']
          };
          this.korisnik = korisnik;
          this.formProfil.patchValue({ime: this.korisnik.ime});
          this.formProfil.patchValue({prezime: this.korisnik.prezime});
          this.formProfil.patchValue({korisnickoIme: this.korisnik.korisnickoIme});
          this.formProfil.patchValue({email: this.korisnik.email});
          this.formProfil.patchValue({datumRodjenja: this.korisnik.datumRodjenja});
          this.formProfil.patchValue({grad: this.korisnik.grad});
          this.formProfil.patchValue({drzava: this.korisnik.drzava});
          this.isLoading = false;
        }else{
          this.router.navigate(['/profil']);
        }
      });
    }else{
      this.profilPregled = false;
      this.servis.loginInfo(this.pregledId).subscribe((res)=>{
        if(res["message"]){
          this.loginStatus = res["message"];
        }else{
          console.log(res);
          const lastLogin:Date = new Date(res["lastLogin"]);
          if(res["lastLogout"]==null){
            if(Date.now()-60*60*1000>lastLogin.getTime()){
              this.loginStatus="Poslednji put aktivan";
              this.lastTime = lastLogin;
            }else{
              this.loginStatus = "Aktivan";
            }
          }else{
            const lastLogout:Date = new Date(res["lastLogout"]);
            if(lastLogout>=lastLogin){
              this.loginStatus="Poslednji put aktivan";
              this.lastTime = lastLogout;
            }else{
              if(Date.now()-60*60*1000>lastLogin.getTime()){
                this.loginStatus="Poslednji put aktivan";
                this.lastTime = lastLogin;
              }else{
                this.loginStatus = "Aktivan";
              }
            }
          }
        }
        console.log(this.loginStatus);
      });
      this.servis.korisnickiPodaci().subscribe((korisnik) => {
        this.korisnik = korisnik;
        this.formProfil.patchValue({ime: this.korisnik.ime});
        this.formProfil.patchValue({prezime: this.korisnik.prezime});
        this.formProfil.patchValue({korisnickoIme: this.korisnik.korisnickoIme});
        this.formProfil.patchValue({email: this.korisnik.email});
        this.formProfil.patchValue({datumRodjenja: this.korisnik.datumRodjenja});
        this.formProfil.patchValue({grad: this.korisnik.grad});
        this.formProfil.patchValue({drzava: this.korisnik.drzava});
        this.isLoading = false;
      });
    }

    this.formProfil = new FormGroup({
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
      datumRodjenja: new FormControl(null),
      drzava: new FormControl(null),
      grad: new FormControl(null)
    });
    this.formLozinka = new FormGroup({
      lozinka: new FormControl(null,
        {validators:[
          Validators.required,
          Validators.pattern('^(?=[A-Za-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[^A-Za-z0-9]).{7,}$')
         ]
        }
      ),
      novaLozinka: new FormControl(null,
        {validators:[
          Validators.required,
          Validators.pattern('^(?=[A-Za-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[^A-Za-z0-9]).{7,}$')
         ]
        }
      ),
      ponovljenaNovaLozinka: new FormControl(null,
        {validators:[
          Validators.required,
          Validators.pattern('^(?=[A-Za-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[^A-Za-z0-9]).{7,}$')
         ]
        }
      )
    },this.checkPasswords);
  }


  checkPasswords(group: FormGroup){
    if(group.value.ponovljenaNovaLozinka === group.value.novaLozinka){
      return null;
    } else{
      return { nisuIste: true }
    }
  }

  promeniSliku(event: Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.servis.promeniSliku(file, this.korisnik.korisnickoIme).subscribe(res =>{
      if(res['slika']=='Uspesno'){
        this.ngOnInit();
      }else{
        console.log("Greska pri promeni slike");
      }
    });
  }

  izmeni(){
    this.izmena = true;
  }

  sacuvaj(){
    this.formProfil.updateValueAndValidity();
    if(this.formProfil.invalid){
      return;
    }
    if(this.formProfil.value.ime != this.korisnik.ime || this.formProfil.value.prezime != this.korisnik.prezime
      || this.formProfil.value.email != this.korisnik.email || this.formProfil.value.korisnickoIme != this.korisnik.korisnickoIme
      || this.formProfil.value.datumRodjenja != this.korisnik.datumRodjenja || this.formProfil.value.drzava != this.korisnik.drzava
      || this.formProfil.value.grad != this.korisnik.grad){
        let promenaKor = false;
        if(this.formProfil.value.korisnickoIme != this.korisnik.korisnickoIme){
          promenaKor = true;
        }
        this.servis.promeniPodatke(this.formProfil).subscribe(korisnik=>{
          if(korisnik['korisnik']=='ok'){
            this.message='Uspešna promena podataka';
            this.izmena = false;
            if(promenaKor){
              this.auth.forget();
            }else{
              this.ngOnInit();
            }
          }
          else{
            this.message = "Neuspešna promena podataka";
            if(korisnik["korisnickoIme"]==true){
              this.formProfil.controls['korisnickoIme'].setErrors({'usedUser': true});
            }
            if(korisnik["email"]==true){
              this.formProfil.controls['email'].setErrors({'usedEmail': true});
            }
          }
        });
      }else{
        this.izmena = false;
      }
  }

  promeniLozinku(){
    this.lozinka = true;
  }

  promeni(){
    this.formLozinka.updateValueAndValidity();
    if(this.formLozinka.invalid){
      return;
    }
    if(this.formLozinka.value.lozinka != this.formLozinka.value.novaLozinka){
      this.servis.promeniLozinku(this.formLozinka).subscribe(res =>{
        if(res['korisnik']=='ok'){
          this.message='Uspešna promena lozinke';
          this.auth.forget();
        }
        if(res['korisnik']=='NisuIste'){
          this.message='Uneta pogrešna lozinka';
        }
        if(res['korisnik']=='no'){
          this.message = "Neuspešna promena lozinke";
        }
      });
    }else{
      this.message = "Nova i stara loznika su iste"
    }
  }

  zaprati(){
    this.pratim = true;
  }

  otprati(){
    this.pratim = false;
  }



}
