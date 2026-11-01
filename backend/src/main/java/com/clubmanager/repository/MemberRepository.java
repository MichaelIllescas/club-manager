package com.clubmanager.repository;

import com.clubmanager.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {

    public List<Member> findAllByStatus(Member.MemberStatus status);

    Optional<Member> findByDni(String dni);
    Optional<Member> findByMemberNumber(String memberNumber);

    boolean existsByDni(String dni);
    boolean existsByMemberNumber(String memberNumber);

    // Existence checks that exclude an id, used when updating
    boolean existsByDniAndIdNot(String dni, Long id);
    boolean existsByMemberNumberAndIdNot(String memberNumber, Long id);
}
