package edu.icet.service;


import edu.icet.dto.Burger;

import java.util.List;

public interface BurgerService {

    void saveBurger(Burger burger);

    List<Burger> getAll();

    void deleteBurger(Integer id);

    void updateBurger(Burger burger);

    List<Burger> searchByName(String name);

    Burger searchById(Integer id);

}
