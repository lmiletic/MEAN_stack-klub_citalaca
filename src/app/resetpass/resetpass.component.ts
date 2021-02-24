import { Component, OnInit } from '@angular/core';
import { Form, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { KorisnickiService } from '../korisnicki.service';

@Component({
  selector: 'app-resetpass',
  templateUrl: './resetpass.component.html',
  styleUrls: ['./resetpass.component.css']
})
export class ResetpassComponent implements OnInit {

  constructor(private route: ActivatedRoute, private korisnikServis: KorisnickiService, private auth: AuthService, private router: Router) { }

  hide:boolean = false;
  message:string;
  token:string;
  formLozinka: FormGroup;

  ngOnInit(): void {
    this.formLozinka = new FormGroup({
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
    this.token = this.route.snapshot.paramMap.get('id');
  }

  checkPasswords(group: FormGroup){
    if(group.value.ponovljenaNovaLozinka === group.value.novaLozinka){
      return null;
    } else{
      return { nisuIste: true }
    }
  }

  resetpass(){
    this.formLozinka.updateValueAndValidity();
    if(this.formLozinka.invalid){
      return;
    }
    this.korisnikServis.resetPass(this.formLozinka.value.novaLozinka, this.token).subscribe(res=>{
      if(res["token"]!=null){
        this.message = "Uspešno";
        this.auth.remember(this.token);
        this.auth.setTimeOut(3600*1000);
        this.auth.setTip(res["tip"]);
        this.router.navigate(['/profil']);
      }else{
        this.message = "Greška";
      }
      console.log(this.message);
    });
  }

}
