import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientdetailComponent } from '../patientdetail/patientdetail.component';

const routes: Routes = [
  {
    
    path:'',
    component:PatientdetailComponent
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
export class PatientDetailRoutingModule { }
