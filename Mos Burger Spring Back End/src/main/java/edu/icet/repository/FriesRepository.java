package edu.icet.repository;

import edu.icet.entity.friesEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FriesRepository extends JpaRepository<friesEntity,Integer> {
    List<friesEntity>findByName(String name);
}
