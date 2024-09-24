import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { CODE_CHUNCKS, KEY_FEATURES } from './in-memory-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private router: Router) { }

  logoList = ['angular', 'tailwindcss', 'chart', 'state']
  navigationList = [
    { link: '/websocket', label: 'Websocket -> Chart.js'},
    { link: '/chat', label: 'Chat with comments'},
    { link: '/products', label: 'Products list (NGRX)'},
   ]
  keyCodeChunk = '';
  keyFeatures = '';

  ngOnInit() {
    this.router.events.pipe(
      filter((event: any) => event instanceof NavigationEnd),
      map((event: NavigationEnd) => event.url)
    ).subscribe(res => {
      let key = isNaN(+res.slice(-1)) ? res.slice(1) : res.slice(1, -1);
      // in order to handle correctly dynamic routes like '/products' and '/products/3'
      this.keyCodeChunk = CODE_CHUNCKS[key] ?? '';
      this.keyFeatures = KEY_FEATURES[key] ?? '';
  })
  }

}
