package edu.icet.service.impl;

import edu.icet.dto.Bevarages;
import edu.icet.entity.bevaragesEntity;
import edu.icet.repository.BevaragesRepository;
import edu.icet.service.BevaragesService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
@Service
@RequiredArgsConstructor
public class BevaragesServiceImpl implements BevaragesService {

    final BevaragesRepository bevaragesRepository;
    final ModelMapper modelMapper;


    @Override
    public void saveBevarages(Bevarages bevarages) {
        bevaragesRepository.save(modelMapper.map(bevarages, bevaragesEntity.class));
    }

    @Override
    public List<Bevarages> getAll() {
        List<bevaragesEntity> bevaragesEntityList= bevaragesRepository.findAll();
        List<Bevarages> bevaragesList=new ArrayList<>();
        bevaragesEntityList.forEach(bevaragesEntity -> {
            Bevarages bevarages= modelMapper.map(bevaragesEntity,Bevarages.class);
            bevaragesList.add(bevarages);
        });
        return bevaragesList;
    }

    @Override
    public void deleteBevarages(Integer id) {
        bevaragesRepository.deleteById(id);
    }

    @Override
    public void updateBevarages(Bevarages bevarages) {
        bevaragesRepository.save(modelMapper.map(bevarages,bevaragesEntity.class));
    }

    @Override
    public List<Bevarages> searchByName(String name) {
        List<bevaragesEntity> bevaragesEntityList = bevaragesRepository.findByName(name);
        List<Bevarages> bevaragesList = new ArrayList<>();
        bevaragesEntityList.forEach(bevaragesEntity -> bevaragesList.add(modelMapper.map(bevaragesEntity, Bevarages.class)));
        return bevaragesList;
    }

    @Override
    public Bevarages searchById(Integer id) {
        return new ModelMapper().map(bevaragesRepository.findById(id).get(),Bevarages.class);
    }
}
