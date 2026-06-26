package com.example.ttcs_be.repository;

import com.example.ttcs_be.model.ReviewVote;
import com.example.ttcs_be.model.ReviewVoteId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReviewVoteRepository extends JpaRepository<ReviewVote, ReviewVoteId> {

    // Tính tổng điểm (Upvote +1, Downvote -1) cho 1 bài review
    @Query("SELECT COALESCE(SUM(v.voteType), 0) FROM ReviewVote v WHERE v.review.id = :reviewId")
    int getHelpfulScoreByReviewId(@Param("reviewId") Long reviewId);
}