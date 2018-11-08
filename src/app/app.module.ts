import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegistrarComponent } from './registrar/registrar.component';
import { HomeComponent } from './client-access/home/home.component';
import { ErrorComponent } from './client-access/error/error.component';
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
import { EmployeeUsersComponent } from './client-access/admin/views/employee-users/employee-users.component';
import { TallaComponent } from './client-access/admin/views/talla/talla.component';
import { ColorComponent } from './client-access/admin/views/color/color.component';
import { BuscarComponent } from './client-access/buscar/buscar.component';
import { ListaDeseosComponent } from './client-access/users/views/lista-deseos/lista-deseos.component';
import { CarritoComponent } from './client-access/users/views/carrito/carrito.component';
import { MetodosPagoComponent } from './client-access/users/views/metodos-pago/metodos-pago.component';
import { ConfiguracionComponent } from './client-access/users/views/configuracion/configuracion.component';
import { ProductoComponent } from './client-access/producto/producto.component';
import { RecuperarComponent } from './recuperar/recuperar.component';
import { ReportarChatComponent } from './client-access/users/views/reportar-chat/reportar-chat.component';

export function Token(): string {
    return localStorage.getItem('token');
}

const app: Routes = [
    { path: 'login', component: LoginComponent, canActivate: [AuthGuardLogin] },
    { path: 'registrar', component: RegistrarComponent, canActivate: [AuthGuardLogin] },
    { path: 'home', component: HomeComponent },
    { path: 'recuperar/:token', component: RecuperarComponent },
    { path: 'buscar/:producto', component: BuscarComponent },
    { path: 'producto/:id', component: ProductoComponent },
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
        { path: '', redirectTo: 'categorias', pathMatch: 'full' },
        { path: 'colores', component: ColorComponent },
        { path: 'tallas', component: TallaComponent },
        { path: 'employees', component: EmployeeUsersComponent }
    ], canActivate: [AuthGuardAdmin] },
    { path: 'me', component: CpanelUserComponent, children: [
        { path: 'home', component: HomeUserComponent }, 
        { path: 'lista', component: ListaDeseosComponent },
        { path: 'carrito', component: CarritoComponent },
        { path: 'configuracion', component: ConfiguracionComponent },
        { path: 'reportar', component: ReportarChatComponent },
        { path: 'metodos', component: MetodosPagoComponent },
        { path: '', redirectTo: 'home', pathMatch: 'full' }
    ], canActivate: [AuthGuardClient] },
    { path: 'employee', component: EmployeeComponent, canActivate: [AuthGuardEmployee] },
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
        EmployeeComponent,
        EmployeeUsersComponent,
        TallaComponent,
        ColorComponent,
        BuscarComponent,
        ListaDeseosComponent,
        CarritoComponent,
        MetodosPagoComponent,
        ConfiguracionComponent,
        ProductoComponent,
        RecuperarComponent,
        ReportarChatComponent
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
                    'localhost:3500'
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
