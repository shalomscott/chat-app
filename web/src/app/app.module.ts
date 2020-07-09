import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MessagingComponent } from './messaging/messaging.component';
import { MessageBubbleComponent } from './message-bubble/message-bubble.component';

@NgModule({
  declarations: [AppComponent, LoginComponent, MessagingComponent, MessageBubbleComponent],
  imports: [BrowserModule, ReactiveFormsModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
