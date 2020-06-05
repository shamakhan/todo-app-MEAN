import { Component, OnInit } from '@angular/core';
import { TasksService } from '../../services/tasks.service';
import { filter } from 'rxjs/operators';
import { Map, List, fromJS } from 'immutable';
import * as moment from 'moment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  tasks: any = Map();
  objectEntries = Object.entries;
  taskToEdit = null; 
  labels: any = [];
  filteredTasks: any = Map();
  filters: any = {};
  constructor(private taskService: TasksService) { }
  immutableList = List;

  ngOnInit(): void {
    this.taskService.getTasks().subscribe((data: any) => {
      let labels = [];
      this.tasks = fromJS(data.reduce((acc, task) => {
        let status = task.status.toLowerCase();
        if (!acc[status]) {
          acc[status] = [];
        }
        acc[status].push(task);
        if (!task.labels || task.labels instanceof Array) {
          task.labels = {};
        }
        labels = labels.concat(Object.keys(task.labels));
        return acc;
      }, {}));
      this.labels = Array.from(new Set(labels));
      this.filteredTasks = fromJS(this.tasks);
      // debugger;
    });
  }

  taskAdded(task) {
    const status = task.status.toLowerCase();
    this.tasks = this.tasks.update(status, List(), (list) => list.push(fromJS(task)));
    if (this.applyFilterOnTask(task)) {
      this.filteredTasks = this.filteredTasks.update(status, List(), (list) => list.push(fromJS(task)));
    }
    this.labels = Array.from(new Set(this.labels.concat(Object.keys(task.labels || {}))));
  }

  editTask(task) {
    this.taskToEdit = task;
  }

  taskEdited(task) {
    const status = task.status.toLowerCase();
    if (this.taskToEdit.status !== task.status) {
      this.tasks = this.tasks.update(status, List(), (list) => list.push(fromJS(task)));
      const oldStatus = this.taskToEdit.status.toLowerCase();
      this.tasks = this.tasks.update(oldStatus, List(), (list) => list.filter(t => t.get('_id') !== task.get('_id')));
    } else {
      this.tasks = this.tasks.update(status, List(), (list) => list.map((t) => {
        if (t.get('_id') === task._id) {
          return fromJS(task);
        }
        return t;
      }));
    }
    this.applyFilters();
    this.taskToEdit = null;
    this.labels = Array.from(new Set(this.labels.concat(Object.keys(task.labels || {}))));
  }

  closeEditDialog() {
    this.taskToEdit = null;
  }

  deleteTask(task) {
    this.taskService.deleteTask(task.id).subscribe((data: any) => {
      if (data.success) {
        this.tasks = this.tasks.update(task.listName.toLowerCase(), (list) => list.filter(t => t.get('_id') !== task.id));
        this.filteredTasks = this.filteredTasks.update(task.listName.toLowerCase(), (list) => list.filter(t => t.get('_id') !== task.id));
      }
    })
  }

  changeTaskStatus(payload) {
    this.taskService.changeStatus(payload).subscribe((data: any) => {
      if (data.success) {
        this.tasks = this.tasks.update(payload.oldStatus, (list) => list.filter(t => t.get('_id') !== payload.id));
        this.tasks = this.tasks.update(payload.newStatus, List(), (list) => list.push(fromJS(data.task)));
        this.applyFilters();
      }
    })
  }

  filtersChanged(filters) {
    this.filters = filters;
    this.applyFilters();
  }

  applyFilters() {
    if (Object.keys(this.filters).length === 0) {
      this.filteredTasks = this.tasks;
    }
    this.filteredTasks = this.tasks.reduce((acc, list, status) => {
      return acc.set(status, list.filter((task) => this.applyFilterOnTask(task)));
    }, Map());
  }

  applyFilterOnTask(task) {
    if (this.filters.label && (!task.get('labels') || !task.getIn(['labels', this.filters.label]))) return false;
    if (this.filters.date && moment(task.get(this.filters.dateFilterName)).format('YYYY-MM-DD') !== this.filters.date) return false;
    if (this.filters.search && (!task.get('title').toLowerCase().match(this.filters.search.toLowerCase()) && !task.get('description').toLowerCase().match(this.filters.search.toLowerCase()))) return false;
    return true;
  }

  archiveTask(taskId = 'all') {
    this.taskService.archiveTasks(taskId).subscribe((data) => {
      this.tasks = this.tasks.update('completed', List(), (list) => list.map((task) => {
        if (taskId == 'all' || task.get('_id') === taskId) {
          return task.set('archived', true);
        }
        return task;
      }));
      this.filteredTasks = this.filteredTasks.update('completed', List(), (list) => list.map((task) => {
        if (taskId == 'all' || task.get('_id') === taskId) {
          return task.set('archived', true);
        }
        return task;
      }));
    })
  }
}
