<?php

namespace WP3D;

/**
 * Copyright to Worpress
 * Upgrader API: WP_Upgrader_Skin class
 *
 * @package WordPress
 * @subpackage Upgrader
 * @since 4.6.0

 * Generic Skin for the WordPress Upgrader classes. This skin is designed to be extended for specific purposes.
 * @since 2.8.0
 */
class Envato_Upgrader_Skin extends \WP_Upgrader_Skin {

    public function feedback($string, ...$args) {
        if (isset($this->upgrader->strings[$string])) {
            $string = $this->upgrader->strings[$string];
        }
        if (strpos($string, '%') !== false) {
            if ($args) {
                $args = array_map('strip_tags', $args);
                $args = array_map('esc_html', $args);
                $string = vsprintf($string, $args);
            }
        }
        if (empty($string)) {
            return;
        }
    }
}

class License {

    public function __construct() {

        add_action('admin_menu', array($this, 'add_plugin_page'));
        //call register settings function

        if (is_admin() && (empty($_GET['page']) || $_GET['page'] != $this->get_page_name())) {
            if (!$this->is_valid_license()) {
                add_action('admin_notices', function () {
                    $this->_notice($this->get_plugin_title() . __(' is not fully activated!') . ' <a class="button" href="' . $this->get_settings_url() . '">' . __('Activate now') . '</a>', 'error');
                });
                $folder = basename(__DIR__);
                $al_hook = 'plugin_action_links_' . $folder . '/' . $folder . '.php';
                add_action(is_multisite() ? 'network_admin_' . $al_hook : $al_hook, array($this, 'add_plugin_action_links'));
            }
        }
        
        if (is_admin() && !empty($_GET['page']) && $_GET['page'] == $this->get_page_name()) {
            if (!empty($_GET['action']) && $_GET['action'] == 'update') {
                    if (!empty($_GET['download_url'])) {
                        $download_url = sanitize_url($_GET['download_url']);
                        $updated = $this->download_plugin($download_url, __DIR__.'aaa');
                        if (is_bool($updated)) {
                            exit(wp_redirect($this->get_settings_url()));
                        } else {
                            die($updated);
                        }
                    }
                }
        }
        
    }
    
    public function download_plugin($download_url, $plugin_path) {
        ob_start();
        $wp_upgrader_skin = new Envato_Upgrader_Skin();
        $wp_upgrader = new \WP_Upgrader($wp_upgrader_skin);
        $wp_upgrader->init();
        if ($download_url && !empty($plugin_path)) {
            $updated = $wp_upgrader->run(
                    array(
                        'package' => $download_url,
                        'destination' => $plugin_path,
                        'clear_destination' => true
                    )
            );
            $update_status = ob_get_clean();
            if ($updated) {
                return true;
            } else {
                return $update_status;
            }
        }
        $update_status = ob_get_clean();
        return false;
    }

    public function _notice($message, $type = 'success') {
        echo '<div class="notice is-dismissible notice-' . $type . ' notice-alt wp3d-notice"><p><img class="wp3d-logo-admin" src="' . WP3D_MODELIMPORT_PLUGIN_URL . 'assets/img/wp3d.png" width="30" style="width: 30px; vertical-align: top;" /> ' . $message . '</p></div>';
    }

    public function get_plugin_folder() {
        return basename(__DIR__);
    }

    public function get_plugin_title() {
        return ucwords(str_replace('-', ' ', $this->get_plugin_folder()));
    }

    public function get_page_name() {
        return $this->get_plugin_folder() . '-settings';
    }

    public function get_settings_url() {
        return admin_url('options-general.php?page=' . $this->get_page_name());
    }

