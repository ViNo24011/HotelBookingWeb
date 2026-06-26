package com.example.ttcs_be.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "review_vote")
public class ReviewVote {

    @EmbeddedId
    private ReviewVoteId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("reviewId")
    @JoinColumn(name = "review_id")
    private Review review;

    @Column(name = "vote_type", nullable = false)
    private int voteType; // 1 là Upvote, -1 là Downvote

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}