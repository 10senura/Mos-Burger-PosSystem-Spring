package edu.icet.service;


import edu.icet.dto.Orders;

import java.util.List;

public interface OrderService {

    void saveOrders(Orders orders);

    List<Orders> getAll();

    void deleteOrders(Integer id);

    void updateOrders(Orders orders);

    List<Orders> searchByOrdersName(String orderName);

    Orders searchByOrdersId(Integer id);
}
