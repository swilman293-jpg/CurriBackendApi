-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3307
-- Tiempo de generación: 23-07-2026 a las 21:30:19
-- Versión del servidor: 11.4.9-MariaDB
-- Versión de PHP: 8.3.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `curriculum_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `educación`
--

DROP TABLE IF EXISTS `educación`;
CREATE TABLE IF NOT EXISTS `educación` (
  `Id_Edu` int(11) NOT NULL AUTO_INCREMENT,
  `ID_Usuario` int(11) NOT NULL,
  `Institución` varchar(200) NOT NULL,
  `Titulo_Obtenido` varchar(200) NOT NULL,
  `Fecha_Inicio` date NOT NULL,
  `Fecha_Fin` date NOT NULL,
  PRIMARY KEY (`Id_Edu`),
  KEY `FK_Educacion_Usuario` (`ID_Usuario`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `experiencia_laboral`
--

DROP TABLE IF EXISTS `experiencia_laboral`;
CREATE TABLE IF NOT EXISTS `experiencia_laboral` (
  `Id_Expe` int(11) NOT NULL AUTO_INCREMENT,
  `ID_Usuario` int(11) NOT NULL,
  `Experiencia` varchar(200) NOT NULL,
  `Cargo` varchar(200) NOT NULL,
  `FechaIni` date NOT NULL,
  `FechaFin` date NOT NULL,
  PRIMARY KEY (`Id_Expe`),
  KEY `FK_Experiencia_Usuario` (`ID_Usuario`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tecnologias`
--

DROP TABLE IF EXISTS `tecnologias`;
CREATE TABLE IF NOT EXISTS `tecnologias` (
  `Id_tecnologia` int(11) NOT NULL AUTO_INCREMENT,
  `ID_Usuario` int(11) NOT NULL,
  `Nombre` varchar(100) NOT NULL,
  `Nivel` varchar(50) NOT NULL,
  PRIMARY KEY (`Id_tecnologia`),
  KEY `FK_Tecnologias_Usuario` (`ID_Usuario`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

DROP TABLE IF EXISTS `usuario`;
CREATE TABLE IF NOT EXISTS `usuario` (
  `ID_Usuario` int(11) NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(100) NOT NULL,
  `Apellido` varchar(100) NOT NULL,
  `TituloProfesional` varchar(200) NOT NULL,
  `AcercaDe` text DEFAULT NULL,
  `Email` varchar(150) DEFAULT NULL,
  `Telefono` varchar(50) DEFAULT NULL,
  `LinkedinUrl` varchar(255) DEFAULT NULL,
  `GithubUrl` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID_Usuario`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
