package edu.icet.controller;

import edu.icet.dto.Fries;
import edu.icet.service.FriesService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/fries")
@RequiredArgsConstructor
@CrossOrigin
public class FriesController {
    final FriesService friesService;

    @PostMapping("/addFries")
    public  void addFries(@RequestBody Fries fries){friesService.saveFrice(fries);}

    @GetMapping("/allFries")
    public List<Fries> getAllFries(){
        return friesService.getAll();
    }

    @DeleteMapping("/delete/{id}")
    public void deleteFries(@PathVariable Integer id){
        friesService.deleteFries(id);
    }

    @PutMapping("/updateFries")
    public void updateFries(@RequestBody Fries fries) {friesService.updateFries(fries);}

    @GetMapping("/search-by-id/{id}")
    public Fries getFriesById(@PathVariable Integer id){
        return friesService.searchById(id);
    }

    @GetMapping("/search-by-name/{name}")
    public List<Fries> getFriesByName(@PathVariable String name){
        return friesService.searchByName(name);
    }

}
