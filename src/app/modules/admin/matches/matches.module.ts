import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchesRoutingModule } from './matches-routing.module';
import { MatchlistComponent } from './matchlist/matchlist.component';
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
import {MatCardModule} from '@angular/material/card';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { TourcategoryComponent } from './tourcategory/tourcategory.component';

@NgModule({
  declarations: [
    MatchlistComponent,
    TourcategoryComponent,
  ],
  imports: [
    CommonModule,
    MatchesRoutingModule,
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
    NgxSpinnerModule,
    MatCardModule,
    MatSlideToggleModule
  ],
})
export class MatchesModule { }
