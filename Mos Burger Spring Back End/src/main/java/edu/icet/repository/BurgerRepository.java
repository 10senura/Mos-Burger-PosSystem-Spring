package edu.icet.repository;

import edu.icet.entity.burgerEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BurgerRepository extends JpaRepository<burgerEntity,Integer> {

    List<burgerEntity>findByName(String name);
}
