package edu.icet.service.impl;

import edu.icet.dto.Chiken;
import edu.icet.entity.chikenEntity;
import edu.icet.repository.ChikenRepository;
import edu.icet.service.ChikenService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChikenServiceImpl implements ChikenService {

    final ChikenRepository chikenRepository;
    final ModelMapper modelMapper;


    @Override
    public void saveChiken(Chiken chiken) {
    chikenRepository.save(modelMapper.map(chiken, chikenEntity.class));
    }

    @Override
    public List<Chiken> getAll() {
        List<chikenEntity> chikenEntityList= chikenRepository.findAll();
        List<Chiken> chikenList=new ArrayList<>();
        chikenEntityList.forEach(chikenEntity -> {
            Chiken chiken= modelMapper.map(chikenEntity,Chiken.class);
            chikenList.add(chiken);
        });
        return chikenList;
    }

    @Override
    public void deleteChiken(Integer id) {
        chikenRepository.deleteById(id);
    }

    @Override
    public void updateChiken(Chiken chiken) {
        chikenRepository.save(modelMapper.map(chiken, chikenEntity.class));
    }

    @Override
    public List<Chiken> searchByName(String name) {
        List<chikenEntity> chikenEntityList = chikenRepository.findByName(name);
        List<Chiken> chikenList = new ArrayList<>();
        chikenEntityList.forEach(chikenEntity -> chikenList.add(modelMapper.map(chikenEntity, Chiken.class)));
        return chikenList;
    }

    @Override
    public Chiken searchById(Integer id) {
        return new ModelMapper().map(chikenRepository.findById(id).get(),Chiken.class);
    }
}
