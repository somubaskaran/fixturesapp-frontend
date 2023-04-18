import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReadyToPlayRoutingModule } from './readytoplay.routing.module';
import { ReadtoplayComponent } from './readytoplay/readtoplay.component';
import { PlayMatchesComponent } from './play-matches/play-matches.component';
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

@NgModule({
  declarations: [
    ReadtoplayComponent,
    PlayMatchesComponent
  ],
  imports: [
    CommonModule,
    ReadyToPlayRoutingModule,
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
export class ReadytoplayModule { }
