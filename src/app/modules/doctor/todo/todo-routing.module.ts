import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';
import { TodoListComponent } from './todo-list/todo-list.component';

const adminRoutes: Route[] = [
    {
        path: 'list',
        component: TodoListComponent,
    },
    { path: '', component: TodoListComponent },
];

@NgModule({
    imports: [RouterModule.forChild(adminRoutes)],
    exports: [RouterModule],
})
export class TodoRoutingModule {}
