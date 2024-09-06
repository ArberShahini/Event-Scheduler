package com.eventscheduler.scheduler.service;

import com.eventscheduler.scheduler.entity.Event;
import com.eventscheduler.scheduler.exception.EventNotFoundException;
import com.eventscheduler.scheduler.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class EventService {
    private final EventRepository eventRepository;

    @Autowired
    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    public Event addEvent(Event event){
        return eventRepository.save(event);
    }

    public List<Event> findAllEvents(){
        return eventRepository.findAll();
    }

    public Event updateEvent(Event event){
        return eventRepository.save(event);
    }

    public void deleteEvent(int id){
        eventRepository.deleteById(id);
    }

    public List<Event> getEventsBetweenDates(LocalDate start, LocalDate end){
        return eventRepository.getEventsBetween(start, end).orElseThrow(() -> new EventNotFoundException("Such event does not exist"));
    }
}
