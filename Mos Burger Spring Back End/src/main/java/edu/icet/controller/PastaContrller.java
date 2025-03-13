package edu.icet.controller;

import edu.icet.dto.Burger;
import edu.icet.dto.Pasta;
import edu.icet.service.BurgerService;
import edu.icet.service.PastaService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pasta")
@RequiredArgsConstructor
@CrossOrigin
public class PastaContrller {

    final PastaService pastaService;

    @PostMapping("/addPasta")
    public  void addPasta(@RequestBody Pasta pasta){
        pastaService.savePasta(pasta);
    }

    @GetMapping("/allPasta")
    public List<Pasta> getAllPasta(){
        return pastaService.getAll();
    }

    @DeleteMapping("/delete{id}")
    public void deletePasta(@PathVariable Integer id){
        pastaService.deletePasta(id);
    }

    @PutMapping("/updatePasta")
    public void updatePasta(@RequestBody Pasta pasta){
        pastaService.updatePasta(pasta);
    }

    @GetMapping("/search-by-pasta-id/{id}")
    public Pasta getPastaById(@PathVariable Integer id){
        return pastaService.searchById(id);
    }

    @GetMapping("/search-by-pasta-name/{name}")
    public List<Pasta> getPastaByName(@PathVariable String name){
        return pastaService.searchByName(name);
    }


}
