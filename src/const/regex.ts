export const regex = {
    login_token_csrf: /<input[^>]*name="token_csrf"[^>]*value="([^"]+)"/,
    check_instance_netypareo: /NetYParéo ©/g,
    check_instance_ymag: /YMAG/g,
    student_timetable: /var planningJSON += (.+);/
};