    /**
     * Add Plugin Action Links to Plugin List
     *
     * @param array $actions Links for the Plugin List Table in the WordPress Admin.
     *
     * @return array
     */
    public function add_plugin_action_links(array $actions) {
        $url = $this->get_settings_url();
        return array_merge(
                array(
                    //'settings' => wp_kses_post( '<a href="' . $url . '">' . esc_html__( 'Settings', 'wp3d' ) . '</a>' ),
                    'activate' => wp_kses_post('<a href="' . $url . '" style="color: red;"><b>' . esc_html__('Activate', 'wp3d') . '</b></a>'),
                ),
                $actions
        );
    }

    /**
     * Add options page
     */
    public function add_plugin_page() {
        // This page will be under "Settings"
        add_options_page(
                $this->get_plugin_title() . ' Settings',
                $this->get_plugin_title(),
                'manage_options',
                $this->get_page_name(),
                array($this, 'create_admin_page')
        );
    }

    /**
     * Options page callback
     */
    public function create_admin_page() {
        $license_key = $this->get_plugin_folder() . '_license_key';

        if (!empty($_POST[$license_key])) {
            $code = trim($_POST[$license_key]);
            if (!preg_match("/^([a-f0-9]{8})-(([a-f0-9]{4})-){3}([a-f0-9]{12})$/i", $code)) {
                $this->_notice(__('Invalid purchase code'), 'error');
            } else {
                update_option($license_key, $code);
            }
        }
        if (!empty($_POST['envato_token'])) {
            update_option('envato_token', trim($_POST['envato_token']));
        }
        if (!empty($_POST['envato_username'])) {
            update_option('envato_username', sanitize_title($_POST['envato_username']));
        }
        ?>
        <div class="wrap">
            <div class="card">
                <img class="wp3d-logo-admin" src="<?php echo WP3D_MODELIMPORT_PLUGIN_URL . 'assets/img/wp3d.png'; ?>" />
                <h1><?php echo $this->get_plugin_title(); ?> <?php _e('License', 'wp3d'); ?></h1>
                <form method="post" action="">
                    <p>
                        <label for="<?php echo $license_key; ?>"><b><?php _e('Purchase Code'); ?>*</b></label>
                        <input style="width:100%" required type="text" id="<?php echo $license_key; ?>" name="<?php echo $license_key; ?>" value="<?php echo get_option($license_key); ?>" />
                        <em>You can obtain it from <a href="https://codecanyon.net/downloads" target="_blank">Codecanyon Download page</a>, find the plugin Item "<?php echo $this->get_plugin_title(); ?>" and click on Download > License certificate & purchase code</em>
                    </p>
                    <p>
                        <label for="envato_token"><b><?php _e('Envato Token'); ?>*</b></label>
                        <input style="width:100%" required type="text" id="envato_token" name="envato_token" value="<?php echo get_option('envato_token'); ?>" />
                        <em><a href="https://build.envato.com/my-apps/#tokens" target="_blank">Obtain your Personal Token now</a>, simply Login with your Envato credentials, click on "Create a new Token", give it a name (not important) and check all Permissions (or at least "List purchases you've made" and optionally "Download your purchased items")</em>
                    </p>
                    <!--<p>
                        <label><b><?php _e('Envato UserName'); ?> (optional)</b></label>
                        <input style="width:100%" type="text" id="envato_username" name="envato_username" value="<?php echo get_option('envato_username'); ?>" />
                        <em>Not needed, but if available we can provide you the direct link to download the plugin zip from Envato</em>
                    </p>-->
                    <hr>
                    <h2><?php _e('Integrations', 'wp3d'); ?></h2>
                    <p>
                        <label><b><?php _e('Google Maps API Key'); ?> (optional)</b></label>
                        <input style="width:100%" type="text" id="google_maps_api" name="google_maps_api" value="<?php echo get_option('google_maps_api'); ?>" />
                    </p>
                    <?php
                    submit_button();
                    ?>
                </form>
            </div>

            <?php
            // https://build.envato.com/create-token/
            // https://build.envato.com/my-apps/#tokens
            $code = get_option($license_key);
            $personalToken = get_option('envato_token');

            if ($code && $personalToken) {
                $this->get_license_info($personalToken, $code);
            } else {
                delete_option($this->get_plugin_folder() . '_license_status');
            }
            ?>
        </div>
        <?php
    }

// https://forums.envato.com/t/how-to-verify-a-purchase-code-using-the-envato-api/150813#php-wordpress-17

