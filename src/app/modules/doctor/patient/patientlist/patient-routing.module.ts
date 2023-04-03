import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientlistComponent } from '../patientlist/patientlist.component';

const routes: Routes = [
  {
    
    path:'',
    component:PatientlistComponent
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
export class PatientListRoutingModule { }
