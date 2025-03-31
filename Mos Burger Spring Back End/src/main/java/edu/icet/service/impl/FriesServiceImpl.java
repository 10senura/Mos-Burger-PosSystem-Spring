package edu.icet.service.impl;

import edu.icet.Main;
import edu.icet.dto.Burger;
import edu.icet.dto.Chiken;
import edu.icet.dto.Fries;
import edu.icet.entity.burgerEntity;
import edu.icet.entity.chikenEntity;
import edu.icet.entity.friesEntity;
import edu.icet.repository.FriesRepository;
import edu.icet.service.FriesService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.boot.Banner;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FriesServiceImpl implements FriesService {

    final FriesRepository friesRepository;
    final ModelMapper modelMapper;

    @Override
    public void saveFrice(Fries fries) {
    friesRepository.save(modelMapper.map(fries, friesEntity.class));
    }

    @Override
    public List<Fries> getAll() {
        List<friesEntity> friesEntityList= friesRepository.findAll();
        List<Fries> friesList=new ArrayList<>();
        friesEntityList.forEach(friesEntity -> {
            Fries fries= modelMapper.map(friesEntity,Fries.class);
            friesList.add(fries);
        });
        return friesList;
    }

    @Override
    public void deleteFries(Integer id) {
    friesRepository.deleteById(id);
    }

    @Override
    public void updateFries(Fries fries) {
    friesRepository.save(modelMapper.map(fries, friesEntity.class));
    }

    @Override
    public List<Fries> searchByName(String name) {
        List<friesEntity> friesEntityList = friesRepository.findByName(name);
        List<Fries> friesList = new ArrayList<>();
        friesEntityList.forEach(friesEntity -> friesList.add(modelMapper.map(friesEntity, Fries.class)));
        return friesList;
    }

    @Override
    public Fries searchById(Integer id) {
        return new ModelMapper().map(friesRepository.findById(id).get(), Fries.class);
    }
}
