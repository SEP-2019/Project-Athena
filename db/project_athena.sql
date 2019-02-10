SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE `courses` (
  `course_code` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `department` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `course_coreq` (
  `course_code` varchar(255) DEFAULT NULL,
  `coreq_course_code` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `course_offerings` (
  `id` int(11) NOT NULL,
  `semester` varchar(255) NOT NULL,
  `scheduled_time` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `course_prereq` (
  `course_code` varchar(255) DEFAULT NULL,
  `prereq_course_code` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `course_tag` (
  `course_code` varchar(255) DEFAULT NULL,
  `tag_name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `curriculums` (
  `curriculum_name` varchar(255) NOT NULL,
  `type` varchar(255) DEFAULT NULL,
  `department` varchar(255) DEFAULT NULL,
  `numOfElectives` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `curriculum_complementaries` (
  `curriculum_name` varchar(255) DEFAULT NULL,
  `course_code` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `curriculum_core_class` (
  `curriculum_name` varchar(255) DEFAULT NULL,
  `course_code` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `curriculum_tech_comp` (
  `curriculum_name` varchar(255) DEFAULT NULL,
  `course_code` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `reviews` (
  `review_id` int(11) NOT NULL,
  `rating` int(11) NOT NULL,
  `comment` varchar(255) DEFAULT NULL,
  `teacher_id` int(11) DEFAULT NULL,
  `course_code` varchar(255) DEFAULT NULL,
  `student_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `staff_members` (
  `staff_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `students` (
  `student_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `major` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `student_course_offerings` (
  `student_id` int(11) DEFAULT NULL,
  `offering_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `student_minor` (
  `student_id` int(11) DEFAULT NULL,
  `curriculum_name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `tags` (
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `teachers` (
  `teacher_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `teacher_course_offerings` (
  `teacher_id` int(11) DEFAULT NULL,
  `offering_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `name` varchar(256) DEFAULT NULL,
  `email` varchar(256) DEFAULT NULL,
  `password` varchar(256) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `courses`
  ADD PRIMARY KEY (`course_code`);

ALTER TABLE `course_coreq`
  ADD KEY `course_code` (`course_code`),
  ADD KEY `coreq_course_code` (`coreq_course_code`);

ALTER TABLE `course_offerings`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `course_prereq`
  ADD KEY `course_code` (`course_code`),
  ADD KEY `prereq_course_code` (`prereq_course_code`);

ALTER TABLE `course_tag`
  ADD KEY `course_code` (`course_code`),
  ADD KEY `tag_name` (`tag_name`);

ALTER TABLE `curriculums`
  ADD PRIMARY KEY (`curriculum_name`);

ALTER TABLE `curriculum_complementaries`
  ADD KEY `curriculum_name` (`curriculum_name`),
  ADD KEY `course_code` (`course_code`);

ALTER TABLE `curriculum_core_class`
  ADD KEY `curriculum_name` (`curriculum_name`),
  ADD KEY `course_code` (`course_code`);

ALTER TABLE `curriculum_tech_comp`
  ADD KEY `curriculum_name` (`curriculum_name`),
  ADD KEY `course_code` (`course_code`);

ALTER TABLE `reviews`
  ADD PRIMARY KEY (`review_id`);

ALTER TABLE `staff_members`
  ADD PRIMARY KEY (`staff_id`);

ALTER TABLE `students`
  ADD PRIMARY KEY (`student_id`),
  ADD KEY `user_id` (`user_id`);

ALTER TABLE `student_course_offerings`
  ADD KEY `student_id` (`student_id`),
  ADD KEY `offering_id` (`offering_id`);

ALTER TABLE `student_minor`
  ADD KEY `student_id` (`student_id`),
  ADD KEY `curriculum_name` (`curriculum_name`);

ALTER TABLE `tags`
  ADD PRIMARY KEY (`name`);

ALTER TABLE `teachers`
  ADD PRIMARY KEY (`teacher_id`);

ALTER TABLE `teacher_course_offerings`
  ADD KEY `teacher_id` (`teacher_id`),
  ADD KEY `offering_id` (`offering_id`);

ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

ALTER TABLE `reviews`
  MODIFY `review_id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `teachers`
  MODIFY `teacher_id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT;


ALTER TABLE `course_coreq`
  ADD CONSTRAINT `course_coreq_ibfk_1` FOREIGN KEY (`course_code`) REFERENCES `courses` (`course_code`),
  ADD CONSTRAINT `course_coreq_ibfk_2` FOREIGN KEY (`coreq_course_code`) REFERENCES `courses` (`course_code`),
  ADD CONSTRAINT `course_coreq_ibfk_3` FOREIGN KEY (`course_code`) REFERENCES `courses` (`course_code`),
  ADD CONSTRAINT `course_coreq_ibfk_4` FOREIGN KEY (`coreq_course_code`) REFERENCES `courses` (`course_code`);

ALTER TABLE `course_prereq`
  ADD CONSTRAINT `course_prereq_ibfk_1` FOREIGN KEY (`course_code`) REFERENCES `courses` (`course_code`),
  ADD CONSTRAINT `course_prereq_ibfk_2` FOREIGN KEY (`prereq_course_code`) REFERENCES `courses` (`course_code`),
  ADD CONSTRAINT `course_prereq_ibfk_3` FOREIGN KEY (`course_code`) REFERENCES `courses` (`course_code`),
  ADD CONSTRAINT `course_prereq_ibfk_4` FOREIGN KEY (`prereq_course_code`) REFERENCES `courses` (`course_code`);

ALTER TABLE `course_tag`
  ADD CONSTRAINT `course_tag_ibfk_1` FOREIGN KEY (`course_code`) REFERENCES `courses` (`course_code`),
  ADD CONSTRAINT `course_tag_ibfk_2` FOREIGN KEY (`course_code`) REFERENCES `courses` (`course_code`),
  ADD CONSTRAINT `course_tag_ibfk_3` FOREIGN KEY (`tag_name`) REFERENCES `tags` (`name`);

ALTER TABLE `curriculum_complementaries`
  ADD CONSTRAINT `curriculum_complementaries_ibfk_1` FOREIGN KEY (`curriculum_name`) REFERENCES `curriculums` (`curriculum_name`),
  ADD CONSTRAINT `curriculum_complementaries_ibfk_2` FOREIGN KEY (`course_code`) REFERENCES `courses` (`course_code`);

ALTER TABLE `curriculum_core_class`
  ADD CONSTRAINT `curriculum_core_class_ibfk_1` FOREIGN KEY (`curriculum_name`) REFERENCES `curriculums` (`curriculum_name`),
  ADD CONSTRAINT `curriculum_core_class_ibfk_2` FOREIGN KEY (`course_code`) REFERENCES `courses` (`course_code`);

ALTER TABLE `curriculum_tech_comp`
  ADD CONSTRAINT `curriculum_tech_comp_ibfk_1` FOREIGN KEY (`curriculum_name`) REFERENCES `curriculums` (`curriculum_name`),
  ADD CONSTRAINT `curriculum_tech_comp_ibfk_2` FOREIGN KEY (`course_code`) REFERENCES `courses` (`course_code`);

ALTER TABLE `students`
  ADD CONSTRAINT `students_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

ALTER TABLE `student_course_offerings`
  ADD CONSTRAINT `student_course_offerings_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`),
  ADD CONSTRAINT `student_course_offerings_ibfk_2` FOREIGN KEY (`offering_id`) REFERENCES `course_offerings` (`id`);

ALTER TABLE `student_minor`
  ADD CONSTRAINT `student_minor_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`),
  ADD CONSTRAINT `student_minor_ibfk_2` FOREIGN KEY (`curriculum_name`) REFERENCES `curriculums` (`curriculum_name`);

ALTER TABLE `teacher_course_offerings`
  ADD CONSTRAINT `teacher_course_offerings_ibfk_1` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`teacher_id`),
  ADD CONSTRAINT `teacher_course_offerings_ibfk_2` FOREIGN KEY (`offering_id`) REFERENCES `course_offerings` (`id`);
COMMIT;
