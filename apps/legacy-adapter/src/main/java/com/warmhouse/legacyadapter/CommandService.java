package com.warmhouse.legacyadapter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.warmhouse.legacyadapter.dto.DeviceCommandDto;
import com.warmhouse.legacyadapter.dto.SensorValueDto;

@Service
public class CommandService {

    private static final Logger log = LoggerFactory.getLogger(CommandService.class);
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${legacy.adapter.smart-home-url}")
    private String smartHomeUrl;

    public CommandService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public void sendCommand(String message) {
        log.info("Sending command to smart_home: {}", message);
        
        try {
            DeviceCommandDto command = objectMapper.readValue(message, DeviceCommandDto.class);
            
            if ("set_temperature".equals(command.getCommand())) {
                handleSetTemperatureCommand(command);
            } else {
                log.warn("Unknown command: {}", command.getCommand());
            }
        } catch (Exception e) {
            log.error("Failed to process command for smart_home service", e);
        }
    }
    
    private void handleSetTemperatureCommand(DeviceCommandDto command) {
        try {
            String url = smartHomeUrl + "/api/v1/sensors/" + command.getDeviceId() + "/value";
            log.info("Sending PATCH request to: {}", url);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            SensorValueDto payload = new SensorValueDto();
            payload.setValue(command.getTargetTemperature());
            payload.setStatus("active"); // Set a default status
            
            String payloadJson = objectMapper.writeValueAsString(payload);
            HttpEntity<String> entity = new HttpEntity<>(payloadJson, headers);
            
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.PATCH, entity, String.class);
            log.info("Response from smart_home service: {}", response.getBody());
        } catch (Exception e) {
            log.error("Failed to send PATCH command to smart_home service", e);
        }
    }
}
