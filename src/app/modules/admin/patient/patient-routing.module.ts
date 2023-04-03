import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientlistComponent } from './patientlist/patientlist.component';

const routes: Routes = [
  {
    path: 'list',
    component: PatientlistComponent
  },
  {
    path: '',
    component: PatientlistComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientRoutingModule { }
