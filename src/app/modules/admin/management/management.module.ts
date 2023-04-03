import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagementRoutingModule } from './management-routing.module';
import { ListComponent } from './list/list.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSelectModule} from '@angular/material/select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxSpinnerModule } from 'ngx-spinner';
import {MatPaginatorModule} from '@angular/material/paginator';
import { SharedModule } from 'app/shared/shared.module';


@NgModule({
  declarations: [
    ListComponent,
  ],
  imports: [
    CommonModule,
    ManagementRoutingModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatTooltipModule,
    MatSelectModule,
    NgxDatatableModule,
    NgxSpinnerModule,
    MatPaginatorModule,
    SharedModule
  ]
})
export class ManagementModule { }
