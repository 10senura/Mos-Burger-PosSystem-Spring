package edu.icet.service;

import edu.icet.dto.Bevarages;

import java.util.List;

public interface BevaragesService {

    void saveBevarages(Bevarages bevarages);

    List<Bevarages> getAll();

    void deleteBevarages(Integer id);

    void updateBevarages(Bevarages bevarages);

    List<Bevarages> searchByName(String name);

    Bevarages searchById(Integer id);
}
