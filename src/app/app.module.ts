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
import { SubcategoriasComponent } from './client-access/admin/views/subcategorias/subcategorias.component';
import { JwtModule } from '@auth0/angular-jwt';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EmployeeComponent } from './client-access/employee/employee/employee.component';

export function Token(): string {
    let token: string = localStorage.getItem('token');
    if(token != null && token.length > 150) return token;
    return null;
}

const app: Routes = [
    { path: 'login', component: LoginComponent, canActivate: [AuthGuardLogin] },
    { path: 'registrar', component: RegistrarComponent, canActivate: [AuthGuardLogin] },
    { path: 'home', component: HomeComponent },
    { path: 'admin', component: CpanelAdminComponent, children: [
        { path: 'categorias', children: [
            { path: 'categorias', component: CategoriasComponent },
            { path: 'subcategorias', component: SubcategoriasComponent },
            { path: '', redirectTo: 'categorias', pathMatch: 'full' }
        ] },
        { path: 'productos', children: [
            { path: 'productos', component: ProductosComponent },
            { path: 'descuentos', component: DescuentosComponent },
            { path: '', redirectTo: 'productos', pathMatch: 'full' }
        ] },
        { path: 'administrators', component: AdminUsersComponent },
        { path: '', redirectTo: 'categorias', pathMatch: 'full' }
    ], canActivate: [AuthGuardAdmin] },
    { path: 'me', component: CpanelUserComponent, children: [
        { path: 'home', component: HomeUserComponent }, 
        { path: '', redirectTo: 'home', pathMatch: 'full' }
    ], canActivate: [AuthGuardClient] },
    { path: 'employee', component: EmployeeComponent },
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
        DescuentosComponent,
        SubcategoriasComponent,
        EmployeeComponent
    ],
    imports: [
        BrowserModule,
        RouterModule.forRoot(app, {
            preloadingStrategy: PreloadAllModules,
            useHash: false
        }),
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        JwtModule.forRoot({
            config: {
                tokenGetter: Token,
                whitelistedDomains: [
                    'localhost:3500',
                    'localhost:4200'
                ],
                skipWhenExpired: true
            }
        }),
        BrowserAnimationsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
