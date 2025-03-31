package edu.icet.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@AllArgsConstructor
@NoArgsConstructor
@Data
@ToString
public class user {
    private Integer user_id;
    private String user_name;
    private String password;
    private String role;
}
