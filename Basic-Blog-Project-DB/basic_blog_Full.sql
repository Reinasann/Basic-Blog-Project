-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 16, 2025 at 06:23 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `basic_blog`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `slug`) VALUES
(1, 'Technology', 'technology'),
(2, 'Travel', 'travel'),
(3, 'Food', 'food'),
(4, 'Lifestyle', 'lifestyle'),
(5, 'Education', 'education');

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`id`, `post_id`, `user_id`, `content`, `created_at`, `updated_at`) VALUES
(4, 4, 1, 'test', '2025-09-06 05:25:23', NULL),
(5, 29, 1, 'test', '2025-09-06 05:40:24', NULL),
(6, 29, 10, 'test', '2025-09-06 05:41:36', NULL),
(7, 30, 10, 'test', '2025-09-06 05:55:11', NULL),
(8, 30, 8, 'test', '2025-09-06 05:55:26', NULL),
(10, 31, 8, 'test', '2025-09-06 05:56:25', NULL),
(15, 40, 8, 'tttttttttt', '2025-09-09 04:30:54', NULL),
(19, 40, 1, 'ttttttttttt', '2025-09-09 07:50:26', NULL),
(22, 53, 1, 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti nostrum labore facilis, eum optio odit dolor consectetur, totam aut iusto consequatur a enim iure ipsum placeat sapiente at pariatur nemo! Tempore quibusdam ad doloremque vitae aspernatur explicabo recusandae, sunt magni tempora voluptate esse deleniti. Quos, repellendus iste rerum deleniti voluptatibus totam soluta optio praesentium, earum perferendis, commodi illo deserunt numquam? Odio harum vero suscipit fugit quo numquam eveniet cupiditate consectetur. Aut, qui illum dolore totam quasi est sequi unde atque. Quos, sapiente atque ducimus suscipit perspiciatis modi! Incidunt, suscipit veniam? Quia dolorem velit dicta exercitationem nesciunt sapiente repudiandae facilis cupiditate, veritatis atque recusandae rerum? Ad earum fugit nemo? Quasi dolorem error minima labore numquam laboriosam laborum rem omnis sapiente illum! Animi officia magnam corporis quis ducimus ipsam placeat necessitatibus? Perspiciatis eum nam, porro doloribus harum consequuntur dolor accusantium sed sapiente aliquam consequatur quae! Ut rerum veniam iste obcaecati sunt quo? Amet et recusandae sequi, numquam minima dolorem repellendus. Modi assumenda magnam officiis illo cupiditate id quae obcaecati dolores? Nam recusandae assumenda voluptate non ab dolores? Unde error reiciendis blanditiis distinctio. Cumque explicabo aspernatur nisi quod iure expedita magnam et quisquam optio mollitia est totam neque, fugiat sed, qui placeat nulla exercitationem ipsa perferendis laboriosam, facere harum reprehenderit dolores? Consequatur, quidem! Voluptate impedit, dolorum hic aperiam nihil pariatur ab consequuntur exercitationem quo numquam quibusdam veritatis perspiciatis beatae consectetur rem quaerat recusandae! Laborum velit totam sed unde laudantium voluptate ipsum, iusto optio. Illum esse a error cupiditate nam nemo alias omnis deleniti? Sit quod dolor ea aliquam adipisci, officiis error magnam voluptas hic, atque tenetur harum odio ad deserunt voluptatibus vel porro. Eaque culpa aliquid numquam veritatis dicta quae aliquam similique. Ullam nesciunt, maiores facilis asperiores quos inventore ipsa voluptas libero quibusdam accusamus eveniet dolorum perspiciatis minima vitae quas. Laboriosam, corrupti. Odio. Quas similique voluptas sequi, quidem expedita repellendus ad veritatis magnam, eligendi maxime ut, quia sapiente corporis vitae laboriosam illum inventore nam! Quidem labore illum placeat voluptatibus cupiditate. Magni, aliquid rerum. Ipsa, quibusdam minima itaque explicabo labore cum veniam maiores aliquam nemo possimus mollitia perferendis consectetur dolorum id quod quasi sit nobis asperiores impedit ipsam est suscipit blanditiis. Et, odit exercitationem! Nostrum repudiandae, eius consectetur quos ipsam odit dolorum rem qui porro doloribus. Odio exercitationem illum quasi officia aperiam iste error sed molestias veniam, sunt beatae architecto, ut autem fuga impedit. Fugiat iusto est porro, rem ratione voluptates culpa. Eligendi maiores dolores explicabo esse mollitia, accusantium, reiciendis rerum id delectus quos quasi consequuntur deleniti distinctio. Dolore commodi tempore quod dicta deleniti. Magnam itaque voluptate dignissimos officiis! Id dolorum quo eligendi harum numquam cum soluta nisi ex. Recusandae nobis numquam vitae corrupti et necessitatibus rerum est ad dignissimos, nam veniam ipsa delectus. Voluptates praesentium ullam ducimus eius alias modi nam commodi itaque sint velit molestiae necessitatibus adipisci iste fuga officiis mollitia atque quisquam suscipit animi, cupiditate a voluptatibus! Incidunt ullam veniam cum! Reiciendis voluptate quibusdam facilis assumenda quo sit beatae earum fugiat, dolor nulla obcaecati ut aut cupiditate perspiciatis aliquid voluptatum qui. Laboriosam, beatae! Accusantium nemo maxime unde eaque explicabo aut officia? Atque voluptate facilis nobis provident, optio officiis consequatur ad iure suscipit officia unde, perspiciatis numquam eligendi velit ipsum earum quasi perferendis. Velit commodi atque sunt, vel laborum maiores ducimus quam! Asperiores deserunt est consequatur natus dignissimos maiores quae dolore neque fugiat repellendus id doloribus, consectetur dicta sequi nisi sed suscipit repellat facere beatae, aliquid, optio iure non adipisci earum! Ab? Culpa blanditiis dignissimos, saepe quidem magnam nemo velit incidunt quam. Commodi provident quos nihil voluptatem? Magni, mollitia! Incidunt aperiam eius officiis commodi nemo, quos ex voluptatem consequuntur non amet voluptates. Repellat nisi accusantium, porro expedita accusamus doloremque praesentium inventore culpa debitis natus sed cupiditate, quos saepe sunt adipisci repellendus? Non ipsum suscipit tempore hic ut illo quia et enim rem? Fuga placeat quidem porro quasi, eos animi pariatur quae voluptate quia laudantium in molestiae aliquid quas hic, aspernatur corporis repellat saepe. Explicabo facere dolorem iste earum dolor velit vel magni. Nihil voluptates, necessitatibus sit assumenda iure explicabo fugiat asperiores recusandae atque! Debitis adipisci error sint velit voluptas mollitia, ipsum quis itaque nam quae delectus molestiae aperiam labore, nisi natus saepe. Voluptatibus corporis dolorem repellendus nobis eius. Beatae debitis ullam culpa vero provident facilis eius excepturi optio delectus, iure impedit odit animi quod, doloribus architecto laborum? In illum possimus nihil porro. Dolorum, aliquid aperiam totam quam accusamus quasi autem excepturi tempore quo, dicta natus. Molestiae beatae quibusdam delectus magni cumque sit accusantium veniam asperiores, nam accusamus, voluptas facere tenetur repellendus maiores? Quaerat repudiandae itaque voluptas, veniam eos, eum consequatur officia odio maxime porro laudantium iusto quae! Veritatis eligendi laudantium distinctio maxime nisi molestias iste atque aliquam ab in aut, modi vitae? Rerum beatae dolore alias, libero, quod architecto maxime hic dolorum repudiandae saepe quaerat? Ratione sed omnis, eaque recusandae nesciunt quibusdam eos! Aliquam vero eligendi minima omnis architecto culpa doloribus! Ut? Minima culpa velit harum architecto eaque ad ducimus asperiores perferendis, nulla corporis iste aspernatur pariatur enim sunt doloremque quod, voluptate accusantium temporibus optio quasi aliquid, natus voluptas exercitationem. Tempore, repellat. Repellat sit, mollitia voluptatum quaerat ducimus rerum temporibus eos eaque maiores obcaecati nemo maxime vero blanditiis aspernatur sunt eveniet harum soluta hic reprehenderit cumque porro tempore labore! Placeat, minus sequi. Possimus provident necessitatibus maiores dolor natus suscipit ad eos error voluptas esse doloribus, inventore consectetur accusamus saepe laudantium voluptates quos asperiores odio minima impedit repudiandae. Corrupti voluptas laborum aspernatur incidunt! Libero laborum quam obcaecati id veritatis repellat aspernatur tempora? Molestiae vero similique repellendus temporibus ipsam quae odio, maiores earum eius, ipsum vitae totam. Nemo laudantium illo eaque dicta iusto amet. Ratione, animi aspernatur inventore omnis sint eligendi dolorem natus laboriosam. Sapiente voluptas debitis, nemo obcaecati ad possimus explicabo. Suscipit veniam officiis recusandae ratione inventore possimus quisquam aut corrupti dolores tempora! Sapiente quisquam vitae reiciendis cumque adipisci magnam voluptatum quas eos. Officia perferendis error culpa adipisci recusandae saepe. Perferendis omnis, commodi similique, eos odio excepturi voluptatibus, debitis molestias corporis numquam quia! Illum, fuga quam eum fugit beatae rerum culpa provident, maxime, inventore omnis quod reprehenderit impedit pariatur. Aliquid recusandae, autem, amet illum enim harum iste sed saepe dolorum tenetur, voluptates laudantium. Assumenda voluptatum sed excepturi, repudiandae quo necessitatibus non sit eveniet veritatis sunt nihil. Dolorem tempore magnam atque quia rem aliquid ipsam ea exercitationem quam amet alias nihil, sunt corporis iusto! Tenetur hic quasi aliquid, dicta sint autem harum dolor ducimus veniam distinctio quod labore reiciendis cumque alias odit culpa id a eligendi deleniti porro mollitia dolore inventore, iste accusamus. Quis! Cum, consequuntur tempora reprehenderit, error corporis suscipit placeat commodi quo, earum rem saepe officia magni! Magnam doloremque omnis illo deserunt sed perspiciatis aspernatur alias, tempora, cupiditate repellendus, id nihil aliquam! Quibusdam consequatur quae excepturi, vero corrupti maxime dolorum eveniet obcaecati optio corporis mollitia ea quos ratione fugiat itaque incidunt facere veritatis? Distinctio cumque itaque autem illum quod. Exercitationem, corporis facere. Labore voluptatibus voluptates sequi autem culpa vero qui, cumque eius aspernatur blanditiis quis et magni! Voluptates cumque eius voluptas omnis doloremque explicabo, dolor obcaecati nisi perferendis delectus culpa sapiente esse! Tempora quaerat ducimus dolores quos id, veritatis voluptatem iure voluptatibus sunt quia eos neque ea et harum facere, culpa illum modi repellat, odio ipsa. Neque iste reprehenderit in necessitatibus alias. Expedita magni soluta quia assumenda nulla cupiditate! Magnam, rem saepe quibusdam minus beatae ab reprehenderit eius eaque deleniti libero ex. Saepe ut eveniet facilis, aut officiis aliquid asperiores omnis repudiandae! Eum incidunt aliquam harum perferendis iste tempora nostrum, temporibus, assumenda porro dolor velit ea. Dolor provident tempora corporis non vero accusamus libero error incidunt sunt placeat, delectus qui quasi quibusdam! Error praesentium, repudiandae maxime, molestiae ducimus in aperiam quos tempora ipsum minima nam dicta labore ratione doloremque ipsam ullam officiis vero eos! Beatae ex provident alias voluptate dolor, sint id? Cum deserunt quis ad! Aperiam vel eligendi debitis ut beatae quas, quaerat expedita inventore neque officiis delectus unde sequi! Dolorem voluptatum debitis eligendi sequi amet, eos voluptatibus omnis soluta beatae. Impedit sunt ducimus odio eveniet vitae repudiandae ad natus ipsum sequi pariatur cumque quibusdam molestiae excepturi deleniti, repellat, aspernatur nisi sint velit voluptas quod est, voluptates consequatur accusantium et! Veritatis? Necessitatibus suscipit earum similique architecto fuga et eaque quisquam doloribus modi! Repellat sed impedit pariatur aliquam doloremque minima totam omnis reprehenderit molestias, ullam facere, laborum, doloribus temporibus veritatis culpa consequuntur. Sit ad reprehenderit praesentium mollitia iure omnis aliquam aperiam, sunt impedit, porro nisi dolorem saepe quaerat ea? Porro praesentium accusantium dolorum enim eius veniam doloremque est ab? Rem, mollitia ipsam! Exercitationem expedita, dignissimos eveniet impedit, nemo unde molestiae eos itaque consequuntur debitis voluptatum velit, magni quaerat reprehenderit omnis magnam ut sit quos ratione sequi? Error perspiciatis nostrum magni eum non! Aliquam sapiente velit reprehenderit ipsum tempore fuga deserunt, corrupti a ullam voluptate odit repellat nobis ad iure doloribus, eum hic quod nemo. Blanditiis ad odio culpa? Quam cum iste laudantium. Inventore molestiae repellendus et, harum blanditiis excepturi, quibusdam quod, vero architecto dignissimos aspernatur! Culpa possimus cumque totam soluta quam quisquam officia vero explicabo facilis ipsum eos dolor, quia voluptas dolores?', '2025-09-14 16:29:44', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `image_urls` text DEFAULT NULL,
  `status` enum('published','draft') DEFAULT 'draft',
  `view_count` int(11) DEFAULT 0,
  `like_count` int(11) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`id`, `user_id`, `category_id`, `title`, `slug`, `content`, `image_urls`, `status`, `view_count`, `like_count`, `created_at`, `updated_at`) VALUES
