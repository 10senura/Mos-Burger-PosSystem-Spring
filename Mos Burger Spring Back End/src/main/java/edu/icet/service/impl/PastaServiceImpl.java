package edu.icet.service.impl;

import edu.icet.dto.Burger;
import edu.icet.dto.Pasta;
import edu.icet.entity.PastaEntity;
import edu.icet.entity.burgerEntity;
import edu.icet.repository.BurgerRepository;
import edu.icet.repository.PastaRepository;
import edu.icet.service.PastaService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
@Service
@RequiredArgsConstructor
public class PastaServiceImpl implements PastaService {

    final PastaRepository pastaRepository;
    final ModelMapper modelMapper;

    @Override
    public void savePasta(Pasta pasta) {
        pastaRepository.save(modelMapper.map(pasta, PastaEntity.class));
    }

    @Override
    public List<Pasta> getAll() {
        List<PastaEntity> pastaEntityList= pastaRepository.findAll();
        List<Pasta> pastasList=new ArrayList<>();
        pastaEntityList.forEach(PastaEntity -> {
            Pasta pasta= modelMapper.map(PastaEntity,Pasta.class);
            pastasList.add(pasta);
        });
        return pastasList;
    }

    @Override
    public void deletePasta(Integer id) {
        pastaRepository.deleteById(id);

    }

    @Override
    public void updatePasta(Pasta pasta) {
        pastaRepository.save(modelMapper.map(pasta,PastaEntity.class));
    }

    @Override
    public List<Pasta> searchByName(String name) {
        List<PastaEntity> pastaEntityList = pastaRepository.findByName(name);
        List<Pasta> pastasList = new ArrayList<>();
        pastaEntityList.forEach(PastaEntity ->  pastasList.add(modelMapper.map(PastaEntity, Pasta.class)));
        return pastasList;
    }

    @Override
    public Pasta searchById(Integer id) {
        return new ModelMapper().map(pastaRepository.findById(id).get(), Pasta.class);
    }
}
