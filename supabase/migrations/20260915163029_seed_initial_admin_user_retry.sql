/*
# Seed Initial Admin User

Creates the default admin account for the Najran Water Laboratories admin dashboard.

- Username: admin
- Password: admin123
- Full name: مدير النظام
- Role: admin

This is a temporary password and should be changed after first login.
*/

SELECT create_admin_user('admin', 'admin123', 'مدير النظام', 'admin');
