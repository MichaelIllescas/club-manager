package com.clubmanager.controller;

import com.clubmanager.dto.MemberDTO;
import com.clubmanager.service.MemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/members")
public class MemberController {

    private final MemberService memberService;

    @Autowired
    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    @PostMapping
    public ResponseEntity<MemberDTO> createMember(@RequestBody MemberDTO memberDTO) {
        MemberDTO newMember = memberService.createMember(memberDTO);
        return new ResponseEntity<>(newMember, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MemberDTO> getMemberById(@PathVariable Long id) {
        return memberService.getMemberById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @GetMapping
    public ResponseEntity<List<MemberDTO>> listMembers() {
        List<MemberDTO> members = memberService.listAllMembers();
        return ResponseEntity.ok(members);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MemberDTO> updateMember(@PathVariable Long id, @RequestBody MemberDTO memberDTO) {
        MemberDTO updatedMember = memberService.updateMember(id, memberDTO);
        return ResponseEntity.ok(updatedMember);

    }

    @PutMapping("/{id}/deactivate")
    public ResponseEntity<Void> deactivateMember(@PathVariable Long id) {
        memberService.deactivateMember(id);
        return ResponseEntity.noContent().build();

    }

    @PutMapping("/{id}/activate")
    public ResponseEntity<Void> activateMember(@PathVariable Long id) {
        memberService.activateMember(id);
        return ResponseEntity.noContent().build();

    }
}
