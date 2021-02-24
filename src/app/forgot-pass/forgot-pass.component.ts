import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { KorisnickiService } from '../korisnicki.service';

@Component({
  selector: 'app-forgot-pass',
  templateUrl: './forgot-pass.component.html',
  styleUrls: ['./forgot-pass.component.css']
})
export class ForgotPassComponent implements OnInit {

  hide:boolean;
  message:string;
  sent: boolean;

  constructor(private ruter:Router, private servis:KorisnickiService) { }

  ngOnInit(): void {
    this.hide = true;
    this.message = '';
    this.sent = false;
  }

  email = new FormControl('', [Validators.required, Validators.email]);

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'Niste uneli email adresu';
    }
    return this.email.hasError('email') ? 'Email adresa nije validna' : '';
  }

  forgotPass(){
    if(this.email.valid){
      this.servis.forgotPass(this.email.value).subscribe(res =>{
        if(res["success"]== true){
          this.sent = true;
          this.message = "Reset mail je poslat na "+ this.email.value;
        }
        else{
          this.sent = false;
          this.message = "Uneti mail ne postoji u sistemu!";
        }
      });
    }
  }

}
