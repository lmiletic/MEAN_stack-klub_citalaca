import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfilComponent } from './profil/profil.component';
import { ForgotPassComponent } from './forgot-pass/forgot-pass.component';
import { KnjigaComponent } from './knjiga/knjiga.component';
import { KorisnikComponent } from './korisnik/korisnik.component';
import { DodajknjiguComponent } from './dodajknjigu/dodajknjigu.component';
import { PretragaknjigaComponent } from './pretragaknjiga/pretragaknjiga.component';
import { AuthGuard } from './auth.guard';
import { ListeknjigaComponent } from './listeknjiga/listeknjiga.component';
import { KomentariComponent } from './komentari/komentari.component';
import { PretragakorisnikaComponent } from './pretragakorisnika/pretragakorisnika.component';
import { OdobravanjeknjigaComponent } from './odobravanjeknjiga/odobravanjeknjiga.component';
import { ModGuard } from './mod.guard';
import { OdobravanjekorisnikaComponent } from './odobravanjekorisnika/odobravanjekorisnika.component';
import { AdminGuard } from './admin.guard';
import { UredjivanjezanrovaComponent } from './uredjivanjezanrova/uredjivanjezanrova.component';
import { UpravljanjeulogamaComponent } from './upravljanjeulogama/upravljanjeulogama.component';
import { IzmenaknjigeComponent } from './izmenaknjige/izmenaknjige.component';
import { DodajkorisnikaComponent } from './dodajkorisnika/dodajkorisnika.component';
import { DodajdesavanjeComponent } from './dodajdesavanje/dodajdesavanje.component';
import { PregleddesavanjaComponent } from './pregleddesavanja/pregleddesavanja.component';
import { ResetpassComponent } from './resetpass/resetpass.component';


const routes: Routes = [
    {path: '',component: LoginComponent},
    {path: 'register',component: RegisterComponent},
    {path: 'resetpass/:id', component: ResetpassComponent},
    {path: 'profil', component: ProfilComponent,
     children: [
      {path: '', component: KorisnikComponent, canActivate: [AuthGuard]},
      {path: 'pregled/:id', component: KorisnikComponent, canActivate: [AuthGuard]},
      {path: 'knjiga/:id', component: KnjigaComponent},
      {path: 'dodajknjigu', component: DodajknjiguComponent, canActivate: [AuthGuard]},
      {path: 'listeknjiga', component: ListeknjigaComponent, canActivate: [AuthGuard]},
      {path: 'komentari', component: KomentariComponent, canActivate: [AuthGuard]},
      {path: 'dodajdesavanje', component: DodajdesavanjeComponent, canActivate: [AuthGuard]},
      {path: 'pretragakorisnika', component: PretragakorisnikaComponent, canActivate: [AuthGuard]},
      {path: 'odobravanjeknjiga', component: OdobravanjeknjigaComponent, canActivate: [AuthGuard,ModGuard]},
      {path: 'odobravanjekorisnika', component: OdobravanjekorisnikaComponent, canActivate: [AuthGuard,AdminGuard]},
      {path: 'upravljanjeulogama', component: UpravljanjeulogamaComponent, canActivate: [AuthGuard,AdminGuard]},
      {path: 'zanrovi', component: UredjivanjezanrovaComponent, canActivate: [AuthGuard,AdminGuard]},
      {path: 'izmenaknjige/:id', component: IzmenaknjigeComponent, canActivate: [AuthGuard,AdminGuard]},
      {path: 'dodajkorisnika', component: DodajkorisnikaComponent, canActivate: [AuthGuard,AdminGuard]},
      {path: 'pretragaknjiga', component: PretragaknjigaComponent},
      {path: 'pregleddesavanja', component: PregleddesavanjaComponent},
     ]},
    {path: 'forgotPass', component: ForgotPassComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
