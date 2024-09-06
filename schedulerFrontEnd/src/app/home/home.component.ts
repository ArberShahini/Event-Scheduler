import { Component, OnInit } from '@angular/core';
import { EventsService } from '../services/events.service';
import { response } from 'express';
import { error } from 'console';
import { HttpErrorResponse } from '@angular/common/http';
import { Events } from '../events';
import { Time } from '@angular/common';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  public events: Events[] = [];
  public currentPage: number = 1;
  public pageSize: number = 10;
  public pageContent: Events[] = [];
  public currentEvent: Events = this.events[0];
  public modalForm: FormGroup;
  public modifiedForm: FormGroup;
  public editMode: boolean = false;
  public searchForm: FormGroup;
  public isSearching: boolean = false;
  public stopModelChange = false;


  constructor(private eventService: EventsService, private formBuilder: FormBuilder, private toastr: ToastrService){
    this.modalForm = this.formBuilder.group({
      id: [this.currentEvent?.id, Validators.required],
      name: [this.currentEvent?.name, [Validators.required, Validators.maxLength(30)]],
      scheduleDate: [this.currentEvent?.scheduleDate],
      startTime: [this.currentEvent?.startTime],
      endTime: [this.currentEvent?.endTime],
      description: [this.currentEvent?.description, [Validators.required, Validators.maxLength(255)]]
    });

    this.modifiedForm = this.formBuilder.group({
      id: ['', Validators.required],
      name: ['', [Validators.required, Validators.maxLength(30)]],
      scheduleDate: [null, Validators.required],
      startTime: [null, Validators.required],
      endTime: [null, Validators.required],
      description: ['', [Validators.required, Validators.maxLength(255)]]
    });

    this.searchForm = this.formBuilder.group({
      startDate: [null],
      endDate: [null]
    });
  }

  ngOnInit(): void {
    this.pageifyEvents();
  }

  public pageifyEvents(): void {
    if(this.searchForm.value.startDate == null || this.searchForm.value.endDate == null){
      if(this.isSearching) this.currentPage = 1;
      this.isSearching = false;
      this.eventService.getAllEvents().subscribe(
        (response: Events[]) => {
          this.events = response;
          let startIndex = (this.currentPage - 1) * this.pageSize;
          let endIndex = startIndex + this.pageSize;
          this.pageContent = this.events.slice(startIndex, endIndex);
          if(this.events.length == 0) this.toastr.warning("No events exist");
        },
        (error: HttpErrorResponse) => {
          this.toastr.error("Something went wrong");
        }
      )
    }else{
      if(!this.isSearching) this.currentPage = 1;
      this.isSearching = true;
      this.eventService.getEventsBetween(this.searchForm.value.startDate, this.searchForm.value.endDate).subscribe(
        (response: Events[]) => {
          this.events = response;
          let startIndex = (this.currentPage - 1) * this.pageSize;
          let endIndex = startIndex + this.pageSize;
          this.pageContent = this.events.slice(startIndex, endIndex);
          if(this.events.length == 0) this.toastr.warning("No such events exist");
        },
        (error: HttpErrorResponse) => {
          this.toastr.error("Something went wrong");
        }
      )
    }
  }

  public nextPage(): void {
    this.currentPage++;
    this.pageifyEvents();
  }

  public prevPage(): void {
    this.currentPage--;
    this.pageifyEvents();
  }

  public isPrevDisabled(): boolean {
    return this.currentPage <= 1;
  }

  public isNextDisabled(): boolean {
    return this.events.length <= this.currentPage * this.pageSize;
  }

  public timeToDate(time: Time): Date {
    let timeStringArr = time.toString().split(':', 2);
    let timeArr: number[] = [];
    for(let item of timeStringArr){
      let no:number=Number(item);
      timeArr.push(no);
     }

    const date = new Date();
    date.setHours(timeArr[0], timeArr[1],  0, 0);
    return date;
  }
  public formatTime(time: Time): string {
    const date = this.timeToDate(time);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  }

  public setCurrentEvent(event: Events): void {
    this.setEditFalse();
    this.currentEvent = event;
    this.modalForm = this.formBuilder.group({
      id: [{value: this.currentEvent?.id, disabled: true}, Validators.required],
      name: [{value: this.currentEvent?.name, disabled: true}, [Validators.required, Validators.maxLength(30)]],
      scheduleDate: [{value: new Date(this.currentEvent?.scheduleDate), disabled: true}, Validators.required],
      startTime: [{value: this.timeToDate(this.currentEvent?.startTime), disabled: true}, Validators.required],
      endTime: [{value: this.timeToDate(this.currentEvent?.endTime), disabled: true}, Validators.required],
      description: [{value: this.currentEvent?.description, disabled: true}, [Validators.required, Validators.maxLength(255)]]
    });
  }

  public setEditTrue(): void {
    this.editMode = true;
    Object.keys(this.modalForm.controls).forEach(controlName => {
      this.modalForm.get(controlName)?.enable();
    });
  }

  public setEditFalse(): void {
    this.editMode = false;
  }

  isMaxLengthError(field: string): boolean {
    const control = this.modalForm.get(field);
    const errors = control?.errors;
    return !!(errors && errors['maxlength']);
  }

  public updateEvent(): void{
    let date = new Date(this.modalForm.value.scheduleDate);
    let startTime = new Date(this.modalForm.value.startTime);
    let endTime = new Date(this.modalForm.value.endTime);

    this.modifiedForm.controls['id'].setValue(this.modalForm.value.id);
    this.modifiedForm.controls['name'].setValue(this.modalForm.value.name);
    this.modifiedForm.controls['scheduleDate'].setValue(`${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`);
    this.modifiedForm.controls['startTime'].setValue(`${startTime.getHours().toString().padStart(2, '0')}:${startTime.getMinutes().toString().padStart(2, '0')}`);
    this.modifiedForm.controls['endTime'].setValue(`${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`);
    this.modifiedForm.controls['description'].setValue(this.modalForm.value.description);
    this.eventService.updateEvent(this.modifiedForm.value).subscribe(
      (response: Events) => {
        this.toastr.success("Event updated successfully");
        this.eventService.getAllEvents().subscribe(
          (response: Events[]) => {
            this.events = response;
            this.pageifyEvents();
          },
          (error: HttpErrorResponse) => {
            this.toastr.error("Something went wrong");
          }
        );
      },
      (error: HttpErrorResponse) => {
        this.toastr.error("Something went wrong");
      }
    );
    let closeButton = document.getElementById("close");
    closeButton?.click();
  }

  public deleteEvent(id: number): void {
    this.eventService.deleteEvent(id).subscribe(
      (response: void) => {
        this.toastr.success("Event deleted successfully");
        this.eventService.getAllEvents().subscribe(
          (response: Events[]) => {
            this.events = response;
            if(this.pageContent.length == 1){
              this.prevPage();
            }
            this.pageifyEvents();
          }
        );
      },
      (error: HttpErrorResponse) => {
        this.toastr.error("Something went wrong");
      }
    );

    let closeButton = document.getElementById("close");
    closeButton?.click();
  }

  public clearSearchForm(): void {
    this.stopModelChange = true;
    this.searchForm.reset();
    this.pageifyEvents();
    this.stopModelChange = false;
  }

  public changeListener(): void {
    if(this.searchForm.value.startDate != null && this.searchForm.value.endDate != null && !this.stopModelChange) {
      this.currentPage = 1;
      if(this.searchForm.value.startDate > this.searchForm.value.endDate){
        this.stopModelChange = true;
        let newStartDate = this.searchForm.value.endDate;
        let newEndDate = this.searchForm.value.startDate;
        this.searchForm.setValue({
          startDate: newStartDate,
          endDate: newEndDate
        })
        this.stopModelChange = false;
      }
    }
    if(!this.stopModelChange) this.pageifyEvents();
  }
}
