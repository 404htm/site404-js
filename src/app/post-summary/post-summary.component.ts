import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'post-summary',
  templateUrl: './post-summary.component.html'
})
export class PostSummaryComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  postTitle = 'Test Post Title'

}
