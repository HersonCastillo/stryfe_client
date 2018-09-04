import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';

const app: Routes = []

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent
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
