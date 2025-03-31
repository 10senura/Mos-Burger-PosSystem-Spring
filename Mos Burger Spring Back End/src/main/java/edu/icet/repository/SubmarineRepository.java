package edu.icet.repository;

import edu.icet.entity.submarineEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubmarineRepository extends JpaRepository<submarineEntity,Integer> {
    List<submarineEntity>findByName(String name);
}