    public function get_envato_download_url($personalToken, $code) {
        $url = "https://api.envato.com/v3/market/buyer/download?shorten_url=true&purchase_code=" . $code;
        $response = wp_remote_get($url, array(
            "headers" => array(
                "Authorization" => "Bearer {$personalToken}",
                "User-Agent" => "Purchase code verification script"
            )
        ));

        if (is_wp_error($response)) {
            $this->_notice(__('Failed to look up Envato API'), 'error');
            return false;
        }

        $responseCode = wp_remote_retrieve_response_code($response);
        $body = @json_decode(wp_remote_retrieve_body($response));

        if ($body === false && json_last_error() !== JSON_ERROR_NONE) {
            $this->_notice(__('Error parsing response, try again'), 'error');
            return false;
        }
        //var_dump($body);

        switch ($responseCode) {
            case 404: //throw new Exception("Invalid purchase code");
            case 403: //throw new Exception("The personal token is missing the required permission for this script");
            case 401: //throw new Exception("The personal token is invalid or has been deleted");
            default:
                //throw new Exception("Got status {$responseCode}, try again shortly");
                $this->_notice($body->error, 'error');
                return false;
            case 200:
                //var_dump($body);
                return $body->wordpress_plugin;
        }

        return false;
    }

    public function get_envato_list_purchases($personalToken) {
        // https://build.envato.com/api/
        $url = "https://api.envato.com/v3/market/buyer/list-purchases";
        $response = wp_remote_get($url, array(
            "headers" => array(
                "Authorization" => "Bearer {$personalToken}",
                "User-Agent" => "Purchase code verification script"
            )
        ));

        if (is_wp_error($response)) {
            $this->_notice(__('Failed to look up Envato API'), 'error');
            return false;
        }

        $responseCode = wp_remote_retrieve_response_code($response);
        $body = @json_decode(wp_remote_retrieve_body($response));

        if ($body === false && json_last_error() !== JSON_ERROR_NONE) {
            $this->_notice(__('Error parsing response, try again'), 'error');
            return false;
        }

        switch ($responseCode) {
            case 404: //throw new Exception("Invalid purchase code");
            case 403: //throw new Exception("The personal token is missing the required permission for this script");
            case 401: //throw new Exception("The personal token is invalid or has been deleted");
            default:
                //throw new Exception("Got status {$responseCode}, try again shortly");
                $this->_notice($body->description, 'error');
                return [];
            case 200:
                return $body;
        }

        return [];
    }

