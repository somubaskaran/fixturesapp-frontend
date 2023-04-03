import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KittingListComponent } from './kitting-list/kitting-list.component';
import { KittingRoutingModule } from './kitting-routing.module';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SharedModule } from 'app/shared/shared.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [
    KittingListComponent
  ],
  imports: [
    CommonModule,
    KittingRoutingModule,
    MatButtonModule,
    MatInputModule,
    SharedModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    NgxDatatableModule,
    MatTooltipModule,
    MatPaginatorModule,
    NgxSpinnerModule
  ]
})
export class KittingModule { }
