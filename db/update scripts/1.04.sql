CREATE TABLE `student_desired_courses` (
  `course_code` varchar(64) NOT NULL,
  `student_id` int(11) NOT NULL,
  KEY `student_desired_courses_courses_idx` (`course_code`),
  KEY `student_desired_courses_student_id_idx` (`student_id`),
  CONSTRAINT `student_desired_courses_courses` FOREIGN KEY (`course_code`) REFERENCES `courses` (`course_code`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `student_desired_courses_student_id` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;