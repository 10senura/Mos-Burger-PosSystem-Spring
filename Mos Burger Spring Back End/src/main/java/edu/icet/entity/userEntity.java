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
@Table(name="user")
public class userEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer user_id;
    private String user_name;
    private String password;
    private String role;
}
