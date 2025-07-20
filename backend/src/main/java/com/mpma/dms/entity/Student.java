package com.mpma.dms.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "student")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student {

    @Id
    private Long id; // same as user's id

    @OneToOne
    @MapsId
    @JoinColumn(name = "id")
    private User user;

//    @Column(nullable = false)
    private String fullName;

//    @Column(nullable = false)
    private String nameWithInitials;

//    @Column(nullable = false)
    private String nic;

    @Column
    private Float gpa;

//    @Column(nullable = false)
    private boolean isEligible;
}

