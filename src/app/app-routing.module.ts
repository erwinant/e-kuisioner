import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SigninComponent } from './signin/signin.component';
import { LandingComponent } from './landing/landing.component';
import { AuthguardService } from './authguard.service';
import { EditorComponent } from './editor/editor.component';


const appRoutes: Routes = [
  { path: 'landing', component: LandingComponent, canActivate: [AuthguardService], data: { state: 'landing' }},
  { path: 'editor', component: EditorComponent, canActivate: [AuthguardService], data: { state: 'editor' }},
  { path: 'signin', component: SigninComponent, data: { state: 'signin' } },
  { path: '**', redirectTo: 'landing' }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }