package com.clubmanager.service;

import com.clubmanager.exception.ResourceNotFoundException;

import com.clubmanager.exception.InvalidValueException;

import com.clubmanager.exception.DuplicateValueException;

import com.clubmanager.dto.MemberDTO;
import com.clubmanager.entity.Member;
import com.clubmanager.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MemberService {

    private final MemberRepository memberRepository;

    @Autowired
    public MemberService(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    public MemberDTO createMember(MemberDTO memberDTO) {
        String dni = validateRequiredDni(memberDTO.getDni());
        if (memberRepository.existsByDni(dni)) {
            throw new DuplicateValueException("Ya existe un socio con el DNI: " + dni);
        }

        String memberNumber = memberDTO.getMemberNumber();
        if (memberNumber != null && !memberNumber.isBlank()) {
            if (memberRepository.existsByMemberNumber(memberNumber)) {
                throw new DuplicateValueException("Ya existe un socio con el número de socio: " + memberNumber);
            }
        }

        Member member = fromDTO(memberDTO);
        member.setRegistrationDate(LocalDate.now());
        member.setStatus(Member.MemberStatus.ACTIVE);

        Member savedMember = memberRepository.save(member);
        return toDTO(savedMember);
    }

    public Optional<MemberDTO> getMemberById(Long id) {
        return memberRepository.findById(id).map(this::toDTO);
    }

    public List<MemberDTO> listAllMembers() {
        return memberRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    // Duplicate checks ignore the member being updated
    public MemberDTO updateMember(Long id, MemberDTO memberDTO) {
        Member existingMember = memberRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Socio no encontrado con el ID: " + id));

        String newDni = validateRequiredDni(memberDTO.getDni());
        if (memberRepository.existsByDniAndIdNot(newDni, id)) {
            throw new DuplicateValueException("No se puede actualizar: ya existe otro socio con el DNI: " + newDni);
        }
        existingMember.setDni(newDni);

        String newMemberNumber = memberDTO.getMemberNumber();
        if (newMemberNumber != null && !newMemberNumber.isBlank()) {
            if (memberRepository.existsByMemberNumberAndIdNot(newMemberNumber, id)) {
                throw new DuplicateValueException("No se puede actualizar: ya existe otro socio con el número de socio: " + newMemberNumber);
            }
            existingMember.setMemberNumber(newMemberNumber);
        } else {
            existingMember.setMemberNumber(null);
        }

        existingMember.setFirstName(memberDTO.getFirstName());
        existingMember.setLastName(memberDTO.getLastName());
        existingMember.setAddress(memberDTO.getAddress());
        existingMember.setPhone(memberDTO.getPhone());
        existingMember.setEmail(memberDTO.getEmail());

        if (memberDTO.getStatus() != null) {
            existingMember.setStatus(Member.MemberStatus.valueOf(memberDTO.getStatus()));
        }

        Member updatedMember = memberRepository.save(existingMember);
        return toDTO(updatedMember);
    }

    public void deactivateMember(Long id) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Socio no encontrado con el ID: " + id));
        member.deactivate();
        memberRepository.save(member);
    }

    public void activateMember(Long id) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Socio no encontrado con el ID: " + id));
        member.activate();
        memberRepository.save(member);
    }

    // The DNI is required: without this check the database rejects the record with a 500 error
    private String validateRequiredDni(String dni) {
        if (dni == null || dni.isBlank()) {
            throw new InvalidValueException("El DNI del socio es obligatorio.");
        }
        return dni.trim();
    }

    private MemberDTO toDTO(Member member) {
        return new MemberDTO(
                member.getId(),
                member.getFirstName(),
                member.getLastName(),
                member.getDni(),
                member.getPhone(),
                member.getEmail(),
                member.getMemberNumber(),
                member.getRegistrationDate() != null ? member.getRegistrationDate().toString() : null,
                member.getAddress(),
                member.getStatus() != null ? member.getStatus().name() : null
        );
    }

    private Member fromDTO(MemberDTO memberDTO) {

        // A blank member number is stored as null
        String memberNumber = memberDTO.getMemberNumber();
        if (memberNumber != null && memberNumber.isBlank()) {
            memberNumber = null;
        }

        return new Member(
                memberDTO.getId(),
                memberDTO.getFirstName(),
                memberDTO.getLastName(),
                memberDTO.getDni(),
                memberDTO.getAddress(),
                memberDTO.getPhone(),
                memberDTO.getEmail(),
                memberNumber,
                memberDTO.getRegistrationDate() != null ? LocalDate.parse(memberDTO.getRegistrationDate()) : null,
                null,
                memberDTO.getStatus() != null ? Member.MemberStatus.valueOf(memberDTO.getStatus()) : Member.MemberStatus.ACTIVE,
                new ArrayList<>()
        );
    }

}
