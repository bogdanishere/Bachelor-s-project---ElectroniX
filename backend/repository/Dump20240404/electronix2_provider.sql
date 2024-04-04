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
-- Table structure for table `provider`
--

DROP TABLE IF EXISTS `provider`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `provider` (
  `username` varchar(255) NOT NULL,
  `company` varchar(255) NOT NULL,
  PRIMARY KEY (`username`),
  CONSTRAINT `provider_ibfk_1` FOREIGN KEY (`username`) REFERENCES `user` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `provider`
--

LOCK TABLES `provider` WRITE;
/*!40000 ALTER TABLE `provider` DISABLE KEYS */;
INSERT INTO `provider` VALUES ('1 Stop Electronics Center, Inc.','1 Stop Electronics Center, Inc.'),('17th St Photo Supply Inc','17th St Photo Supply Inc'),('19th Hole Deals','19th Hole Deals'),('2011dailydeals','2011dailydeals'),('a1Components','a1Components'),('aapltree','aapltree'),('accesscables','accesscables'),('Acumen Disc','Acumen Disc'),('Adorama','Adorama'),('Aiwa Inc.','Aiwa Inc.'),('AMI Ventures Inc','AMI Ventures Inc'),('Audio Advice','Audio Advice'),('Audiosavings','Audiosavings'),('Audiovideodirect','Audiovideodirect'),('bargainbrokers','bargainbrokers'),('Beach Audio Inc','Beach Audio Inc'),('Beach Camera','Beach Camera'),('Best Buy','Best Buy'),('best_buy','best_buy'),('Bestbuy.com','Bestbuy.com'),('bestserviceguys','bestserviceguys'),('bhphotovideo.com','bhphotovideo.com'),('blinq','blinq'),('bluedealz-com','bluedealz-com'),('bornewinner','bornewinner'),('buydig','buydig'),('BuyVPC','BuyVPC'),('Car Audio Closeout','Car Audio Closeout'),('cashinwhi','cashinwhi'),('chrisdamron148','chrisdamron148'),('Circuit City - Walmart.com','Circuit City - Walmart.com'),('closeoutmartdeals','closeoutmartdeals'),('Clover Hill','Clover Hill'),('Coldriver20 Electronics Inc','Coldriver20 Electronics Inc'),('CompuDirect','CompuDirect'),('CosmeticMall','CosmeticMall'),('Creative Audio','Creative Audio'),('daniellcreighto_5','daniellcreighto_5'),('DealClock','DealClock'),('dealonline18','dealonline18'),('Dell.com','Dell.com'),('digiherd','digiherd'),('DigitalKynect','DigitalKynect'),('District Camera','District Camera'),('DLR Hunter','DLR Hunter'),('doitjust4fun','doitjust4fun'),('dwgreatdeals','dwgreatdeals'),('electricdiamond','electricdiamond'),('ElectroCell','ElectroCell'),('Electronic Express','Electronic Express'),('Electronics Expo (Authorized Dealer)','Electronics Expo (Authorized Dealer)'),('electronicsliquidators','electronicsliquidators'),('eLGeo Electronics','eLGeo Electronics'),('ericy23','ericy23'),('evergreenpoint','evergreenpoint'),('ewholesale2011','ewholesale2011'),('extremenetwork','extremenetwork'),('EZ Tech','EZ Tech'),('Fab4Electronics','Fab4Electronics'),('Focus Camera','Focus Camera'),('Focus Camera - Walmart.com','Focus Camera - Walmart.com'),('gabrians','gabrians'),('gadget-town','gadget-town'),('geekdeal','geekdeal'),('goldstar_tech','goldstar_tech'),('Good Guys Electronics','Good Guys Electronics'),('GRAMOPHONE (Authorized Dealer)','GRAMOPHONE (Authorized Dealer)'),('Growkart','Growkart'),('hideflifestyle1','hideflifestyle1'),('Hisense USA Corporation','Hisense USA Corporation'),('HookedOnTronics','HookedOnTronics'),('Hot Deals 4 Less?','Hot Deals 4 Less?'),('Hyper Microsystems, Inc.','Hyper Microsystems, Inc.'),('hypermicrosystems','hypermicrosystems'),('iban_tech-8','iban_tech-8'),('isellstuff86','isellstuff86'),('jbtoolsales02','jbtoolsales02'),('K&M','K&M'),('kays_place_too','kays_place_too'),('legendmicro-wholesale','legendmicro-wholesale'),('listenup','listenup'),('lucky-31067','lucky-31067'),('Made Technology','Made Technology'),('Malelo and Company','Malelo and Company'),('mamastore_co','mamastore_co'),('Marine Discount Center, LLC','Marine Discount Center, LLC'),('mike_gamesnmore','mike_gamesnmore'),('mnmdiscount1','mnmdiscount1'),('mpe007','mpe007'),('multitechinc','multitechinc'),('Music123 - Walmart.com','Music123 - Walmart.com'),('musicalsupplydirect','musicalsupplydirect'),('My Goods','My Goods'),('newopenbox','newopenbox'),('nps','nps'),('OJCommerce','OJCommerce'),('OneCall','OneCall'),('OneStopShop','OneStopShop'),('onlycellphone','onlycellphone'),('outletpc','outletpc'),('PhotoSavings','PhotoSavings'),('proaudio654','proaudio654'),('race_choice','race_choice'),('RackGo','RackGo'),('Real Basics','Real Basics'),('Rocky Mountain Textbooks','Rocky Mountain Textbooks'),('Samy\'s Camera','Samy\'s Camera'),('SaveCentral, LLC','SaveCentral, LLC'),('SharpPrices','SharpPrices'),('Soltech US Corp','Soltech US Corp'),('Sound of Tri-State','Sound of Tri-State'),('tbdeals','tbdeals'),('teampsales','teampsales'),('Tech2Date','Tech2Date'),('techhouse520','techhouse520'),('Technology Galaxy','Technology Galaxy'),('TEKENVY - Walmart.com','TEKENVY - Walmart.com'),('TEKONLINE','TEKONLINE'),('TELeasy','TELeasy'),('tfldealz','tfldealz'),('Top Deals','Top Deals'),('Tri State Camera','Tri State Camera'),('tri-state-camera','tri-state-camera'),('umpquablue','umpquablue'),('UnbeatableSale','UnbeatableSale'),('Video & Audio Center','Video & Audio Center'),('videoandaudiocenter','videoandaudiocenter'),('vipoutlet','vipoutlet'),('Walmart.com','Walmart.com'),('Walts TV','Walts TV'),('Wayfair - Walmart.com','Wayfair - Walmart.com'),('West Coast Limited','West Coast Limited'),('Wholesale Connection','Wholesale Connection'),('World Wide Stereo','World Wide Stereo'),('wwstereo','wwstereo'),('Xcess Limited','Xcess Limited'),('zoneusa','zoneusa');
/*!40000 ALTER TABLE `provider` ENABLE KEYS */;
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
