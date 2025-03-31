package edu.icet.service;

import edu.icet.dto.Submarine;

import java.util.List;

public interface SubmarineService {

    void saveSubmarine(Submarine submarine);

    List<Submarine> getAll();

    void deleteSubmarine(Integer id);

    void updateSubmarine(Submarine submarine);

    List<Submarine> searchByName(String name);

    Submarine searchById(Integer id);
}
