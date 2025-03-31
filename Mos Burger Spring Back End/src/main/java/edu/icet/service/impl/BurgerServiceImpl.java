package edu.icet.service.impl;

import edu.icet.dto.Burger;
import edu.icet.entity.burgerEntity;
import edu.icet.repository.BurgerRepository;
import edu.icet.service.BurgerService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BurgerServiceImpl implements BurgerService {

    final BurgerRepository burgerRepository;
    final ModelMapper modelMapper;


    @Override
    public void saveBurger(Burger burger) {
        burgerRepository.save(modelMapper.map(burger, burgerEntity.class));
    }

    @Override
    public List<Burger> getAll() {
        List<burgerEntity> burgerEntityList= burgerRepository.findAll();
        List<Burger> burgerslist=new ArrayList<>();
        burgerEntityList.forEach(burgerEntity -> {
            Burger burger= modelMapper.map(burgerEntity,Burger.class);
            burgerslist.add(burger);
        });
        return burgerslist;
    }

    @Override
    public void deleteBurger(Integer id) {
        burgerRepository.deleteById(id);
    }

    @Override
    public void updateBurger(Burger burger) {
       burgerRepository.save(modelMapper.map(burger,burgerEntity.class));
    }

    @Override
    public List<Burger> searchByName(String name) {
        List<burgerEntity> burgerEntityList = burgerRepository.findByName(name);
        List<Burger> burgerList = new ArrayList<>();
        burgerEntityList.forEach(burgerEntity -> burgerList.add(modelMapper.map(burgerEntity, Burger.class)));
        return burgerList;
    }

    @Override
    public Burger searchById(Integer id) {
        return new ModelMapper().map(burgerRepository.findById(id).get(),Burger.class);
    }
}
