import { Component, OnInit } from '@angular/core';
import { KnjigeService } from '../knjige.service';
import { Knjiga } from '../models/knjiga';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-odobravanjeknjiga',
  templateUrl: './odobravanjeknjiga.component.html',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  styleUrls: ['./odobravanjeknjiga.component.css']
})
export class OdobravanjeknjigaComponent implements OnInit {

  isLoading:boolean;
  neodobreneKnjige: Knjiga[] = [];
  kolonePrikaz: string[] = ["naziv","autori","datumIzdavanja","zanrovi","odobravanje"];
  expandedKnjiga: Knjiga | null;

  constructor(private knjigeServis: KnjigeService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.knjigeServis.neodobreneKnjige().subscribe(knjige =>{
      this.neodobreneKnjige = knjige;
      console.log(this.neodobreneKnjige);
      this.isLoading = false;
    });
  }

  odobri(knjigaId:string){
    console.log("odobri");
    this.knjigeServis.odobriKnjigu(knjigaId).subscribe(res=>{
      if(res["message"]=="ok"){
        this.neodobreneKnjige = this.neodobreneKnjige.filter(knjiga=> knjiga._id != knjigaId);
      }
    });
  }

  izbrisi(knjigaId:string){
    console.log("izbrisi");
    this.knjigeServis.izbrisiKnjigu(knjigaId).subscribe(res=>{
      if(res["message"]=="1"){
        this.neodobreneKnjige = this.neodobreneKnjige.filter(knjiga=> knjiga._id != knjigaId);
      }
    });
  }


}
