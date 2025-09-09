package com.warmhouse.legacyadapter.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateSensorValueDto {
    private double value;
    private String status;
}