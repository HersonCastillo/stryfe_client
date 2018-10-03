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
import { CpanelAdminComponent } from './client-access/admin/cpanel/cpanel.component';
import { CategoriasComponent } from './client-access/admin/views/categorias/categorias.component';
import { CpanelUserComponent } from './client-access/users/cpanel/cpanel.component';
import { HomeUserComponent } from './client-access/users/views/home/home.component'
import { 
    AuthGuardLogin,
    AuthGuardAdmin, 
    AuthGuardClient, 
    AuthGuardEmployee 
} from './services/auth.guard';
import { AdminUsersComponent } from './client-access/admin/views/admin-users/admin-users.component';
import { ProductosComponent } from './client-access/admin/views/productos/productos.component';
import { DescuentosComponent } from './client-access/admin/views/descuentos/descuentos.component';

const app: Routes = [
    { path: 'login', component: LoginComponent, canActivate: [AuthGuardLogin] },
    { path: 'registrar', component: RegistrarComponent, canActivate: [AuthGuardLogin] },
    { path: 'home', component: HomeComponent },
    { path: 'admin', component: CpanelAdminComponent, children: [
        { path: 'categorias', component: CategoriasComponent },
        { path: '', redirectTo: 'categorias', pathMatch: 'full' }
    ], canActivate: [AuthGuardAdmin] },
    { path: 'me', component: CpanelUserComponent, children: [
        { path: 'home', component: HomeUserComponent }, 
        { path: '', redirectTo: 'home', pathMatch: 'full' }
    ], canActivate: [AuthGuardClient] },
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
        HomeUserComponent,
        AdminUsersComponent,
        ProductosComponent,
        DescuentosComponent
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
