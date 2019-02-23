--Initial inserts, ad inserts here that should ALWAYS be in the database
INSERT INTO courses
    (course_code,title, department)
VALUES
    ('ECSE 428', 'Software engineering in practice', 'ECSE');

INSERT INTO tags
    (name)
VALUES
    ('Engineering');

INSERT INTO course_tag
    (course_code, tag_name)
VALUES
    ('ECSE 428', 'Engineering');

INSERT INTO `
users`
(username, email, password)
VALUES
    ('academicStaff1', 'academic.staff.1@mcgill.ca', 'qxGPhzqRSjmjwmaSaC6z7UrouwrJrUQYfqdBiSk3GqnTus4BeoPT5TicDtT2xoP0YTJBTMgdBGG9Wyw36DhFzA=='),
    ('academicStaff5', 'staff.email.internal.sample@internal.mcgill.ca', '2bjEO8IVgKQinHUGt2lYZuWrtwq8ERFfE+6ZVmWwhvgYrJiCAmt2UyVd/1oanS333ypHVkpzPjRYQg+TQrd3uw=='),
    ('aegrousT', 'aegrous@email.ca', 'zE7PsLYIbxNMVeYXBJxFD9moslNCzk/XHqw8jic7TYkLe4gjpVO+hzROmf1Ua0w3PQxt2NHQZBzq280OFWrXOQ=='),
    ('ANcRIALm', 'ancrialm@mail.mcgill.ca', 'WbGVjuHt3PWKUluR0OkTh+xP8oKlrucRtroNs/RndfHUD5d7wtv25c1/e21fBpVPdA1EH4+1UdnJnMDM25H/uQ=='),
    ('basicstudent1', 'basic.student.1@mail.mcgill.ca', 'sQnzu7wkTrgkQZF+0G1hi5AI3Qmzvv0bXgc5THBqi7mAsdd4Xll27ASbRt9fEyavWi6m0QP9B8lThf+rDKy8hg=='),
    ('EarEnTYl', 'ear.enty@gmail.com', 'yUe4Te2vh5k+hmcG5D+zB2VEWzVUR8d3HZTqYFgVfkjTOqKRAKObr8ZQLsUugVv6bxTOY323w7WWDCh4+ffI/Q=='),
    ('jqT56', 'jqt@mcgill.ca', 'Zn9q6Kl1UfV1hq5zqp9O70o3Bn7MZgMdF1BwhRE2h7Cbi+rXpPpFbh24tTimD55Lpq10b731QP4n+HnygozH9Q=='),
    ('MYetices', 'my@hotmail.outlook.com', 'kVTBXBD9FigNrLv+stXGCYSQq96/lpNY96GumpNuM+aTeJhp34boy2APzxMz3z3fpr1LIXpqVfQUjdNKw3iYHw=='),
    ('ostGArSI', 'ost.garsi@mail.mcgill.ca', '9K3ibsIp6L4+FIz9pThgCKsfJ3LPT05T/8Y987dW3hLfwBTidDjlMvlwSxA5fGeBYbvk0fUmVQfGR4mE/V7zaA=='),
    ('RuCyARvA', 'ryu@mcgill.ca', '3jv0RNc6B7wYMjCNVIcenaHWHuivJfBA8NJ+7kMS2SffsQA6b9fWrMNcboGyMeNdP5yJ6qhxgRsrIHHpfgOr3g=='),
    ('studentUser1', 'student.user1@mail.mcgill.ca', 'D8VvtoIJifnoqTYDaUJmtbKZ+RhMGRYVJ61vKi6a2L0t81ILV0mH2j67W+P0rPtt0blo0gxnBplIBtNWwT0JMQ=='),
    ('testStaff10', 'test.staff.10@mail.mcgill.ca', 'wy86yqSnlhhM6uad06lYoeFVOg1RxvBp3tkCY7CGdB303nCXjqKcFYUAnhJhxEnLf6qUCjcIf8mXlnkV4czdbw=='),
    ('UPEUDECh', 'email.upeu@mcgill.internal.ca', 'Q26oDkTeIkW23Xmd1zJ0YNmNYp4A6tH+7cXZVRMskEVwCO22UQdpArQVE5WCKFiXPCopt2y/6J7cJyCnuLuuqQ==');

INSERT INTO `
staff_members`
(staff_id, username)
VALUES
    (75939, 'academicStaff1'),
    (523512, 'academicStaff5'),
    (52532, 'jqT56'),
    (3523828, 'testStaff10'),
    (81235235, 'UPEUDECh');

INSERT INTO `
students`
(student_id, username)
VALUES
    (382730172, 'aegrousT'),
    (240983713, 'ANcRIALm'),
    (255576823, 'basicstudent1'),
    (124749832, 'EarEnTYl'),
    (258937127, 'MYetices'),
    (263984018, 'ostGArSI'),
    (372639124, 'RuCyARvA'),
    (279263971, 'studentUser1');
