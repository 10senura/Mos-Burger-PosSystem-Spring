package edu.icet.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@AllArgsConstructor
@NoArgsConstructor
@Data
@ToString
public class Chiken {
    private Integer chiken_id;
    private String name;
    private Double price;
    private String description ;
    private String image_url;
    private String available;
}
