package com.warmhouse.legacyadapter.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateSensorDto {
    private String name;
    private String type;
    private String location;
    private String unit;
}