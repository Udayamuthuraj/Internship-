package com.example.demo.controller.admin;

import com.example.demo.dto.admin.MemberDTO;
import com.example.demo.model.admin.Member;
import com.example.demo.service.admin.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/members")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminMemberController {

    private final MemberService memberService;

    /**
     * ✅ Add a new committee member
     */
    @PostMapping("/add")
    public ResponseEntity<?> addMember(
            @RequestParam("name") String name,
            @RequestParam("designation") String designation,
            @RequestParam("department") String department,
            @RequestParam("email") String email,
            @RequestParam("description") String description,
            @RequestParam("achievements") String achievements,
            @RequestParam(value = "image", required = false) MultipartFile image
    ) {
        try {
            MemberDTO dto = MemberDTO.builder()
                    .name(name)
                    .designation(designation)
                    .department(department)
                    .email(email)
                    .description(description)
                    .achievements(achievements)
                    .image(image)
                    .build();

            Member saved = memberService.createMember(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(convertToDTO(saved));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("❌ Error saving image: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("❌ Failed to add member: " + e.getMessage());
        }
    }

    /**
     * 📝 Update an existing committee member
     */
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateMember(
            @PathVariable Long id,
            @RequestParam("name") String name,
            @RequestParam("designation") String designation,
            @RequestParam("department") String department,
            @RequestParam("email") String email,
            @RequestParam("description") String description,
            @RequestParam("achievements") String achievements,
            @RequestParam(value = "image", required = false) MultipartFile image
    ) {
        try {
            MemberDTO dto = MemberDTO.builder()
                    .name(name)
                    .designation(designation)
                    .department(department)
                    .email(email)
                    .description(description)
                    .achievements(achievements)
                    .image(image)
                    .build();

            Member updated = memberService.updateMember(id, dto);
            return ResponseEntity.ok(convertToDTO(updated));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("❌ Error updating image: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("❌ Failed to update member: " + e.getMessage());
        }
    }

    /**
     * 📋 Get all committee members
     */
    @GetMapping("/all")
    public ResponseEntity<List<MemberDTO>> getAllMembers() {
        List<MemberDTO> members = memberService.getAllMembers().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(members);
    }

    /**
     * ❌ Delete a member
     */
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteMember(@PathVariable Long id) {
        try {
            memberService.deleteMember(id);
            return ResponseEntity.ok("✅ Member deleted successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("❌ Member not found: " + e.getMessage());
        }
    }

    /**
     * 🔁 Utility: Convert Member Entity → DTO for frontend
     */
    private MemberDTO convertToDTO(Member member) {
        return MemberDTO.builder()
                .id(member.getId())
                .name(member.getName())
                .designation(member.getDesignation())
                .department(member.getDepartment())
                .email(member.getEmail())
                .description(member.getDescription())
                .achievements(member.getAchievements())
                .imageUrl(member.getImageUrl())
                .createdAt(member.getCreatedAt())
                .updatedAt(member.getUpdatedAt())
                .build();
    }
}
