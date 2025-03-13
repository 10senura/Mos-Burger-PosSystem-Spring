package edu.icet.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDate;
@AllArgsConstructor
@NoArgsConstructor
@Data
@ToString
public class orders {
    private Integer order_id;
    private String c_name;
    private Integer burger_id;
    private String quantity;
    private String order_status;
    private LocalDate order_date ;

}
