package edu.icet.service;

import edu.icet.dto.Burger;
import edu.icet.dto.Pasta;

import java.util.List;

public interface PastaService {

    void savePasta(Pasta pasta);

    List<Pasta> getAll();

    void deletePasta(Integer id);

    void updatePasta(Pasta pasta);

    List<Pasta> searchByName(String name);

    Pasta searchById(Integer id);
}
