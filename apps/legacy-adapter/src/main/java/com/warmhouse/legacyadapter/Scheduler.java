package com.warmhouse.legacyadapter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class Scheduler {

    private static final Logger log = LoggerFactory.getLogger(Scheduler.class);
    private final RestTemplate restTemplate;
    private final KafkaTemplate<String, String> kafkaTemplate;

    @Value("${legacy.adapter.smart-home-url}")
    private String smartHomeUrl;

    @Value("${legacy.adapter.kafka.topic.temperature-updates}")
    private String temperatureUpdatesTopic;

    public Scheduler(RestTemplate restTemplate, KafkaTemplate<String, String> kafkaTemplate) {
        this.restTemplate = restTemplate;
        this.kafkaTemplate = kafkaTemplate;
    }

    @Scheduled(fixedRate = 60000) // 60 seconds
    public void pollTemperatureSensors() {
        log.info("Polling temperature sensors from smart_home service");
        try {
            String sensorData = restTemplate.getForObject(smartHomeUrl + "/api/v1/sensors/temperature", String.class);
            if (sensorData != null) {
                log.info("Sending temperature data to Kafka topic {}: {}", temperatureUpdatesTopic, sensorData);
                kafkaTemplate.send(temperatureUpdatesTopic, sensorData);
            }
        } catch (Exception e) {
            log.error("Failed to poll temperature sensors from smart_home service", e);
        }
    }
}