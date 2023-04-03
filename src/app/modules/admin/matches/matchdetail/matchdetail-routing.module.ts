import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatchdetailComponent } from './matchdetail.component';

const routes: Routes = [
  {
    
    path:'',
    component:MatchdetailComponent
  },
  {path: '', pathMatch : 'full', redirectTo: ''}
  /* ,
  {
    path:'patient-list',
    component:PatientlistComponent
  } */
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MatchDetailRoutingModule { }
