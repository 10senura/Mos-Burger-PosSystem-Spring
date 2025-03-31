package edu.icet.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@AllArgsConstructor
@NoArgsConstructor
@Data
@ToString
@Entity
@Table(name="submarine")
public class submarineEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer submarine_id;
    private String name;
    private Double price;
    private String description ;
    private String image_url;
    private String available;
}
