\# LockNest Database Tables



\## 1. users



Stores the local LockNest user/device profile.



| Column | Type | Rules |

|---|---|---|

| id | INTEGER | PRIMARY KEY |

| device\_id | TEXT | UNIQUE, NOT NULL |

| created\_at | TEXT | NOT NULL |

| updated\_at | TEXT | NOT NULL |



\## 2. protected\_apps



Stores applications protected by LockNest.



| Column | Type | Rules |

|---|---|---|

| id | INTEGER | PRIMARY KEY |

| user\_id | INTEGER | FOREIGN KEY → users.id |

| package\_name | TEXT | NOT NULL |

| app\_name | TEXT | NOT NULL |

| is\_locked | INTEGER | NOT NULL, DEFAULT 1 |

| created\_at | TEXT | NOT NULL |

| updated\_at | TEXT | NOT NULL |



\## 3. lock\_settings



Stores security settings for protected applications.



| Column | Type | Rules |

|---|---|---|

| id | INTEGER | PRIMARY KEY |

| protected\_app\_id | INTEGER | FOREIGN KEY → protected\_apps.id |

| auth\_method | TEXT | NOT NULL |

| biometric\_enabled | INTEGER | DEFAULT 0 |

| max\_attempts | INTEGER | DEFAULT 5 |

| intruder\_detection\_enabled | INTEGER | DEFAULT 1 |

| created\_at | TEXT | NOT NULL |

| updated\_at | TEXT | NOT NULL |



\## 4. stay\_sessions



Stores Stay Mode sessions.



| Column | Type | Rules |

|---|---|---|

| id | INTEGER | PRIMARY KEY |

| user\_id | INTEGER | FOREIGN KEY → users.id |

| package\_name | TEXT | NOT NULL |

| started\_at | TEXT | NOT NULL |

| ended\_at | TEXT | NULL |

| is\_active | INTEGER | DEFAULT 1 |



\## 5. guest\_sessions



Stores Guest Mode sessions.



| Column | Type | Rules |

|---|---|---|

| id | INTEGER | PRIMARY KEY |

| user\_id | INTEGER | FOREIGN KEY → users.id |

| started\_at | TEXT | NOT NULL |

| ended\_at | TEXT | NULL |

| expires\_at | TEXT | NULL |

| is\_active | INTEGER | DEFAULT 1 |



\## 6. guest\_allowed\_apps



Stores applications allowed during a guest session.



| Column | Type | Rules |

|---|---|---|

| id | INTEGER | PRIMARY KEY |

| guest\_session\_id | INTEGER | FOREIGN KEY → guest\_sessions.id |

| package\_name | TEXT | NOT NULL |



\## 7. security\_events



Stores important security events.



| Column | Type | Rules |

|---|---|---|

| id | INTEGER | PRIMARY KEY |

| user\_id | INTEGER | FOREIGN KEY → users.id |

| event\_type | TEXT | NOT NULL |

| package\_name | TEXT | NULL |

| description | TEXT | NULL |

| created\_at | TEXT | NOT NULL |



\## 8. auth\_attempts



Stores authentication attempts.



| Column | Type | Rules |

|---|---|---|

| id | INTEGER | PRIMARY KEY |

| security\_event\_id | INTEGER | FOREIGN KEY → security\_events.id |

| package\_name | TEXT | NULL |

| method | TEXT | NOT NULL |

| successful | INTEGER | NOT NULL |

| attempted\_at | TEXT | NOT NULL |



\## 9. intruder\_evidence



Stores references to captured intruder evidence.



| Column | Type | Rules |

|---|---|---|

| id | INTEGER | PRIMARY KEY |

| security\_event\_id | INTEGER | FOREIGN KEY → security\_events.id |

| file\_path | TEXT | NOT NULL |

| captured\_at | TEXT | NOT NULL |

| is\_viewed | INTEGER | DEFAULT 0 |

| deleted\_at | TEXT | NULL |



\## Relationships



users

→ protected\_apps

→ lock\_settings



users

→ stay\_sessions



users

→ guest\_sessions

→ guest\_allowed\_apps



users

→ security\_events

→ auth\_attempts



security\_events

→ intruder\_evidence



\## Indexes



The following indexes will be created:



\- idx\_protected\_apps\_user

\- idx\_protected\_apps\_package

\- idx\_security\_events\_user

\- idx\_security\_events\_created

\- idx\_auth\_attempts\_event

\- idx\_evidence\_event



\## Security Rules



\- Never store plain-text PINs or passwords in SQLite.

\- Authentication secrets must use secure storage/Android Keystore.

\- Intruder images are stored in private application storage.

\- SQLite stores only the evidence file path.

