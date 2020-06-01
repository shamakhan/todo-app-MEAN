import { Component, OnInit } from '@angular/core';
import { TasksService } from '../../services/tasks.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  tasks: any = {};
  objectEntries = Object.entries;
  taskToEdit = null; 
  constructor(private taskService: TasksService) { }

  ngOnInit(): void {
    this.taskService.getTasks().subscribe((data: any) => {
      this.tasks = data.reduce((acc, task) => {
        let status = task.status.toLowerCase();
        if (!acc[status]) {
          acc[status] = [];
        }
        acc[status].push(task);
        return acc;
      }, {});
    });
  }

  taskAdded(task) {
    const status = task.status.toLowerCase();
    if (!this.tasks[status]) {
      this.tasks[status] = [];
    }
    this.tasks[status].push(task);
  }

  editTask(task) {
    this.taskToEdit = task;
  }

  taskEdited(task) {
    const status = task.status.toLowerCase();
    if (this.taskToEdit.status !== task.status) {
      this.tasks[status].push(task);
      const oldStatus = this.taskToEdit.status.toLowerCase();
      this.tasks[oldStatus] = this.tasks[oldStatus].filter(t => t._id !== task._id);
    } else {
      this.tasks[status] = this.tasks[status].map((t) => {
        if (t._id === task._id) {
          return task;
        }
        return t;
      });
    }
    this.taskToEdit = null;
  }

  closeEditDialog() {
    this.taskToEdit = null;
  }

  deleteTask(task) {
    this.taskService.deleteTask(task.id).subscribe((data: any) => {
      if (data.success) {
        this.tasks[task.listName.toLowerCase()] = this.tasks[task.listName.toLowerCase()].filter(t => t._id !== task.id);
      }
    })
  }

  changeTaskStatus(payload) {
    this.taskService.changeStatus(payload).subscribe((data: any) => {
      if (data.success) {
        this.tasks[payload.oldStatus] = this.tasks[payload.oldStatus].filter(t => t._id !== payload.id);
        this.tasks[payload.newStatus].push(data.task);
      }
    })
  }
}
