import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './component/user/login/login.component';
import { FtransferComponent } from './component/banking/ftransfer/ftransfer.component';
import { TxnhistoryComponent } from './component/banking/txnhistory/txnhistory.component';
import { NotFoundComponent } from './component/resource/not-found/not-found.component';
import { AuthGuard } from './guard/auth.guard';
import { ProfileComponent } from './component/user/profile/profile.component';
import { RegbenefComponent } from './component/banking/regbenef/regbenef.component';

/**
 * @description Application Routing
 */
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'reg-benef', component: RegbenefComponent, canActivate: [AuthGuard] },
  { path: 'transfer', component: FtransferComponent, canActivate: [AuthGuard] },
  { path: 'transaction', component: TxnhistoryComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
