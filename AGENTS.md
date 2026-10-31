# Project rules

- Family religion settings use the parent's profile and the existing `get_family_religion` function for linked children; this keeps one family-wide source of truth.
- Profile saves notify mounted auth hooks, and focus refreshes inherited religion, so navigation reflects settings changes without signing out.
- Islamic learning resolves child records with my_student_id; never use an auth UUID as a student row ID, and preserve the parent's admin_id on child writes.
- Quran progress, goals, and AI plans remain family-owned with server-enforced immutable ownership; child read/write policies scope to the individual student.
- AI study plans are generated server-side through AI Gateway, validated and saved before the interface reports success; family follow-up derives from saved progress, not sample data.- Results are stored in student_grades keyed by the child's auth user ID, with weighting details in notes JSON; one grade store feeds all dashboards.
- Students and Academics routes are adminOnly in ProtectedRoute; role checks stay server-backed via user_roles.
