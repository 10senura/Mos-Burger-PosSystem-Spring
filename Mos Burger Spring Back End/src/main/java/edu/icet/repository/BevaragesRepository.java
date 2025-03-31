package edu.icet.repository;

import edu.icet.entity.bevaragesEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BevaragesRepository  extends JpaRepository<bevaragesEntity,Integer> {
    List<bevaragesEntity>findByName(String name);
}
