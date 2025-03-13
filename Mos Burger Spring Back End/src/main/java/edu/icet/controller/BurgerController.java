package edu.icet.controller;

import edu.icet.dto.Burger;
import edu.icet.service.BurgerService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/burgers")
@RequiredArgsConstructor
@CrossOrigin
public class BurgerController {

    final BurgerService BurgerService;

    @PostMapping("/addBurger")
    public  void addBurger(@RequestBody Burger burger){
        BurgerService.saveBurger(burger);
    }

    @GetMapping("/allBurger")
    public List<Burger> getAllBurgers(){
        return BurgerService.getAll();
    }

    @DeleteMapping("/delete{id}")
    public void deleteBurger(@PathVariable Integer id){
        BurgerService.deleteBurger(id);
    }

    @PutMapping("/updateBurger")
    public void updateBurger(@RequestBody Burger burger){
        BurgerService.updateBurger(burger);
    }

    @GetMapping("/search-by-id/{id}")
    public Burger getBurgerById(@PathVariable Integer id){
        return BurgerService.searchById(id);
    }

    @GetMapping("/search-by-name/{name}")
    public List<Burger> getBurgerByName(@PathVariable String name){
        return BurgerService.searchByName(name);
    }

}
