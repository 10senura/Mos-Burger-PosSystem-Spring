package edu.icet.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.modelmapper.internal.bytebuddy.dynamic.loading.InjectionClassLoader;

import java.time.LocalDate;
@AllArgsConstructor
@NoArgsConstructor
@Data
@ToString
@Entity
@Table(name="orders")
public class OrdersEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer order_id;

    @Column(name = "order_name")
    private String orderName;

    private Integer burger_id;
    private String quantity;
    private String order_status;
    private LocalDate order_date ;

}
