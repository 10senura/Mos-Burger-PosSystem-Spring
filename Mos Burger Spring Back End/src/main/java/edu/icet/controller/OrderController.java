package edu.icet.controller;

import edu.icet.dto.Orders;
import edu.icet.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
@CrossOrigin
public class OrderController {

    final OrderService orderservice;

    @PostMapping("/addOrder")
    public  void addOrder(@RequestBody Orders orders){
        orderservice.saveOrders(orders);
    }

    @GetMapping("/allOrder")
    public List<Orders> getAll(){
        return orderservice.getAll();
    }

    @DeleteMapping("/delete/{id}")
    public void deleteOrder(@PathVariable Integer id){
        orderservice.deleteOrders(id);
    }

    @PutMapping("/updateOrder")
    public void updateOrder(@RequestBody Orders orders){
        orderservice.updateOrders(orders);
    }

    @GetMapping("/search-by-order-id/{id}")
    public Orders getOrderById(@PathVariable Integer id){
        return orderservice.searchByOrdersId(id);
    }

    @GetMapping("/search-by-order-name/{orderName}")
    public List<Orders> getOrderByName(@PathVariable String orderName){
        return orderservice.searchByOrdersName(orderName);
    }

}
