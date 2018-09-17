import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegistrarComponent } from './registrar/registrar.component';
import { HomeComponent } from './home/home.component';
import { ErrorComponent } from './error/error.component';
import { CpanelAdminComponent } from './admin/cpanel/cpanel.component';
import { CategoriasComponent } from './admin/views/categorias/categorias.component';
import { CpanelUserComponent } from './users/cpanel/cpanel.component';
import { HomeUserComponent } from './users/views/home/home.component'

const app: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'registrar', component: RegistrarComponent },
    { path: 'home', component: HomeComponent },
    { path: 'admin', component: CpanelAdminComponent ,children: [
        { path: 'categorias', component: CategoriasComponent },
        { path: '', redirectTo: 'categorias', pathMatch: 'full' }
    ], canActivate: [] },
    { path: 'me', component: CpanelUserComponent, children: [
        { path: 'home', component: HomeUserComponent }, 
        { path: '', redirectTo: 'home', pathMatch: 'full' }
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
        CategoriasComponent,
        CpanelUserComponent,
        HomeUserComponent
    ],
    imports: [
        BrowserModule,
        RouterModule.forRoot(app, {
            preloadingStrategy: PreloadAllModules,
            useHash: false
        }),
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