(1, 2, 3, 'The Future of AI', '-he-uture-of-', 'Content about AI...', 'ai.jpg', 'published', 6, 1, '2025-08-27 17:59:04', '2025-09-14 15:21:13'),
(2, 2, 4, 'Top 10 Travel Destinations test', '-op-10-ravel-estinations-test', 'Travel guide...test', 'travel.jpg', 'published', 5, 1, '2025-08-27 17:59:04', '2025-09-14 14:53:24'),
(3, 3, 3, 'Best Street Foods', '-est-treet-oods', 'Food content...', 'food.jpg', 'published', 1, 0, '2025-08-27 17:59:04', '2025-09-14 23:27:01'),
(4, 3, 3, 'Minimalist Lifestyle Tips test', 'minimalist-lifestyle-tips-test', 'Lifestyle article...test', 'lifestyle.jpg', 'published', 9, 2, '2025-08-27 17:59:04', '2025-09-06 13:14:44'),
(5, 2, 5, 'Online Learning Trends', 'online-learning-trends', 'Education content...', 'education.jpg', 'published', 2, 1, '2025-08-27 17:59:04', '2025-09-06 12:40:17'),
(27, 1, 5, 'test', 'test-1', 'test', NULL, 'published', 5, 1, '2025-09-06 12:38:52', '2025-09-14 23:27:58'),
(29, 1, 1, 'test-100', 'test-100', 'testtesttest', NULL, 'published', 17, 2, '2025-09-06 12:39:45', '2025-09-14 22:14:36'),
(30, 8, 2, 'google-test', 'google-test', 'test', NULL, 'published', 9, 2, '2025-09-06 12:54:27', '2025-09-14 23:24:54'),
(31, 8, 1, 'google-test2', 'google-test2', 'test', NULL, 'published', 10, 1, '2025-09-06 12:56:02', '2025-09-14 23:16:32'),
(32, 8, 4, 'google-test3', 'google-test3', 'test', NULL, 'published', 17, 2, '2025-09-06 12:56:39', '2025-09-14 16:06:58'),
(40, 8, 2, 'testttttttttttttt', 'testttttttttttttt', 'ttttttttttttttt', NULL, 'published', 31, 2, '2025-09-09 11:30:43', '2025-09-14 23:24:47'),
(46, 1, 1, 'imgtest', 'imgtest', 'imgtest', '', 'published', 15, 0, '2025-09-14 22:24:14', '2025-09-14 23:28:10'),
(53, 1, 1, 'IMGtest', 'imgtest-1', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti nostrum labore facilis, eum optio odit dolor consectetur, totam aut iusto consequatur a enim iure ipsum placeat sapiente at pariatur nemo!\nTempore quibusdam ad doloremque vitae aspernatur explicabo recusandae, sunt magni tempora voluptate esse deleniti. Quos, repellendus iste rerum deleniti voluptatibus totam soluta optio praesentium, earum perferendis, commodi illo deserunt numquam?\nOdio harum vero suscipit fugit quo numquam eveniet cupiditate consectetur. Aut, qui illum dolore totam quasi est sequi unde atque. Quos, sapiente atque ducimus suscipit perspiciatis modi! Incidunt, suscipit veniam?\nQuia dolorem velit dicta exercitationem nesciunt sapiente repudiandae facilis cupiditate, veritatis atque recusandae rerum? Ad earum fugit nemo? Quasi dolorem error minima labore numquam laboriosam laborum rem omnis sapiente illum!\nAnimi officia magnam corporis quis ducimus ipsam placeat necessitatibus? Perspiciatis eum nam, porro doloribus harum consequuntur dolor accusantium sed sapiente aliquam consequatur quae! Ut rerum veniam iste obcaecati sunt quo?\nAmet et recusandae sequi, numquam minima dolorem repellendus. Modi assumenda magnam officiis illo cupiditate id quae obcaecati dolores? Nam recusandae assumenda voluptate non ab dolores? Unde error reiciendis blanditiis distinctio.\nCumque explicabo aspernatur nisi quod iure expedita magnam et quisquam optio mollitia est totam neque, fugiat sed, qui placeat nulla exercitationem ipsa perferendis laboriosam, facere harum reprehenderit dolores? Consequatur, quidem!\nVoluptate impedit, dolorum hic aperiam nihil pariatur ab consequuntur exercitationem quo numquam quibusdam veritatis perspiciatis beatae consectetur rem quaerat recusandae! Laborum velit totam sed unde laudantium voluptate ipsum, iusto optio.\nIllum esse a error cupiditate nam nemo alias omnis deleniti? Sit quod dolor ea aliquam adipisci, officiis error magnam voluptas hic, atque tenetur harum odio ad deserunt voluptatibus vel porro.\nEaque culpa aliquid numquam veritatis dicta quae aliquam similique. Ullam nesciunt, maiores facilis asperiores quos inventore ipsa voluptas libero quibusdam accusamus eveniet dolorum perspiciatis minima vitae quas. Laboriosam, corrupti. Odio.\nQuas similique voluptas sequi, quidem expedita repellendus ad veritatis magnam, eligendi maxime ut, quia sapiente corporis vitae laboriosam illum inventore nam! Quidem labore illum placeat voluptatibus cupiditate. Magni, aliquid rerum.\nIpsa, quibusdam minima itaque explicabo labore cum veniam maiores aliquam nemo possimus mollitia perferendis consectetur dolorum id quod quasi sit nobis asperiores impedit ipsam est suscipit blanditiis. Et, odit exercitationem!\nNostrum repudiandae, eius consectetur quos ipsam odit dolorum rem qui porro doloribus. Odio exercitationem illum quasi officia aperiam iste error sed molestias veniam, sunt beatae architecto, ut autem fuga impedit.\nFugiat iusto est porro, rem ratione voluptates culpa. Eligendi maiores dolores explicabo esse mollitia, accusantium, reiciendis rerum id delectus quos quasi consequuntur deleniti distinctio. Dolore commodi tempore quod dicta deleniti.\nMagnam itaque voluptate dignissimos officiis! Id dolorum quo eligendi harum numquam cum soluta nisi ex. Recusandae nobis numquam vitae corrupti et necessitatibus rerum est ad dignissimos, nam veniam ipsa delectus.\nVoluptates praesentium ullam ducimus eius alias modi nam commodi itaque sint velit molestiae necessitatibus adipisci iste fuga officiis mollitia atque quisquam suscipit animi, cupiditate a voluptatibus! Incidunt ullam veniam cum!\nReiciendis voluptate quibusdam facilis assumenda quo sit beatae earum fugiat, dolor nulla obcaecati ut aut cupiditate perspiciatis aliquid voluptatum qui. Laboriosam, beatae! Accusantium nemo maxime unde eaque explicabo aut officia?\nAtque voluptate facilis nobis provident, optio officiis consequatur ad iure suscipit officia unde, perspiciatis numquam eligendi velit ipsum earum quasi perferendis. Velit commodi atque sunt, vel laborum maiores ducimus quam!\nAsperiores deserunt est consequatur natus dignissimos maiores quae dolore neque fugiat repellendus id doloribus, consectetur dicta sequi nisi sed suscipit repellat facere beatae, aliquid, optio iure non adipisci earum! Ab?\nCulpa blanditiis dignissimos, saepe quidem magnam nemo velit incidunt quam. Commodi provident quos nihil voluptatem? Magni, mollitia! Incidunt aperiam eius officiis commodi nemo, quos ex voluptatem consequuntur non amet voluptates.\nRepellat nisi accusantium, porro expedita accusamus doloremque praesentium inventore culpa debitis natus sed cupiditate, quos saepe sunt adipisci repellendus? Non ipsum suscipit tempore hic ut illo quia et enim rem?\nFuga placeat quidem porro quasi, eos animi pariatur quae voluptate quia laudantium in molestiae aliquid quas hic, aspernatur corporis repellat saepe. Explicabo facere dolorem iste earum dolor velit vel magni.\nNihil voluptates, necessitatibus sit assumenda iure explicabo fugiat asperiores recusandae atque! Debitis adipisci error sint velit voluptas mollitia, ipsum quis itaque nam quae delectus molestiae aperiam labore, nisi natus saepe.\nVoluptatibus corporis dolorem repellendus nobis eius. Beatae debitis ullam culpa vero provident facilis eius excepturi optio delectus, iure impedit odit animi quod, doloribus architecto laborum? In illum possimus nihil porro.\nDolorum, aliquid aperiam totam quam accusamus quasi autem excepturi tempore quo, dicta natus. Molestiae beatae quibusdam delectus magni cumque sit accusantium veniam asperiores, nam accusamus, voluptas facere tenetur repellendus maiores?\nQuaerat repudiandae itaque voluptas, veniam eos, eum consequatur officia odio maxime porro laudantium iusto quae! Veritatis eligendi laudantium distinctio maxime nisi molestias iste atque aliquam ab in aut, modi vitae?\nRerum beatae dolore alias, libero, quod architecto maxime hic dolorum repudiandae saepe quaerat? Ratione sed omnis, eaque recusandae nesciunt quibusdam eos! Aliquam vero eligendi minima omnis architecto culpa doloribus! Ut?\nMinima culpa velit harum architecto eaque ad ducimus asperiores perferendis, nulla corporis iste aspernatur pariatur enim sunt doloremque quod, voluptate accusantium temporibus optio quasi aliquid, natus voluptas exercitationem. Tempore, repellat.\nRepellat sit, mollitia voluptatum quaerat ducimus rerum temporibus eos eaque maiores obcaecati nemo maxime vero blanditiis aspernatur sunt eveniet harum soluta hic reprehenderit cumque porro tempore labore! Placeat, minus sequi.\nPossimus provident necessitatibus maiores dolor natus suscipit ad eos error voluptas esse doloribus, inventore consectetur accusamus saepe laudantium voluptates quos asperiores odio minima impedit repudiandae. Corrupti voluptas laborum aspernatur incidunt!\nLibero laborum quam obcaecati id veritatis repellat aspernatur tempora? Molestiae vero similique repellendus temporibus ipsam quae odio, maiores earum eius, ipsum vitae totam. Nemo laudantium illo eaque dicta iusto amet.\nRatione, animi aspernatur inventore omnis sint eligendi dolorem natus laboriosam. Sapiente voluptas debitis, nemo obcaecati ad possimus explicabo. Suscipit veniam officiis recusandae ratione inventore possimus quisquam aut corrupti dolores tempora!\nSapiente quisquam vitae reiciendis cumque adipisci magnam voluptatum quas eos. Officia perferendis error culpa adipisci recusandae saepe. Perferendis omnis, commodi similique, eos odio excepturi voluptatibus, debitis molestias corporis numquam quia!\nIllum, fuga quam eum fugit beatae rerum culpa provident, maxime, inventore omnis quod reprehenderit impedit pariatur. Aliquid recusandae, autem, amet illum enim harum iste sed saepe dolorum tenetur, voluptates laudantium.\nAssumenda voluptatum sed excepturi, repudiandae quo necessitatibus non sit eveniet veritatis sunt nihil. Dolorem tempore magnam atque quia rem aliquid ipsam ea exercitationem quam amet alias nihil, sunt corporis iusto!\nTenetur hic quasi aliquid, dicta sint autem harum dolor ducimus veniam distinctio quod labore reiciendis cumque alias odit culpa id a eligendi deleniti porro mollitia dolore inventore, iste accusamus. Quis!\nCum, consequuntur tempora reprehenderit, error corporis suscipit placeat commodi quo, earum rem saepe officia magni! Magnam doloremque omnis illo deserunt sed perspiciatis aspernatur alias, tempora, cupiditate repellendus, id nihil aliquam!\nQuibusdam consequatur quae excepturi, vero corrupti maxime dolorum eveniet obcaecati optio corporis mollitia ea quos ratione fugiat itaque incidunt facere veritatis? Distinctio cumque itaque autem illum quod. Exercitationem, corporis facere.\nLabore voluptatibus voluptates sequi autem culpa vero qui, cumque eius aspernatur blanditiis quis et magni! Voluptates cumque eius voluptas omnis doloremque explicabo, dolor obcaecati nisi perferendis delectus culpa sapiente esse!\nTempora quaerat ducimus dolores quos id, veritatis voluptatem iure voluptatibus sunt quia eos neque ea et harum facere, culpa illum modi repellat, odio ipsa. Neque iste reprehenderit in necessitatibus alias.\nExpedita magni soluta quia assumenda nulla cupiditate! Magnam, rem saepe quibusdam minus beatae ab reprehenderit eius eaque deleniti libero ex. Saepe ut eveniet facilis, aut officiis aliquid asperiores omnis repudiandae!\nEum incidunt aliquam harum perferendis iste tempora nostrum, temporibus, assumenda porro dolor velit ea. Dolor provident tempora corporis non vero accusamus libero error incidunt sunt placeat, delectus qui quasi quibusdam!\nError praesentium, repudiandae maxime, molestiae ducimus in aperiam quos tempora ipsum minima nam dicta labore ratione doloremque ipsam ullam officiis vero eos! Beatae ex provident alias voluptate dolor, sint id?\nCum deserunt quis ad! Aperiam vel eligendi debitis ut beatae quas, quaerat expedita inventore neque officiis delectus unde sequi! Dolorem voluptatum debitis eligendi sequi amet, eos voluptatibus omnis soluta beatae.\nImpedit sunt ducimus odio eveniet vitae repudiandae ad natus ipsum sequi pariatur cumque quibusdam molestiae excepturi deleniti, repellat, aspernatur nisi sint velit voluptas quod est, voluptates consequatur accusantium et! Veritatis?\nNecessitatibus suscipit earum similique architecto fuga et eaque quisquam doloribus modi! Repellat sed impedit pariatur aliquam doloremque minima totam omnis reprehenderit molestias, ullam facere, laborum, doloribus temporibus veritatis culpa consequuntur.\nSit ad reprehenderit praesentium mollitia iure omnis aliquam aperiam, sunt impedit, porro nisi dolorem saepe quaerat ea? Porro praesentium accusantium dolorum enim eius veniam doloremque est ab? Rem, mollitia ipsam!\nExercitationem expedita, dignissimos eveniet impedit, nemo unde molestiae eos itaque consequuntur debitis voluptatum velit, magni quaerat reprehenderit omnis magnam ut sit quos ratione sequi? Error perspiciatis nostrum magni eum non!\nAliquam sapiente velit reprehenderit ipsum tempore fuga deserunt, corrupti a ullam voluptate odit repellat nobis ad iure doloribus, eum hic quod nemo. Blanditiis ad odio culpa? Quam cum iste laudantium.\nInventore molestiae repellendus et, harum blanditiis excepturi, quibusdam quod, vero architecto dignissimos aspernatur! Culpa possimus cumque totam soluta quam quisquam officia vero explicabo facilis ipsum eos dolor, quia voluptas dolores?', 'post_68c6e5fc916a10.27760760.jpg,post_68c6e5fc9179d7.21095718.png,post_68c6e5fc9189d6.93865985.jpg', 'published', 27, 1, '2025-09-14 22:57:48', '2025-09-15 21:55:01');

-- --------------------------------------------------------

--
-- Table structure for table `post_likes`
--

CREATE TABLE `post_likes` (
  `id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `post_likes`
--

INSERT INTO `post_likes` (`id`, `post_id`, `user_id`, `created_at`) VALUES
(55, 1, 1, '2025-09-04 03:35:16'),
(56, 4, 1, '2025-09-06 05:25:19'),
(57, 29, 1, '2025-09-06 05:40:07'),
(58, 5, 1, '2025-09-06 05:40:17'),
(59, 29, 10, '2025-09-06 05:41:32'),
(61, 30, 10, '2025-09-06 05:55:08'),
(62, 30, 8, '2025-09-06 05:55:28'),
(66, 31, 8, '2025-09-06 05:56:22'),
(88, 32, 8, '2025-09-09 04:30:03'),
(89, 40, 8, '2025-09-09 04:30:50'),
(95, 27, 13, '2025-09-09 06:00:00'),
(96, 40, 13, '2025-09-09 06:00:06'),
(111, 2, 1, '2025-09-14 07:53:24'),
(112, 32, 1, '2025-09-14 07:54:19'),
(167, 40, 1, '2025-09-14 08:59:00'),
(170, 53, 1, '2025-09-14 16:18:50');

-- --------------------------------------------------------

--
-- Table structure for table `tags`
--

CREATE TABLE `tags` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tags`
--

INSERT INTO `tags` (`id`, `name`) VALUES
(1, 'AI'),
(5, 'Education'),
(3, 'Food'),
(4, 'Health'),
(2, 'Travel');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `google_id` varchar(255) NOT NULL,
  `role` enum('admin','author','reader') DEFAULT 'reader',
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `google_id`, `role`, `created_at`) VALUES
(1, 'Admin User', 'admin@example.com', '$2y$10$I7eTX2rEn0pxTRbXNe.xt.DUpLtSUyuHkMGy09E0eODbWoHP0w4S2', '', 'admin', '2025-08-27 17:59:04'),
(2, 'Alice Author', 'alice@example.com', 'hashed_password_2', '', 'author', '2025-08-27 17:59:04'),
(3, 'Bob Author', 'bob@example.com', 'hashed_password_3', '', 'author', '2025-08-27 17:59:04'),
(4, 'Charlie Reader', 'charlie@example.com', '$2y$10$I7eTX2rEn0pxTRbXNe.xt.DUpLtSUyuHkMGy09E0eODbWoHP0w4S2', '', 'reader', '2025-08-27 17:59:04'),
(5, 'Diana Reader', 'diana@example.com', 'hashed_password_5', '', 'reader', '2025-08-27 17:59:04'),
(7, 'Kik Gamer_TV', 'teerathep2000@gmail.com', '', '107582271510558134627', 'reader', '2025-09-02 14:58:46'),
(8, 'CS 66 26 ธีรเทพ เทพสุภา', '661463026@crru.ac.th', '', '113729344404667532669', 'reader', '2025-09-02 14:58:54'),
(10, 'test5', 'test5@test', '$2y$10$pLKYyBMp3zDSLDbmtLjcjuW1EL/hEkBbHZrwEdS8H7Jfk3gvVeTDC', '', 'reader', '2025-09-06 12:41:10'),
(11, 'test6', 'test6@test', '$2y$10$klW6ZxDeHwxvYS1nRv7Hluf2n6bdUqTBA2B5Sqt2tMBKlwEBCf4Sm', '', 'reader', '2025-09-07 14:39:14'),
(13, 'test7', 'test7@test', '$2y$10$OmmFisxqTM/w8qXafcw4MOOHXLWvhPrx946Ev7OodU2OHIwj1Ldyq', '', 'reader', '2025-09-07 14:40:39'),
(14, 'test8', 'test8@test', '$2y$10$sHKiRx7b1HBOP1Ln.DZqM.2mFwEh3yXvAdYZl0.v1q6OsQyc5p7um', '', 'reader', '2025-09-07 14:46:07'),
(16, 'test40', 'test40@test', '$2y$10$Iz8dJdkT2ScK0zGdusrAJ.sB9WMFtpfZRUl0FtOQL.9SiN4EMSFuK', '', '', '2025-09-11 14:21:34'),
(20, 'test50', 'test50@test', '$2y$10$nLnnrZh5mrpeub4ErD.92.6eCUX/W0iUjsta4435xa.rAlFinh0Lq', '', 'reader', '2025-09-11 14:40:14'),
(21, 'test51', 'test51@test', '$2y$10$qVQyz1nGcWVlkm0aXizQeO1Q.z9elhDNI02ZfsfJTJb4Rstu1kEjq', '', 'reader', '2025-09-11 14:42:37'),
(22, 'test56', 'test56@test', '$2y$10$GWOpZNC5AmNqn02zv0TLRO8B4RbTY9G3pHZt5SA1ZcQRwZKhb2Pi.', '', '', '2025-09-11 14:46:40'),
(23, 'test32', 'test32@test', '$2y$10$LS5q/JVtrqXzYOlvFzfGr.BTNl6QE/UaWyhRkkHXNYDQ1dA.3KZLi', '', '', '2025-09-11 15:01:46'),
(24, 'test39', 'test39@test', '$2y$10$l.HBOMtDVPLH86YdN8fqW.kIoEATbdTDorSLntqgM5xjKbG9n859K', '', '', '2025-09-11 15:02:25'),
(25, 'test41', 'test41@test', '$2y$10$gHkNxFrEdiF4I1M8RZfweuPRlahhVe5dZFlTg0XXrEmy8qc60.eBu', '', '', '2025-09-11 15:07:41'),
(26, 'test52', 'test52@test', '$2y$10$Ns.PaagQ0mVIM.ETM4rX5uc/fSKqPjQopFjxaipmQxrlP1Ozam156', '', '', '2025-09-11 15:08:10'),
(27, 'test29', 'test29@test', '$2y$10$nX87.u9BIjkSZV8zD.1EyeUJ2NX5A5md0O7CQ6UzT.Chz1.gpP0vG', '', 'reader', '2025-09-11 15:12:00');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_comment_post` (`post_id`),
  ADD KEY `fk_comment_user` (`user_id`);

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `post_likes`
--
ALTER TABLE `post_likes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_like` (`post_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT for table `post_likes`
--
ALTER TABLE `post_likes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=171;

--
-- AUTO_INCREMENT for table `tags`
--
ALTER TABLE `tags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `fk_comment_post` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_comment_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `posts_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `post_likes`
--
ALTER TABLE `post_likes`
  ADD CONSTRAINT `post_likes_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `post_likes_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
