package edu.icet.repository;

import edu.icet.entity.OrdersEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<OrdersEntity,Integer> {
    List<OrdersEntity> findByOrderName(String orderName);

}
