import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatientaddRoutingModule } from './patientadd-routing.module';
import { PatientaddComponent } from './patientadd.component';


@NgModule({
  declarations: [
    PatientaddComponent
  ],
  imports: [
    CommonModule,
    PatientaddRoutingModule
  ]
})
export class PatientaddModule { }
