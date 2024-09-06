package com.eventscheduler.scheduler.repository;

import com.eventscheduler.scheduler.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface EventRepository extends JpaRepository<Event, Integer> {
    @Query("select e from Event e where e.scheduleDate between :startTime and :endTime")
    Optional<List<Event>> getEventsBetween(@Param("startTime") LocalDate startTime, @Param("endTime") LocalDate endTime);
}
