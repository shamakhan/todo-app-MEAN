import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { TasksService } from '../../services/tasks.service';
import { staticLabels, statuses } from './constants';
import {FormControl} from '@angular/forms';
// import { FormControl, FormGroup, FormBuilder, Validator, Validators,ReactiveFormsModule } from "@angular/forms";
@Component({
  selector: 'app-task-settings',
  templateUrl: './task-settings.component.html',
  styleUrls: ['./task-settings.component.scss']
})
export class TaskSettingsComponent implements OnInit {
  @Input() settings: any;
  @Output() close: EventEmitter<any> = new EventEmitter();
  @Output() saved: EventEmitter<any> = new EventEmitter();
  title: String;
  labels: any = {};
  description: String;
  status: String = "new";
  availableLabels: any = {"Personal": "primary", "Work": "warning", "Shopping": "success"};
  objectEntries = Object.entries
  labelAddFormOpen: Boolean = false;
  customLabel: string;
  customLabelType: String = 'success';
  statuses: Array<object> = statuses;
  dueDate: any = new FormControl(new Date());
  minDate: Date;
  maxDate: Date;

  constructor(private taskService: TasksService) { }

  ngOnInit(): void {
    this.title = this.settings.title;
    this.description = this.settings.description;
    this.status = this.settings.status || 'new';
    this.labels = this.settings.labels || {};
    if (this.labels instanceof Array) {
      this.labels = {};
    }
    this.availableLabels = this.settings.labels ? Object.keys(staticLabels).reduce((acc, label) => {
      if (!this.settings.labels[label]) {
        acc[label] = staticLabels[label];
      }
      return acc;
    },{}) : Object.assign({}, staticLabels);
    const today = new Date();
    this.minDate = new Date();
    // this.maxDate = new Date(currentYear + 1, 11, 31);
  }
  closeSettings() {
    this.close.emit();
  }

  saveTask() {
    // console.log(this.taskSettings, this.taskSettings.dueDate);
    // const task = {
    //   id: this.settings._id,
    //   title: this.title,
    //   description: this.description,
    //   labels: this.labels,
    //   status: this.status
    // };
    // this.taskService.saveTask(task).subscribe((data: any) => {
    //   if (data.success) {
    //     this.saved.emit(data.task);
    //   }
    // })
  }

  toggleLabelAddForm() {
    this.labelAddFormOpen = !this.labelAddFormOpen;
    if(!this.labelAddFormOpen) {
      this.customLabel = '';
    }
  }

  addLabel(label) {
    this.labels[label[0]] = label[1];
    delete this.availableLabels[label[0]];
  }

  removeLabel(label) {
    delete this.labels[label];
    if (staticLabels[label]) {
      this.availableLabels[label] = staticLabels[label];
    }
  }

  addCustomLabel() {
    this.labels[this.customLabel] = this.customLabelType;
    this.customLabel = '';
  }
}
