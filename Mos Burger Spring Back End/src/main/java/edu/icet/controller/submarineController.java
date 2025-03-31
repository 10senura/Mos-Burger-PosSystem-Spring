package edu.icet.controller;

import edu.icet.dto.Submarine;
import edu.icet.service.SubmarineService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/submarines")
@RequiredArgsConstructor
@CrossOrigin
public class submarineController {

    final SubmarineService submarineService;

    @PostMapping("/addSubmarine")
    public  void addSubmarine(@RequestBody Submarine submarine){
        submarineService.saveSubmarine(submarine);
    }

    @GetMapping("/allSubmarine")
    public List<Submarine> getAllSubmarine(){
        return submarineService.getAll();
    }

    @DeleteMapping("/delete/{id}")
    public void deleteSubmarine(@PathVariable Integer id){
        submarineService.deleteSubmarine(id);
    }

    @PutMapping("/updateSubmarine")
    public void updateSubmarine(@RequestBody Submarine submarine){
        submarineService.updateSubmarine(submarine);
    }

    @GetMapping("/search-by-id/{id}")
    public Submarine getSubmarineById(@PathVariable Integer id){
        return submarineService.searchById(id);
    }

    @GetMapping("/search-by-name/{name}")
    public List<Submarine> getSubmarineByName(@PathVariable String name){
        return submarineService.searchByName(name);
    }

}
