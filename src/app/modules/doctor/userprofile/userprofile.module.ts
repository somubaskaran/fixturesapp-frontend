import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserprofileRoutingModule } from './userprofile-routing.module';
import { ListComponent } from './list/list.component';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SharedModule } from 'app/shared/shared.module';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [
    ListComponent
  ],
  imports: [
    CommonModule,
    UserprofileRoutingModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatCheckboxModule,
    NgxDatatableModule,
    MatPaginatorModule,
    SharedModule,
    NgxSpinnerModule
  ]
})
export class UserprofileModule {}