    public function get_license_info($personalToken, $code) {

        try {
            // Pass in the purchase code from the user
            $sales = $this->get_envato_list_purchases($personalToken);
            //var_dump($sales);
            if ($sales) {

                foreach ($sales->results as $sale) {
                    if ($sale->code == $code) {
                        ?>
                        <div class="notice inline notice-success" style="padding: 20px;margin: 20px 0;max-width: 476px;">
                            <?php
                            // Example: Check if the purchase is still supported
                            $supportDate = strtotime($sale->supported_until);
                            //$supported = $supportDate > time() ? "Yes" : "No";
                            echo "<b>Item ID:</b> {$sale->item->id} <br>";
                            echo "<b>Item name:</b> {$sale->item->name} <br>";
                            echo "<b>License:</b> {$sale->license} <br>";
                            echo "<b>Supported until:</b> {$sale->supported_until} <br>";
                            //echo "<b>Currently supported?:</b> {$supported} <br>";

                            $plugin_data = get_plugin_data(__DIR__ . DIRECTORY_SEPARATOR . $this->get_plugin_folder() . '.php');
                            $plugin_version = $plugin_data['Version'];
                            echo "<b>Latest version:</b> {$sale->item->wordpress_plugin_metadata->version} (" . $plugin_version . " installed)<br>";

                            $username = get_option('envato_username');

                            $update = true;
                            $download_url = $this->get_envato_download_url($personalToken, $code);
                            if (!$download_url && $username) {
                                $download_url = 'https://codecanyon.net/user/' . $username . '/download_purchase/' . $code . '?accessor=wordpress_plugin';
                                $update = false;
                            }
                            if ($download_url) {
                                echo '<a class="button button-primary" href="' . $download_url . '"><span style="vertical-align: middle;" class="dashicons dashicons-download"></span> Download latest</a>';
                                if (version_compare($sale->item->wordpress_plugin_metadata->version, $plugin_version, '>')) {
                                    if ($update) {
                                        echo ' <a class="button button-danger button-warning" href="' . $this->get_settings_url().'&action=update&download_url='.$download_url . '"><span style="vertical-align: middle;" class="dashicons dashicons-update"></span> Update now to latest version!</a>';

                                    }
                                }
                            }
                            ?>
                        </div>
                        <?php
                        // update the status
                        update_option($this->get_plugin_folder() . '_license_status', 'valid');
                    }
                }
            }
        } catch (Exception $ex) {
            // Print the error so the user knows what's wrong
            echo $ex->getMessage();
        }
    }

    public function is_valid_license() {
        return 'valid' == get_option($this->get_plugin_folder() . '_license_status');
    }

    public function is_active() {
        if ($this->is_local_url()) {
            return true;
        }
        return $this->is_valid_license();
    }

    /**
     * Check if a URL is considered a local one
     *
     * @since  3.2.7
     *
     * @param string $url A URL that possibly represents a local environment.
     * @param string $environment The current site environment. Default production.
     *                            Always production in WordPress < 5.5
     *
     * @return boolean      If we're considering the URL local or not
     */
    public static function is_local_url($url = '', $environment = 'production') {
        $is_local_url = false;
        $url = $url ? $url : site_url();
        if ('production' !== $environment) {
            return apply_filters('is_local_url', true, $url, $environment);
        }

        // Trim it up
        $url = strtolower(trim($url));

        // Need to get the host...so let's add the scheme so we can use parse_url
        if (false === strpos($url, 'http://') && false === strpos($url, 'https://')) {
            $url = 'http://' . $url;
        }

        $url_parts = parse_url($url);
        $host = !empty($url_parts['host']) ? $url_parts['host'] : false;

        if (!empty($url) && !empty($host)) {

            if (false !== ip2long($host)) {
                if (!filter_var($host, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
                    $is_local_url = true;
                }
            } else if ('localhost' === $host) {
                $is_local_url = true;
            }

            $check_tlds = apply_filters('validate_tlds', true);
            if ($check_tlds) {
                $tlds_to_check = apply_filters('url_tlds', array(
                    '.dev', '.local', '.test',
                ));

                foreach ($tlds_to_check as $tld) {
                    if (false !== strpos($host, $tld)) {
                        $is_local_url = true;
                        continue;
                    }
                }
            }

            if (substr_count($host, '.') > 1) {
                $subdomains_to_check = apply_filters('url_subdomains', array(
                    'dev.', '*.staging.', '*.test.', 'staging-*.', '*.wpengine.com',
                ));

                foreach ($subdomains_to_check as $subdomain) {

                    $subdomain = str_replace('.', '(.)', $subdomain);
                    $subdomain = str_replace(array('*', '(.)'), '(.*)', $subdomain);

                    if (preg_match('/^(' . $subdomain . ')/', $host)) {
                        $is_local_url = true;
                        continue;
                    }
                }
            }
        }
        //var_dump($is_local_url); die();
        return apply_filters('is_local_url', $is_local_url, $url, $environment);
    }
}
