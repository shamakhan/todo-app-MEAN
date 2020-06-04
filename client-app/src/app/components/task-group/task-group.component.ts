import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-task-group',
  templateUrl: './task-group.component.html',
  styleUrls: ['./task-group.component.scss']
})
export class TaskGroupComponent implements OnInit {
  @Input() tasks;
  @Input() groupName;
  @Input() showDueDate: boolean = true;
  @Output() editTask: EventEmitter<any> = new EventEmitter();
  @Output() deleteTask: EventEmitter<any> = new EventEmitter();
  @Output() changeTaskStatus: EventEmitter<any> = new EventEmitter();
  collapsed: boolean = false;
  listId: string;
  constructor() { }

  ngOnInit(): void {
    this.listId = `taskList${this.groupName}`;
  }

  toggleListCollapse() {
    this.collapsed = !this.collapsed;
  }

  onTaskEdit(task) {
    this.editTask.emit(task);
  }

  onTaskDelete(taskId) {
    const payload = {
      listName: this.groupName,
      id: taskId,
    }
    this.deleteTask.emit(payload);
  }

  onTaskStatusChange(payload) {
    this.changeTaskStatus.emit(payload);
  }
}
