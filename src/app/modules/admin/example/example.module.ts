import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { ExampleComponent } from 'app/modules/admin/example/example.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

const exampleRoutes: Route[] = [
    {
        path: '',
        component: ExampleComponent,
    },
];

@NgModule({
    declarations: [ExampleComponent],
    imports: [
        RouterModule.forChild(exampleRoutes),
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
    ],
})
export class ExampleModule {}
