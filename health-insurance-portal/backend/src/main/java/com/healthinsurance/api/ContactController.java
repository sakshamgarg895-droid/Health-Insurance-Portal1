package com.healthinsurance.api;

import com.healthinsurance.entity.ContactMessage;
import com.healthinsurance.repository.ContactMessageRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/contact")
public class ContactController {
    private final ContactMessageRepository messages;

    public ContactController(ContactMessageRepository messages) {
        this.messages = messages;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SubmissionResponse submit(@Valid @RequestBody ContactRequest request) {
        var entry = new ContactMessage();
        entry.setName(request.name().trim());
        entry.setEmail(request.email().trim().toLowerCase());
        entry.setPhone(request.phone() == null || request.phone().isBlank() ? null : request.phone().trim());
        entry.setSubject(request.subject().trim());
        entry.setMessage(request.message().trim());
        var saved = messages.save(entry);
        if (saved.getId() == null) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Unable to save message");
        }
        return new SubmissionResponse("Message received. This is a sample portal; no support team will reply.", saved.getCreatedAt());
    }

    public record ContactRequest(
            @NotBlank @Size(max = 100) String name,
            @NotBlank @Email @Size(max = 150) String email,
            @Size(max = 15) String phone,
            @NotBlank @Size(max = 150) String subject,
            @NotBlank @Size(max = 5000) String message
    ) {}

    public record SubmissionResponse(String message, LocalDateTime receivedAt) {}
}
