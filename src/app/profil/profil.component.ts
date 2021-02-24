import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit, OnDestroy {


  private adminSub: Subscription;
  private modSub: Subscription;

  isLogged:boolean = false;
  isMod: boolean = false;
  isAdmin: boolean = false;

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    this.isLogged = this.auth.isLogged();
    this.isAdmin = this.auth.isAdmin();
    this.isMod = this.auth.isMod();
    this.adminSub = this.auth.isAdminListener().subscribe(isAdmin =>{
      this.isAdmin = isAdmin;
    });
    this.modSub = this.auth.isModListener().subscribe(isMod =>{
      this.isMod = isMod;
    });
  }

  ngOnDestroy(): void{
    this.adminSub.unsubscribe();
    this.modSub.unsubscribe();
  }


}
