INSERT INTO courses
    (course_code,title, department)
VALUES
    ('ECSE 428', 'Software engineering in practice', 'ECSE'),
    ('ECSE 362', 'Fundamentals of Power Eng', 'ECSE'),
    ('ECSE 210', 'Electric Circuits 2', 'ECSE'),
    ('ECSE 251', 'Electric and Magnetic Fields', 'ECSE'),
    ('CIVE 281', 'Analytical Mechanics', 'CIVE')
ON DUPLICATE KEY
UPDATE course_code=course_code;

INSERT INTO tags
    (name)
VALUES
    ('Engineering'),
    ('Power Engineering')
ON DUPLICATE KEY
UPDATE name=name;

INSERT INTO course_tags
    (course_code, tag_name)
VALUES
    ('ECSE 428', 'Engineering'),
    ('ECSE 362', 'Engineering'),
    ('ECSE 362', 'Power Engineering')
ON DUPLICATE KEY
UPDATE course_code=course_code;

INSERT INTO course_prereqs
    (course_code, prereq_course_code)
VALUES
    ('ECSE 362', 'ECSE 210'),
    ('ECSE 362', 'ECSE 251'),
    ('ECSE 362', 'CIVE 281')
ON DUPLICATE KEY
UPDATE course_code=course_code;