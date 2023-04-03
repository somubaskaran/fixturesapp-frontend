import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatchlistComponent } from './matchlist/matchlist.component';
import { MatchdetailComponent } from './matchdetail/matchdetail.component';
import { PlayMatchesComponent } from './play-matches/play-matches.component';
const routes: Routes = [
  {
    path: 'list',
    component: MatchlistComponent
  },
  {
    path: '',
    component: MatchlistComponent
  },
  {
    path: 'detail',
    loadChildren: () => import('app/modules/admin/matches/matchdetail/matchdetail.module').then(m => m.MatchdetailModule)
  },{
    path: 'play-match',
    component: PlayMatchesComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MatchesRoutingModule { }
