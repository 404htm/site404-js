import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'post-summary',
  templateUrl: './post-summary.component.html',
  styleUrls: ["./post-summary.component.scss"]
})
export class PostSummaryComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  postTitle = 'Test Post Title'

}
