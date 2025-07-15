package com.example.demo.service.admin;

import com.example.demo.dto.admin.MemberDTO;
import com.example.demo.model.admin.Member;
import com.example.demo.repository.admin.MemberRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;

    @Value("${upload.directory.members}")
    private String uploadDir;

    /**
     * ✅ Add new committee member
     */
    @Transactional
    public Member createMember(MemberDTO dto) throws IOException {
        String imagePath = null;

        MultipartFile image = dto.getImage();
        if (image != null && !image.isEmpty()) {
            imagePath = saveImage(image);
        }

        Member member = Member.builder()
                .name(dto.getName())
                .designation(dto.getDesignation())
                .department(dto.getDepartment())
                .email(dto.getEmail())
                .description(dto.getDescription())
                .achievements(dto.getAchievements())
                .imageUrl(imagePath)
                .build();

        return memberRepository.save(member);
    }

    /**
     * 📝 Update existing committee member
     */
    @Transactional
    public Member updateMember(Long id, MemberDTO dto) throws IOException {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Member not found with ID: " + id));

        member.setName(dto.getName());
        member.setDesignation(dto.getDesignation());
        member.setDepartment(dto.getDepartment());
        member.setEmail(dto.getEmail());
        member.setDescription(dto.getDescription());
        member.setAchievements(dto.getAchievements());

        MultipartFile newImage = dto.getImage();
        if (newImage != null && !newImage.isEmpty()) {
            String imagePath = saveImage(newImage);
            member.setImageUrl(imagePath);
        }

        return memberRepository.save(member);
    }

    /**
     * 🔄 Get all members (non-paginated, frontend handles filtering & pagination)
     */
    public List<Member> getAllMembers() {
        return memberRepository.findAll();
    }

    /**
     * ❌ Delete a member
     */
    @Transactional
    public void deleteMember(Long id) {
        if (!memberRepository.existsById(id)) {
            throw new RuntimeException("Member not found with ID: " + id);
        }
        memberRepository.deleteById(id);
    }

    /**
     * 📁 Save uploaded image and return relative path
     */
    private String saveImage(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) return null;

        Path uploadPath = Path.of(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
            log.info("📁 Created upload directory: {}", uploadPath.toAbsolutePath());
        }

        String originalName = file.getOriginalFilename();
        String sanitizedFileName = (originalName != null)
                ? originalName.replaceAll("[^a-zA-Z0-9._-]", "_")
                : "image.png";

        String uniqueFileName = UUID.randomUUID() + "_" + sanitizedFileName;
        File destination = uploadPath.resolve(uniqueFileName).toFile();

        log.info("📷 Saving image to: {}", destination.getAbsolutePath());

        file.transferTo(destination);

        // This relative path will be served via a static resource handler
        return "/uploads/members/" + uniqueFileName;
    }
}
