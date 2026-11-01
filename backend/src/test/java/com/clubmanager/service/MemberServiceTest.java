package com.clubmanager.service;

import com.clubmanager.dto.MemberDTO;
import com.clubmanager.entity.Member;
import com.clubmanager.repository.MemberRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MemberServiceTest {

    @Mock
    private MemberRepository memberRepository;

    private MemberService memberService;

    @BeforeEach
    void setUp() {
        memberService = new MemberService(memberRepository);
    }

    private MemberDTO newMember(String dni, String memberNumber) {
        MemberDTO dto = new MemberDTO();
        dto.setFirstName("Ana");
        dto.setLastName("Gomez");
        dto.setDni(dni);
        dto.setMemberNumber(memberNumber);
        return dto;
    }

    @Test
    void createMember_isActiveWithTodaysDate() {
        when(memberRepository.existsByDni("30111222")).thenReturn(false);
        when(memberRepository.existsByMemberNumber("15")).thenReturn(false);
        when(memberRepository.save(any(Member.class))).thenAnswer(inv -> inv.getArgument(0));

        MemberDTO created = memberService.createMember(newMember("30111222", "15"));

        assertThat(created.getStatus()).isEqualTo("ACTIVE");
        assertThat(created.getRegistrationDate()).isEqualTo(LocalDate.now().toString());
        assertThat(created.getMemberNumber()).isEqualTo("15");
    }

    @Test
    void createMember_rejectsDuplicateDni() {
        when(memberRepository.existsByDni("30111222")).thenReturn(true);

        assertThatThrownBy(() -> memberService.createMember(newMember("30111222", null)))
                .hasMessageContaining("DNI");
        verify(memberRepository, never()).save(any());
    }

    @Test
    void createMember_rejectsDuplicateMemberNumber() {
        when(memberRepository.existsByDni("30111222")).thenReturn(false);
        when(memberRepository.existsByMemberNumber("15")).thenReturn(true);

        assertThatThrownBy(() -> memberService.createMember(newMember("30111222", "15")))
                .hasMessageContaining("número de socio");
        verify(memberRepository, never()).save(any());
    }

    @Test
    void createMember_storesBlankMemberNumberAsNull() {
        when(memberRepository.existsByDni("30111222")).thenReturn(false);
        when(memberRepository.save(any(Member.class))).thenAnswer(inv -> inv.getArgument(0));

        memberService.createMember(newMember("30111222", "  "));

        ArgumentCaptor<Member> saved = ArgumentCaptor.forClass(Member.class);
        verify(memberRepository).save(saved.capture());
        assertThat(saved.getValue().getMemberNumber()).isNull();
    }

    @Test
    void updateMember_rejectsDniOfAnotherMember() {
        when(memberRepository.findById(1L)).thenReturn(Optional.of(new Member()));
        when(memberRepository.existsByDniAndIdNot("30111222", 1L)).thenReturn(true);

        assertThatThrownBy(() -> memberService.updateMember(1L, newMember("30111222", null)))
                .hasMessageContaining("otro socio");
    }

    @Test
    void createMember_requiresDni() {
        assertThatThrownBy(() -> memberService.createMember(newMember("  ", null)))
                .hasMessageContaining("obligatorio");
        verify(memberRepository, never()).save(any());
    }

    @Test
    void updateMember_requiresDni() {
        when(memberRepository.findById(1L)).thenReturn(Optional.of(new Member()));

        assertThatThrownBy(() -> memberService.updateMember(1L, newMember(null, null)))
                .hasMessageContaining("obligatorio");
        verify(memberRepository, never()).save(any());
    }

    @Test
    void updateMember_failsWhenMissing() {
        when(memberRepository.findById(9L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> memberService.updateMember(9L, newMember("1", null)))
                .hasMessageContaining("no encontrado");
    }

    @Test
    void deactivateAndActivate_changeStatus() {
        Member member = new Member();
        member.setStatus(Member.MemberStatus.ACTIVE);
        when(memberRepository.findById(1L)).thenReturn(Optional.of(member));

        memberService.deactivateMember(1L);
        assertThat(member.getStatus()).isNotEqualTo(Member.MemberStatus.ACTIVE);

        memberService.activateMember(1L);
        assertThat(member.getStatus()).isEqualTo(Member.MemberStatus.ACTIVE);
    }
}
