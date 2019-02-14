-- MySQL dump 10.13  Distrib 5.7.25, for Win64 (x86_64)
--
-- Host: us-cdbr-iron-east-03.cleardb.net    Database: heroku_f11d5f6ef0dc063
-- ------------------------------------------------------
-- Server version	5.5.56-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `course_coreq`
--

DROP TABLE IF EXISTS `course_coreq`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `course_coreq` (
  `course_code` varchar(64) NOT NULL,
  `coreq_course_code` varchar(64) NOT NULL,
  KEY `course_coreq_courses_idx` (`course_code`),
  KEY `course_coreq_coreq_courses_idx` (`coreq_course_code`),
  CONSTRAINT `course_coreq_courses` FOREIGN KEY (`course_code`) REFERENCES `courses` (`course_code`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `course_coreq_coreq_courses` FOREIGN KEY (`coreq_course_code`) REFERENCES `courses` (`course_code`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `course_offerings`
--

DROP TABLE IF EXISTS `course_offerings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `course_offerings` (
  `id` int(11) NOT NULL,
  `semester` varchar(64) NOT NULL,
  `scheduled_time` varchar(128) NOT NULL,
  `course_code` varchar(64) NOT NULL,
  `section` int(11) NOT NULL,
  PRIMARY KEY (`id`,`semester`),
  KEY `course_offerings_course_code_idx` (`course_code`),
  CONSTRAINT `course_offerings_course_code` FOREIGN KEY (`course_code`) REFERENCES `courses` (`course_code`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `course_prereq`
--

DROP TABLE IF EXISTS `course_prereq`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `course_prereq` (
  `course_code` varchar(64) NOT NULL,
  `prereq_course_code` varchar(64) NOT NULL,
  KEY `course_prereq_courses_idx` (`course_code`),
  KEY `course_prereq_prereq_courses_idx` (`prereq_course_code`),
  CONSTRAINT `course_prereq_courses` FOREIGN KEY (`course_code`) REFERENCES `courses` (`course_code`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `course_prereq_prereq_courses` FOREIGN KEY (`prereq_course_code`) REFERENCES `courses` (`course_code`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `course_tag`
--

DROP TABLE IF EXISTS `course_tag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `course_tag` (
  `course_code` varchar(64) NOT NULL,
  `tag_name` varchar(128) NOT NULL,
  KEY `course_tag_courses_idx` (`course_code`),
  KEY `course_tag_tags_idx` (`tag_name`),
  CONSTRAINT `course_tag_courses` FOREIGN KEY (`course_code`) REFERENCES `courses` (`course_code`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `course_tag_tags` FOREIGN KEY (`tag_name`) REFERENCES `tags` (`name`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `courses` (
  `course_code` varchar(64) NOT NULL,
  `title` varchar(512) NOT NULL,
  `department` varchar(256) NOT NULL,
  PRIMARY KEY (`course_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `curriculum_complementaries`
--

DROP TABLE IF EXISTS `curriculum_complementaries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `curriculum_complementaries` (
  `curriculum_name` varchar(128) NOT NULL,
  `course_code` varchar(64) NOT NULL,
  KEY `curriculum_name` (`curriculum_name`),
  KEY `course_code` (`course_code`),
  CONSTRAINT `curriculum_complementaries_curriculums` FOREIGN KEY (`curriculum_name`) REFERENCES `curriculums` (`curriculum_name`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `curriculum_complementaries_courses` FOREIGN KEY (`course_code`) REFERENCES `courses` (`course_code`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `curriculum_core_class`
--

DROP TABLE IF EXISTS `curriculum_core_class`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `curriculum_core_class` (
  `curriculum_name` varchar(128) NOT NULL,
  `course_code` varchar(64) NOT NULL,
  KEY `curriculum_core_class_curriculums_idx` (`curriculum_name`),
  KEY `curriculum_core_class_courses_idx` (`course_code`),
  CONSTRAINT `curriculum_core_class_curriculums` FOREIGN KEY (`curriculum_name`) REFERENCES `curriculums` (`curriculum_name`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `curriculum_core_class_courses` FOREIGN KEY (`course_code`) REFERENCES `courses` (`course_code`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `curriculum_tech_comp`
--

DROP TABLE IF EXISTS `curriculum_tech_comp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `curriculum_tech_comp` (
  `curriculum_name` varchar(128) NOT NULL,
  `course_code` varchar(64) NOT NULL,
  KEY `curriculum_tech_comp_curriculums_idx` (`curriculum_name`),
  KEY `curriculum_tech_comp_courses_idx` (`course_code`),
  CONSTRAINT `curriculum_tech_comp_curriculums` FOREIGN KEY (`curriculum_name`) REFERENCES `curriculums` (`curriculum_name`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `curriculum_tech_comp_courses` FOREIGN KEY (`course_code`) REFERENCES `courses` (`course_code`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `curriculums`
--

DROP TABLE IF EXISTS `curriculums`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `curriculums` (
  `curriculum_name` varchar(128) NOT NULL,
  `type` varchar(64) NOT NULL,
  `department` varchar(256) NOT NULL,
  `numOfElectives` int(11) NOT NULL,
  PRIMARY KEY (`curriculum_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reviews` (
  `review_id` int(11) NOT NULL AUTO_INCREMENT,
  `rating` int(11) NOT NULL,
  `comment` text,
  `teacher_id` int(11) DEFAULT NULL,
  `course_code` varchar(64) DEFAULT NULL,
  `student_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`review_id`),
  KEY `reviews_teacher_id_idx` (`teacher_id`),
  KEY `reviews_course_code_idx` (`course_code`),
  KEY `reviews_student_id_idx` (`student_id`),
  CONSTRAINT `reviews_course_code` FOREIGN KEY (`course_code`) REFERENCES `courses` (`course_code`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `reviews_student_id` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `reviews_teacher_id` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`teacher_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `staff_members`
--

DROP TABLE IF EXISTS `staff_members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `staff_members` (
  `staff_id` int(11) NOT NULL,
  `username` varchar(64) NOT NULL,
  PRIMARY KEY (`staff_id`),
  KEY `staff_username_idx` (`username`),
  CONSTRAINT `staff_username` FOREIGN KEY (`username`) REFERENCES `users` (`username`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `student_course_offerings`
--

DROP TABLE IF EXISTS `student_course_offerings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `student_course_offerings` (
  `student_id` int(11) NOT NULL,
  `offering_id` int(11) NOT NULL,
  `semester` varchar(64) NOT NULL,
  KEY `student_course_offerings_students_idx` (`student_id`),
  KEY `student_course_offerings_course_offerings_idx` (`offering_id`,`semester`),
  CONSTRAINT `student_course_offerings_students` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `student_course_offerings_course_offerings` FOREIGN KEY (`offering_id`, `semester`) REFERENCES `course_offerings` (`id`, `semester`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `student_major`
--

DROP TABLE IF EXISTS `student_major`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `student_major` (
  `student_id` int(11) NOT NULL,
  `curriculum_name` varchar(128) NOT NULL,
  KEY `student_major_students_idx` (`student_id`),
  KEY `student_major_curriculums_idx` (`curriculum_name`),
  CONSTRAINT `student_major_student_id` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `student_major_curriculums` FOREIGN KEY (`curriculum_name`) REFERENCES `curriculums` (`curriculum_name`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `student_minor`
--

DROP TABLE IF EXISTS `student_minor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `student_minor` (
  `student_id` int(11) NOT NULL,
  `curriculum_name` varchar(128) NOT NULL,
  KEY `student_minor_students_idx` (`student_id`),
  KEY `student_minor_curriculums_idx` (`curriculum_name`),
  CONSTRAINT `student_minor_students` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `student_minor_curriculums` FOREIGN KEY (`curriculum_name`) REFERENCES `curriculums` (`curriculum_name`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `students` (
  `student_id` int(11) NOT NULL,
  `username` varchar(64) NOT NULL,
  PRIMARY KEY (`student_id`),
  KEY `students_username_idx` (`username`),
  CONSTRAINT `students_username` FOREIGN KEY (`username`) REFERENCES `users` (`username`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tags`
--

DROP TABLE IF EXISTS `tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tags` (
  `name` varchar(128) NOT NULL,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `teacher_course_offerings`
--

DROP TABLE IF EXISTS `teacher_course_offerings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `teacher_course_offerings` (
  `teacher_id` int(11) NOT NULL,
  `offering_id` int(11) NOT NULL,
  `semester` varchar(64) NOT NULL,
  KEY `teacher_id` (`teacher_id`),
  KEY `teacher_course_offerings_offering_id_idx` (`offering_id`),
  KEY `teacher_course_offerings_semester_idx` (`semester`),
  KEY `teacher_course_offerings_course_offerings_idx` (`offering_id`,`semester`),
  CONSTRAINT `teacher_course_offerings_teachers` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`teacher_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `teacher_course_offerings_course_offerings` FOREIGN KEY (`offering_id`, `semester`) REFERENCES `course_offerings` (`id`, `semester`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `teachers`
--

DROP TABLE IF EXISTS `teachers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `teachers` (
  `teacher_id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(128) NOT NULL,
  `last_name` varchar(128) NOT NULL,
  `email` varchar(384) NOT NULL,
  PRIMARY KEY (`teacher_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `username` varchar(64) NOT NULL,
  `email` varchar(384) NOT NULL,
  `password` varchar(256) NOT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-02-14 17:38:21
