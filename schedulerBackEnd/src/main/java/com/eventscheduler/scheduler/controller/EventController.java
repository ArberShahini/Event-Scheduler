package com.eventscheduler.scheduler.controller;

import com.eventscheduler.scheduler.entity.Event;
import com.eventscheduler.scheduler.service.EventService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController @RequestMapping("/events")
public class EventController {
    private final EventService eventService;

    public EventController(EventService eventService){
        this.eventService = eventService;
    }

    @PostMapping(value = "/add")
    public ResponseEntity<Event> addEvent(@RequestBody Event event){
        Event newEvent = eventService.addEvent(event);
        return new ResponseEntity<>(newEvent, HttpStatus.CREATED);
    }

    @GetMapping(value = "/all")
    public ResponseEntity<List<Event>> getAllEvents(){
        List<Event> events = eventService.findAllEvents();
        return new ResponseEntity<>(events, HttpStatus.OK);
    }

    @PutMapping(value = "/update")
    public ResponseEntity<Event> updateEvent(@RequestBody Event event){
        Event updatedEvent = eventService.updateEvent(event);
        return new ResponseEntity<>(updatedEvent, HttpStatus.OK);
    }

    @DeleteMapping(value = "/delete/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable("id") int id){
        eventService.deleteEvent(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping(value = "/search/{startDate}to{endDate}")
    public ResponseEntity<List<Event>> getEventsBetween(@PathVariable("startDate") LocalDate startDate, @PathVariable("endDate") LocalDate endDate){
        List<Event> events = eventService.getEventsBetweenDates(startDate, endDate);
        return new ResponseEntity<>(events, HttpStatus.OK);
    }
}
