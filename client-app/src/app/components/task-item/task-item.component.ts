import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { statuses } from '../task-settings/constants';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss']
})
export class TaskItemComponent implements OnInit {
  @Input() task;
  @Output() editTask: EventEmitter<any> = new EventEmitter();
  @Output() deleteTask: EventEmitter<any> = new EventEmitter();
  @Output() changeTaskStatus: EventEmitter<any> = new EventEmitter();
  objectEntries = Object.entries;
  statuses = statuses
  status: String;

  constructor() { }

  ngOnInit(): void {
    this.task.labels = this.task.labels || {}
    this.status = this.task.status.toLowerCase();
  }

  editTaskClicked() {
    this.editTask.emit(this.task);
  }

  onDeleteClick() {
    this.deleteTask.emit(this.task._id);
  }

  onStatusChange() {
    const payload = {
      oldStatus: this.task.status,
      newStatus: this.status,
      id: this.task._id
    };
    this.changeTaskStatus.emit(payload);
  }
}
