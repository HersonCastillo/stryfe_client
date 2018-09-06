import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegistrarComponent } from './registrar/registrar.component';
import { HomeComponent } from './home/home.component';
import { ErrorComponent } from './error/error.component';
import { CpanelAdminComponent } from './admin/cpanel/cpanel.component';
import { CategoriasComponent } from './admin/views/categorias/categorias.component';

const app: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'registrar', component: RegistrarComponent },
    { path: 'home', component: HomeComponent },
    { path: 'admin', component: CpanelAdminComponent, children: [
        { path: 'categorias', component: CategoriasComponent },
        { path: '', redirectTo: 'categorias', pathMatch: 'full' }
    ], canActivate: [] },
    { path: 'error', component: ErrorComponent },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: '**', redirectTo: 'error', pathMatch: 'full' }
]

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        RegistrarComponent,
        HomeComponent,
        ErrorComponent,
        CpanelAdminComponent,
        CategoriasComponent
    ],
    imports: [
        BrowserModule,
        RouterModule.forRoot(app, {
            preloadingStrategy: PreloadAllModules,
            useHash: true
        })
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
