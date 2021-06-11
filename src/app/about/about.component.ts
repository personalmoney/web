import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  vesion: string;

  constructor() { }

  ngOnInit(): void {
    this.vesion = environment.appVersion;
  }

}
