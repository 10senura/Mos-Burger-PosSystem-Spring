package edu.icet.service;

import edu.icet.dto.Fries;

import java.util.List;

public interface FriesService {

    void saveFrice(Fries fries);

    List<Fries> getAll();

    void deleteFries(Integer id);

    void updateFries(Fries fries);

    List<Fries> searchByName(String name);

    Fries searchById(Integer id);
}
