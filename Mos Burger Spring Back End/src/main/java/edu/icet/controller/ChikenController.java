package edu.icet.controller;

import edu.icet.dto.Chiken;
import edu.icet.service.ChikenService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/chikens")
@RequiredArgsConstructor
@CrossOrigin
public class ChikenController {

    final ChikenService chikenService;

    @PostMapping("/addChiken")
    public  void addBurger(@RequestBody Chiken chiken){
        chikenService.saveChiken(chiken);
    }

    @GetMapping("/allChiken")
    public List<Chiken> getAllChiken(){
        return chikenService.getAll();
    }

    @DeleteMapping("/delete/{id}")
    public void deleteChiken(@PathVariable Integer id){
        chikenService.deleteChiken(id);
    }

    @PutMapping("/updateChiken")
    public void updateChiken(@RequestBody Chiken chiken){
        chikenService.updateChiken(chiken);
    }

    @GetMapping("/search-by-id/{id}")
    public Chiken getChikenById(@PathVariable Integer id){
        return chikenService.searchById(id);
    }

    @GetMapping("/search-by-name/{name}")
    public List<Chiken> getChikenByName(@PathVariable String name){
        return chikenService.searchByName(name);
    }

}
