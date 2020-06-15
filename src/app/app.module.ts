import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from './component/header/header.component';
import { LoginComponent } from './component/user/login/login.component';
import { ProfileComponent } from './component/user/profile/profile.component';
import { FtransferComponent } from './component/banking/ftransfer/ftransfer.component';
import { TxnhistoryComponent } from './component/banking/txnhistory/txnhistory.component';
import { FooterComponent } from './component/footer/footer.component';
import { NotFoundComponent } from './component/resource/not-found/not-found.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { HttpService } from './service/http/http.service';
import { AuthGuard } from './guard/auth.guard';
import { AuthService } from './service/auth/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegbenefComponent } from './component/banking/regbenef/regbenef.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    ProfileComponent,
    FtransferComponent,
    TxnhistoryComponent,
    FooterComponent,
    NotFoundComponent,
    RegbenefComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [HttpService, AuthGuard, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
