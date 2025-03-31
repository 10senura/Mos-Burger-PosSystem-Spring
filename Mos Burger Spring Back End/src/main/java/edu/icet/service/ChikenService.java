package edu.icet.service;

import edu.icet.dto.Chiken;

import java.util.List;

public interface ChikenService {

    void saveChiken(Chiken chiken);

    List<Chiken> getAll();

    void deleteChiken(Integer id);

    void updateChiken(Chiken chiken);

    List<Chiken> searchByName(String name);

    Chiken searchById(Integer id);
}
