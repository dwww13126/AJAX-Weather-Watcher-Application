-- phpMyAdmin SQL Dump
-- version 4.4.10
-- http://www.phpmyadmin.net
--
-- Host: localhost:8889
-- Generation Time: Mar 03, 2020 at 11:37 PM
-- Server version: 5.5.42
-- PHP Version: 5.6.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `dww6`
--

-- --------------------------------------------------------

--
-- Table structure for table `Weatherjoin`
--

CREATE TABLE `Weatherjoin` (
  `uid` int(11) NOT NULL,
  `town` varchar(50) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=ascii;

--
-- Indexes for table `Weatherjoin`
--

--
-- AUTO_INCREMENT for table `Users`
--
ALTER TABLE `Weatherjoin`
  ADD PRIMARY KEY (`uid`, `town`);
