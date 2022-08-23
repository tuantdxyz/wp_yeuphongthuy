<?php

?><?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */

define('WP_HOME','http://yeuphongthuy.vn');
define('WP_SITEURL','http://yeuphongthuy.vn');
define('DB_NAME', 'ypt');

/** MySQL database username */
define('DB_USER', 'root');

/** MySQL database password */
define('DB_PASSWORD', 'krGq#2-ubjR!2e@dtBQEbfrs');

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8mb4');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         ':Gwp_:_((c~R}u)/f*%;C%@@q{nZC~iXWEm_@4vtnck518f&,s{<*EZ `Y| 7#k9');
define('SECURE_AUTH_KEY',  '2PQY;p](O6ev;<[&T:Nm=}He02Qwb~f+Ye_[Dr0.d9#vAEmf|?oj:g;dY%.y45n]');
define('LOGGED_IN_KEY',    '{g&;9c>MqeF`;0>J$V^%Ix+yl@xYai*F3LY<f1N}3$@]Iu7s653B.!@GRbK7}8;Z');
define('NONCE_KEY',        'q*-v*2uxJRjT4-;GjgsLW{i~hY%qJ@qu&Qx^xKoUhQ]j=$E)[Rm@b3kE1N66&{Fw');
define('AUTH_SALT',        '-NA+m/!=-s&iAKc~zCE  5#a{@ r:yvyBLHpAtMOcV+O8fU)Vo?dsF`5Xd72)jip');
define('SECURE_AUTH_SALT', ' 9I0(?zewH7E1<-)9_6[m/;P:WFGXYUGvhSkOGCk0CHHt|y[)P5pvnjN>:N?BD/6');
define('LOGGED_IN_SALT',   'e:=a85!0^Y7}jkV+lYhK:I9`=X !%OD D9]X<nRm_}Kkc5>;EtFH7X1yu%.7o8 I');
define('NONCE_SALT',       'FU&5dT6kdoQY67F16v_rWQVBu7$r>#??~__3|Jr.,AKicC;35GQmGS#/,{_6PFfX');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the Codex.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define('WP_DEBUG', false);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
