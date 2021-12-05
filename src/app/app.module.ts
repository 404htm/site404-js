import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PostSummaryComponent } from './post-summary/post-summary.component';
import { NavTopComponent } from './nav-top/nav-top.component';
import { NavSideComponent } from './nav-side/nav-side.component';

@NgModule({
  declarations: [
    AppComponent,
    NavTopComponent,
    NavSideComponent,
    PostSummaryComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
