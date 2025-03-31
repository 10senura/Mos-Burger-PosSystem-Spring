package edu.icet.service.impl;

import edu.icet.dto.Orders;
import edu.icet.entity.OrdersEntity;
import edu.icet.repository.OrderRepository;
import edu.icet.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    final OrderRepository repository;
    final ModelMapper modelMapper;


    @Override
    public void saveOrders(Orders orders) {
            repository.save(modelMapper.map(orders, OrdersEntity.class));
    }

    @Override
    public List<Orders> getAll() {
        List<OrdersEntity> ordersEntityList= repository.findAll();
        List<Orders> ordersList=new ArrayList<>();
        ordersEntityList.forEach(OrdersEntity -> {
            Orders orders= modelMapper.map(OrdersEntity,Orders.class);
            ordersList.add(orders);
        });
        return ordersList;
    }

    @Override
    public void deleteOrders(Integer id) {
        repository.deleteById(id);

    }

    @Override
    public void updateOrders(Orders orders) {
        repository.save(modelMapper.map(orders,OrdersEntity.class));

    }

    @Override
    public List<Orders> searchByOrdersName(String orderName) {
        List<OrdersEntity> ordersEntityList = repository.findByOrderName(orderName);
        List<Orders> ordersList = new ArrayList<>();
        ordersEntityList.forEach(OrdersEntity ->  ordersList.add(modelMapper.map(OrdersEntity, Orders.class)));
        return ordersList;
    }

    @Override
    public Orders searchByOrdersId(Integer id) {
        return new ModelMapper().map(repository.findById(id).get(), Orders.class);
    }
}
