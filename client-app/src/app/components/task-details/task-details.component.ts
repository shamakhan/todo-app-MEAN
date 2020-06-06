import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss']
})
export class TaskDetailsComponent implements OnInit {
  @Input() task: any;
  @Input() dueDate: any;
  @Output() close: EventEmitter<any> = new EventEmitter();
  objectEntries = Object.entries

  constructor() { }

  ngOnInit(): void {
  }

}
