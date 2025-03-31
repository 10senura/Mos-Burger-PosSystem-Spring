package edu.icet.service.impl;

import edu.icet.dto.Submarine;
import edu.icet.entity.submarineEntity;
import edu.icet.repository.SubmarineRepository;
import edu.icet.service.SubmarineService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
@Service
@RequiredArgsConstructor
public class SubmarineServiceImpl implements SubmarineService {

        final SubmarineRepository submarineRepository;
        final ModelMapper modelMapper;

    @Override
    public void saveSubmarine(Submarine submarine) {
        submarineRepository.save(modelMapper.map(submarine, submarineEntity.class));
    }

    @Override
    public List<Submarine> getAll() {
        List<submarineEntity> submarineEntityList= submarineRepository.findAll();
        List<Submarine> submarineList=new ArrayList<>();
        submarineEntityList.forEach(submarineEntity -> {
            Submarine submarine= modelMapper.map(submarineEntity,Submarine.class);
            submarineList.add(submarine);
        });
        return submarineList;
    }

    @Override
    public void deleteSubmarine(Integer id) {
        submarineRepository.deleteById(id);
    }

    @Override
    public void updateSubmarine(Submarine submarine) {
        submarineRepository.save(modelMapper.map(submarine, submarineEntity.class));
    }

    @Override
    public List<Submarine> searchByName(String name) {
        List<submarineEntity> submarineEntityList = submarineRepository.findByName(name);
        List<Submarine> submarineList = new ArrayList<>();
        submarineEntityList.forEach(submarineEntity -> submarineList.add(modelMapper.map(submarineEntity, Submarine.class)));
        return submarineList;
    }

    @Override
    public Submarine searchById(Integer id) {
        return new ModelMapper().map(submarineRepository.findById(id).get(),Submarine.class);
    }
}
