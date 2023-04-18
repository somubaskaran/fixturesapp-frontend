import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReadtoplayComponent } from './readytoplay/readtoplay.component';
import { PlayMatchesComponent } from './play-matches/play-matches.component';

const routes: Routes = [
  {
    path: '',
    component: ReadtoplayComponent
  },
  {
    path: 'play-match',
    component: PlayMatchesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReadyToPlayRoutingModule { }
