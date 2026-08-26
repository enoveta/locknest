\# LockNest Database Schema



\## Database



LockNest uses a local SQLite database for the MVP.



The database stores application configuration, sessions, authentication attempts,

and security events.



Sensitive authentication secrets are NOT stored in SQLite.

They will be protected using Android secure storage/Keystore.



\## Tables



\### users

Stores the local LockNest user/device profile.



\### protected\_apps

Stores applications selected by the user for protection.



\### lock\_settings

Stores security settings for protected applications.



\### stay\_sessions

Stores Stay Mode sessions.



\### guest\_sessions

Stores Guest Mode sessions.



\### guest\_allowed\_apps

Stores applications allowed during a guest session.



\### security\_events

Stores important security events.



\### auth\_attempts

Stores individual authentication attempts.



\### intruder\_evidence

Stores references to intruder evidence files.



\## Security



\- Do not store plain-text PINs or passwords.

\- Do not store authentication secrets in SQLite.

\- Store intruder images in private application storage.

\- SQLite stores the path/reference to evidence files.

\- Sensitive secrets should use Android Keystore/secure storage.

