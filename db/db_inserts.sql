--Initial inserts 
INSERT INTO courses (course_code,title, department) VALUES
    ('ECSE 428','Software engineering in practice','ECSE');

INSERT INTO tags(name) VALUES
    ('Engineering');

INSERT INTO course_tag (course_code, tag_name) VALUES
    ('ECSE 428', 'Engineering');