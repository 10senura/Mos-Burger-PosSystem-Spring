package edu.icet.repository;

import edu.icet.entity.PastaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PastaRepository extends JpaRepository<PastaEntity,Integer> {
    List<PastaEntity> findByName(String name);

}
