-- Initial ticket data for the helpdesk system
INSERT INTO Ticket (id, ticketId, content) VALUES (1, 'TKT-101', 'User cannot login to VPN. Potential LDAP sync issue.');
INSERT INTO Ticket (id, ticketId, content) VALUES (2, 'TKT-102', 'Production DB is slow. Check the connection pool.');
INSERT INTO Ticket (id, ticketId, content) VALUES (3, 'TKT-103', 'Speaker portal password reset request.');
INSERT INTO Ticket (id, ticketId, content) VALUES (4, 'TKT-104', 'Email server returning 503 errors. Users in EU region affected. Possible DNS propagation issue.');
INSERT INTO Ticket (id, ticketId, content) VALUES (5, 'TKT-105', 'New employee onboarding: needs access to GitHub, Jira, Confluence, and AWS console.');
INSERT INTO Ticket (id, ticketId, content) VALUES (6, 'TKT-106', 'Customer reports data export timing out after 30 minutes. Export size: 2.3GB CSV.');
INSERT INTO Ticket (id, ticketId, content) VALUES (7, 'TKT-107', 'Security alert: Unusual login pattern detected from IP 203.0.113.42 for admin account.');
INSERT INTO Ticket (id, ticketId, content) VALUES (8, 'TKT-108', 'Kubernetes pod CrashLoopBackOff in production namespace. OOM killed 3 times in last hour.');