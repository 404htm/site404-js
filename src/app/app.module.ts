import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PostSummaryComponent } from './post-summary/post-summary.component';
import { NavTopComponent } from './nav-top/nav-top.component';
import { NavSideComponent } from './nav-side/nav-side.component';
import { BackgroundComponent } from './background/background.component';
import { NoiseService } from './service/noise.service';

@NgModule({
  declarations: [
    AppComponent,
    NavTopComponent,
    NavSideComponent,
    PostSummaryComponent,
    BackgroundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [NoiseService],
  bootstrap: [AppComponent]
})
export class AppModule { }
