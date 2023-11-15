import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatchlistComponent } from './matchlist/matchlist.component';
import { MatchdetailComponent } from './matchdetail/matchdetail.component';
import { TourcategoryComponent } from './tourcategory/tourcategory.component';

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
    path: 'ready-to-play',
    loadChildren: () => import('app/modules/admin/matches/readtoplay/readytoplay.module').then(m => m.ReadytoplayModule)
  },{
    path: 'tour-category',
    component: TourcategoryComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MatchesRoutingModule { }
