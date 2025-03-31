package edu.icet.controller;

import edu.icet.dto.Bevarages;
import edu.icet.service.BevaragesService;
import edu.icet.service.BurgerService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/bevarages")
@RequiredArgsConstructor
@CrossOrigin
public class BevaragesController {

    final BevaragesService bevaragesService;

    @PostMapping("/addBevarages")
    public  void addBevarages(@RequestBody Bevarages bevarages){bevaragesService.saveBevarages(bevarages);}

    @GetMapping("/allBevarages")
    public List<Bevarages> getAllBurgers(){
        return bevaragesService.getAll();
    }

    @DeleteMapping("/delete/{id}")
    public void deleteBurger(@PathVariable Integer id){
        bevaragesService.deleteBevarages(id);
    }

    @PutMapping("/updateBevarages")
    public void updateBevarages(@RequestBody Bevarages bevarages){
        bevaragesService.updateBevarages(bevarages);
    }

    @GetMapping("/search-by-id/{id}")
    public Bevarages getBevaragesById(@PathVariable Integer id){
        return bevaragesService.searchById(id);
    }

    @GetMapping("/search-by-name/{name}")
    public List<Bevarages> getBevaragesByName(@PathVariable String name){
        return bevaragesService.searchByName(name);
    }


}
