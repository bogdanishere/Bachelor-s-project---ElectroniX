-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: electronix2
-- ------------------------------------------------------
-- Server version	8.0.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `orderdetails`
--

DROP TABLE IF EXISTS `orderdetails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orderdetails` (
  `order_detail_id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` varchar(255) NOT NULL,
  `provider_username` varchar(255) NOT NULL,
  `provider_approved` tinyint(1) NOT NULL DEFAULT '0',
  `quantity` int NOT NULL,
  `arrival_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('in pregatire','in drum spre dumneavoastra','livrata') NOT NULL DEFAULT 'in pregatire',
  PRIMARY KEY (`order_detail_id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`),
  KEY `provider_username` (`provider_username`),
  CONSTRAINT `orderdetails_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `order` (`order_id`),
  CONSTRAINT `orderdetails_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`),
  CONSTRAINT `orderdetails_ibfk_3` FOREIGN KEY (`provider_username`) REFERENCES `provider` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=90 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orderdetails`
--

LOCK TABLES `orderdetails` WRITE;
/*!40000 ALTER TABLE `orderdetails` DISABLE KEYS */;
INSERT INTO `orderdetails` VALUES (68,60,'AWImbym8Hh53nbDRHk6w','Bestbuy.com',1,1,'2024-04-02 16:58:27','livrata'),(69,60,'AVpg9lcJ1cnluZ0-8h3k','bhphotovideo.com',0,2,'2024-04-02 16:58:05','livrata'),(70,60,'AVqVGTtCv8e3D1O-ldE3','Bestbuy.com',1,1,'2024-04-02 16:58:27','livrata'),(71,61,'AWImbym8Hh53nbDRHk6w','Bestbuy.com',1,1,'2024-04-02 15:16:17','livrata'),(72,61,'AVpg9lcJ1cnluZ0-8h3k','bhphotovideo.com',0,2,'2024-04-02 17:13:53','livrata'),(73,61,'AVphvkgGLJeJML43eVIb','Bestbuy.com',1,1,'2024-04-02 15:16:17','livrata'),(74,62,'AWImbym8Hh53nbDRHk6w','Bestbuy.com',1,1,'2024-04-02 23:54:19','livrata'),(75,62,'AVpg9lcJ1cnluZ0-8h3k','bhphotovideo.com',0,2,'2024-04-02 23:53:10','in pregatire'),(77,63,'AWImbym8Hh53nbDRHk6w','Bestbuy.com',1,1,'2024-04-03 02:03:21','livrata'),(78,63,'AVpg9lcJ1cnluZ0-8h3k','bhphotovideo.com',0,2,'2024-04-03 02:03:04','in pregatire'),(79,63,'AVqVGTtCv8e3D1O-ldE3','Bestbuy.com',1,1,'2024-04-03 02:03:21','livrata'),(80,64,'AVs4UxVHU2_QcyX9P_Gp','Bestbuy.com',1,1,'2024-04-03 17:03:16','in drum spre dumneavoastra'),(81,64,'AVqVGTt2v8e3D1O-ldE7','Bestbuy.com',1,2,'2024-04-03 17:03:16','in drum spre dumneavoastra'),(83,65,'AVzxqGmivKc47QAVfTIA','Video & Audio Center',0,2,'2024-04-03 17:24:12','in pregatire'),(84,65,'AVphvkgGLJeJML43eVIb','Bestbuy.com',1,1,'2024-04-03 17:26:47','in drum spre dumneavoastra'),(85,65,'AVpfm9_AilAPnD_xe8Dd','bhphotovideo.com',0,1,'2024-04-03 17:24:12','in pregatire'),(87,66,'AWImbym8Hh53nbDRHk6w','Bestbuy.com',1,1,'2024-04-03 17:29:27','in drum spre dumneavoastra'),(88,66,'AVpg9lcJ1cnluZ0-8h3k','bhphotovideo.com',0,2,'2024-04-03 17:29:09','in pregatire'),(89,66,'AVwvFm-zU2_QcyX9R3FA','Bestbuy.com',1,1,'2024-04-03 17:29:27','in drum spre dumneavoastra');
/*!40000 ALTER TABLE `orderdetails` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-04-04  6:28:29
