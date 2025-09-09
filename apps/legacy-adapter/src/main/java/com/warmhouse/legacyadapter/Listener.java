package com.warmhouse.legacyadapter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class Listener {

    private static final Logger log = LoggerFactory.getLogger(Listener.class);
    
    @Autowired
    private CommandService commandService;

    @KafkaListener(topics = "${legacy.adapter.kafka.topic.temperature-commands}", groupId = "legacy-adapter")
    public void consume(String message) {
        log.info("Received message from temperature-commands: {}", message);
        // Delegate command execution to CommandService
        commandService.sendCommand(message);
    }
}
