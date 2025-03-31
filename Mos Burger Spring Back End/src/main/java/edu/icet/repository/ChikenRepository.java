package edu.icet.repository;

import edu.icet.entity.chikenEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChikenRepository extends JpaRepository<chikenEntity,Integer> {
    List<chikenEntity>findByName(String name);
}
