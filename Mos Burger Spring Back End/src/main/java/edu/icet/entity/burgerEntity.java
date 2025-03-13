package edu.icet.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.modelmapper.internal.bytebuddy.dynamic.loading.InjectionClassLoader;

@AllArgsConstructor
@NoArgsConstructor
@Data
@ToString
@Entity
@Table(name="burger")
public class burgerEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer burger_id;
    private String name;
    private Double price;
    private String description ;
    private String image_url;
    private String available;
}
