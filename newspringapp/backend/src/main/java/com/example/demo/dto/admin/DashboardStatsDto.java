package com.example.demo.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for returning overall dashboard statistics to the admin panel.
 * This includes counts of various entities managed through the portal.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsDto {

    /** Total number of registered alumni */
    private long totalAlumni;

    /** Total number of registered students */
    private long totalStudents;

    /** Total number of admin users */
    private long totalAdmins;

    /** Total feedback entries received */
    private long totalFeedback;

    /** Total number of events created */
    private long totalEvents;

    /** Total number of gallery items uploaded */
    private long totalGallery;

    /** Total number of broadcast emails sent */
    private long totalBroadcasts;

    /** Total number of committee members */
    private long totalMembers;

    /** Total number of videos uploaded */
    private long totalVideos;
}
