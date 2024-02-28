<?php
/**
 * Plugin Name:       WP3D ModelImport
 * Description:       Example block scaffolded with Create Block tool.
 * Requires at least: 5.9
 * Requires PHP:      7.0
 * Version:           1.0.0
 * Author:            Nerds.farm srl
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       wp3d-blocks
 *
 * @package           wp3d
 */
/**
 * Copyright
 *
 * @copyright 2021-2024  Nerds farm srl. info@wp3d.com
 *
 *  Original development of this plugin was kindly funded by NERDS.FARM srl
 *
 *  This program is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 2 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program; if not, write to the Free Software
 *  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
 */
define('WP3D_MODELIMPORT_VERSION', '1.0.0');
define('WP3D_MODELIMPORT_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('WP3D_MODELIMPORT_PLUGIN_URL', plugin_dir_url(__FILE__));
define('WP3D_MODELIMPORT_PLUGIN_FILE', __FILE__);
define('WP3D_MODELIMPORT_PLUGIN_BASE', plugin_basename(__FILE__));


/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
add_action( 'init', function () {
    require_once ABSPATH . 'wp-admin' . DIRECTORY_SEPARATOR . 'includes' . DIRECTORY_SEPARATOR . 'file.php';
    require_once ABSPATH . 'wp-admin' . DIRECTORY_SEPARATOR . 'includes' . DIRECTORY_SEPARATOR . 'class-wp-upgrader.php';
    include_once(__DIR__.DIRECTORY_SEPARATOR.'license.php');
    $license = new \WP3D\License();
    
    if ($license->is_active()) {
        
        register_block_type(__DIR__ . '/build/blocks/modelimport');
        register_block_type( __DIR__ . '/build/blocks/modelimport/points3d/point3d' );

        include_once(__DIR__.DIRECTORY_SEPARATOR.'plugin.php');
        $wp3d = \WP3D\Plugin::instance();
    }
} );

add_action( 'enqueue_block_editor_assets', function () {
    wp_enqueue_style(
        'wp3d-editor-stylesheets',
        WP3D_MODELIMPORT_PLUGIN_URL . 'assets/css/editor.css',
        [],
        filemtime( WP3D_MODELIMPORT_PLUGIN_DIR . 'assets/css/editor.css' ) 
    );
    
} );

// CATEGORY Wp3D
//if (version_compare(get_bloginfo('version'), '5.8', '>=')) {
add_filter('block_categories_all', function ($categories) {
    foreach ($categories as $cat) {
        if ($cat['slug'] == 'wp3d-blocks') {
            return $categories;
        }
    }
    return array_merge(
            [
                [
                    'slug' => 'wp3d-blocks',
                    'title' => __('Wp3D', 'wp3d'),
                ],
            ],
            $categories,
    );
});
/*} else {
    add_filter('block_categories', 'wp3d_blocks_categories');
}*/

//LIB
function wp3d_register_plugin_libs() {
    wp_register_script('nprogress', WP3D_MODELIMPORT_PLUGIN_URL . 'assets/lib/nprogress/nprogress.js', [], '0.2.0', true);
    wp_register_style( 'nprogress', WP3D_MODELIMPORT_PLUGIN_URL . 'assets/lib/nprogress/nprogress.css' );
}
add_action( 'wp_enqueue_scripts', 'wp3d_register_plugin_libs' );
add_action('enqueue_block_editor_assets', 'wp3d_register_plugin_libs');

//Admin STYLES
add_action('admin_enqueue_scripts', function () {
    wp_enqueue_style('wp3dfg-icons', WP3D_MODELIMPORT_PLUGIN_URL . '/assets/css/wp3d-icons.css', false, '1.0.0');
    wp_enqueue_style('wp3d-admin', WP3D_MODELIMPORT_PLUGIN_URL . '/assets/css/admin.css', false, '1.0.0');
});

add_action('wp_enqueue_scripts', 'wp3d_custom_javascript');
add_action('admin_enqueue_scripts', 'wp3d_custom_javascript');
function wp3d_custom_javascript() {
    
    ?>
    <script>
        var wp3d_modelimport_path = "<?php echo WP3D_MODELIMPORT_PLUGIN_URL; ?>";
    </script>
    <?php
}
