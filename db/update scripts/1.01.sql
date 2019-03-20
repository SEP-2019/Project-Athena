-- Apply to dev database once PR merged
ALTER TABLE courses ADD COLUMN phased_out BOOLEAN default '0';

ALTER TABLE course_offerings MODIFY COLUMN id INT auto_increment;

ALTER TABLE course_offerings ADD FOREIGN KEY (course_code) REFERENCES courses(course_code);
ALTER TABLE course_tag ADD CONSTRAINT primary_key PRIMARY KEY (course_code, tag_name);
ALTER TABLE course_prereq ADD CONSTRAINT primary_key PRIMARY KEY (course_code, prereq_course_code);
ALTER TABLE course_coreq ADD CONSTRAINT primary_key PRIMARY KEY (course_code, coreq_course_code);

ALTER TABLE course_coreq RENAME TO course_coreqs;
ALTER TABLE course_prereq RENAME TO course_prereqs;
ALTER TABLE course_tag RENAME TO course_tags;
ALTER TABLE curriculum_core_class RENAME TO curriculum_core_classes;
ALTER TABLE curriculum_tech_comp RENAME TO curriculum_tech_comps;
ALTER TABLE student_major RENAME TO student_majors;
ALTER TABLE student_minor RENAME TO student_minors;