import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import {MatInputModule} from '@angular/material/input';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatCardModule} from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
import {MatSelectModule} from '@angular/material/select';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTableModule} from '@angular/material/table';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatStepperModule} from '@angular/material/stepper';
import {MatCheckboxModule} from '@angular/material/checkbox';

import { ProfilComponent } from './profil/profil.component';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPassComponent } from './forgot-pass/forgot-pass.component';
import { KnjigaComponent } from './knjiga/knjiga.component';
import { KorisnikComponent } from './korisnik/korisnik.component';
import { DodajknjiguComponent } from './dodajknjigu/dodajknjigu.component';
import { PretragaknjigaComponent } from './pretragaknjiga/pretragaknjiga.component';
import { ListeknjigaComponent } from './listeknjiga/listeknjiga.component';
import { KomentariComponent } from './komentari/komentari.component';
import { PretragakorisnikaComponent } from './pretragakorisnika/pretragakorisnika.component';
import { OdobravanjeknjigaComponent } from './odobravanjeknjiga/odobravanjeknjiga.component';
import { OdobravanjekorisnikaComponent } from './odobravanjekorisnika/odobravanjekorisnika.component';
import { UredjivanjezanrovaComponent } from './uredjivanjezanrova/uredjivanjezanrova.component';
import { UpravljanjeulogamaComponent } from './upravljanjeulogama/upravljanjeulogama.component';
import { IzmenaknjigeComponent } from './izmenaknjige/izmenaknjige.component';
import { DodajkorisnikaComponent } from './dodajkorisnika/dodajkorisnika.component';
import { DodajdesavanjeComponent } from './dodajdesavanje/dodajdesavanje.component';
import { PregleddesavanjaComponent } from './pregleddesavanja/pregleddesavanja.component';

import { ChartsModule } from 'ng2-charts';
import { RecaptchaModule } from 'ng-recaptcha';
import { RatingModule } from 'ng-starrating';
import { ResetpassComponent } from './resetpass/resetpass.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ProfilComponent,
    ForgotPassComponent,
    KnjigaComponent,
    KorisnikComponent,
    DodajknjiguComponent,
    PretragaknjigaComponent,
    ListeknjigaComponent,
    KomentariComponent,
    PretragakorisnikaComponent,
    OdobravanjeknjigaComponent,
    OdobravanjekorisnikaComponent,
    UredjivanjezanrovaComponent,
    UpravljanjeulogamaComponent,
    IzmenaknjigeComponent,
    DodajkorisnikaComponent,
    DodajdesavanjeComponent,
    PregleddesavanjaComponent,
    ResetpassComponent
  ],
  imports: [
    MatCheckboxModule,
    MatStepperModule,
    RatingModule,
    MatExpansionModule,
    ChartsModule,
    MatProgressBarModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatListModule,
    MatCardModule,
    MatSidenavModule,
    MatGridListModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RecaptchaModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
