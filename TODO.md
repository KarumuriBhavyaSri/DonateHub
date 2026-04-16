# Task: Donor Profile - Show Posted Donations with Accept Button

## Current State:
- DonorProfile.jsx already has "Claims on My Donations" section with Accept/Reject buttons ✅
- Backend has API endpoints for:
  - GET /donations/donor/{donorId} - Get donor's posted donations
  - GET /donations/claims/donor/{donorId} - Get claims on donations
  - PUT /donations/claims/{claimId}/status?status=APPROVED/REJECTED - Update claim status

## Implementation Plan:
1. [x] Read and analyze DonorProfile.jsx
2. [ ] Add state for posted donations
3. [ ] Fetch posted donations from API: GET /donations/donor/{userId}
4. [ ] Add new section "My Posted Donations" in profile
5. [ ] Show claim status with accept/reject buttons for each donation

## Files to Modify:
- frontend/src/pages/DonorProfile.jsx
