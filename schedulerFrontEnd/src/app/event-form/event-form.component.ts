import { Component, Output } from '@angular/core';
import { EventsService } from '../services/events.service';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { response } from 'express';
import { error } from 'console';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Events } from '../events';
import { EventEmitter } from '@angular/core';
import { ToastrModule, ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.css',
})
export class EventFormComponent {
  myForm: FormGroup;
  modifiedForm: FormGroup;
  @Output() triggerUpdate = new EventEmitter<void>();

  constructor(private eventService: EventsService, private formBuilder: FormBuilder, private toastr: ToastrService){
    this.myForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(30)]],
      scheduleDate: [null],
      startTime: [null],
      endTime: [null],
      description: ['', [Validators.required, Validators.maxLength(255)]]
    })

    this.modifiedForm = this.formBuilder.group({
      name: ['', Validators.required],
      scheduleDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      description: ['', Validators.required]
    })

  }

  isMaxLengthError(field: string): boolean {
    const control = this.myForm.get(field);
    const errors = control?.errors;
    return !!(errors && errors['maxlength']);
  }

  public addEvent(): void {
    let date = new Date(this.myForm.value.scheduleDate);
    let startTime = new Date(this.myForm.value.startTime);
    let endTime = new Date(this.myForm.value.endTime);

    this.modifiedForm.controls['name'].setValue(this.myForm.value.name);
    this.modifiedForm.controls['scheduleDate'].setValue(`${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`);
    this.modifiedForm.controls['startTime'].setValue(`${startTime.getHours().toString().padStart(2, '0')}:${startTime.getMinutes().toString().padStart(2, '0')}`);
    this.modifiedForm.controls['endTime'].setValue(`${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`);
    this.modifiedForm.controls['description'].setValue(this.myForm.value.description);
    this.eventService.addEvent(this.modifiedForm.value).subscribe(
      (response: Events) => {
        this.toastr.success('Event added successfully');
        this.triggerUpdate.emit();
      },
      (error: HttpErrorResponse) => {
        this.toastr.error("Something went wrong");
      }
    )

    this.clearForm();
  }

  public clearForm(): void {
    this.myForm.reset();
  }
}
